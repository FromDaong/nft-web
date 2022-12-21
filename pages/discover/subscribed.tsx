import {GlobeAltIcon} from "@heroicons/react/outline";
import SuggestedCreatorsSection from "@packages/feed/components/SuggestedCreatorsSection";
import TrendsSection from "@packages/feed/components/TrendsSection";
import NavTab from "@packages/navigation/components/DiscoverNavTab";
import {TimelineActivity} from "@packages/post/TimelineActivity";
import {TritPostProps} from "@packages/post/types";
import {SEOHead} from "@packages/seo/page";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {
	BoldLink,
	ImportantText,
} from "@packages/shared/components/Typography/Text";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ContentSidebar from "core/components/layouts/ContentSidebar";
import TreatCore from "core/TreatCore";
import Link from "next/link";
import {useRouter} from "next/router";
import {ReactElement, ReactNode} from "react";

const getTrendingCreators = async () => {
	const res = await axios.get(`${apiEndpoint}/profile`);
	return res.data;
};

export default function SubscribedPage() {
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
				<Container className="flex gap-12">
					<Container className="flex flex-col flex-1 gap-8">
						<NavTab />
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
