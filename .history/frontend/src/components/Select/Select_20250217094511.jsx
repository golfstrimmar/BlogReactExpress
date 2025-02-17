import React, { useState, useEffect } from "react";
import "./Select.scss";

const Select = () => {
  const [active, setActive] = useState(false);
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

  return (
    <div className={`select  ${active ? "_is-active" : ""}  `}>
      <button
        className="dropdown-button"
        onClick={(e) => {
          handlerClickSelect(e);
        }}
      >
        <span>custom select</span>
        <input type="hidden" name="place" />
        {/* <svg class="icon">
                  <use xlink:href="#chevron-down"></use>
                </svg> */}
      </button>
      <ul className="dropdown-list">
        <li
          onClick={(e) => {handlerClick}}
          className="dropdown-list__item"
          data-value="Notes"
        >
          Newest First
        </li>
        <li className="dropdown-list__item" data-value="Photo">
          Oldest First
        </li>
      </ul>
    </div>
  );
};

export default Select;
