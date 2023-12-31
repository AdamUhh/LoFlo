import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/*",
  out: "./drizzle/migrations",
  driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN
  }
} satisfies Config;
