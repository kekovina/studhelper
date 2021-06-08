import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { platform, IOS, CellButton, Group, Header, ActionSheet, ActionSheetItem, ScreenSpinner, RichCell, Button,
	SimpleCell, Cell, Avatar, Text, Div } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import { Icon44SmileOutline } from '@vkontakte/icons';
import { getDate, prepareDate, getWeek, getTime } from '../utils/functions'
import { inject, observer } from 'mobx-react'
import Alesha from '../components/Alesha'
import mainStore from '../store/mainStore'

import './Schedule.css';

const osName = platform();


const Schedule = inject("store")(observer(({ store, setPopout, id, go }) => {
	const [selectedDate, setSelectedDate] = useState(getDate);
	const [selectedSchedule, setSelectedSchedule] = useState(null)
	const { schedule } = store

	
	var weeks = 0;
	const now = new Date()
	const handler = type => {
		if(type == "next"){
			setPopout(null)
			openSelector()
			weeks+=1
		} else {
			setSelectedDate(type)
		}
	}
	
	useEffect(() => {
		if(selectedDate.day.getDay() == 0){
			setSelectedDate(getDate(new Date(), 1))
		}
	}, [])
	Date.prototype.getWeek = function() {
        var onejan = new Date(this.getFullYear(), 0, 1);
		if(this.getDay() == 6){
			return Math.ceil((((this - onejan - 24*60*60*1000) / 86400000) + onejan.getDay() + 1) / 7);
		}
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }
	const openSelector = () => {
		const popout = (<ActionSheet 
        onClose={setPopout.bind(this, null)}
        iosCloseItem={<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
      >
	
	{
			getWeek(new Date(now.getTime()+weeks*7*24*60*60*1000)).map((i,index) => {
			var {day, text, mini} = getDate(i);
			if(!day.getDay()){
				return 
			}
			
			return (
			<ActionSheetItem autoclose onClick={handler.bind(this, {text, day, mini})} subtitle="Авто" mode={day.getDate() == selectedDate.day.getDate() ? 'cancel' : 'default'}>
        	{day.getDate() == new Date(now.getTime()+24*60*60*1000).getDate() ? "завтра" : day.getDate() == now.getDate() ?  "сегодня" : text}
        </ActionSheetItem>)
		})}
		{(weeks < 2 && <ActionSheetItem autoclose onClick={handler.bind(this, "next")} subtitle="Авто">
        	Другие даты
        </ActionSheetItem>)}
      </ActionSheet>)
		setPopout(popout)
		weeks+=1
	}
	// useEffect(() => {
	// 	getSchedule()
	// }, []);
	useEffect(() => {
		if(schedule){
			setSelectedSchedule(schedule.data.filter(item => item.date == selectedDate.mini)[0]?.schedule || null)
		}
	},[schedule, selectedDate])
	return (<Panel id={id}>
		<PanelHeader
			left={<PanelHeaderButton onClick={go} data-to="home">
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
		>
			Расписание
		</PanelHeader>
		<div className="selected_date">{selectedDate.text}. {selectedDate.day.getDay() ? `${selectedDate.day.getWeek() % 2 ? "Чётная" : "Нечётная"} неделя` : ''}</div>
		<div className="changewrap">
			<button onClick={openSelector} className={`changedate ${mainStore.theme}`}>Выбрать другую дату</button>
		</div>
		<Group header={schedule ? <Header mode="secondary">Расписание загружено {prepareDate(schedule.updated)}</Header> : null}>
		{selectedSchedule && selectedSchedule.map(subject => {
			const status = (now.getDate() == selectedDate.day.getDate()) && (getTime(now) >= subject.start) && (getTime(now) <= subject.end) ? 'active' : (now.getDate() == selectedDate.day.getDate()) && (getTime(now) >= subject.end) ? "last" :  now.getTime() > selectedDate.day.getTime() ? "last" : "future"
			return (<Alesha subject={subject} selectedDate={selectedDate} status={status}/>)
		})}
	  {!selectedSchedule && (
		<Group style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<Icon44SmileOutline 	width={100} height={100} style={{color: '#aaa'}}/>
			<Text weight="medium" style={{fontSize: '18px', color: "#aaa", textTransform: 'uppercase', marginTop: "10px"}}>Расписания на этот день нет</Text>
		</Group>
	  )}
		

		</Group>
	</Panel>)
}))



export default Schedule;
