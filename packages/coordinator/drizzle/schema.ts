import { pgTable, integer, varchar, real, bigint } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const purchasequote = pgTable("purchasequote", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "buyquotes_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	senderPhone: varchar({ length: 15 }),
	senderName: varchar({ length: 80 }),
	senderWallet: varchar({ length: 50 }),
	usdPriceInSle: real(),
	maximum: integer(),
	minimum: integer(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	timestamp: bigint({ mode: "number" }),
	token: varchar({ length: 32 }),
});
