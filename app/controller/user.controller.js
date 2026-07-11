const userModel = require("../model/userModel");
const httpStatusCode = require("../utils/httpStatusCode");

class UserController {
  async getProfile(req, res) {
    try {
      const user = await userModel.findById(req.user.id);

      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }

      const userData = await userModel.aggregate([
        {
          $match: {
            _id: user._id,
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

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Profile fetched successfully",
        data: userData[0],
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async updateProfile(req, res) {
    try {
      const user = await userModel.findById(req.user.id);

      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }
      const { name, phone } = req.body;

      const updateObj = {};

      if (name) updateObj.name = name;
      if (phone) updateObj.phone = phone;

      //   if (req.file) {
      //     if (user.public_id) {
      //       await cloudinary.uploader.destroy(user.public_id);
      //     }

      //     updateObj.avatar = req.file.path;
      //     updateObj.public_id = req.file.filename;
      //   }

      const updatedUser = await userModel.findByIdAndUpdate(
        req.user.id,
        updateObj,
        {
          new: true,
        },
      );
      const userData = await userModel.aggregate([
        {
          $match: {
            _id: user._id,
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
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Profile updated successfully",
        message: "Profile fetched successfully",
        data: userData[0],
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new UserController();
