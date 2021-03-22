import { action, configure, observable, makeObservable } from 'mobx'

configure({ enforceActions: "always"})

class MainStore{
    activePanel = 'home'
    fetchedUser = null
    theme = 'light'
    appUser = {
        group: ""
    }
    popout = "<ScreenSpinner size='large' />"
    progress = null
    detailed = null
    schedule = null
    error = null
    modal = null
    modalHistory = []

    constructor(){
        makeObservable(this, {
            activePanel: observable,
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

            setActivePanel: action,
            setVkUser: action,
            setAppUser: action,
            setPopout: action,
            setProgress: action,
            setDetailed: action,
            setSchedule: action,
            setError: action,
            setModal: action,
            setModalHistory: action,
            setActiveModal: action,
            setTheme: action
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
    setPopout = popout => this.popout = popout
    setProgress = progress => this.progress = progress
    setDetailed = detailed => this.detailed = detailed
    setSchedule = schedule => this.schedule = schedule
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