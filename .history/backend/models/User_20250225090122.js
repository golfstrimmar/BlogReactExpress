import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    avatar: { type: String },
    googleId: {
      type: String,
      unique: false, // Убираем уникальность на уровне схемы
      sparse: true,
      default: null,
    },
  },
  { timestamps: true }
);

// Создаем индекс с условием для googleId
userSchema.index(
  { googleId: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { googleId: { $ne: null } },
  }
);

const User = mongoose.model("User", userSchema);
export default User;
