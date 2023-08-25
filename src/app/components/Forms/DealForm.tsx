'use client';
import { createToastSettings } from '@/utils/createToastSettings';
import { createDeal } from '@/utils/supabase-client';
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
	Textarea,
	useToast,
} from '@chakra-ui/react';
import { MultiSelect, Option } from 'chakra-multiselect';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 } from 'uuid';
import FormError from '../Forms/FormError';
import { useGlobalStateContext } from '../Provider/GlobalStoreProvider';

export default function DealForm({ onClose }: { onClose: () => void }) {
	const itemOptions: Array<Option> = useGlobalStateContext((s) => s.items).map((item) => {
		return { label: item.name ?? '', value: item.id };
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedItems, setSelectedItems] = useState<Array<Option>>([]);

	const [signupError, setSignupError] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: 'onBlur',
	});

	const toast = useToast();
	const user = useGlobalStateContext((s) => s.user);

	if (!user) {
		return null;
	}

	const onSubmit = handleSubmit(async (formData) => {
		setIsSubmitting(true);
		setSignupError(false);

		try {
			await createDeal({
				deal: {
					id: v4(),
					consultant_id: user.id,
					name: formData.name,
					description: formData.description,
					status: 'Unassigned',
				},
				items: selectedItems.map((item) => item.value),
			});
		} catch (error) {
			console.log(error);
			setSignupError(true);
			setIsSubmitting(false);
			return;
		}
		onClose();
		toast(
			createToastSettings({
				title: 'Deal erfolgreich erstellt.',
				status: 'success',
				description: 'Der Deal startet in der Unassigned Spalte.',
			}),
		);

		setIsSubmitting(false);
	});

	return (
		<Flex direction="column">
			{signupError && (
				<Alert mb="2" rounded={'lg'} status="error">
					<AlertIcon />
					<AlertTitle>Fehler beim Hinzufügen!</AlertTitle>
					<AlertDescription>Versuche es später erneut.</AlertDescription>
				</Alert>
			)}
			<form onSubmit={onSubmit}>
				<Flex gap={6} direction="column">
					<FormControl id="name" isInvalid={'name' in errors} isRequired>
						<FormLabel>Deal Name</FormLabel>
						<Input
							type="text"
							{...register('name', { required: { value: true, message: 'Deal name wird benötigt.' } })}
						/>
						{errors.name && <FormError>{errors.name?.message?.toString()}</FormError>}
					</FormControl>

					<FormControl id="description">
						<FormLabel>Kundendaten</FormLabel>
						<Textarea {...register('description')} />
					</FormControl>

					<FormControl>
						<FormLabel>Angebotene Produkte</FormLabel>
						<MultiSelect options={itemOptions} value={selectedItems} onChange={setSelectedItems as any} />
					</FormControl>

					<Button type="submit" w="full" isLoading={isSubmitting}>
						Hinzufügen
					</Button>
				</Flex>
			</form>
		</Flex>
	);
}
