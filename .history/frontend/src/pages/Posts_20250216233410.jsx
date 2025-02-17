import React from "react";
import { useSelector } from "react-redux";
const Posts = () => {
  const socket = useSelector((state) => state.socket.socket);
  return <section>Posts</section>;
};
export default Posts;
