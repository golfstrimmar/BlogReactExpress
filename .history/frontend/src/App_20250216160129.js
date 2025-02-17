import "./App.css";
import Header from "./components/Header/Header.jsx";
import AppRouter from "./router/AppRouter";
import { BrowserRouter as Router } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setSocket } from "./redux/actions/socketActions";
function App() {
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
