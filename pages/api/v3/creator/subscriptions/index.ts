import {MongoModelCreator, MongoSubscriptionModel} from "server/helpers/models";
import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {returnWithSuccess} from "server/database/engine/utils";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectMongoDB();

	// T-62 Add pagination to prevent perfomance hit on $in query to creators
	const subscriptions = await MongoSubscriptionModel.find();
	const creatorIds = subscriptions.map(
		(subscription) => subscription.creatorId
	);

	const creators = await MongoModelCreator.find({creatorId: {$in: creatorIds}});

	const creatorsWithSubscriptions = creators.map((creator) => {
		creator.subscription =
			subscriptions.find(
				(subscription) => subscription.creatorId === creator.id
			) ?? null;
		return creator;
	});

	return returnWithSuccess(creatorsWithSubscriptions, res);
}
