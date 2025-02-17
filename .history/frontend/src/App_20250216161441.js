import "./App.css";
import Header from "./components/Header/Header.jsx";
import AppRouter from "./router/AppRouter";
import { BrowserRouter as Router } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setSocket } from "./store/actions/socketActions";
import { io } from "socket.io-client";
const serverUrl = process.env.REACT_APP_API_URL;
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const socket = io(serverUrl);
    socket.on("connect", () => {
      console.log("Connected to server with id:", socket.id);
      dispatch(setSocket(socket));
    });
    socket.on("welcome", (message) => {
      console.log(message);
    });
    return () => {
      socket.disconnect();
      dispatch(setSocket(null));
    };
  }, []);
  return (
    <Router>
      <Header />
      <AppRouter />
    </Router>
    // <div className="App">
    //   <ButtonSuccessWave />
    //   <h1>Bebas Neue</h1>
    // </div>
  );
}

export default App;
