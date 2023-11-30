import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined // it is a way of telling the type of variable in typescript
}

// to prevent creatoin of new istance of client on every Hot reload
export const db = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalThis.prisma = db

