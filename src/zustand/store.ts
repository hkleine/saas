import { ConsultantWithEarnings, Item, SubscriptionWithPriceAndProduct, UserWithEmail } from '@/types/types';
import { createStore } from 'zustand';

export interface GlobalStateProps {
	user: UserWithEmail | null;
	consultants: Array<ConsultantWithEarnings>;
	items: Array<Item>;
	subscription: SubscriptionWithPriceAndProduct | null;
}

export interface GlobalState extends GlobalStateProps {
	setConsultants: (consultant: Array<ConsultantWithEarnings>) => void;
	setUser: (user: UserWithEmail | null) => void;
	setItems: (items: Array<Item>) => void;
}

export type GlobalStateStore = ReturnType<typeof createGlobalStateStore>;

export const createGlobalStateStore = (initProps?: Partial<GlobalStateProps>) => {
	const DEFAULT_PROPS: GlobalStateProps = {
		user: null,
		subscription: null,
		consultants: [],
		items: [],
	};
	return createStore<GlobalState>()((set, get) => ({
		...DEFAULT_PROPS,
		...initProps,
		setConsultants: (consultants) => set(() => ({ consultants })),
		setUser: (user) => set(() => ({ user })),
		setItems: (items) => set(() => ({ items })),
	}));
};
