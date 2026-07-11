const express = require("express");
const AuthCheck = require("../middleware/auth");
const userController = require("../controller/user.controller");
const userRouter = express.Router();


userRouter.get("/profile", AuthCheck, userController.getProfile);
userRouter.get("/update", AuthCheck, userController.updateProfile);

module.exports = userRouter;
