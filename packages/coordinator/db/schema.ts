import { integer, pgTable, real, varchar } from "drizzle-orm/pg-core";

export const testcountTable = pgTable("testcount", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  count: integer().notNull(),
  lastAddress: varchar({length: 255}),
});

export const quotesToBuy = pgTable("buyquotes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  quoteId: varchar({length: 32}),
  senderPhone: varchar({length: 15}),
  senderName: varchar({length: 80}),
  senderWallet: varchar({length: 50}),
  usdPriceInSle: real(),
  maximum: integer(),
  minimum: integer(),
});
