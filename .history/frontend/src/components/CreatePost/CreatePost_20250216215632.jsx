import React, { useState, useEffect } from "react";
import "./CreatePost.scss";
import ButtonSuccessWave from "../ButtonSuccessWave/ButtonSuccessWave";
import ModalMessage from "../ModalMessage/ModalMessage";
import { useSelector } from "react-redux";

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
  // ---------------------------

  useEffect(() => {
    selectedTags.map((el) => console.log("Selected tag:", el)); // Выводим выбранные теги для отладки
  }, [selectedTags]);

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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !text) {
      setMessage("Title and text are required!");
      setOpenModalMessage(true);
      setTimeout(() => {
        setOpenModalMessage(false);
      }, 2000);
      return;
    }

    // Проверим, что данные корректные перед отправкой
    console.log("Emitting createPost with:", {
      title,
      text,
      selectedTags,
    });
    socket.emit("createPost", { title, text, tags: selectedTags });
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
            <Button
              variant="outlined"
              component="span"
              sx={{ width: "100%", marginBottom: 2 }}
            >
              {image ? "Image Selected" : "Choose Image"}
            </Button>
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            sx={{ visibility: "hidden", position: "absolute" }}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Image preview"
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          )}
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
