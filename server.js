import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./Config/db.js";
import blogRoutes from "./Routes/blogRoute.js";
import userRoutes from "./Routes/userRoute.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://blog-frontend-kkeo.onrender.com"],
    credentials: true,
  }),
);
connectDb();

app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/user", userRoutes);

const SERVER_PORT = process.env.PORT;
app.listen(SERVER_PORT, () => {
  console.log(`The Server is running on http://localhost:${SERVER_PORT}`);
});
