import React from 'react';
import PropTypes from 'prop-types';
import { platform, PanelHeader, IOS, Input, Group, FormLayout, Button } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import { useState } from 'react'
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import axios from 'axios';

const osName = platform();


const Start = props => {
    const [form, setForm] = useState({num: '', aff: ''});
    const [validAff, setValidAff] = useState(false)
    const [validNum, setValidNum] = useState(false)
    const register = () => {
        props.setPopout(<ScreenSpinner size='large' />)
        axios.get(`https://tsu-helper-server.herokuapp.com/newUser`, {params: { num: form.aff, group: form.num, id: props.vku.id}}).then((res) => {
            props.setPopout(null)
            if(res.data.err){
                props.createError({type: 1, descr: res.data.text, name: "Регистрация", code: res.data, back: 'start'})
                props.setActivePanel('error')
            }else{
                props.setActivePanel('home')
                props.setAppUser({group: form.num, num: form.aff, status: `группы ${res.data.user.group}`})
            }
        }).catch(e => {
            props.setPopout(null)
        })
    }
    const onChange =  (e) => {
        const { name, value } = e.currentTarget;
        switch(name){
            case 'num':
                if(/[1-9]\d{5}/g.test(value)){
                    setForm({...form, num: value})
                    setValidNum(true)
                } else {
                    setValidNum(false)
                }
                break;
            case 'aff':
                if(/((1[3-9])|(2[0-5]))\d{4}$/g.test(value)){
                    setForm({...form, aff: value})
                    setValidAff(true)
                } else {
                    setValidAff(false)
                }
                break;
        }
    }
	return (<Panel id={props.id}>
    <PanelHeader>Знакомство</PanelHeader>
        <Group>
        <FormLayout>
              <Input
                type="text"
                name="num"
                onChange={onChange}
                top="Номер группы" 
                status={validNum ? 'valid' : 'error'}
                bottom={validNum ? 'Мне нравится твоя группа' : 'Номер группы введён верно'}
              />
              <Input
                type="text"
                name="aff"
                onChange={onChange}
                top="Номер зачётки" 
                status={validAff ? 'valid' : 'error'}
                bottom={validAff ? 'Полагаю, лучшая зачётка!' : 'Номер зачётки введён верно'}
              />
              {validAff && validNum && <Button mode="secondary" onClick={register}>Войти</Button>}
        </FormLayout>
    </Group>
    </Panel>);
}

export default Start;
