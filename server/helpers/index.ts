import {
  setStringToRedisCache,
  getFromRedisCache,
  invalidateRedisCache,
} from "./utils/index";
import { connectMongoDB, redisClient } from "./core";
import createMongoDBModel from "./utils";

import * as models from "./models";

const treatDatabase = {
  engine: {
    redis: redisClient,
    connectMongo: connectMongoDB,
    createMongoModel: createMongoDBModel,
  },
  models: models,
  utils: {
    redis: {
      setString: setStringToRedisCache,
      readString: getFromRedisCache,
      delete: invalidateRedisCache,
    },
  },
};

export default treatDatabase;
