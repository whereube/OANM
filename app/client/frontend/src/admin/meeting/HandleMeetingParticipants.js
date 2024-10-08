import React, { useState, useEffect } from "react";
import './AddMeetingForm.css';

function HandleMeetingParticipants() {
    let API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;
    
    const [meetingParticipants, setMeetingParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [emailInput, setEmailInput] = useState('')
    const [passwordInput, setPasswordInput] = useState('')
    const [passwordInput2, setPasswordInput2] = useState('')
 
    useEffect(() => {
        const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/meetingParticipant/getByMeetingId`);
            if (!response.ok) {
            throw new Error("Failed to fetch categories");
            }
            const data = await response.json();
            setMeetingParticipants(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
        };

        fetchCategories();
    }, []);

    const handleEmailChange = (event) => {
        setEmailInput(event.target.value)
    };

    const handlePasswordChange = (event) => {
        
        if(event.target.name === 'password'){
            setPasswordInput(event.target.value)
        } 
        else if(event.target.name === 'password2'){
            setPasswordInput2(event.target.value)
        } 
    };

    const handleSubmit = async () => {
        let emailsToCreate = []

        if(passwordInput !== passwordInput2){
            setError('Lösenorden matchar inte')
        } else {
            setError(null)
            const listWithoutWhitespace = emailInput.replace(/\s/g, '');
            const listOfEmails = listWithoutWhitespace.split(';')
            listOfEmails.forEach(email => {
                if(email != ''){
                    emailsToCreate.push(email)
                }
            });

            try {
                const response = await fetch(`${API_URL}/meetingParticipant/add`, {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({meetingParticipants: emailsToCreate, meetingId: '9c6779c3-470d-4c09-855d-32d3d01b2b24', standardPassword: 'test'})
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Användare skapade");
                } else {
                    /*setResponseMessage(data.message);*/
                }
            } catch (error) {
                console.error("Fel vid skapande av mötesdeltagare:", error);
                /*setResponseMessage("Ett fel uppstod medans mötesdeltagarna skapades.");*/
            }
        }
    }

    return (
        <>
            <p>Skriv in mailadresser för deltagare i mötet, varje mailadress måste separeras med ett semikolon</p>
            <input value={emailInput} onChange={handleEmailChange}></input>
            <input type="password" value={passwordInput} name="password" onChange={handlePasswordChange}></input>
            <input type="password" value={passwordInput2} name="password2" onChange={handlePasswordChange}></input>
            <button type="submit" className="button-small" onClick={handleSubmit}>Skapa användare</button>
            {error &&
                <p className="errorMessage">{error}</p>
            }   
        </>
    );
}

export default HandleMeetingParticipants;
