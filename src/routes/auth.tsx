import {createFileRoute} from '@tanstack/react-router';
import {useEffect} from 'react';
import {AyingShell,useLanguage} from '@/components/aying-shell';
import {useAccount} from '@/components/account-context';
import {Button} from '@/components/ui/button';
export const Route=createFileRoute('/auth')({head:()=>({meta:[{title:'Вход · AyingAI'},{name:'description',content:'Вход и регистрация в рабочем пространстве AyingAI.'},{property:'og:title',content:'Вход · AyingAI'},{property:'og:description',content:'Безопасный доступ к предложениям и истории.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:Auth});
function Auth(){const {request,user}=useAccount(),{language}=useLanguage();useEffect(()=>{request('view');},[]);return <AyingShell><main className="content-main empty-state"><h1>{language==='zh'?'账号访问':'Доступ к аккаунту'}</h1><p>{user?.email}</p><Button onClick={()=>request('view')}>{language==='zh'?'登录 / 注册':'Вход / Регистрация'}</Button></main></AyingShell>;}
