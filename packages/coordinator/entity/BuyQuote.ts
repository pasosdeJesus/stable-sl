import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"

@Entity()
export class BuyQuote extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column("varchar", { length: 32 })
  quoteId: string;

  @Column("varchar", {length: 12})
  buyerPhone: string

  @Column("varchar", {length: 80})
  buyerName: string

  @Column("varchar", {length: 48})
  buyerWallet: string

  @Column("integer")
  timestamp: number

  @Column("float")
  usdPriceInSle: number

  @Column("float")
  maximum: number

  @Column("float")
  minimum: number
}
