import { z } from 'zod';

export const quoteSchema = z.object({
  company: z.string(),
  currency: z.string(),
  products: z.array(z.object({ name: z.string(), specification: z.string(), quantity: z.number().nullable(), unitPrice: z.number().nullable(), total: z.number().nullable() })),
  notes: z.array(z.string()),
});
export type Quote = z.infer<typeof quoteSchema>;
export const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
export function validateUpload(file: { size: number; type: string }) {
  if (!supportedTypes.includes(file.type)) return 'type';
  if (file.size === 0 || file.size > 20 * 1024 * 1024) return 'size';
  return null;
}
export const demoQuote: Quote = {
  company: 'ООО «Восток Трейд»', currency: 'CNY',
  products: [
    { name: '不锈钢保温杯', specification: '500ml · 304不锈钢', quantity: 200, unitPrice: 28.5, total: 5700 },
    { name: '便携式电动咖啡磨豆机', specification: 'USB充电 · 黑色', quantity: 100, unitPrice: 86, total: 8600 },
    { name: '双层玻璃咖啡杯', specification: '350ml · 透明', quantity: 300, unitPrice: 15.8, total: 4740 },
  ],
  notes: ['报价币种为人民币（CNY），价格含税。', '交货期：确认订单后 15–20 个工作日。', '付款方式：30% 预付款，70% 发货前支付。'],
};