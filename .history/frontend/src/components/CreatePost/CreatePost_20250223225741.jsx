import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import "./CreatePost.scss";
import ButtonSuccessWave from "../ButtonSuccessWave/ButtonSuccessWave";
import { useParams, useNavigate } from "react-router-dom";
import ModalMessage from "../ModalMessage/ModalMessage";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { ReactComponent as Images } from "../../assets/svg/images.svg";
import { addPost } from "../../redux/actions/postActions";

// Define types for Redux state
interface User {
  _id: string;
  userName: string;
}

interface AuthState {
  user: User | null;
}

interface SocketState {
  socket: any; // You might want to use a more specific type for socket
}

interface Post {
  // Define post structure based on your needs
  title: string;
  text: string;
  tags: string[];
  imageUrl: string;
  userId: string;
  userName: string;
}

const CreatePost: React.FC = () => {
  const user = useSelector((state: { auth: AuthState }) => state.auth.user);
  const socket = useSelector((state: { socket: SocketState }) => state.socket.socket);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [openModalMessage, setOpenModalMessage] = useState<boolean>(false);
  const tags: string[] = ["trip", "mobile", "adventure"];
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (socket) {
      socket.on("postCreated", (data: { post: Post; message: string }) => {
        console.log("===--- postCreated ---====", data.post);
        dispatch(addPost(data.post));
        setMessage(data.message);
        setOpenModalMessage(true);
        resetForm();
        setTimeout(() => {
          setOpenModalMessage(false);
          navigate("/posts");
        }, 2000);
      });

      socket.on("error", (data: { message: string; error?: any }) => {
        console.log("===--- error ---====", data);
        setMessage(data.message);
        setOpenModalMessage(true);
        setTimeout(() => {
          setOpenModalMessage(false);
        }, 2000);
      });

      return () => {
        socket.off("postCreated");
        socket.off("error");
      };
    }
  }, [socket, navigate, dispatch]);

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTags((prev) => [...prev, e.target.value]);
    } else {
      setSelectedTags((prev) => prev.filter((tag) => tag !== e.target.value));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleImageUpload = async (): Promise<string | undefined> => {
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

  const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
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
        const uploadedImageUrl = await handleImageUpload();
        console.log("===--- imageUrl ---====", uploadedImageUrl);
        socket.emit("createPost", {
          title,
          text,
          tags: selectedTags,
          imageUrl: uploadedImageUrl,
          userId: user?._id,
          userName: user?.userName,
        });
      } catch (error) {
        console.error("Ошибка загрузки изображения:", error);
      }
    } else {
      socket.emit("createPost", {
        title,
        text,
        tags: selectedTags,
        imageUrl: "",
        userId: user?._id,
        userName: user?.userName,
      });
    }
  };

  const resetForm = () => {
    setTitle("");
    setText("");
    setSelectedTags([]);
    setImage(null);
    setImagePreview(null);
    setImageUrl(null);
  };

  return (
    <div className="container">
      <div className="createpost">
        <ModalMessage message={message} open={openModalMessage} />

        <form className="createpost-form">
          <h2>Create a New Post</h2>
          <div className="input-field">
            <input
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <label htmlFor="title">Title:</label>
          </div>
          <div className="textarea-field">
            <textarea
              name="text"
              rows={20}
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            ></textarea>
            <label htmlFor="text">Text:</label>
          </div>
          <div className="createpost-info">
            <div className="tags-area">
              <p>Tags:</p>
              <div className="fildset-checkbox">
                {tags.map((tag, index) => (
                  <div key={index}>
                    <input
                      id={tag}
                      name={tag}
                      type="checkbox"
                      value={tag}
                      onChange={handleCheckboxChange}
                      checked={selectedTags.includes(tag)}
                    />
                    <label htmlFor={tag}>{tag}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="createpost-author">Author: {user?.userName}</div>
            <div className="image-upload tags-area">
              <p>Post image:</p>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <label htmlFor="image-upload">
                <Images className="images" />
              </label>
            </div>
            {imagePreview && (
              <div>
                <span>Image preview: </span>
                <img
                  className="image-preview"
                  src={imagePreview}
                  alt="Image preview"
                />
              </div>
            )}
          </div>

          <ButtonSuccessWave
            type="submit"
            text={"Create Post"}
            onClick={handleSubmit}
          />
        </form>
      </div>
    </div>
  );
};

export default CreatePost;