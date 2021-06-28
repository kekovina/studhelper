import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Panel, Header, Avatar  } from '@vkontakte/vkui'
import { Icon28FireCircleFillRed } from '@vkontakte/icons';
import { Icon16ClockOurline, Icon20Users, Icon20EducationOutline, Icon20NewsfeedOutline, Icon24Settings, Icon20ServicesOutline } from '@vkontakte/icons'
import NextLessons from '../components/NextLessons'
import CardInfo from '../components/CardInfo'

import './home.css'
import { inject, observer } from 'mobx-react';



const Home = inject('store')(observer(({ id, go, fetchedUser, appUser, store }) => {
	const next_para = <div>Нет пар</div>
	return (
	<Panel id={id} style={{background: '#323C46'}}>
		<div className="head-block">
			<Avatar src={store.fetchedUser.photo_100} size={100}/>
			<div className="user-info">
				<div>{store.fetchedUser.first_name}</div>
				<div className="user-status">
					<span className="user-status__value">красавчик</span>
					<br/>
					<span className="user-status__average">Ср. балл: 5.47</span>
				</div>
			</div>
		</div>
		{
			store.currentLesson && (<Header mode="secondary">{store.currentLesson && store.currentLesson.text}</Header>)
		}
		{
			// store.currentLesson && (store.currentLesson.sched.map(item => <Alesha subject={item} status='future' skeleton={!store.schedule} home/>))
		}
		{
			//!store.currentLesson && store.analizationSchedule && <NextLessons data={store.analizationSchedule}/>
		}
		
		<div style={{margin: "10px 15px"}}>
			<CardInfo theme={store.theme} title="Следующая пара" content={next_para}/>
		</div>
	</Panel>
)}
		))
export default Home;
