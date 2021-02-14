import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';
import axios from 'axios'


import Home from './panels/Home';
import Persik from './panels/Persik';
import Schedule from './panels/Schedule';
import Settings from './panels/Settings'
import Progress from './panels/Progress'
import Start from './panels/Start'
import DetailedProgress from './panels/DetailedProgress'
import Error from './panels/Error'
import AdminMenu from './panels/AdminMenu'
import LastVisit from './panels/admin/LastVisit'

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [appUser, setAppUser] = useState({group: "N"})
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [detailed, setDetailed] = useState(null)
	const [progress, setProgress] = useState(null)
	const [schedule, setSchedule] = useState(null)
	const [error, setError] = useState(null);
	bridge.subscribe(({ detail: { type, data }}) => {
		if (type === 'VKWebAppUpdateConfig') {
			const schemeAttribute = document.createAttribute('scheme');
			schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
			document.body.attributes.setNamedItem(schemeAttribute);
		}
	});
	const createError = (obj) => {
		setError({...error, ...obj})
		setActivePanel('error')
	}
	useEffect(() => {
		const queueStart = (funcs) => {
			return funcs.reduce((r,f) => {
				return r.then(() => {
					return f()
				})
			}, Promise.resolve())
		}
		async function fetchData() {
			return await bridge.send('VKWebAppGetUserInfo').then(res => {
				setUser(res);
				return res.id
			})
		}
		const getUser = (id) => {
			setPopout(<ScreenSpinner size='large' />)
			axios.get("https://tsu-helper-server.herokuapp.com/getUser", {params: {id: id}})
			.then(res => {
				if(!res.data.err){
					if(res.data.user){
						setAppUser({group: res.data.user.group, num: res.data.user.num, status: `группы ${res.data.user.group}`})
					}else{
						setActivePanel('start')
					}
				}else{
					setActivePanel('start')
				}
				setPopout(null)
			})
		}
		fetchData().then(getUser)
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
		if(e.currentTarget.dataset.km){
			setDetailed(JSON.parse(e.currentTarget.dataset.km))
		}
	};
	const createUser = (errorHandler, form) => {
		setPopout(<ScreenSpinner size='large' />)
		axios.get("https://tsu-helper-server.herokuapp.com/newUser", {params: {id: fetchedUser.id, group: form.group, num: form.num}})
			.then(res => {
				if(!res.data.err){
					setAppUser({group: res.data.user.group, num: res.data.user.num})
					setPopout(null)
					setActivePanel('home')
				} else {
					errorHandler({header: "Ошибка сервера", text: res.data.text})
					setPopout(null)
				}
			})
	}

	return (
		<View activePanel={activePanel} popout={popout}>
			<Start id="start" createError={createError} createUser={createUser} setPopout={setPopout} setActivePanel={setActivePanel} setAppUser={setAppUser} vku={fetchedUser}/>
			<Home id='home' fetchedUser={fetchedUser} go={go} appUser={appUser}/>
			<Persik id='persik' go={go} />
			<Schedule id="schedule" go={go} setPopout={setPopout} schedule={schedule} setSchedule={setSchedule} group={appUser.group} createError={createError}/>
			<Settings id="settings" go={go} />
			<DetailedProgress id="detailedprogress" go={go} data={detailed}/>
			<Error id='error' err={error}/>
			<Progress id="progress" go={go} createError={createError} setPopout={setPopout} appUser={appUser} setDetailed={setDetailed} progress={progress} setProgress={setProgress}/>
			
			<AdminMenu id="adminMenu" go={go} />
			<LastVisit id="lastVisit" go={go} setPopout={setPopout}/>
		</View>
	);
}

export default App;

