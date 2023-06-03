import { noop } from 'lodash';
import React, { createContext, ReactNode, useState } from 'react';

export const ConsultantMenuContext = createContext<{
	closeMenuCallback: typeof noop;
	setCloseMenuCallback: React.Dispatch<React.SetStateAction<(event: any) => void>>;
}>({
	closeMenuCallback: noop,
	setCloseMenuCallback: () => {},
});

export const ConsultantMenuProvider = ({ children }: { children: ReactNode }) => {
	const intialFunction = noop;
	const [closeMenuCallback, setCloseMenuCallback] = useState<(event: any) => void>(intialFunction);

	const value = {
		closeMenuCallback,
		setCloseMenuCallback,
	};

	return <ConsultantMenuContext.Provider value={value}>{children}</ConsultantMenuContext.Provider>;
};
