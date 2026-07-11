const express = require("express");
const AuthCheck = require("../middleware/auth");
const allowRoles = require("../middleware/allowRoles");
const theaterController = require("../controller/theater.controller");
const theaterRouter = express.Router();

theaterRouter.post(
  "/create",
  AuthCheck,
  allowRoles("admin"),
  theaterController.createTheater,
);
theaterRouter.get(
  "/get",
  AuthCheck,
  allowRoles("admin"),
  theaterController.getTheater,
);
theaterRouter.post(
  "/assign",
  AuthCheck,
  allowRoles("admin"),
  theaterController.assignMovieToTheater,
);

module.exports = theaterRouter;
