import { EquationVariable } from '@/types/types';
import { createToastSettings } from '@/utils/createToastSettings';
import { updateCurrentEarning } from '@/utils/supabase-client';
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AdjustEarningForm } from '../Forms/AdjustEarningForm';

export const SUM_SYMBOL = 'y';

export type VariablesWithValue = Record<string, EquationVariable & { value: number | string }>;

export function AdjustEarningModal({
	isOpen,
	onClose,
	earning,
	id,
}: {
	isOpen: boolean;
	onClose: () => void;
	earning: { id: string; value: number };
	id: string;
}) {
	const fixedInputEarning = earning.value.toFixed(2);
	const [isDirty, setIsDirty] = useState(false);
	const [earningValue, setEarningValue] = useState(fixedInputEarning);
	const [isUpdating, setIsUpdating] = useState(false);
	const [hasError, setHasError] = useState(false);
	const toast = useToast();

	useEffect(() => {
		setIsDirty(fixedInputEarning !== earningValue);
	}, [earningValue, fixedInputEarning]);

	async function updateEarning() {
		setIsUpdating(true);

		try {
			await updateCurrentEarning({ id, newValue: earningValue });
		} catch (error) {
			console.log(error);
			setHasError(true);
			setIsUpdating(false);
			return;
		}

		setIsUpdating(false);
		onClose();
		toast(createToastSettings({ title: 'Umsatz erfolgreich bearbeitet', status: 'success' }));
	}

	return (
		<Modal size="xl" isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Umsatz bearbeiten</ModalHeader>
				<ModalCloseButton />
				{hasError && (
					<Alert mb="2" rounded={'lg'} status="error">
						<AlertIcon />
						<AlertTitle>Fehler beim bearbeiten!</AlertTitle>
						<AlertDescription>Versuche es später erneut.</AlertDescription>
					</Alert>
				)}
				<ModalBody display="flex" flexDirection="column" gap={8}>
					<AdjustEarningForm earningValue={earningValue} setEarningValue={setEarningValue} />
				</ModalBody>
				<ModalFooter>
					<Button
						autoFocus
						type="submit"
						isDisabled={!isDirty}
						onClick={updateEarning}
						isLoading={isUpdating}
						w="full"
						colorScheme="primary">
						Speichern
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
