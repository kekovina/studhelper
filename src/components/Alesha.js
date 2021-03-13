import React from 'react';
import {Group, RichCell, Text} from '@vkontakte/vkui';

import './alesha.css';

export default function Alesha({ subject, selectedDate }){
        const scheme = document.body.attributes.getNamedItem("scheme").value
	    const now = new Date()
        const color = /лекц/gi.test(subject.type) ? 'lec' : /лаб/gi.test(subject.type) ? "lab" : /практ/gi.test(subject.type) ? "pract" : "empty"
		const visible = ((`${((now.getHours()+'').length < 2 ? '0' : '')+now.getHours()}:${((now.getMinutes()+'').length < 2 ? '0' : '')+now.getMinutes()}` > subject.end) && now.getDate() == selectedDate.day.getDate()) || ((now > selectedDate.day) && selectedDate.day.getDate() != now.getDate())
		return (
			<div className="subject">
				<div className="left">
					<div className="start">{subject.start}</div>
					<div className="end">{subject.end}</div>
					<div className="aud">{subject.aud}</div>
				</div>
				<div className="right">
					<div className="subj">{subject.subj}</div>
					<div className="prep">{subject.prep}</div>
					<div className={`type ${color}`}>{subject.type}</div>
				</div>
			</div>
		)
}