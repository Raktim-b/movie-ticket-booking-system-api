const userModel = require("../model/userModel");
const httpStatusCode = require("../utils/httpStatusCode");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const emailVerificationModel = require("../model/otpModel");
const sendEmail = require("../utils/sendEmail");
const roleModel = require("../model/roleModel");
const logger = require("../utils/logger");

class AuthController {
  async createRole(req, res) {
    try {
      const { role } = req.body;
      logger.debug("Create role request received: %s", role);
      const existingRole = await roleModel.findOne({ role });

      if (existingRole) {
        logger.warn("Role already exists: %s", role);
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Role already exists",
        });
      }

      const data = new roleModel({
        role,
      });

      const result = await data.save();
      logger.info("Role created successfully: %s", role);
      return res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "Role created successfully",
        data: result,
      });
    } catch (error) {
      logger.error("Error creating role: %s", error.stack);
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async registerUser(req, res) {
    try {
      const { name, email, password, phone } = req.body;

      logger.debug("User registration request received for email: %s", email);

      if (!name || !email || !password || !phone) {
        logger.warn("User registration failed: Missing required fields");

        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "All fields are required",
        });
      }

      const existUser = await userModel.findOne({ email });

      if (existUser) {
        logger.warn(
          "User registration failed: Email already exists (%s)",
          email,
        );

        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "User already exists",
        });
      }

      const userRole = await roleModel.findOne({
        role: "user",
      });

      if (!userRole) {
        logger.error("User registration failed: 'user' role not found");

        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "User role not found",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const userData = new userModel({
        name,
        email,
        password: hashPassword,
        phone,
        roleId: userRole._id,
      });

      const result = await userData.save();

      logger.info("User registered successfully: %s", email);

      await sendEmail(req, result);

      logger.info("Verification email sent to: %s", email);

      return res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "User Added successfully",
        data: result,
      });
    } catch (error) {
      logger.error("Error while registering user: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async registerAdmin(req, res) {
    try {
      const { name, email, password, phone } = req.body;
      logger.debug("User registration request received for email: %s", email);
      if (!name || !email || !password || !phone) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "All fields are required",
        });
      }
      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "user already exist",
        });
      }
      const userRole = await roleModel.findOne({
        role: "admin",
      });
      if (!userRole) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "User role not found",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const userData = new userModel({
        name,
        email,
        password: hashPassword,
        phone,
        roleId: userRole._id,
      });
      const result = await userData.save();
      await sendEmail(req, result);
      if (result) {
        return res.status(httpStatusCode.CREATED).json({
          success: true,
          message: "User Added successfully",
          data: result,
        });
      }
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const checkUser = await userModel.aggregate([
        {
          $match: {
            email: email,
          },
        },
        {
          $lookup: {
            from: "roles",
            localField: "roleId",
            foreignField: "_id",
            as: "role",
          },
        },
        {
          $unwind: "$role",
        },
      ]);
      if (checkUser.length === 0) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "invalid credential",
        });
      }
      const user = checkUser[0];
      const checkPassowrd = await bcrypt.compare(password, user.password);
      if (!checkPassowrd) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "wrong password",
        });
      }
      if (!user.isVarified) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "User not varified",
        });
      }

      const accessToken = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "5m" },
      );
      const refreshToken = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role.role,
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" },
      );
      await userModel.findByIdAndUpdate(user._id, {
        refreshToken,
      });
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "User Logedin Successfully",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role.role,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async refreshToken(req, res) {
    try {
      const refreshToken = req.headers["refresh-token"];
      if (!refreshToken) {
        return res.status(httpStatusCode.UNAUTHORIZED).json({
          success: false,
          message: "Refresh token missing",
        });
      }
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await userModel.findById(decoded.id);
      if (!user) {
        return res.status(httpStatusCode.UNAUTHORIZED).json({
          success: false,
          message: "User not found",
        });
      }
      if (user.refreshToken !== refreshToken) {
        return res.status(httpStatusCode.UNAUTHORIZED).json({
          success: false,
          message: "Invalid refresh token",
        });
      }
      const newAccessToken = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "5m",
        },
      );
      return res.status(httpStatusCode.OK).json({
        success: true,
        data: {
          name: user.name,
          email: user.email,
          newAccessToken: newAccessToken,
        },
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async verify(req, res) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          message: "All fields are required",
        });
      }
      const checkUser = await userModel.findOne({ email });
      if (!checkUser) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "invalid credential",
        });
      }
      if (checkUser.isVarified) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "User already varified",
        });
      }
      const emailVerification = await emailVerificationModel.findOne({
        userId: checkUser._id,
        otp,
      });
      if (!emailVerification) {
        if (!checkUser.isVarified) {
          await sendEmail(req, checkUser);
          return res.status(httpStatusCode.BAD_REQUEST).json({
            status: false,
            message: "Invalid OTP, new OTP sent to your email",
          });
        }
        return res
          .status(httpStatusCode.BAD_REQUEST)
          .json({ status: false, message: "Invalid OTP" });
      }
      const currentTime = new Date();
      const expireTime = new Date(
        emailVerification.createdAt.getTime() + 15 * 60 * 1000,
      );
      if (currentTime > expireTime) {
        await sendEmail(req, checkUser);
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: "failed",
          message: "OTP expired, new OTP sent to your email",
        });
      }
      checkUser.isVarified = true;
      await checkUser.save();
      await emailVerificationModel.deleteMany({ userId: checkUser._id });
      return res
        .status(httpStatusCode.OK)
        .json({ status: true, message: "Email verified successfully" });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}
module.exports = new AuthController();
