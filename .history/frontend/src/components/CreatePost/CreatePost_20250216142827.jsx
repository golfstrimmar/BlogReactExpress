import React, { useState } from "react";
import "./CreatePost.scss";
import axios from "../../API/axios";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("===--- title ---====", title);
    console.log("===--- text ---====", text);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("text", text);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/create-post`,
        formData
      );
      alert("Post created successfully!");
      console.log(response.data);
      setTitle("");
      setText("");
    } catch (error) {
      console.error("Error:", error);
      console.log("Error sending the request");
    }
  };

  return (
    <div сlassName="createpost">
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
          <label for="text1">Title:</label>
        </div>
        <div className="textarea-field">
          <textarea
            name="textarea4"
            row="20"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          ></textarea>
          <label for="textarea4">Text:</label>
        </div>

        <button cl type="submit">Create Post</button>
        <ButtonSuccessWave/>
      </form>
    </div>
  );
};

export default CreatePost;
