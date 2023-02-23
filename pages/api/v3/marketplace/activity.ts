/* eslint-disable no-mixed-spaces-and-tabs */
import {returnWithSuccess} from "@db/engine/utils";
import {connectMongoDB} from "server/helpers/core";
import {MongoModelNFT} from "server/helpers/models";
import NFTEvent from "server/helpers/models/posts/activity";

export default async function handler(req, res) {
	await connectMongoDB();

	const {page, q, sort} = req.query;

	const sortMap = {
		"1": {
			price: 1,
		},
		"2": {
			price: -1,
		},
		"3": {
			listedDate: -1,
		},
	};

	const get_page = Number(page ?? 1) || 1;
	const options = {
		page: get_page,
		limit: 24,
	};

	const pipeline = [
		{
			$search: {
				index: "nfts",
				text: {
					query: `${q}`,
					path: ["name", "description"],
				},
			},
		},
	];

	const nftsAggregate = MongoModelNFT.aggregate([
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
				localField: "creator",
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
			$match: {
				$or: [
					{
						subscription_nft: false,
					},
					{
						subscription_nft: {
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
						melon_nft: false,
					},
					{
						melon_nft: {
							$exists: false,
						},
					},
				],
			},
		},
		{
			$match: {
				id: {
					$gte: 96,
				},
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
		{
			$sort: {
				...(sort && sortMap[sort]
					? sortMap[sort]
					: {
							price: -1,
					  }),
			},
		},
	]);

	// @ts-ignore
	const nfts = await MongoModelNFT.aggregatePaginate(nftsAggregate, options);
	nfts.docs = nfts.docs.map((nft) => ({
		...nft,
	}));
	return returnWithSuccess(nfts, res);
}
