import {SearchIcon} from "@heroicons/react/outline";
import {Input} from "@packages/shared/components/Input";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import SweetshopTabs from "@packages/sweetshop/SweetshopTabs";

const SearchForm = ({
	performSearchWithNewParams,
	setSearchText,
	searchText,
}) => {
	return (
		<Container className="flex flex-col overflow-hidden">
			<form
				onSubmit={performSearchWithNewParams}
				className="flex flex-col w-full"
			>
				<Container
					className="flex items-center w-full gap-1 pr-4 rounded-lg"
					css={{
						backgroundColor: "$surfaceOnSurface",
					}}
				>
					<Input
						css={{
							borderRadius: "8px",
							backgroundColor: "transparent",
							border: "none",
						}}
						placeholder={"Search for listings..."}
						onChange={(e) => setSearchText(e.target.value)}
						value={searchText}
						className="flex-1 p-4"
					/>

					<Button
						type={"submit"}
						appearance={"subtle"}
						css={{padding: 0}}
					>
						<SearchIcon
							width={20}
							height={20}
						/>
					</Button>
				</Container>
			</form>
		</Container>
	);
};

export default SearchForm;
