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

const EditPost = () => {}