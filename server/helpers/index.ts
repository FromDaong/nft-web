import {connectMongoDB} from "./core";
import createMongoDBModel from "./utils";

import * as models from "./models";

const treatDatabase = {
	engine: {
		connectMongo: connectMongoDB,
		createMongoModel: createMongoDBModel,
	},
	models: models,
	utils: {},
};

export default treatDatabase;
