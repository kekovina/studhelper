import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { platform, IOS, Input, Group, RichCell, Avatar } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import axios from 'axios'
import bridge from '@vkontakte/vk-bridge';

import { prepareDate } from '../../utils/functions'

const osName = platform();

const LastVisit = props => {
    const [ users, setUsers ] = useState(null)
    useEffect(() => {
        props.setPopout(<ScreenSpinner size='large' />)
        axios.get("https://tsu-helper-server.herokuapp.com/getLastVisit", {timeout: 15000})
        .then(res => {
        bridge.send("VKWebAppCallAPIMethod", {
            "method": "users.get",
            "request_id": "1212",
            "params": {
                "user_ids": res.data.users.map(item => item.id).join(", "),
                "access_token":"5939b522f443640db39af76cf6708863610df1a7e2cfd1fae85d46fce90d14928710a613a3591869588df",
                "fields": "photo_100"
            }
        }).then(resp => {
            props.setPopout(null)
            resp.response.map( (item, index) => {
                item.lastVisit = res.data.users[index].lastVisit
            })
            setUsers(resp.response)
            
        }).catch(e => console.log(e.error_data))
    })
    }, []);
	return (<Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderButton onClick={props.go} data-to="adminMenu">
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
		>
			Последние 10
		</PanelHeader>
        <Group>
        {users && users.map(user => {
            console.log(user)
            return <RichCell before={<Avatar src={user.photo_100}/>} caption={user.lastVisit ? prepareDate(user.lastVisit) : "нет данных"}>
                { user.first_name + ' ' + user.last_name } 
            </RichCell>
        })}
    	</Group>
	</Panel>)
}

LastVisit.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default LastVisit;
