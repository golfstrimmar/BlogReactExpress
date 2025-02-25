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
// ------------------------------

const AddComment: React.FC<CommentProps> = ({ mode }) => {
  const { commentId, postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const socket = useSelector((state: any) => state.socket.socket);
  const posts = useSelector((state: any) => state.posts.posts);
  const comments = useSelector((state: any) => state.comments.comments);
  const user = useSelector((state: any) => state.auth.user) as User;

  const [post, setPost] = useState(null);
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
