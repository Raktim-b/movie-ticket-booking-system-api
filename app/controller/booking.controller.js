const { default: mongoose } = require("mongoose");
const bookModel = require("../model/bookingModel");
const movieModel = require("../model/movieModel");
const showModel = require("../model/showModel");
const theaterModel = require("../model/theaterModel");
const httpStatusCode = require("../utils/httpStatusCode");
const logger = require("../utils/logger");
const userModel = require("../model/userModel");
const sendBookingDetails = require("../utils/sendBookingDetails");

class BookingController {
  async booking(req, res) {
    try {
      const { movieId, theaterId, showTime, numberOfTickets } = req.body;

      logger.debug("Booking request received for movieId: %s", movieId);

      if (!movieId || !theaterId || !showTime || !numberOfTickets) {
        logger.warn("Booking request failed: Missing required fields");

        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "All fields are required",
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

      const theater = await theaterModel.findById(theaterId);

      if (!theater) {
        logger.warn("Theater not found: %s", theaterId);

        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Theater not found",
        });
      }

      const show = await showModel.findOne({
        movieId,
        theaterId,
        isDeleted: false,
      });

      if (!show) {
        logger.warn("Show not found");

        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Show not found",
        });
      }

      const timing = show.showTimings.find(
        (item) =>
          new Date(item.time).getTime() === new Date(showTime).getTime(),
      );

      if (!timing) {
        logger.warn("Invalid show timing");

        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Invalid show timing",
        });
      }

      if (timing.availableSeats < numberOfTickets) {
        logger.warn("Seats not available");

        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Seats not available",
        });
      }

      timing.availableSeats -= numberOfTickets;

      await show.save();

      const bookData = new bookModel({
        movieId,
        theaterId,
        userId: req.user.id,
        showTime,
        numberOfTickets,
      });

      const result = await bookData.save();

      const user = await userModel.findById(req.user.id);

      const bookings = await bookModel.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(req.user.id),
          },
        },
        {
          $lookup: {
            from: "movies",
            localField: "movieId",
            foreignField: "_id",
            as: "movie",
          },
        },
        {
          $unwind: "$movie",
        },
        {
          $lookup: {
            from: "theaters",
            localField: "theaterId",
            foreignField: "_id",
            as: "theater",
          },
        },
        {
          $unwind: "$theater",
        },
      ]);
      await sendBookingDetails(user, bookings);

      logger.info(
        "Booking successful for movie %s by user %s",
        movie.movieName,
        req.user.id,
      );

      return res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "Booking successful",
        data: result,
      });
    } catch (error) {
      logger.error("Error while booking movie: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async cancelBooking(req, res) {
    try {
      const { bookingId } = req.params;

      logger.debug("Cancel booking request received: %s", bookingId);

      const booking = await bookModel.findById(bookingId);

      if (!booking) {
        logger.warn("Booking not found: %s", bookingId);

        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Booking not found",
        });
      }

      const show = await showModel.findOne({
        movieId: booking.movieId,
        theaterId: booking.theaterId,
        isDeleted: false,
      });

      if (!show) {
        logger.warn("Show not found");

        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Show not found",
        });
      }

      const timing = show.showTimings.find(
        (item) => item.time.getTime() === new Date(booking.showTime).getTime(),
      );

      if (!timing) {
        logger.warn("Show timing not found");

        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Show timing not found",
        });
      }

      timing.availableSeats += booking.numberOfTickets;

      await show.save();

      await bookModel.findByIdAndDelete(bookingId);

      logger.info("Booking cancelled successfully: %s", bookingId);

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Booking cancelled successfully",
      });
    } catch (error) {
      logger.error("Error while cancelling booking: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async bookingHistory(req, res) {
    try {
      const id = req.user.id;
      const result = await bookModel.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "movies",
            localField: "movieId",
            foreignField: "_id",
            as: "movie",
          },
        },
        {
          $unwind: "$movie",
        },
        {
          $lookup: {
            from: "theaters",
            localField: "theaterId",
            foreignField: "_id",
            as: "theater",
          },
        },
        {
          $unwind: "$theater",
        },
        {
          $project: {
            _id: 1,
            movieName: "$movie.movieName",
            theaterName: "$theater.theaterName",
            location: "$theater.location",
            showTime: 1,
            numberOfTickets: 1,
            createdAt: 1,
          },
        },
      ]);

      return res.status(httpStatusCode.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Error while fetching booking history: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}
module.exports = new BookingController();
