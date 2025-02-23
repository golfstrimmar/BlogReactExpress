import React from "react";
import "./ButtonSuccessWave.scss";

// Интерфейс для пропсов
interface ButtonSuccessWaveProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  text: string;
}

const ButtonSuccessWave: React.FC<ButtonSuccessWaveProps> = ({
  text,
  onClick,
}) => {
  const handleruttonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Приводим e.target к типу HTMLElement
    const target = e.target as HTMLElement; // Приводим к типу HTMLElement
    // let target = target.closest(".but-wave") as HTMLElement;
    let mValue = Math.max(target.clientWidth, target.clientHeight),
      addDiv = document.createElement("div"),
      rect = target.getBoundingClientRect();
    addDiv.classList.add("addDiv");
    addDiv.style.width = addDiv.style.height = mValue + "px";
    addDiv.style.left = e.clientX - rect.left - mValue / 2 + "px";
    addDiv.style.top = e.clientY - rect.top - mValue / 2 + "px";

    target.closest(".but-wave")?.append(addDiv); // Добавляем элемент в DOM
    setTimeout(() => {
      addDiv.remove();
    }, 1000);

    onClick(e); // вызываем onClick с типизированным событием
  };

  return (
    <button onClick={handleruttonClick} className="buttonSuccessWeave but-wave">
      {text}
    </button>
  );
};

export default ButtonSuccessWave;
