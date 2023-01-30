import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {ImportantText} from "@packages/shared/components/Typography/Text";

const NFTSort = ({setSort, sort}) => (
	<>
		<Button
			onClick={() => setSort(1)}
			className="flex gap-2 px-4 py-2"
			appearance={Number(sort) === 1 ? "accent" : "surface"}
		>
			<ImportantText>Lowest price first</ImportantText>
		</Button>
		<Button
			onClick={() => setSort(2)}
			className="flex gap-2 px-4 py-2"
			appearance={Number(sort) === 2 ? "accent" : "surface"}
		>
			<ImportantText>Highest price first</ImportantText>
		</Button>
		<Button
			onClick={() => setSort(3)}
			className="flex gap-2 px-4 py-2"
			appearance={Number(sort) === 3 ? "accent" : "surface"}
		>
			<ImportantText>Newest first</ImportantText>
		</Button>
	</>
);

export default NFTSort;
