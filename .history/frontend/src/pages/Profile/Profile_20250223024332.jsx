import React, { useState, useEffect } from "react";
import "./Profile.scss";
import { useDispatch, useSelector } from "react-redux";
const Profile = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <h2 className="profile-title">{user?.userName}</h2>
            <div className="profile-avatar">
              {user?.avatar ? (
                <img
                  src={user?.avatar}
                  alt="User avatar"
                  crossorigin="anonymous"
                />
              ) : (
                <div className="avatar-placeholder">
                  {user?.userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {user ? (
            <div className="profile-body">
              <div className="profile-info-group">
                <label className="profile-label">Email:</label>
                <p className="profile-info">{user?.email}</p>
              </div>

              <div className="profile-meta">
                <div className="meta-item">
                  <span className="meta-label">User ID:</span>
                  <span className="meta-value">{user?._id}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Member since:</span>
                  <span className="meta-value">
                    {new Date(user?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <button className="profile-edit-btn">Edit Profile</button>
            </div>
          ) : (
            <div className="profile-loading">Loading user data...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
