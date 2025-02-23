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

// Типизация состояния
interface CreatePostState {
  title: string;
  text: string;
  selectedTags: string[];
  message: string;
  openModalMessage: boolean;
  image: File | null;
  imagePreview: string | null;
  imageUrl: string | null;
}

const CreatePost = () => {
  const user = useSelector((state: any) => state.auth.user) as User;
  const socket = useSelector((state: any) => state.socket.socket) as Socket;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Используем useState с типом CreatePostState
  const [state, setState] = useState<CreatePostState>({
    title: "",
    text: "",
    selectedTags: [],
    message: "",
    openModalMessage: false,
    image: null,
    imagePreview: null,
    imageUrl: null,
  });

  // Используем useEffect для работы с сокетом
  useEffect(() => {
    if (socket) {
      socket.on("postCreated", (data: { post: any; message: string }) => {
        console.log("===--- postCreated ---====", data.post);
        dispatch(addPost(data.post));
        setState((prevState) => ({
          ...prevState,
          message: data.message,
          openModalMessage: true,
        }));
        resetForm();
        setTimeout(() => {
          setState((prevState) => ({
            ...prevState,
            openModalMessage: false,
          }));
          navigate("/posts");
        }, 2000);
      });

      socket.on("error", (data: { message: string; error: string }) => {
        console.log("===--- error ---====", data);
        setState((prevState) => ({
          ...prevState,
          message: `${data.message}: ${data.error}`,
          openModalMessage: true,
        }));
        setTimeout(() => {
          setState((prevState) => ({
            ...prevState,
            openModalMessage: false,
          }));
        }, 2000);
      });

      return () => {
        socket.off("postCreated");
        socket.off("error");
      };
    }
  }, [socket, navigate]);

  // Обработка изменения чекбоксов
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tag = e.target.value;
    const checked = e.target.checked;

    setState((prevState) => ({
      ...prevState,
      selectedTags: checked
        ? [...prevState.selectedTags, tag]
        : prevState.selectedTags.filter((t) => t !== tag),
    }));
  };

  // Обработка выбора изображения
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setState((prevState) => ({
      ...prevState,
      image: file,
      imagePreview: file ? URL.createObjectURL(file) : null,
    }));
  };

  // Загрузка изображения на Cloudinary
  const handleImageUpload = async (): Promise<string | undefined> => {
    const { image } = state;
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
        return imageResponse.data.secure_url;
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        setState((prevState) => ({
          ...prevState,
          message: "Failed to upload image.",
          openModalMessage: true,
        }));
        setTimeout(() => {
          setState((prevState) => ({
            ...prevState,
            openModalMessage: false,
          }));
        }, 2000);
      }
    }
  };

  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { title, text, selectedTags, image } = state;

    if (!title || !text) {
      setState((prevState) => ({
        ...prevState,
        message: "Title and text are required!",
        openModalMessage: true,
      }));
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          openModalMessage: false,
        }));
      }, 2000);
      return;
    }

    if (image) {
      try {
        const imageUrl = await handleImageUpload();
        socket.emit("createPost", {
          title,
          text,
          tags: selectedTags,
          imageUrl,
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

  // Сброс формы
  const resetForm = () => {
    setState({
      title: "",
      text: "",
      selectedTags: [],
      message: "",
      openModalMessage: false,
      image: null,
      imagePreview: null,
      imageUrl: null,
    });
  };

  const { title, text, selectedTags, message, openModalMessage, imagePreview } =
    state;
  const tags = ["trip", "mobile", "adventure"];

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
              onChange={(e) => setState({ ...state, title: e.target.value })}
              required
            />
            <label htmlFor="title">Title:</label>
          </div>
          <div className="textarea-field">
            <textarea
              name="text"
              rows={20}
              value={text}
              onChange={(e) => setState({ ...state, text: e.target.value })}
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

          <ButtonSuccessWave text={"Create Post"} onClick={handleSubmit} />
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
