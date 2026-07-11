const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const emailVerificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "15m",
  },
});
const emailVerificationModel = mongoose.model(
  "emailVerification",
  emailVerificationSchema,
);
module.exports = emailVerificationModel;
