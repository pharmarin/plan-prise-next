import { sql } from "drizzle-orm";
import {
  int,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/mysql-core";

export const calendriersOld = mysqlTable(
  "calendriers_old",
  {
    id: int("id").autoincrement().notNull(),
    user: text("user").notNull(),
    data: text("data").notNull(),
    time: timestamp("TIME", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      calendriersOldId: primaryKey(table.id),
    };
  },
);
