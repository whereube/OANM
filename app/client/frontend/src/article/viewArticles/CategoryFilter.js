import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './CategoryFilter.css'

const CategoryFilter = (props) => {

    const [selectedCategoryId, setSelectedCategoryId] = useState({});
    const [categories, setCategories] = useState([])
    const [nbrOfLevels, setNbrOfLevels] = useState(1)
    const [currentLevel, setCurrentLevel] = useState(0)
    const [filterActivated, setFilterActivated] = useState(false);

    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        checkNbrOfLevels();
    }, [categories]);

    useEffect(() => {
        populateCategoryState()
    }, [nbrOfLevels]);


    useEffect(() => {
        document.querySelectorAll('.categoryLevelDiv').forEach(div => {
            if (div.querySelectorAll('.categoryDiv').length === 0) {
                div.classList.add('hideIfNoCategory');
            } else {
                div.classList.remove('hideIfNoCategory');
            }
        });
    }, [filterActivated, categories]);

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

        setCurrentLevel(levelIndex)
        setFilterActivated(prevState => (!prevState))
        setSelectedCategoryId(prevState => {
            // Create a copy of the previous state
            const newState = { ...prevState };

            // Iterate over each key in the state
            Object.keys(newState).forEach(key => {
                const level = parseInt(key.split('_')[1], 10); // Extract the level number from the key

                // If the level is higher than the current levelIndex, delete the key
                if (level > levelIndex) {
                    delete newState[key];
                }
            });

            // Update the selected category for the current levelIndex
            newState[`level_${levelIndex}`] = categoryId;

            return newState;
        });

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
                <div className='categoryLevelDiv'>
                    {categories.map(category => (
                        category.parent_id === null && (
                            <div key={category.id} className='categoryDiv'>
                                <div className={`categoryButton ${selectedCategoryId[`level_0`] === category.id ? 'active' : ''}`} role='button' key={category.id} onClick={ () => handleClick(category.id, 0)}>{category.category_name}</div>
                            </div>
                        )
                    ))}
                    <div className={`categoryButton ${selectedCategoryId[`level_0`] === `all_0` ? 'active' : ''}`}  role='button' onClick={() => handleClick(`all_0`, 0)}>Alla</div>
                </div>
                {Array.from({ length: (currentLevel + 1) }).map((_, levelIndex) => (
                    <div className='categoryLevelDiv'>
                        {categories.map(category => (
                            category.parent_id === selectedCategoryId[`level_${levelIndex}`] && (
                                <div key={category.id} className='categoryDiv'>
                                    <div className={`categoryButton ${selectedCategoryId[`level_${(levelIndex + 1)}`] === category.id ? 'active' : ''}`} role='button' key={category.id} onClick={ () => handleClick(category.id, (levelIndex + 1))}>{category.category_name}</div>
                                </div>
                            )
                        ))}
                        <div className={`categoryButton ${selectedCategoryId[`level_${(levelIndex + 1)}`] === `all_${(levelIndex + 1)}` ? 'active' : ''}`}  role='button' onClick={() => handleClick(`all_${(levelIndex + 1)}`, (levelIndex + 1))}>Alla</div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default CategoryFilter