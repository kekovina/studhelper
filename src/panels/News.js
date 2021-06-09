import React, { useEffect, useState } from 'react';
import { platform, IOS, CardGrid, Panel, PanelHeader, PanelHeaderButton } from '@vkontakte/vkui';
import NewsCard from '../components/NewsCard'
import bridge from '@vkontakte/vk-bridge';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';


// const scheme = document.body.attributes.getNamedItem("scheme").value
const osName = platform();

const News = ({ id, go }) => {
    const [news, setNews] = useState(null)
    useEffect(() => {
        bridge.send("VKWebAppCallAPIMethod", {
            		"method": "wall.get",
            		"request_id": "1212",
            		"params": {
            			"owner_id": -202317653,
                        "count": 10,
                        "filter": 'owner',
            			"access_token":"2c47d1312c47d1312c47d131972c32608422c472c47d13173add6862d3b4b7516945aba",
            			"v":"5.130"
            		}
            	})
                .then(res => {
                    if(res.response){
                        setNews(res.response.items)
                    }
                })
    }, []);
	return (<Panel id={id}>
		<PanelHeader
			left={<PanelHeaderButton onClick={() => window.history.back()}>
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
		>
			Новости
		</PanelHeader>
        <CardGrid style={{marginTop: "15px"}}>
            {news && news.map(item => {
                const attachments = item.attachments ? item.attachments.pop() : null
                const photo = attachments ? attachments.photo.sizes.pop().url : null
                return (<NewsCard text={item.text} date={item.date*1000} photo={photo} />)
            })}
        </CardGrid>
	</Panel>);
}


export default News;