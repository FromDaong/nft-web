import {pagePropsConnectMongoDB} from "@db/engine/pagePropsDB";
import Error404 from "@packages/error/404";
import {SEOHead} from "@packages/seo/page";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {MongoModelCollection} from "server/helpers/models";

export default function Collection(props) {
	const data = JSON.parse(props.data);
	const notFound = data.notFound;

	console.log({data});

	if (notFound) {
		return <Error404 />;
	}

	return (
		<ApplicationLayout>
			<SEOHead title={data.collection.name} />
			<ApplicationFrame></ApplicationFrame>
		</ApplicationLayout>
	);
}

export const getServerSideProps = async (ctx) => {
	const {_id} = ctx.params;

	await pagePropsConnectMongoDB();

	const collection = await MongoModelCollection.findById(_id).exec();

	if (!collection) {
		return {
			notFound: true,
		};
	}

	const returnObj = {
		id: collection._id,
		collection,
	};

	return {
		props: {
			data: JSON.stringify(returnObj),
		},
	};
};
