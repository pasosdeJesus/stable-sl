import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBuyQuote1746354396266 implements MigrationInterface {
    name = 'CreateBuyQuote1746354396266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "buy_quote" ("id" SERIAL NOT NULL, "quoteId" character varying(32) NOT NULL, "buyerPhone" character varying(12) NOT NULL, "buyerName" character varying(80) NOT NULL, "buyerWallet" character varying(48) NOT NULL, "timestamp" integer NOT NULL, "usdPriceInSle" double precision NOT NULL, "maximum" double precision NOT NULL, "minimum" double precision NOT NULL, CONSTRAINT "PK_a0e3beb35474f07184266bdb752" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "buy_quote"`);
    }

}
