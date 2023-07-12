import { ConsultantWithEarnings, EquationVariable, Item } from '@/types/types';
import { createToastSettings } from '@/utils/createToastSettings';
import { getCurrentAndPreviousMonth } from '@/utils/getCurrentAndPrviousMonth';
import { getCertainMonthRevenue } from '@/utils/getCurrentEarningFromConsultant';
import { createEarning } from '@/utils/supabase-client';
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
import { useState } from 'react';
import { AdjustEarningForm } from '../Forms/AdjustEarningForm';

export type VariablesWithValue = Record<string, EquationVariable & { value: number | string }>;

export function AdjustEarningModal({
	isOpen,
	onClose,
	consultant,
}: {
	isOpen: boolean;
	onClose: () => void;
	consultant: ConsultantWithEarnings;
}) {
	const { currentDate } = getCurrentAndPreviousMonth();
	const currentEarning = getCertainMonthRevenue({ consultant, date: currentDate });

	const [isUpdating, setIsUpdating] = useState(false);
	const [addedItems, setAddedItems] = useState<Array<Item & { value: number }>>([]);
	const [hasError, setHasError] = useState(false);
	const toast = useToast();

	async function updateEarning() {
		setIsUpdating(true);

		try {
			const promises = addedItems.map((item) => {
				return createEarning({
					value: Number(item.value),
					item_id: item.id,
					consultant_id: consultant.id,
				});
			});
			await Promise.all(promises);
		} catch (error) {
			console.log(error);
			setHasError(true);
			setIsUpdating(false);
			return;
		}
		setAddedItems([]);
		setIsUpdating(false);
		onClose();
		toast(createToastSettings({ title: 'Umsatz erfolgreich bearbeitet', status: 'success' }));
	}

	return (
		<Modal size="3xl" isOpen={isOpen} onClose={onClose}>
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
					<AdjustEarningForm addedItems={addedItems} setAddedItems={setAddedItems} earningValue={currentEarning} />
				</ModalBody>
				<ModalFooter>
					<Button
						autoFocus
						type="submit"
						isDisabled={addedItems.length === 0}
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
