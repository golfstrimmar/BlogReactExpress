import React, { useState } from "react";
import "./CreatePost.scss";
import axios from "../../API/axios"; // Импортируем нашу настроенную инстанцию axios

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвратить перезагрузку страницы при отправке формы

    const postData = {
      title,
      text,
    };

    try {
      // Отправка данных на сервер с использованием axios
      const response = await axios.post("/create-post", postData); // Путь будет относительным, т.к. базовый URL уже настроен в инстансе axios

      // Если запрос успешен
      console.log("Post created:", response.data);
      alert("Post created successfully!");

      // Очистим форму после отправки
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
