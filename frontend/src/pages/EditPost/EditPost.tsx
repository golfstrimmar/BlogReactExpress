import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EditPost.scss";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { ReactComponent as Images } from "../../assets/svg/images.svg";
import ModalMessage from "../../components/ModalMessage/ModalMessage";
import axios from "axios";
import ButtonSuccessWave from "../../components/ButtonSuccessWave/ButtonSuccessWave";
import { editPost } from "../../redux/actions/postActions";

// Типизация User и Post
interface User {
  _id?: string;
  userName?: string;
}

interface Post {
  _id: string;
  imageUrl: string;
  user: string;
  userName: string;
  title: string;
  text: string;
  tags: string[];
  positiveLikes: number;
  negativeLikes: number;
  viewsCount: number;
  createdAt: string;
}

const EditPost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.auth.user) as User;
  const socket = useSelector((state: any) => state.socket.socket);
  const posts = useSelector((state: any) => state.posts.posts);
  const { postId } = useParams();

  // Типизация состояния
  const [posToEdit, setPostToEdit] = useState<Post | null>(null);
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [openModalMessage, setOpenModalMessage] = useState<boolean>(false);

  const [image, setImage] = useState<File | null>(null); // Уточнили тип
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const tags = ["trip", "mobile", "adventure"];

  // Загрузка данных для редактирования
  useEffect(() => {
    if (postId) {
      const foundPost = posts.find((p: Post) => p._id === postId);
      if (foundPost) {
        setPostToEdit(foundPost);
        setTitle(foundPost.title);
        setText(foundPost.text);
        setImagePreview(foundPost.imageUrl || null);
        setImageUrl(foundPost.imageUrl || null);
        setSelectedTags(foundPost.tags || []);
      }
    }
  }, [posts, postId]);

  // Соединение с сокетом для обработки событий
  useEffect(() => {
    if (socket) {
      socket.on("PostEdited", (data: { post: Post; message: string }) => {
        console.log("===--- PostEdited from server ---====", data);
        setMessage(data.message);
        setOpenModalMessage(true);
        resetForm();
        setTimeout(() => {
          dispatch(editPost(data.post));
          setOpenModalMessage(false);
          setMessage("");
          navigate("/posts");
        }, 2000);
      });

      socket.on("error", (data: { message: string }) => {
        setMessage(data.message);
        setOpenModalMessage(true);
        setTimeout(() => {
          setOpenModalMessage(false);
        }, 2000);
      });

      return () => {
        socket.off("PostEdited");
        socket.off("error");
      };
    }
  }, [socket, navigate, dispatch]);

  // Сброс формы
  const resetForm = () => {
    setTitle("");
    setText("");
    setSelectedTags([]);
    setImage(null);
    setImagePreview(null);
    setImageUrl(null);
  };

  // Обработка изменений чекбоксов
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      setSelectedTags((prev) => [...prev, target.value]);
    } else {
      setSelectedTags((prev) => prev.filter((tag) => tag !== target.value));
    }
  };

  // Обработка изменения изображения
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0]; // Получаем первый файл
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

  // Загрузка изображения на Cloudinary
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

  // Обработка отправки формы
  const handleSubmit = async (
    e?:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (e && e.preventDefault) {
      e.preventDefault();
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
        const newImageUrl = await handleImageUpload();
        if (newImageUrl) {
          socket.emit("PostEdit", {
            newPost: { _id: posToEdit?._id },
            title,
            text,
            tags: selectedTags,
            imageUrl: newImageUrl,
            userId: user._id,
            userName: user.userName,
          });
        }
      } catch (error) {
        console.error("Ошибка загрузки изображения:", error);
      }
    } else {
      socket.emit("PostEdit", {
        newPost: { _id: posToEdit?._id },
        title,
        text,
        tags: selectedTags,
        imageUrl: imageUrl,
        userId: user._id,
        userName: user.userName,
      });
    }
  };

  return (
    <div className="editpost">
      <ModalMessage message={message} open={openModalMessage} />
      <div className="container">
        <h2>Edit Post</h2>
        <form className="editpost-form createpost-form">
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
          <ButtonSuccessWave text={"Save Changes"} onClick={handleSubmit} />
        </form>
      </div>
    </div>
  );
};

export default EditPost;
