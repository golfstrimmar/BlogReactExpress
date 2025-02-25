import React, { useState, useEffect } from "react";
import "./Select.scss";
import { ReactComponent as Shevron } from "../../assets/svg/chevron-down.svg";

// Тип элемента
interface Item {
  name: string;
  value: "asc" | "desc"; // Значение может быть только "asc" или "desc"
}

// Пропсы компонента Select
interface SelectProps {
  setSortOrder: (order: "asc" | "desc") => void;
  selectItems: Item[]; // Массив объектов типа Item
}

const Select: React.FC<SelectProps> = ({ setSortOrder, selectItems }) => {
  const [active, setActive] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string>(
    selectItems[0].name
  );

  useEffect(() => {
    const handleClick = (event: MouseEvent): void => {
      const target = event.target as Element;
      if (!target.closest(".select")) {
        setActive(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  const handlerClickSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setActive((prev) => !prev);
  };

  const handlerClickItem = (item: Item) => {
    setSelectedValue(item.name);
    setSortOrder(item.value);
    setActive(false);
  };

  return (
    <div className={`select ${active ? "_is-active" : ""}`}>
      <button className="dropdown-button" onClick={handlerClickSelect}>
        <span>{selectedValue}</span>
        <input type="hidden" name="place" value={selectedValue} />
        <Shevron />
      </button>
      <ul className="dropdown-list">
        {selectItems.map((item, index) => (
          <li
            key={index}
            onClick={() => handlerClickItem(item)}
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
