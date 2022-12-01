import {PrismaClient} from "@prisma/client";
const {Neo4jGraphQL} = require("@neo4j/graphql");
import * as neo4jDriver from "neo4j-driver";
import Neode from "neode";

const neo4jHost = process.env.NEO4J_HOST;

const neo4Password = process.env.NEO4J_PASSWORD;
const neo4Username = process.env.NEO4J_USERNAME;

const prisma = new PrismaClient();

const neo4jDB = neo4jDriver.driver(
	neo4jHost,
	neo4jDriver.auth.basic(neo4Username, neo4Password)
);

const neodeDB = new Neode(neo4jHost, neo4Username, neo4Password);

export {prisma, neo4jDB, neodeDB};

export async function graphRead<RecordShape>(
	cypher: string,
	params?: Record<string, any>
): Promise<RecordShape[]> {
	const session = neo4jDB.session();

	try {
		const res = await session.executeRead((tx) => tx.run(cypher, params));

		const values = res.records.map(
			(record) => record.toObject() as RecordShape
		);

		return values;
	} finally {
		await session.close();
	}
}

export async function graphWrite<RecordShape>(
	cypher: string,
	params?: Record<string, any>
): Promise<RecordShape[]> {
	const session = neo4jDB.session();

	try {
		const res = await session.executeWrite((tx) => tx.run(cypher, params));

		const values = res.records.map(
			(record) => record.toObject() as RecordShape
		);

		return values;
	} finally {
		await session.close();
	}
}
