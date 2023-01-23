/* eslint-disable no-mixed-spaces-and-tabs */
import {returnWithSuccess} from "@db/engine/utils";
import {connectMongoDB} from "server/helpers/core";
import {MongoModelCreator} from "server/helpers/models";

export default async function handler(req, res) {
	await connectMongoDB();

	const {page, q} = req.query;

	const get_page = Number(page ?? 1) || 1;
	const options = {
		page: get_page,
		limit: 24,
	};

	const pipeline = [
		{
			$search: {
				index: "profiles",
				text: {
					query: `${q}`,
					path: ["name", "description", "display_name"],
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
