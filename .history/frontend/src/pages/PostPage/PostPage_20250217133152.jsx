import React, { useState, useEffect } from "react";
import "./PostPage.scss";

const PostPage = ({ post }) => {
  return (
    <div className="postpage">
      <div className="postpage-">
        <div className="postpage-"></div>
        <div className="post-image rel">
          <div className="imgs">
            <img src={post.imageUrl} alt="img" />
          </div>
        </div>
        <div className="postpage-"></div>
        <div className="postpage-"></div>
      </div>
    </div>
  );
};

export default PostPage;
