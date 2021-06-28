import React, { useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { platform,  Group, ScreenSpinner, Panel, SubnavigationBar, SubnavigationButton } from '@vkontakte/vkui';
import { Icon16ClockOurline } from '@vkontakte/icons';
import OwnProgressCard from '../components/OwnProgressCard'

import { getProgress } from '../utils/ProgressParser'
import { prepareDate } from '../utils/functions'
import mainStore from '../store/mainStore'

import './Progress.css';

import axios from 'axios'

const osName = platform();




const Progress = ({ setPopout, go, id, appUser, progress, setProgress, createError }) => {
	const [ activeTerm, setActiveTerm ] = useState(null)
	const [ selectedTerm, setSelectTerm ] = useState(0)
	const getProgress = () => {
		
		try{
		axios.get(`https://tsu-helper-server.herokuapp.com/getProgress?num=${appUser.num}`)
			.then(res => {
				if(!res.data.err){
					setProgress(res.data)
					setSelectTerm(res.data.res.length - 1)
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
		<div style={{margin: '20px 10px'}}>
			{ progress && 
			<div style={{display: 'flex'}}>
				<Icon16ClockOurline style={{alignSelf: 'center'}}/>
				<div className="updated">Обновлено {prepareDate(progress.cacheTime)}</div>
			</div>
			}
			<Group>
          <SubnavigationBar>
			{progress && progress.res.map((i,index) => (
				<SubnavigationButton
				selected={selectedTerm == index}
				onClick={() => setSelectTerm(index)}
			  >
				Семестр {index+1}
			  </SubnavigationButton>
			))}
          </SubnavigationBar>
        </Group>
		{/* {progress && JSON.stringify(progress.res[selectedTerm])} */}
		{progress && progress.res[selectedTerm].map(i => <OwnProgressCard  data={i}/>)}
		</div>
		
		
		

	</Panel>
)
		};

export default Progress;
