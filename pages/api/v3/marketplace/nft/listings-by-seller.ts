import {returnWithSuccess} from "@db/engine/utils";
import {connectMongoDB} from "server/helpers/core";
import NFTEvent from "server/helpers/models/posts/activity";

export default async function handler(req, res) {
	await connectMongoDB();

	const {page, seller} = req.query;

	const get_page = Number(page ?? 1) || 1;
	const options = {
		page: get_page,
		limit: 24,
	};

	const nftsAggregate = NFTEvent.aggregate([
		{
			$match: {
				seller,
			},
		},
		{
			$lookup: {
				from: "marketplacenfts",
				localField: "id",
				foreignField: "id",
				as: "nft",
			},
		},
		{
			$sort: {
				createdAt: -1,
			},
		},
		{
			$lookup: {
				from: "profiles",
				localField: "seller",
				foreignField: "address",
				as: "seller",
			},
		},
		{
			$lookup: {
				from: "creators",
				localField: "nft.creator",
				foreignField: "_id",
				as: "creator",
			},
		},
		{
			$lookup: {
				from: "profiles",
				localField: "creator.profile",
				foreignField: "_id",
				as: "creator_profile",
			},
		},
		{
			$unwind: {
				path: "$nft",
			},
		},
		{
			$unwind: {
				path: "$creator",
			},
		},
		{
			$unwind: {
				path: "$creator_profile",
			},
		},
		{
			$unwind: {
				path: "$seller",
			},
		},
	]);

	// @ts-ignore
	const nfts = await NFTEvent.aggregatePaginate(nftsAggregate, options);

	return returnWithSuccess(nfts, res);
}
