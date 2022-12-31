import {pagePropsConnectMongoDB} from "@db/engine/pagePropsDB";
import {MongoModelCreator, MongoModelProfile} from "server/helpers/models";

export const beforePageLoadGetUserProfile = async (ctx) => {
	await pagePropsConnectMongoDB();
	const {username} = ctx.query;
	const profile = await MongoModelProfile.findOne({username}).exec();

	if (!profile) {
		return {
			props: {
				notFound: true,
				error: true,
			},
		};
	}

	const creator = await MongoModelCreator.findOne({username}).exec();
	if (!creator) {
		if (ctx.resolvedUrl === `/${username}`) {
			return {
				redirect: {
					destination: `/${username}/portfolio`,
					permanent: false,
				},
			};
		}
	}

	return {
		props: {
			data: JSON.stringify({...profile.toObject(), creator}),
		},
	};
};
