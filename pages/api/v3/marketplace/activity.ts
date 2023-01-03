/* eslint-disable no-mixed-spaces-and-tabs */
import {returnWithSuccess} from "@db/engine/utils";
import {connectMongoDB} from "server/helpers/core";
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
			createdAt: -1,
		},
	};

	const groupSortMap = {
		"1": {
			"first.price": 1,
		},
		"2": {
			"first.price": -1,
		},
		"3": {
			"first.createdAt": -1,
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
			$match: {
				id: {
					$gte: 300,
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
			$unwind: {
				path: "$nft",
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
		{
			$group: {
				_id: "$id",
				count: {$sum: 1},
				first: {$first: "$$ROOT"},
			},
		},
		{
			$sort: {
				...(sort && groupSortMap[sort]
					? groupSortMap[sort]
					: {
							price: 1,
					  }),
			},
		},
	]);

	// @ts-ignore
	const nfts = await NFTEvent.aggregatePaginate(nftsAggregate, options);
	nfts.docs = nfts.docs.map((nft) => ({
		...nft.first,
		count: nft.count,
	}));
	return returnWithSuccess(nfts, res);
}
