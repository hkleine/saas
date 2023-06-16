import { DatabaseEarnings } from '@/types/types';

interface HomeContainerInterface {
	consultantEarnings: Array<DatabaseEarnings>;
}

export function HomeContainer({ consultantEarnings }: HomeContainerInterface) {
	return (
		<>
			{consultantEarnings.map((earning) => (
				<span key={earning.id}>{earning.value}</span>
			))}
		</>
	);
}
