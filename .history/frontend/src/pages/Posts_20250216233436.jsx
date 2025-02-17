import React from "react";
import { useSelector } from "react-redux";
const Posts = () => {
  const posts = useSelector((state) => state.posts.posts);
  return <section>Posts</section>;
};
export default Posts;
