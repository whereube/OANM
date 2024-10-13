import React, { useState, useRef, useEffect } from 'react';
import { useAuth} from '../auth/AuthProvider.js';
import { Link } from 'react-router-dom';
import './ProfilePopOver.css';


const ProfilePopOver = (props) => {

    const popoverRef = useRef(null);
    const { logOut, checkIfAdmin } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false)


  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const result = await checkIfAdmin(); // Perform async admin check
        setIsAdmin(result);
      } catch (error) {
        console.error('Error checking admin status:', error);
      } 
    };

    checkAdminStatus();
  }, []);

    // Close popover if clicked outside
    const handleClickOutside = (event) => {
        if (popoverRef.current && !popoverRef.current.contains(event.target)) {
            props.setDropdownIsOpen(false);
        }
    };

    useEffect(() => {
        if (props.dropdownIsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [props.dropdownIsOpen]);

    return (
        <div className="popover-wrapper" ref={popoverRef}>
            <div onClick={props.togglePopover}>
            </div>
            {props.dropdownIsOpen && (
                <div className="popover-content">
                    <p className='popOverAlt' onClick={logOut}>Logga ut</p>
                    <Link className='popOverAlt linkButton' to={'/profile/edit'} >Min profil</Link>
                    <Link className='popOverAlt linkButton' to={'/profile/myArticles'} >Mina artiklar</Link>
                    {isAdmin && 
                        <>
                            <Link className='popOverAlt linkButton' to={'/admin'} >Adminportal</Link>
                        </>
                    }
                </div>
            )}
        </div>
    );
};

export default ProfilePopOver;