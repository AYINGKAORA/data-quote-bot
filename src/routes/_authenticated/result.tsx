import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowLeft, CalendarDays, Check, Download, FileText, FolderCheck, Loader2, Save, TriangleAlert } from 'lucide-react';
import { AyingShell, useLanguage } from '@/components/aying-shell';
import { useWorkspace } from '@/components/quote-workspace';
import { Button } from '@/components/ui/button';
import { downloadQuote, makeQuoteExcel } from '@/lib/export-quote';
import { priceWarnings } from '@/lib/quote-history';
import { useAccount } from '@/components/account-context';

export const Route = createFileRoute('/_authenticated/result')({
  head: () => ({ meta: [{ title: '整理结果 · AyingAI' }, { name: 'description', content: '核对客户、产品与金额，下载报价 Excel 或保存到账号历史。' }, { property: 'og:title', content: '整理结果 · AyingAI' }, { property: 'og:description', content: '查看并核对报价单整理结果。' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: Result,
});
function Result() {
  const { language } = useLanguage(); const zh = language === 'zh';
  const { active, records, ready, save } = useWorkspace();
  const { allowed, request } = useAccount();
  const [exporting, setExporting] = useState(false); const [error, setError] = useState('');
  const saved = !!active?.saved || records.some(record => record.id === active?.id && record.saved);
  async function exportExcel() {
    if (!allowed) { request('download'); return; }
    if (!active) return;
    setExporting(true); setError('');
    try { downloadQuote(await makeQuoteExcel(active.quote, language), `AyingAI-${active.quote.company.replace(/[^\p{L}\p{N} -]/gu, '').slice(0, 70) || 'quotation'}.xlsx`); }
    catch { setError(zh ? 'Excel 导出失败，请重试。' : 'Ошибка экспорта Excel. Попробуйте ещё раз.'); }
    finally { setExporting(false); }
  }
  if (!allowed) return <AyingShell><main className="content-main empty-state"><h1>{zh?'等待管理员开通':'Ожидает одобрения'}</h1><Button onClick={()=>request('view')}>{zh?'查看账号状态':'Статус аккаунта'}</Button></main></AyingShell>;
  if (!active) return <AyingShell><main className="content-main"><div className="empty-state">{ready ? <><FileText /><h1>{zh ? '还没有整理结果' : 'Пока нет результата'}</h1><p>{zh ? '上传一份报价单，开始新的整理。' : 'Загрузите предложение для обработки.'}</p><Button asChild><Link to="/">{zh ? '上传报价单' : 'Загрузить предложение'}</Link></Button></> : <Loader2 className="animate-spin" />}</div></main></AyingShell>;
  const { quote } = active;
  const warnings = priceWarnings(quote);
  const number = (value: number | null) => value === null ? '—' : value.toLocaleString(zh ? 'zh-CN' : 'ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  return <AyingShell><main className="content-main"><Button asChild variant="ghost" className="back-link"><Link to="/"><ArrowLeft />{zh ? '新建整理' : 'Новое предложение'}</Link></Button><div className="result-heading"><div><span className="section-kicker"><span />{zh ? '整理结果' : 'РЕЗУЛЬТАТ'}</span><h1 className="page-title">{quote.company || (zh ? '未识别客户名称' : 'Компания не указана')}</h1><div className="result-meta"><span><CalendarDays />{quote.quotationDate || (zh ? '报价单日期未识别' : 'Дата предложения не указана')}</span><span><FileText />{active.filename}</span></div></div><span className="currency">{zh ? '币种' : 'Валюта'}：{quote.currency || '—'}</span></div><section className="warning-panel" aria-label={zh ? '核对提醒' : 'Проверка данных'}><TriangleAlert /><div><h2>{zh ? '核对提醒' : 'Проверьте данные'}</h2>{warnings.length ? warnings.map(row => <p key={row}>{zh ? `第${row}项：数量×单价≠总价，请核对` : `Строка ${row}: количество × цена ≠ сумма. Проверьте.`}</p>) : <p>{zh ? '未发现数量与金额不一致，请核对原始报价后使用。' : 'Расхождений в расчётах не найдено. Сверьте данные с оригиналом.'}</p>}</div></section><div className="table-scroll"><table className="quote-table"><thead><tr>{(zh ? ['品名', '规格', '数量', '单价', '总价'] : ['Наименование', 'Характеристики', 'Кол-во', 'Цена', 'Сумма']).map(label => <th key={label}>{label}</th>)}</tr></thead><tbody>{quote.products.map((product, i) => <tr key={i}><td><span className="product-index">{String(i + 1).padStart(2, '0')}</span>{product.name || '—'}</td><td>{product.specification || '—'}</td><td>{product.quantity ?? '—'}</td><td>{number(product.unitPrice)}</td><td>{number(product.total)}</td></tr>)}</tbody></table></div><div className="table-caption"><span>{zh ? `共 ${quote.products.length} 项产品` : `Товаров: ${quote.products.length}`}</span><span>{zh ? '保留原始报价金额' : 'Суммы из оригинала'}</span></div>{quote.notes.length > 0 && <section className="notes-block"><h2>{zh ? '注意事项' : 'Примечания'}</h2><ul>{quote.notes.map((note, i) => <li key={i}>{note}</li>)}</ul></section>}<div className="result-actions"><Button onClick={exportExcel} disabled={exporting}>{exporting ? <Loader2 className="animate-spin" /> : <Download />}{zh ? '下载Excel' : 'Скачать Excel'}</Button><Button variant="outline" onClick={async () => { if (!allowed) { request('download'); return; } try { await save(active); setError(''); } catch { setError(zh ? '保存失败，请检查浏览器存储空间。' : 'Не удалось сохранить. Проверьте память браузера.'); } }} disabled={saved}>{saved ? <Check /> : <Save />}{saved ? (zh ? '已保存到历史记录' : 'Сохранено в историю') : (zh ? '保存到历史记录' : 'Сохранить в историю')}</Button></div>{error && <p className="error-message" role="alert">{error}</p>}<p className="privacy-note"><FolderCheck className="inline size-3 mr-1" />{zh ? '处理结果自动保存在账号历史中，仅本人可查看。' : 'Результаты автоматически сохраняются в истории вашего аккаунта.'}</p></main></AyingShell>;
}
