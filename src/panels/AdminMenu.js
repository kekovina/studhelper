import React from 'react';
import PropTypes from 'prop-types';
import { platform, IOS, Input, Group, List, Cell, Header } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import { Icon24UserIncoming } from '@vkontakte/icons';

const osName = platform();

const AdminMenu = props => {
	return (<Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderButton onClick={props.go} data-to="home">
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
		>
			Управление
		</PanelHeader>
        <Group header={<Header mode="secondary">Пользователи</Header>}>
			<List>
				<Cell before={<Icon24UserIncoming/>} onClick={props.go} data-to="lastVisit">Последние посетители</Cell>
			</List>
    	</Group>
	</Panel>)
}

AdminMenu.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default AdminMenu;
