/* eslint-disable no-mixed-spaces-and-tabs */
import {returnWithSuccess} from "@db/engine/utils";
import {connectMongoDB} from "server/helpers/core";
import {MongoModelCreator} from "server/helpers/models";

export default async function handler(req, res) {
	await connectMongoDB();

	const {page, q, sort} = req.query;

	const sortMap = {
		"1": {
			username: 1,
		},
		"2": {
			username: -1,
		},
		"3": {
			"followers.length": -1,
		},
		"4": {
			"nfts.length": -1,
		},
	};

	const get_page = Number(page ?? 1) || 1;
	const options = {
		page: get_page,
		limit: 24,
		sort: {
			...(sort && sortMap[sort]
				? sortMap[sort]
				: {
						price: -1,
				  }),
		},
	};

	const pipeline = [
		{
			$search: {
				index: "profiles",
				text: {
					query: `${q}`,
					path: ["username", "bio", "display_name"],
				},
			},
		},
	];

	const creatorsAggregate = MongoModelCreator.aggregate([
		{
			$lookup: {
				from: "profiles",
				localField: "profile",
				foreignField: "_id",
				as: "profile",
				pipeline: q ? pipeline : [],
			},
		},
		{
			$unwind: {
				path: "$profile",
			},
		},
		{
			$match: {
				$or: [
					{
						active: true,
					},
					{
						pending: {
							$exists: false,
						},
					},
				],
			},
		},
	]);

	// @ts-ignore
	const creators = await MongoModelCreator.aggregatePaginate(
		creatorsAggregate,
		options
	);

	return returnWithSuccess(creators, res);
}
