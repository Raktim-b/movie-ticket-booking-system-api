const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    roleId: {
      type: Schema.ObjectId,
      ref: "role",
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    isVarified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);
const userModel = mongoose.model("user", UserSchema);
module.exports = userModel;
