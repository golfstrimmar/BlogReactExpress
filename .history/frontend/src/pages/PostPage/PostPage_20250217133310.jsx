import React, { useState, useEffect } from "react";
import "./PostPage.scss";

const PostPage = ({ post }) => {
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
