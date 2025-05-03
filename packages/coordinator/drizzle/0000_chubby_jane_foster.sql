CREATE TABLE "quotesToBuy" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "quotesToBuy_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"quoteId" varchar,
	"senderPhone" varchar,
	"senderName" varchar,
	"senderWallet" varchar,
	"usdPriceInSle" real,
	"maximum" integer,
	"minimum" integer
);
--> statement-breakpoint
CREATE TABLE "testcount" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "testcount_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"count" integer NOT NULL,
	"lastAddress" varchar(255)
);
