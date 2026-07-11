const express = require("express");
const AuthCheck = require("../middleware/auth");
const allowRoles = require("../middleware/allowRoles");
const bookingController = require("../controller/booking.controller");
const bookRouter = express.Router();

bookRouter.post("/book", AuthCheck, bookingController.booking);
bookRouter.post("/book/cancel/:bookingId", AuthCheck, bookingController.cancelBooking);
bookRouter.get("/book/get", AuthCheck, bookingController.bookingHistory);

module.exports = bookRouter;
