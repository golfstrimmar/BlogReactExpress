import React, { useState, useEffect } from "react";
import "./CreatePost.scss";
import ButtonSuccessWave from "../ButtonSuccessWave/ButtonSuccessWave";
import { useParams } from "react-router-dom";
import ModalMessage from "../ModalMessage/ModalMessage";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { ReactComponent as Images } from "../../assets/svg/images.svg";
import { useNavigate } from "react-router-dom";
import { addPost } from "../../redux/actions/postActions";
const CreatePost = () => {
  const user = useSelector((state) => state.auth.user);
  const socket = useSelector((state) => state.socket.socket);
  // const posts = useSelector((state) => state.posts.posts);
  // const { postId } = useParams();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [message, setMessage] = useState("");
  const [openModalMessage, setOpenModalMessage] = useState(false);
  const tags = ["trip", "mobile", "adventure"];
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      socket.on("postCreated", (data) => {
        console.log("===--- postCreated ---====", data.post);
        dispatch(addPost(data.post));
        setMessage(data.message);
        setOpenModalMessage(true);
        resetForm();
        setTimeout(() => {
          setOpenModalMessage(false);
          navigate("/posts");
        }, 2000);
      });

      socket.on("error", (data) => {
        console.log("===--- error ---====", data);
        setMessage(data.message, data.error);
        setOpenModalMessage(true);
        setTimeout(() => {
          setOpenModalMessage(false);
        }, 2000);
      });

      return () => {
        socket.off("postCreated");
        socket.off("error");
      };
    }
  }, [socket, navigate]);

  // Обработка изменения чекбоксов
  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setSelectedTags((prev) => [...prev, e.target.value]);
    } else {
      setSelectedTags((prev) => prev.filter((tag) => tag !== e.target.value));
    }
  };

  // Обработка выбора изображения
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Загрузка изображения на Cloudinary
  const handleImageUpload = async () => {
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
 
  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();

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
          userId: user._id,
          userName: user.userName,
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
        userId: user._id,
        userName: user.userName,
      });
    }
  };

  // Сброс формы
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
        <h2> "Create a New Post"</h2>
        <form className="createpost-form">
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
              rows="20"
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

          <ButtonSuccessWave
            type="submit"
            text={"Create Post"}
            onClick={(e) => {
              handleSubmit(e);
            }}
          />
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
