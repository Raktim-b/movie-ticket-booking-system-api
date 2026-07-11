const express = require("express");
const authRouter = require("./auth.routes");
const userRouter = require("./user.routes");
const movieRouter = require("./movie.routes");
const theaterRouter = require("./theater.routes");
const bookRouter = require("./book.routes");
const reportRouter = require("./report.routes");

const router = express.Router();
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/movie", movieRouter);
router.use("/theater", theaterRouter);
router.use("/", bookRouter);
router.use("/report", reportRouter);

module.exports = router;
