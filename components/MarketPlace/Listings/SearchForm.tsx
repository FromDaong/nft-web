import {SearchIcon} from "@heroicons/react/outline";
import {Input} from "@packages/shared/components/Input";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import SweetshopTabs from "@packages/sweetshop/SweetshopTabs";
import {MutedText} from "@packages/shared/components/Typography/Text";

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
					className="flex items-center w-full gap-1 pr-2 rounded-lg"
					css={{
						backgroundColor: "$surfaceOnSurface",
					}}
				>
					<Container className={"flex flex-1 items-center pl-4"}>
						<MutedText>
							<SearchIcon
								width={20}
								height={20}
							/>
						</MutedText>
						<Input
							css={{
								borderRadius: "8px",
								backgroundColor: "transparent",
								border: "none",
							}}
							placeholder={"Search for listings..."}
							onChange={(e) => setSearchText(e.target.value)}
							value={searchText}
							className="p-4 "
						/>
					</Container>

					<Button
						css={{borderRadius: "0.5rem"}}
						type={"submit"}
					>
						Search
					</Button>
				</Container>
			</form>
		</Container>
	);
};

export default SearchForm;
