import React, { useState, useEffect } from "react";
import "./CreatePost.scss";
import ButtonSuccessWave from "../ButtonSuccessWave/ButtonSuccessWave";
import { useParams } from "react-router-dom";
import ModalMessage from "../ModalMessage/ModalMessage";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Images from "../../assets/svg/images.svg";
import { useNavigate } from "react-router-dom";
import { addPost } from "../../redux/actions/postActions";

// ==============================

// ==============================
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

const CreatePost = () => {
  const user = useSelector((state: any) => state.auth.user as User);
  const socket = useSelector((state: any) => state.socket.socket);
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [openModalMessage, setOpenModalMessage] = useState<boolean>(false);
  const tags: string[] = ["trip", "mobile", "adventure"];
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
};

export default CreatePost;
