import React, { useEffect, useState } from "react";
import "./Post.scss";
import { ReactComponent as Like } from "../../assets/svg/like.svg";
import { useSelector, useDispatch } from "react-redux";
import { editPost } from "../../redux/actions/postActions";
const Post = ({ post }) => {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  // ----------------------

  // ----------------------
  useEffect(() => {
    if (socket) {
      socket.on("PostEdited", (data) => {
        console.log("===--- PostEdited ---====", data);
      });
      socket.on("error", (error) => {
        console.log("===--- error ---====", error);
      });
    }
  }, [socket]);
  // ----------------------
  const handlerPositive = (post) => {
    post.positiveLikes = post.positiveLikes + 1;
    const newPost = post;
    dispatch(editPost(newPost));
    if (socket) {
      socket.emit("PostEdit", { newPost, positive: true });
    }
  };
  // ----------------------
  const handlerNegative = () => {
    post.negativeLikes = post.negativeLikes + 1;
    const newPost = post;
    dispatch(editPost(newPost));
    if (socket) {
      socket.emit("PostEdit", { newPost, positive: false });
    }
  };
  return (
    <div className="post">
      <div className="post-image rel" onClick={() => handlePostClick(post._id)}>
        <div className="imgs">
          <img src={post.imageUrl} alt="img" />
        </div>
      </div>
      {/* <p>{post._id}</p> */}
      <div className="post-inner">
        <h2>{post.title}</h2>
        <p>{post.text}</p>
        <div className="post-wrap">
          <div className="post-tags">
            <span>Tags: </span>
            {post.tags.map((el, index) => {
              if (index !== post.tags.length - 1) {
                return (
                  <span key={index} className="post-tag">
                    {el},{" "}
                  </span>
                );
              } else {
                return (
                  <span key={index} className="post-tag">
                    {el}
                  </span>
                );
              }
            })}
          </div>
          <div>
            <span
              className="positiveLikes"
              onClick={() => {
                handlerPositive(post);
              }}
            >
              <Like />
            </span>
            <span>{post.positiveLikes}</span>
          </div>
          <div>
            <span
              className="negativeLikes"
              onClick={() => {
                handlerNegative(post);
              }}
            >
              <Like />
            </span>
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
    </div>
  );
};

export default Post;
