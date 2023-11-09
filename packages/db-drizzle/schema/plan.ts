import { sql } from "drizzle-orm";
import {
  index,
  int,
  json,
  mediumtext,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

export const plans = mysqlTable(
  "plans",
  {
    id: varchar("id", { length: 191 }).notNull(),
    medicsOrder: json("medicsOrder").notNull(),
    data: json("data"),
    settings: json("settings"),
    userId: varchar("userId", { length: 191 }),
    displayId: int("displayId").notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("plans_userId_idx").on(table.userId),
      plansId: primaryKey(table.id),
    };
  },
);

export const medicamentToPlan = mysqlTable(
  "_MedicamentToPlan",
  {
    a: varchar("A", { length: 191 }).notNull(),
    b: varchar("B", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      bIdx: index("_MedicamentToPlan_B_index").on(table.b),
      medicamentToPlanAbUnique: unique("_MedicamentToPlan_AB_unique").on(
        table.a,
        table.b,
      ),
    };
  },
);

export const plansOld = mysqlTable(
  "plans_old",
  {
    id: int("id").autoincrement().notNull(),
    user: varchar("user", { length: 50 }).notNull(),
    data: mediumtext("data").notNull(),
    options: text("options"),
    time: timestamp("TIME", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      plansOldId: primaryKey(table.id),
    };
  },
);
