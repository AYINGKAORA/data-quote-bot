import {createContext,useContext,useState,type ReactNode} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useServerFn} from '@tanstack/react-start';
import {type QuoteRecord} from '@/lib/quote-history';
import {listQuotes,saveQuote} from '@/lib/workspace.functions';
import {useAccount} from './account-context';
type Record=QuoteRecord&{saved?:boolean};
const Context=createContext<{records:Record[];active:Record|null;ready:boolean;error:string;open:(r:Record)=>void;save:(r:Record)=>Promise<void>}>({records:[],active:null,ready:false,error:'',open:()=>{},save:async()=>{}});
export const useWorkspace=()=>useContext(Context);
export function WorkspaceProvider({children}:{children:ReactNode}){
 const {user,allowed,ready}=useAccount(),[selection,setSelection]=useState<{userId:string;record:Record}|null>(null),fetch=useServerFn(listQuotes),saveFn=useServerFn(saveQuote);
 const query=useQuery({queryKey:['quotes',user?.id],queryFn:()=>fetch(),enabled:allowed});
 const records=query.data||[],active=user&&allowed&&selection?.userId===user.id?selection.record:null;
 async function save(record:Record){await saveFn({data:{id:record.id}});setSelection(user?{userId:user.id,record:{...record,saved:true}}:null);await query.refetch();}
 return <Context.Provider value={{records,active,ready:ready&&(!allowed||!query.isPending),error:query.error?'Не удалось загрузить историю / 历史读取失败':'',open:record=>{if(user&&allowed)setSelection({userId:user.id,record});},save}}>{children}</Context.Provider>;
}
