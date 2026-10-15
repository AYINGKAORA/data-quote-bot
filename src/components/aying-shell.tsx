import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { History, ChevronDown, LogOut, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkspaceProvider } from './quote-workspace';
import { AccountProvider, useAccount } from './account-context';
import { AuthModal } from './auth-modal';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

const LanguageContext = createContext<{ language: 'zh' | 'ru'; setLanguage: (v: 'zh' | 'ru') => void }>({ language: 'zh', setLanguage: () => {} });
export const useLanguage = () => useContext(LanguageContext);
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<'zh' | 'ru'>('ru');
  useEffect(() => { document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'ru'; }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage }}><AccountProvider><WorkspaceProvider>{children}<AuthModal /></WorkspaceProvider></AccountProvider></LanguageContext.Provider>;
}
export function AyingShell({ children }: { children: ReactNode }) {
  const { language, setLanguage } = useLanguage(); const zh = language === 'zh';
  const { user, account, request, signOut } = useAccount();
  return <div className="app-shell"><header className="site-header"><div className="header-inner"><Link to="/" className="brand" aria-label="AyingAI"><span className="brand-mark">A<span /></span><span>Aying<span className="text-primary">AI</span></span></Link><div className="header-actions"><div className="language-switch"><Button variant="ghost" size="sm" aria-pressed={!zh} className={!zh ? 'language-active' : ''} onClick={() => setLanguage('ru')}>RU</Button><span>/</span><Button variant="ghost" size="sm" aria-pressed={zh} className={zh ? 'language-active' : ''} onClick={() => setLanguage('zh')}>中文</Button></div><span className="header-divider" />{user ? <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="avatar-button" aria-label={zh?'用户菜单':'Меню аккаунта'}>{account?.profile.avatar_url ? <img src={account.profile.avatar_url} alt="" /> : (account?.profile.display_name||user.email||'A').slice(0,1).toUpperCase()}<ChevronDown size={12}/></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuLabel className="account-email">{user.email}</DropdownMenuLabel><DropdownMenuSeparator/><DropdownMenuItem asChild><Link to="/history"><History/>{zh?'历史记录':'История'}</Link></DropdownMenuItem>{account?.admin&&<DropdownMenuItem asChild><Link to="/admin"><Users/>{zh?'账号开通':'Управление доступом'}</Link></DropdownMenuItem>}<DropdownMenuItem onSelect={()=>void signOut()}><LogOut/>{zh?'退出登录':'Выйти'}</DropdownMenuItem></DropdownMenuContent></DropdownMenu>:<Button variant="outline" className="login-button" onClick={()=>request()}>{zh?'登录 / 注册':'Вход / Регистрация'}</Button>}</div></div></header>{children}<footer className="site-footer"><span>© 2026 AyingAI</span><span className="footer-status"><span />{zh ? '报价工作台' : 'Рабочее пространство'}</span></footer></div>;
}