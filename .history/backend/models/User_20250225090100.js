import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    avatar: { type: String },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
  },
  { timestamps: true }
);
userSchema.index(
  { googleId: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { googleId: { $ne: null } },
  }
const User = mongoose.model("User", userSchema, "users");
export default User;
