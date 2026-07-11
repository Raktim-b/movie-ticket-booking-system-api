const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const showSchema = new Schema(
  {
    theaterId: {
      type: Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },

    movieId: {
      type: Schema.Types.ObjectId,
      ref: "movie",
      required: true,
    },

    screenNumber: {
      type: Number,
      required: true,
    },

    showTimings: [
      {
        time: {
          type: Date,
          required: true,
        },
        availableSeats: {
          type: Number,
          default: 150,
        },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const showModel = mongoose.model("Show", showSchema);
module.exports = showModel;
