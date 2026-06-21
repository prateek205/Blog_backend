import express from "express";
import {
  delUser,
  getAllUser,
  getUserById,
  login,
  logout,
  profile,
  register,
  updateProfile,
  updateUser,
} from "../Controller/userController.js";
import { protectedRoute } from "../Middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/profile", protectedRoute, profile);
router.put("/updateUser", protectedRoute, updateProfile);

router.get("/getAllUser", getAllUser);
router.get("/getUserById/:id", getUserById);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout)
router.put("/updateUser/:id", updateUser);
router.delete("/userDel/:id", delUser);
export default router;
