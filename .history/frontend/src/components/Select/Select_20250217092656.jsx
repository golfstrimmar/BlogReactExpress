import React from "react";
import "./Select.scss";

const Select = () => {
  const [, set] = useState()
  return (
    <div class="select">
      <button class="dropdown-button">
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
