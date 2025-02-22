// models/Comment.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
