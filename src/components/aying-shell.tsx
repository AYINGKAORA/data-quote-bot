import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { History, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkspaceProvider } from './quote-workspace';

const LanguageContext = createContext<{ language: 'zh' | 'ru'; setLanguage: (v: 'zh' | 'ru') => void }>({ language: 'zh', setLanguage: () => {} });
export const useLanguage = () => useContext(LanguageContext);
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<'zh' | 'ru'>('zh');
  useEffect(() => { document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'ru'; }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage }}><WorkspaceProvider>{children}</WorkspaceProvider></LanguageContext.Provider>;
}
export function AyingShell({ children }: { children: ReactNode }) {
  const { language, setLanguage } = useLanguage(); const zh = language === 'zh';
  return <div className="app-shell"><header className="site-header"><div className="header-inner"><Link to="/" className="brand" aria-label="AyingAI"><span className="brand-mark">A<span /></span><span>Aying<span className="text-primary">AI</span></span></Link><div className="header-actions"><Button asChild variant="ghost" className="history-link"><Link to="/history" activeProps={{ className: 'is-active' }}><History />{zh ? '历史记录' : 'История'}</Link></Button><span className="header-divider" /><div className="language-switch"><Button variant="ghost" size="sm" aria-pressed={zh} className={zh ? 'language-active' : ''} onClick={() => setLanguage('zh')}>中文</Button><span>/</span><Button variant="ghost" size="sm" aria-pressed={!zh} className={!zh ? 'language-active' : ''} onClick={() => setLanguage('ru')}>RU</Button><ChevronDown size={12} /></div></div></div></header>{children}<footer className="site-footer"><span>© 2026 AyingAI</span><span className="footer-status"><span />{zh ? '工作台已就绪' : 'Готово к работе'}</span></footer></div>;
}