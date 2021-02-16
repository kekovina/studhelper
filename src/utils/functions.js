const prepareDate = date => {
	const updated = new Date(date)
	const now = new Date(new Date().getTime())
	const hours = Math.floor((now-updated)/60/60/1000)
	const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
	console.log(hours)
	if(hours > 8){
		return `${updated.getDate()} ${months[updated.getMonth()]} ${updated.getFullYear()} в ${((updated.getHours()+'').length < 2 ? '0' : '')+updated.getHours()}:${((updated.getMinutes()+'').length < 2 ? '0' : '')+updated.getMinutes()}`
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
const getDate = (date= new Date(), offset = 0) => {
	const createOffset = new Date(date.getTime() + offset * 24 * 60 * 60 * 1000);
	const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
	const day = ['воскресение', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']
	return {day: createOffset, text: `${createOffset.getDate()} ${months[createOffset.getMonth()]}, ${day[createOffset.getDay()]}`}
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

module.exports = { prepareDate, getDate, getWeek }