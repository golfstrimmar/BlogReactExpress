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
        <div className="post-tags">
          <span>Tags: </span>
          {post.tags.map((el,index) => (
            <span className="post-tag">{el}</span>
            if (index!==post.tags.length-1) {
              
            }
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
          <span>{new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default Post;
