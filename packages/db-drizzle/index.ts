import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import * as auth from "./schema/auth";
import * as calendrier from "./schema/calendrier";
import * as medicament from "./schema/medicament";
import * as plan from "./schema/plan";

export const schema = { ...auth, ...medicament, ...plan, ...calendrier };

export * from "drizzle-orm";
export * from "./schema/auth";

const connection = await mysql.createConnection({
  uri: process.env.DATABASE_URL,
});

export const db = drizzle(connection, { mode: "default", schema: schema });
