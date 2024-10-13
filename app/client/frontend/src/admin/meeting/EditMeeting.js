import React, { useState, useEffect } from "react";
import './EditMeeting.css';
import { useNavigate, useParams } from 'react-router-dom';
import HandleMeetingParticipants from "./HandleMeetingParticipants";


function EditMeeting() {
    let API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;
    const [formData, setFormData] = useState({
        meeting_name: "",
    });
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [oldSelectedCategories, setOldSelectedCategories] = useState([]);
    const [responseMessage, setResponseMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [meetingData, setMeetingData] = useState({})
    const [meetingNameInput, setMeetingNameInput] = useState('')
    const { meetingId } = useParams();


    const navigate = useNavigate();


    useEffect(() => {
        if('meeting_name' in meetingData){
            setMeetingNameInput(meetingData.meeting_name)
        }
    }, [meetingData]);


    useEffect(() => {
        // Fetch categories on component mount
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/category/getAll`);
                if (!response.ok) {
                    throw new Error("Failed to fetch categories");
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                setError(error.message);
            }
        };

        const fetchMeetingCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/meetingCategory/byMeetingId/` + meetingId)
                if (!response.ok) {
                throw new Error("Failed to fetch meeting categories");
                }
                const data = await response.json();
                const listOfCategoryId = []
                for(const category of data){
                    listOfCategoryId.push(category.category_id)
                }

                setOldSelectedCategories(listOfCategoryId);
                setSelectedCategories(listOfCategoryId);
            } catch (error) {
                setError(error.message);
            }
        };

        const fetchMeetingData = async () => {
            try {
                const response = await fetch(`${API_URL}/meeting/byId/` + meetingId)
                if (!response.ok) {
                    throw new Error("Failed to fetch meeting data");
                }
                const data = await response.json();
                setMeetingData(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchCategories();
        fetchMeetingCategories();
        fetchMeetingData()
        setLoading(false);
    }, []);

    const handleChange = (event) => {
        setFormData({
        ...formData,
        [event.target.name]: event.target.value,
        });
    };

    const handleSaveAndExit = () => {
        navigate('/admin'); // Redirect to /admin
    };

    const handleCategoryToggle = (categoryId) => {
        setSelectedCategories((prevSelected) =>
        prevSelected.includes(categoryId)
            ? prevSelected.filter((id) => id !== categoryId)
            : [...prevSelected, categoryId]
        );
    };

    const handleFormSubmit = async (event) => {

        try {
            const response = await fetch(`${API_URL}/meeting/editMeeting`, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({meeting_name: meetingNameInput, meeting_id: meetingId}),
            });

            const data = await response.json();
            console.log(data)
            if (data[0] === 1) {
                alert('Mötets namn har uppdaterats')
            } else {
                setResponseMessage(data.message);
            }
        } catch (error) {
            console.error("Error editing meeting name:", error);
            setResponseMessage("An error occurred while updating the meeting name.");
        }
    }

    const handleCategoriesSubmit = async (event) => {

        const newCategories = selectedCategories.filter((element) => !oldSelectedCategories.includes(element));
        const removedCategories = oldSelectedCategories.filter((element) => !selectedCategories.includes(element))

        let removedOk = false
        let addedOk = false

        try {
            if (newCategories.length > 0){
                const addResponse = await fetch(`${API_URL}/meetingCategory/addCategories`, {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({category_id: newCategories, meeting_id: meetingId}),
                });

                const dataAdd = await addResponse.json();

                if (addResponse.ok) {
                    addedOk = true
                } else {
                    setResponseMessage(dataAdd.message);
                }

            }
            if(removedCategories.length > 0){
                const removeResponse = await fetch(`${API_URL}/meetingCategory/removeCategories`, {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({category_id: removedCategories, meeting_id: meetingId}),
                });

                const dataRemove = await removeResponse.json();

                if (removeResponse.ok) {
                    removedOk = true
                } else {
                    setResponseMessage(dataRemove.message);
                }
            }
            if(removedOk && addedOk){
                alert('Mötets kategorier har uppdaterats')
            }
            else if (removedOk && !addedOk){
                alert('Kategorier har tagit borts från mötet')
            }
            else if (!removedOk && addedOk){
                alert('Kategorier har lagts till på mötet')
            }
        } catch (error) {
            console.error("Error editing categories:", error);
            setResponseMessage("An error occurred while editing the categories.");
        }
    };

    const handleMeetingNameChange = (event) => {
        setMeetingNameInput(event.target.value)
    };

    // Recursive function to render categories and subcategories
    const renderCategories = (parentId = null) => {
        // Filter categories by parent_id
        const filteredCategories = categories.filter(
        (category) => category.parent_id === parentId
        );

        return filteredCategories.map((category) => (
        <React.Fragment key={category.id}>
            <li
            style={{
                marginLeft: parentId ? '30px' : '0', // Apply margin-left for subcategories
                fontSize: parentId ? '15px' : 'inherit', // Apply font size for subcategories
                borderBottom: parentId ? 'none' : 'inherit', // Remove border for subcategories
            }}
            >
            {category.category_name}
            <button
                type="button"
                onClick={() => handleCategoryToggle(category.id)}
                className={`button-category ${selectedCategories.includes(category.id) ? 'selected' : ''}`}
            >
                {selectedCategories.includes(category.id) ? '-' : '+'}
            </button>
            </li>
            {/* Recursively render subcategories */}
            {renderCategories(category.id)}
        </React.Fragment>
        ));
    };

    return (
        <div className="editMeeting">
            <h2>Redigera möte</h2>
            <div className="editNameDiv">
                <input value={meetingNameInput} onChange={handleMeetingNameChange} className="editNameInput"></input>
                <button className="button-small saveEditName" onClick={handleFormSubmit}>Spara namnbyte</button>
            </div>

            <HandleMeetingParticipants meetingId={meetingId}/>

            <div className="categories">
                <h3>Kategorier</h3>
                {loading ? (
                    <p>Loading categories...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <ul>
                    {renderCategories()} {/* Render top-level categories and their subcategories */}
                    </ul>
                )}
                <button onClick={handleCategoriesSubmit} className="button-small">Spara ändringar i kategorier</button>
            </div>
        </div>
    );
}

export default EditMeeting;
