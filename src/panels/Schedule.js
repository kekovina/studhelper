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
import { getDate, prepareDate, getWeek } from '../utils/functions'
import axios from 'axios'
import HorizontalCalendar from 'vkui-horizontal-calendar';


import './Schedule.css';

const osName = platform();

const Schedule = props => {
	const [selectedDate, setSelectedDate] = useState(getDate);
	const [schedule, setSchedule] = useState(null)
	const [selectedSchedule, setSelectedSchedule] = useState(null)
	var weeks = 0;
	const now = new Date()
	
	const scheme = document.body.attributes.getNamedItem("scheme").value
	const handler = type => {
		if(type == "next"){
			props.setPopout(null)
			openSelector()
			weeks+=1
		} else {
			setSelectedDate(type)
		}
	}
	const getSchedule = () => {
		props.setPopout(<ScreenSpinner size='large' />)
		axios.get("https://tsu-helper-server.herokuapp.com/getSchedule", {params: {group: props.group}})
		.then(res => {
			if(!res.data.err){
				setSchedule(res.data.res.data)
			} else {
				props.createError({type: 1, descr: res.data.text, name: "Ошибка запроса", code: res.data, back: 'home'})
			}
			props.setPopout(null)
		})
	}
	Date.prototype.getWeek = function() {
        var onejan = new Date(this.getFullYear(), 0, 1);
		if(this.getDay() == 6){
			return Math.ceil((((this - onejan - 24*60*60*1000) / 86400000) + onejan.getDay() + 1) / 7);
		}
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }
	const openSelector = () => {
		const popout = (<ActionSheet 
        onClose={() => props.setPopout(null)}
        iosCloseItem={<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
      >
	{
			getWeek(new Date(now.getTime()+weeks*7*24*60*60*1000)).map((i,index) => {
			var {day, text, mini} = getDate(i);
			if(!day.getDay()){
				return 
			}
			return (<ActionSheetItem autoclose onClick={handler.bind(this, {text, day, mini})} subtitle="Авто" mode={day.getDate() == selectedDate.day.getDate() ? 'cancel' : 'default'}>
        	{day.getDate() == new Date(now.getTime()+24*60*60*1000).getDate() ? "завтра" : day.getDate() == now.getDate() ?  "сегодня" : text}
        </ActionSheetItem>)
		})}
		{(weeks < 2 && <ActionSheetItem autoclose onClick={handler.bind(this, "next")} subtitle="Авто">
        	Другие даты
        </ActionSheetItem>)}
      </ActionSheet>)
		props.setPopout(popout)
		weeks+=1
	}
	useEffect(() => {
		getSchedule()
	}, []);
	useEffect(() => {
		if(schedule){
			setSelectedSchedule(schedule.data.filter(item => item.date == selectedDate.mini)[0]?.schedule || null)
		}
	},[schedule, selectedDate])
	return (<Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderButton onClick={props.go} data-to="home">
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
		>
			Расписание
		</PanelHeader>
		<Group header={<Header mode="primary">{selectedDate.text}. {selectedDate.day.getDay() ? `${selectedDate.day.getWeek() % 2 ? "Чётная" : "Нечётная"} неделя` : ''}</Header>}>
			<CellButton onClick={openSelector}> Выбрать другую дату</CellButton>
		</Group>
		<Group header={schedule ? <Header mode="secondary">Расписание загружено {prepareDate(schedule.updated)}</Header> : null}>
		
		{selectedSchedule && selectedSchedule.map(subject => {
			const color = /лекц/gi.test(subject.type) ? '#1fcecb' : /лаб/gi.test(subject.type) ? '#DB324D' : /практ/gi.test(subject.type) ? "#3590F3" : "#C2BBF0"

			return (
		<Group>
		{subject.walk &&
		(<div className="walkblock" style={((now.getDate() >= selectedDate.day.getDate()) && (`${((now.getHours()+'').length < 2 ? '0' : '')+now.getHours()}:${((now.getMinutes()+'').length < 2 ? '0' : '')+now.getMinutes()}` > subject.end)) || (now.getDate() >= selectedDate.day.getDate()) ? {opacity: '.4'} : {}}>
				<div className="from">{subject.walk.from}</div>
				<div>
					{subject.walk.time && <div className={`str-time {subject.walk.time > 9 ? 'harryup' : null}`}>{subject.walk.time} мин.</div>}
					<div className={`strelki ${scheme == "space_gray" ? "" : "inverse"}`} style={{display: 'block', textAlign: 'center'}}>
						<span> {">"} </span>
						<span> {">"} </span>
						<span> {">"} </span>
					</div>
				</div>
				<div className="to">{subject.walk.to}</div>
		</div>)}
		<RichCell
		style={((now.getDate() >= selectedDate.day.getDate()) && (`${((now.getHours()+'').length < 2 ? '0' : '')+now.getHours()}:${((now.getMinutes()+'').length < 2 ? '0' : '')+now.getMinutes()}` > subject.end)) || ((now.getDate() >= selectedDate.day.getDate()) && (`${((now.getHours()+'').length < 2 ? '0' : '')+now.getHours()}:${((now.getMinutes()+'').length < 2 ? '0' : '')+now.getMinutes()}` > subject.end)) ? {opacity: '.4'} : {}}
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
	  </RichCell></Group>)})}
	  {!selectedSchedule && (
		<Group style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<Icon44SmileOutline 	width={100} height={100} style={{color: '#aaa'}}/>
			<Text weight="medium" style={{fontSize: '18px', color: "#aaa", textTransform: 'uppercase', marginTop: "10px"}}>Расписания на этот день нет</Text>
		</Group>
	  )}
		

		</Group>
	</Panel>)
}



export default Schedule;
