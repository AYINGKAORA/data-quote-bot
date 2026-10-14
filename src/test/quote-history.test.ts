import { describe, expect, it } from 'vitest';
import { addHistory, priceWarnings, readHistory, type QuoteRecord } from '@/lib/quote-history';
import { demoQuote } from '@/lib/quote';
const older: QuoteRecord = { id: 'old', date: '2026-10-13T08:00:00Z', filename: 'old.pdf', quote: demoQuote };
const newer: QuoteRecord = { ...older, id: 'new', date: '2026-10-14T08:00:00Z' };
describe('quote history and verification', () => {
 it('shows records newest first', () => { expect(addHistory([newer], older).map(r => r.id)).toEqual(['new', 'old']); });
 it('preserves saved customer and original quote when reopening', () => { expect(readHistory(JSON.stringify([older]))[0]).toEqual(older); });
 it('does not duplicate a saved record', () => { expect(addHistory([older], older)).toHaveLength(1); });
 it('flags the third row when quantity times price differs from source total', () => {
  const quote = { ...demoQuote, products: demoQuote.products.map((p, i) => i === 2 ? { ...p, total: 4800 } : p) };
  expect(priceWarnings(quote)).toEqual([3]); expect(quote.products[2]?.total).toBe(4800);
 });
 it('does not invent warnings from missing prices', () => { expect(priceWarnings({ ...demoQuote, products: [{ name: 'Missing', specification: '', quantity: 10, unitPrice: null, total: 200 }] })).toEqual([]); });
 it('handles damaged browser history', () => { expect(readHistory('{bad')).toEqual([]); });
});
