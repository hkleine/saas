import {
	ConsultantWithEarnings,
	DealWithItems,
	Item,
	SubscriptionWithPriceAndProduct,
	UserWithEmail,
} from '@/types/types';
import { createStore } from 'zustand';

export interface GlobalStateProps {
	user: UserWithEmail | null;
	consultants: Array<ConsultantWithEarnings>;
	items: Array<Item>;
	subscription: SubscriptionWithPriceAndProduct | null;
	deals: Array<DealWithItems> | null;
}

export interface GlobalState extends GlobalStateProps {
	setConsultants: (consultant: Array<ConsultantWithEarnings>) => void;
	setUser: (user: UserWithEmail | null) => void;
	setItems: (items: Array<Item>) => void;
	setDeals: (deals: Array<DealWithItems>) => void;
}

export type GlobalStateStore = ReturnType<typeof createGlobalStateStore>;

export const createGlobalStateStore = (initProps?: Partial<GlobalStateProps>) => {
	const DEFAULT_PROPS: GlobalStateProps = {
		user: null,
		subscription: null,
		consultants: [],
		items: [],
		deals: [],
	};
	return createStore<GlobalState>()((set) => ({
		...DEFAULT_PROPS,
		...initProps,
		setConsultants: (consultants) => set(() => ({ consultants })),
		setUser: (user) => set(() => ({ user })),
		setItems: (items) => set(() => ({ items })),
		setDeals: (deals) => set(() => ({ deals })),
	}));
};
