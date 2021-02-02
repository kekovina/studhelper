import React from 'react';
import PropTypes from 'prop-types';
import { platform, IOS, InfoRow, Cell, Group, Header } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import persik from '../img/persik.png';
import './Persik.css';

const osName = platform();

const getKM = id => {
	switch(id){
		case 0:
			return "Не определено"
		case 1:
			return "Зачёт"
		case 2: 
			return "Дифференцированный зачёт"
		case 3:
			return "Экзамен"
		case 4:
			return "Курсовая работа"
		default:
			return "Ошибка. Сообщите разработчику"
	}
}

const DetailedProgress = ({ id, go, data }) => (
	<Panel id={id}>
		<PanelHeader
			left={<PanelHeaderButton onClick={go} data-to="progress">
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
		>
			Курс {Math.floor(data.term/2)+1}. Семестр {data.term+1}
		</PanelHeader>
		<Group>
		<Header mode="primary">{data.name}</Header>
			<Cell>
				<InfoRow header="Тип">{getKM(data.km)}</InfoRow>
			</Cell>
			<Cell>
				<InfoRow header="Первая аттестация">{data.a || "Нет информации"}</InfoRow>
			</Cell>
			<Cell>
				<InfoRow header="Итоговый балл">{data.t || "Нет информации"}</InfoRow>
			</Cell>
			<Cell>
				<InfoRow header="Отметка">{data.m}</InfoRow>
			</Cell>
		</Group>
	</Panel>
);

DetailedProgress.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default DetailedProgress;
