import React, { useState, useEffect, useRef } from "react";
import "./Select.scss";
import { ReactComponent as Shevron } from "../../assets/svg/chevron-down.svg";
// =====================================

// =====================================
interface Items {}

interface User {
  _id?: string;
  userName?: string;
}

interface SocketData {
  post: Post;
  message: string;
  error?: string; // Опциональное поле для ошибок
}
interface SelectProps {
  setSortOrder: string;
  selectItems: boolean;
}
// -------------------
// -------------------
const Select: React.FC<SelectProps> = ({ setSortOrder, selectItems }) => {};
export default Select;
