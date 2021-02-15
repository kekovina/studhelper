import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { platform, IOS, CellButton, Group, Header, ActionSheet, ActionSheetItem, ScreenSpinner, RichCell, Button, Cell } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import { getDate, prepareDate, getWeek } from '../utils/functions'
import axios from 'axios'
import HorizontalCalendar from 'vkui-horizontal-calendar';

const osName = platform();

const Schedule = props => {
	const [currDate, setCurrDate] = useState(getDate);
	const [isOdd, setIsOdd] = useState(false)
	const [currDateSched, setCurrDateSched] = useState(null)
	var weeks = 0;
	const handler = type => {
		if(type == "next"){
			props.setPopout(null)
			openSelector()
			weeks+=1
			setIsOdd(!isOdd)
		} else {
			setCurrDate(type)
			setCurrDateSched(type.day.getDay())
		}
	}
	const getSchedule = () => {
		props.setPopout(<ScreenSpinner size='large' />)
		axios.get("https://tsu-helper-server.herokuapp.com/getSchedule", {params: {group: props.group}})
		.then(res => {
			if(!res.data.err){
				props.setSchedule(res.data.res.data)
			} else {
				props.createError({type: 1, descr: res.data.text, name: "Ошибка запроса", code: res.data, back: 'home'})
			}
			props.setPopout(null)
		})
	}
	const isOddWeek = () => {
		var curr = new Date()
		var onejan = new Date(curr.getFullYear(), 0, 1);		
		return !(Math.ceil((((curr - onejan) / 86400000) + onejan.getDay() + 1) / 7) % 2);
	}
	const openSelector = () => {
		const popout = (<ActionSheet 
        onClose={() => props.setPopout(null)}
        iosCloseItem={<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
      >
	{
			getWeek(new Date(currDate.day.getTime()+weeks*7*24*60*60*1000)).map((i,index) => {
			var {day, text} = getDate(i);
			if(!day.getDay()){
				return 
			}
			return (<ActionSheetItem autoclose onClick={handler.bind(this, {text: text, day: day})} subtitle="Авто">
        	{index == 0 && !weeks ? "сегодня" : index == 1 && !weeks? "завтра" : text}
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
		<Group header={props.schedule ? <Header mode="secondary">Расписание загружено {prepareDate(props.schedule.updated)}</Header> : null}>
		{props.schedule ? !isOdd ? 
		props.schedule.even[currDateSched].map(item => { 
			const type = /^Л$/gi.test(item.type) ? "Лекция" : /^лаб/gi.test(item.type) ? "Лабораторное занятие" : /^пр/gi.test(item.type) ? "Практическое занятие" : "Тип занятия не определён"
			return (<RichCell
        disabled
        multiline
        text={item.prep}
        caption={type}
        after={item.aud}
        actions={
          <React.Fragment>
            <Button>Сходить</Button>
            <Button mode="secondary">Прогулять</Button>
          </React.Fragment>
        }
      >
	  {item.subj}
	  </RichCell>
		)}) :
		props.schedule.odd[currDateSched].map(item => { 
			const type = /^Л$/gi.test(item.type) ? "Лекция" : /^лаб/gi.test(item.type) ? "Лабораторное занятие" : /^пр/gi.test(item.type) ? "Практическое занятие" : "Тип занятия не определён"
			return (<RichCell
        disabled
        multiline
        text={item.prep}
        caption={type}
        after={item.aud}
        actions={
          <React.Fragment>
            <Button>Сходить</Button>
            <Button mode="secondary">Прогулять</Button>
          </React.Fragment>
        }
      >
	  {item.subj}
	  </RichCell>
		)})
		: <Cell>Расписания</Cell>}
		</Group>
	</Panel>)
}

Schedule.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Schedule;
