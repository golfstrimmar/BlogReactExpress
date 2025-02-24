import React, { useState, useEffect, useRef } from "react";
import "./Select.scss";
import { ReactComponent as Shevron } from "../../assets/svg/chevron-down.svg";
// =====================================

// =====================================
interface Item {
  name: string;
  value: string;
}

interface SelectProps {
  setSortOrder: (order: string) => void; // Передаем функцию для изменения сортировки
  selectItems: Item[];
}
// -------------------
// -------------------
const Select: React.FC<SelectProps> = ({ setSortOrder, selectItems }) => {
  const [active, setActive] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string>(
    selectItems[0].name
  );
  // ----------------
  // useEffect(() => {
  //   setSortOrder(selectItems[0].value);
  // }, [setSortOrder]);
  // // ----------------
  // const handlerClickSelect = (e) => {
  //   e.preventDefault();
  //   setActive((prev) => {
  //     return (prev = !prev);
  //   });
  // };
  // document.addEventListener("click", function (e) {
  //   if (!e.target.closest(".select")) {
  //     setActive(false);
  //   }
  // });
  const handlerClickItem = (item: Item) => {
    setSelectedValue(item.name);
    setSortOrder(item.value);
    setActive(false);
  };
  return (
    <div className={`select  ${active ? "_is-active" : ""}  `}>
      {/* <button
        className="dropdown-button"
        onClick={(e) => {
          handlerClickSelect(e);
        }}
      >
        <span>{selectedValue}</span>
        <input type="hidden" name="place" value={selectedValue} />
        <Shevron />
      </button> */}
      <ul className="dropdown-list">
        {selectItems.map((item, index) => (
          <li
            key={index}
            onClick={(e) => handlerClickItem(item)}
            className="dropdown-list__item"
            data-value={item.value}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Select;
