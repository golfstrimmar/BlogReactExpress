import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Posts from "../pages/Posts/Posts";
import CreatePost from "../components/CreatePost/CreatePost";
import PostPage from "../pages/PostPage/PostPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import Profile from "../pages/Profile/Profile";
import SetPassword from "../components/SetPassword/SetPassword";
import EditPost from "../pages/EditPost/EditPost";
import AddComment from "../pages/AddComment/AddComment";
const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/posts" element={<Posts />} />
    <Route path="/create" element={<CreatePost />} />
    <Route path="/edit/:postId" element={<EditPost />} />
    <Route path="/posts/:postId" element={<PostPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/setpassword/:email" element={<SetPassword />} />
    <Route path="/comment/:postId" element={<AddComment />} />
    {/* <Route path="/profile" element={<Profile />} /> */}
    {/* <Route path="/personal" element={<Personal />} /> */}
  </Routes>
);
export default AppRouter;
