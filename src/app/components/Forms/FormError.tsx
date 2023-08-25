import { FormErrorMessage } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

export default function FormError({ children }: PropsWithChildren) {
	return (
		<FormErrorMessage rounded={'md'} w="full" background="red.100" px="2" py="1">
			{children}
		</FormErrorMessage>
	);
}
