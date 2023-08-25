import React, { CSSProperties, Dispatch, useEffect } from 'react';

import {
	Box,
	Button,
	Flex,
	Heading,
	Input,
	InputGroup,
	InputLeftElement,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	Row,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';

export function CustomTable<TData>({
	data,
	columns,
	title,
	getRowStyles,
}: {
	title?: string;
	data: Array<TData>;
	columns: Array<ColumnDef<TData, any>>;
	getRowStyles?: (row: Row<TData>) => CSSProperties;
}) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = React.useState('');
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		debugTable: true,
		state: {
			sorting,
			globalFilter,
		},
		onGlobalFilterChange: setGlobalFilter,
		onSortingChange: setSorting,
		initialState: {
			pagination: {
				pageSize: 8,
			},
		},
		autoResetPageIndex: false,
		defaultColumn: {
			minSize: 0,
			size: Number.MAX_SAFE_INTEGER,
			maxSize: Number.MAX_SAFE_INTEGER,
		},
	});

	return (
		<Box>
			<Flex p={4} justifyContent="space-between" alignItems="center">
				<Heading size="md">{title}</Heading>
				<GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
			</Flex>
			<Table>
				<Thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<Tr bg="purple.50" key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<Th
										key={header.id}
										colSpan={header.colSpan}
										style={{ width: header.getSize() === Number.MAX_SAFE_INTEGER ? 'auto' : header.getSize() }}>
										{header.isPlaceholder ? null : (
											<Flex gap={2} alignItems="center">
												{flexRender(header.column.columnDef.header, header.getContext())}
												{header.column.getCanSort() ? (
													<Box
														cursor="pointer"
														{...{
															className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
															onClick: header.column.getToggleSortingHandler(),
														}}>
														{{
															asc: <FiChevronUp />,
															desc: <FiChevronDown />,
														}[header.column.getIsSorted() as string] ?? (
															<Flex>
																<FiChevronUp />
																<FiChevronDown />
															</Flex>
														)}
													</Box>
												) : null}
											</Flex>
										)}
									</Th>
								);
							})}
						</Tr>
					))}
				</Thead>
				<Tbody>
					{table.getRowModel().rows.map((row) => {
						return (
							<Tr style={getRowStyles && getRowStyles(row)} key={row.id}>
								{row.getVisibleCells().map((cell) => {
									return (
										<Td
											style={{
												width: cell.column.getSize() === Number.MAX_SAFE_INTEGER ? 'auto' : cell.column.getSize(),
											}}
											key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</Td>
									);
								})}
							</Tr>
						);
					})}
				</Tbody>
			</Table>
			<Flex justifyContent="end" p={4} alignItems="center" gap={6}>
				{/* <button
					className="border rounded p-1"
					onClick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}>
					{'<<'}
				</button> */}
				<Button
					isDisabled={table.getState().pagination.pageIndex === 0}
					variant="outline"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}>
					{'<'}
				</Button>
				<Button
					isDisabled={table.getPageCount() == table.getState().pagination.pageIndex + 1}
					variant="outline"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}>
					{'>'}
				</Button>
				<Text>
					Seite {table.getState().pagination.pageIndex + 1} von {table.getPageCount()}
				</Text>

				{/* <select
					value={table.getState().pagination.pageSize}
					onChange={(e) => {
						table.setPageSize(Number(e.target.value));
					}}>
					{[10, 20, 30, 40, 50].map((pageSize) => (
						<option key={pageSize} value={pageSize}>
							Show {pageSize}
						</option>
					))}
				</select> */}
			</Flex>
		</Box>
	);
}

function GlobalFilter({
	filter,
	setFilter,
	debounce = 500,
}: {
	debounce?: number;
	filter: string;
	setFilter: Dispatch<React.SetStateAction<string>>;
}) {
	const [value, setValue] = React.useState(filter);

	useEffect(() => {
		setValue(filter);
	}, [filter]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setFilter(value);
		}, debounce);

		return () => clearTimeout(timeout);
	}, [value]);

	return (
		<InputGroup width="unset">
			<InputLeftElement pointerEvents="none">
				<FiSearch style={{ color: 'var(--chakra-colors-gray-400)' }} />
			</InputLeftElement>
			<Input
				maxW="400px"
				placeholder="Durchsuche die Tabelle"
				value={filter || ''}
				onChange={(e) => setFilter(e.target.value)}
			/>
		</InputGroup>
	);
}
