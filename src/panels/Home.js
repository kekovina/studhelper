import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import { Icon16ClockOurline, Icon20Users, Icon20EducationOutline, Icon20NewsfeedOutline, Icon24Settings, Icon20ServicesOutline, Icon20HomeOutline } from '@vkontakte/icons'
import Alesha from '../components/Alesha'
import NextLessons from '../components/NextLessons'
import CardItem from '../components/CardItem'

import './home.css'
import { inject, observer } from 'mobx-react';
import { timeDiff } from '../utils/functions';



const Home = inject('store')(observer(({ id, go, fetchedUser, appUser, store }) => {
	const [ timeTo, setTimeTo ] = useState(null)
	useEffect(() => {
		let interval = setInterval(() => {
			setTimeTo(timeDiff(new Date('2021-05-31 10:00'), 'hh ч. mm мин. ss сек.'))
		}, 1000)
		return () => {
			clearInterval(interval)
		}
	}, [])
	return (
	<Panel id={id}>
		<PanelHeader>StudHelper</PanelHeader>
		<div className="wrapper">
			{
				store.currentLesson && (<Header mode="secondary">{store.currentLesson && store.currentLesson.text}</Header>)
			}
			{
				store.currentLesson && (store.currentLesson.sched.map(item => <Alesha subject={item} status='future' skeleton={!store.schedule} home/>))
			}
			{
				//!store.currentLesson && store.analizationSchedule && <NextLessons data={store.analizationSchedule}/>
			}
			<div className={`card-block ${store.theme}`}>
				<CardItem size={2}  theme={store.theme}>До следующей пары: {timeTo || 'loading...'}</CardItem>
				<CardItem stretch theme={store.theme}></CardItem>
			</div>
			<div className={`card-block ${store.theme}`}>
				<CardItem stretch theme={store.theme}>3</CardItem>
			</div>
		</div>
	</Panel>
)}))

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
