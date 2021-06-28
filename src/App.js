import React, { useState, useEffect } from 'react';
import { Icon24ClockOutline, Icon28BrainOutline, Icon24Done, Icon24Cancel, Icon28NewsfeedOutline, Icon28ServicesOutline, Icon28HomeOutline, Icon28UserCircleOutline } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import { withAdaptivity, Epic, Tabbar, TabbarItem, ConfigProvider, AdaptivityProvider, AppRoot, Avatar, Snackbar, ModalRoot, ModalPage, ModalPageHeader, PanelHeaderButton, FormLayout, Group, Text, Input, Button, Radio } from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css';
import axios from 'axios'
import { observer, Provider } from 'mobx-react'
import { serverURL } from './config'

import mainStore from './store/mainStore'


import Home from './panels/Home';
import Schedule from './panels/Schedule';
import Settings from './panels/Settings'
import Progress from './panels/Progress'
import Start from './panels/Start'
import DetailedProgress from './panels/DetailedProgress'
import Error from './panels/Error'
import News from './panels/News'
import Hello from './panels/Hello'

import AdminMenu from './panels/AdminMenu'
import LastVisit from './panels/admin/LastVisit'
import { MODAL_CHANGE_GROUP, MODAL_CHANGE_NUM, MODAL_CHANGE_SCHED_THEME } from './utils/modals.js'
import './reset.css'

const pointInPolygon = require('point-in-polygon')

const App = () => {
	const [schedule, setSchedule] = useState(null)
	const [valid, setValid] = useState(false)
	const [textForm, setTextForm] = useState('')
	const [snackbar, setSnackbar] = useState(null)


	const sendNotification = (text) => {
		return bridge.send('VKWebAppGetUserInfo').then(res => bridge.send("VKWebAppCallAPIMethod", {
			"method": "notifications.sendMessage",
			"request_id": "1212",
			"params": {
				"user_ids": res.id,
				"message": "Тестовое уведомление. Я рад, что ты с нами!",
				"access_token":"2c47d1312c47d1312c47d131972c32608422c472c47d13173add6862d3b4b7516945aba",
				"v":"5.130"
			}
		}))
	}
	const modalBack = (...args) => {
		const type = args[0]
		var params
		if(textForm || args[1]){
				switch(type){
					case 'num':
						params = { num: textForm }
						break;
					case 'group':
						params = { group: textForm }
						break;
					case 'theme_sched':
						params = { themeSched:  args[1]}
						break;
				}
				mainStore.setPopout(<ScreenSpinner size='large' />)
				axios.get(`${serverURL}/updateUser`, {params: {
					id: mainStore.fetchedUser.id,
					...params
				}, timeout: 15000}).then(res => {
					if(res.data.err){
						createError({type: 1, descr: res.data.text, name: "Изменение настроек", code: res.data, back: 'settings'})
					}else{
						const snack = (<Snackbar
							onClose={() => setSnackbar(null)}
							after={<Avatar src={mainStore.fetchedUser.photo_100} size={32} />}
						>Данные обновлены успешно</Snackbar>)
						setSnackbar(snack)
						mainStore.setAppUser({group: res.data.updated.group || mainStore.appUser.group, num: res.data.updated.num || mainStore.appUser.num,
							themeSched: res.data.updated.themeSched || mainStore.appUser.themeSched, status: `группы ${res.data.updated.group || mainStore.appUser.group}`})
					}
					mainStore.setPopout(null)
				})
			}
			setValid(false)
			setTextForm('')
			mainStore.setActiveModal(mainStore.modalHistory[mainStore.modalHistory.length - 2]);
	};
	bridge.send("VKWebAppInit", {});
	bridge.subscribe(({ detail: { type, data }}) => {
		if (type === 'VKWebAppUpdateConfig') {
			const theme = data.scheme ? data.scheme : 'client_light';
			const schemeAttribute = document.createAttribute('scheme');
			schemeAttribute.value = theme
			document.body.attributes.setNamedItem(schemeAttribute);
			mainStore.setTheme(theme == "space_gray" ? "dark" : "light")
		} else if(type === 'VKWebAppViewHide'){
			console.log('закрыли')
		}
		
	});
	const createError = (obj) => {
		mainStore.setError({...mainStore.error, ...obj})
		mainStore.setActivePanel('error')
	}
	useEffect(() => {
		
		// bridge.send('VKWebAppGetGeodata').then(data => {
		// 	if(data.available){
		// 		let coords = [
		// 			['Гл./9й',[54.166817,37.588596], [54.165753, 37.587397], [54.166590, 37.585001], [54.167693, 37.586229]],
		// 			// ['дом', [54.213367,37.627497],[54.212861,37.627455],[54.212759, 37.628544], [54.213189, 37.628692]],
		// 			['5й', [54.173112, 37.591369], [54.172595, 37.592710], [54.173454, 37.593716], [54.173882, 37.592238]]
				
		// 		]
		// 		let r = coords.map(coord => {
		// 			if(pointInPolygon([data.lat, data.long], coord.slice(1))){
		// 				return coord[0]
		// 			} 
		// 		})
		// 		let result = r.filter(i => i)
		// 		if(result.length){
		// 			mainStore.setCoords({coords: {lat: data.lat, long: data.long, acc: data.accuracy}, result: true, where: result[0]})
		// 		} else {
		// 			mainStore.setCoords({coords: {lat: data.lat, long: data.long, acc: data.accuracy}, result: false, where: false})
		// 		}
		// 	}else{
		// 		mainStore.setCoords({coords: {}, where: false, result: 'Геолокация недоступна'})
		// 	}
		// })

		async function fetchData() {
			return await bridge.send('VKWebAppGetUserInfo').then(res => {
				mainStore.setVkUser(res);
				return res.id
			})
		}
		fetchData().then(mainStore.initApp).catch(e => console.log(e.error_data))
		// .then((id) => {
		// 	bridge.send("VKWebAppCallAPIMethod", {
		// 		"method": "apps.isNotificationsAllowed",
		// 		"request_id": "1212",
		// 		"params": {
		// 			"user_id": id,
		// 			"access_token":"2c47d1312c47d1312c47d131972c32608422c472c47d13173add6862d3b4b7516945aba",
		// 			"v":"5.130"
		// 		}
		// 	}).then(resp => {
		// 	})
	}, []);
	const onModalChangeForm = e => {
		const { name, value } = e.currentTarget;
		setTextForm(value)
        switch(name){
            case 'group':
                if(/[1-9]\d{5}/g.test(value)){
                    setValid(true)
                } else {
                    setValid(false)
                }
                break;
            case 'aff':
                if(/((1[3-9])|(2[0-5]))\d{4}$/g.test(value)){
                    setValid(true)
                } else {
                    setValid(false)
                }
                break;
        }
	}	
	const modalRoot = (
		<ModalRoot 
		activeModal={mainStore.modal}
		onClose={modalBack}>
		<ModalPage
          id={MODAL_CHANGE_GROUP}
          onClose={modalBack}
          header={
            <ModalPageHeader
              left={<PanelHeaderButton onClick={modalBack}><Icon24Cancel /></PanelHeaderButton>}
              right={<PanelHeaderButton onClick={modalBack.bind(this, 'group')} disabled={!valid}><Icon24Done /></PanelHeaderButton>}
            >
              Номер группы
            </ModalPageHeader>
          }
        >
			<Group style={{ padding: '0 10px', paddingBottom: "25px"}}>
				<FormLayout>
					<Input
					type="text"
					name="group"
					onChange={onModalChangeForm}
					status={textForm ? valid ? 'valid' : 'error' : 'default'}
					bottom={textForm ? valid ? 'Мне нравится твоя группа' : 'Некорректный номер группы' : ''}/>
				</FormLayout>
			</Group>
		</ModalPage>
		<ModalPage
          id={MODAL_CHANGE_NUM}
          onClose={modalBack}
          header={
            <ModalPageHeader
              left={<PanelHeaderButton onClick={modalBack}><Icon24Cancel /></PanelHeaderButton>}
              right={<PanelHeaderButton onClick={modalBack.bind(this, 'num')} disabled={!valid}><Icon24Done /></PanelHeaderButton>}
            >
              Номер зачётки
            </ModalPageHeader>
          }
        >
			<Group style={{ padding: '0 10px', paddingBottom: "25px"}}>
				<FormLayout>
					<Input
					type="text"
					name="aff"
					onChange={onModalChangeForm} 
					status={textForm ? valid ? 'valid' : 'error' : 'default'}
					bottom={textForm ? valid ? 'Полагаю, лучшая зачётка' : 'Некорректный номер зачётки' : ''}/>
				</FormLayout>
			</Group>
		</ModalPage>
		<ModalPage
          id={MODAL_CHANGE_SCHED_THEME}
          onClose={modalBack}
          header={
            <ModalPageHeader
              left={<PanelHeaderButton onClick={modalBack}><Icon24Cancel /></PanelHeaderButton>}
              right={<PanelHeaderButton onClick={modalBack.bind(this, 'theme_sched', mainStore.appUser.themeSched)} disabled={!valid}><Icon24Done /></PanelHeaderButton>}
            >
              Выберите стиль
            </ModalPageHeader>
          }
        >
			<Radio name="style_sched" value="main" onClick={modalBack.bind(this, 'theme_sched', 0)}>Main</Radio>
			<Radio name="style_sched" value="alesha" onClick={modalBack.bind(this, 'theme_sched', 1)}>Alesha</Radio>
		</ModalPage>
		</ModalRoot>
	)
	const go = e => {
		mainStore.setActivePanel(e.currentTarget.dataset.to);
		window.history.pushState({panel: e.currentTarget.dataset.to}, `${e.currentTarget.dataset.to}`)
		mainStore.setPopout(null)
		if(e.currentTarget.dataset.km){
			mainStore.setDetailed(JSON.parse(e.currentTarget.dataset.km))
		}
	};
	const createUser = (errorHandler, form) => {
		mainStore.setPopout(<ScreenSpinner size='large' />)
		return axios.get(`${serverURL}/newUser`, {params: {id: mainStore.fetchedUser.id, group: form.group, num: form.num}})
			.then(res => {
				if(!res.data.err){
					mainStore.setAppUser({group: res.data.user.group, num: res.data.user.num})
					mainStore.setPopout(null)
					mainStore.setActivePanel('home')
				} else {
					errorHandler({header: "Ошибка сервера", text: res.data.text})
					mainStore.setPopout(null)
				}
			})
		
	}

	

	
	const menu = e => {
		if(e.state){
			if((mainStore.activePanel == 'home' && e.state.panel == 'start') || (mainStore.activePanel == 'start' && e.state.panel == 'home')){
				return
			}
			mainStore.setActivePanel(e.state.panel)
		} else {
			if(mainStore.activePanel == 'start'){
				return
			}
			mainStore.setActivePanel(`home`)
			window.history.pushState( { panel: 'home'}, `home` )
		}
	}
	useEffect(() => {
		window.addEventListener('popstate', e => e.preventDefault() & menu(e))
		window.history.pushState({ panel: 'home'}, `home`)
		return () => {
			window.removeEventListener('popstate')
		}
	}, [])
	const onStoryChange = (e) => {
		mainStore.setActivePanel(e.currentTarget.dataset.story)
	}
	return (
		<ConfigProvider>
			<AdaptivityProvider>
				<AppRoot mode="full">
					<Provider store={mainStore}>
						<Epic activeStory={mainStore.activePanel} tabbar={ mainStore.activePanel != 'hello' && mainStore.activePanel != 'start' &&
							<Tabbar>
								<TabbarItem
								onClick={onStoryChange}
								selected={mainStore.activePanel === 'news'}
								data-story="news"
								text="Новости"
								style={{background: 'var(--background_content)'}}
								><Icon28NewsfeedOutline /></TabbarItem>
								<TabbarItem
								onClick={onStoryChange}
								selected={mainStore.activePanel === 'schedule'}
								data-story="schedule"
								text={mainStore.settings.isExam ? "Сессия" : "Расписание"}
								style={{background: 'var(--background_content)'}}
								><Icon24ClockOutline/></TabbarItem>
								<TabbarItem
								onClick={onStoryChange}
								selected={mainStore.activePanel === 'home'}
								data-story="home"
								text="Главная"
								style={{background: 'var(--background_content)'}}
								><Icon28HomeOutline /></TabbarItem>
								<TabbarItem
								onClick={onStoryChange}
								selected={mainStore.activePanel === 'progress'}
								data-story="progress"
								text="Зачётка"
								style={{background: 'var(--background_content)'}}
								><Icon28BrainOutline /></TabbarItem>
								<TabbarItem
								onClick={onStoryChange}
								selected={mainStore.activePanel === 'settings'}
								data-story="settings"
								text="Профиль"
								style={{background: 'var(--background_content)'}}
								><Icon28UserCircleOutline /></TabbarItem>
							</Tabbar>
        	}>
						<View id="hello" activePanel="hello">
							<Hello id="hello" go={go} />
						</View>
						<View id="home" activePanel="home">
							<Home id='home' fetchedUser={mainStore.fetchedUser} go={go} appUser={mainStore.appUser}/>
						</View>
						<View id="schedule" activePanel="schedule">
							<Schedule id="schedule" go={go} setPopout={mainStore.setPopout} schedule={mainStore.schedule} setSchedule={setSchedule} group={mainStore.appUser.group} appUser={mainStore.appUser} createError={createError}/>
						</View>
						<View id="settings" activePanel="settings" modal={modalRoot}>
							<Settings id="settings" go={go} appUser={mainStore.appUser} setModal={mainStore.setModal} snackbar={snackbar} storyChange={onStoryChange}/>
						</View>
						<View id="start" activePanel="start">
							<Start id="start" initApp={mainStore.initApp} createError={createError} createUser={createUser} setPopout={mainStore.setPopout} setActivePanel={mainStore.setActivePanel} setAppUser={mainStore.setAppUser} vku={mainStore.fetchedUser}/>
						</View>
						<View id="news" activePanel="news">
							<News id="news" go={go} />
						</View>
						<View id="error" activePanel="error">
							<Error id='error' err={mainStore.error} go={go}/>
						</View>
						<View id="progress" activePanel="progress">
							<Progress id="progress" go={go} createError={createError} setPopout={mainStore.setPopout} appUser={mainStore.appUser} setDetailed={mainStore.setDetailed} progress={mainStore.progress} setProgress={mainStore.setProgress}/>
						</View>
						<View id="adminMenu" activePanel="adminMenu">
							<AdminMenu id="adminMenu" go={go} snackbar={snackbar} setSnackbar={setSnackbar}/>
						</View>
						<View id="lastVisit" activePanel="lastVisit">
							<LastVisit id="lastVisit" go={go} setPopout={mainStore.setPopout}/>
						</View>
						<View activePanel={mainStore.activePanel} popout={mainStore.popout} modal={modalRoot} >
							<DetailedProgress id="detailedprogress" go={go} data={mainStore.detailed}/>
						</View>
						</Epic>
					</Provider>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
}

export default withAdaptivity(observer(App), {viewWidth: true});

