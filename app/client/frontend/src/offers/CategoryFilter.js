import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './CategoryFilter.css'

const CategoryFilter = (props) => {

    const [selectedCategoryId, setSelectedCategoryId] = useState({});
    const [categories, setCategories] = useState([])
    const [nbrOfLevels, setNbrOfLevels] = useState(1)

    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        checkNbrOfLevels();
    }, [categories]);

    useEffect(() => {
        populateCategoryState()
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

    const handleClick = (categoryId, levelIndex) => {
        setSelectedCategoryId(prevState => ({
            ...prevState,
            [`level_${levelIndex}`]: categoryId
        }));
        props.activeCategoryFilter(props.setFilterByCategory, categoryId, levelIndex); 
    };

    const checkNbrOfLevels = () => {
        const maxLevel = Math.max(...categories.map(category => category.level), 1);
        setNbrOfLevels(maxLevel);
    };


    const populateCategoryState = () => {
        const categoryLevelList = {}

        for (let i = 0; i < nbrOfLevels; i++) {
            categoryLevelList[`level_${i}`] = `all_${i}`;
        }

        setSelectedCategoryId(categoryLevelList);
    }


    return (
        <>
            <div className='categoryFilterDiv'>
                {Array.from({ length: nbrOfLevels }).map((_, levelIndex) => (
                <div className='categoryLevelDiv' key={levelIndex}>
                    {categories.map(category => (
                        category.level === (levelIndex + 1) && (
                            <div className={`categoryButton ${selectedCategoryId[`level_${levelIndex}`] === category.id ? 'active' : ''}`} role='button' key={category.id} onClick={ () => handleClick(category.id, levelIndex)}>{category.category_name}</div>
                        )
                    ))}
                    <div className={`categoryButton ${selectedCategoryId[`level_${levelIndex}`] === `all_${levelIndex}` ? 'active' : ''}`}  role='button' onClick={() => handleClick(`all_${levelIndex}`, levelIndex)}>Alla</div> 
                </div>
                ))}
            </div>
        </>
    )
}

export default CategoryFilter