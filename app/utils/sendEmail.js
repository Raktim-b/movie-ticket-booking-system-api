const transporter = require("../config/emailVerify");
const emailVerificationModel = require("../model/otpModel");

const sendEmail = async (req, user) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const getOtp = await new emailVerificationModel({
    userId: user._id,
    otp: otp,
  }).save();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Verify Your Email Address – OTP Verification",
    text: "",
    html: ` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 10px; background-color: #ffffff;"> <div style="text-align: center; padding-bottom: 20px;"> <h1 style="color: #1a1a1a; margin: 0;">Email Verification</h1> <p style="color: #666; font-size: 14px;"> Secure One-Time Password (OTP) </p> </div> <p style="font-size: 16px; color: #333;"> Dear ${user.name}, </p> <p style="font-size: 15px; color: #555; line-height: 1.6;"> Thank you for registering with us. To complete your account verification, please use the One-Time Password (OTP) below: </p> <div style="text-align: center; margin: 30px 0;"> <span style=" display: inline-block; background-color: #2563eb; color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: 6px; padding: 14px 30px; border-radius: 8px; "> ${otp} </span> </div> <p style="font-size: 15px; color: #555; line-height: 1.6;"> This OTP is valid for <strong>15 minutes</strong>. Please do not share this code with anyone for security reasons. </p> <p style="font-size: 15px; color: #555; line-height: 1.6;"> If you did not request this verification, you can safely ignore this email. </p> <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;" /> <p style="font-size: 13px; color: #888; text-align: center;"> © 2026 Your Company Name. All rights reserved. </p> </div>`,
  });
  return otp;
};
module.exports = sendEmail;
