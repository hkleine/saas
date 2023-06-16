'use client';
import { Roles } from '@/types/types';
import { createToastSettings } from '@/utils/createToastSettings';
import { getCompanyId } from '@/utils/getCompanyId';
import { postData } from '@/utils/helpers';
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Button,
	Divider,
	Flex,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightAddon,
	NumberInput,
	NumberInputField,
	Select,
	useToast
} from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormError from '../Forms/FormError';
import { RealTimeCompanyConsultantsContext } from '../Provider/RealTimeCompanyConsultantsProvider';
import { RealTimeUserContext } from '../Provider/RealTimeUserProvider';

export default function ConsultantForm({
	roles,
	onClose,
	uplineId,
}: {
	roles: Roles;
	onClose: () => void;
	uplineId?: string;
}) {
	const consultants = useContext(RealTimeCompanyConsultantsContext);
	const DEFAULT_ROLE = 3;
	const potentialUplines = consultants?.filter((consultant) => consultant.role.id < DEFAULT_ROLE) ?? []

	const [isSubmitting, setIsSubmitting] = useState(false);

	const [signupError, setSignupError] = useState(false);
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({
		mode: 'onBlur',
	});

	const toast = useToast();
	const user = useContext(RealTimeUserContext);

	if (!user) {
		return null;
	}

	const companyId = getCompanyId(user);

	const onSubmit = handleSubmit(async (formData) => {
		console.log('submit');
		setIsSubmitting(true);
		setSignupError(false);

		try {
			await postData({
				url: '/api/create-user',
				data: {
					email: formData.email,
					password: formData.password,
					user_metadata: {
						name: formData.name,
						role: formData.role,
						percent: formData.percent,
						upline: formData.upline || companyId,
						company_id: companyId,
					},
				},
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
				title: 'Berater erfolgreich erstellt.',
				status: 'success',
				description: 'Die E-Mail Adresse des Beraters muss noch bestätigt werden.',
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
				<Flex gap={12}>
					<Flex direction="column" gap={4} w="full">
						<FormControl id="email" isInvalid={'email' in errors} isRequired>
							<FormLabel>E-Mail Adresse</FormLabel>
							<Input
								type="email"
								{...register('email', {
									required: { value: true, message: 'Email is required.' },
									pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid E-Mail address.' },
								})}
							/>
							{errors.email && <FormError>{errors.email?.message?.toString()}</FormError>}
						</FormControl>
						<FormControl id="name" isInvalid={'name' in errors} isRequired>
							<FormLabel>Berater Name</FormLabel>
							<Input
								type="text"
								{...register('name', { required: { value: true, message: 'Berater name wird benötigt.' } })}
							/>
							{errors.name && <FormError>{errors.name?.message?.toString()}</FormError>}
						</FormControl>
						<FormControl id="password" isInvalid={'password' in errors} isRequired>
							<FormLabel>Passwort</FormLabel>
							<Input
								type="password"
								{...register('password', {
									required: { value: true, message: 'Password is required.' },
									minLength: { value: 8, message: 'Password must consist of at least 8 characters.' },
								})}
							/>
							{errors.password && <FormError>{errors.password?.message?.toString()}</FormError>}
						</FormControl>
						<FormControl id="confirmPassword" isInvalid={'confirmPassword' in errors} isRequired>
							<FormLabel>Passwort wiederholen</FormLabel>
							<Input
								type="password"
								{...register('confirmPassword', {
									required: { value: true, message: 'Confirmed password is required.' },
									validate: (val: string) => {
										if (watch('password') != val) {
											return 'Your passwords do not match.';
										}
									},
								})}
							/>
							{errors.confirmPassword && <FormError>{errors.confirmPassword?.message?.toString()}</FormError>}
						</FormControl>
					</Flex>
					<Divider orientation="vertical" h="350px" />
					<Flex direction="column" gap={4} w="full">
						<FormControl id="percent">
							<FormLabel>Umsatzbeteiligung</FormLabel>
							<InputGroup>
								<NumberInput keepWithinRange defaultValue={0} max={100} min={0} precision={2}>
									<NumberInputField {...register('percent')} />
								</NumberInput>
								<InputRightAddon>%</InputRightAddon>
							</InputGroup>
						</FormControl>

						<FormControl id="role">
							<FormLabel>Rolle</FormLabel>
							<Select defaultValue={DEFAULT_ROLE} {...register('role')}>
								{roles &&
									roles.map((role) => (
										<option key={`role-key-${role.id}`} value={role.id}>
											{role.name}
										</option>
									))}
							</Select>
						</FormControl>
						<FormControl id="upline" isRequired>
							<FormLabel>Upline</FormLabel>
							<Select
								defaultValue={uplineId}
								// disabled={!!uplineId}
								placeholder="Wähle eine Upline aus"
								{...register('upline', {
									required: { value: true, message: 'Diese Rolle braucht eine Upline' },
								})}>
								{potentialUplines.map((upline) => (
									<option key={`upline-key-${upline.id}`} value={upline.id}>
										{upline.name}
									</option>
								))}
							</Select>
							{errors.upline && <FormError>{errors.upline?.message?.toString()}</FormError>}
						</FormControl>

						<Button type="submit" w="full" isLoading={isSubmitting}>
							Hinzufügen
						</Button>
					</Flex>
				</Flex>
			</form>
		</Flex>
	);
}
