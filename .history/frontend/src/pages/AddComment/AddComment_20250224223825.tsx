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
}
// ------------------------------
 const { commentId, postId } = useParams();
 const navigate = useNavigate();
 const dispatch = useDispatch();

 const socket = useSelector((state) => state.socket.socket);
 const posts = useSelector((state) => state.posts.posts);
 const comments = useSelector((state) => state.comments.comments);
 const user = useSelector((state) => state.auth.user);

 const [post, setPost] = useState(null);
 const [commentText, setCommentText] = useState("");
 const [message, setMessage] = useState("");
 const [openModal, setOpenModal] = useState(false);
// ------------------------------
const AddComment: React.FC<CommentProps> = ({ mode }) => {
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
