import "reflect-metadata"
import "dotenv/config"
import { DataSource } from "typeorm"

import { BuyQuote } from "./entity/BuyQuote"


export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [BuyQuote],
  subscribers: [],
  migrations: ["migration/1746354396266-CreateBuyQuote.ts"],
})
