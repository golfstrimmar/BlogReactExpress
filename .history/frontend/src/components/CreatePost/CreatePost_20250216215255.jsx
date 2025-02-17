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
 if (image) {
      try {
        const imageFormData = new FormData();
        imageFormData.append('file', image);
        imageFormData.append('upload_preset', 'blogblog'); // Замените на ваш upload_preset из Cloudinary
        imageFormData.append('cloud_name', 'dke0nudcz'); // Замените на ваш cloud_name
        // Отправляем изображение в Cloudinary
        const imageResponse = await axios.post('https://api.cloudinary.com/v1_1/dke0nudcz/image/upload', imageFormData);
        const imageUrl = imageResponse.data.secure_url;
        formData.append('imageUrl', imageUrl); // Добавляем URL изображения в данные формы
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        setErrorMessage('Failed to upload image.');
        setIsSubmitting(false);
        return;
      }
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
