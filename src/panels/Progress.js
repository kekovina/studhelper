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

import { getProgress } from '../utils/ProgressParser'
import './Progress.css';

import axios from 'axios'

const osName = platform();

const prepareDate = date => {
	const updated = new Date(date)
	const now = new Date(new Date().getTime())
	const hours = Math.floor((now-updated)/60/60/1000)
	const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
	console.log(hours)
	if(hours > 8){
		return `${updated.getDate()} ${months[updated.getMonth()]} ${updated.getFullYear()} в ${updated.getHours()}:${updated.getMinutes()}`
	} else {
		const minutes = Math.floor((now-updated)/60/1000)
		if(minutes < 2 && !hours){
			return `только что`
		}
		if(!hours){
			return `${minutes} мин. назад` 
		} else {
			return `${hours} ч. назад`
		}
	}
}



const Progress = ({ setPopout, go, id, appUser, progress, setProgress }) => {
	// const [ subjects, setSubjects ] = useState(null)
	const [ error, setError ] = useState(null)

	const scheme = document.body.attributes.getNamedItem("scheme").value

	useEffect(() => {
		
		if(!progress){
			setPopout(<ScreenSpinner size='large' />)
			axios.get(`https://tsu-helper-server.herokuapp.com/getProgress?num=${appUser.num}`)
			.then(json => {
				if(!json.data.err){
					setProgress(json.data)
				}
			})
			.then(() => setPopout(null))
			.catch((e) => {
				setError(e)
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
		{ progress && progress.doc.map((item, term) => {
			return (<div className={scheme == "space_gray" ? "card-block dark" : "card-block"}>
				<CardScroll size="s">
					{item.map(i => <Card onClick={ i.km==0 ? null : go } data-to="detailedprogress" data-km={JSON.stringify({...i, term: term})}><CustomCard data={i}/></Card>)}
				</CardScroll>
				<div class="card-divider">Семестр {term+1}</div>
			</div>)
		})}
		{/* {subjects && <Group description="Семестр 1">
      <CardScroll size="s">
		{subjects.map(item => (<Card onClick={go} data-to="persik">
          <CustomCard data={item}/>
        </Card>))}
        
      </CardScroll>
    </Group> } */}
		{/* <Group header={<Header mode="secondary">Семестр 1</Header>}>
              <Gallery
                slideWidth="90%"
                style={{ height: 150 }}
                bullets="dark"
				align="center"
              >
                {subjects.map(item => (<CustomGallery data={item}/>))}
              </Gallery>
            </Group> */}
			{error && <div>{`Выявлена ошибка: ${JSON.stringify(error)}`}</div>}
	</Panel>
)
		};

Progress.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Progress;
