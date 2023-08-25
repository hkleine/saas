import { Card, IconButton, Text } from '@chakra-ui/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { Id, Task } from './KanbanBoard';

interface Props {
	task: Task;
	deleteTask: (id: Id) => void;
	updateTask: (id: Id, content: string) => void;
}

function TaskCard({ task, deleteTask }: Props) {
	const [mouseIsOver, setMouseIsOver] = useState(false);

	const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
		id: task.id,
		data: {
			type: 'Task',
			task,
		},
	});

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	if (isDragging) {
		return (
			<Card
				ref={setNodeRef}
				style={style}
				p={2.5}
				h={'100px'}
				display="flex"
				alignItems="center"
				textAlign="left"
				borderRadius="lg"
				cursor="grab"
			/>
		);
	}

	return (
		<Card
			position="relative"
			ref={setNodeRef}
			style={style}
			p={2.5}
			h={'100px'}
			display="flex"
			textAlign="left"
			borderRadius="lg"
			cursor="grab"
			{...attributes}
			{...listeners}
			onMouseEnter={() => {
				setMouseIsOver(true);
			}}
			onMouseLeave={() => {
				setMouseIsOver(false);
			}}>
			<Text>{task.content}</Text>

			{mouseIsOver && (
				<IconButton
					onClick={() => {
						deleteTask(task.id);
					}}
					right={2.5}
					variant="ghost"
					position="absolute"
					aria-label="delete"
					icon={<FiX />}
				/>
			)}
		</Card>
	);
}

export default TaskCard;
