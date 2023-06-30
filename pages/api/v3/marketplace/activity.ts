import {PaginationManager} from "./../../../../utils/pagination";
/* eslint-disable no-mixed-spaces-and-tabs */
import {returnWithSuccess} from "@db/engine/utils";
import {connectMongoDB} from "server/helpers/core";
import {MongoModelNFT} from "server/helpers/models";
import {NFTSearchManager} from "@utils/search";

export default async function handler(req, res) {
	await connectMongoDB();

	const {page, q, sort} = req.query;

	const nfts = await MongoModelNFT.aggregate([
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
				$or: [
					{
						totm_nft: false,
					},
					{
						totm_nft: {
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
	]).exec();

	const searchManager = new NFTSearchManager(nfts);
	searchManager.hydrate();
	const searchResults = await searchManager.search(q);
	const paginationManager = new PaginationManager(
		nfts.filter((nft) => searchResults.includes(nft.id))
	);

	return returnWithSuccess(
		paginationManager.paginate(
			Number((page as string) ?? 1),
			sort === "1"
				? paginationManager.cheapestFirst()
				: sort === "2"
				? paginationManager.expensiveFirst()
				: paginationManager.newestFirst()
		),
		res
	);
}
