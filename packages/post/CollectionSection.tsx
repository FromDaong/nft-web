/* eslint-disable no-mixed-spaces-and-tabs */
import {ArrowRightIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import UserAvatar from "core/auth/components/Avatar";
import TreatCore from "core/TreatCore";
import Link from "next/link";
import {TPost} from "./types";

const getTrendingCreators = async () => {
	const res = await axios.get(`${apiEndpoint}/profile/featured`);
	return res.data.data;
};

export default function TreatOfTheMonthCollectionSection(props: {
	collectionItems: Array<TPost>;
	title: string;
	author: Array<{
		username: string;
		display_name: string;
	}>;
}) {
	const {
		isLoading: featuredCreatorLoading,
		error: featuredCreatorError,
		data: featuredCreator,
	} = TreatCore.useQuery({
		queryKey: ["featuredCreator"],
		queryFn: getTrendingCreators,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchOnMount: false,
	});

	console.log({featuredCreator});

	return (
		<Container className="grid grid-cols-1 gap-8 lg:grid-cols-2">
			<Container
				className="flex flex-col h-auto gap-4 p-4 border-2 rounded-xl drop-shadow"
				css={{
					backgroundColor: "$elementSurface",
					borderColor: "$accentBorder",
				}}
			>
				<Container className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ">
					{props.collectionItems.slice(0, 6).map((item, i) => (
						<Container
							key={item.id}
							className={`overflow-hidden ${
								i > 3 ? "hidden lg:flex" : "inherit"
							}`}
							css={{
								height: "220px",
								background: item.image
									? `url('https://treatnfts.gumlet.io/api/v3/image?default=${
											item.image.cdn ?? item.image.ipfs
									  }')`
									: "$surfaceOnSurface",
								backgroundColor: "$surfaceOnSurface",
								backgroundSize: "cover",
								backgroundPosition: "center",
								borderRadius: "16px",
							}}
						/>
					))}
				</Container>
				<Container className="flex items-center gap-2">
					<Container className="flex">
						<Link href={`/${props.author[0]?.username}`}>
							<a>
								<UserAvatar
									value={props.author[0]?.username}
									size={32}
								/>
							</a>
						</Link>
					</Container>
					<Heading size="xs">{props.title}</Heading>
				</Container>
			</Container>
			<Container
				className="flex flex-col h-auto gap-4 p-4 rounded-xl drop-shadow"
				css={{
					backgroundColor: "$elementSurface",
					borderColor: "$accentBorder",
				}}
			>
				<Container className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{(!featuredCreatorLoading && !featuredCreatorError
						? featuredCreator?.nfts
						: new Array(6).fill(0)
					).map((item, i) => (
						<Container
							key={item.id}
							className={`overflow-hidden ${
								i > 3 ? "hidden lg:flex" : "inherit"
							}`}
							css={{
								height: "220px",
								background: item.image
									? `url('https://treatnfts.gumlet.io/api/v3/image?default=${
											item.image.cdn ?? item.image.ipfs
									  }')`
									: "$surfaceOnSurface",
								backgroundColor: "$surfaceOnSurface",
								backgroundSize: "cover",
								backgroundPosition: "center",
								borderRadius: "16px",
							}}
						/>
					))}
				</Container>
				<Container className="flex items-center gap-2">
					<Container className="flex">
						<Link href={`/devan`}>
							<a>
								<UserAvatar
									value={"devan"}
									size={32}
								/>
							</a>
						</Link>
					</Container>
					{featuredCreatorLoading ? (
						<Container
							css={{
								width: "50%",
								borderRadius: "8px",
								backgroundColor: "$surfaceOnSurface",
								height: "24px",
							}}
						></Container>
					) : (
						<Heading size="xs">
							{featuredCreator?.profile[0].display_name}
						</Heading>
					)}
				</Container>
			</Container>
		</Container>
	);
}
