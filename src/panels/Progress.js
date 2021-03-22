import React, { useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { platform, IOS, Gallery, Group, Header, CardScroll, Card, ScreenSpinner } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
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
	// const [ subjects, setSubjects ] = useState(null)
	const [ error, setError ] = useState(null)
	const [ activeTerm, setActiveTerm ] = useState(null)
	const [ ok, setOk ] = useState(false)

	const scheme = document.body.attributes.getNamedItem("scheme").value

	useEffect(() => {
		
		if(!progress){
			setPopout(<ScreenSpinner size='large' />)
			axios.get(`https://tsu-helper-server.herokuapp.com/getProgress?num=${appUser.num}`)
			.then(json => {
				if(!json.data){
					createError({type: 1, descr: "Сервер не вернул данные", name: "Пустой ответ", code: json.status + ' ' + json.statusText, back: 'home'})
				}
				if(!json.data.err){
					setProgress(json.data)
					setOk(!ok)
				} else {
					createError({type: 1, descr: json.data.text, name: "Ошибка запроса", code: json.data, back: 'home'})
				}
			})
			.then(() => setPopout(null))
			.catch((e) => {
				createError({type: 2, descr: "Что-то пошло не так", name: "Внезапная ошибка", code: e, back: 'home'})
				setPopout(null)
			})
	}
	},[])
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
		{progress && progress.doc.map((item, term) => {
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
