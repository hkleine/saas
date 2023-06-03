import { ConsultantWithCurrentEarning } from '@/types/types';
import { createToastSettings } from '@/utils/createToastSettings';
import { updateConsultantPercent, updateUserName } from '@/utils/supabase-client';
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightAddon,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	NumberInput,
	NumberInputField,
	useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function UpdateConsultantModal({
	isOpen,
	onClose,
	consultant,
}: {
	isOpen: boolean;
	onClose: () => void;
	consultant: ConsultantWithCurrentEarning;
}) {
	const {
		register,
		handleSubmit,
		formState: { isDirty },
	} = useForm({ mode: 'onBlur' });

	const [isUpdating, setIsUpdating] = useState(false);
	const [hasUpdatingError, setHasUpdatingError] = useState(false);
	const toast = useToast();
	const { id } = consultant;

	const onSubmit = handleSubmit(async (formData) => {
		setIsUpdating(true);
		const results = await Promise.all([
			updateUserName(id, formData.name),
			updateConsultantPercent(id, Number(formData.percent)),
		]);

		if (results.some((result) => result.error !== null)) {
			setHasUpdatingError(true);
			setIsUpdating(false);
			return;
		}

		toast(createToastSettings({ title: 'Berater erfolgreich geupdatet.', status: 'success' }));
		setIsUpdating(false);
		onClose();
	});

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Berater anpassen</ModalHeader>
				<ModalCloseButton />
				{hasUpdatingError && (
					<Alert mb="2" rounded={'lg'} status="error">
						<AlertIcon />
						<AlertTitle>Fehler beim Updaten!</AlertTitle>
						<AlertDescription>Versuche es später erneut.</AlertDescription>
					</Alert>
				)}
				<ModalBody>
					<Flex gap={4} direction="column">
						<FormControl id="name">
							<FormLabel>Name</FormLabel>
							<Input
								{...register('name')}
								defaultValue={consultant.name ?? ''}
								id="name"
								placeholder="John Doe"
								_placeholder={{ color: 'gray.500' }}
								type="text"
							/>
						</FormControl>

						<FormControl id="percent">
							<FormLabel>Umsatzbeteiligung</FormLabel>
							<InputGroup>
								<NumberInput
									width="full"
									keepWithinRange
									defaultValue={consultant.percent}
									max={100}
									min={0}
									precision={2}>
									<NumberInputField {...register('percent')} />
								</NumberInput>
								<InputRightAddon>%</InputRightAddon>
							</InputGroup>
						</FormControl>
					</Flex>
				</ModalBody>

				<ModalFooter>
					<Button colorScheme="blue.300" isLoading={isUpdating} mr={3} variant="ghost" onClick={onClose}>
						Abbruch
					</Button>
					<Button colorScheme="blue.300" isLoading={isUpdating} onClick={onSubmit} isDisabled={!isDirty}>
						Speichern
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
