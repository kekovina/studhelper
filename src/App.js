import React, { useState, useEffect } from 'react';
import { Icon56NotificationOutline, Icon24Done, Icon24Cancel } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import { Avatar, Snackbar, ModalRoot, ModalPage, ModalPageHeader, PanelHeaderButton, FormLayout, Group, Text, Input, Button, Radio } from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css';
import axios from 'axios'
import { observer } from 'mobx-react'

import mainStore from './store/mainStore'


import Home from './panels/Home';
import Persik from './panels/Persik';
import Schedule from './panels/Schedule';
import Settings from './panels/Settings'
import Progress from './panels/Progress'
import Start from './panels/Start'
import DetailedProgress from './panels/DetailedProgress'
import Error from './panels/Error'
import News from './panels/News'
import AdminMenu from './panels/AdminMenu'
import LastVisit from './panels/admin/LastVisit'
import { MODAL_CHANGE_GROUP, MODAL_CHANGE_NUM, MODAL_CHANGE_SCHED_THEME } from './utils/modals.js'

const App = () => {
	const [schedule, setSchedule] = useState(null)
	const [valid, setValid] = useState(false)
	const [textForm, setTextForm] = useState('')
	const [snackbar, setSnackbar] = useState(null)
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />)
	

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
				setPopout(<ScreenSpinner size='large' />)
				axios.get('https://tsu-helper-server.herokuapp.com/updateUser', {params: {
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
							themeSched: res.data.updated.themeSched || mainStore.appUser.themeSched})
					}
					setPopout(null)
				})
			}
			setValid(false)
			setTextForm('')
			mainStore.setActiveModal(mainStore.modalHistory[mainStore.modalHistory.length - 2]);
	};
	
	bridge.subscribe(({ detail: { type, data }}) => {
		if (type === 'VKWebAppUpdateConfig') {
			const theme = data.scheme ? data.scheme : 'client_light';
			const schemeAttribute = document.createAttribute('scheme');
			schemeAttribute.value = theme
			document.body.attributes.setNamedItem(schemeAttribute);
			mainStore.setTheme(theme == "space_gray" ? "dark" : "light")
		}
		
	});
	const createError = (obj) => {
		mainStore.setError({...mainStore.error, ...obj})
		mainStore.setActivePanel('error')
	}
	useEffect(() => {
		
		async function fetchData() {
			return await bridge.send('VKWebAppGetUserInfo').then(res => {
				mainStore.setVkUser(res);
				return res.id
			})
		}
		const getUser = (id) => {
			setPopout(<ScreenSpinner size='large' />)
			axios.get("https://tsu-helper-server.herokuapp.com/getUser", {params: {id: id}})
			.then(res => {
				if(!res.data.err){
					if(res.data.user){
						mainStore.setAppUser({group: res.data.user.group, num: res.data.user.num, status: `группы ${res.data.user.group}`, 
										themeSched: res.data.user.themeSched || 0})
					}else{
						mainStore.setActivePanel('start')
					}
				}else{
					mainStore.setActivePanel('start')
				}
				setPopout(null)
			})
			return id
		}
		fetchData().then(getUser)
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
		// 		console.info(resp)
		// 		if(!resp.isAllowed){
		// 			bridge.send("VKWebAppAllowNotifications").then(d => {
		// 				if(d.result){
		// 					bridge.send('VKWebAppGetUserInfo').then(res => bridge.send("VKWebAppCallAPIMethod", {
		// 						"method": "notifications.sendMessage",
		// 						"request_id": "1212",
		// 						"params": {
		// 							"user_ids": res.id,
		// 							"message": "Тестовое уведомление. Я рад, что ты с нами!",
		// 							"access_token":"2c47d1312c47d1312c47d131972c32608422c472c47d13173add6862d3b4b7516945aba",
		// 							"v":"5.130"
		// 						}
		// 					}).then(res => console.info(res)))
		// 					.catch(e => console.info(e.error_data))
		// 				}
		// 			})
		// 		}
		// 	}).catch(e => console.log(e.error_data))
		// })
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
			<Group style={{paddingBottom: "50px"}}>
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
			<Group style={{paddingBottom: "50px"}}>
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
		if(e.currentTarget.dataset.km){
			mainStore.setDetailed(JSON.parse(e.currentTarget.dataset.km))
		}
	};
	const createUser = (errorHandler, form) => {
		setPopout(<ScreenSpinner size='large' />)
		axios.get("https://tsu-helper-server.herokuapp.com/newUser", {params: {id: mainStore.fetchedUser.id, group: form.group, num: form.num}})
			.then(res => {
				if(!res.data.err){
					mainStore.setAppUser({group: res.data.user.group, num: res.data.user.num})
					setPopout(null)
					mainStore.setActivePanel('home')
				} else {
					errorHandler({header: "Ошибка сервера", text: res.data.text})
					setPopout(null)
				}
			})
	}

	return (
		<View activePanel={mainStore.activePanel} popout={popout} modal={modalRoot}>
			<Start id="start" createError={createError} createUser={createUser} setPopout={mainStore.setPopout} setActivePanel={mainStore.setActivePanel} setAppUser={mainStore.setAppUser} vku={mainStore.fetchedUser}/>
			<Home id='home' fetchedUser={mainStore.fetchedUser} go={go} appUser={mainStore.appUser}/>
			<Persik id='persik' go={go} />
			<Schedule id="schedule" go={go} setPopout={setPopout} schedule={schedule} setSchedule={setSchedule} group={mainStore.appUser.group} appUser={mainStore.appUser} createError={createError}/>
			<Settings id="settings" go={go} appUser={mainStore.appUser} setModal={mainStore.setModal} snackbar={snackbar}/>
			<DetailedProgress id="detailedprogress" go={go} data={mainStore.detailed}/>
			<Error id='error' err={mainStore.error} go={go}/>
			<Progress id="progress" go={go} createError={createError} setPopout={setPopout} appUser={mainStore.appUser} setDetailed={mainStore.setDetailed} progress={mainStore.progress} setProgress={mainStore.setProgress}/>
			<News id="news" go={go} />

			<AdminMenu id="adminMenu" go={go} />
			<LastVisit id="lastVisit" go={go} setPopout={mainStore.setPopout}/>
		</View>
	);
}

export default observer(App);

