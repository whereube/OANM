import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './NotAdmin.css'


const NotAdmin = () => { 

    const navigate = useNavigate();

    const handleNavigate = (link) => {
        navigate(link);
    } 

    return (
        <div className='notAdminPage'>
            <h2>Du behöver vara inloggad som en administratör för att komma åt denna sida</h2>
            <div className='button-small notAdminButton' onClick={() => handleNavigate('/article/showAll')}>Klicka här för att komma tillbaka till startsidan</div>
            <div className='button-small notAdminButton' onClick={() => handleNavigate("/profile/login")}>Klicka här för att logga in</div>
        </div>
    );
};

export default NotAdmin;



