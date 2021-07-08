import React, { useEffect, useState } from 'react'
import './ownprogresscard.css'

export default function OwnProgressCard({ data, theme }) {
    const [ attWidth, setAttWidth ] = useState(0)
    const [ resWidth, setResWidth ] = useState(0)
    useEffect(() => {
        setAttWidth(0)
        setResWidth(0)
        const aw = new Promise((resolve, reject) => {
            setTimeout(() => {
                document.querySelectorAll('.range-line').forEach(el => el.classList.add('animated'))
                resolve(setAttWidth(data.a))
            }, 500)
        })
        const rw = new Promise((resolve, reject) => {
            setTimeout(() => {
                setResWidth(data.t ? data.t - data.a : 0)
                resolve()
            }, 1500)
        })
        Promise.all([aw, rw]).then(setTimeout(animationCallback, 3000))
        
    }, [data])
    const animationCallback = () => document.querySelectorAll('.range-line').forEach(el => el.classList.remove('animated'))
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
                    {(data.a != data.t) && data.a && <div class={`range-line att ${t}`} style={{width: `${attWidth}%`}}></div>}
                    <div class={`range-line ${t}`} style={data.km == 0 ? {width: `${attWidth / 30 * 100}%`} : {width: `${resWidth}%`}}>

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
                </div>
                <div class="range-text">
                    <div>{data.name.length > 50 ? data.name.slice(0,50)+"..." : data.name}</div>
                </div>
                <div class="status"><span class={data.km ? 'status-att' : ''}>{data.a}</span>{points}</div>
            </div>
        </div>
    )
}
