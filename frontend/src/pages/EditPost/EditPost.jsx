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
const EditPost = () => {
  const navigate = useNavigate();
  const [posToEdit, setPostToEdit] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const socket = useSelector((state) => state.socket.socket);
  const posts = useSelector((state) => state.posts.posts);
  const { postId } = useParams();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [message, setMessage] = useState("");
  const [openModalMessage, setOpenModalMessage] = useState(false);
  const tags = ["trip", "mobile", "adventure"];
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const dispatch = useDispatch();
  // --------------------

  // --------------------
  // Загрузка данных для редактирования
  useEffect(() => {
    if (postId) {
      const foundPost = posts.find((p) => p._id === postId);
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

  return (
    <div className="editpost">
      <ModalMessage message={message} open={openModalMessage} />
      <div className="container">
        <h2>Edit Post</h2>
        <form className="editpost-form createpost-form">
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
              rows="20"
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
            <div className="createpost-author">Author: {user.userName}</div>
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
            text={"Save Changes"}
            onClick={handleSubmit}
          />
        </form>
      </div>
    </div>
  );
};

export default EditPost;
