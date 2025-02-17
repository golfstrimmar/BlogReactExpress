import React, { useState, useEffect } from "react";
import "./PostPage.scss";
import { useParams } from "react-router-dom";
const PostPage = ({ post }) => {
  const { postId } = useParams(); // Получаем ID из URL
  // ---------------
  
  // ---------------
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
