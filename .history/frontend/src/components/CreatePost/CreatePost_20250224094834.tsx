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
interface SocketData {
  post: Post;
  message: string;
  error?: string; // Опциональное поле для ошибок
}
const CreatePost: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user as User);
  const socket = useSelector((state: any) => state.socket.socket);
 const socket = useSelector((state: RootState) => state.socket);
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
  const handleImageUpload = async (): Promise<string | undefined> => {
    if (image) {
      const imageFormData = new FormData();
      imageFormData.append("file", image);
      imageFormData.append("upload_preset", "blogblog");
      imageFormData.append("cloud_name", "dke0nudcz");

      try {
        const imageResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dke0nudcz/image/upload",
          imageFormData
        );
        console.log(
          "===--- imageResponse ---====",
          imageResponse.data.secure_url
        );
        return imageResponse.data.secure_url;
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        setMessage("Failed to upload image.");
        setOpenModalMessage(true);
        setTimeout(() => {
          setOpenModalMessage(false);
        }, 2000);
      }
    }
  };
  // --------------------------------------------
  const handleSubmit = async (
    e?:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (e && e.preventDefault) {
      e.preventDefault(); // Проверяем наличие метода preventDefault
    }

    if (!title || !text) {
      setMessage("Title and text are required!");
      setOpenModalMessage(true);
      setTimeout(() => {
        setOpenModalMessage(false);
      }, 2000);
      return;
    }

    if (image) {
      try {
        // Дожидаемся завершения загрузки изображения
        const imageUrl = await handleImageUpload();
        console.log("===--- imageUrl ---====", imageUrl);
        socket.emit("createPost", {
          title,
          text,
          tags: selectedTags,
          imageUrl: imageUrl,
          userId: user?._id,
          userName: user?.userName,
        });
      } catch (error) {
        console.error("Ошибка загрузки изображения:", error);
      }
    } else {
      socket.emit("createPost", {
        title,
        text,
        tags: selectedTags,
        imageUrl: "",
        userId: user?._id,
        userName: user?.userName,
      });
    }
  };

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

  // ----------------------------------
  // ----------------------------------
  const resetForm = () => {
    setTitle("");
    setText("");
    setSelectedTags([]);
    setImage(null);
    setImagePreview(null);
    setImageUrl(null);
  };
  // ----------------------------------
  return (
    <div className="createpost">
      <ModalMessage message={message} open={openModalMessage} />
      <div className="container">
        <form className="createpost-form">
          <h2>Create a New Post</h2>
          <div className="input-field">
            <input
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <label htmlFor="title">Title:</label>
          </div>
          <div className="textarea-field">
            <textarea
              name="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            ></textarea>
            <label htmlFor="text">Text:</label>
          </div>
          <div className="createpost-info">
            <div className="tags-area">
              <p>Tags:</p>
              <div className="fildset-checkbox">
                {tags.map((tag, index) => (
                  <div key={index}>
                    <input
                      id={tag}
                      name={tag}
                      type="checkbox"
                      value={tag}
                      onChange={handleCheckboxChange}
                      checked={selectedTags.includes(tag)}
                    />
                    <label htmlFor={tag}>{tag}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="createpost-author">Author: {user?.userName}</div>
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
                <ImagesIcon className="images" />
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
          {/* <button
            // text={"Create Post"}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              handleSubmit(e);
            }}
          >
            Create Post
          </button> */}
          <ButtonSuccessWave
            text={"Create Post"}
            onClick={handleSubmit}
          ></ButtonSuccessWave>
        </form>
      </div>
    </div>
  );
};
export default CreatePost;
