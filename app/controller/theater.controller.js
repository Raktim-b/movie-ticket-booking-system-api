const movieModel = require("../model/movieModel");
const showModel = require("../model/showModel");
const theaterModel = require("../model/theaterModel");
const httpStatusCode = require("../utils/httpStatusCode");
const logger = require("../utils/logger");

class TheaterController {
  async createTheater(req, res) {
    try {
      const { theaterName, location, numberOfScreens } = req.body;

      logger.debug("Theater added request received for name: %s", theaterName);

      if (!theaterName || !location || !numberOfScreens) {
        logger.warn("Theater added request failed: Missing required fields");

        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "All fields are required",
        });
      }

      const existTheater = await theaterModel.findOne({ theaterName });

      if (existTheater) {
        logger.warn(
          "Movie added request failed: Movie already exists (%s)",
          theaterName,
        );

        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Movie already exists",
        });
      }

      const theaterData = new theaterModel({
        theaterName,
        location,
        numberOfScreens,
      });

      const result = await theaterData.save();

      logger.info("Theater Added successfully: %s", theaterName);
      return res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "Theater Added successfully",
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
  async getTheater(req, res) {
    try {
      const theaterData = await theaterModel.find({ isDeleted: false });
      if (!theaterData) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Theater not found",
        });
      }
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Theater fetched successfully",
        data: theaterData,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async assignMovieToTheater(req, res) {
    try {
      const { theaterId, movieId, screenNumber, showTimings } = req.body;

      logger.debug(
        "Assign movie request received. Theater: %s, Movie: %s",
        theaterId,
        movieId,
      );

      if (!theaterId || !movieId || !screenNumber || !showTimings) {
        logger.warn("Assign movie failed: Missing required fields");

        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "All fields are required",
        });
      }

      const theater = await theaterModel.findById(theaterId);

      if (!theater) {
        logger.warn("Theater not found: %s", theaterId);

        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Theater not found",
        });
      }

      const movie = await movieModel.findById(movieId);

      if (!movie) {
        logger.warn("Movie not found: %s", movieId);

        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Movie not found",
        });
      }

      if (screenNumber < 1 || screenNumber > theater.numberOfScreens) {
        logger.warn(
          "Invalid screen number %d for theater %s",
          screenNumber,
          theater.theaterName,
        );

        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Invalid screen number",
        });
      }

      const existingShow = await showModel.findOne({
        theaterId,
        screenNumber,
        movieId,
        isDeleted: false,
      });

      if (existingShow) {
        logger.warn(
          "Movie already assigned to this screen. Theater: %s Screen: %d",
          theater.theaterName,
          screenNumber,
        );

        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Movie already assigned to this screen",
        });
      }

      const show = new showModel({
        theaterId,
        movieId,
        screenNumber,
        showTimings,
      });

      const result = await show.save();

      logger.info(
        "Movie assigned successfully. Theater: %s Movie: %s Screen: %d",
        theater.theaterName,
        movie.movieName,
        screenNumber,
      );

      return res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "Movie assigned successfully",
        data: result,
      });
    } catch (error) {
      logger.error("Error assigning movie: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  
}

module.exports = new TheaterController();
