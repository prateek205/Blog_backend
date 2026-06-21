import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password should be atleast 6 characters"],
    },
    bio:{
      type:String,
      maxLength:300,
    },
    profilePic:{
      type:String,
      default:""
    }
  },
  {
    timestamps: true,
  },
);

const Users = mongoose.model("Users", userSchema);

export default Users;
