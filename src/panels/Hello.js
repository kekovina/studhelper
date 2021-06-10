import React, { useEffect, useState } from 'react';
import { Icon36CancelOutline } from '@vkontakte/icons';
import { Avatar, Panel } from '@vkontakte/vkui';
import { inject, observer } from 'mobx-react'
import './hello.css'
import mainStore from '../store/mainStore';
import stick7 from '../img/1_3.png';
const Hello =  inject("store")(observer(({ id, store }) => {
    const [loading, setRandom] = useState(true)
    function randomInteger(min, max) {
		// случайное число от min до (max+1)
		let rand = min + Math.random() * (max + 1 - min);
		return Math.floor(rand);
	  }
    const jokes = [
        'Кормим наших голубей',
        'Данные похители киберпираты. Отбиваем',
        'Напрягаем администратора',
        'Зачем вообще этот крестик?',
        'Вычисляем расстояние до галактики Медуза',
        'Бип-буп-бип',
        'Регистрируем заявку на кредит',
        'Заказываем симпл-димпл',
        'Обучаемся постиронии',
        'Включаем режим "Прокрастинация"... ОК.',
        'Майним криптовалюту на вашем устройстве',
        'Жарим яичницу на сервере',
        '🥺👉🏻👈🏻',
        'Доедаем сырок Б.Ю.Александрова',
        'Инициируем закупку ацидолакта'

    ]
    useEffect(() => {
        var interval
        var copy_jokes = jokes.slice(0)
        if(loading){
            interval = setInterval(() => {
                let id_joke = randomInteger(0,copy_jokes.length - 1)
                let cjoke = copy_jokes[id_joke]
                delete copy_jokes[id_joke]
                copy_jokes = copy_jokes.filter(joke => joke)
                if(copy_jokes.length < 3){
                    copy_jokes = jokes.slice(0)
                }
                store.updateLoadingAppStatus({text: [cjoke]})
            }, 3000)
        }
        return () => {
            clearInterval(interval)
        }
    }, [loading])
  useEffect(() => {
    var to
    if(store.loadingAppStatus.code == 1){
        setRandom(false)
        to = setTimeout(() => {
                mainStore.setActivePanel('home')
        }, 3000)
    }
    if(store.loadingAppStatus.code == 0){
        setRandom(false)
        to = setTimeout(() => {
            mainStore.setActivePanel('start')
        }, 3000)
    }
      return () => {
          clearTimeout(to)
      }
  }, [store.loadingAppStatus.code])
	return (<Panel id={id}>
		<div className="hello_wrap">
            {store.loadingAppStatus.code == 777 && <Icon36CancelOutline />}
            {store.loadingAppStatus.code == 2 &&  <img src={stick7} style={{margin: '0 auto', width: '200px'}} />}
            {store.loadingAppStatus.code != 777 && store.loadingAppStatus.code != 2 && <Avatar src={store.fetchedUser.photo_200} size={72}/>}
            <div className="app_status">{store.loadingAppStatus.text.map(line => <p>{line}</p>)}</div>
        </div>
     </Panel>);
    }))

export default Hello;
