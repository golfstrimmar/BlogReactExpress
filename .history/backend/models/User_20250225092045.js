import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    avatar: { type: String },
    googleId: {
      type: String,
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
    partialFilterExpression: { googleId: { $type: "string" } },
  }
);


const User = mongoose.model("User", userSchema);
export default User;
