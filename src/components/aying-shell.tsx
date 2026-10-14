import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowUpRight, Globe2, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LanguageContext = createContext<{ language: 'zh' | 'ru'; setLanguage: (v: 'zh' | 'ru') => void }>({ language: 'zh', setLanguage: () => {} });
export const useLanguage = () => useContext(LanguageContext);
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<'zh' | 'ru'>('zh');
  useEffect(() => { document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'ru'; }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}
export function AyingShell({ children }: { children: ReactNode }) {
  const { language, setLanguage } = useLanguage(); const zh = language === 'zh';
  const [open, setOpen] = useState(false);
  const nav = [{ to: '/' as const, label: zh ? '首页' : 'Главная' }, { to: '/features' as const, label: zh ? '功能' : 'Возможности' }, { to: '/pricing' as const, label: zh ? '价格' : 'Тарифы' }, { to: '/contact' as const, label: zh ? '联系' : 'Контакты' }];
  return <div className="app-shell"><header className="site-header"><div className="header-inner"><Link to="/" className="brand" aria-label="AyingAI"><span className="brand-mark">A<span /></span><span>Aying<span className="text-primary">AI</span></span></Link><nav className="desktop-nav">{nav.map(n => <Link key={n.to} to={n.to} activeProps={{ className: 'nav-active' }} activeOptions={{ exact: true }}>{n.label}</Link>)}</nav><div className="header-actions"><div className="language-switch"><Globe2 size={15} /><Button variant="ghost" size="sm" className={zh ? 'language-active' : ''} onClick={() => setLanguage('zh')}>中文</Button><span>/</span><Button variant="ghost" size="sm" className={!zh ? 'language-active' : ''} onClick={() => setLanguage('ru')}>RU</Button></div><Button asChild variant="outline" className="header-cta"><Link to="/contact">{zh ? '联系团队' : 'Связаться'}<ArrowUpRight /></Link></Button><Button size="icon" variant="ghost" className="mobile-menu" aria-label={zh ? '打开菜单' : 'Меню'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button></div></div>{open && <nav className="mobile-nav">{nav.map(n => <Link to={n.to} key={n.to} onClick={() => setOpen(false)}>{n.label}</Link>)}</nav>}</header>{children}<footer className="site-footer"><div><span className="footer-brand">AyingAI</span><span>© 2026 AyingAI</span></div><span>{zh ? '让每一份报价，都井然有序。' : 'Порядок в каждом предложении.'}</span><span className="footer-status"><span />{zh ? '为高效贸易而生' : 'Для эффективной торговли'}</span></footer></div>;
}