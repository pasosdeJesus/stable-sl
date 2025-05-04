import { bigint, integer, pgTable, real, varchar } from "drizzle-orm/pg-core";

export const quotesToBuy = pgTable("buyquotes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  token: varchar({length: 32}),
  senderPhone: varchar({length: 15}),
  senderName: varchar({length: 80}),
  senderWallet: varchar({length: 50}),
  usdPriceInSle: real(),
  maximum: integer(),
  minimum: integer(),
  timestamp:  bigint({mode: "number"}),
});
