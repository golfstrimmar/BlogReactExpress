import React, { useState, useEffect } from "react";
import "./Select.scss";

const Select = () => {
  const [active, setActive] = useState(false);
  // ----------------
  const handlerClickSelect = (e) => {
    e.preventDefault();
    setActive(true);
  };
  return (
    <div
      class="select"
      className={`runPunkt-item  ${grenz ? "run" : ""}  ${run1 ? "weg" : ""}`}
    >
      <button
        class="dropdown-button"
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
      <ul class="dropdown-list">
        <li class="dropdown-list__item" data-value="Notes">
          Newest First
        </li>
        <li class="dropdown-list__item" data-value="Photo">
          Oldest First
        </li>
      </ul>
    </div>
  );
};

export default Select;
