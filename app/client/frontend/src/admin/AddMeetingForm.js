import React, { useState, useEffect } from "react";
import './AddMeetingForm.css';
import '../App.css';

function AddMeetingForm() {
  const [formData, setFormData] = useState({
    meeting_name: "",
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch categories on component mount
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:443/category/getAll"); // Update URL as needed
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

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:443/meetingCategory/addMeetingAndCategory", {
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
        alert("Meeting created");
        window.location.reload();
      } else {
        setResponseMessage(data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setResponseMessage("An error occurred while submitting the form.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="create-meeting-form">
        <h2>Add New Meeting</h2>
        <div>
          <label htmlFor="meeting_name">Meeting Name:</label>
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
          <h3>Available Categories</h3>
          {loading ? (
            <p>Loading categories...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <ul>
              {categories.map((category) => (
                <li key={category.id}>
                  {category.category_name}
                  <button
                    type="button"
                    onClick={() => handleCategoryToggle(category.id)}
                    className={`button-category ${selectedCategories.includes(category.id) ? 'selected' : ''}`}
                  >
                    {selectedCategories.includes(category.id) ? '-' : '+'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {responseMessage && <p>{responseMessage}</p>}
        <button type="submit" className="button-small">Add Meeting</button>
      </form>
    </div>
  );
}

export default AddMeetingForm;
