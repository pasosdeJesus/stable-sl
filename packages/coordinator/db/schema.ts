import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const testcountTable = pgTable("testcount", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  count: integer().notNull(),
  lastAddress: varchar({length: 255}),
});
