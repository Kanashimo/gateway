import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "generated/prisma/client"
import "dotenv/config"

let url = "file:./dev.db"

if (process.env.NODE_ENV == "production") {
    url = "file:./data/prod.db"
}

const adapter = new PrismaBetterSqlite3({ url })
const prisma = new PrismaClient({ adapter })

export { prisma }