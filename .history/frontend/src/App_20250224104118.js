import "./App.css";
import Header from "../src/components/Header.tjs";
import AppRouter from "./router/AppRouter";
import { BrowserRouter as Router } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket, disconnectSocket } from "./redux/actions/socketActions";
import { io } from "socket.io-client";
import { setPosts } from "./redux/actions/postActions";
import { allComments } from "./redux/actions/commentActions";
import { setUser } from "./redux/actions/authActions";
import { GoogleOAuthProvider } from "@react-oauth/google";
const serverUrl = process.env.REACT_APP_API_URL;
const googleClient = process.env.REACT_APP_GOOGLE_CLIENT_ID;
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      dispatch(setUser({ user, token }));
    }
  }, [dispatch]);
  useEffect(() => {
    const socket = io(serverUrl);
    socket.on("connect", () => {
      console.log("Connected to server with id:", socket.id);
      dispatch(setSocket(socket));

      socket.on("allPosts", (posts) => {
        dispatch(setPosts(posts));
      });
      socket.on("allComments", (comments) => {
        dispatch(allComments(comments));
      });
    });
    return () => {
      socket.disconnect();
      dispatch(setSocket(null));
    };
  }, []);
  return (
    <GoogleOAuthProvider clientId={googleClient}>
      <Router>
        <Header />
        <AppRouter />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
