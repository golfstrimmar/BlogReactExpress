import React, { useState, useEffect } from "react";
import "./PostPage.scss";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Post from "../../components/Post/Post";
// =========================

// =========================
const PostPage = () => {
  const { postId } = useParams(); // Получаем ID из URL
  const posts = useSelector((state: any) => state.posts.posts);
  const [post, setPost] = useState(null);
  //  -----------------

  //  -----------------
};
export default PostPage;
