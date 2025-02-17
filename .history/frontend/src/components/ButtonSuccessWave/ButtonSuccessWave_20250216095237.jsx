import React from "react";
import "./ButtonSuccessWave.scss";

const ButtonSuccessWave = () => {
  const handleruttonClick = () => {};
  return (
    <button
      onClick={() => {
        handleruttonClick();
      }}
      className="buttonSuccessWeave but-wave"
    >
      wave
    </button>
  );
};

export default ButtonSuccessWave;
