import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import "./CreatePost.scss";
import ButtonSuccessWave from "../ButtonSuccessWave/ButtonSuccessWave";
import { useParams } from "react-router-dom";
import ModalMessage from "../ModalMessage/ModalMessage";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Images from "../../assets/svg/images.svg";
import { useNavigate } from "react-router-dom";
import { addPost } from "../../redux/actions/postActions";
import type { RootState } from "../../redux/store"; // Импорт типа RootState
import type { Socket } from "socket.io-client"; // Тип для socket

const CreatePost = () => {
  // Типизация Redux-состояния
  const user = useSelector((state: RootState) => state.auth.user);
  const socket = useSelector(
    (state: RootState) => state.socket.socket as Socket
  );

  // Состояния с явной типизацией
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [openModalMessage, setOpenModalMessage] = useState<boolean>(false);
  const tags = ["trip", "mobile", "adventure"];
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      // Типизация обработчиков событий сокета
      const handlePostCreated = (data: { post: PostType; message: string }) => {
        dispatch(addPost(data.post));
        setMessage(data.message);
        setOpenModalMessage(true);
        resetForm();
        setTimeout(() => {
          setOpenModalMessage(false);
          navigate("/posts");
        }, 2000);
      };

      const handleError = (data: { message: string; error: string }) => {
        setMessage(`${data.message}: ${data.error}`);
        setOpenModalMessage(true);
        setTimeout(() => {
          setOpenModalMessage(false);
        }, 2000);
      };

      socket.on("postCreated", handlePostCreated);
      socket.on("error", handleError);

      return () => {
        socket.off("postCreated", handlePostCreated);
        socket.off("error", handleError);
      };
    }
  }, [socket, navigate, dispatch]);

  // Типизация параметров событий
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedTags((prev) => [...prev, value]);
    } else {
      setSelectedTags((prev) => prev.filter((tag) => tag !== value));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Типизация возвращаемого значения
  const handleImageUpload = async (): Promise<string | undefined> => {
    if (!image) return;

    const imageFormData = new FormData();
    imageFormData.append("file", image);
    imageFormData.append("upload_preset", "blogblog");
    imageFormData.append("cloud_name", "dke0nudcz");

    try {
      const response = await axios.post<{ secure_url: string }>(
        "https://api.cloudinary.com/v1_1/dke0nudcz/image/upload",
        imageFormData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Failed to upload image.");
      setOpenModalMessage(true);
      setTimeout(() => {
        setOpenModalMessage(false);
      }, 2000);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title || !text) {
      setMessage("Title and text are required!");
      setOpenModalMessage(true);
      setTimeout(() => setOpenModalMessage(false), 2000);
      return;
    }

    try {
      const imageUrl = image ? await handleImageUpload() : "";

      // Типизация данных для отправки
      const postData = {
        title,
        text,
        tags: selectedTags,
        imageUrl: imageUrl || "",
        userId: user?._id || "",
        userName: user?.userName || "",
      };

      socket.emit("createPost", postData);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const resetForm = () => {
    setTitle("");
    setText("");
    setSelectedTags([]);
    setImage(null);
    setImagePreview(null);
    setImageUrl(null);
  };

  return (
    <div className="container">
      <div className="createpost">
        <ModalMessage message={message} open={openModalMessage} />

        <form className="createpost-form" onSubmit={handleSubmit}>
          {/* ... остальная разметка без изменений ... */}
        </form>
      </div>
    </div>
  );
};

// Интерфейс для типа поста (добавить в отдельный файл типов)
interface PostType {
  _id: string;
  title: string;
  text: string;
  tags: string[];
  imageUrl: string;
  userId: string;
  userName: string;
  // ... другие поля по необходимости
}

export default CreatePost;
