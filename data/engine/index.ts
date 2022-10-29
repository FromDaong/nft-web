import insertUnique from "./queries";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export { prisma };
export { insertUnique };
