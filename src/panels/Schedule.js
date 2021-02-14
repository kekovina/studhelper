import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { platform, IOS, CellButton, Group, Header, ActionSheet, ActionSheetItem, ScreenSpinner, RichCell, Button } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import { getDate } from '../utils/functions'
import axios from 'axios'
import HorizontalCalendar from 'vkui-horizontal-calendar';

const osName = platform();

const Schedule = props => {
	const [currDate, setCurrDate] = useState(getDate);
	const [choosed, setChoosed] = useState()
	const [isOdd, setIsOdd] = useState(false)
	var sunday = 0
	var offset = 0;
	const handler = type => {
		if(type == "next"){
			props.setPopout(null)
			openSelector()
		} else {
			setCurrDate(type.text)
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
	const getWeek = () => {
		var curr = new Date()
		var onejan = new Date(curr.getFullYear(), 0, 1);		
		return Math.ceil((((curr - onejan) / 86400000) + onejan.getDay() + 1) / 7) % 2;
	}
	const openSelector = () => {
		const popout = (<ActionSheet 
        onClose={() => props.setPopout(null)}
        iosCloseItem={<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
      >
	  	{[0,0,0,0,0,0,0].map((i,index) => {
			var day = getDate(index+sunday+offset);
			if(/воскресение/.test(day)){
				return 
			}
			return (<ActionSheetItem autoclose onClick={handler.bind(this, {text: day})} subtitle="Авто">
        	{index == 0 && !offset ? "сегодня" : index == 1 && !offset? "завтра" : day}
        </ActionSheetItem>)
		})}
		{(offset < 21 && <ActionSheetItem autoclose onClick={handler.bind(this, "next")} subtitle="Авто">
        	Другие даты
        </ActionSheetItem>)}
      </ActionSheet>)
		props.setPopout(popout)
		offset+=7
	}
	useEffect(() => {
		setIsOdd(getWeek())
		getSchedule()
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
		<Group header={<Header mode="primary">{isOdd ? 'Нечётная неделя' : 'Чётная неделя'}</Header>}>
			<CellButton onClick={openSelector}> Выбрать другую дату</CellButton>
		</Group>
		<Group>
		{!isOdd && props.schedule ? 
		props.schedule.even[0].map(item => ( <RichCell
        disabled
        multiline
        text={item.prep}
        caption={item.type}
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
		)) : null}
		</Group>
	</Panel>)
}

Schedule.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Schedule;
