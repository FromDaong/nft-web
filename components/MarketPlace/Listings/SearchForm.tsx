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
		<Container className="flex flex-col p-4">
			<form
				onSubmit={performSearchWithNewParams}
				className="flex flex-col w-full"
			>
				<Container
					className="flex items-center w-full gap-1 px-2 py-1 rounded-lg shadow"
					css={{
						backgroundColor: "$surfaceOnSurface",
						border: "1px solid $border",
					}}
				>
					<Input
						css={{
							padding: "8px 12px",
							borderRadius: "8px",
							backgroundColor: "transparent",
							border: "none",
						}}
						placeholder={"Start typing to search for NFTs"}
						onChange={(e) => setSearchText(e.target.value)}
						value={searchText}
						className="flex-1"
					/>

					<Button
						type={"submit"}
						appearance={"subtle"}
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
