const bookModel = require("../model/bookingModel");
const httpStatusCode = require("../utils/httpStatusCode");
const logger = require("../utils/logger");

class ReportController {
  async totalBookingPerMovie(req, res) {
    try {
      const result = await bookModel.aggregate([
        {
          $lookup: {
            from: "movies",
            localField: "movieId",
            foreignField: "_id",
            as: "movie",
          },
        },
        {
          $group: {
            _id: "$movie.movieName",
            totalBooking: { $sum: "$numberOfTickets" },
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
  async totalBookingPerTheater(req, res) {
    try {
      const result = await bookModel.aggregate([
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
          $group: {
            _id: {
              theaterId: "$theater.theaterName",
              showTime: "$showTime",
              movieName: "$movie.movieName",
            },
            totalTicketsBooked: {
              $sum: "$numberOfTickets",
            },
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
module.exports = new ReportController();
