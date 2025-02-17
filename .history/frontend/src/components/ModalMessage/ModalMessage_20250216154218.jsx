import React from "react";
import "./ModalMessage.scss";

const ModalMessage = ({ message, open }) => {
  return (
    <div className={`modalmessage  ${open ? "run" : ""}  `}>
      <div className="modalmessage-inner">
        <h3 className="modalmessage-message">{message}</h3>
      </div>
    </div>
  );
};

export default ModalMessage;
