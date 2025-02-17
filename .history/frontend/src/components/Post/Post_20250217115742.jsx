import React, { useEffect, useState } from "react";
import "./Post.scss";
import { ReactComponent as Like } from "../../assets/svg/like.svg";
import { useSelector, useDispatch } from "react-redux";
import { editPost } from "../../redux/actions/postActions";
const Post = ({ post }) => {
  const [positiveLikes, setPositiveLikes] = useState(0);
  const [negativeLikes, setNegativeLikes] = useState(0);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  // ----------------------

  // ----------------------
  const handlerPositive = () => {
    // setPositiveLikes((prev) => {
    //   return (prev += 1);
    // });
  };
  const handlerNegative = () => {
    setNegativeLikes((prev) => {
      return (prev += 1);
    });
  };
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
        <div className="post-wrap">
          <div className="post-tags">
            <span>Tags: </span>
            {post.tags.map((el, index) => {
              if (index !== post.tags.length - 1) {
                return <span className="post-tag">{el}, </span>;
              } else {
                return <span className="post-tag">{el}</span>;
              }
            })}
          </div>
          <div>
            <span
              className="positiveLikes"
              onClick={() => {
                handlerPositive();
              }}
            >
              <Like />
            </span>
            <span>{post.positiveLikes}</span>
            <span>{positiveLikes}</span>
          </div>
          <div>
            <span
              className="negativeLikes"
              onClick={() => {
                handlerNegative();
              }}
            >
              <Like />
            </span>
            <span>{post.negativeLikes}</span>
            <span>{negativeLikes}</span>
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
