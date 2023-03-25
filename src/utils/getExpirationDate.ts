import { PaymentMethod } from '@stripe/stripe-js';

export function getExpirationDate(creditCardDetails: PaymentMethod.Card) {
  const expirationMonth =
    creditCardDetails.exp_month <= 9 ? `0${creditCardDetails.exp_month}` : creditCardDetails.exp_month;

  return `${expirationMonth} / ${creditCardDetails.exp_year}`;
}
