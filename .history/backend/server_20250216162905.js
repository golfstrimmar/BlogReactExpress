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
  console.log("*+* on Connection userSocketMap*+*", userSocketMap);
  console.log(
    "*+*Online users:*+*",
    onlineUsers.map((el) => ({ name: el.user?.name, count: el?.count }))
  );

  socket.emit("receiveMessages");
  socket.emit("onlineUsers", onlineUsers);
  // ==================sendMessage===============================
  socket.on("sendMessage", async (msg) => {
    try {
      const newMessage = new Message({
        text: msg.text,
        author: msg.author,
        file: msg.file,
        name: msg.name,
      });
      console.log("new message socket:", newMessage);
      await newMessage.save();
      io.emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Error sending message socket:", error);
    }
  });
  // =====updateMessage========
  socket.on("updateMessage", async (updatedMessageData) => {
    try {
      const updatedMessage = await Message.findByIdAndUpdate(
        updatedMessageData._id,
        {
          text: updatedMessageData.text,
          file: updatedMessageData.file,
          author: updatedMessageData.author,
          name: updatedMessageData.name,
        },
        { new: true } // Возвращаем обновленное сообщение
      );

      if (!updatedMessage) {
        socket.emit("error", "Message not found.");
        return;
      }

      console.log("**********Updated message:************", updatedMessage);
      io.emit("receiveMessage", updatedMessage);
    } catch (error) {
      console.error("Error updating message:", error);
      socket.emit("error", "Failed to update message.");
    }
  });
  // ======deleteMessage======
  socket.on("deleteMessage", async (mes) => {
    try {
      const message = await Message.findByIdAndDelete(mes);
      if (!message) {
        console.log("Message not found");
      } else {
        console.log("--Message deleted--:", message);
        io.emit("deleteMessage", mes);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  });
  // ============likeMessage
  socket.on("likeMessage", async (id, type) => {
    try {
      const message = await Message.findById(id);

      if (type === "positive") {
        message.positiveLikes += 1;
      } else if (type === "negative") {
        message.negativeLikes += 1;
      }
      await message.save();
      io.emit("updateMessage", message);
    } catch (error) {
      console.error("Error:", error);
    }
  });
  // ============addComment
  socket.on("addComment", async (id, comment) => {
    try {
      const message = await Message.findById(id);

      if (message) {
        message.comments.push(comment);
        await message.save();
        io.emit("updateMessage", message);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  });
  // ============commentToEdit
  socket.on("commentToEdit", (currentMessageId, commentIdToEdit) => {
    console.log("Received data:", currentMessageId, commentIdToEdit);
    Message.findById(currentMessageId)
      .then((message) => {
        if (message) {
          let comment = null;
          message.comments.forEach((el) => {
            if (
              (el) => JSON.stringify(el._id) === JSON.stringify(commentIdToEdit)
            ) {
              console.log("Found comment:", el);
              return (comment = el);
            }
          });

          if (comment) {
            comment.text = commentIdToEdit.text;
            message.save().then((updatedMessage) => {
              io.emit("updateMessage", updatedMessage);
            });
          }
        } else {
          console.log("Message not found with id:", currentMessageId);
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
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
