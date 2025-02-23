import React, { useState, useEffect } from "react";
import "./AddComment.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ModalMessage from "../../components/ModalMessage/ModalMessage";
import ButtonSuccessWave from "../../components/ButtonSuccessWave/ButtonSuccessWave";
import { addComment } from "../../redux/actions/commentActions";
const AddComment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { postId } = useParams();
  const socket = useSelector((state) => state.socket.socket);
  const posts = useSelector((state) => state.posts.posts);
  const comments = useSelector((state) => state.comments.comments);
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [openModalMessage, setOpenModalMessage] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const { commentId } = useParams();
  const [commentToEdit, setCommentToEdit] = useState(null);
  // ====================================

  // ====================================
  console.log("===--- commentId ---====", useParams());
  useEffect(() => {
    if (comments.length > 0) {
      let newComment = [...comments];
      newComment = newComment.filter((el) => {
        return el._id === commentId;
      });
      if (newComment) {
        setComment(newComment.text);
        setCommentToEdit(newComment);
      }
    }
  }, [comments, commentId]);
  useEffect(() => {
    if (!socket) return;
    const handleCommentCreated = (data) => {
      console.log(data.message, data.comment);
      const commentCopy = JSON.parse(JSON.stringify(data.comment));
      dispatch(addComment(commentCopy));
      setMessage(data.message);
      setOpenModalMessage(true);

      setTimeout(() => {
        setMessage("");
        setOpenModalMessage(false);
        navigate(`/posts`);
      }, 2000);
    };

    socket.on("commentCreated", handleCommentCreated);
    return () => {
      socket.off("commentCreated", handleCommentCreated);
    };
  }, [socket, dispatch]);
  useEffect(() => {
    const foundPost = posts.find((p) => p._id === postId);
    setPost(foundPost);
  }, [postId, posts]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!postId || !comment) {
      setMessage("Please add the text of the comment.");
      setOpenModalMessage(true);
      setTimeout(() => {
        setOpenModalMessage(false);
      }, 2000);
      return;
    }
    const commentData = {
      postId: postId,
      text: comment,
      userId: user._id,
      userName: user.userName,
    };
    console.log("===--- commentData ---====", commentData);
    socket.emit("setComment", commentData);
    // console.log("===--- data ---====", data);
    // setMessage(data.message);
    // setOpenModalMessage(true);
    // setTimeout(() => {
    //   setMessage("");
    //   setOpenModalMessage(false);
    //   navigate(`/post/${postId}`);
    // }, 2000);
  };

  return (
    <div className="addcomment">
      <ModalMessage message={message} open={openModalMessage} />
      <div className="container">
        <h2>add comment</h2>
        <form className="addcomment-wrap">
          <div className="addcomment-title">
            Post title: <h3> {post && post.title}</h3>
          </div>
          <p className="addcomment-text">Post text: {post && post.text}</p>
          <div className="textarea-field">
            <textarea
              name="text"
              rows="10"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
            <label htmlFor="text">Comment text:</label>
          </div>
          <ButtonSuccessWave
            type="submit"
            text={"Add comment"}
            onClick={(e) => {
              handleSubmit(e);
            }}
          />
        </form>
      </div>
    </div>
  );
};

export default AddComment;
