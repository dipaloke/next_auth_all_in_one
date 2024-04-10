import { PrismaClient } from "@prisma/client";

//declaring db this way because of NEXTJS hot reload. this way when nextjs reloads, it will check if
//prisma client is active or not, if it is not then it will initialize a new prisma client.
//global is not effected by hot reload.

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
