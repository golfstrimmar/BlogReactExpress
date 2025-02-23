import React, { useState, useEffect } from "react";
import "./CreatePost.scss";
import ButtonSuccessWave from "../ButtonSuccessWave/ButtonSuccessWave";
import ModalMessage from "../ModalMessage/ModalMessage";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { ReactComponent as Images } from "../../assets/svg/images.svg";
import { useNavigate } from "react-router-dom";
import { addPost } from "../../redux/actions/postActions";

// Типизация для user и socket
interface User {
  _id: string;
  userName: string;
}

interface Socket {
  emit: (event: string, data: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string) => void;
}

// Компонент CreatePost
const CreatePost = () => {
  const user = useSelector((state: any) => state.auth.user) as User | null;
  const socket = useSelector((state: any) => state.socket.socket) as Socket | null;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Состояние компонента
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [openModalMessage, setOpenModalMessage] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const tags = ["trip", "mobile", "adventure"];

  // Обработка событий сокета
  useEffect(() => {
    if (!socket) return;

    const handlePostCreated = (data: { post: any; message: string }) => {
      console.log("===--- postCreated ---====", data.post);
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
      console.error("===--- error ---====", data);
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
  }, [socket, navigate]);

  // Обработка изменения чекбоксов
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tag = e.target.value;
    if (e.target.checked) {
      setSelectedTags((prev) => [...prev, tag]);
    } else {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    }
  };

  // Обработка выбора изображения
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  // Загрузка изображения на Cloudinary
  const handleImageUpload = async (): Promise<string | undefined> => {
    if (!image) return;

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "blogblog");
    formData.append("cloud_name", "dke0nudcz");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dke0nudcz/image/upload",
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      setMessage("Failed to upload image.");
      setOpenModalMessage(true);
      setTimeout(() => {
        setOpenModalMessage(false);
      }, 2000);
    }
  };

  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !text) {
      setMessage("Title and text are required!");
      setOpenModalMessage(true);
      setTimeout(() => {
        setOpenModalMessage(false);
      }, 2000);
      return;
    }

    try {
      let imageUrl = "";
      if (image) {
        imageUrl = await handleImageUpload();
      }

      socket?.emit("createPost", {
        title,
        text,
        tags: selectedTags,
        imageUrl,
        userId: user?._id,
        userName: user?.userName,
      });
    } catch (error) {
      console.error("Ошибка создания поста:", error);
      setMessage("Failed to create post.");
      setOpenModalMessage(true);
      setTimeout(() => {
        setOpenModalMessage(false);
      }, 2000);
    }
  };

  // Сброс формы
  const resetForm = () => {
    setTitle("");
    setText("");
    setSelectedTags([]);
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="container">
      <div className="createpost">
        <ModalMessage message={message} open={openModalMessage} />
        <form className="createpost-form" onSubmit={handleSubmit}>
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
              rows={20}
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
                {tags.map((tag) => (
                  <div key={tag}>
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
          <ButtonSuccessWave
            type="submit"
            text={"Create Post"}
            onClick={(e) => handleSubmit(e)}
          />
        </form>
      </div>
    </div>
  );
};

export default CreatePost;