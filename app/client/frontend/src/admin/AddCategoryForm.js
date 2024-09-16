import React, { useState, useEffect } from 'react';
import './AddCategoryForm.css';
import '../App.css';
import CategoryList from './CategoryList';

function AddCategoryForm() {
  const [formData, setFormData] = useState({
    category_name: '',
    parent_id: '', // Initialize parent_id as an empty string
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

    // If parent_id is an empty string, set it to null or omit it
    const submissionData = {
      category_name: formData.category_name,
      parent_id: formData.parent_id === '' ? null : formData.parent_id,
    };

    try {
      const response = await fetch('http://localhost:443/category/addCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData), // Include parent_id in the request body if it is not null
      });

      const data = await response.json();

      if (response.ok) {
        fetchCategories();
        setFormData({ category_name: '', parent_id: '' }); // Reset both fields
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
        <h2>Lägg till ny kategori</h2>
        <div>
          <label htmlFor="category_name">Namn:</label>
          <input
            type="text"
            id="category_name"
            name="category_name"
            value={formData.category_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="existing_categories">Underkategori till...</label>
          <select
            id="existing_categories"
            name="parent_id"
            value={formData.parent_id}
            onChange={handleChange}
          >
            <option value="">
              Inte en underkategori
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        {responseMessage && <p>{responseMessage}</p>}

        <button type="submit" className="button-small">Lägg till</button>
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
