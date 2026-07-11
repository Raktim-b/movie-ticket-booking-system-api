const { default: mongoose } = require("mongoose");
const movieModel = require("../model/movieModel");
const httpStatusCode = require("../utils/httpStatusCode");
const logger = require("../utils/logger");

class MovieController {
  async createMovie(req, res) {
    try {
      const {
        movieName,
        genre,
        language,
        duration,
        cast,
        director,
        releaseDate,
      } = req.body;

      logger.debug("Movie added request received for name: %s", movieName);

      if (
        !movieName ||
        !genre ||
        !language ||
        !duration ||
        !cast ||
        !director ||
        !releaseDate
      ) {
        logger.warn("Movie added request failed: Missing required fields");

        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "All fields are required",
        });
      }

      const existMovie = await movieModel.findOne({ movieName });

      if (existMovie) {
        logger.warn(
          "Movie added request failed: Movie already exists (%s)",
          movieName,
        );

        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Movie already exists",
        });
      }

      const movieData = new movieModel({
        movieName,
        genre,
        language,
        duration,
        cast,
        director,
        releaseDate,
      });

      const result = await movieData.save();

      logger.info("Movie Added successfully: %s", movieName);
      return res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "Movie Added successfully",
        data: result,
      });
    } catch (error) {
      logger.error("Error while adding movie: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  // async getMovies(req, res) {
  //   try {
  //     const movieData = await movieModel.find({ isDeleted: false });
  //     if (!movieData) {
  //       return res.status(httpStatusCode.NOT_FOUND).json({
  //         success: false,
  //         message: "Movie not found",
  //       });
  //     }
  //     return res.status(httpStatusCode.OK).json({
  //       success: true,
  //       message: "Movie fetched successfully",
  //       data: movieData,
  //     });
  //   } catch (error) {
  //     return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
  //       success: false,
  //       message: error.message,
  //     });
  //   }
  // }
  async updateMovie(req, res) {
    try {
      const { id } = req.params;
      const movie = await movieModel.findById(id);

      if (!movie) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Movie not found",
        });
      }

      //   if (req.file) {
      //     if (user.public_id) {
      //       await cloudinary.uploader.destroy(user.public_id);
      //     }

      //     updateObj.avatar = req.file.path;
      //     updateObj.public_id = req.file.filename;
      //   }

      const updatedMovie = await movieModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Movie updated successfully",
        data: updatedMovie,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async deleteMovie(req, res) {
    try {
      const { id } = req.params;
      const movie = await movieModel.findById(id);

      if (!movie) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Movie not found",
        });
      }

      //   if (req.file) {
      //     if (user.public_id) {
      //       await cloudinary.uploader.destroy(user.public_id);
      //     }

      //     updateObj.avatar = req.file.path;
      //     updateObj.public_id = req.file.filename;
      //   }

      const deletedMovie = await movieModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        {
          new: true,
        },
      );
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Movie deleted successfully",
        data: deletedMovie,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getDeletedMovies(req, res) {
    try {
      const movieData = await movieModel.find({ isDeleted: true });
      if (!movieData) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Movie not found",
        });
      }
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Movie fetched successfully",
        data: movieData,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async recoverMovie(req, res) {
    try {
      const { id } = req.params;
      const movie = await movieModel.findById(id);

      if (!movie) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Movie not found",
        });
      }

      //   if (req.file) {
      //     if (user.public_id) {
      //       await cloudinary.uploader.destroy(user.public_id);
      //     }

      //     updateObj.avatar = req.file.path;
      //     updateObj.public_id = req.file.filename;
      //   }

      const recoveredMovie = await movieModel.findByIdAndUpdate(
        id,
        { isDeleted: false },
        {
          new: true,
        },
      );
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Movie recovered successfully",
        data: recoveredMovie,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getMovies(req, res) {
    try {
      const result = await movieModel.aggregate([
        {
          $lookup: {
            from: "shows",
            localField: "_id",
            foreignField: "movieId",
            as: "shows",
          },
        },
        {
          $lookup: {
            from: "theaters",
            localField: "shows.theaterId",
            foreignField: "_id",
            as: "theaters",
          },
        },
        {
          $project: {
            movieName: 1,
            totalTheaters: { $size: "$theaters" },
            theaters: "$theaters.theaterName",
            showTimings: "$shows.showTimings",
          },
        },
      ]);

      return res.status(httpStatusCode.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getMoviesById(req, res) {
    try {
      const { id } = req.params;
      const result = await movieModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "shows",
            localField: "_id",
            foreignField: "movieId",
            as: "shows",
          },
        },
        {
          $lookup: {
            from: "theaters",
            localField: "shows.theaterId",
            foreignField: "_id",
            as: "theaters",
          },
        },
        {
          $project: {
            movieName: 1,
            theaters: "$theaters.theaterName",
            showTimings: "$shows.showTimings",
          },
        },
      ]);

      return res.status(httpStatusCode.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new MovieController();
