import React, { useState } from "react";
import "./CreatePost.scss";
import axios from "../../API/axios"; // Импортируем нашу настроенную инстанцию axios

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      title,
      text,
    };

    try {
      const response = await axios.post("/create-post", postData);
      console.log("Post created:", response.data);
      alert("Post created successfully!");
      setTitle("");
      setText("");
    } catch (error) {
      console.error("Error:", error);
      alert("Error sending the request");
    }
  };

  return (
    <div>
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Text:</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          ></textarea>
        </div>

        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
