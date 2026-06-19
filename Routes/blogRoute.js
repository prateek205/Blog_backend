import express from "express";
import {
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogs,
  updateBlog,
} from "../Controller/blogController.js";
import upload from "../Middleware/Multer.js";
import { protectedRoute } from "../Middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/getAllBlogs", getBlogs);
router.get("/getBlogById/:id", getBlogById);
router.post(
  "/createBlog",
  protectedRoute,
  upload.array("images", 6),
  createBlog,
);
router.put(
  "/updateBlog/:id",
  protectedRoute,
  upload.array("images", 6),
  updateBlog,
);
router.delete("/delBlog/:id", protectedRoute, deleteBlog);

export default router;
