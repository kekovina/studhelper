import React from 'react';
import PropTypes from 'prop-types';
import { platform, IOS, SimpleCell, Group, Header } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import { Icon28Users3Outline } from '@vkontakte/icons';
import { Icon20EducationOutline } from '@vkontakte/icons';
import { Icon28PaletteOutline } from '@vkontakte/icons';
import { MODAL_CHANGE_GROUP, MODAL_CHANGE_NUM } from '../utils/modals'

const osName = platform();

const Settings = ({ appUser, id, go, setModal, snackbar }) => (
	<Panel id={id}>
		<PanelHeader
			left={<PanelHeaderButton onClick={go} data-to="home">
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
		>
			Настройки
		</PanelHeader>
        <Group header={<Header mode="primary">Основные</Header>}>
	<SimpleCell before={<Icon28Users3Outline width={28} />} indicator={appUser.group} onClick={() => setModal(MODAL_CHANGE_GROUP)}>
		Номер группы
	</SimpleCell>
	<SimpleCell before={<Icon20EducationOutline width={28} />} indicator={appUser.num} onClick={() => setModal(MODAL_CHANGE_NUM)}>
		Номер зачётки
	</SimpleCell>
    </Group>
	<Group>
		<SimpleCell before={<Icon28PaletteOutline width={28}/>} disabled indicator="в разработке">
			Предпочтения
		</SimpleCell>
	</Group>
	{snackbar}
	</Panel>
);

Settings.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Settings;
