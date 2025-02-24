import React, { useState, useEffect } from "react";
import "./Profile.scss";
import { useDispatch, useSelector } from "react-redux";
// -------------------------------

// -------------------------------
interface User {
  _id?: string;
  userName?: string;
}
const Profile: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user as User);
  // -------------------

  // -------------------
  
};
export default Profile;
