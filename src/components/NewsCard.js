import React from 'react';
import { prepareDate } from '../utils/functions'

import './newscard.css';


export default function NewsCard({ text, photo, date }) {
	const scheme = document.body.attributes.getNamedItem("scheme").value
    return (
        <div className={`news-wraper ${scheme == 'space_gray' ? 'dark' : null}`}>
            {photo ? <div className="image-wraper">
                 <img src={photo}></img>
            </div>: null }
            <div className="news-content">
                <div className="news-text">{text}</div>
                <div className="news-time">{prepareDate(date)}</div>
            </div>
        </div>
    )
}