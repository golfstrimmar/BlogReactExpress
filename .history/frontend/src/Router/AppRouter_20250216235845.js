import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Posts from "../pages/Posts";
import CreatePost from "../components/CreatePost/CreatePost";

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/posts" element={<Posts />} />
    <Route path="/postcreate" element={<CreatePost />} />
    {/* <Route path="/login" element={<LoginPage />} /> */}
    {/* <Route path="/register" element={<RegisterPage />} /> */}
    {/* <Route path="/profile" element={<Profile />} /> */}
    {/* <Route path="/personal" element={<Personal />} /> */}
  </Routes>
);
export default AppRouter;
