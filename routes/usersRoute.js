import express from "express";
const router = express.Router();
import UserController from "../controllers/users.js";
import checkUserAuth from "../middlewares/user_middleware.js";

// Create Route level protect middleware route
router.use("/loggedUser", checkUserAuth);
router.use("/changePassword", checkUserAuth);

// Create Public Route
router.post("/register", UserController.userRegistration);
router.post("/login", UserController.userLogin);
router.post(
  "/send-email-reset-password",
  UserController.sendPasswordChangeMail
);
router.post("/reset-password/:id/:token", UserController.passwordReset);

// Create Protected/ Private Route
router.get("/loggedUser", UserController.loggedUser);
router.post("/changePassword", UserController.changeUserPassword);

export default router;
