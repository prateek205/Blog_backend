import express from "express";
import {
  delUser,
  getAllUser,
  getUserById,
  login,
  profile,
  register,
  updateUser,
} from "../Controller/userController.js";
import { protectedRoute } from "../Middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/profile", protectedRoute, profile);

router.get("/getAllUser", getAllUser);
router.get("/getUserById/:id", getUserById);
router.post("/register", register);
router.post("/login", login);
router.put("/updateUser/:id", updateUser);
router.delete("/userDel/:id", delUser);
export default router;
