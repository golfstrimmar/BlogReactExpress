import express from "express";
import http from "http";
import { connectDB } from "./config/db.js";
import multer from "multer";
import Post from "./models/Post.js";
import { Server } from "socket.io";
// =====================================
// =====================================
// =====================================
// =====================================
// =====================================
// Настройка multer для обработки form-data
const storage = multer.memoryStorage(); // Храним файлы в памяти (если нужно обработать файлы)
const upload = multer({ storage });
connectDB();
// =====================================
// =====================================
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});
// =====================================
// =====================================
// Middleware для логирования запроса
app.use((req, res, next) => {
  console.log(
    `Incoming request:  method=${req.method} url=${req.url}   body=${
      req.body
    }    body=${JSON.stringify(req.body, null, 2)}`
  );
  next();
});

// ===================================
// Обработка сокет-соединений
io.on("connection", (socket) => {
  console.log(`*******************************************************`);
  console.log(`on Connection id: ${socket.id}`);
  console.log(`*******************************************************`);

  Post.find({})
    .then((posts) => {
      socket.emit("allPosts", posts);
    })
    .catch((err) => {
      console.error("Error fetching posts:", err);
      socket.emit("error", { message: "Error loading posts" });
    });

  socket.on("createPost", async (data) => {
    const { title, text, tags, imageUrl } = data;
    if (!title || !text) {
      socket.emit("error", { message: "Title and text are required" });
      return;
    }
    try {
      const newPost = new Post({
        title,
        text,
        tags,
        imageUrl,
      });
      await newPost.save();
      const post = await Post.findById(newPost._id);
      socket.emit("postCreated", {
        message: "Post created successfully!",
        post: post,
      });
    } catch (error) {
      socket.emit("error", {
        message: "Error creating post",
        error: error.message,
      });
    }
  });
  socket.on("positvePostAdd", async (post) => {
    const { positiveLikes } = data;
    try {
      const newPost = {post.positiveLikes = positiveLikes +=1 };
      await newPost.save();
      const post = await Post.findById(newPost._id);
      socket.emit("postCreated", {
        message: "Post created successfully!",
        post: post,
      });
    } catch (error) {
      socket.emit("error", {
        message: "Error creating post",
        error: error.message,
      });
    }
  });

  // ====Обработка отключения сокета=======
  socket.on("disconnect", () => {
    console.log(`Socket with ID ${socket.id} disconnected`);
  });
});

// ===================================
// Отправка простого сообщения на клиент
app.get("/", (req, res) => {
  res.send("<h1>Hello from the WebSocket server 5000!</h1>");
});

// Запуск сервера
server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
