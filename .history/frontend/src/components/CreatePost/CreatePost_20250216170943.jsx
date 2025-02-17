import React, { useState } from "react";
import "./CreatePost.scss";
import axios from "../../API/axios";
import ButtonSuccessWave from "../ButtonSuccessWave/ButtonSuccessWave";
import ModalMessage from "../ModalMessage/ModalMessage";
import { useSelector, useDispatch } from "react-redux";
const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [openModalMessage, setOpenModalMessage] = useState(false);
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);




  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("text", text);

    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ": " + pair[1]);
    // }
    // try {
    //   const response = await axios.post(
    //     `${process.env.REACT_APP_API_URL}/create-post`,
    //     formData
    //   );
    //   if (response) {
    //     setMessage(`Post created successfully! `);
    //     setOpenModalMessage(true);
    //     setTitle("");
    //     setText("");
    //     setTimeout(() => {
    //       setOpenModalMessage(false);
    //     }, 2000);
    //   }
    // } catch (error) {
    //   setMessage(`Error sending the request. ${error}`);
    //   setOpenModalMessage(true);
    //   setTimeout(() => {
    //     setOpenModalMessage(false);
    //   }, 5000);
    // }
  };

  return (
    <div className="container">
      <div className="createpost">
        <ModalMessage message={message} open={openModalMessage} />
        <h2>Create a New Post</h2>
        <form onSubmit={handleSubmit} className="createpost-form">
          <div className="input-field">
            <input
              name="text1"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <label htmlFor="text1">Title :</label>
          </div>
          <div className="textarea-field">
            <textarea
              name="textarea4"
              row="20"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            ></textarea>
            <label htmlFor="textarea4">Text :</label>
          </div>
          <ButtonSuccessWave type="submit" text="Create Post" />
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
