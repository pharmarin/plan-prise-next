import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import * as auth from "./schema/auth";
import * as calendrier from "./schema/calendrier";
import * as medicament from "./schema/medicament";
import * as plan from "./schema/plan";

export const schema = { ...auth, ...medicament, ...plan, ...calendrier };

export * from "drizzle-orm";

export const db = drizzle(
  new Client({
    url: process.env.DATABASE_URL,
  }).connection(),
  { schema },
);
