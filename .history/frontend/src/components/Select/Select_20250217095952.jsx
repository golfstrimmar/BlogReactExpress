import React, { useState, useEffect, useRef } from "react";
import "./Select.scss";

const Select = () => {
  const [active, setActive] = useState(false);
  // Создаем массив ref для всех элементов списка
  const [selectedValue, setSelectedValue] = useState("");

  // ----------------
  const handlerClickSelect = (e) => {
    e.preventDefault();
    setActive((prev) => {
      return (prev = !prev);
    });
  };
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".select")) {
      setActive(false);
    }
  });
  const handlerClickItem = (e) => {
    const value = e.target.getAttribute("data-value");
    setSelectedValue;
    setActive(false);
  };
  return (
    <div className={`select  ${active ? "_is-active" : ""}  `}>
      <button
        className="dropdown-button"
        onClick={(e) => {
          handlerClickSelect(e);
        }}
      >
        <span>custom select</span>
        <input type="hidden" name="place" value={selectedValue} />
        {/* <svg class="icon">
                  <use xlink:href="#chevron-down"></use>
                </svg> */}
      </button>
      <ul className="dropdown-list">
        {["Newest First", "Oldest First"].map((text, index) => (
          <li
            key={index}
            onClick={(e) => handlerClickItem(e)}
            className="dropdown-list__item"
            data-value={text}
          >
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Select;
