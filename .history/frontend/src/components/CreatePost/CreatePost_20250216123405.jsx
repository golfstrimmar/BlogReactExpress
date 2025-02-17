
import React from 'react';
import './CreatePost.scss';

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
   const handleSubmit = async (e) => {
     e.preventDefault(); // Предотвратить перезагрузку страницы при отправке формы

     const postData = {
       title,
       text,
       tags: tags.split(",").map((tag) => tag.trim()), // Преобразуем строку тегов в массив
       imageUrl,
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
         setTags("");
         setImageUrl("");
       } else {
         alert("Error creating post");
       }
     } catch (error) {
       console.error("Error:", error);
       alert("Error sending the request");
     }
   };
  return (
    <div className="createpost">
        <div className="createpost-">
            <div className="createpost-"></div>
            <div className="createpost-"></div>
            <div className="createpost-"></div>
        </div>
    </div>
  );
};

export default CreatePost;
  