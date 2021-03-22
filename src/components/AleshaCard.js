import React from 'react';
import mainStore from '../store/mainStore';
import './aleshacard.css';

export default function CustomCard({ data }) {
    console.log(data)
    let t = "customcard "
    let d = ""
    let points = 0
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
            points = data.t
        } 
        else if(data.km == 0){
            d = "Аттестация 1"
            t += "empty"
            points = data.a
        }
        else if(data.km == -2){
            if(data.m){
                d = "не определено"
                if(/зач[её]т/gmi.test(data.m)){
                    t += "fine"
                    points = 'зач'
                } else {
                    if(/отлично/gmi.test(data.m)){
                        t += "fine"
                        points = 'отл'
                    } else if(/хорошо/gmi.test(data.m)){
                        t += "good"
                        points = 'хор'
                    } else if(/удовлетворительно/gmi.test(data.m)){
                        t += "bad"
                        points = 'удв' 
                    } else {
                        if(data.km == -1){
                            t += "empty"
                            points = '❓'
                        } else {
                            t += "fail"
                            points = '🙁'
                        }
                    }
                }
            } else {
                t += 'empty'
                points = '❓'
            }
        }else {
            if(data.t > 80){
                t += "fine"
            } else if(data.t > 60){
                t += "good"
            } else if(data.t > 39){
                t += "bad" 
            } else {
                t += "fail"
            }
            points = data.t
        }
    }else{
        if(data.km == 1){
            if(/зач[её]т/gmi.test(data.m)){
                t += "fine"
                points = 'зач'
            } else {
                t += "fail"
                points = '🙁'
            }
        }
        else if(data.km == 0){
            d = "Аттестация 1"
            t += "empty"
            points = data.a
        }
        else if(data.km == 2){
                if(/зач[её]т/gmi.test(data.m)){
                    t += "fine"
                } else {
                    if(/отлично/gmi.test(data.m)){
                        t += "fine"
                        points = 'отл'
                    } else if(/хорошо/gmi.test(data.m)){
                        t += "good"
                        points = 'хор'
                    } else if(/удовлетворительно/gmi.test(data.m)){
                        t += "bad" 
                        points = 'удв'
                    } else {
                        if(data.km == -1){
                            t += "empty"
                            points = '❓'
                        } else {
                            t += "fail"
                            points = '🙁'
                        }
                    }
                }
        } else {
            if(/отлично/gmi.test(data.m)){
                t += "fine"
                points = 'отл'
            } else if(/хорошо/gmi.test(data.m)){
                t += "good"
                points = 'хор'
            } else if(/удовлетворительно/gmi.test(data.m)){
                t += "bad" 
                points = 'удв'
            } else {
                t += "fail"
                points = '🙁'
            }
        }
    }
    return (<div className={`alesha_card ${t} ${mainStore.theme}`}>
        <div className="top">
            <div className="subj">{data.name}</div>
            <div className="type">{d}</div>
        </div>
        <div className="line line1"></div>
        <div className="line line2"></div>
        <div className="line line3"></div>
        <div className="points">{points}</div>
    </div>)
}
