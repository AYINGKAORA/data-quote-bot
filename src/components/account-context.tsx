import { createContext,useContext,useEffect,useState,useCallback,type ReactNode } from 'react';
import type {User} from '@supabase/supabase-js';
import { useServerFn } from '@tanstack/react-start';
import {useRouter,useNavigate} from '@tanstack/react-router';
import {useQueryClient} from '@tanstack/react-query';
import {supabase} from '@/integrations/supabase/client';
import {getAccount} from '@/lib/account.functions';
import {canUseWorkspace} from '@/lib/account-policy';
type Account = Awaited<ReturnType<typeof getAccount>>;
type State = {user:User|null; account:Account|null;ready:boolean;allowed:boolean;error:string;prompt:string|null;request:(reason?:string)=>void;close:()=>void;refresh:()=>Promise<boolean>;signOut:()=>Promise<void>};
const Context=createContext<State|undefined>(undefined);
export function useAccount(){const c=useContext(Context);if(!c)throw new Error('Account provider missing');return c;}
export function AccountProvider({children}:{children:ReactNode}){
 const [user,setUser]=useState<User|null>(null),[account,setAccount]=useState<Account|null>(null),[ready,setReady]=useState(false),[error,setError]=useState(''),[prompt,setPrompt]=useState<string|null>(null);
 const fetchAccount=useServerFn(getAccount),router=useRouter(),navigate=useNavigate(),query=useQueryClient();
 const refresh=useCallback(async()=>{setError('');const {data,error:authError}=await supabase.auth.getUser();setUser(data.user);let approved=false;if(data.user && !authError){try{const next=await fetchAccount();setAccount(next);approved=next.approved;}catch{setAccount(null);setError('Не удалось загрузить аккаунт / 无法读取账号');}}else setAccount(null);setReady(true);return approved;},[fetchAccount]);
 useEffect(()=>{void refresh();const {data}=supabase.auth.onAuthStateChange(event=>{if(!['SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(event))return;setTimeout(()=>{void refresh();void router.invalidate();if(event!=='SIGNED_OUT')void query.invalidateQueries();},0);});return ()=>data.subscription.unsubscribe();},[refresh,router,query]);
 async function signOut(){await query.cancelQueries();query.clear();setAccount(null);setUser(null);await supabase.auth.signOut();await navigate({to:'/auth',replace:true});}
 return <Context.Provider value={{user,account,ready,error,allowed:canUseWorkspace(!!user,!!account?.approved),prompt,request:(reason='view')=>setPrompt(reason),close:()=>setPrompt(null),refresh,signOut}}>{children}</Context.Provider>;
}
