import React, { useState, useEffect } from 'react';
import './AddCategoryForm.css';
import '../App.css';
import CategoryList from './CategoryList';

function AddCategoryForm() {
  const [formData, setFormData] = useState({
    category_name: ''
  });

  const [categories, setCategories] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBlinking, setIsBlinking] = useState(false);

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

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
        fetchCategories();
        setFormData({ category_name: '' });
        setIsBlinking(true); // Trigger blinking effect
        setResponseMessage('');
        setTimeout(() => {
            setIsBlinking(false);
          }, 1000);
      } else {
        setResponseMessage(data.message);
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      setResponseMessage('An error occurred while submitting the form.');
    }
  };

  const handleRemoveCategory = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:443/category/deleteCategory/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      setResponseMessage('An error occurred while deleting the category.');
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

      <CategoryList
        categories={categories}
        loading={loading}
        error={error}
        onRemoveCategory={handleRemoveCategory}
        isBlinking={isBlinking} // Pass the blinking state to CategoryList
      />
    </div>
  );
}

export default AddCategoryForm;
