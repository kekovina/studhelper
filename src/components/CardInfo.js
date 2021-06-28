import React from 'react'
import './cardinfo.css'

export default function CardInfo({ theme, title, subtitle, content }) {
    return (
        <div className={`card-info ${theme}`}>
           <div className="card-info__title">{title}</div>
           {subtitle ? <div className="card-info__subtitle">{subtitle}</div> : ''}
           
           <div className="card-info__content">{content}</div>
        </div>
    )
}
