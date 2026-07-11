const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MovieSchema = new Schema(
  {
    movieName: {
      type: String,
      required: true,
    },

    genre: {
      type: String,
      required: true,
      enum: [
        "Action",
        "Comedy",
        "Drama",
        "Horror",
        "Thriller",
        "Sci-Fi",
        "Romance",
        "Animation",
        "Adventure",
      ],
    },

    language: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    cast: [
      {
        type: String,
      },
    ],

    director: {
      type: String,
      required: true,
    },

    releaseDate: {
      type: Date,
      required: true,
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
const movieModel = mongoose.model("movie", MovieSchema);
module.exports = movieModel;
