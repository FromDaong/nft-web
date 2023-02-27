import {Container} from "@packages/shared/components/Container";
import Spinner from "@packages/shared/icons/Spinner";

export const PostMediaContent = (props: {
	caption: string;
	isProtected?: boolean;
	_id: string;
}) => {
	return (
		<Container className="w-full h-full flex flex-col bg-zinc-900 absolute top-0 left-0">
			<img
				alt={props.caption}
				src={`/api/v3/image/nft/${props._id}/${
					props.isProtected ? "blur" : "thumbnail"
				}`}
				className="rounded-xl w-full h-full object-cover absolute top-0 left-0"
				style={{
					zIndex: 2,
				}}
			/>
			<Container
				className="w-full relative h-full flex items-center justify-center"
				style={{
					zIndex: 1,
				}}
			>
				<Spinner color={"$white"} />
			</Container>
		</Container>
	);
};
