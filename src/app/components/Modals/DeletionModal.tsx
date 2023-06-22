import { createToastSettings } from '@/utils/createToastSettings';
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

export function DeletionModal({
	isOpen,
	onClose,
	deleteCallback,
	title,
	successMessage,
	description,
}: {
	isOpen: boolean;
	onClose: () => void;
	deleteCallback: () => void;
	title: string;
	successMessage: string;
	description: string;
}) {
	const [isDeleting, setIsDeleting] = useState(false);
	const [hasDeletionError, setHasDeletionError] = useState(false);
	const toast = useToast();

	async function onDelete() {
		setHasDeletionError(false);
		setIsDeleting(true);

		try {
			await deleteCallback();
		} catch (error) {
			console.log(error);
			setHasDeletionError(true);
			setIsDeleting(false);
			return;
		}

		toast(createToastSettings({ title: successMessage, status: 'success' }));

		setIsDeleting(false);
		onClose();
	}
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{title}</ModalHeader>
				<ModalCloseButton />
				{hasDeletionError && (
					<Alert mb="2" rounded={'lg'} status="error">
						<AlertIcon />
						<AlertTitle>Fehler beim Löschen!</AlertTitle>
						<AlertDescription>Versuche es später erneut.</AlertDescription>
					</Alert>
				)}
				<ModalBody>{description}</ModalBody>

				<ModalFooter>
					<Button isLoading={isDeleting} mr={3} variant="ghost" onClick={onClose}>
						Abbruch
					</Button>
					<Button isLoading={isDeleting} onClick={onDelete} colorScheme="red">
						Löschen
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
