import React, { useState, useEffect, useRef } from "react";
import "./Select.scss";
import { ReactComponent as Shevron } from "../../assets/svg/chevron-down.svg";
// =====================================

// =====================================
interface Post {
  title: string;
  text: string;
  selectedTags: string[];
  message: string;
  openModalMessage: boolean;
  image: File | null;
  imagePreview: string | null;
  imageUrl: string | null;
}

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
