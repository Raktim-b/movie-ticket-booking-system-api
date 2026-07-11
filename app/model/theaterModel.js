const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const theaterSchema = new Schema(
  {
    theaterName: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
    },

    numberOfScreens: {
      type: Number,
      required: true,
      min: 1,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
const theaterModel = mongoose.model("Theater", theaterSchema);
module.exports = theaterModel;
