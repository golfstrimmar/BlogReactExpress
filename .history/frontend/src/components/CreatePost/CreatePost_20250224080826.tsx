import React, { useState, useEffect } from "react";
import "./CreatePost.scss";
import ButtonSuccessWave from "../ButtonSuccessWave/ButtonSuccessWave";
import { useParams } from "react-router-dom";
import ModalMessage from "../ModalMessage/ModalMessage";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Images from "../../assets/svg/images.svg";
import { useNavigate } from "react-router-dom";
import { addPost } from "../../redux/actions/postActions";

// ==============================

// ==============================
interface Post {
  title: string;
  text: string;
  selectedTags: string[];
  message: string;
  openModalMessage: boolean;
  image: File | null;
  imagePreview: string | null;
  imageUrl: string | null;
}

interface User {
  _id?: string;
  userName?: string;
}