import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ArrowUpRight, FileText, History as HistoryIcon, Loader2, Plus } from 'lucide-react';
import { AyingShell, useLanguage } from '@/components/aying-shell';
import { useWorkspace } from '@/components/quote-workspace';
import { Button } from '@/components/ui/button';
export const Route = createFileRoute('/history')({
  head: () => ({ meta: [{ title: '历史记录 · AyingAI' }, { name: 'description', content: '按时间查看本机保存的客户报价记录。' }, { property: 'og:title', content: '历史记录 · AyingAI' }, { property: 'og:description', content: '重新查看保存的报价单与 Excel 数据。' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: History,
});
function History() {
  const { language } = useLanguage(); const zh = language === 'zh';
  const { records, ready, open } = useWorkspace(); const navigate = useNavigate();
  return <AyingShell><main className="content-main"><Button asChild variant="ghost" className="back-link"><Link to="/"><ArrowLeft />{zh ? '返回工作台' : 'Рабочее пространство'}</Link></Button><div className="history-top"><div><h1 className="page-title">{zh ? '历史记录' : 'История'}</h1><p className="history-count">{zh ? `${records.length} 份报价 · 最新优先` : `Предложений: ${records.length} · Сначала новые`}</p></div><Button asChild variant="outline"><Link to="/"><Plus />{zh ? '新建整理' : 'Создать'}</Link></Button></div>{!ready ? <Loader2 className="animate-spin" /> : records.length ? <div className="history-list">{records.map(record => <Link to="/result" className="history-item" key={record.id} onClick={e => { e.preventDefault(); open(record); void navigate({ to: '/result' }); }}><div><span className="history-file"><FileText /></span><div><h2>{record.quote.company || (zh ? '未命名客户' : 'Компания не указана')}</h2><p>{new Date(record.date).toLocaleString(zh ? 'zh-CN' : 'ru-RU', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</p></div></div><ArrowUpRight size={17} className="text-muted-foreground shrink-0" /></Link>)}</div> : <div className="empty-state"><HistoryIcon /><h2>{zh ? '还没有历史记录' : 'История пока пуста'}</h2><p>{zh ? '保存后的报价单会出现在这里。' : 'Здесь появятся сохранённые предложения.'}</p><Button asChild><Link to="/"><Plus />{zh ? '整理第一份报价' : 'Обработать предложение'}</Link></Button></div>}<p className="privacy-note">{zh ? '记录仅保存在当前浏览器，不会同步到其他设备。' : 'Записи хранятся только в этом браузере, без синхронизации между устройствами.'}</p></main></AyingShell>;
}
