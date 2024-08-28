import React, { useEffect, useState } from 'react';
import './CategoryList.css';
import '../App.css';

function CategoryList({ categories, loading, error, onRemoveCategory, isBlinking }) { // Accept isBlinking as a prop
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

  return (
    <div className="category-list">
      <h3>All Categories</h3>
      <ul className={blinkClass}>
        {categories.map((category) => (
          <li key={category.id}>
            {category.category_name}
            <button type="button" className="remove-button" onClick={() => onRemoveCategory(category.id)}>
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryList;
