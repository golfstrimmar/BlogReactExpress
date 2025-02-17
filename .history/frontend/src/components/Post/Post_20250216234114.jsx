
import React from 'react';
import './Post.scss';

const Post = () => {
  return (
    <div className="post">
      <div >
        <img src={post.imageUrl} alt="img" />
        {/* <p>{post._id}</p> */}
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
    </div>
  );
};

export default Post;
  