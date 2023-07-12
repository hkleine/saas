'use client';
import { useEquationRegex } from '@/hooks/useEquationRegex';
import { preferences } from '@/preferences';
import { EquationVariable, Item } from '@/types/types';
import { createToastSettings } from '@/utils/createToastSettings';
import { generateNewRandomLetter } from '@/utils/generateNewRandomLetter';
import { getCompanyId } from '@/utils/getCompanyId';
import { createNewItem, updateItem } from '@/utils/supabase-client';
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Button,
	Editable,
	EditableInput,
	EditablePreview,
	Flex,
	FormControl,
	FormLabel,
	IconButton,
	Input,
	ModalFooter,
	Text,
	useToast,
} from '@chakra-ui/react';
import { ChangeEvent, Dispatch, SetStateAction, useContext, useState } from 'react';
import { useForm, UseFormGetValues, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { v4 } from 'uuid';
import FormError from '../Forms/FormError';
import { RealTimeUserContext } from '../Provider/RealTimeUserProvider';
import styles from './itemForm.module.css';

const { defaultEquation, initialVariables, sumSymbol } = preferences.items;

export default function ItemForm({ onClose, item }: { onClose: () => void; item?: Item }) {
	const [variables, setVariables] = useState<Item['variables']>(item?.variables ?? initialVariables);
	const equationRegex = useEquationRegex(variables);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [signupError, setSignupError] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
		getValues,
		setValue,
		watch,
	} = useForm({
		defaultValues: {
			equation: item?.equation ?? defaultEquation,
			name: item?.name ?? '',
		},
		mode: 'onChange',
	});

	const toast = useToast();
	const user = useContext(RealTimeUserContext);

	if (!user) {
		return null;
	}

	const companyId = getCompanyId(user);

	const onSubmit = handleSubmit(async (formData) => {
		setIsSubmitting(true);
		setSignupError(false);
		try {
			if (item) {
				await updateItem({
					...item,
					...formData,
					variables,
				});
			} else {
				await createNewItem({
					id: v4(),
					company_id: companyId,
					created_at: null,
					equation: formData.equation,
					name: formData.name,
					variables,
				});
			}
		} catch (error) {
			console.log(error);
			setSignupError(true);
			setIsSubmitting(false);
			return;
		}
		onClose();
		toast(
			createToastSettings({
				title: `Produkt erfolgreich ${item ? 'bearbeitet' : 'erstellt'}.`,
				status: 'success',
				description: 'Produkt kann nun zur Änderung von Umsätzen genutzt werden.',
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
						<FormControl id="name" isInvalid={'name' in errors} isRequired>
							<FormLabel>Produkt Name</FormLabel>
							<Input
								type="text"
								{...register('name', { required: { value: true, message: 'Produkt name wird benötigt.' } })}
							/>
							{errors.name && <FormError>{errors.name?.message?.toString()}</FormError>}
						</FormControl>

						<VariableEditor
							variables={variables}
							setVariables={setVariables}
							watch={watch}
							getValues={getValues}
							setValue={setValue}
						/>

						<FormControl id="equation" isInvalid={'equation' in errors} isRequired>
							<FormLabel>Formel</FormLabel>
							<Input
								maxLength={40}
								type="text"
								{...register('equation', {
									required: { value: true, message: 'Produkt benötigt eine Formel .' },
									pattern: { value: equationRegex, message: 'Gib eine valide Formel ein.' },
								})}
							/>
							{errors.equation && <FormError>{errors.equation?.message?.toString()}</FormError>}
						</FormControl>

						<ModalFooter>
							{item && (
								<Button isDisabled={isSubmitting} mr={3} variant="ghost" onClick={onClose}>
									Abbruch
								</Button>
							)}
							<Button type="submit" isLoading={isSubmitting} isDisabled={!isDirty}>
								{item ? 'Speichern' : 'Hinzufügen'}
							</Button>
						</ModalFooter>
					</Flex>
				</Flex>
			</form>
		</Flex>
	);
}

function VariableEditor({
	variables,
	setVariables,
	watch,
	getValues,
	setValue,
}: {
	variables: Item['variables'];
	setVariables: Dispatch<SetStateAction<Record<string, EquationVariable>>>;
	watch: UseFormWatch<{
		equation: string;
		name: string;
	}>;
	getValues: UseFormGetValues<{
		equation: string;
		name: string;
	}>;
	setValue: UseFormSetValue<{
		equation: string;
		name: string;
	}>;
}) {
	const removeVariable = (symbol: string) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { [symbol]: _removedProperty, ...variableRest } = variables;
		setVariables(variableRest);
	};

	const addVariable = () => {
		const newSymbol = generateNewRandomLetter(variables);

		setVariables({
			...variables,
			[newSymbol]: {
				name: '',
			},
		});
	};

	const updateVariableName = (event: ChangeEvent<HTMLInputElement>, symbol: string) => {
		const newVariables = { ...variables, [symbol]: { ...variables[symbol], name: event.target.value } };
		setVariables(newVariables);
	};

	return (
		<>
			<Text>
				Variablen <span style={{ color: 'red' }}>*</span>
			</Text>
			{Object.entries(variables)
				.sort(sortSumToStart)
				.map(([symbol, object]) => {
					const isNotDeletable = symbol === sumSymbol || watch('equation').includes(symbol);
					return (
						<Flex key={symbol} direction="row">
							<Editable
								className={styles['symbol-editable']}
								isDisabled={symbol === sumSymbol}
								defaultValue={symbol}
								onSubmit={(val) => {
									if (val === symbol || val === '') return;
									delete Object.assign(variables, { [val]: variables[symbol] })[symbol];
									setVariables(variables);
									const oldEquation = getValues().equation;
									const newEquation = oldEquation.replace(symbol, val);
									setValue('equation', newEquation);
								}}>
								<EditablePreview className={styles['editable-preview']} />
								<Input
									isDisabled={symbol === sumSymbol}
									pattern="[a-z]"
									maxLength={1}
									placeholder="Variablen Symbol"
									type="text"
									required
									as={EditableInput}
								/>
							</Editable>
							<Input
								onChange={(event) => updateVariableName(event, symbol)}
								placeholder="Variablen Name"
								maxLength={32}
								type="text"
								defaultValue={object.name}
								required
							/>
							<IconButton
								isDisabled={isNotDeletable}
								onClick={() => {
									removeVariable(symbol);
								}}
								variant="outline"
								colorScheme="gray"
								aria-label="delete"
								icon={<FiTrash2 />}
							/>
						</Flex>
					);
				})}
			<Button
				onClick={addVariable}
				colorScheme="gray"
				borderStyle="dashed"
				color="gray.500"
				leftIcon={<FiPlus />}
				variant="outline">
				Neue Variable hinzufügen
			</Button>
		</>
	);
}

function sortSumToStart(a: [string, EquationVariable], b: [string, EquationVariable]) {
	if (a[0] === sumSymbol) {
		return -1;
	}

	if (b[0] === sumSymbol) {
		return 1;
	}

	return 0;
}
