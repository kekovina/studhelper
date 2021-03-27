import React from 'react';
import {Group, RichCell, Text} from '@vkontakte/vkui';
import mainStore from '../store/mainStore'

import './alesha.css';

export default function Alesha({ subject, selectedDate, status }){
        const color = /лекц/gi.test(subject.type) ? 'lec' : /лаб/gi.test(subject.type) ? "lab" : /практ/gi.test(subject.type) ? "pract" : "empty"
		return (
			<div className={`subject ${mainStore.theme} ${status} ${color}`}>
				<div className="left">
					<div className="start">{subject.start}</div>
					<div className="end">{subject.end}</div>
					<div className="aud">{subject.aud}</div>
				</div>
				<div className="right">
					<div className="subj">{subject.subj}</div>
					<div className="prep">{subject.prep}</div>
					<div className={`types`}>
						<div className="type">{subject.type}</div>
						{subject.pg && <div className={`pg`}>Подгруппа {subject.pg}</div>}
					</div>
					
				</div>
			</div>
		)
}