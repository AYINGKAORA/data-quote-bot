import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useRef, useState } from 'react';
import { ArrowRight, Check, FileText, Loader2, ShieldCheck, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AyingShell, useLanguage } from '@/components/aying-shell';
import { useWorkspace } from '@/components/quote-workspace';
import { analyzeQuote } from '@/lib/quote.functions';
import { validateUpload } from '@/lib/quote';
import documentArt from '@/assets/quote-upload.png';
import { useAccount } from '@/components/account-context';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: '报价工作台 · AyingAI' }, { name: 'description', content: '上传图片或 PDF，整理客户与报价信息，核对金额并下载 Excel。' }, { property: 'og:title', content: '报价工作台 · AyingAI' }, { property: 'og:description', content: '专注每一份报价，中文与俄文双语工作台。' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: Index,
});
function Index() {
  const { language } = useLanguage(); const zh = language === 'zh';
  const { open } = useWorkspace(); const navigate = useNavigate();
  const { allowed, request } = useAccount();
  const input = useRef<HTMLInputElement>(null); const analyze = useServerFn(analyzeQuote);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  function choose(chosen?: File) {
    if (!chosen) return;
    const invalid = validateUpload(chosen);
    if (invalid) { setError(invalid === 'type' ? (zh ? '请选择 JPG、PNG、WebP 图片或 PDF。' : 'Выберите JPG, PNG, WebP или PDF.') : (zh ? '请选择不超过 20 MB 的非空文件。' : 'Выберите непустой файл до 20 МБ.')); return; }
    setFile(chosen); setError('');
  }
  async function process() {
    if (!allowed) { request('view'); return; }
    if (!file) { input.current?.click(); return; }
    setLoading(true); setError('');
    try {
      const base64 = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1] || ''); reader.onerror = reject; reader.readAsDataURL(file); });
      const response = await analyze({ data: { filename: file.name, mime: file.type as 'image/jpeg' | 'image/png' | 'image/webp' | 'application/pdf', base64, language } });
      if (!response.ok) setError(response.error);
      else { open(response.record); await navigate({ to: '/result' }); }
    } catch { setError(zh ? '暂时无法整理，请稍后重试。' : 'Не удалось обработать файл. Попробуйте позже.'); } finally { setLoading(false); }
  }
  return <AyingShell><main className="upload-main"><div className="workspace-heading"><span className="section-kicker"><span />{zh ? '报价工作台' : 'РАБОЧЕЕ ПРОСТРАНСТВО'}</span><h1>{zh ? '报价工作台' : 'Рабочее пространство'}</h1></div><div className={`drop-zone ${dragging ? 'is-dragging' : ''} ${file ? 'has-file' : ''}`} onDragOver={e => { e.preventDefault(); if (!loading) setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); if (!loading) choose(e.dataTransfer.files[0]); }}><span className="drop-corner">01 / {zh ? '上传文件' : 'ЗАГРУЗКА'}</span><img src={documentArt} className="document-art" width={156} height={156} alt="" /><h2>{file ? (zh ? '报价单已就绪' : 'Файл готов') : (zh ? '拍照或上传俄语报价单' : 'Загрузите предложение на русском')}</h2><p className="drop-copy">{zh ? '图片或 PDF，单个文件最大 20 MB' : 'Изображение или PDF, до 20 МБ'}</p><input ref={input} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" disabled={loading} aria-label={zh ? '上传报价单文件' : 'Загрузить файл предложения'} onChange={e => choose(e.target.files?.[0])} />{file ? <div className="selected-file"><FileText size={16} /><span>{file.name}</span><Button variant="ghost" size="icon" disabled={loading} aria-label={zh ? '移除文件' : 'Удалить файл'} onClick={() => { setFile(null); if (input.current) input.current.value = ''; }}><X /></Button></div> : <Button variant="outline" className="choose-button" disabled={loading} onClick={() => input.current?.click()}><Upload />{zh ? '选择文件' : 'Выбрать файл'}</Button>}<div className="file-chips"><span>JPG</span><span>PNG</span><span>WEBP</span><span>PDF</span></div>{file && <span className="file-ready"><Check size={13} />{zh ? '可以开始整理' : 'Можно начать обработку'}</span>}</div><Button className="start-button" onClick={process} disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : null}{loading ? (zh ? '正在整理…' : 'Обработка…') : (zh ? '开始整理' : 'Начать обработку')}{!loading && <ArrowRight />}</Button>{error && <p role="alert" className="error-message">{error}</p>}<p className="trust-line"><ShieldCheck />{zh ? '支持图片/PDF ｜ 加密传输 ｜ 通常30秒' : 'Фото / PDF · Шифрование · Обычно 30 сек'}</p><p className="privacy-note">{zh ? '文件发送至 AI 服务识别，整理结果自动保存在您的账号中。' : 'Файл распознаётся AI-сервисом. Результаты сохраняются в вашем аккаунте.'}</p></main></AyingShell>;
}
