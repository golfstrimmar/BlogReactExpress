import React from "react";
import { useSelector } from "react-redux";
import Post from "../components/Post/Post";
import "./Posts.scss";
const Posts = () => {
  const posts = useSelector((state) => state.posts.posts);
  return (
    <section>
      <h2> Posts</h2>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </section>
  );
};
export default Posts;
