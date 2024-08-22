import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './CategoryFilter.css'

const CategoryFilter = (props) => {

    const [selectedCategoryId, setSelectedCategoryId] = useState('');

    const categories = [
        {'id': 'aeb778ee-939d-44e4-8f57-8810c3347dae', 'name': 'Lokaler'},
        {'id': '6a319924-f2d3-4813-8103-7ad7fc7676ce', 'name': 'Evenemang'},
        {'id': '2b6af113-55d2-4bcc-9066-d17196ffd745', 'name': 'Övrigt'}
    ];

    const handleClick = (categoryId) => {
        setSelectedCategoryId(categoryId); // Update the selected category
        props.activeCategoryFilter(categoryId); // Call the parent's filter function
    };


    return (
        <>
            <div className='categoryFilterDiv'>
                {categories.map(category => (
                    <div className={`categoryButton ${selectedCategoryId === category.id ? 'active' : ''}`} role='button' key={category.id} onClick={ () => handleClick(category.id)}>{category.name}</div>
                ))}
                <div className={`categoryButton ${selectedCategoryId === '' ? 'active' : ''}`}  role='button' onClick={() => handleClick('')}>Alla</div> 
            </div>
        </>
    )
}

export default CategoryFilter