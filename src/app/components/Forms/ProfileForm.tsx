'use client';
import { createToastSettings } from '@/utils/createToastSettings';
import { updateAvatarUrl, updateUserName } from '@/utils/supabase-client';
import { Button, Center, FormControl, FormLabel, Input, Stack, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { useGlobalStateContext } from '../Provider/GlobalStoreProvider';
import EditAvatar from './EditAvatar';
import FileUpload from './FileUpload';
import FormError from './FormError';

export default function Profile() {
	const user = useGlobalStateContext((s) => s.user);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const toast = useToast();

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm({ mode: 'onBlur' });

	if (!user) {
		return <LoadingSpinner />;
	}

	const onUpload = async (url: string) => {
		await updateAvatarUrl(user, url);
	};

	const onSubmit = handleSubmit(async (formData) => {
		setIsSubmitting(true);
		const { error, status } = await updateUserName(user.id, formData.name);
		if (error) {
			toast(
				createToastSettings({
					title: 'Profil konnte nicht aktualisiert werden.',
					status: 'error',
					description: 'Etwas ist schief gelaufen, versuche es später erneut.',
				}),
			);
		}

		toast(createToastSettings({ title: 'Profil erfolgreich aktualisiert.', status: 'success' }));

		setIsSubmitting(false);
	});

	return (
		<Stack spacing={4} w={'full'} maxW={'md'} bg="white" rounded={'xl'} boxShadow={'lg'} p={6}>
			<FormControl id="userName">
				<Stack direction={['column', 'row']} spacing={6}>
					<Center>
						<EditAvatar user={user} />
					</Center>
					<Center w="full">
						<FileUpload avatarUrl={user.avatar_url} uid={user.id} onUpload={onUpload}>
							Change Avatar
						</FileUpload>
					</Center>
				</Stack>
			</FormControl>
			<FormControl isInvalid={'email' in errors} isRequired>
				<FormLabel>Email address</FormLabel>
				<Input
					{...register('email', {
						required: { value: true, message: 'Email is required.' },
						pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid E-Mail address.' },
					})}
					defaultValue={user.email ?? ''}
					id="email"
					placeholder="your-email@example.com"
					_placeholder={{ color: 'gray.500' }}
					type="email"
				/>
				{errors.email && <FormError>{errors.email?.message?.toString()}</FormError>}
			</FormControl>
			<FormControl id="name">
				<FormLabel>Full name</FormLabel>
				<Input
					{...register('name')}
					defaultValue={user?.name ?? ''}
					id="email"
					placeholder="John Doe"
					_placeholder={{ color: 'gray.500' }}
					type="text"
				/>
			</FormControl>
			<Button isLoading={isSubmitting} isDisabled={!isDirty} onClick={onSubmit} w="full">
				Save
			</Button>
		</Stack>
	);
}
