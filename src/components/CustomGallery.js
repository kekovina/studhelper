import React from 'react';
import './customgallery.css';

export default function CustomGallery({ data }) {
    return (
    <div class="customgallery">
            <div class="gallery-name">{data.name}</div>
            <div class="gallery-desc">Экзамен</div>
            <div class="gallery-row">
                Аттестация 1:    {data.att}
                </div>
            <div class="gallery-res">{data.res}</div>
    </div>)
}
