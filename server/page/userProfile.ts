import {pagePropsConnectMongoDB} from "@db/engine/pagePropsDB";
import {MongoModelProfile} from "server/helpers/models";

export const beforePageLoadGetUserProfile = async (ctx) => {
	await pagePropsConnectMongoDB();
	const {username} = ctx.query;
	const profile = await MongoModelProfile.findOne({username});

	if (!profile) {
		return {
			props: {
				notFound: true,
				error: true,
			},
		};
	}

	return {
		props: {
			data: JSON.stringify(profile),
		},
	};
};
