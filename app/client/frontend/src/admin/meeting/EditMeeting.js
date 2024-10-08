import React, { useState, useEffect } from "react";
import './AddMeetingForm.css';
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
    const { meetingId } = useParams();


    const navigate = useNavigate();


    useEffect(() => {
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
        } finally {
            setLoading(false);
        }
        };

        fetchMeetingCategories();
    }, []);


    useEffect(() => {
        // Fetch categories on component mount
        const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/category/getAll`); // Update URL as needed
            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
        };

        fetchCategories();
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newCategories = selectedCategories.filter((element) => !oldSelectedCategories.includes(element));
        const removedCategories = oldSelectedCategories.filter((element) => !selectedCategories.includes(element))

        console.log(newCategories);
        console.log(removedCategories);
        /*Kod för att använda addCategories och removeCategories med dessa listor*/

        /*
        try {
        const response = await fetch(`${API_URL}/meetingCategory/addMeetingAndCategory`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            ...formData,
            category_id: selectedCategories
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Möte skapat");
            handleSaveAndExit();
        } else {
            setResponseMessage(data.message);
        }
        } catch (error) {
        console.error("Error submitting form:", error);
        setResponseMessage("An error occurred while submitting the form.");
        }
        */
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
        <div className="addMeeting">
        <form onSubmit={handleSubmit} className="create-meeting-form">
            <h2>Skapa nytt möte</h2>
            <div>
            <label htmlFor="meeting_name">Namn:</label>
            <input
                type="text"
                id="meeting_name"
                name="meeting_name"
                value={formData.meeting_name}
                onChange={handleChange}
                required
            />
            </div>

            <div className="categories">
            <h3>Tillgängliga kategorier</h3>
            {loading ? (
                <p>Loading categories...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <ul>
                {renderCategories()} {/* Render top-level categories and their subcategories */}
                </ul>
            )}
            </div>

            {responseMessage && <p>{responseMessage}</p>}
            <button type="submit" className="button-small">Skapa möte</button>
        </form>
        <HandleMeetingParticipants/>
        </div>
    );
}

export default EditMeeting;
