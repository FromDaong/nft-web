import {Container} from "@packages/shared/components/Container";
import Spinner from "@packages/shared/icons/Spinner";
import Link from "next/link";

export const MediaContainer = (props: {
	caption: string;
	isProtected?: boolean;
	_id: string;
}) => {
	return (
		<Link href={`/post/nft/${props._id}`}>
			<a className="relative flex flex-col w-full h-full bg-zinc-900">
				<img
					alt={props.caption}
					src={`/api/v3/image/nft/${props._id}/${
						props.isProtected ? "blur" : "thumbnail"
					}`}
					className="absolute top-0 left-0 object-cover w-full h-full"
					style={{
						zIndex: 2,
					}}
				/>
				<Container
					className="relative flex items-center justify-center w-full h-full"
					style={{
						zIndex: 1,
					}}
				>
					<Spinner color={"$white"} />
				</Container>
			</a>
		</Link>
	);
};
