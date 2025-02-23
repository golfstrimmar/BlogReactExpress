import express from "express";
import http from "http";
import { connectDB } from "./config/db.js";
import multer from "multer";
import Post from "./models/Post.js";
import User from "./models/User.js";
import Comment from "./models/Comment.js";
import { Server } from "socket.io";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
// =====================================
// =====================================
// =====================================
// =====================================
// =====================================
// Настройка Google OAuth2Client для верификации токенов
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Ваш Google Client ID

// =====================================
// =====================================
// Настройка multer для обработки form-data
const storage = multer.memoryStorage(); // Храним файлы в памяти (если нужно обработать файлы)
const upload = multer({ storage });
connectDB();
dotenv.config(); // Загружаем переменные окружения из .env файла
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

// ===================================
app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Code is required");
  }

  try {
    // Обмен кода на токены
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET, // Добавьте секрет в .env
      redirect_uri: "http://localhost:5000/auth/google/callback", // Измените на порт сервера
      grant_type: "authorization_code",
    });

    const { access_token, id_token } = response.data;

    // Верификация id_token
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const userName = payload.name;
    const googleId = payload.sub;
    const avatarUrl = payload.picture || null;

    // Проверка или создание пользователя
    let user = await User.findOne({ email });
    if (!user) {
      const avatarBase64 = avatarUrl
        ? await downloadAvatarAsBase64(avatarUrl)
        : null;
      user = new User({
        email,
        userName,
        avatar: avatarBase64,
        googleId,
      });
      await user.save();
    }

    // Генерация JWT
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    // Перенаправление на фронтенд с токеном
    res.redirect(`http://localhost:3000/dashboard?token=${jwtToken}`);
  } catch (error) {
    console.error("Google callback error:", error);
    res.status(500).send("Authentication failed");
  }
});
// ===================================
// Обработка сокет-соединений
io.on("connection", (socket) => {
  console.log(`*******************************************************`);
  console.log(`User connected: ${socket.user?.userId}`);
  console.log(`*******************************************************`);
  // ======================
  Post.find({})
    .then((posts) => {
      socket.emit("allPosts", posts);
    })
    .catch((err) => {
      console.error("Error fetching posts:", err);
      socket.emit("error", { message: "Error loading posts" });
    });
  Comment.find({})
    .then((comments) => {
      socket.emit("allComments", comments);
    })
    .catch((err) => {
      console.error("Error fetching comments:", err);
      socket.emit("error", { message: "Error loading comments" });
    });
  // ======================

  // ======================
  socket.on("createPost", async (data) => {
    const { title, text, tags, imageUrl, userId, userName } = data;

    if (!title || !text || !userId) {
      socket.emit("error", {
        message: "Title, text and user ID are required",
      });
      return;
    }

    try {
      const userExists = await User.exists({ _id: userId });
      if (!userExists) {
        socket.emit("error", { message: "User not found" });
        return;
      }

      const newPost = new Post({
        title,
        text,
        tags,
        imageUrl,
        user: userId,
        userName: userName,
      });

      await newPost.save();

      const post = await Post.findById(newPost._id);

      socket.emit("postCreated", {
        message: "Post created successfully!",
        post: post,
      });
    } catch (error) {
      console.error("Error creating post:", error);
      socket.emit("error", {
        message: "Error creating post",
        error: error.message,
      });
    }
  });
  // ======================
  socket.on("PostEdit", async (data) => {
    try {
      console.log("===--- PostEdit - Incoming data ---====", data);

      // Проверяем наличие ID поста
      if (!data.newPost?._id) {
        socket.emit("error", {
          message: "No post ID provided",
          error: "Missing _id in data",
        });
        return;
      }

      // Ищем пост по ID
      let post = await Post.findById(data.newPost._id);
      if (!post) {
        socket.emit("error", {
          message: "Post not found",
          error: "No post with the provided ID",
        });
        return;
      }

      // Обновляем данные поста
      const updateQuery = {};
      if (data.title !== undefined) updateQuery.title = data.title;
      if (data.text !== undefined) updateQuery.text = data.text;
      if (data.tags !== undefined) updateQuery.tags = data.tags;

      // Обновляем изображение только если оно передано
      if (data.imageUrl !== undefined && data.imageUrl !== post.imageUrl) {
        updateQuery.imageUrl = data.imageUrl;
      }

      // Обновляем счетчики (просмотры, лайки, дизлайки)
      if (data.viewsCount === true) {
        updateQuery.$inc = { viewsCount: 1 };
      } else if (data.positive === true) {
        updateQuery.$inc = { positiveLikes: 1 };
      } else if (data.positive === false) {
        updateQuery.$inc = { negativeLikes: 1 };
      }

      // Обновляем пост
      let updatedPost = null;
      if (Object.keys(updateQuery).length > 0) {
        updatedPost = await Post.findByIdAndUpdate(
          data.newPost._id,
          updateQuery,
          { new: true }
        );
      } else {
        updatedPost = post; // Если нет данных для обновления, возвращаем текущий пост
      }

      console.log("===--- Updated Post ---====", updatedPost);

      if (!updatedPost) {
        socket.emit("error", {
          message: "Failed to update post",
          error: "Post update failed",
        });
        return;
      }

      // Отправляем успешный ответ
      socket.emit("PostEdited", {
        message: "Post updated successfully!",
        post: updatedPost,
      });
    } catch (error) {
      console.error("Error updating post:", error);
      socket.emit("error", {
        message: "Error updating post",
        error: error.message,
      });
    }
  });
  // ======================
  socket.on("deletePost", async (data) => {
    try {
      const post = await Post.findByIdAndDelete(data);
      if (!post) {
        console.log("post not found");
      } else {
        console.log("--Post deleted--:", post);
        socket.emit("postDeleted", post._id);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      socket.emit("error", {
        message: "Error deleting post",
        error: error.message,
      });
    }
  });
  // ======================
  socket.on("register", async (data) => {
    const { email, password, username } = data;
    console.log("===--- register ---====", email, password, username);
    if (!email || !password || !username) {
      socket.emit("registrationError", {
        message: "All fields are required to be filled in.",
      });
      return;
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        socket.emit("registrationError", {
          message: "The user with this email already exists.",
        });
        return;
      }

      // Хеширование пароля перед сохранением
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        email: email,
        userName: username,
        passwordHash: hashedPassword,
        avatar: "",
        googleId: "",
      });

      await newUser.save();
      socket.emit("registrationSuccess", {
        message: "Registration was successful!",
        user: newUser,
      });
    } catch (error) {
      console.error("Error during registration:", error);
      socket.emit("registrationError", {
        message: "Error during registration.",
        error: error.message,
      });
    }
  });
  // ===============================
  socket.on("googleRegister", async (data) => {
    const { token } = data;

    if (!token) {
      socket.emit("registrationError", { message: "Token is required." });
      return;
    }

    try {
      // Верификация токена через Google API
      const ticket = await client.verifyIdToken({
        idToken: token, // Токен от клиента
        audience: process.env.GOOGLE_CLIENT_ID, // Ваш Google Client ID
      });

      const payload = ticket.getPayload();
      const email = payload.email;
      const userName = payload.name;
      const googleId = payload.sub; // Google ID
      const avatarUrl = payload.picture || null; // Получаем URL аватара

      // Проверка, существует ли пользователь в базе данных
      let user = await User.findOne({ email });

      if (user) {
        // Если пользователь уже существует, объединяем учетные записи
        if (!user.googleId) {
          user.googleId = googleId;
          await user.save();
        }
        socket.emit("googleRegisterSuccess", {
          message: "User already exists. Account linked with Google.",
          user: user,
        });
        return;
      }

      // Скачиваем аватар и преобразуем его в Base64
      let avatarBase64 = null;
      if (avatarUrl) {
        avatarBase64 = await downloadAvatarAsBase64(avatarUrl);
      }

      // Создаем нового пользователя
      user = new User({
        email,
        userName,
        avatar: avatarBase64, // Сохраняем аватар в Base64
        googleId, // Сохраняем Google ID
      });

      await user.save();

      // Генерация JWT токена для аутентификации пользователя
      const jwtToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "10h" }
      );

      // Отправка успешного ответа с данными пользователя и JWT токеном
      socket.emit("googleRegisterSuccess", {
        message: "Google registration successful!",
        user: user,
        token: jwtToken, // Отправляем новый токен
      });
    } catch (error) {
      console.error("Google registration error:", error);
      socket.emit("registrationError", {
        message: "Error during Google registration.",
      });
    }
  });
  // ===============================
  socket.on("login", async (data) => {
    const { email, password } = data;
    console.log("===--- login ---====", email, password);

    if (!email || !password) {
      socket.emit("loginError", {
        message: "Both email and password are required.",
      });
      return;
    }

    try {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        socket.emit("loginError", {
          message: "User with this email does not exist.",
        });
        return;
      }

      // Проверка пароля
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.passwordHash
      );
      if (!isPasswordValid) {
        socket.emit("loginError", {
          message: "Incorrect password.",
        });
        return;
      }
      // Генерация JWT токена
      const token = jwt.sign(
        { userId: existingUser._id, email: existingUser.email },
        process.env.JWT_SECRET, // Это должен быть ваш секретный ключ
        { expiresIn: "10h" } // Срок действия токена — 10 час
      );
      socket.emit("loginSuccess", {
        message: "Login successful!",
        user: existingUser,
        token: token,
      });
    } catch (error) {
      console.error("Error during login:", error);
      socket.emit("loginError", {
        message: "Error during login from server. Password required.",
        currentemail: email,
        passwordrequired: true,
      });
    }
  });
  // =============================
  const downloadAvatarAsBase64 = async (url) => {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      return `data:image/jpeg;base64,${Buffer.from(response.data).toString(
        "base64"
      )}`;
    } catch (error) {
      console.error("Failed to download avatar:", error);
      return null; // Возвращаем null, если аватар недоступен
    }
  };
  socket.on("googleLogin", async (data) => {
    const { token } = data; // Получаем токен от клиента

    if (!token) {
      socket.emit("loginError", { message: "Token is required." });
      return;
    }

    try {
      // Верификация токена через Google API
      const ticket = await client.verifyIdToken({
        idToken: token, // Токен от клиента
        audience: process.env.GOOGLE_CLIENT_ID, // Ваш Google Client ID
      });

      const payload = ticket.getPayload();
      const email = payload.email;
      const userName = payload.name;
      const googleId = payload.sub;
      const avatarUrl = payload.picture || null; // Получаем URL аватара

      // Проверка, существует ли пользователь в базе данных
      let user = await User.findOne({ email });

      if (!user) {
        // Если пользователь не существует, создаем нового
        let avatarBase64 = null;

        if (avatarUrl) {
          avatarBase64 = await downloadAvatarAsBase64(avatarUrl); // Скачиваем аватар
        }

        user = new User({
          email,
          userName,
          avatar: avatarBase64, // Сохраняем аватар в Base64
          googleId,
        });
        await user.save();
      } else {
        // Если пользователь существует, но у него нет Google ID, объединяем учетные записи
        if (!user.googleId) {
          user.googleId = googleId;
          await user.save();
        }

        // Если у пользователя уже есть аватар, используем его
        if (!user.avatar && avatarUrl) {
          user.avatar = await downloadAvatarAsBase64(avatarUrl); // Скачиваем аватар
          await user.save();
        }
      }

      // Генерация JWT токена для аутентификации пользователя
      const jwtToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "10h" }
      );

      console.log("===--- googleLogin ---====", user, jwtToken);

      // Отправка успешного ответа с данными пользователя и JWT токеном
      socket.emit("googleLoginSuccess", {
        message: "Google login successful!",
        user: user,
        token: jwtToken,
      });
    } catch (error) {
      console.error("Google login error:", error);
      socket.emit("googleLoginError", {
        message: "Error during Google login.",
        error: error.message,
      });
    }
  });
  // ==============================
  socket.on("setPassword", async (data, callback) => {
    const { email, password } = data;
    console.log("===--- setPassword ---====", email, password);
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return callback({ success: false, message: "User not found." });
      }

      if (user.password) {
        return callback({ success: false, message: "Password already set." });
      }

      const hashedPassword = await bcrypt.hash(password, 6);
      user.passwordHash = hashedPassword;
      await user.save();

      callback({ success: true, message: "Password set successfully." });
    } catch (error) {
      console.error("Set password error:", error);
      callback({ success: false, message: "Server error." });
    }
  });
  // ===================================
  socket.on("createComment", async (data) => {
    const { postId, text, userId, userName } = data;

    if (!postId || !text || !userId || !userName) {
      socket.emit("error", {
        message: "PostId, text and user ID are required",
      });
      return;
    }
    try {
      const userExists = await User.exists({ _id: userId });
      const postExists = await Post.exists({ _id: postId });
      if (!userExists || !postExists) {
        socket.emit("error", { message: "Data not found" });
        return;
      }
      const newComment = new Comment({
        postId,
        text,
        userId: userId,
        userName: userName,
      });

      await newComment.save();
      const comment = await Comment.findById(newComment._id);
      console.log("===--- commentCreated ---====", comment);
      socket.emit("commentCreated", {
        message: "Comment created successfully!",
        comment: comment,
      });
    } catch (error) {
      console.error("Error creating comment:", error);
      socket.emit("error", {
        message: "Error creating comment",
        error: error.message,
      });
    }
  });
  // ===================================
  socket.on("updateComment", async (data) => {
    console.log("===--- updateComment - Incoming data ---====", data);
    const { text, commentId, userId, userName } = data;
    try {
      // // Проверяем наличие ID поста
      if (!commentId) {
        socket.emit("error", {
          message: "No comment ID provided",
          error: "Missing _id in data",
        });
        return;
      }

      // // Ищем  по ID
      let comment = await Comment.findById(commentId);
      if (!comment) {
        socket.emit("error", {
          message: "Post not found",
          error: "No post with the provided ID",
        });
        return;
      }

      // Обновляем данные
      const updateQuery = {};
      if (text !== undefined) updateQuery.text = data.text;

      // // Обновляем
      let updatedComment = null;
      if (Object.keys(updateQuery).length > 0) {
        updatedComment = await Post.findByIdAndUpdate(updateQuery, {
          new: true,
        });
      } else {
        updatedComment = comment; // Если нет данных для обновления, возвращаем текущий пост
      }

      console.log("===--- Updated Comment ---====", updatedComment);

      if (!updatedComment) {
        socket.emit("error", {
          message: "Failed to update comment",
          error: "Comment update failed",
        });
        return;
      }

      // // Отправляем успешный ответ
      socket.emit("CommentEdited", {
        message: "Post edited successfully!",
        comment: updatedComment,
      });
    } catch (error) {
      console.error("Error updating post:", error);
      socket.emit("error", {
        message: "Error updating post",
        error: error.message,
      });
    }
  });
  // ===================================
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
