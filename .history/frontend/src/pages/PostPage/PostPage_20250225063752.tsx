import React, { useState, useEffect } from "react";
import "./PostPage.scss";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Post from "../../components/Post/Post";
// =========================

// =========================
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
const PostPage = () => {
  const { postId } = useParams(); // Получаем ID из URL
  const posts = useSelector((state: any) => state.posts.posts);
  const [post, setPost] = useState(null);
  //  -----------------

  //  -----------------
};
export default PostPage;
