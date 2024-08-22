import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const CategoryFilter = (props) => {

    const categories = [{'id': 'aeb778ee-939d-44e4-8f57-8810c3347dae', 'name': 'Lokaler'}, {'id': '6a319924-f2d3-4813-8103-7ad7fc7676ce', 'name': 'Evenemang'}, {'id': '2b6af113-55d2-4bcc-9066-d17196ffd745', 'name': 'Övrigt'}]

    return (
        <>
            {categories.map(category => (
                <button value={category.id} key={category.id} onClick={props.activeCategoryFilter}>{category.name}</button>
            ))}
            <button value='' onClick={props.activeCategoryFilter}>Alla</button> 
        </>
    )
}

export default CategoryFilter