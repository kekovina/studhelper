import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import { Icon16ClockOurline, Icon20Users, Icon20EducationOutline, Icon20NewsfeedOutline, Icon24Settings, Icon20ServicesOutline } from '@vkontakte/icons'
import Alesha from '../components/Alesha'
import NextLessons from '../components/NextLessons'

import './home.css'
import { inject, observer } from 'mobx-react';

const admins = [503012833]

const Home = inject('store')(observer(({ id, go, fetchedUser, appUser, store }) => (
	<Panel id={id}>
		<PanelHeader>StudHelper</PanelHeader>
		{fetchedUser &&
		<div className={`userbar ${store.theme}`}>
			<Avatar src={fetchedUser.photo_200}/>
			<div className="userinfo">
				<div className="username">{`${fetchedUser.first_name} ${fetchedUser.last_name}`}</div>
				<div className="group">{(fetchedUser.sex == 1 ? "Студентка" : "Студент") +" " +(appUser.status || "")}</div>
			</div>
		</div>
		}
		{
			store.currentLesson && (<Header mode="secondary">{store.currentLesson && store.currentLesson.text}</Header>)
		}
		{
			store.currentLesson && (<Alesha subject={store.currentLesson} status='future' skeleton={!store.schedule} home/>)
		}
		{
			//!store.currentLesson && store.analizationSchedule && <NextLessons data={store.analizationSchedule}/>
		}
		
		<div className={`btn-group ${store.theme}`}>
			<div className="btn schedule" onClick={go} data-to="schedule">
				<Icon16ClockOurline />
				<div>Расписание</div>
			</div>
			<div className="btn progress" onClick={go} data-to="progress">
				<Icon20EducationOutline/>
				<div>Зачётка</div>
			</div>
			<div className="btn news" onClick={go} data-to="news">
				<Icon20NewsfeedOutline />
				<div>Новости</div>
			</div>
			<div className="btn settings" onClick={go} data-to="settings">
				<Icon24Settings/>
				<div>Настройки</div>
			</div>
			{fetchedUser && admins.indexOf(fetchedUser.id) != -1 && 
			(<div className="btn admin" onClick={go} data-to="adminMenu">
				<Icon20ServicesOutline/>
				<div>Управление</div>
			</div>)
			}
			
			<a href="https://vk.com/public202317653" className="btn link">
				{/* <img src={settings} width={50} /> */}
				<Icon20Users/>
				<div>Наша<br/>группа</div>
			</a>
		</div>
	</Panel>
)))

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
