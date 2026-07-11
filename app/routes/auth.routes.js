const express = require("express");
const authController = require("../controller/auth.controller");
const AuthCheck = require("../middleware/auth");
const authRouter = express.Router();

authRouter.post("/role/create", authController.createRole);
authRouter.post("/user/register", authController.registerUser);
authRouter.post("/admin/register", authController.registerAdmin);
authRouter.post("/login", authController.login);
authRouter.post("/refresh-token", authController.refreshToken);
authRouter.post("/verify", authController.verify);

module.exports = authRouter;
