const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bookSchema = new Schema(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      ref: "movie",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    theaterId: {
      type: Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },
    showTime: {
      type: Date,
      required: true,
    },

    numberOfTickets: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  },
);
const bookModel = mongoose.model("Book", bookSchema);
module.exports = bookModel;
