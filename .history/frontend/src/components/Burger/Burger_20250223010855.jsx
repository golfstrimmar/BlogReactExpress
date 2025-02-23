import React, { useState, useEffect } from "react";
import "./Burger.scss";

const Burger = () => {
  return (
    <div className="burger">
      <div className="burger-">
        <div className="burger-top"></div>
        <div className="burger-line"></div>
        <div className="burger-bottom"></div>
      </div>
    </div>
  );
};

export default Burger;
