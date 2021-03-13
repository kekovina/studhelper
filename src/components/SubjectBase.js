import React from 'react';
import {Group, RichCell, Text} from '@vkontakte/vkui';

import './subjectbase.css';

export default function SubjectBase({ subject, selectedDate }){
        const scheme = document.body.attributes.getNamedItem("scheme").value
	    const now = new Date()
        const color = /лекц/gi.test(subject.type) ? '#1fcecb' : /лаб/gi.test(subject.type) ? '#DB324D' : /практ/gi.test(subject.type) ? "#3590F3" : "#C2BBF0"
			const visible = ((`${((now.getHours()+'').length < 2 ? '0' : '')+now.getHours()}:${((now.getMinutes()+'').length < 2 ? '0' : '')+now.getMinutes()}` > subject.end) && now.getDate() == selectedDate.day.getDate()) || ((now > selectedDate.day) && selectedDate.day.getDate() != now.getDate())
			return (
		<Group>
		{subject.walk &&
		(<div className="walkblock" style={visible ? {opacity: '.4'} : {}}>
				<div className="from">{subject.walk.from}</div>
				<div>
					{subject.walk.time && <div className={`str-time ${subject.walk.time > 9 ? 'harryup' : null}`}>{subject.walk.time} мин.</div>}
					<div className={`strelki ${scheme == "space_gray" ? "" : "inverse"}`} style={{display: 'block', textAlign: 'center'}}>
						<span> {">"} </span>
						<span> {">"} </span>
						<span> {">"} </span>
					</div>
				</div>
				<div className="to">{subject.walk.to}</div>
		</div>)}
		<RichCell
		style={visible ? {opacity: '.4'} : {}}
        disabled
        multiline
        text={subject.prep}
        caption={<div>
		<div style={{display: 'flex', flexDirection: 'row', paddingLeft: "5px", background: `linear-gradient(90deg, ${color}, 40%, transparent)`, color: 'white'}}>
			<Text>{subject.type || "Тип не определён"}</Text>
		</div>
		{subject.pg ? 
		<div style={{display: 'flex', flexDirection: 'row', paddingLeft: "5px", background: `linear-gradient(90deg, #53105E, 40%, transparent)`, color: 'white'}}>
			<Text>Подгруппа {subject.pg}</Text>
		</div> : ''}
		
		</div>}
        after={subject.aud}
		before={<Group style={{padding: "0 10px", display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<Group style={{marginTop: '-11px'}}>
				<Text weight="medium">{subject.start}</Text>
				<Text weight="medium" style={{marginTop: '2px'}}>{subject.end}</Text>
			</Group>
			{/* <Avatar shadow={false} style={{boxShadow:  type == "Лекция" ? '0 0 15px #1fcecb' : type == "Лабораторное занятие" ? '0 0 15px #DB324D' : type == "Практическое занятие" ? "0 0 15px #3590F3" : "0 0 15px #C2BBF0", marginTop: '5px',
			background: type == "Лекция" ? '#1fcecb' : type == "Лабораторное занятие" ? '#DB324D' : type == "Практическое занятие" ? "#3590F3" : "#C2BBF0", marginTop: '5px'}} size={24}>{item.num}</Avatar> */}
		</Group>}
        // actions={
        //   <React.Fragment>
        //     <Button>Сходить</Button>
        //     <Button mode="secondary">Прогулять</Button>
        //   </React.Fragment>
        // }
      >
	  {subject.subj}
	  </RichCell></Group>)
}