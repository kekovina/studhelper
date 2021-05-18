import React from 'react';

import { inject, observer } from 'mobx-react';
import { Panel, PanelHeader, Avatar, Group, SimpleCell, Link } from '@vkontakte/vkui'
import { Icon24Settings, Icon24Users, Icon20ServicesOutline } from '@vkontakte/icons'

const Profile = inject('store')(observer(({ id, store }) => {
    const admins = [503012833]
    return (
    <Panel id={id}>
        <PanelHeader>Профиль</PanelHeader>
        {store.fetchedUser &&
		    <div className={`userbar ${store.theme}`}>
			    <Avatar src={store.fetchedUser.photo_200}/>
			    <div className="userinfo">
				    <div className="username">{`${store.fetchedUser.first_name} ${store.fetchedUser.last_name}`}</div>
				    <div className="group">{(store.fetchedUser.sex == 1 ? "Студентка" : "Студент") +" " +(store.appUser.status || "")}</div>
			    </div>
		    </div>
		    }
        <Group>
            <SimpleCell before={<Icon24Settings width={28}/>} onClick={() => store.setActivePanel('settings')}>Настройки</SimpleCell>
            <SimpleCell before={<Icon24Users width={28}/>} onClick={() => window.open("https://vk.com/public202317653")}>Наша группа</SimpleCell>
            {store.fetchedUser && admins.indexOf(store.fetchedUser.id) != -1 && 
			(<SimpleCell before={<Icon20ServicesOutline width={28}/>}onClick={() => store.setActivePanel('adminMenu')}>Управление</SimpleCell>)
			}
        </Group>
    </Panel>
    );
}))

export default Profile;
