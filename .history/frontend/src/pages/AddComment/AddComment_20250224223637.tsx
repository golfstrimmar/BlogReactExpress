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
const AddComment: React.FC<CommentProps> = ({ mode }) => {
  return <div>AddComment</div>;
};

export default AddComment;
