import React from 'react';
import PropTypes from 'prop-types';
import { PanelHeader, PanelHeaderButton, Panel, platform, IOS, Input, Group, List, Cell, Header, SimpleCell, Snackbar, Avatar } from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import { Icon24UserIncoming } from '@vkontakte/icons';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { serverURL } from '../config'

const osName = platform();

const AdminMenu = inject('store')(observer((props) => {
	const switchExam = () => {
		axios.get(`${serverURL}/switchExam`).then(res =>{
			if(!res.data.err){
				if(res.data.exam != props.store.settings.isExam){
					const snack = (<Snackbar
						onClose={() => props.setSnackbar(null)}
						after={<Avatar src={props.store.fetchedUser.photo_100} size={32} />}
					>Данные обновлены успешно</Snackbar>)
					props.setSnackbar(snack)
					props.store.setSettings({isExam: res.data.exam})
				}
			}
		})
	}
	return (<Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderButton onClick={() => window.history.back()}>
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
		>
			Управление
		</PanelHeader>
        <Group header={<Header mode="secondary">Пользователи</Header>}>
			<List>
				<Cell before={<Icon24UserIncoming/>} onClick={props.go} data-to="lastVisit">Последние посетители</Cell>
				<SimpleCell before={<Icon24UserIncoming/>} onClick={switchExam} indicator={props.store.settings.isExam ? 'Вкл' : 'Откл'}>Сессия</SimpleCell>
			</List>
    	</Group>
		{props.snackbar}
	</Panel>)
}))

AdminMenu.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default AdminMenu;
