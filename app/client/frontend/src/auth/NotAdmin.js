import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";


const NotAdmin = () => { 

    const navigate = useNavigate();

    const handleNavigate = (link) => {
        navigate(link);
    } 

    return (
        <>
            <h2>Du behöver vara inloggad som en administratör för att komma åt denna sida</h2>
            <p onClick={() => handleNavigate('/article/showAll')}>Klicka här för att komma tillbaka till startsidan</p>
            <p onClick={() => handleNavigate("/profile/login")}>Klicka här för att logga in</p>
        </>
    );
};

export default NotAdmin;



