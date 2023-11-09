import { sql } from "drizzle-orm";
import {
  bigint,
  datetime,
  index,
  int,
  longtext,
  mysqlTable,
  primaryKey,
  text,
  tinyint,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 191 }).notNull(),
    email: varchar("email", { length: 191 }).notNull(),
    admin: tinyint("admin").default(0).notNull(),
    firstName: varchar("firstName", { length: 191 }),
    lastName: varchar("lastName", { length: 191 }),
    displayName: varchar("displayName", { length: 191 }),
    student: tinyint("student").notNull(),
    certificate: longtext("certificate"),
    rpps: bigint("rpps", { mode: "number" }),
    password: varchar("password", { length: 191 }).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }),
    approvedAt: datetime("approvedAt", { mode: "string", fsp: 3 }),
    maxId: int("maxId").default(1).notNull(),
  },
  (table) => {
    return {
      usersId: primaryKey(table.id),
      usersEmailKey: unique("users_email_key").on(table.email),
    };
  },
);

export const accounts = mysqlTable(
  "accounts",
  {
    id: varchar("id", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    type: varchar("type", { length: 191 }).notNull(),
    provider: varchar("provider", { length: 191 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 191 }).notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: int("expires_at"),
    tokenType: varchar("token_type", { length: 191 }),
    scope: varchar("scope", { length: 191 }),
    idToken: text("id_token"),
    sessionState: varchar("session_state", { length: 191 }),
  },
  (table) => {
    return {
      userIdIdx: index("accounts_userId_idx").on(table.userId),
      accountsId: primaryKey(table.id),
      accountsProviderProviderAccountIdKey: unique(
        "accounts_provider_providerAccountId_key",
      ).on(table.provider, table.providerAccountId),
    };
  },
);

export const sessions = mysqlTable(
  "sessions",
  {
    id: varchar("id", { length: 191 }).notNull(),
    sessionToken: varchar("sessionToken", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    expires: datetime("expires", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("sessions_userId_idx").on(table.userId),
      sessionsId: primaryKey(table.id),
      sessionsSessionTokenKey: unique("sessions_sessionToken_key").on(
        table.sessionToken,
      ),
    };
  },
);
