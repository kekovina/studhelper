import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import { Icon16ClockOurline, Icon20EducationOutline, Icon20NewsfeedOutline, Icon24Settings, Icon20ServicesOutline } from '@vkontakte/icons'

const admins = [503012833]

const Home = ({ id, go, fetchedUser, appUser }) => (
	<Panel id={id}>
		<PanelHeader>Привет!</PanelHeader>
		{fetchedUser &&
		<Group>
			<Cell
				before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
				description={(fetchedUser.sex == 1 ? "Студентка" : "Студент") +" " +(appUser.status || "")}
			>
				{`${fetchedUser.first_name} ${fetchedUser.last_name}`}
			</Cell>
		</Group>}
		{fetchedUser && admins.indexOf(fetchedUser.id) != -1 && (<Group>
			<Cell expandable before={<Icon20ServicesOutline width={28}/>} onClick={go} data-to="adminMenu">
            Управление
            </Cell>
		</Group>
		)
		}
		<Group>
            <Cell expandable before={<Icon16ClockOurline width={28}/>} onClick={go} data-to="schedule">
              Расписание
            </Cell>
            <Cell expandable before={<Icon20EducationOutline width={28}/>} onClick={go} data-to="progress">
              Успеваемость
            </Cell>
            <Cell expandable before={<Icon20NewsfeedOutline width={28}/>} onClick={() => {}}>
              Новости
            </Cell>
        
		</Group>
		<Group>
		<Cell expandable before={<Icon24Settings width={28}/>} onClick={go} data-to="settings">
              Настройки
            </Cell>
		</Group>
	</Panel>
);

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Home;