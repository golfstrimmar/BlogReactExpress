import React, { useState, useEffect } from "react";
import "./CreatePost.scss";
import ButtonSuccessWave from "../ButtonSuccessWave/ButtonSuccessWave";
import { useParams } from "react-router-dom";
import ModalMessage from "../ModalMessage/ModalMessage";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { ReactComponent as ImagesIcon } from "../../assets/svg/images.svg";
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

const CreatePost: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user as User);
  const socket = useSelector((state: any) => state.socket.socket);

  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [openModalMessage, setOpenModalMessage] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tags: string[] = ["trip", "mobile", "adventure"];

  // ----------------------------------
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Добавляем значение в массив, если чекбокс выбран
      setSelectedTags((prev) => [...prev, e.target.value]);
    } else {
      // Удаляем значение из массива, если чекбокс снят
      setSelectedTags((prev) => prev.filter((tag) => tag !== e.target.value));
    }
  };
  // ----------------------------------
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]; // Получаем первый файл
      setImage(file); // Устанавливаем выбранный файл

      if (file) {
        const previewUrl = URL.createObjectURL(file); // Создаём превью
        setImagePreview(previewUrl); // Устанавливаем превью
      }
    } else {
      setImage(null); // Если файл не выбран, сбрасываем состояние
      setImagePreview(null);
    }
  };

  // ----------------------------------
  return (
    <div className="container">
      <div className="image-upload tags-area">
        <p>Post image:</p>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <label htmlFor="image-upload">
          <Images className="images" />
        </label>
      </div>
      {imagePreview && (
        <div>
          <span>Image preview: </span>
          <img
            className="image-preview"
            src={imagePreview}
            alt="Image preview"
          />
        </div>
      )}
    </div>
  );
};
export default CreatePost;
