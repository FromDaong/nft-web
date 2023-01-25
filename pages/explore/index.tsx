import SuggestedCreatorsSection from "@packages/feed/components/SuggestedCreatorsSection";
import TrendsSection from "@packages/feed/components/TrendsSection";
import NavTab from "@packages/navigation/components/DiscoverNavTab";
import {SEOHead} from "@packages/seo/page";
import {Container} from "@packages/shared/components/Container";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ContentSidebar from "core/components/layouts/ContentSidebar";
import TreatCore from "core/TreatCore";

const newCurated: any = {
	name: "Welcome to the Tritters",
	image: {
		cdn: "/assets/cherieCover.jpg",
		ipfs: "/assets/cherieCover.jpg",
	},
	text: "Woke up feeling sexy :)",
	price: {
		value: 0.99,
		currency: "BNB",
	},
	id: "1",
	blurhash:
		"-qIFGCoMs:WBayay_NRjayj[ayj[IUWBayayj[fQIUt7j[ayayayj@WBRjoffkj[xuWBWCayj[ayWAt7fQj[ayayM{WBofj[j[fQ",
	post_type: "subscription",
	author: {
		username: "kamfeskaya",
		display_name: "Kamfes",
		avatar:
			"https://images.pexels.com/users/avatars/50964441/feyza-yildirim-157.jpeg?auto=compress&fit=crop&h=50&w=50&dpr=1",
	},
	timestamp: 782898893,
	subscription: {
		id: "8373",
		price: {
			value: 0.2,
			currency: "BNB",
		},
	},
};

const getTrendingCreators = async () => {
	const res = await axios.get(`${apiEndpoint}/profile`);
	return res.data;
};

export default function ForYouPage() {
	const {
		isLoading: trendingCreatorsLoading,
		error: trendingCreatorError,
		data: trendingCreatorsData,
	} = TreatCore.useQuery({
		queryKey: ["trendingCreators"],
		queryFn: getTrendingCreators,
	});

	const trendingCreators =
		trendingCreatorsLoading || trendingCreatorError
			? []
			: trendingCreatorsData?.data.slice(0, 5);
	return (
		<ApplicationLayout>
			<SEOHead title="For you - Tritt" />
			<ApplicationFrame>
				<Container className="flex flex-col gap-12 lg:flex-row">
					<Container className="flex flex-col flex-1 gap-8">
						<NavTab />
						<Container className="flex flex-col max-w-xl gap-4 mx-auto"></Container>
					</Container>
					<ContentSidebar>
						{trendingCreators.length > 0 && (
							<SuggestedCreatorsSection
								title="Creators you might like"
								data={trendingCreators}
							/>
						)}
						<TrendsSection
							data={[
								{
									channel: "Trending",
									topic: "NSFW Art",
									totalPosts: 1400,
								},
							]}
						/>
					</ContentSidebar>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}