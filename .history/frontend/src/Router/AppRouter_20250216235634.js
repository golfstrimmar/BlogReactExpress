import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Posts from "../pages/Posts";
import PostCreate from "../components/PostCreate/PostCreate";

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/posts" element={<Posts />} />
    <Route path="/postcreate" element={<PostCreate />} />
    {/* <Route path="/login" element={<LoginPage />} /> */}
    {/* <Route path="/register" element={<RegisterPage />} /> */}
    {/* <Route path="/profile" element={<Profile />} /> */}
    {/* <Route path="/personal" element={<Personal />} /> */}
  </Routes>
);
export default AppRouter;
