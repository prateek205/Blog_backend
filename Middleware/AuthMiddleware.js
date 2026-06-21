import jwt from "jsonwebtoken";
import Users from "../Model/userModel.js";

export const protectedRoute = async (req, res, next) => {
  const JWT_TOKEN_KEY = process.env.JWT_SECRET_KEY;

  try {
    console.log("Cookies:", req.cookies);
    // const authUser = req.headers.authorization;
    const token = req.cookies.authToken;

    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
        user: null,
      });
    }

    // const token = authUser.split(" ")[1];

    const decode = jwt.verify(token, JWT_TOKEN_KEY);

    console.log("Decoded:", decode);

    req.users = decode;
    console.log("USER:", req.users);

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
