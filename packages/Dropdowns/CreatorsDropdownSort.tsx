import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";

const CreatorsDropdownSort = ({setSort, sort, label}) => (
	<Container className="flex gap-4 flex-wrap">
		<Button
			onClick={() => setSort(1)}
			className="flex gap-2 px-4 py-2"
			outlined={Number(sort) !== 1}
			active={Number(sort) === 1}
		>
			A - Z
		</Button>
		<Button
			onClick={() => setSort(2)}
			outlined={Number(sort) !== 2}
			active={Number(sort) === 2}
		>
			Z - A
		</Button>
		<Button
			onClick={() => setSort(3)}
			outlined={Number(sort) !== 3}
			active={Number(sort) === 3}
		>
			Most followers first
		</Button>
		<Button
			onClick={() => setSort(4)}
			outlined={Number(sort) !== 4}
			active={Number(sort) === 4}
		>
			Most NFTs first
		</Button>
	</Container>
);

export default CreatorsDropdownSort;
