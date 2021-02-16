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

const osName = platform();

const Schedule = props => {
	const [currDate, setCurrDate] = useState(getDate);
	const [isOdd, setIsOdd] = useState(false)
	const [currDateSched, setCurrDateSched] = useState(null)
	const [schedule, setSchedule] = useState(null)
	var weeks = 0;
	const now = new Date()
	const handler = type => {
		if(type == "next"){
			props.setPopout(null)
			openSelector()
			weeks+=1
			setIsOdd(!isOdd)
			console.log('next')
		} else {
			setCurrDate(type)
			setCurrDateSched(type.day.getDay())
			setIsOdd(isOddWeek(type.day))
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
	const isOddWeek = (date = new Date()) => {
		var onejan = new Date(date.getFullYear(), 0, 1);		
		return !(Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7) % 2);
	}
	const openSelector = () => {
		const popout = (<ActionSheet 
        onClose={() => props.setPopout(null)}
        iosCloseItem={<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
      >
	{
			getWeek(new Date(now.getTime()+weeks*7*24*60*60*1000)).map((i,index) => {
			var {day, text} = getDate(i);
			if(!day.getDay()){
				return 
			}
			return (<ActionSheetItem autoclose onClick={handler.bind(this, {text: text, day: day})} subtitle="Авто" mode={day.getDate() == currDate.day.getDate() ? 'cancel' : 'default'}>
        	{day.getDate() == new Date(now.getTime()+24*60*60*1000).getDate() ? "завтра" : day.getDate() == now.getDate() ?  "сегодня" : text}
        </ActionSheetItem>)
		})}
		{(weeks < 4 && <ActionSheetItem autoclose onClick={handler.bind(this, "next")} subtitle="Авто">
        	Другие даты
        </ActionSheetItem>)}
      </ActionSheet>)
		props.setPopout(popout)
		weeks+=1
	}
	useEffect(() => {
		setIsOdd(isOddWeek())
		getSchedule()
		setCurrDateSched(new Date().getDay())
	}, []);
	return (<Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderButton onClick={props.go} data-to="home">
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
		>
			Расписание
		</PanelHeader>
		{/* <HorizontalCalendar
	choosed={choosed}
	onClick={({ choosedDay, dayNumber }) => {
		setChoosed(dayNumber);
		
	}}/> */}
		<Group header={<Header mode="primary">{currDate.text}. {isOdd ? 'Нечётная неделя' : 'Чётная неделя'}</Header>}>
			<CellButton onClick={openSelector}> Выбрать другую дату</CellButton>
		</Group>
		<Group header={schedule ? <Header mode="secondary">Расписание загружено {prepareDate(schedule.updated)}</Header> : null}>
		{schedule ? !isOdd ? schedule.even[currDateSched].length ?
		schedule.even[currDateSched].map(item => { 
			const type = /^Л$/gi.test(item.type) ? "Лекция" : /^лаб/gi.test(item.type) ? "Лабораторное занятие" : /^пр/gi.test(item.type) ? "Практическое занятие" : "Тип занятия не определён"
			const time = item.time.split('-')
			const color = type == "Лекция" ? '#1fcecb' : type == "Лабораторное занятие" ? '#DB324D' : type == "Практическое занятие" ? "#3590F3" : "#C2BBF0"
			
			return (<RichCell
		style={(now.getDate() >= currDate.day.getDate()) && (`${((now.getHours()+'').length < 2 ? '0' : '')+now.getHours()}:${((now.getMinutes()+'').length < 2 ? '0' : '')+now.getMinutes()}` > time[1]) ? {opacity: '.4'} : {}}
        disabled
        multiline
        text={item.prep}
        caption={<div style={{display: 'flex', flexDirection: 'row', paddingLeft: "10px", background: `linear-gradient(90deg, ${color}, 40%, transparent)`, color: 'white'}}>
			<Text>{type}</Text>
		</div>}
        after={item.aud}
		before={<Group style={{padding: "0 10px", display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<Group style={{marginTop: '-11px'}}>
				<Text weight="medium">{time[0]}</Text>
				<Text weight="medium" style={{marginTop: '2px'}}>{time[1]}</Text>
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
	  {item.subj}
	  </RichCell>
		)}) : <Group style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<Icon44SmileOutline 	width={100} height={100} style={{color: '#aaa'}}/>
			<Text weight="medium" style={{fontSize: '18px', color: "#aaa", textTransform: 'uppercase', marginTop: "10px"}}>Расписания на сегодня нет</Text>
		</Group> : 
		schedule.odd[currDateSched].length ?
		schedule.odd[currDateSched].map(item => { 
			const type = /^Л$/gi.test(item.type) ? "Лекция" : /^лаб/gi.test(item.type) ? "Лабораторное занятие" : /^пр/gi.test(item.type) ? "Практическое занятие" : "Тип занятия не определён"
			const time = item.time.split('-')
			const color = type == "Лекция" ? '#1fcecb' : type == "Лабораторное занятие" ? '#DB324D' : type == "Практическое занятие" ? "#3590F3" : "#C2BBF0"
			return (<RichCell
		style={(now.getDate() >= currDate.day.getDate()) && (`${((now.getHours()+'').length < 2 ? '0' : '')+now.getHours()}:${((now.getMinutes()+'').length < 2 ? '0' : '')+now.getMinutes()}` > time[1]) ? {opacity: '.4'} : {}}
        disabled
        multiline
        text={item.prep}
		before={<Group style={{padding: "0 10px", display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<Group style={{marginTop: '-11px'}}>
				<Text weight="medium">{time[0]}</Text>
				<Text weight="medium" style={{marginTop: '2px'}}>{time[1]}</Text>
			</Group>
			</Group>}
		// before={<Avatar shadow={false} style={{background: 'red'}} size={28}>{item.num}</Avatar>}
        caption={<div style={{display: 'flex', flexDirection: 'row', paddingLeft: "5px", background: `linear-gradient(90deg, ${color}, 40%, transparent)`, color: 'white'}}>
			<Text>{type}</Text>
		</div>}
        after={item.aud}
        // actions={
        //   <React.Fragment>
        //     <Button>Сходить</Button>
        //     <Button mode="secondary">Прогулять</Button>
        //   </React.Fragment>
        // }
      >
	  {item.subj}
	  </RichCell>
		)}) : 
		<Group style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<Icon44SmileOutline 	width={100} height={100} style={{color: '#aaa'}}/>
			<Text weight="medium" style={{fontSize: '18px', color: "#aaa", textTransform: 'uppercase', marginTop: "10px"}}>Расписания на сегодня нет</Text>
		</Group>
		: null}
		</Group>
	</Panel>)
}



export default Schedule;
