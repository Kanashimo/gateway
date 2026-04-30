import "dotenv/config";
import { defineConfig } from "prisma/config";

let url = "file:./dev.db"

if (process.env.NODE_ENV == "production") {
  url = "file:./data/prod.db"
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url
  },
});
