import React from 'react';
import {Group, RichCell, Text} from '@vkontakte/vkui';
import mainStore from '../store/mainStore'

import './alesha.css';

export default function Alesha({ subject, status, skeleton, home, exam }){
	if(skeleton){
		return (
			<div className={`subject ${mainStore.theme} skeleton`}>
				
			</div>
		)
	}else if(!subject){
			return  (<div className={`subject ${mainStore.theme} empty`}>
				Ты ничего не прогуливаешь
			</div>)
	} else {
		var color
		if(!exam){
        	color = /лекц/gi.test(subject.type) ? 'lec' : /лаб/gi.test(subject.type) ? "lab" : /практ/gi.test(subject.type) ? "pract" : "empty"
		} else {
			if(/экз/gi.test(subject.type)){
				subject.type = 'Экзамен'
				color = 'exam'
			} else if(/ДЗ/gi.test(subject.type)){
				subject.type = 'Дифф. зачёт'
				color = 'dz'
			} else if(/зч/gi.test(subject.type)){
				subject.type = 'Зачёт'
				color = 'za4'
			} else if(/кр|курс/gi.test(subject.type)){
				subject.type = 'Курс.работа'
				color = 'kurs'
			} else {
				subject.type = 'Не определил'
				color = 'empty'
			}
		}
		return (
			<div className={`subject ${mainStore.theme} ${status} ${color} ${home ? 'home' : ''}`}>
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
}