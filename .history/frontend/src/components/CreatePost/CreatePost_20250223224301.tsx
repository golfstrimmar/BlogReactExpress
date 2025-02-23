import React, { useState, useEffect, useCallback } from "react";
import "./CreatePost.scss";
import ButtonSuccessWave from "../ButtonSuccessWave/ButtonSuccessWave";
import ModalMessage from "../ModalMessage/ModalMessage";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Images from "../../assets/svg/images.svg";
import { useNavigate } from "react-router-dom";
import { addPost } from "../../redux/actions/postActions";

// Типизация для user и socket
interface User {
  _id: string;
  userName: string;
}

interface Socket extends SocketIOClient.Socket {
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

interface ModalMessageProps {
  message: string;
  open: boolean;
  onClose: () => void;
}

const CreatePost = () => {
  const user = useSelector((state: any) => state.auth.user) as User;
  const socket = useSelector((state: any) => state.socket.socket) as Socket;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Состояние компонента
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

  // Очистка превью изображения при размонтировании компонента
  useEffect(() => {
    return () => {
      if (state.imagePreview) {
        URL.revokeObjectURL(state.imagePreview);
      }
    };
  }, [state.imagePreview]);

  // Обработка событий сокета
  useEffect(() => {
    if (!socket) return;

    const handlePostCreated = (data: { post: any; message: string }) => {
      console.log("===--- postCreated data.post---====", data.post);
      console.log("===--- postCreated data.message---====", data.message);
      dispatch(addPost(data.post));
      resetForm();
      setState((prevState) => ({
        ...prevState,
        message: data.message,
        openModalMessage: true,
      }));
      setTimeout(() => {
        closeModal();
        navigate("/posts");
      }, 2000);
    };

    const handleError = (data: { message: string; error: string }) => {
      console.error("===--- error ---====", data);
      setState((prevState) => ({
        ...prevState,
        message: `${data.message}: ${data.error}`,
        openModalMessage: true,
      }));
      setTimeout(closeModal, 2000);
    };

    socket.on("postCreated", handlePostCreated);
    socket.on("error", handleError);

    return () => {
      socket.off("postCreated", handlePostCreated);
      socket.off("error", handleError);
    };
  }, [socket, navigate]);

  // Обработчики изменений
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setState((prevState) => ({ ...prevState, title: e.target.value })),
    []
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      setState((prevState) => ({ ...prevState, text: e.target.value })),
    []
  );

  const handleCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const tag = e.target.value;
      const checked = e.target.checked;
      setState((prevState) => ({
        ...prevState,
        selectedTags: checked
          ? [...prevState.selectedTags, tag]
          : prevState.selectedTags.filter((t) => t !== tag),
      }));
    },
    []
  );

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setState((prevState) => ({
          ...prevState,
          image: file,
          imagePreview: previewUrl,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          image: null,
          imagePreview: null,
        }));
      }
    },
    []
  );

  // Загрузка изображения на Cloudinary
  const handleImageUpload = useCallback(async (): Promise<
    string | undefined
  > => {
    const { image } = state;
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
      setState((prevState) => ({
        ...prevState,
        message: "Failed to upload image.",
        openModalMessage: true,
      }));
      setTimeout(closeModal, 2000);
    }
  }, [state.image]);

  // Отправка формы
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const { title, text, selectedTags, image } = state;

      if (!title || !text) {
        setState((prevState) => ({
          ...prevState,
          message: "Title and text are required!",
          openModalMessage: true,
        }));
        setTimeout(closeModal, 2000);
        return;
      }

      try {
        let imageUrl = "";
        if (image) {
          imageUrl = await handleImageUpload();
          if (!imageUrl) throw new Error("Image upload failed.");
        }

        socket.emit("createPost", {
          title,
          text,
          tags: selectedTags,
          imageUrl,
          userId: user._id,
          userName: user.userName,
        });
      } catch (error) {
        console.error("Ошибка при создании поста:", error);
        setState((prevState) => ({
          ...prevState,
          message: "Failed to create post.",
          openModalMessage: true,
        }));
        setTimeout(closeModal, 2000);
      }
    },
    [state, handleImageUpload, socket, user]
  );

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

  // Закрытие модального окна
  const closeModal = () => {
    setState((prevState) => ({
      ...prevState,
      openModalMessage: false,
    }));
  };

  // Деструктуризация состояния
  const { title, text, selectedTags, message, openModalMessage, imagePreview } =
    state;

  const tags = ["trip", "mobile", "adventure"];

  return (
    <div className="container">
      <div className="createpost">
        <ModalMessage
          message={message}
          open={openModalMessage}
          onClose={closeModal}
        />
        <form className="createpost-form" onSubmit={handleSubmit}>
          <h2>Create a New Post</h2>
          <div className="input-field">
            <input
              name="title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              required
            />
            <label htmlFor="title">Title:</label>
          </div>
          <div className="textarea-field">
            <textarea
              name="text"
              rows={20}
              value={text}
              onChange={handleTextChange}
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
            <div className="createpost-author">Author: {user.userName}</div>
            <div className="image-upload tags-area">
              <p>Post image:</p>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <label htmlFor="image-upload" aria-label="Upload post image">
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
