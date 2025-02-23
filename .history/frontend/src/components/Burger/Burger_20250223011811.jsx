import React, { useState, useEffect } from "react";
import "./Burger.scss";

const Burger = () => {
  const [isactive, setISactive] = useState(false);
  const handlerburgerClick = () => {
    setISactive(true)
  };
  return (
    <div className="burger">
      <div
        className="burger-wrap"
        onClick={() => {
          handlerburgerClick();
        }}
      >
        <div className="burger-top"></div>
        <div className="burger-line"></div>
        <div className="burger-bottom"></div>
      </div>
    </div>
  );
};

export default Burger;
