import React from "react";
import "./ButtonSuccessWave.scss";
// =============================

// =============================
interface ButtonSuccessWaveProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  text: string;
}
const ButtonSuccessWave: React.FC<ButtonSuccessWaveProps> = ({
  text,
  onClick,
}) => {
  const handleruttonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    let target = e.target.closest(".but-wave") as HTMLElement;
    let mValue = Math.max(target.clientWidth, target.clientHeight),
      addDiv = document.createElement("div"),
      rect = target.getBoundingClientRect();
    addDiv.classList.add("addDiv");
    addDiv.style.width = addDiv.style.height = mValue + "px";
    addDiv.style.left = e.clientX - rect.left - mValue / 2 + "px";
    addDiv.style.top = e.clientY - rect.top - mValue / 2 + "px";

    target.closest(".but-wave")?.append(addDiv);
    setTimeout(() => {
      addDiv.remove();
    }, 1000);

    onClick(e);
  };
  return (
    <button onClick={handleruttonClick} className="buttonSuccessWeave but-wave">
      {text}
    </button>
  );
};

export default ButtonSuccessWave;
