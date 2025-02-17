import React, { useState, useEffect } from "react";
import "./PostPage.scss";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ReactComponent as Like } from "../../assets/svg/like.svg";
const PostPage = () => {
  const { postId } = useParams(); // Получаем ID из URL
  const posts = useSelector((state) => state.posts.posts);
  const [post, setPost] = useState(null);
  const dispatch = useDispatch();
  // ---------------

  // ---------------
  useEffect(() => {
    console.log("===--- postId ---====", postId);
    const foundPost = posts.find((p) => p._id === postId);
    setPost(foundPost); // Ищем пост по ID и сохраняем в состояние
  }, [postId, posts]); // Зависят от изменения ID или списка постов
  //  ------------------
  // ----------------------
  const handlerPositive = (post) => {
    post.positiveLikes = post.positiveLikes + 1;
    const newPost = post;
    dispatch(editPost(newPost));
    if (socket) {
      socket.emit("PostEdit", { newPost, positive: true });
    }
  };
  // ----------------------
  const handlerNegative = () => {
    post.negativeLikes = post.negativeLikes + 1;
    const newPost = post;
    dispatch(editPost(newPost));
    if (socket) {
      socket.emit("PostEdit", { newPost, positive: false });
    }
  };
  // ---------------

  if (!post) return <div>Loading...</div>;
  return (
    <div className="postpage">
      <div className="postpage-wrap">
        <div className="postpage-image rel">
          <div className="imgs">
            <img src={post.imageUrl} alt="img" />
          </div>
        </div>
        <div className="postpage-inner">
          <h2>{post.title}</h2>
          <p>{post.text}</p>
          <div className="postpage-tags">
            <span>Tags: </span>
            {post.tags.map((el, index) => {
              if (index !== post.tags.length - 1) {
                return (
                  <span key={index} className="post-tag">
                    {el}
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

export default PostPage;
