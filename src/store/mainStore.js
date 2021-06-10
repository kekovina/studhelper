import { action, configure, observable, makeObservable, computed } from 'mobx'
import { serverURL } from '../config'
import axios from 'axios'
import { getDate, getTime } from '../utils/functions'
import React from 'react';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';


const spinner = <ScreenSpinner size='large' />

configure({ enforceActions: "always"})

class MainStore{
    activePanel = 'hello'
    screenHistory = []
    loadingAppStatus = {code: 777, text: ["Устанавливаю связь с космосом"]}


    fetchedUser = null
    theme = 'light'
    appUser = {
        group: ""
    }
    popout = null
    progress = null
    detailed = null
    schedule = null
    error = null
    modal = null
    modalHistory = []
    settings = {}
    get currentLesson(){
      const get = () => {
        let date = getDate(new Date())
        let day = this.schedule ? this.schedule.data.filter(item => item.date == date.mini)[0]?.schedule || null : null
        let now = getTime(new Date())
        // let now = getTime(new Date('2021-05-11 12:00'))
        let res = day ? day.filter(item => (now <= item.end)).shift() : null
        if(res){
          let sched = day.filter(item => item.start == res.start)
          let text = res.start > now ?  "Следующая пара" : "Сейчас идёт"
          return { sched, text }
        }
        return null
      }
      if(!this.settings.isExam){
        return get()
      } else {
        return null
      }
    }
    get analizationSchedule(){
      let day = null
      let i = 1;
      let first
      if(this.schedule){
        while(!day){
          let date = getDate(new Date(), i)
          day = this.schedule.data.filter(item => item.date == date.mini)[0]?.schedule || null 
          i++
        }
        first = day.shift()
      }
      return first || null
    }

    constructor(){
        makeObservable(this, {
            activePanel: observable,
            screenHistory: observable,
            fetchedUser: observable,
            appUser: observable,
            popout: observable,
            progress: observable,
            detailed: observable,
            schedule: observable,
            error: observable,
            modal: observable,
            modalHistory: observable,
            theme: observable,
            currentLesson: computed,
            analizationSchedule: computed,
            settings: observable,
            loadingAppStatus: observable,

            updateLoadingAppStatus: action,
            setActivePanel: action,
            updateScreenHistory: action,
            setVkUser: action,
            setAppUser: action,
            setPopout: action,
            setProgress: action,
            setDetailed: action,
            getSchedule: action,
            setError: action,
            setModal: action,
            setModalHistory: action,
            setActiveModal: action,
            setTheme: action,
            setSettings: action
        })
    }
    setActivePanel = value => this.activePanel = value
    setVkUser = user => this.fetchedUser = user
    setAppUser = user => {
        this.appUser = {
            ...this.appUser,
            ...user
        }
    }
    updateLoadingAppStatus = status => this.loadingAppStatus = {...this.loadingAppStatus, ...status}
    updateScreenHistory = history => this.screenHistory = history
    setSettings = settings => this.settings = settings
    setPopout = popout => this.popout = popout
    setProgress = progress => this.progress = progress
    setDetailed = detailed => this.detailed = detailed
    getSchedule = async () => {
      return await axios.get(`${serverURL}/getSchedule`, {params: {group: this.appUser.group}})
        .then(res => {
          if(res.data.err){
            return {...res.data, text: "Не удалось загрузить расписание"}
          }
          if(!res.data){
            return {err: 1, text: 'Сервер не вернул данные'}
          }
          this.schedule = res.data.res.data
        })
    }
    initApp = async (id) => {
      return await axios.get(`${serverURL}/init`, {params: {id: id}})
			.then(res => {
				if(!res.data.err){
					if(res.data.user){
						this.setAppUser({group: res.data.user.group, num: res.data.user.num, status: `группы ${res.data.user.group}`})
						this.setSettings(res.data.settings)
            this.schedule = {data: res.data.schedule ? res.data.schedule.data : null, updated: res.data.schedule ? res.data.schedule.updated: null }
            this.updateLoadingAppStatus({code: 1, text: [`С возвращением, ${this.fetchedUser.first_name}!`]})
					}else{
            this.updateLoadingAppStatus({code: 0, text: [`Привет, ${this.fetchedUser.first_name}!`, `Ты впервые здесь? Расскажи о себе`]})
					}
				}else{
          this.updateLoadingAppStatus({code: 2, text: ['Возникла проблема при старте приложения :(']})
				}
        console.log(res)
			})
      .then(() => this.setPopout(null))
    }
    setError = error => this.error = error
    setModal = modal => this.modal = modal
    setModalHistory = history => this.history = history
    setActiveModal = activeModal => {
		activeModal = activeModal || null;
		let history = this.modalHistory ? [...this.modalHistory] : [];
	
		if (activeModal === null) {
		  history = [];
		} else if (history.indexOf(activeModal) !== -1) {
		  history = history.splice(0, history.indexOf(activeModal) + 1);
		} else {
		  history.push(activeModal);
		}
	
		this.setModal(activeModal)
		this.setModalHistory(history)
    }
    setTheme = theme => this.theme = theme
    


}

export default new MainStore()