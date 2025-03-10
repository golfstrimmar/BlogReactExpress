import React, { useEffect, useState } from "react";
import "./Post.scss";
import { ReactComponent as Like } from "../../assets/svg/like.svg";
import { useSelector, useDispatch } from "react-redux";
import { editPost, deletePost } from "../../redux/actions/postActions";
import { deleteComment } from "../../redux/actions/commentActions";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as Edit } from "../../assets/svg/edit.svg";
import { ReactComponent as Delit } from "../../assets/svg/cross.svg";
import { ReactComponent as Comment } from "../../assets/svg/comment.svg";
import ModalMessage from "../ModalMessage/ModalMessage";
// ============================

// ============================
interface PostProps {
  imageUrl: string;
  userName: string;
  title: string;
  tags: string[];
  positiveLikes: number;
  negativeLikes: number;
  viewsCount: number;
  createdAt: string;
}
interface User {
  _id?: string;
  userName?: string;
}

interface SocketData {
  post: Post;
  message: string;
  error?: string; // Опциональное поле для ошибок
}
const Post: React.FC<PostProps> = ({ post, fullText }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user as User);
  const socket = useSelector((state: any) => state.socket.socket as SocketData);
  const navigate = useNavigate();
};

export default Post;
