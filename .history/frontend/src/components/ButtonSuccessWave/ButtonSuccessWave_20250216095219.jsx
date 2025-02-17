import React from "react";
import "./ButtonSuccessWave.scss";

const ButtonSuccessWave = () => {
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
