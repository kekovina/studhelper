import { observer, inject } from 'mobx-react';
import React from 'react';

import './card-item.css'

const CardItem = inject('store')(observer(({ size, children, stretch, store }) => {
    const stretchStyle = {
        flexBasis: 0,
        flexGrow: 1,
        maxWidth: '100%'
    }
    const sizeCols = (size) => {
        return {
            flex: `0 0 ${(100/3)*size}%`
        }
    }
    return (
        <div className={`card-item ${store.theme}`} style={ stretch ? stretchStyle : sizeCols(size)}>
            { children }
        </div>
    );
}))

export default CardItem;
