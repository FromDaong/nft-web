import {returnWithSuccess} from "@db/engine/utils";
import {connectMongoDB} from "server/helpers/core";
import NFTEvent from "server/helpers/models/posts/activity";

export default async function handler(req, res) {
	await connectMongoDB();

	const {page, q, sort} = req.query;

	console.log({q});

	const get_page = Number(page ?? 1) || 1;
	const options = {
		page: get_page,
		limit: 24,
		sort: {
			id: -1,
		},
	};

	const pipeline = [
		{
			$search: {
				index: "nfts",
				text: {
					query: "booty",
					path: ["name", "description"],
				},
			},
		},
	];

	const nftsAggregate = NFTEvent.aggregate([
		{
			$lookup: {
				from: "marketplacenfts",
				localField: "id",
				foreignField: "id",
				as: "nft",
				pipeline: q ? pipeline : [],
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
			$match: {
				$or: [
					{
						"nft.subscription_nft": false,
					},
					{
						"nft.subscription_nft": {
							$exists: false,
						},
					},
				],
			},
		},
		{
			$match: {
				$or: [
					{
						"nft.totm_nft": false,
					},
					{
						"nft.totm_nft": {
							$exists: false,
						},
					},
				],
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
