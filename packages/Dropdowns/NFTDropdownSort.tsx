import {Button} from "@packages/shared/components/Button";
import {ImportantText} from "@packages/shared/components/Typography/Text";

const NFTSort = ({setSort, sort}) => (
	<>
		<Button
			onClick={() => setSort(3)}
			className="flex gap-2 px-4 py-2"
			outlined={Number(sort) !== 3}
			active={Number(sort) === 3}
		>
			<ImportantText>Newest first</ImportantText>
		</Button>
		<Button
			onClick={() => setSort(1)}
			className="flex gap-2 px-4 py-2"
			outlined={Number(sort) !== 1}
			active={Number(sort) === 1}
		>
			<ImportantText>Lowest price first</ImportantText>
		</Button>
		<Button
			onClick={() => setSort(2)}
			className="flex gap-2 px-4 py-2"
			outlined={Number(sort) !== 2}
			active={Number(sort) === 2}
		>
			<ImportantText>Highest price first</ImportantText>
		</Button>
	</>
);

export default NFTSort;
