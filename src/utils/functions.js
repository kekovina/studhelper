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
const getDate = (offset = 0) => {
	const now = new Date(new Date().getTime() + offset * 24 * 60 * 60 * 1000);
	const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
	const day = ['воскресение', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']
	return `${now.getDate()} ${months[now.getMonth()]}, ${day[now.getDay()]}`
}

module.exports = { prepareDate, getDate }