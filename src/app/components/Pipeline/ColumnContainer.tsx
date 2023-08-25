import { Flex, Text } from '@chakra-ui/react';
import { SortableContext } from '@dnd-kit/sortable';
import { useMemo } from 'react';
import { Column, Id, Task } from './KanbanBoard';
import TaskCard from './TaskCard';

interface Props {
	column: Column;
	deleteColumn: (id: Id) => void;
	updateColumn: (id: Id, title: string) => void;

	createTask: (columnId: Id) => void;
	updateTask: (id: Id, content: string) => void;
	deleteTask: (id: Id) => void;
	tasks: Task[];
}

function ColumnContainer({ column, tasks, deleteTask, updateTask }: Props) {
	const tasksIds = useMemo(() => {
		return tasks.map((task) => task.id);
	}, [tasks]);

	return (
		<Flex position="relative" direction="column" p="4" w="350px" h="full" borderRadius="lg" bg="gray.200">
			{/* Column title */}
			<Text fontSize="lg" fontWeight="bold">
				{column.title}
			</Text>

			{/* Column task container */}
			<Flex flexGrow={1} gap={2} direction="column" overflowX="hidden" overflowY="auto">
				<SortableContext items={tasksIds}>
					{tasks.map((task) => (
						<TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
					))}
				</SortableContext>
			</Flex>
		</Flex>
	);
}

export default ColumnContainer;
