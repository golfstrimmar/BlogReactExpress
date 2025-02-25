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
        socket.on("PostEdited", (data) => {
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

        socket.on("error", (data) => {
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
};

export default EditPost;
