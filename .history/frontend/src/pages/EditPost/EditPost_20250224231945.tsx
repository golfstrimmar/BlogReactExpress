import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EditPost.scss";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { ReactComponent as Images } from "../../assets/svg/images.svg";
import ModalMessage from "../../components/ModalMessage/ModalMessage";
import axios from "axios";
import ButtonSuccessWave from "../../components/ButtonSuccessWave/ButtonSuccessWave";
import { editPost } from "../../redux/actions/postActions";
// ----------------

// ----------------
interface User {
  _id?: string;
  userName?: string;
}

interface Post {
  _id: string;
  imageUrl: string;
  user: string;
  userName: string;
  title: string;
  text: string;
  tags: string[];
  positiveLikes: number;
  negativeLikes: number;
  viewsCount: number;
  createdAt: string;
}
interface SocketData {
  comment: Comment;
  post: Post;
  message: string;
  error?: string; // Опциональное поле для ошибок
}
const EditPost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.auth.user) as User;
  const socket = useSelector((state: any) => state.socket.socket);
  const posts = useSelector((state: any) => state.posts.posts);
  const { postId } = useParams();

  const [posToEdit, setPostToEdit] = useState<Post | null>(null);
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [openModalMessage, setOpenModalMessage] = useState<boolean>(false);

  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const tags = ["trip", "mobile", "adventure"];
  //------------ Загрузка данных для редактирования
  useEffect(() => {
    if (postId) {
      const foundPost = posts.find((p: Post) => p._id === postId);
      if (foundPost) {
        setPostToEdit(foundPost);
        setTitle(foundPost.title);
        setText(foundPost.text);
        setImagePreview(foundPost.imageUrl || null);
        setImageUrl(foundPost.imageUrl || null);
        setSelectedTags(foundPost.tags || []);
      }
    }
  }, [posts, postId]);
  useEffect(() => {
    if (socket) {
      socket.on("PostEdited", (data: SocketData) => {
        console.log("===--- PostEdited from server ---====", data);
        setMessage(data.message);
        setOpenModalMessage(true);
        resetForm();
        setTimeout(() => {
          dispatch(editPost(data.post));
          setOpenModalMessage(false);
          setMessage("");
          navigate("/posts");
        }, 2000);
      });

      socket.on("error", (data: SocketData) => {
        setMessage(data.message);
        setOpenModalMessage(true);
        setTimeout(() => {
          setOpenModalMessage(false);
        }, 2000);
      });

      return () => {
        socket.off("PostEdited");
        socket.off("error");
      };
    }
  }, [socket, navigate]);
    const resetForm = () => {
      setTitle("");
      setText("");
      setSelectedTags([]);
      setImage(null);
      setImagePreview(null);
      setImageUrl(null);
    };
    const handleCheckboxChange = (e) => {
      if (e.target.checked) {
        setSelectedTags((prev) => [...prev, e.target.value]);
      } else {
        setSelectedTags((prev) => prev.filter((tag) => tag !== e.target.value));
      }
    };

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      setImage(file);
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      }
    };

    // Загрузка изображения на Cloudinary
    const handleImageUpload = async () => {
      if (image) {
        const imageFormData = new FormData();
        imageFormData.append("file", image);
        imageFormData.append("upload_preset", "blogblog");
        imageFormData.append("cloud_name", "dke0nudcz");

        try {
          const imageResponse = await axios.post(
            "https://api.cloudinary.com/v1_1/dke0nudcz/image/upload",
            imageFormData
          );
          console.log(
            "===--- imageResponse ---====",
            imageResponse.data.secure_url
          );
          return imageResponse.data.secure_url;
        } catch (error) {
          console.error("Error uploading image to Cloudinary:", error);
          setMessage("Failed to upload image.");
          setOpenModalMessage(true);
          setTimeout(() => {
            setOpenModalMessage(false);
          }, 2000);
        }
      }
    };
    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!title || !text) {
        setMessage("Title and text are required!");
        setOpenModalMessage(true);
        setTimeout(() => {
          setOpenModalMessage(false);
        }, 2000);
        return;
      }

      if (image) {
        try {
          const newImageUrl = await handleImageUpload();
          console.log("===--- newimageUrl ---====", newImageUrl);
          socket.emit("PostEdit", {
            newPost: { _id: posToEdit._id },
            title,
            text,
            tags: selectedTags,
            imageUrl: newImageUrl,
            userId: user._id,
            userName: user.userName,
          });
        } catch (error) {
          console.error("Ошибка загрузки изображения:", error);
        }
      } else {
        socket.emit("PostEdit", {
          newPost: { _id: posToEdit._id },
          title,
          text,
          tags: selectedTags,
          imageUrl: imageUrl,
          userId: user._id,
          userName: user.userName,
        });
      }
    };
};

export default EditPost;
