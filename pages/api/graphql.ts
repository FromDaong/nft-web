import {createSchema, createYoga} from "graphql-yoga";
import type {NextApiRequest, NextApiResponse} from "next";
import {buildHTTPExecutor} from "@graphql-tools/executor-http";
import {schemaFromExecutor} from "@graphql-tools/wrap";
import {TREAT_NEW_GRAPH, TREAT_OLD_GRAPH} from "@lib/graphClients";
import {stitchSchemas} from "@graphql-tools/stitch";

export const config = {
	api: {
		// Disable body parsing (required for file uploads)
		bodyParser: false,
	},
};

const treatOldGraphExecutor = buildHTTPExecutor({
	endpoint: TREAT_OLD_GRAPH,
});

const treatNewGraphExecutor = buildHTTPExecutor({
	endpoint: TREAT_NEW_GRAPH,
});

const oldGraphSchema = async () => ({
	schema: await schemaFromExecutor(treatOldGraphExecutor),
	executor: treatOldGraphExecutor,
});

const newGraphSchema = async () => ({
	schema: await schemaFromExecutor(treatNewGraphExecutor),
	executor: treatNewGraphExecutor,
});

const schema = async () =>
	stitchSchemas({
		subschemas: [await oldGraphSchema(), await newGraphSchema()],
	});

const handler = async (req, res) => {
	return createYoga<{
		req: NextApiRequest;
		res: NextApiResponse;
	}>({
		// Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
		graphqlEndpoint: "/api/graphql",
		schema: await schema(),
	})(req, res);
};

export default handler;
