const express = require("express");
const AuthCheck = require("../middleware/auth");
const allowRoles = require("../middleware/allowRoles");
const reportController = require("../controller/report.controller");
const reportRouter = express.Router();

reportRouter.get(
  "/totalbooking/movie",
  AuthCheck,
  allowRoles("admin"),
  reportController.totalBookingPerMovie,
);
reportRouter.get(
  "/totalbooking/theater",
  AuthCheck,
  allowRoles("admin"),
  reportController.totalBookingPerTheater,
);
module.exports = reportRouter;
