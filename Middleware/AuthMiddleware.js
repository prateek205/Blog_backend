import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
  const JWT_TOKEN_KEY = process.env.JWT_SECRET_KEY;

  try {
    const authUser = req.headers.authorization;

    if (!authUser || !authUser.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "unAuthorised user" });
    }

    const token = authUser.split(" ")[1];

    const decode = jwt.verify(token, JWT_TOKEN_KEY);

    req.users = decode;
    console.log("USER:",req.users)

    next();
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
