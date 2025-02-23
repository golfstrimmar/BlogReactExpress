import React, { useState, useEffect } from "react";
import "./Burger.scss";

const Burger = ({ handlerburgerClick, isactive }) => {
  return (
    <div className="burger">
      <div
        className="burger-wrap"
        onClick={() => {
          handlerburgerClick();
        }}
      >
        <div className={`burger-top  ${isactive ? "run" : ""}  `}></div>
        <div className={`burger-line  ${isactive ? "run" : ""}  `}></div>
        <div className={`burger-bottom  ${isactive ? "run" : ""}  `}></div>
      </div>
    </div>
  );
};

export default Burger;
