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
interface Post {
  _id: string;
  imageUrl: string;
  user: string;
  userName: string;
  title: string;
  text: string;
  tags: string[];
  positiveLikes: number;
  negativeLikes: number;
  viewsCount: number;
  createdAt: string;
}

interface PostProps {
  post: Post; // Объект поста
  fullText: boolean; // Флаг для отображения полного текста
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
  const comments = useSelector((state: any) => state.comments.comments);
  const [message, setMessage] = useState<string>("");
  const [openModalMessage, setOpenModalMessage] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string>("");
    const [postComments, setPostComments] = useState([]);
  // ---------------------

  // ---------------------
  useEffect(() => {
    if (comments.length > 0) {
      // comments.map((el) => console.log(el));
      let newPostComments = [...comments];
      newPostComments = newPostComments.filter((el) => {
        return el.postId === post._id;
      });
      setPostComments(newPostComments);
    }
  }, [comments]);
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
  const handlePostClick = (postId: string): void => {
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
  const truncatedText = fullText
    ? post.text
    : post.text.length > 100
      ? post.text.slice(0, 100) + "..."
      : post.text;
  // ------------------------------------
  const handlerPositive = (post: Post) => {
    post.positiveLikes = post.positiveLikes + 1;
    const newPost = { ...post };
    dispatch(editPost(newPost));
    if (socket) {
      socket.emit("PostEdit", { newPost, positive: true });
    }
  };

  const handlerNegative = (post: Post) => {
    post.negativeLikes = post.negativeLikes + 1;
    const newPost = { ...post };
    dispatch(editPost(newPost));
    if (socket) {
      socket.emit("PostEdit", { newPost, positive: false });
    }
  };
  // ------------------------------------
  const handlerPostEdit = (post: Post) => {
    navigate(`/edit/${post._id}`);
  };
  // ------------------------------------
  const handlerDeletePost = (id: string) => {
    socket.emit("deletePost", id);
  };
  // ------------------------------------
  const handlerAddComment = (
    e: React.MouseEvent<HTMLDivElement>,
    id: string
  ) => {
    e.preventDefault();
    navigate(`/post/${id}/comment`);
  };
  // ------------------------------------
  return (
    <div className="post">
      <ModalMessage message={message} open={openModalMessage} />
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
      <div className="post-inner">
        <h2>{post.title}</h2>
        <p>{truncatedText}</p>
        <div className="post-wrap">
          <div>
            <span
              className="positiveLikes"
              onClick={() => {
                handlerPositive(post);
              }}
            >
              <Like />
            </span>
            <span>{post.positiveLikes}</span>
          </div>
          <div>
            <span
              className="negativeLikes"
              onClick={() => {
                handlerNegative(post);
              }}
            >
              <Like />
            </span>
            <span>{post.negativeLikes}</span>
          </div>
          <div>
            <span>Views: </span>
            <span>{post.viewsCount}</span>
          </div>
          <div>
            <span>Created at: </span>
            <span>{new Date(post.createdAt).toLocaleString()}</span>
          </div>
          <div>
            <span>Created by: </span>
            {post.userName && <span>{post.userName}</span>}
          </div>
          {postComments.length > 0 && (
            <>
              <span>Comments: </span>
              <div className="post-comments">
                {postComments &&
                  postComments.map((el) => (
                    <div className="post-comment" key={el._id}>
                      <div>
                        Created by: <h5>{el.userName}</h5>{" "}
                      </div>
                      <p>{el.text}</p>

                      {user && el.userId === user._id && (
                        <div className="post-actions">
                          <div
                            className="post-edit"
                            onClick={(e) => {
                              handlerСommentEdit(el);
                            }}
                          >
                            <Edit />
                          </div>
                          <div
                            className="post-delete"
                            onClick={(e) => {
                              handlerСommentDelete(el);
                            }}
                          >
                            <Delit />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </>
          )}

          {user && (
            <div
              className="post-addComment"
              onClick={(e) => {
                handlerAddComment(e, post._id);
              }}
            >
              <Comment />
            </div>
          )}

          {post.user === user?._id && (
            <div className="post-actions">
              <div
                className="post-edit"
                onClick={() => {
                  handlerPostEdit(post);
                }}
              >
                <Edit />
              </div>
              <div
                className="post-delete"
                onClick={() => {
                  handlerDeletePost(post._id);
                }}
              >
                <Delit />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
