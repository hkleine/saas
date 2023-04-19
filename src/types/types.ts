import { User } from '@supabase/auth-helpers-nextjs';
import Stripe from 'stripe';
import { Database } from './supabase';
export interface PageMeta {
  title: string;
  description: string;
  cardImage: string;
}

export interface Customer {
  id: string /* primary key */;
  stripe_customer_id?: string;
}

export interface Product {
  id: string /* primary key */;
  active?: boolean;
  name?: string;
  description?: string;
  image?: string;
  metadata?: Stripe.Metadata;
}

export interface ProductWithPrice extends Product {
  prices?: Price[];
}

interface PriceWithProduct extends Price {
  products: Product;
}

export interface SubscriptionWithPriceAndProduct extends Subscription {
  prices: PriceWithProduct;
}

export interface UserDetails {
  id: string /* primary key */;
  full_name?: string;
  avatar_url?: string;
  billing_address?: Stripe.Address;
  payment_method?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type];
}

export type UserWithEmail = UserDetails & { email: User['email'] };

export interface Price {
  id: string /* primary key */;
  product_id?: string /* foreign key to products.id */;
  active?: boolean;
  description?: string;
  unit_amount?: number;
  currency?: string;
  type?: Stripe.Price.Type;
  interval?: Stripe.Price.Recurring.Interval;
  interval_count?: number;
  trial_period_days?: number | null;
  metadata?: Stripe.Metadata;
  products?: Product;
}

export interface Subscription {
  id: string /* primary key */;
  user_id: string;
  status?: Stripe.Subscription.Status;
  metadata?: Stripe.Metadata;
  price_id?: string /* foreign key to prices.id */;
  quantity?: number;
  cancel_at_period_end?: boolean;
  created: string;
  current_period_start: string;
  current_period_end: string;
  ended_at?: string;
  cancel_at?: string;
  canceled_at?: string;
  trial_start?: string;
  trial_end?: string;
  prices?: Price;
}

export type BaseConsultant = Omit<Database['public']['Tables']['consultants']['Row'], 'upline' | 'role'> & {
  role: { name: string };
};

export type Azubi = BaseConsultant & {
  upline: string;
};

export type Ausbilder = BaseConsultant & {
  downlines: Array<Azubi>;
  downlineEarnings: number;
  upline: string;
};

export type Overhead = BaseConsultant & {
  downlineEarnings: number;
  downlines: Array<Ausbilder>;
};

export type Consultant = Overhead | Ausbilder | Azubi;

export type Roles = Array<Database['public']['Tables']['roles']['Row']>;
