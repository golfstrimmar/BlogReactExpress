import React from "react";
import { useSelector } from "react-redux";
const Posts = () => {
  const posts = useSelector((state) => state.posts.posts);
  return (
    <section>
      <h2> Posts</h2>
      {posts.map((post) => (
        <div key={post._id}>
          <h3>{post.title}</h3>
          <p>{post.text}</p>
        </div>
      ))}
    </section>
  ); 
};
export default Posts;
