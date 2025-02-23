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
    // Приводим e.target к типу HTMLElement, так как он может быть не HTMLElement
    const target = e.target as HTMLElement;

    // Теперь используем closest на target
    const closestButton = target.closest(".but-wave");

    if (closestButton) {
      let mValue = Math.max(
          closestButton.clientWidth,
          closestButton.clientHeight
        ),
        addDiv = document.createElement("div"),
        rect = closestButton.getBoundingClientRect();
      addDiv.classList.add("addDiv");
      addDiv.style.width = addDiv.style.height = mValue + "px";
      addDiv.style.left = e.clientX - rect.left - mValue / 2 + "px";
      addDiv.style.top = e.clientY - rect.top - mValue / 2 + "px";

      closestButton.append(addDiv); // Добавляем элемент в DOM
      setTimeout(() => {
        addDiv.remove();
      }, 1000);
    }

    onClick(e); // вызываем onClick с типизированным событием
  };

  return (
    <button onClick={handleruttonClick} className="buttonSuccessWeave but-wave">
      {text}
    </button>
  );
};

export default ButtonSuccessWave;
