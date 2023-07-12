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
	name?: string;
	avatar_url?: string;
	billing_address?: Stripe.Address;
	payment_method?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type];
}

export type UserWithEmail = DatabaseUser & { email: string } & {
	consultants: DatabaseConsultant;
	role: Role;
};

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

export type DatabaseConsultant = Database['public']['Tables']['consultants']['Row'];
export type DatabaseUser = Database['public']['Tables']['users']['Row'];
export type DatabaseEarnings = Database['public']['Tables']['earnings']['Row'] & {
	// to be deleted when live version is updated
	item_id: string;
};
export type Role = Database['public']['Tables']['roles']['Row'];
export type DatabaseItem = Database['public']['Tables']['items']['Row'];

export type BaseConsultant = Omit<DatabaseConsultant, 'role'> & {
	role: Role;
	name: string;
	avatar_url?: string | null;
};

export type ConsultantWithEarnings = BaseConsultant & {
	earnings: Array<Omit<DatabaseEarnings, 'consultant_id'>>;
	concealed?: true;
};

export type Roles = Array<Database['public']['Tables']['roles']['Row']>;

export type ConsultantView = 'diagram' | 'table';

export type EquationVariable = {
	name: string;
	min?: number;
	max?: number;
};

export type Item = Omit<DatabaseItem, 'variables'> & { variables: Record<string, EquationVariable> };
