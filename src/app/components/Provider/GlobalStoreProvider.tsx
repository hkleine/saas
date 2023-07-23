'use client';
import { createGlobalStateStore, GlobalState, GlobalStateProps, GlobalStateStore } from '@/zustand/store';
import { createContext, PropsWithChildren, useContext, useRef } from 'react';
import { useStore } from 'zustand';

type GLobalStoreProviderProps = PropsWithChildren<GlobalStateProps>;

export const GlobalStoreConext = createContext<GlobalStateStore | null>(null);

export function GlobalStoreProvider({ children, ...props }: GLobalStoreProviderProps) {
	const storeRef = useRef<GlobalStateStore>();
	if (!storeRef.current) {
		storeRef.current = createGlobalStateStore(props);
	}
	return <GlobalStoreConext.Provider value={storeRef.current}>{children}</GlobalStoreConext.Provider>;
}

export function useGlobalStateContext<T>(
	selector: (state: GlobalState) => T,
	equalityFn?: (left: T, right: T) => boolean,
): T {
	const store = useContext(GlobalStoreConext);
	if (!store) throw new Error('Missing BearContext.Provider in the tree');
	return useStore(store, selector, equalityFn);
}
