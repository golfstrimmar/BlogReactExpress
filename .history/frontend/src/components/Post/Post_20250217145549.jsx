import React, { useEffect, useState } from "react";
import "./Post.scss";
import { ReactComponent as Like } from "../../assets/svg/like.svg";
import { useSelector, useDispatch } from "react-redux";
import { editPost } from "../../redux/actions/postActions";
import { useLocation, useNavigate } from "react-router-dom";

const Post = ({ post, fullText }) => {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  // -------------------------

  // -------------------------
  useEffect(() => {
    if (socket) {
      socket.on("PostEdited", (data) => {
        console.log("===--- PostEdited ---====", data);
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
    console.log("===---postId  ---====", postId);
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
    setModalImage(post.imageUrl); // Сохраняем изображение в состояние
    setIsModalOpen(true); // Открываем модалку
  };

  // Закрытие модалки
  const closeModal = () => {
    setIsModalOpen(false); // Закрываем модалку
  };
  // ------------------------------------
  return (
    <div className="post">
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={modalImage} alt="modal-img" />
            <button className="close-modal" onClick={closeModal}>
              X
            </button>
          </div>
        </div>
      )}
      <div className="post-image rel" onClick={() => handlePostClick(post._id)}>
        <div className="imgs">
          <img src={post.imageUrl} alt="img" onClick={openModal} />
        </div>
      </div>
      <div className="post-inner">
        <h2>{post.title}</h2>
        <p>{truncatedText}</p>{" "}
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
        </div>
      </div>
    </div>
  );
};

export default Post;
