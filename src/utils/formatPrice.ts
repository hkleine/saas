import { Price } from '@/types/types';

export function formatPrice(price: Price) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format((price?.unit_amount || 0) / 100);
}
