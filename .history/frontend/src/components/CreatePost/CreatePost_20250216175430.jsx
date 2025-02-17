import React, { useState, useEffect } from "react";
import "./CreatePost.scss";
import ButtonSuccessWave from "../ButtonSuccessWave/ButtonSuccessWave";
import ModalMessage from "../ModalMessage/ModalMessage";
import { useSelector } from "react-redux";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [openModalMessage, setOpenModalMessage] = useState(false);
  const tags = ["trip", "mobile", "adventure"];

  // Доступ к сокету из Redux Store
  const socket = useSelector((state) => state.socket.socket);
  useEffect(() => {
    if (socket) {
      socket.on("postCreated", (data) => {
        console.log(data.message);
        setMessage("Post created successfully!");
        setOpenModalMessage(true);
        setTitle("");
        setText("");
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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !text) {
      setMessage("Title and text are required!");
      setOpenModalMessage(true);
      setTimeout(() => {
        setOpenModalMessage(false);
        return;
      }, 2000);
    }
    socket.emit("createPost", { title, text });
  };

  return (
    <div className="container">
      <div className="createpost">
        <ModalMessage message={message} open={openModalMessage} />
        <h2>Create a New Post</h2>
        <form onSubmit={handleSubmit} className="createpost-form">
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
           <div className="fildset-checkbox">
          {tags.map((tag, index) => (
            <p key={index}>{tag}</p>
           
  <div className="form-check">
    input#5(type='checkbox' name="")
    label(for='5') Любимое место</div>
  .form-check
    input#6(type='checkbox' name="")
    label(for='6') Месторасположение
  .form-check
    input#7(type='checkbox' name="")
    label(for='7') Гость торжественного события
  .form-check
    input#8(type='checkbox' name="")
    label(for='8') Корпоративные мероприятия
  .form-check
    input#9(type='checkbox' name="")
    label(for='9') СПА комплекс</div>
          ))}
          <ButtonSuccessWave type="submit" text="Create Post" />
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
