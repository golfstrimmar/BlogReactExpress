import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import multer from "multer";
import Post from "./models/Post.js";

// Настройка multer для обработки form-data без файлов
const upload = multer(); // multer с без хранения файлов, только для парсинга формы
connectDB();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ----------расшифровка запроса
app.use((req, res, next) => {
  console.log(
    `Incoming request: method=${req.method} url=${
      req.url
    } body=${JSON.stringify(req.body)}`
  );
  next();
});

// Маршрут для создания нового поста
app.post("/create-post", upload.none(), async (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(400).json({ message: "Title and text are required" });
  }

  try {
    // Создаём новый пост с помощью модели Post
    const newPost = new Post({
      title,
      text,
    });

    // Сохраняем новый пост в базе данных
    await newPost.save();

    // Отправляем успешный ответ
    res
      .status(201)
      .json({ message: "Post created successfully!", post: newPost });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
});

// Старт сервера
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
