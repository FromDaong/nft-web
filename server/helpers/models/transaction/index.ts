import mongoose from "mongoose";
import createMongoDBModel from "../../utils";

const TransactionSchema = new mongoose.Schema(
	{
		txHash: {
			type: String,
		},
		type: {
			type: String,
			required: true,
			enum: ["mint", "transfer", "tip", "list", "resale", "buy"],
		},
		metadata: {
			nftId: {
				type: String,
				required: true,
			},
			balanceSender: {
				type: String,
				required: true,
			},
			balanceReceiver: {
				type: String,
				required: true,
			},
			message: {
				type: String,
			},
		},
		amount: {
			type: String,
		},
		timestamp: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: {createdAt: true, updatedAt: true},
	}
);

const ModelTransaction = createMongoDBModel("Transaction", TransactionSchema);
export default ModelTransaction;
