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
const Post: React.FC<PostProps> = ({ post, fullText }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
};

export default Post;
