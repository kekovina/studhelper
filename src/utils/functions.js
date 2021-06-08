const prepareDate = date => {
	const updated = new Date(date)
	const now = new Date(new Date().getTime())
	const hours = Math.floor((now-updated)/60/60/1000)
	const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
	if(hours < 8){
		const minutes = Math.floor((now-updated)/60/1000)
		if(minutes < 5 && !hours){
			return `только что`
		}
		if(!hours){
			return `${minutes} мин. назад` 
		} else {
			return `${hours} ч. назад`
		}
	} else {
		if(now.getDate() == updated.getDate()){
			return `сегодня в ${((updated.getHours()+'').length < 2 ? '0' : '')+updated.getHours()}:${((updated.getMinutes()+'').length < 2 ? '0' : '')+updated.getMinutes()}`
		} else if((now.getDate() - 1) == updated.getDate()){
			return `вчера в ${((updated.getHours()+'').length < 2 ? '0' : '')+updated.getHours()}:${((updated.getMinutes()+'').length < 2 ? '0' : '')+updated.getMinutes()}`
		} else {
			return `${updated.getDate()} ${months[updated.getMonth()]} ${updated.getFullYear()} в ${((updated.getHours()+'').length < 2 ? '0' : '')+updated.getHours()}:${((updated.getMinutes()+'').length < 2 ? '0' : '')+updated.getMinutes()}`

		}
	}
}
const getDate = (date= new Date(), offset = 0) => {
	const createOffset = new Date(date.getTime() + offset * 24 * 60 * 60 * 1000);
	createOffset.setHours(23)
	createOffset.setMinutes(59)
	createOffset.setSeconds(59)
	const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
	const day = ['воскресение', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']
	return {day: createOffset, 
		text: `${createOffset.getDate()} ${months[createOffset.getMonth()]}, ${day[createOffset.getDay()]}`, 
		mini: `${((createOffset.getDate()+'').length < 2 ? '0' : '')+createOffset.getDate()}.${(((createOffset.getMonth()+1)+'').length < 2 ? '0' : '')+(createOffset.getMonth()+1)}.${createOffset.getFullYear()}`}
}
const getWeek = (date = new Date()) => {
	const numDay = date.getDay()
	const left = numDay ? numDay - 1 : 6
	const right = numDay ? 7 - numDay : 0
	const res = []
	for(let i = left; i > 0; i--){
		res.push(new Date(date.getTime()-i*24*60*60*1000))}
	for(let i = 0; i <= right; i++){
		res.push(new Date(date.getTime()+i*24*60*60*1000))
	}
	return res
}
const getTime = (time) => {
	return `${((time.getHours()+'').length < 2 ? '0' : '')+time.getHours()}:${((time.getMinutes()+'').length < 2 ? '0' : '')+time.getMinutes()}`
}

const timeDiff = (goal, format) => {
	const now = new Date()
	const left = Math.abs(Math.floor((goal - now) / 1000))
	const days = Math.floor( left / 60 / 60 / 24)
	const h = Math.floor( left / 60 / 60 ) - days * 24
	const m = Math.floor( left / 60 ) - days * 24 * 60 - h * 60
	const s = Math.floor( left ) - days * 24 * 60 * 60 - h * 60 * 60 - m * 60 
	const hh = h % 100 < 10 ? '0' + h : h
	const mm = m % 100 < 10 ? '0' + m : m
	const ss = s % 100 < 10 ? '0' + s : s
	return format.replace('dd', days).replace('hh', hh).replace('mm', mm).replace('ss', ss)
}

module.exports = { prepareDate, getDate, getWeek, getTime, timeDiff }