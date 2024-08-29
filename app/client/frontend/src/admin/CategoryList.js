import React, { useEffect, useState } from 'react';
import './CategoryList.css';
import '../App.css';

function CategoryList({ categories, loading, error, onRemoveCategory, isBlinking }) {
  const [blinkClass, setBlinkClass] = useState('');

  useEffect(() => {
    if (isBlinking) {
      setBlinkClass('blink');
      const timer = setTimeout(() => {
        setBlinkClass('');
      }, 1000); // Remove the blink class after 1 second

      return () => clearTimeout(timer);
    }
  }, [isBlinking]);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

  // Function to render categories and subcategories recursively
  const renderCategories = (parentId = null) => {
    // Filter categories by parent_id
    const filteredCategories = categories.filter(
      (category) => category.parent_id === parentId
    );

    return filteredCategories.map((category) => (
      <React.Fragment key={category.id}>
        <li
          style={{
            marginLeft: category.parent_id ? '30px' : '0', // Apply margin-left if it's a subcategory
            fontSize: category.parent_id ? '15px' : 'inherit', // Apply font size if it's a subcategory
            borderBottom: category.parent_id ? 'none' : 'inherit', // Remove border for subcategories
          }}
        >
          {category.parent_id ? ` ${category.category_name}` : category.category_name}
          <button style={{backgroundColor: '#fd5c63'}}
            type="button"
            className="remove-button"
            onClick={() => onRemoveCategory(category.id)}
          >
            X
          </button>
        </li>
        {/* Recursively render subcategories */}
        {renderCategories(category.id)}
      </React.Fragment>
    ));
  };

  return (
    <div className="category-list">
      <h3>All Categories</h3>
      <ul className={blinkClass}>
        {renderCategories()} {/* Render top-level categories and their subcategories */}
      </ul>
    </div>
  );
}

export default CategoryList;
