import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
// import postRoutes from "./routes/postRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import commentRoutes from "./routes/commentRoutes.js";
import multer from "multer";
import Post from "./models/Post.js";

// Настройка multer для обработки form-data
const storage = multer.memoryStorage(); // Храним файлы в памяти (если нужно обработать файлы)
const upload = multer({ storage });
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
    `Incoming request:  method=${req.method} url=${req.url}   body=${
      req.body
    }    body=${JSON.stringify(req.body, null, 2)}`
  );
  next();
});
// --------------------------------
// ===================================
io.on("connection", (socket) => {
  console.log(`*******************************************************`);
  console.log(`*+*on Connection id:*+* ${socket.id}`);
  // ==================sendMessage===============================
  // socket.on("sendMessage", async (msg) => {
  //   try {
  //     const newMessage = new Message({
  //       text: msg.text,
  //       author: msg.author,
  //       file: msg.file,
  //       name: msg.name,
  //     });
  //     console.log("new message socket:", newMessage);
  //     await newMessage.save();
  //     io.emit("receiveMessage", newMessage);
  //   } catch (error) {
  //     console.error("Error sending message socket:", error);
  //   }
  // });
});

// --------------------------------
// Маршрут для создания нового поста
app.post("/create-post", upload.none(), async (req, res) => {
  const { title, text } = req.body;
  if (!title || !text) {
    return res.status(400).json({ message: "Title and text are required" });
  }
  try {
    const newPost = new Post({
      title,
      text,
    });
    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully!", post: newPost });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
});
// -------------------------------------

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
