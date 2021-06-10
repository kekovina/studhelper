import React from 'react';
import PropTypes from 'prop-types';
import { platform, PanelHeader, IOS, Input, Group, FormLayout, Button, Panel, ScreenSpinner, FormItem } from '@vkontakte/vkui';
import { useState } from 'react'
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
                // props.setActivePanel('error')
            }else{
                props.setActivePanel('home')
                props.setAppUser({group: form.num, num: form.aff, status: `группы ${res.data.user.group}`})
            }
        }).then(
            props.initApp(props.vku.id)
        )
        .catch(e => {
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
            <FormItem
                top="Номер группы" 
                status={validNum ? 'valid' : 'error'}
                bottom={validNum ? 'Мне нравится твоя группа' : 'Некорректный номер группы'}>
                <Input
                    type="text"
                    name="num"
                    onChange={onChange}
                />
            </FormItem>
            <FormItem
                top="Номер зачётки" 
                status={validAff ? 'valid' : 'error'}
                bottom={validAff ? 'Полагаю, лучшая зачётка!' : 'Некорректный номер зачётки'}>
              <Input
                type="text"
                name="aff"
                onChange={onChange}
              />
            </FormItem>
              
              {validAff && validNum && <FormItem>
                <Button size='m' onClick={register} stretched>Войти</Button>
                  </FormItem>}
        </FormLayout>
    </Group>
    </Panel>);
}

export default Start;
