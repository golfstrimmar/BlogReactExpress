
import React from 'react';
import './ModalMessage.scss';

const ModalMessage = ({ message }) => {
  return (
    <div className="modalmessage">
      <div className="modalmessage-inner">
        <div className="modalmessage-message">{message}</div>
      </div>
    </div>
  );
};

export default ModalMessage;
  