import React, { useState } from "react";
import "./CreatePost.scss";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвратить перезагрузку страницы при отправке формы

    const postData = {
      title,
      text,
    };

    try {
      // Отправка данных на сервер
      const response = await fetch("http://localhost:5000/create-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Post created:", result);
        alert("Post created successfully!");
        // Очищаем форму после успешного создания поста
        setTitle("");
        setText("");
      } else {
        alert("Error creating post");
      }
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
