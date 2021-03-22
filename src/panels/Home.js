import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import { CellButton, Link } from '@vkontakte/vkui'
import { Icon16ClockOurline, Icon20Users, Icon20EducationOutline, Icon20NewsfeedOutline, Icon24Settings, Icon20ServicesOutline } from '@vkontakte/icons'
import mainStore from '../store/mainStore'

import clock from '../img/clock.svg'
import education from '../img/education.svg'
import newspaper from '../img/newspaper.svg'
import settings from '../img/settings.svg'
import clockw from '../img/clock_w.svg'
import educationw from '../img/education_w.svg'
import newspaperw from '../img/newspaper_w.svg'
import settingsw from '../img/settings_w.svg'

import './home.css'

const admins = [503012833]

const Home = ({ id, go, fetchedUser, appUser }) => (
	<Panel id={id}>
		<PanelHeader>Привет!</PanelHeader>
		{fetchedUser &&
		<div className={`userbar ${mainStore.theme}`}>
			<Avatar src={fetchedUser.photo_200}/>
			<div className="userinfo">
				<div className="username">{`${fetchedUser.first_name} ${fetchedUser.last_name}`}</div>
				<div className="group">{(fetchedUser.sex == 1 ? "Студентка" : "Студент") +" " +(appUser.status || "")}</div>
			</div>
		</div>
		}
		<div className={`btn-group ${mainStore.theme}`}>
			<div className="btn schedule" onClick={go} data-to="schedule">
				{/* <img src={mainStore.theme == "dark" ? clockw : clock} width={50}/> */}
				<Icon16ClockOurline />
				<div>Расписание</div>
			</div>
			<div className="btn progress" onClick={go} data-to="progress">
				{/* <img src={education} width={50}/> */}
				<Icon20EducationOutline/>
				<div>Зачётка</div>
			</div>
			<div className="btn news" onClick={go} data-to="news">
				{/* <img src={newspaper} width={50}/> */}
				<Icon20NewsfeedOutline />
				<div>Новости</div>
			</div>
			<div className="btn settings" onClick={go} data-to="settings">
				{/* <img src={settings} width={50}/> */}
				<Icon24Settings/>
				<div>Настройки</div>
			</div>
			{fetchedUser && admins.indexOf(fetchedUser.id) != -1 && 
			(<div className="btn admin" onClick={go} data-to="adminMenu">
				{/* <img src={settings} width={50} /> */}
				<Icon20ServicesOutline/>
				<div>Управление</div>
			</div>)
			}
			
			<a href="https://vk.com/public202317653" className="btn link">
				{/* <img src={settings} width={50} /> */}
				<Icon20Users/>
				<div>Наша группа</div>
			</a>
		</div>
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
