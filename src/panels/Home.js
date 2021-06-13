import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, Header, Avatar } from '@vkontakte/vkui'
import { Icon28FireCircleFillRed } from '@vkontakte/icons';
import { Icon16ClockOurline, Icon20Users, Icon20EducationOutline, Icon20NewsfeedOutline, Icon24Settings, Icon20ServicesOutline } from '@vkontakte/icons'
import Alesha from '../components/Alesha'
import NextLessons from '../components/NextLessons'

import './home.css'
import { inject, observer } from 'mobx-react';

const admins = [503012833]

const Home = inject('store')(observer(({ id, go, fetchedUser, appUser, store }) => {
	return (
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
			store.currentLesson && (store.currentLesson.sched.map(item => <Alesha subject={item} status='future' skeleton={!store.schedule} home/>))
		}
		{
			//!store.currentLesson && store.analizationSchedule && <NextLessons data={store.analizationSchedule}/>
		}
		
		<div className={`btn-group ${store.theme}`}>
			<div className="btn schedule" onClick={go} data-to="schedule">
				
				{store.settings.isExam ? <Icon28FireCircleFillRed/> : <Icon16ClockOurline />}
				<div>{store.settings.isExam ? 'Сессия' : 'Расписание'}</div>
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
			<div className='btn' style={{width: '100%'}}>
				Тест. модуля: 
				<span>Ты в универе?</span> 
				{store.coords.result ? `Да(${store.coords.where})` : `Нет`}
				</div>
			<div className='btn' style={{width: '100%'}}>
			{!store.coords.result ? <span style={{textAlign: 'center'}}>Если результат ложный,<br/> заскринь координаты и <a href="http://vk.com/kekovinya">мне</a> в лс: {`${JSON.stringify(store.coords.coords)}`}</span> : null}
			</div>
		</div>
	</Panel>
)}
		))

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
