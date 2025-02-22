import React, { useState, useEffect } from "react";
import "./PostPage.scss";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Post from "../../components/Post/Post";
const PostPage = () => {
  const { postId } = useParams(); // Получаем ID из URL
  const posts = useSelector((state) => state.posts.posts);
  const [post, setPost] = useState(null);
  // ---------------

  // ---------------
  useEffect(() => {
    console.log("===--- postId ---====", postId);
    const foundPost = posts.find((p) => p._id === postId);
    setPost(foundPost); // Ищем пост по ID и сохраняем в состояние
  }, [postId, posts]); // Зависят от изменения ID или списка постов
  //  ------------------

  // ---------------

  if (!post) return <div>Loading...</div>;
  return (
    <div className="postpage container">
      <Post key={post._id} post={post} fullText={true} />
    </div>
  );
};

export default PostPage;
