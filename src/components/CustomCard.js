import React from 'react';
import './customcard.css';

export default function CustomCard({ data }) {
    let t = "customcard "
    let d = ""
    switch(data.km){
        case 0:
            d = "Аттестация 1"
            break;
        case 1:
            d = "зачёт"
            break;
        case 2:
            d = "дифф. зачёт"
            break;
        case 3:
            d = "экзамен"
            break;
        case 4:
            d = "курс. раб"
            break;
        default:
            d = "сообщите разработчику"
            break;
    }
    if(data.t){
        if(data.km == 1){
            if(data.t >= 40){
                t += "fine"
            } else {
                t += "fail"
            }
        } 
        else if(data.km == 0){
            d = "Аттестация 1"
            t += "empty"
        }
        else if(data.km == -2){
            if(data.m){
                d = "не определено"
                if(/зач[её]т/gmi.test(data.m)){
                    t += "fine"
                } else {
                    if(/отлично/gmi.test(data.m)){
                        t += "fine"
                    } else if(/хорошо/gmi.test(data.m)){
                        t += "good"
                    } else if(/удовлетворительно/gmi.test(data.m)){
                        t += "bad" 
                    } else {
                        if(data.km == -1){
                            t += "empty"
                        } else {
                            t += "fail"
                        }
                    }
                }
            } else {
                t += 'empty'
            }
        }else {
            if(data.t > 80){
                t += "fine"
            } else if(data.t > 60){
                t += "good"
            } else if(data.t > 40){
                t += "bad" 
            } else {
                t += "fail"
            }
        }
    }else{
        if(data.km == 1){
            if(/зач[её]т/gmi.test(data.m)){
                t += "fine"
            } else {
                t += "fail"
            }
        }
        else if(data.km == 0){
            d = "Аттестация 1"
            t += "empty"
        }
        else if(data.km == 2){
                if(/зач[её]т/gmi.test(data.m)){
                    t += "fine"
                } else {
                    if(/отлично/gmi.test(data.m)){
                        t += "fine"
                    } else if(/хорошо/gmi.test(data.m)){
                        t += "good"
                    } else if(/удовлетворительно/gmi.test(data.m)){
                        t += "bad" 
                    } else {
                        if(data.km == -1){
                            t += "empty"
                        } else {
                            t += "fail"
                        }
                    }
                }
        } else {
            if(/отлично/gmi.test(data.m)){
                t += "fine"
            } else if(/хорошо/gmi.test(data.m)){
                t += "good"
            } else if(/удовлетворительно/gmi.test(data.m)){
                t += "bad" 
            } else {
                t += "fail"
            }
        }
    }
    return (<div class={t}>
    <div class="card-type">{d}</div>
    <div class="card-name">{data.name.length > 60 ? data.name.slice(0,60)+"..." : data.name}</div>
    <div class={data.t ? "card-total" : "card-total-mark"}><span>{((!data.t)) ? (data.m == "Удовлетворительно" ? "удв." : data.m == "Неудовлетворительно" ? "неудвл." : data.m == "Не явился" ? "Неявка" : data.km ? data.m : data.a) : data.t}</span></div>
    </div>)
}
