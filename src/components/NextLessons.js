import React from 'react'

export default function NextLessons({ data }) {
    return (
       
        <div>
            Следующий учебный день <b>{ data.date }</b><br/> 
            Вставать предстоит к <b>{ data.num }</b> паре, к <b>{ data.start }</b><br/> 
            Предмет: <b>{ data.subj }</b><br/>Перодаватель: <b>{ data.prep }</b>
        </div>
    )
}
