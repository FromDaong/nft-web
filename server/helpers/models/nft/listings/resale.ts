import {Document} from "mongoose";

interface ResaleListing extends Document {
	price: number;
	quantity: number;
	seller: string;
	sales: {
		buyer: string;
		timestamp: number;
	};
}
