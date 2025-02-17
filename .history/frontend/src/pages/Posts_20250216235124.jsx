import React from "react";
import { useSelector } from "react-redux";
import Post from "../components/Post/Post";
import "./Posts.scss";
const Posts = () => {
  const posts = useSelector((state) => state.posts.posts);
  return (
    <section className="posts">
      <div className="container">
        <h2> Posts</h2>
        <div className="posts-list">
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default Posts;
