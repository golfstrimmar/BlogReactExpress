import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
// import postRoutes from "./routes/postRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import commentRoutes from "./routes/commentRoutes.js";
import multer from "multer";
import Post from "./models/Post.js";
const upload = multer();
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

// --------------------------------
// Маршрут для создания нового поста
app.post("/create-post", async (req, res) => {
  const { title, text, tags, user, imageUrl } = req.body;

  try {
    // Создаём новый пост с помощью модели Post
    const newPost = new Post({
      title,
      text,
      tags,
      user,
      imageUrl,
    });

    // Сохраняем новый пост в базе данных
    await newPost.save();

    // Отправляем успешный ответ
    res.status(201).json({ message: "Post created successfully!", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error: error.message });
  }
});
// -------------------------------------
// расшифровка запроса
app.use((req, res, next) => {
  // console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log(
    `Incoming request:  method=${req.method} url=${req.url}   body=${
      req.body
    }    body=${JSON.stringify(req.body, null, 2)}`
  );
  next();
});
// вывод сообщения в браузер при пустом запросе. ничего не делает. просто индикация запуска сервера
app.get("/", (req, res) => {
  res.send("<h1>Hello from the server 5000!</h1>");
});
// app.use('/posts', postRoutes);
// Обработка маршрута
// app.use(
//   "/posts",
//   upload.none(),
//   (req, res, next) => {
//     console.log("Body content:", req.body); // Данные формы
//     next();
//   },
//   postRoutes
// );
// app.use("/auth", userRoutes);
// app.use("/comments", commentRoutes);
// app.use("/uploads", express.static("uploads"));
// --------------------------------
// --------------------------------
// --------------------------------
// --------------------------------
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
