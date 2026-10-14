import { createFileRoute } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useRef, useState } from 'react';
import { Building2, Check, CircleCheck, Download, FileText, Info, Loader2, LockKeyhole, ScanLine, ShieldCheck, Sparkles, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AyingShell, useLanguage } from '@/components/aying-shell';
import { analyzeQuote } from '@/lib/quote.functions';
import { demoQuote, validateUpload, type Quote } from '@/lib/quote';
import { downloadQuote, makeQuoteExcel } from '@/lib/export-quote';
import documentArt from '@/assets/document.png';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: 'AyingAI · AI 报价单处理工具' }, { name: 'description', content: '上传图片或 PDF，智能整理客户、产品与报价信息，导出 Excel。支持中俄双语。' }, { property: 'og:title', content: 'AyingAI · AI 报价单处理工具' }, { property: 'og:description', content: '从复杂报价到清晰表格，图片与 PDF 一键整理。' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: Index,
});
function Index() {
  const { language } = useLanguage(); const zh = language === 'zh';
  const input = useRef<HTMLInputElement>(null); const analyze = useServerFn(analyzeQuote);
  const [file, setFile] = useState<File | null>(null); const [quote, setQuote] = useState<Quote | null>(null);
  const [dragging, setDragging] = useState(false); const [loading, setLoading] = useState(false); const [exporting, setExporting] = useState(false); const [error, setError] = useState('');
  const result = quote || demoQuote;
  const choose = (chosen?: File) => { if (!chosen) return; const invalid = validateUpload(chosen); if (invalid) { setError(invalid === 'type' ? (zh ? '请选择 JPG、PNG、WebP 图片或 PDF 文件。' : 'Выберите JPG, PNG, WebP или PDF.') : (zh ? '请选择不超过 20MB 的非空文件。' : 'Размер файла: от 1 байта до 20 МБ.')); return; } setFile(chosen); setError(''); setQuote(null); };
  async function process() {
    if (!file) { input.current?.click(); return; }
    setLoading(true); setError('');
    try {
      const base64 = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1] || ''); reader.onerror = reject; reader.readAsDataURL(file); });
      const response = await analyze({ data: { filename: file.name, mime: file.type as 'image/jpeg' | 'image/png' | 'image/webp' | 'application/pdf', base64, language } });
      if (!response.ok) setError(response.error); else setQuote(response.quote);
    } catch { setError(zh ? '暂时无法整理，请稍后重试。' : 'Не удалось обработать файл. Попробуйте позже.'); } finally { setLoading(false); }
  }
  async function exportExcel() { setExporting(true); try { const blob = await makeQuoteExcel(result, language); downloadQuote(blob, `AyingAI-${quote ? 'quotation' : 'sample'}.xlsx`); } catch { setError(zh ? 'Excel 导出失败，请重试。' : 'Ошибка экспорта Excel.'); } finally { setExporting(false); } }
  const demoNames = zh ? demoQuote.products : [{ name: 'Термокружка', specification: '500 мл · Сталь 304' }, { name: 'Электрическая кофемолка', specification: 'USB · Чёрная' }, { name: 'Стеклянная чашка', specification: '350 мл · Прозрачная' }];
  const notes = quote ? result.notes : zh ? demoQuote.notes : ['Валюта: CNY. Налог включён.', 'Срок поставки: 15–20 рабочих дней.', 'Оплата: 30% аванс, 70% до отгрузки.'];
  const number = (value: number | null) => value === null ? '—' : value.toLocaleString(zh ? 'zh-CN' : 'ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return <AyingShell><main className="tool-main"><section className="tool-heading"><div className="eyebrow"><Sparkles /> AI-POWERED QUOTATION WORKSPACE</div><h1>{zh ? <>AyingAI <span>智能报价单整理</span></> : <>AyingAI <span>Обработка предложений</span></>}</h1><p>{zh ? '从复杂报价到清晰表格，让 AI 替你完成繁琐的整理。' : 'Из сложного документа — в понятную таблицу с помощью AI.'}</p></section>
    <section className="workspace"><div className="workspace-label"><span><span className="step-number">01</span>{zh ? '上传报价单' : 'Загрузите предложение'}</span><span>{zh ? '支持图片与 PDF 格式' : 'Изображения и PDF'}</span></div><div className={`drop-zone ${dragging ? 'is-dragging' : ''}`} onDragOver={e => { e.preventDefault(); if (!loading) setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); if (!loading) choose(e.dataTransfer.files[0]); }}>
      <img src={documentArt} className="document-art" width={88} height={88} alt="" />
      <h2 className="drop-title">{zh ? '将报价单拖拽到这里' : 'Перетащите предложение сюда'}</h2><p className="drop-copy">{zh ? '或点击下方按钮选择文件 · 单个文件最大 20 MB' : 'Или выберите файл ниже · До 20 МБ'}</p>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" disabled={loading} aria-label={zh ? '上传报价单文件' : 'Загрузить файл предложения'} onChange={e => choose(e.target.files?.[0])} />
      {file && <div className="selected-file"><FileText size={14} /><span>{file.name}</span><Button variant="ghost" size="icon" disabled={loading} aria-label={zh ? '移除文件' : 'Удалить файл'} onClick={() => { setFile(null); if (input.current) input.current.value = ''; }}><X /></Button></div>}
      <Button className="upload-button" onClick={process} disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : <Sparkles />}{loading ? (zh ? '正在识别报价单…' : 'Распознавание…') : (zh ? '一键整理报价单' : 'Обработать предложение')}</Button><div className="file-chips"><span>JPG</span><span>PNG</span><span>WEBP</span><span>PDF</span></div>
    </div>{error && <p role="alert" className="error-message">{error}</p>}<div className="trust-row"><span><ShieldCheck />{zh ? '文件加密传输' : 'Защищённая передача'}</span><span><Zap />{zh ? 'AI 智能识别' : 'AI-распознавание'}</span><span><ScanLine />{zh ? '中俄文档支持' : 'Китайский и русский'}</span></div></section>
    <section className="result-section" aria-live="polite"><div className="result-header"><h2 className="result-title"><span className="step-number">02</span>{zh ? '整理结果' : 'Результат'}<span className={quote ? 'success-label' : 'demo-label'}>{quote ? (zh ? '识别完成' : 'Готово') : (zh ? '示例预览' : 'Пример')}</span></h2><span>{quote ? (zh ? '请核对原始报价' : 'Проверьте исходный документ') : (zh ? '上传文件后显示实际结果' : 'Загрузите файл для результата')}</span></div>
      <div className="result-tool"><div className="customer-line"><div><span className="customer-icon"><Building2 /></span><div><div className="customer-label">{zh ? '客户公司' : 'Компания клиента'}</div><div className="customer-name">{result.company || '—'}</div></div></div><span className="currency-label">{zh ? '币种' : 'Валюта'}：{result.currency || '—'}</span></div><div className="table-scroll"><table className="quote-table"><thead><tr>{(zh ? ['品名', '规格', '数量', '单价', '总价'] : ['Наименование', 'Характеристики', 'Кол-во', 'Цена', 'Сумма']).map(label => <th key={label}>{label}</th>)}</tr></thead><tbody>{result.products.map((p, i) => <tr key={i}><td><span className="product-index">{String(i + 1).padStart(2, '0')}</span>{quote ? p.name : demoNames[i]?.name}</td><td>{quote ? p.specification : demoNames[i]?.specification}</td><td>{p.quantity ?? '—'}</td><td>{number(p.unitPrice)}</td><td>{number(p.total)}</td></tr>)}</tbody></table></div><div className="table-bottom"><span>{zh ? `共 ${result.products.length} 项产品` : `${result.products.length} товаров`}</span><span>{zh ? '金额按原始报价保留' : 'Суммы из исходного документа'}</span></div></div>
      <div className="notes-block"><h3><Info />{zh ? '注意事项' : 'Примечания'}</h3><ul>{notes.length ? notes.map((note, i) => <li key={i}>{note}</li>) : <li>{zh ? '原文未提供注意事项。' : 'Примечания не указаны.'}</li>}</ul></div><div className="export-row"><span>{quote ? <CircleCheck /> : <LockKeyhole />}{zh ? 'AI 结果仅供参考，请核对后使用。' : 'Проверьте данные перед использованием.'}</span><Button variant="secondary" className="export-button" onClick={exportExcel} disabled={exporting}>{exporting ? <Loader2 className="animate-spin" /> : <Download />}{zh ? '下载 Excel' : 'Скачать Excel'}<Check size={12} /></Button></div>
    </section></main></AyingShell>;
}
