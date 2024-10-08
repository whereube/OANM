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

    const copyLink = (link) => {
        navigator.clipboard.writeText(link);
        alert('Länken har kopierats')
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
                        <a href={'https://oanm-ecubuntu-b3e74bbc7ba9.herokuapp.com/admin/edit-meeting/' + meeting.id}>Redigera</a>
                        <div className="meetingButtons">
                            <Link to={'/whiteboard/' + meeting.id} className='button-small small'>Mötets whiteboard</Link>
                            <label for='link'>Deltagarnas länk</label>
                            <div className="inputWrapper">
                                <input readOnly className='link' value={'https://oanm-ecubuntu-b3e74bbc7ba9.herokuapp.com/article/add/' + meeting.id}></input>
                                <button onClick={() => copyLink('https://oanm-ecubuntu-b3e74bbc7ba9.herokuapp.com/article/add/' + meeting.id)}>
                                    &#128203;
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminPage;
