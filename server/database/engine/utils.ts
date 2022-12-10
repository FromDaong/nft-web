import {NextApiResponse} from "next";
import {Model, model, Schema} from "mongoose";

// Simple Generic Function for reusability
// Feel free to modify however you like
export default function createMongoDBModel<T, TModel = Model<T>>(
	modelName: string,
	schema: Schema<T>
): TModel {
	let createdModel: TModel;
	if (process.env.NODE_ENV === "development") {
		// In development mode, use a global variable so that the value
		// is preserved across module reloads caused by HMR (Hot Module Replacement).
		// @ts-ignore
		if (!global[modelName]) {
			createdModel = model<T, TModel>(modelName, schema);
			// @ts-ignore
			global[modelName] = createdModel;
		}
		// @ts-ignore
		createdModel = global[modelName];
	} else {
		// In production mode, it's best to not use a global variable.
		createdModel = model<T, TModel>(modelName, schema);
	}
	return createdModel;
}

export const returnWithError = (
	message,
	statusCode,
	res
): {
	message: string;
	statusCode: number;
	res: NextApiResponse;
} => {
	return res.status(statusCode).json({
		error: true,
		message,
	});
};

export const returnWithSuccess = (
	data,
	res
): {
	data: any;
	res: NextApiResponse;
} => {
	return res.status(200).json({
		data,
	});
};

export const enforcePrivacyForNFTs = (nfts: Array<any>) => {
	return nfts.map((nft) => {
		nft.mints = nft.mints.length;
		delete nft.identity_access_key;

		if (nft.blurhash || nft.ownersOnly) {
			delete nft.image;
			delete nft.daoCdnUrl;
		}
		return nft;
	});
};

export const findOrCreate = async (model, query: any, data?: any) => {
	let item = await model.findOne({...query});
	if (!item) {
		item = new model(data);
		await model.save();
	}

	return item;
};

export const profileSelectList = "username display_name profile_pic address";

export function generatePaginationQuery(query, sort, nextKey) {
	const sortField = sort == null ? null : sort[0];

	function nextKeyFn(items) {
		if (items.length === 0) {
			return null;
		}

		const item = items[items.length - 1];

		if (sortField == null) {
			return {_id: item._id};
		}

		return {_id: item._id, [sortField]: item[sortField]};
	}

	if (nextKey == null) {
		return {paginatedQuery: query, nextKeyFn};
	}

	let paginatedQuery = query;

	if (sort == null) {
		paginatedQuery._id = {$gt: nextKey._id};
		return {paginatedQuery, nextKey};
	}

	const sortOperator = sort[1] === 1 ? "$gt" : "$lt";

	const paginationQuery = [
		{[sortField]: {[sortOperator]: nextKey[sortField]}},
		{
			$and: [
				{[sortField]: nextKey[sortField]},
				{_id: {[sortOperator]: nextKey._id}},
			],
		},
	];

	if (paginatedQuery.$or == null) {
		paginatedQuery.$or = paginationQuery;
	} else {
		paginatedQuery = {$and: [query, {$or: paginationQuery}]};
	}

	return {paginatedQuery, nextKeyFn};
}
