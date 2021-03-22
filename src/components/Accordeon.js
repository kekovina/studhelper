import React from 'react'
import mainStore from '../store/mainStore'

import './accordeon.css';

export default function Accordeon({ active, title, children, setActive }) {
    const toggle = () => active === title ? setActive("") : setActive(title)
    return (
        <div className={`accordeon_wrap ${ title === active ? 'active' : ''} ${mainStore.theme}`} >
            <div className="accordeon_title" onClick={toggle} >{title}</div>
            <div className="accordeon_content">   
                {children}
            </div>
        </div>
    )
}
