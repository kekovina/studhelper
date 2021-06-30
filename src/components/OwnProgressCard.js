import React from 'react'
import './ownprogresscard.css'

export default function OwnProgressCard({ data, theme }) {
    let t = "customcard "
    let d = ""
    let points = 0
    let clt = 'empty'
    switch(data.km){
        case 0:
            d = "Аттестация 1"
            clt = 'empty'
            break;
        case 1:
            d = "зачёт"
            clt = 'za4'
            break;
        case 2:
            d = "дифф. зачёт"
            clt='diff'
            break;
        case 3:
            d = "экзамен"
            clt = 'exam'
            break;
        case 4:
            d = "курс. раб"
            clt = 'kurs'
            break;
        default:
            d = "сообщите разработчику"
            clt = 'empty'
            break;
    }
    if(data.t){
        if(data.km == 1){
            if(data.t >= 40){
                t += "za4et"
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
                    t += "za4et"
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
                t += "za4et"
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
                    t += "za4et"
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
    return (
        <div class={`bar ${clt} ${theme}`}>
            <div class="type">
                {d}
            </div>
            <div class="range-wrap">
                <div class="range">
                    <div class={`range-line ${t}`} style={data.km == 0 ? {width: `${points / 30 * 100}%`} : {width: `${data.t || 0}%`}}>

                    </div>
                    {(data.km == 1) && <div class="range-ranks">
                        <div class="range-40"></div>    
                    </div>}
                    {(data.km == 0) && <div class="range-ranks">
                        <div class="range-20"></div>    
                    </div>}
                    {(data.km > 1) && <div class="range-ranks">
                        <div class="range-41"></div>
                        <div class="range-60"></div> 
                        <div class="range-80"></div>     
                    </div>}
                    <div class="range-text">
                        <div>{data.name.length > 50 ? data.name.slice(0,50)+"..." : data.name}</div>
                    </div>
                </div>
                <div class="status">{points}</div>
            </div>
        </div>
    )
}
