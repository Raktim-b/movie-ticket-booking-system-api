const express = require("express");
const AuthCheck = require("../middleware/auth");
const allowRoles = require("../middleware/allowRoles");
const movieController = require("../controller/movie.controller");
const movieRouter = express.Router();

movieRouter.post(
  "/create",
  AuthCheck,
  allowRoles("admin"),
  movieController.createMovie,
);
movieRouter.get(
  "/get",
  AuthCheck,
  allowRoles("admin", "user"),
  movieController.getMovies,
);
movieRouter.get(
  "/get/:id",
  AuthCheck,
  allowRoles("admin", "user"),
  movieController.getMoviesById,
);
movieRouter.put(
  "/edit/:id",
  AuthCheck,
  allowRoles("admin"),
  movieController.updateMovie,
);
movieRouter.delete(
  "/delete/:id",
  AuthCheck,
  allowRoles("admin"),
  movieController.deleteMovie,
);
movieRouter.get(
  "/getDeleted",
  AuthCheck,
  allowRoles("admin"),
  movieController.getDeletedMovies,
);
movieRouter.patch(
  "/recover/:id",
  AuthCheck,
  allowRoles("admin"),
  movieController.recoverMovie,
);

module.exports = movieRouter;
