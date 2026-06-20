import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../Model/userModel.js";

const JWT_TOKEN = process.env.JWT_SECRET_KEY;

// REGISTER USER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required..." });
    }

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const users = Users({ name, email, password: hashedPassword });
    await users.save();
    res.status(201).json({
      success: true,
      message: "User Created Successfully!!!",
      user: users,
      password: hashedPassword,
    });
  } catch (error) {
    console.log("internal server error", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// LOGIN USER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await Users.findOne({ email });
    if (!userExist) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "invalid credentials" });
    }

    const token = jwt.sign({ id: userExist._id }, JWT_TOKEN, {
      expiresIn: "1d",
    });

    res.cookie("authToken", token, {
      httpOnly:true,
      maxAge:86400000,
      secure:false,
      sameSite:"lax"
    });

    res.status(200).json({
      success: true,
      message: "User login successfully!!!",
      token: token,
      user: userExist,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET ALL USERS
export const getAllUser = async (req, res) => {
  try {
    const users = await Users.find({});
    res.status(200).json({ success: true, counts: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET USER BY ID
export const getUserById = async (req, res) => {
  try {
    const users = await Users.findById(req.params.id);
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params.id;
    const users = await Users.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ success: true, message: "update successfully", user: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE USER
export const delUser = async (req, res) => {
  try {
    const { id } = req.params.id;
    const delUsers = await Users.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "user deleted successfully!!!",
      user: delUsers,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// USER PROFILE

export const profile = (req, res) => {
  try {
    res.status(200).json({ success: true, userId: req.userExist.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
