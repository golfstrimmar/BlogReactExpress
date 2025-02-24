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
  _id: string;
  imageUrl: string;
  userName: string;
  title: string;
  tags: string[];
  positiveLikes: number;
  negativeLikes: number;
  viewsCount: number;
  createdAt: string;
  fullText: boolean | null;
}
// interface Post {
//   title: string;
//   text: string;
//   selectedTags: string[];
//   message: string;
//   openModalMessage: boolean;
//   image: File | null;
//   imagePreview: string | null;
//   imageUrl: string | null;
// }
interface User {
  _id?: string;
  userName?: string;
}

// interface SocketData {
//   post: Post;
//   message: string;
//   error?: string; // Опциональное поле для ошибок
// }
const Post: React.FC<PostProps> = ({ post, fullText }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user as User);
  const socket = useSelector((state: any) => state.socket.socket);
  const [message, setMessage] = useState<string>("");
  const [openModalMessage, setOpenModalMessage] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string>("");
  // ---------------------

  // ---------------------
  // ------------------------------------
  const openModal = () => {
    setModalImage(post.imageUrl);
    setIsModalOpen(true);
  };

  // Закрытие модалки
  const closeModal = () => {
    setIsModalOpen(false);
  };
  // ------------------------------------
  const handlePostClick = (postId): void => {
    console.log("===--- location.pathname ---====", location.pathname);
    if (location.pathname === "/posts") {
      post.viewsCount = post.viewsCount + 1;
      const newPost = post;
      dispatch(editPost(newPost));
      if (socket) {
        socket.emit("PostEdit", { newPost, viewsCount: true });
      }
    }
    navigate(`/posts/${postId}`);
  };
  return (
    <div className="post">
      {post.imageUrl && (
        <div
          className="post-image rel"
          onClick={() => handlePostClick(post._id)}
        >
          <div className="imgs">
            <img src={post.imageUrl} alt="img" onClick={openModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
