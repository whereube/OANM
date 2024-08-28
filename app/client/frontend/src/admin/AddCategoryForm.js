import React, { useState, useEffect } from 'react';
import './AddCategoryForm.css';
import '../App.css';
import CategoryList from './CategoryList';

function AddCategoryForm() {
  const [formData, setFormData] = useState({
    category_name: ''
  });

  const [categories, setCategories] = useState([]); // Manage categories here
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      setLoading(true); // Set loading before fetching
      const response = await fetch('http://localhost:443/category/getAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('An error occurred while fetching categories.');
      setLoading(false);
    }
  };

  // UseEffect to fetch categories once on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

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
      const response = await fetch('http://localhost:443/category/addCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage(data.message);
        fetchCategories(); // Re-fetch categories after adding a new one
      } else {
        setResponseMessage(data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setResponseMessage('An error occurred while submitting the form.');
    }
  };

  return (
    <div className="category-container">
      <form onSubmit={handleSubmit} className="create-category-form">
        <h2>Add New Category</h2>
        <div>
          <label htmlFor="category_name">Category Name:</label>
          <input
            type="text"
            id="category_name"
            name="category_name"
            value={formData.category_name}
            onChange={handleChange}
            required
          />
        </div>

        {responseMessage && <p>{responseMessage}</p>}

        <button type="submit" className="button-small">Add Category</button>
      </form>

      {/* Render CategoryList with categories state and loading/error state */}
      <CategoryList categories={categories} loading={loading} error={error} />
    </div>
  );
}

export default AddCategoryForm;
