import React, { useState } from "react";
import './AddMeetingForm.css'
import '../App.css'


function AddMeetingForm() {
  const [formData, setFormData] = useState({
    meeting_name: "",
  });

  const [responseMessage, setResponseMessage] = useState("");

  // Handle changes to input fields
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:443/meeting/addMeeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage(data.message);
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
          <label htmlFor="meeting">Meeting Name:</label>
          <input
            type="text"
            id="meeting_name"
            name="meeting_name"
            value={formData.meeting_name}
            onChange={handleChange}
            required
          />
        </div>
        {responseMessage && <p>{responseMessage}</p>}
        <button type="submit" className="button-small" >Add meeting</button>
      </form>

      
    </div>
  );
}

export default AddMeetingForm;
