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
const Post = ({ post, fullText }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [message, setMessage] = useState("");
  const [openModalMessage, setOpenModalMessage] = useState(false);
  const comments = useSelector((state) => state.comments.comments);
  const [postComments, setPostComments] = useState([]);
  // -------------------------

  // -------------------------
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
  useEffect(() => {
    if (socket) {
      socket.on("postDeleted", (data) => {
        if (data) {
          console.log("===--- postDeleted from server ---====", data);
          setMessage("Post deleted.");
          setOpenModalMessage(true);
          dispatch(deletePost(data));
          setTimeout(() => {
            setMessage("");
            setOpenModalMessage(false);
          }, 2000);
        }
      });
      socket.on("commentDeleted", (data) => {
        if (data) {
          console.log(
            "===--- commentDeleted from server ---====",
            data.comment,
            data.message
          );
          setMessage(data.message);
          setOpenModalMessage(true);
          dispatch(deleteComment(data.comment));
          setTimeout(() => {
            setMessage("");
            setOpenModalMessage(false);
          }, 2000);
        }
      });
      socket.on("error", (error) => {
        console.log("===--- error ---====", error);
      });
    }
  }, [socket]);

  const handlerPositive = (post) => {
    post.positiveLikes = post.positiveLikes + 1;
    const newPost = post;
    dispatch(editPost(newPost));
    if (socket) {
      socket.emit("PostEdit", { newPost, positive: true });
    }
  };

  const handlerNegative = () => {
    post.negativeLikes = post.negativeLikes + 1;
    const newPost = post;
    dispatch(editPost(newPost));
    if (socket) {
      socket.emit("PostEdit", { newPost, positive: false });
    }
  };

  const handlePostClick = (postId) => {
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

  // Если не на странице с полным постом, то обрезаем текст
  const truncatedText = fullText
    ? post.text
    : post.text.length > 100
      ? post.text.slice(0, 100) + "..."
      : post.text;
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
  const handlerPostEdit = (post) => {
    navigate(`/edit/${post._id}`);
  };
  // ------------------------------------
  const handlerDeletePost = (id) => {
    socket.emit("deletePost", id);
  };
  // ------------------------------------
  const handlerAddComment = (e, id) => {
    e.preventDefault();
    navigate(`/post/${id}/comment`);
  };
  // ------------------------------------
  const handlerСommentEdit = (el) => {
    navigate(`/comment/${el._id}/edit`);
  };
  // ------------------------------------
  const handlerСommentDelete = (el) => {
    if (socket) {
      socket.emit("deleteComment", el._id);
    }
  };
  // ------------------------------------
  return (
    <div className="post">
      <ModalMessage message={message} open={openModalMessage} />
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div
            className="modal-content rel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="imgs">
              <img src={modalImage} alt="modal-img" />
            </div>
          </div>
        </div>
      )}
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
        {/* Если fullText true, то показываем весь текст */}
        <div className="post-wrap">
          <div className="post-tags">
            <span>Tags: </span>
            {post.tags.map((el, index) => {
              if (index !== post.tags.length - 1) {
                return (
                  <span key={index} className="post-tag">
                    {el},{" "}
                  </span>
                );
              } else {
                return (
                  <span key={index} className="post-tag">
                    {el}
                  </span>
                );
              }
            })}
          </div>
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
                      <p>
                        Created by: <h5>{el.userName}</h5>{" "}
                      </p>
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
