import { preferences } from '@/preferences';
import { EquationVariable, Item } from '@/types/types';
import { calculateSumForEquation } from '@/utils/calculateSumForEquation';
import {
	Button,
	Container,
	Divider,
	Flex,
	FormControl,
	FormLabel,
	Grid,
	GridItem,
	IconButton,
	InputGroup,
	InputRightAddon,
	NumberInput,
	NumberInputField,
	Select,
	Stat,
	StatLabel,
	StatNumber,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	VStack,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { FiPlus, FiTrash } from 'react-icons/fi';
import { VariablesWithValue } from '../Modals';
import { RealTimeItemsContext } from '../Provider/RealTimeItemsProvider';

const { sumSymbol } = preferences.items;

export function AdjustEarningForm({
	earningValue,
	addedItems,
	setAddedItems,
}: {
	earningValue: number;
	addedItems: Array<Item & { value: number }>;
	setAddedItems: Dispatch<SetStateAction<Array<Item & { value: number }>>>;
}) {
	const [variables, setVariables] = useState<VariablesWithValue>({});
	const [formEarningValue, setFormEarningValue] = useState<number>(earningValue);

	useEffect(() => {
		const toBeAddedItemValues = addedItems.reduce((previousNumber, currentAddedItem) => {
			return previousNumber + currentAddedItem.value;
		}, 0);

		setFormEarningValue(earningValue + toBeAddedItemValues);
	}, [addedItems]);
	return (
		<Flex gap={16} flexDirection="row">
			<Flex w="50%" flexDirection="column" gap={8}>
				<FormControl>
					<FormLabel>Umsatz</FormLabel>
					<InputGroup>
						<NumberInput
							clampValueOnBlur={true}
							precision={2}
							min={0}
							max={10000000}
							w="full"
							value={formEarningValue.toFixed(2)}>
							<NumberInputField />
						</NumberInput>
						<InputRightAddon>€</InputRightAddon>
					</InputGroup>
				</FormControl>
				<ItemSelection
					variables={variables}
					setVariables={setVariables}
					onAddProduct={async (item: Item) => {
						setAddedItems([...addedItems, { ...item, value: Number(variables[sumSymbol].value) }]);
						// setEarningValue(`${Number(earningValue) + Number(variables[sumSymbol].value)}`);
					}}
				/>
			</Flex>
			<AddedItems setAddedItems={setAddedItems} addedItems={addedItems} />
		</Flex>
	);
}

function AddedItems({
	addedItems,
	setAddedItems,
}: {
	addedItems: Array<Item & { value: number }>;
	setAddedItems: Dispatch<SetStateAction<Array<Item & { value: number }>>>;
}) {
	return (
		<TableContainer w="50%" overflowY="auto">
			<FormLabel>Hinzugefügte Produkte</FormLabel>
			<Table size="sm" variant="simple">
				<Thead>
					<Tr>
						<Th w="50%">Name</Th>
						<Th isNumeric w="35%">
							Wert
						</Th>
						<Th w="15%"></Th>
					</Tr>
				</Thead>
				<Tbody>
					{addedItems.map((item, index) => {
						return (
							<Tr key={`${item.id}-${index}`}>
								<Td w="50%">{item.name}</Td>
								<Td isNumeric>{item.value}€</Td>
								<Td w="15%">
									<IconButton
										onClick={() => {
											const copiedItems = [...addedItems];
											copiedItems.splice(index, 1);
											setAddedItems(copiedItems);
										}}
										size="lg"
										variant="ghost"
										aria-label="remove product"
										icon={<FiTrash />}
									/>
								</Td>
							</Tr>
						);
					})}
				</Tbody>
			</Table>
		</TableContainer>
	);
}

function ItemSelection({
	variables,
	setVariables,
	onAddProduct,
}: {
	variables: VariablesWithValue;
	setVariables: Dispatch<SetStateAction<VariablesWithValue>>;
	onAddProduct: (event: Item) => void;
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

	const onChangeVariable = (value: string, key: string) => {
		const newVariables = { ...variables, [key]: { ...variables[key], value } };
		const sum = calculateSumForEquation({
			variables: newVariables,
			equation: selectedItem?.equation,
		});
		const newVariablesWithSum = {
			...newVariables,
			y: { ...newVariables[sumSymbol], value: sum },
		};
		setVariables(newVariablesWithSum);
	};

	return (
		<>
			<Select
				onChange={(event) => {
					const selecetedItem = items.find((item) => item.id === event.target.value);
					setSelectedItem(selecetedItem);
				}}
				defaultValue="no-item"
				value={selectedItem?.id}>
				<option disabled={true} key={`default-value`} value="no-item">
					Wähle ein Produkt
				</option>
				{items &&
					items.map((item) => (
						<option key={`role-key-${item.id}`} value={item.id}>
							{item.name}
						</option>
					))}
			</Select>
			<Container border="1px dashed" borderColor="gray.200" py={2} borderRadius={10}>
				<Flex direction="column" gap={4}>
					{Object.keys(variables).length !== 0 && (
						<div>
							{Object.entries(variables)
								.sort(sortSumToEnd)
								.map(([key, values]) => {
									return (
										<InputGroup key={key}>
											{key === sumSymbol ? (
												<VStack w="full">
													<Divider marginTop={4} />
													<Flex justifyContent="space-between" alignItems="center" w="full" gap={10}>
														<Stat flex="unset">
															<StatLabel>{values.name}</StatLabel>
															<StatNumber>{values.value}€</StatNumber>
														</Stat>
														<Button
															onClick={() => {
																onAddProduct(selectedItem!);
																resetVariableValues(variables);
															}}
															isDisabled={Number(variables[sumSymbol].value) === 0}
															leftIcon={<FiPlus />}>
															Addieren
														</Button>
													</Flex>
												</VStack>
											) : (
												<Grid templateColumns="repeat(2, 1fr)" alignItems="center" gap={2}>
													<GridItem>
														<span>{values.name}</span>
													</GridItem>
													<GridItem>
														<NumberInput
															clampValueOnBlur={true}
															precision={2}
															min={0}
															max={10000000}
															w="full"
															value={values.value}
															onChange={(value) => onChangeVariable(value, key)}>
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
		</>
	);
}

function createVariables(selectedItem: Item): Record<string, EquationVariable & { value: number | string }> {
	return Object.entries(selectedItem.variables).reduce((currentVariables, [key, values]) => {
		return { ...currentVariables, [key]: { ...values, value: '0.0' } };
	}, {});
}

function resetVariableValues(variables: VariablesWithValue) {
	Object.keys(variables).forEach((i) => (variables[i as keyof typeof variables].value = '0.0'));
}

function sortSumToEnd(a: [string, EquationVariable], b: [string, EquationVariable]) {
	if (a[0] === sumSymbol) {
		return 1;
	}

	if (b[0] === sumSymbol) {
		return -1;
	}

	return 0;
}
