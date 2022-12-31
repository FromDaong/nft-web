/* eslint-disable no-mixed-spaces-and-tabs */
import {ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
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
	const {data: featuredCreator} = TreatCore.useQuery({
		queryKey: ["featuredCreator"],
		queryFn: getTrendingCreators,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchOnMount: false,
	});

	return (
		<Container className="grid grid-cols-1 gap-8 xl:grid-cols-2">
			{
				<PreviewCollection
					collectionItems={props.collectionItems}
					title={props.title}
					author={props.author[0]}
				/>
			}
			{
				<PreviewCollection
					collectionItems={featuredCreator?.nfts ?? []}
					title="Featured Creator"
					author={featuredCreator?.profile[0] ?? {}}
				/>
			}
		</Container>
	);
}

function PreviewCollection(props: {
	collectionItems: Array<TritPostProps>;
	title: string;
	author: {
		username: string;
		display_name: string;
	};
}) {
	const collection =
		props.collectionItems.length > 0
			? props.collectionItems.slice(0, 6)
			: new Array(6).fill(0);
	return (
		<Container
			className="flex flex-col h-auto gap-4 p-4 border rounded-xl drop-shadow-sm"
			css={{
				backgroundColor: "$elementSurface",
				borderRadius: "32px",
			}}
		>
			<Container className="flex flex-nowrap overflow-x-auto md:grid md:grid-cols-2 gap-4 lg:grid-cols-3 scrollbar-hide overscroll-contain snap-x snap-mandatory">
				{collection.map((item, i) => (
					<Container
						key={item?.image?.ipfs ?? "skeleton" + i}
						className={`w-[80%] md:w-auto flex-shrink-0 overflow-hidden h-[280px] lg:h-[320px] snap-center ${
							i > 3 ? "hidden lg:flex" : "inherit"
						}`}
						css={{
							background: item.image
								? `url('https://treatnfts.gumlet.io/api/v3/image?default=${
										item.image.ipfs ?? item.image.ipfs
								  }${item.protected ? "&blurhash=true" : ""}')`
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
							<Link href={`/${props.author.username}`}>
								<a>
									<UserAvatar
										username={props.author.username}
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
	);
}
