import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    avatar: { type: String },
    googleId: { type: String, unique: true }, 
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema, "users");
export default User;
