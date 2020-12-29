import React from 'react';
import PropTypes from 'prop-types';
import { platform, IOS, Gallery, Group, Header, CardScroll, Card } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import CustomCard from '../components/CustomCard'
import CustomGallery from '../components/CustomGallery'

const osName = platform();
const subjects = [
	{name: "Теория струн и некоторых жоп", type:1, att: 34, res: 74},
	{name: "Теория струн и некоторых жоп", type:1, att: 34, res: 24},
	{name: "Теория струн и некоторых жоп", type:2, att: 34, res: 84},
	{name: "Теория струн и некоторых жоп", type:2, att: 34, res: 64},
	{name: "Теория струн и некоторых жоп", type:2, att: 34, res: 44},
	{name: "Теория струн и некоторых жоп", type:2, att: 34, res: 24},
	{name: "Теория струн и некоторых жоп", type:1, att: 34, res: 74},
	{name: "Теория струн и некоторых жоп", type:1, att: 34, res: 74},
	{name: "Теория струн и некоторых жоп", type:1, att: 34, res: 74},
]

const Progress = props => (
	<Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderButton onClick={props.go} data-to="home">
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
		>
			Зачётка
		</PanelHeader>
		<Group description="Семестр 1">
      <CardScroll size="s">
		{subjects.map(item => (<Card onClick={props.go} data-to="persik">
          <CustomCard data={item}/>
        </Card>))}
        
      </CardScroll>
    </Group>
		{/* <Group header={<Header mode="secondary">Семестр 1</Header>}>
              <Gallery
                slideWidth="90%"
                style={{ height: 150 }}
                bullets="dark"
				align="center"
              >
                {subjects.map(item => (<CustomGallery data={item}/>))}
              </Gallery>
            </Group> */}
	</Panel>
);

Progress.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Progress;
