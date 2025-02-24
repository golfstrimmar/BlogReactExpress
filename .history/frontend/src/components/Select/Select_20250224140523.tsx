import React, { useState, useEffect, useRef } from "react";
import "./Select.scss";
import { ReactComponent as Shevron } from "../../assets/svg/chevron-down.svg";
// =====================================

// =====================================
interface Items {}

interface SelectProps {
  setSortOrder: string;
  selectItems: Items;
}
// -------------------
// -------------------
const Select: React.FC<SelectProps> = ({ setSortOrder, selectItems }) => {};
export default Select;
