import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import './AdminPage.css'

function AdminPage() {
    let API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;
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
        const response = await fetch(`${API_URL}/meeting/getAll`);
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
            <div className='navigateButton' onClick={() => handleNavigate('add-category')}>
                <p className="buttonDesc">Hantera kategorier</p>
            </div>
            <div className='navigateButton' onClick={() => handleNavigate('add-meeting')}>
                <p className="buttonDesc">Skapa möte</p>
            </div>
            <div className='navigateButton' onClick={() => changeCollapseState()}>
                <p className="buttonDesc">Skapade möten</p>
                {meetingsIsCollapsed ? (
                    <p className='arrowIcon'>&#43;</p>
                ):(
                    <p className='arrowIcon'>&#8722;</p>
                )}
            </div>

            <div className={`allMeetings ${meetingsIsCollapsed && 'collapsed'}`}>
                {meetings.map(meeting => (
                    <div key={meeting.id} className="meeting">
                        <p>{meeting.meeting_name}</p> 
                        <div className="meetingButtons">
                            <Link to={'/whiteboard/' + meeting.id} target='_blank' className='button-small small'>Mötets whiteboard</Link>
                            <Link to={'/article/add/' + meeting.id} target='_blank' className='button-small small' >Deltagarnas länk</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminPage;
