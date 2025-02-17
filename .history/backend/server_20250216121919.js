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
app.use;
cors({
  // origin: "http://localhost:3000",
  // origin: "https://react-blog-beryl-nu.vercel.app",
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// --------------------------------

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
