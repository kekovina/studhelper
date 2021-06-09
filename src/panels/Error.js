import React from 'react';
import PropTypes from 'prop-types';
import { platform, IOS, Panel, PanelHeader, PanelHeaderButton } from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import stick1 from '../img/0_0.png';
import stick2 from '../img/0_1.png';
import stick3 from '../img/0_2.png';
import stick4 from '../img/1_0.png';
import stick5 from '../img/1_1.png';
import stick6 from '../img/1_2.png';
import stick7 from '../img/1_3.png';
import stick8 from '../img/1_4.png';
import stick9 from '../img/2_0.png';
import './Error.css';

const osName = platform();

const stickers = [
    [stick1, stick2, stick3],
    [stick4, stick5, stick6, stick7, stick8],
    [stick9]
];

function randomInteger(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }

const Error = props => {
    console.log(props)
    const sticker = stickers[props.err.type][randomInteger(0,stickers[props.err.type].length)]
	const scheme = document.body.attributes.getNamedItem("scheme").value
	return (<Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderButton onClick={props.go} data-to={props.err.back}>
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
		/>
            <img src={sticker} style={{margin: '0 auto', width: '200px'}} />
            <div className="err-header">{props.err.type ? props.err.type == 1 ? props.err.name : "Внезапная ошибка" : "Сервер уснул"}</div>
            <div className="err-descr">{props.err.type ? props.err.descr : "Мы скоро всё обязательно починим"}</div>
            <div className="err-descr-sub">Пожалуйста, заскринь и сообщи <a href="http://vk.com/kekovinya">Антону</a> о произошедшем</div>
            {props.err.code && <div className="err-body" style={{color: scheme == "space_gray" ? "" : "white"}}>{JSON.stringify(props.err.code)}</div>}
	</Panel>);
    }

export default Error;
