import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { platform, IOS, CellButton, Group, Header, ActionSheet, ActionSheetItem } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import { getDate } from '../utils/functions'

const osName = platform();

const Schedule = props => {
	const [currDate, setCurrDate] = useState(getDate);
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
	return (<Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderButton onClick={props.go} data-to="home">
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
		>
			Расписание
		</PanelHeader>
		<Group header={<Header mode="primary">{currDate}</Header>}>
			<CellButton onClick={openSelector}> Выбрать другую дату</CellButton>
		</Group>
	</Panel>)
}

Schedule.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Schedule;
