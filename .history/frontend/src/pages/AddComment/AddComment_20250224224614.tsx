import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ModalMessage from "../../components/ModalMessage/ModalMessage";
import ButtonSuccessWave from "../../components/ButtonSuccessWave/ButtonSuccessWave";
import { addComment, editComment } from "../../redux/actions/commentActions";
import "./AddComment.scss";
// =============================

// =============================
interface CommentProps {
  _id: string;
  mode: string;
}
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
// ------------------------------
useEffect(() => {
  console.log(
    "===--- mode, commentId, postId ---====",
    mode,
    commentId,
    postId
  );
  if (mode === "edit" && commentId) {
    const comment = comments.find((c) => c._id === commentId);
    if (comment) {
      setCommentText(comment.text);
      // const relatedPost = posts.find((p) => p._id === comment.postId);
      // setPost(relatedPost);
    }
  } else if (postId) {
    const post = posts.find((p) => p._id === postId);
    setPost(post);
  }
}, [mode, commentId, postId, posts, comments]);
// ------------------------------
  useEffect(() => {
    if (!socket) return;
    const handleCreatedComment = (data) => {
      console.log(
        "===--- data CreatedComment from server ---====",
        data.message,
        data.comment
      );
      dispatch(addComment(data.comment));
      setMessage(data.message);
      setOpenModal(true);

      setTimeout(() => {
        setOpenModal(false);
        navigate(`/posts`);
      }, 2000);
    };
    const handleEditedComment = (data) => {
      console.log(
        "===--- data EditedComment from server ---====",
        data.message,
        data.comment
      );
      dispatch(editComment(data.comment));
      setMessage(data.message);
      setOpenModal(true);

      setTimeout(() => {
        setOpenModal(false);
        navigate(`/posts`);
      }, 2000);
    };

    socket.on("commentCreated", (data) => handleCreatedComment(data));
    socket.on("CommentEdited", (data) => handleEditedComment(data));
    return () => socket.off("commentEvent", handleCreatedComment);
  }, [socket, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      setMessage("Please enter comment text");
      setOpenModal(true);
      return;
    }

    const commentData = {
      postId: postId,
      text: commentText,
      userId: user._id,
      userName: user.userName,
      ...(mode === "edit" && { commentId }),
      ...(mode === "create" && { postId }),
    };

    socket.emit(
      mode === "edit" ? "updateComment" : "createComment",
      commentData
    );
  };
const AddComment: React.FC<CommentProps> = ({ mode }) => {
  const { commentId, postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const socket = useSelector((state: any) => state.socket.socket);
  const posts = useSelector((state: any) => state.posts.posts);
  const comments = useSelector((state: any) => state.comments.comments);
  const user = useSelector((state: any) => state.auth.user) as User;

  const [post, setPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  // ------------------------------
  return (
    <div className="addcomment">
      <ModalMessage message={message} open={openModal} />
      <div className="container">
        <h2>{mode === "edit" ? "Edit Comment" : "Add Comment"}</h2>
        <form className="addcomment-wrap">
          {post && (
            <>
              <div className="addcomment-title">
                Post title: <h3>{post.title}</h3>
              </div>
              <p className="addcomment-text">Post text: {post.text}</p>
            </>
          )}
          <div className="textarea-field">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
              placeholder="Enter your comment..."
            />
          </div>
          <ButtonSuccessWave
            onClick={handleSubmit}
            text={mode === "edit" ? "Update Comment" : "Add Comment"}
          />
        </form>
      </div>
    </div>
  );
};

export default AddComment;
