import { Model, model, Schema } from "mongoose";
import { redisClient } from "../core";

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

export const getFromRedisCache = async (
  key: string
): Promise<object | null> => {
  const data = await redisClient.get(key);
  if (!data) return null;

  return JSON.parse(data);
};

export const setStringToRedisCache = async (key: string, value: any) => {
  if (typeof value === "object") {
    value = JSON.stringify(value);
  }
  if (typeof value !== "string") {
    value = new String(value).toString();
  }
  await redisClient.set(key, value);
};

export const invalidateRedisCache = async (key: string) => {
  await redisClient.del(key);
};

export const findAndPaginate = async (
  model: any,
  startId: string,
  limit = 10
) => {
  return model
    .find({ _id: { $lt: startId } })
    .sort({ _id: -1 })
    .limit(limit);
};
