import {connectMongoDB, redisClient} from "./core";
import createMongoDBModel from "./utils";

import * as models from "./models";

const treatDatabase = {
	engine: {
		redis: redisClient,
		connectMongo: connectMongoDB,
		createMongoModel: createMongoDBModel,
	},
	models: models,
	utils: {},
};

export default treatDatabase;
