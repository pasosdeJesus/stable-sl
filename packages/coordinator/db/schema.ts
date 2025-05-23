import { pgTable, integer, varchar, real, bigint } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const purchaseQuote = pgTable("purchasequote", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  senderPhone: varchar({ length: 15 }).notNull(),
  senderName: varchar({ length: 80 }).notNull(),
  senderWallet: varchar({ length: 50 }).notNull(),
  usdPriceInSle: real().notNull(),
  maximum: real().notNull(),
  minimum: real().notNull(),
  timestamp: bigint({ mode: "number" }).notNull(),
  token: varchar({ length: 32 }).notNull(),
})

export const purchaseOrder = pgTable("purchaseorder", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  quoteId: integer().notNull(),
  token: varchar({ length: 32 }).notNull(),
  state: varchar({ length: 32 }).notNull(),
  seconds: integer().notNull(),
  amountSle: real().notNull(),
  amountUsd: real().notNull(),
  receiverPhone: varchar({ length: 15 }).notNull(),
  receiverName: varchar({ length: 80}).notNull(),
  transactionUrl: varchar({ length: 1024}),
  timestampTx: bigint({ mode: "number" }),
  timestampExpired: bigint({ mode: "number" }),
  timestampSms: bigint({ mode: "number" }),
  messageSms: varchar({ length: 1024}),
})

export const smsLog = pgTable("smslog", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  timestamp: bigint({ mode: "number" }),
  ip: varchar({ length: 16}),
  phoneNumber: varchar({ length: 15}),
  message: varchar({ length: 1024})
})
 
