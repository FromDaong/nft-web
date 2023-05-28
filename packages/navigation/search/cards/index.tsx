import {Container} from "@packages/shared/components/Container";

export const SearchCard = ({children}) => {
	return (
		<Container className="flex gap-4 p-4 rounded-lg hover:bg-zinc-100 focus:bg-zinc-100">
			{children}
		</Container>
	);
};
