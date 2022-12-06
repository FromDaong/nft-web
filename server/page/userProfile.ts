import {connectMongoDB} from "@db/engine";
import LegacyCreatorModel from "@db/legacy/profile/Creator";

export const beforePageLoadGetUserProfile = async (ctx) => {
	await connectMongoDB();
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
