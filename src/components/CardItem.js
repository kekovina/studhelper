import React from 'react';

import './card-item.css'

const CardItem = ({ size, children }) => {
    return (
        <div className="card-item" style={{width: `calc ( 100% - 20px / ( 3 - ${size} + 1) )`}}>
            { children }
        </div>
    );
}

export default CardItem;
