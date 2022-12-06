import {pagePropsConnectMongoDB} from "@db/engine/pagePropsDB";
import LegacyCreatorModel from "@db/legacy/profile/Creator";

export const beforePageLoadGetUserProfile = async (ctx) => {
	await pagePropsConnectMongoDB();
	const {username} = ctx.query;
	const profile = await LegacyCreatorModel.findOne({username});

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
