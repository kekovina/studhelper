import React from 'react';
import './customcard.css';

export default function CustomCard({ data }) {
    let t = "customcard "
    let d = ""
    switch(data.type){
        case 0:
            d = "зачёт"
            break;
        case 1:
            d = "дифф. зачёт"
            break;
        case 2:
            d = "курс. раб."
            break;
        case 3:
            d = "экзамен"
            break;
        default:
            d = "сообщите разработчику"
            break;
    }
    if(data.type == 1){
        if(data.res >= 40){
            t += "fine"
        } else {
            t += "fail"
        }
    } else {
        if(data.res > 80){
            t += "fine"
        } else if(data.res > 60){
            t += "good"
        } else if(data.res > 40){
            t += "bad" 
        } else {
            t += "fail"
        }
    }
    return (<div class={t}>
    <div class="card-type">{d}</div>
    <div class="card-name">{data.name}</div>
    <div class="card-total"><span></span><span>{data.res}</span></div>
    </div>)
}
