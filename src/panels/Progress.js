import React, { useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { platform, IOS, Gallery, Group, Header, CardScroll, Card, ScreenSpinner, Panel, PanelHeader, PanelHeaderButton } from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import CustomCard from '../components/CustomCard'
import CustomGallery from '../components/CustomGallery'
import Accordeon from '../components/Accordeon'
import AleshaCard from '../components/AleshaCard'

import { getProgress } from '../utils/ProgressParser'
import { prepareDate } from '../utils/functions'
import mainStore from '../store/mainStore'

import './Progress.css';

import axios from 'axios'

const osName = platform();




const Progress = ({ setPopout, go, id, appUser, progress, setProgress, createError }) => {
	const [ activeTerm, setActiveTerm ] = useState(null)
	const getProgress = () => {
		
		try{
		axios.get(`https://tsu-helper-server.herokuapp.com/getProgress?num=${appUser.num}`)
			.then(res => {
				if(!res.data.err){
					setProgress(res.data)
				} else {
					createError({type: 1, descr: res.data.text || "Сервер не вернул данные", name: "Ошибка запроса", code: res.data, back: 'home'})
					setPopout(null)
				}
			})
			.catch(e => {
				createError({type: 2, descr: "Что-то пошло не так", name: "Ошибка запроса", code: e, back: 'home'})
				setPopout(null)
			} )
		}catch(e){
			createError({type: 2, descr: "Сервер вернул ошибку", name: "Ошибка запроса", code: e, back: 'home'})
			setPopout(null)
		}

	}
	useEffect(() => {
		if(!progress){
			setPopout(<ScreenSpinner size='large' />)
			getProgress()
		} else {
			setPopout(null)
		}
	},[progress])
	
	return (
	<Panel id={id}>
		<PanelHeader
			left={<PanelHeaderButton onClick={go} data-to="home">
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
		>
			Моя зачётка
		</PanelHeader>
		{ progress && <div className="updated">Обновлено {prepareDate(progress.cacheTime)}</div> }
		{progress && progress.res.map((item, term) => {
			return <Accordeon theme={mainStore.theme} title={`Семестр ${term+1}`} active={activeTerm} setActive={setActiveTerm}>
				{item.map(i => <AleshaCard onClick={ i.km==0 ? null : go } data-to="detailedprogress" data-km={JSON.stringify({...i, term: term})} data={i}/>)}
			</Accordeon>
		})}

		{/* { progress && progress.doc.map((item, term) => {
			return (<div className={scheme == "space_gray" ? "card-block dark" : "card-block"}>
				<CardScroll size="s">
					{item.map(i => <Card onClick={ i.km==0 ? null : go } data-to="detailedprogress" data-km={JSON.stringify({...i, term: term})}><CustomCard data={i}/></Card>)}
				</CardScroll>
				<div class="card-divider">Семестр {term+1}</div>
			</div>)
		})} */}
	</Panel>
)
		};

Progress.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Progress;
