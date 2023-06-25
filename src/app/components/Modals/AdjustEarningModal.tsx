import { EquationVariable, Item } from '@/types/types';
import { createToastSettings } from '@/utils/createToastSettings';
import { updateCurrentEarning } from '@/utils/supabase-client';
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Button,
	Container,
	Divider,
	Flex,
	FormLabel,
	Grid,
	GridItem,
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
	Select,
	Stat,
	StatLabel,
	StatNumber,
	useToast,
	VStack,
} from '@chakra-ui/react';
import 'nerdamer/Algebra.js';
import 'nerdamer/Calculus.js';
import nerdamer from 'nerdamer/nerdamer.core.js';
import 'nerdamer/Solve.js';
import { useContext, useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { RealTimeItemsContext } from '../Provider/RealTimeItemsProvider';

const SUM_SYMBOL = 'y';

type VariablesWithValue = Record<string, EquationVariable & { value: number }>;

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
	const [variables, setVariables] = useState<VariablesWithValue>({});
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
		toast(createToastSettings({ title: 'Einnahmen erfolgreich bearbeitet', status: 'success' }));
	}

	return (
		<Modal size="xl" isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Einnahmen bearbeiten</ModalHeader>
				<ModalCloseButton />
				{hasError && (
					<Alert mb="2" rounded={'lg'} status="error">
						<AlertIcon />
						<AlertTitle>Fehler beim bearbeiten!</AlertTitle>
						<AlertDescription>Versuche es später erneut.</AlertDescription>
					</Alert>
				)}
				<ModalBody display="flex" flexDirection="column" gap={8}>
					<InputGroup>
						<NumberInput
							clampValueOnBlur={true}
							precision={2}
							min={0}
							max={10000000}
							w="full"
							value={earningValue}
							onChange={(newValue) => setEarningValue(newValue)}>
							<NumberInputField />
						</NumberInput>
						<InputRightAddon>€</InputRightAddon>
					</InputGroup>
					<ItemSelection
						variables={variables}
						setVariables={setVariables}
						addProductSum={() => setEarningValue(`${Number(earningValue) + variables[SUM_SYMBOL].value}`)}
					/>
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

function ItemSelection({
	variables,
	setVariables,
	addProductSum,
}: {
	variables: VariablesWithValue;
	setVariables: Function;
	addProductSum: (event: any) => void;
}) {
	const items = useContext(RealTimeItemsContext);
	const [selectedItem, setSelectedItem] = useState<Item | undefined>();

	useEffect(() => {
		if (selectedItem) {
			setVariables(createVariables(selectedItem));
		}
	}, [selectedItem]);

	if (!items) {
		return null;
	}
	return (
		<Container border="1px dashed" borderColor="gray.200" py={2} borderRadius={10}>
			<Flex direction="column" gap={4}>
				<div>
					<FormLabel>Produkt</FormLabel>
					<Select
						onChange={(event) => {
							const selecetedItem = items.find((item) => item.id === event.target.value);
							setSelectedItem(selecetedItem);
						}}
						defaultValue="no-item"
						value={selectedItem?.id}>
						<option disabled={true} key={`default-value`} value="no-item">
							Kein Produkt ausgewählt
						</option>
						{items &&
							items.map((item) => (
								<option key={`role-key-${item.id}`} value={item.id}>
									{item.name}
								</option>
							))}
					</Select>
				</div>
				{Object.keys(variables).length !== 0 && (
					<div>
						{Object.entries(variables).map(([key, values]) => {
							return (
								<InputGroup key={key}>
									{key === SUM_SYMBOL ? (
										<VStack w="full">
											<Divider marginTop={4} />
											<Flex justifyContent="space-between" alignItems="center" w="full" gap={10}>
												<Stat flex="unset">
													<StatLabel>{values.name}</StatLabel>
													<StatNumber>{values.value}€</StatNumber>
												</Stat>
												<Button onClick={addProductSum} isDisabled={values.value === 0} leftIcon={<FiPlus />}>
													Addieren
												</Button>
											</Flex>
										</VStack>
									) : (
										<Grid templateColumns="repeat(2, 1fr)" gap={2}>
											<GridItem>
												<FormLabel>{values.name}</FormLabel>
											</GridItem>
											<GridItem>
												<NumberInput
													clampValueOnBlur={true}
													precision={2}
													min={0}
													max={10000000}
													w="full"
													value={values.value}
													onChange={(_, value) => {
														const newVariables = { ...variables, [key]: { ...variables[key], value } };
														const sum = calculateSum({
															variables: newVariables,
															equation: selectedItem?.equation,
														});
														const newVariablesWithSum = {
															...newVariables,
															y: { ...newVariables[SUM_SYMBOL], value: sum },
														};
														setVariables(newVariablesWithSum);
													}}>
													<NumberInputField />
												</NumberInput>
											</GridItem>
										</Grid>
									)}
								</InputGroup>
							);
						})}
					</div>
				)}
			</Flex>
		</Container>
	);
}

function calculateSum({
	variables,
	equation,
}: {
	variables: Record<string, EquationVariable & { value: number }>;
	equation?: string | null;
}) {
	if (!equation) {
		return 0;
	}

	const knownVariables = Object.entries(variables).reduce((currentVariables, [key, values]) => {
		if (key === SUM_SYMBOL) {
			return currentVariables;
		}
		return { ...currentVariables, [key]: `${values.value}` };
	}, {});
	const eq = nerdamer(equation).evaluate(knownVariables);
	const result = eq.solveFor(SUM_SYMBOL);
	return eval(result.toString());
}

function createVariables(selectedItem: Item): Record<string, EquationVariable & { value: number }> {
	return Object.entries(selectedItem.variables).reduce((currentVariables, [key, values]) => {
		return { ...currentVariables, [key]: { ...values, value: 0 } };
	}, {});
}
