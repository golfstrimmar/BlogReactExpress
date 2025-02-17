import React from "react";
import "./ModalMessage.scss";

const ModalMessage = ({ message,open }) => {
  return (
    <div className="modalmessage">
      <div className="modalmessage-inner">
        <h5 className="modalmessage-message">{message}</h5>
      </div>
    </div>
  );
};

export default ModalMessage;
