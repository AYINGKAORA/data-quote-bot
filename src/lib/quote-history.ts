import { z } from 'zod';
import { quoteSchema, type Quote } from './quote';

export const recordSchema = z.object({ id: z.string(), date: z.string(), filename: z.string(), quote: quoteSchema });
export type QuoteRecord = z.infer<typeof recordSchema>;
export const HISTORY_KEY = 'aying-quote-history';
export const ACTIVE_KEY = 'aying-active-quote';
export function readHistory(value: string | null): QuoteRecord[] {
  try { const parsed = z.array(recordSchema).safeParse(JSON.parse(value || '[]')); return parsed.success ? sortHistory(parsed.data) : []; } catch { return []; }
}
export function sortHistory(records: QuoteRecord[]) { return [...records].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)); }
export function addHistory(records: QuoteRecord[], record: QuoteRecord) { return sortHistory([record, ...records.filter(r => r.id !== record.id)]); }
export function priceWarnings(quote: Quote) {
  return quote.products.flatMap((p, index) => p.quantity !== null && p.unitPrice !== null && p.total !== null && Math.abs(p.quantity * p.unitPrice - p.total) > 0.011 ? [index + 1] : []);
}