import React, { useRef } from 'react';
import './Modal.css'; // Rename your CSS file for modal-specific styles

const Modal = (props) => {
    const modalRef = useRef();

    const handleClose = () => {
        props.setModalIsOpen(false);
    };

    // Close modal when clicking outside
    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            props.setModalIsOpen(false);
        }
    };

/*
    // Add event listener to detect clicks outside the modal
    React.useEffect(() => {
        if (props.modalisOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [props.modalisOpen]);
*/

    if (!props.modalisOpen) {
        return null; // Return nothing if modal is closed
    }

    const acceptSharing = (sharingAccepted) => {
    }

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" ref={modalRef} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={handleClose}>
                    &times;
                </button>
                {props.content}
                <button onClick={() => acceptSharing(true)}>Acceptera</button>
                <button onClick={() => acceptSharing(false)}>Neka</button>
            </div>
        </div>
    );
};

export default Modal;
