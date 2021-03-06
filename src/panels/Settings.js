import React, { useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { platform, IOS, SimpleCell, Group, Header, Panel, PanelHeader, PanelHeaderButton } from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import { Icon28Users3Outline } from '@vkontakte/icons';
import { Icon20EducationOutline } from '@vkontakte/icons';
import { Icon28PaletteOutline } from '@vkontakte/icons';
import { MODAL_CHANGE_GROUP, MODAL_CHANGE_NUM, MODAL_CHANGE_SCHED_THEME } from '../utils/modals'
import { observer, inject } from 'mobx-react'

const osName = platform();

const Settings = inject('store')(observer(({ appUser, id, go, setModal, snackbar, store, storyChange }) => {
	const [joke, setJoke] = useState()
	const admins = [503012833]
	const jokes = [
		'Единороги на фоне', 
		'Закрытие долгов',
		'Доставка из буфета',
		'Хорошое настроение😜',
		'Отмена первых пар',
		'Отмена масочного режима',
		'Наступление лета', 
		"Отключение сессии", 
		"Возврат стипендии"
	]
	useEffect(() => {
		const joke = jokes[randomInteger(0,jokes.length-1)]
		const perc = randomInteger(53, 87)
		setJoke([joke, perc])
	}, [])
	function randomInteger(min, max) {
		// случайное число от min до (max+1)
		let rand = min + Math.random() * (max + 1 - min);
		return Math.floor(rand);
	  }
	return (<Panel id={id}>
		
        <Group header={<Header mode="primary">Основные</Header>}>
	<SimpleCell before={<Icon28Users3Outline width={28} />} indicator={appUser.group} onClick={() => setModal(MODAL_CHANGE_GROUP)}>
		Номер группы
	</SimpleCell>
	<SimpleCell before={<Icon20EducationOutline width={28} />} indicator={appUser.num} onClick={() => setModal(MODAL_CHANGE_NUM)}>
		Номер зачётки
	</SimpleCell>
    </Group>
	<Group header={<Header mode="primary">В разработке</Header>}>
		<SimpleCell before={<Icon28PaletteOutline width={28}/>} indicator={joke && joke[1] + '%'} disabled>
			{joke && joke[0]}
		</SimpleCell>
		
		{(admins.indexOf(store.fetchedUser.id) != -1) && <SimpleCell onClick={go} data-to="adminMenu" before={<Icon28PaletteOutline width={28}/>}>
			Админка
		</SimpleCell>}
		
	</Group>
	{snackbar}
	</Panel>)
}))


export default Settings;
