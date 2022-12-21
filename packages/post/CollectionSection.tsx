/* eslint-disable no-mixed-spaces-and-tabs */
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import DynamicSkeleton from "@packages/skeleton";
import {CollectionSectionHeading} from "@packages/skeleton/config";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import UserAvatar from "core/auth/components/Avatar";
import TreatCore from "core/TreatCore";
import Link from "next/link";
import {TritPostProps} from "./types";

const getTrendingCreators = async () => {
	const res = await axios.get(`${apiEndpoint}/profile/featured`);
	return res.data.data;
};

export default function TreatOfTheMonthCollectionSection(props: {
	collectionItems: Array<TritPostProps>;
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

	return (
		<Container className="grid grid-cols-1 gap-8 xl:grid-cols-2">
			<Container
				className="flex flex-col h-auto gap-4 p-4 border rounded-xl drop-shadow-sm"
				css={{
					backgroundColor: "$elementSurface",
					borderRadius: "32px",
				}}
			>
				<Container className="grid grid-cols-2 gap-4 lg:grid-cols-3 ">
					{(props.collectionItems && props.collectionItems.length > 0
						? props.collectionItems
						: new Array(6).fill(0)
					)
						.slice(0, 6)
						.map((item, i) => (
							<Container
								key={item.id}
								className={`overflow-hidden h-[140px] md:h-[240px] lg:h-[320px] ${
									i > 3 ? "hidden lg:flex" : "inherit"
								}`}
								css={{
									background: item.image
										? `url('https://treatnfts.gumlet.io/api/v3/image?default=${
												item.image.cdn ?? item.image.ipfs
										  }${item.protected ? "&blur=30" : ""}')`
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
					{props.collectionItems.length > 0 ? (
						<>
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
						</>
					) : (
						<DynamicSkeleton config={CollectionSectionHeading} />
					)}
				</Container>
			</Container>
			<Container
				className="flex flex-col h-auto gap-4 p-4 border rounded-xl drop-shadow-sm"
				css={{
					backgroundColor: "$elementSurface",
					borderRadius: "32px",
				}}
			>
				<Container className="grid grid-cols-2 gap-4 lg:grid-cols-3">
					{(!featuredCreatorLoading && !featuredCreatorError
						? featuredCreator?.nfts
						: new Array(6).fill(0)
					).map((item, i) => (
						<Container
							key={item.id}
							className={`overflow-hidden h-[140px] md:h-[240px] lg:h-[320px] ${
								i > 3 ? "hidden lg:flex" : "inherit"
							}`}
							css={{
								background: item.image
									? `url('https://treatnfts.gumlet.io/api/v3/image?default=${
											item.image.cdn ?? item.image.ipfs
									  }${item.protected ? "&blur=30" : ""}')`
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
					{!featuredCreatorLoading && !featuredCreatorError ? (
						<>
							<Container className="flex">
								<Link href={`/${featuredCreator?.profile[0].username}`}>
									<a>
										<UserAvatar
											value={featuredCreator?.profile[0].username}
											size={32}
										/>
									</a>
								</Link>
							</Container>
							<Heading size="xs">
								{featuredCreator?.profile[0].display_name === ""
									? featuredCreator?.profile[0].username
									: featuredCreator?.profile[0].display_name}
							</Heading>
						</>
					) : (
						<DynamicSkeleton config={CollectionSectionHeading} />
					)}
				</Container>
			</Container>
		</Container>
	);
}
