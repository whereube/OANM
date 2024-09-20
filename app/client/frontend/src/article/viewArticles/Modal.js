import React, { useRef } from 'react';
import './Modal.css'; // Rename your CSS file for modal-specific styles

const Modal = (props) => {
    const modalRef = useRef();

    const handleClose = () => {
        props.setModalIsOpen(false);
    };

    if (!props.modalisOpen) {
        return null; // Return nothing if modal is closed
    }

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" ref={modalRef} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={handleClose}>
                    &times;
                </button>
                {props.content}
                <div className='modalButtonsDiv'>
                    <button className='modalButton button-small accept' onClick={() => props.handleAccept()}>Acceptera</button>
                    <button className='modalButton button-small decline' onClick={() => props.handleDecline()}>Neka</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
