import React from 'react';
import './CategoryList.css';
import '../App.css';

function CategoryList({ categories, loading, error }) { // Accept props

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="category-list">
      <h3>All Categories</h3>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            {category.category_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryList;
