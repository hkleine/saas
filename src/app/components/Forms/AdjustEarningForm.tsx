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
	InputGroup,
	InputRightAddon,
	NumberInput,
	NumberInputField,
	Select,
	Stat,
	StatLabel,
	StatNumber,
	VStack,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { VariablesWithValue } from '../Modals';
import { RealTimeItemsContext } from '../Provider/RealTimeItemsProvider';

const { sumSymbol } = preferences.items;

export function AdjustEarningForm({
	earningValue,
	setEarningValue,
}: {
	earningValue: string;
	setEarningValue: Dispatch<SetStateAction<string>>;
}) {
	const [variables, setVariables] = useState<VariablesWithValue>({});

	return (
		<Flex flexDirection="column" gap={8}>
			<FormControl>
				<FormLabel>Umsatz</FormLabel>
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
			</FormControl>
			<ItemSelection
				variables={variables}
				setVariables={setVariables}
				addProductSum={() => setEarningValue(`${Number(earningValue) + Number(variables[sumSymbol].value)}`)}
			/>
		</Flex>
	);
}

function ItemSelection({
	variables,
	setVariables,
	addProductSum,
}: {
	variables: VariablesWithValue;
	setVariables: Dispatch<SetStateAction<VariablesWithValue>>;
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
	console.log(Object.entries(variables));
	return (
		<Container border="1px dashed" borderColor="gray.200" py={2} borderRadius={10}>
			<Flex direction="column" gap={4}>
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
													<Button onClick={addProductSum} isDisabled={values.value === 0} leftIcon={<FiPlus />}>
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
	);
}

function createVariables(selectedItem: Item): Record<string, EquationVariable & { value: number | string }> {
	return Object.entries(selectedItem.variables).reduce((currentVariables, [key, values]) => {
		return { ...currentVariables, [key]: { ...values, value: '0.0' } };
	}, {});
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
