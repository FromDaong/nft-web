import SweetshopSortBy from "@packages/post/SweetshopSortBy";
import {SkeletonTritCollectiblePost, TritPost} from "@packages/post/TritPost";
import {SEOHead} from "@packages/seo/page";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import SelectableTag from "@packages/shared/components/Selectabletag";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {Text} from "@packages/shared/components/Typography/Text";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import TreatCore from "core/TreatCore";
import {InfinityScrollListing} from "packages/shared/components/ListingSection";

const getSweetshopNFTs = async () => {
	const res = await axios.get(`${apiEndpoint}/marketplace`);
	return res.data;
};

export default function NFTS() {
	const {
		isLoading: sweetshopNFTsLoading,
		error: sweetshopNFTsError,
		data: sweetshopNFTsData,
	} = TreatCore.useQuery({
		queryKey: ["trendingNFTs"],
		queryFn: getSweetshopNFTs,
	});

	const nfts =
		sweetshopNFTsLoading || sweetshopNFTsError
			? []
			: sweetshopNFTsData?.data
					.slice(0, 20)
					.map((post) => legacy_nft_to_new(post));

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<SEOHead title="Explore NFTs" />
				<Container className="flex flex-col gap-12 py-12">
					<Container className="flex flex-col px-4 xl:px-0">
						<Heading size="md">Browse sweetshop trits</Heading>
						<Divider dir="horizontal" />
						<Container>
							<Container className="flex flex-col gap-4 md:flex-row md:justify-between">
								<Container className="flex gap-2">
									<SelectableTag>
										<Text>Free</Text>
									</SelectableTag>
									<SelectableTag>
										<Text>Sold out</Text>
									</SelectableTag>
									<SelectableTag>
										<Text>1 of 1</Text>
									</SelectableTag>
									<SelectableTag>
										<Text>TOTM</Text>
									</SelectableTag>
								</Container>
								<Container className="flex gap-4">
									<SweetshopSortBy />
								</Container>
							</Container>
							<Divider dir="horizontal" />
						</Container>
					</Container>

					<Container className="px-4 xl:px-0">
						<InfinityScrollListing>
							{!sweetshopNFTsLoading && !sweetshopNFTsError
								? nfts.map((nft) => (
										<div
											key={nft.id}
											className="col-span-1"
										>
											<TritPost
												inGrid
												{...nft}
											/>
										</div>
								  ))
								: new Array(20).fill(20).map((_, i) => (
										<Container
											key={i}
											className="col-span-1 border"
											css={{
												borderColor: "$subtleBorder",
												padding: "16px",
												borderRadius: "16px",
											}}
										>
											<SkeletonTritCollectiblePost />
										</Container>
								  ))}
						</InfinityScrollListing>
					</Container>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
