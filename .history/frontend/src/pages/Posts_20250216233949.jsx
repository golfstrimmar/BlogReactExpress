import React from "react";
import { useSelector } from "react-redux";
const Posts = () => {
  const posts = useSelector((state) => state.posts.posts);
  return (
    <section>
      <h2> Posts</h2>
      {posts.map((post) => (
        <div key={post._id}>
          <img src={post.imageUrl} alt="img" />
          <p>{post._id}</p>
          <h3>{post.title}</h3>
          <p>{post.text}</p>
          <div>
            <span>Tags: </span>
            {post.tags.map((el) => (
              <span>{el}</span>
            ))}
          </div>
          <div>
            <span>Positive likes: </span>
            <span>{post.positiveLikes}</span>
          </div>
          <div>
            <span>Negative likes: </span>
            <span>{post.negativeLikes}</span>
          </div>
          <div>
            <span>Views: </span>
            <span>{post.viewsCount}</span>
          </div>
        </div>
      ))}
    </section>
  );
};
export default Posts;
