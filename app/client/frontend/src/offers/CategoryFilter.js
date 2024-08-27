import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './CategoryFilter.css'

const CategoryFilter = (props) => {

    const [selectedCategoryId, setSelectedCategoryId] = useState('all_0');
    const [categories, setCategories] = useState([])
    const [nbrOfLevels, setNbrOfLevels] = useState(1)

/*
    const categories = [
        {'id': 'aeb778ee-939d-44e4-8f57-8810c3347dae', 'name': 'Lokaler'},
        {'id': '6a319924-f2d3-4813-8103-7ad7fc7676ce', 'name': 'Evenemang'},
        {'id': '2b6af113-55d2-4bcc-9066-d17196ffd745', 'name': 'Övrigt'}
    ];
*/
    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        checkNbrOfLevels();
    }, [categories]);

    useEffect(() => {
        console.log(nbrOfLevels)
    }, [nbrOfLevels]);


    const getCategories = async () => {
        const response = await fetch('http://localhost:443/category/getAll');
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData)
            console.error('Error:', errorData); 
            throw new Error(errorData);
        }

        const result = await response.json();
        setCategories(result)
    }

    const handleClick = (categoryId) => {
        setSelectedCategoryId(categoryId); // Update the selected category
        props.activeCategoryFilter(props.setFilterByCategory,categoryId); // Call the parent's filter function
    };

    const checkNbrOfLevels = () => {
        const maxLevel = Math.max(...categories.map(category => category.level), 1);
        setNbrOfLevels(maxLevel);
    };


    return (
        <>
            <div className='categoryFilterDiv'>
                {Array.from({ length: nbrOfLevels }).map((_, levelIndex) => (
                <div className='categoryLevelDiv' key={levelIndex}>
                    {categories.map(category => (
                        category.level === (levelIndex + 1) && (
                            <div className={`categoryButton ${selectedCategoryId === category.id ? 'active' : ''}`} role='button' key={category.id} onClick={ () => handleClick(category.id)}>{category.category_name}</div>
                        )
                    ))}
                    <div className={`categoryButton ${selectedCategoryId === `all_${levelIndex}` ? 'active' : ''}`}  role='button' onClick={() => handleClick(`all_${levelIndex}`)}>Alla</div> 
                </div>
                ))}
            </div>
        </>
    )
}

export default CategoryFilter