import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './AdminPage.css'

function AdminPage() {

    const [meetings, setMeetings] = useState([])
    const [meetingsIsCollapsed, setMeetingsIsCollapsed] = useState(true)
    const navigate = useNavigate(); 

    const handleNavigate = (path) => {
        navigate(path)
    }  

    useEffect(() => {
        getMeetings(); 
    }, []);

    const getMeetings = async () => {
        const response = await fetch('http://localhost:443/meeting/getAll');
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData)
            console.error('Error:', errorData); 
            throw new Error(errorData);
        }

        const result = await response.json();
        setMeetings(result)
    }

    const changeCollapseState = () => {
        setMeetingsIsCollapsed((prevMeetingsIsCollapsed) => !prevMeetingsIsCollapsed);
    }


    return (
        <div className="adminPage">
            <p className='navigateButton' onClick={() => handleNavigate('add-category')}>Hantera kategorier</p>
            <p className='navigateButton' onClick={() => handleNavigate('add-meeting')}>Skapa möte</p>
            <p className='navigateButton' onClick={() => changeCollapseState()}>Skapade möten</p>
            <div className={`allMeetings ${meetingsIsCollapsed && 'collapsed'}`}>
                {meetings.map(meeting => (
                    <div key={meeting.id} className="meeting">
                        <p>{meeting.meeting_name}</p> 
                        <div className="meetingButtons">
                            <p className='button-small small' onClick={() => handleNavigate('/whiteboard/' + meeting.id)}>Mötets whiteboard</p>
                            <p className='button-small small' onClick={() => handleNavigate('/article/add/' + meeting.id)}>Deltagarnas länk</p>
                        </div>
                    </div>
                ))};
            </div>
        </div>
    );
}

export default AdminPage;
