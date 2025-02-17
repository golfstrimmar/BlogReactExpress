import React, { useState, useEffect } from "react";
import "./CreatePost.scss";
import ButtonSuccessWave from "../ButtonSuccessWave/ButtonSuccessWave";
import ModalMessage from "../ModalMessage/ModalMessage";
import { useSelector } from "react-redux";
import axios from "axios";
const CreatePost = () => {
  const socket = useSelector((state) => state.socket.socket);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [message, setMessage] = useState("");
  const [openModalMessage, setOpenModalMessage] = useState(false);
  const tags = ["trip", "mobile", "adventure"];
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  // ---------------------------

  // ---------------------------
  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setSelectedTags((prev) => [...prev, e.target.value]);
    } else {
      setSelectedTags((prev) => prev.filter((tag) => tag !== e.target.value));
    }
  };

  // ---------------------------

  useEffect(() => {
    if (socket) {
      socket.on("postCreated", (data) => {
        console.log(data.message);
        setMessage("Post created successfully!");
        setOpenModalMessage(true);
        setTitle("");
        setText("");
        setSelectedTags([]);
        setImage(null);
        setImagePreview(null);
        setImageUrl(null);
        setTimeout(() => {
          setOpenModalMessage(false);
        }, 2000);
      });
      socket.on("error", (data) => {
        console.log(data.message);
        setMessage("Error creating post");
        setOpenModalMessage(true);
        setTitle("");
        setText("");
        setTimeout(() => {
          setOpenModalMessage(false);
        }, 2000);
      });
    }
  }, [socket]);
  // ---------------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  // ---------------------------------
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
          "Cloudinary response imageUrl:",
          imageResponse.data.secure_url
        );
        const imageUrl = imageResponse.data.secure_url;
        setImageUrl(imageUrl);
        console.log("Updated imageUrl state:", imageUrl);
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
  useEffect(() => {
    if (imageUrl) {
      console.log("Submitting with imageUrl:", imageUrl);
      socket.emit("createPost", {
        title,
        text,
        tags: selectedTags,
        imageUrl,
      });
    }
  }, [imageUrl]);
  // ---------------------------------
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

    // Если изображение есть, загружаем его
    if (image) {
      await handleImageUpload(); // Дожидаемся завершения загрузки изображения
    } else {
      // Если изображения нет, отправляем только текст и теги
      console.log("Emitting createPost with:", { title, text, selectedTags });
      socket.emit("createPost", { title, text, tags: selectedTags });
    }
  };

  return (
    <div className="container">
      <div className="createpost">
        <ModalMessage message={message} open={openModalMessage} />
        <h2>Create a New Post</h2>
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
                    required
                  />
                  <label htmlFor={tag}>{tag}</label>
                </div>
              ))}
            </div>
          </div>
          {/* Кастомизированное поле для загрузки изображения */}
          <label htmlFor="image-upload">
            <button>{image ? "Image Selected" : "Choose Image"}</button>
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && <img сlassName="image-preview" src={imagePreview} alt="Image preview" />}
          <ButtonSuccessWave
            type="submit"
            onClick={handleSubmit}
            text="Create Post"
          />
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
