import { describe, expect, it } from 'vitest';
import { quoteSchema, validateUpload } from '@/lib/quote';

describe('quote processing', () => {
  it('accepts images and PDF', () => {
    for (const type of ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']) expect(validateUpload({ type, size: 2048 })).toBeNull();
    expect(validateUpload({ type: 'text/plain', size: 2048 })).toBe('type');
  });
  it('preserves missing values and original totals', () => {
    const quote = quoteSchema.parse({ company: 'Example', currency: 'USD', products: [{ name: 'Bottle', specification: '500ml', quantity: 20, unitPrice: 12.5, total: 250 }, { name: 'Unknown price', specification: '', quantity: null, unitPrice: null, total: null }], notes: [] });
    expect(quote.products[0].total).toBe(250);
    expect(quote.products[1].unitPrice).toBeNull();
  });
});