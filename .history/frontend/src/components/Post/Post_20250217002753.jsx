import React from "react";
import "./Post.scss";

const Post = ({ post }) => {
  return (
    <div className="post">
      <div className="post-image rel">
        <div className="imgs">
          <img src={post.imageUrl} alt="img" />
        </div>
      </div>
      {/* <p>{post._id}</p> */}
      <div className="post-inner">
        <h2>{post.title}</h2>
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
        <div>
          <span>Created at: </span>
          <span>{new  post.createdAt}</span>
        </div>
      </div>
    </div>
  );
};

export default Post;
