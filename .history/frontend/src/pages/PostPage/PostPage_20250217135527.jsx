import React, { useState, useEffect } from "react";
import "./PostPage.scss";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
const PostPage = () => {
  const { postId } = useParams(); // Получаем ID из URL
  const posts = useSelector((state) => state.posts.posts);
  const [post, setPost] = useState(null);
  // ---------------

  // ---------------
  useEffect(() => {
    const foundPost = posts.find((p) => p._id === postId);
    setPost(foundPost); // Ищем пост по ID и сохраняем в состояние
  }, [postId, posts]); // Зависят от изменения ID или списка постов
  return (
    <div className="postpage">
      <div className="postpage-wrap">
        <div className="postpage-image rel">
          <div className="imgs">
            <img src={post.imageUrl} alt="img" />
          </div>
        </div>
        <h2>{post.title}</h2>
        <p>{post.text}</p>
        <div className="postpage-"></div>
        <div className="postpage-"></div>
      </div>
    </div>
  );
};

export default PostPage;
