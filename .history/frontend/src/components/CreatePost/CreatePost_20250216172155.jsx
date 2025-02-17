import React, { useState } from "react";
import "./CreatePost.scss";
import ButtonSuccessWave from "../ButtonSuccessWave/ButtonSuccessWave";
import ModalMessage from "../ModalMessage/ModalMessage";
import { useSelector } from "react-redux";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [openModalMessage, setOpenModalMessage] = useState(false);

  // Доступ к сокету из Redux Store
  const socket = useSelector((state) => state.socket.socket);
  useEffect(() => {
    if (socket) {
      socket.on("postCreated", (data) => {
        console.log(data);
      });
    }
  }, [socket]);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("===--- title ---====", title);
    console.log("===--- text ---====", text);
    if (!title || !text) {
      setMessage("Title and text are required!");
      setOpenModalMessage(true);
      setTimeout(() => {
        setOpenModalMessage(false);
        return;
      }, 2000);
    }

    socket.emit("createPost", { title, text }, (response) => {
      if (response) {
        setMessage("Post created successfully!");
        setOpenModalMessage(true);
        setTitle("");
        setText("");
        setTimeout(() => {
          setOpenModalMessage(false);
        }, 2000);
      } else if (response && response.message) {
        setMessage(response.message);
        setOpenModalMessage(true);
        setTimeout(() => {
          setOpenModalMessage(false);
        }, 5000);
      }
    });
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
          <ButtonSuccessWave type="submit" text="Create Post" />
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
