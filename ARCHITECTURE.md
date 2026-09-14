# Architecture

## Overview

`stable-sl` es un único repositorio. El backend (coordinator) está integrado
como **submodule** en `apps/stable-sl/app/api/` (no es una aplicación Next.js
aparte): las rutas del API se sirven desde el mismo frontend.

| Componente | Ubicación | Propósito |
|---|---|---|
| Frontend + API | `apps/stable-sl/` | UI + rutas API (`app/api/*`), BD, servicios |
| Coordinator (submodule) | `apps/stable-sl/app/api/` | Lógica de órdenes, blockchain y Orange Money |
| Smart contracts | `apps/hardhat/` | Contratos (MockG para pruebas) y despliegue |

```
┌──────────────┐     HTTP/JSON     ┌──────────────────────────────┐     Blockchain     ┌─────────┐
│   Frontend   │ ────────────────> │  Coordinator (app/api)       │ ────────────────> │  Celo   │
│ (stable-sl)  │ <──────────────── │  (misma app Next.js)         │ <──────────────── │ (USDT,  │
└──────────────┘                   │                              │                   │  G$)    │
                                   │ PostgreSQL                   │                   └─────────┘
                                   │                              │
                                   │  ┌────────────┐              │     SMS / Orange
                                   │  │  Kysely    │              │ <──────────────── Orange Money
                                   │  │  ORM       │              │
                                   │  └────────────┘              │
                                   └──────────────────────────────┘
                                           │
                                           │ USSD / anything_to_send
                                           v
                                   ┌──────────────────┐
                                   │ Gateway (Phone)  │
                                   └──────────────────┘
```

---

## C4 Architecture Diagram

```mermaid
graph TB
    subgraph "Users"
        Customer[Customer<br/>Person<br/>Buys or sells. Uses Orange Money and a web3 wallet.]
    end

    subgraph "Frontend"
        FE[Frontend<br/>Software System<br/>Receives and validates phone, wallet,<br/>amount to buy/sell, presents quote,<br/>allows confirming and starts order]
    end

    subgraph "Coordinator Backend"
        COORD[Coordinator Backend, API based<br/>Software System<br/>Give quotes, starts orders,<br/>interacts with SMS/USSD and blockchain]
        DB[(Database<br/>Container: PostgreSQL<br/>Quotes, orders, SMS, payments)]
    end

    subgraph "External Systems"
        OM[Orange Money<br/>Software System<br/>Sends and receives payments]
        GATEWAY[SMS and USSD Gateway<br/>Software System<br/>Phone app that automatically<br/>receives/sends Orange Money payments]
        CELO[CELO Blockchain<br/>Software System<br/>Sends/receives payments<br/>with stable tokens]
        QUOTES[API for quotes<br/>Software System<br/>Returns USDT/SLE prices]
    end

    Customer -->|HTTP/JSON| FE
    FE -->|HTTP/JSON| COORD
    COORD -->|Reads/Writes| DB
    COORD -->|USSD / anything_to_send| GATEWAY
    COORD -->|RPC / transferErc20| CELO
    COORD -->|Price feed| QUOTES
    GATEWAY -->|SMS callback| COORD
    OM -->|Sends SMS| GATEWAY
    Customer -->|Pays via| OM
    Customer -->|Wallet| CELO
```

---

## On-Ramp Flow (Buy Crypto)

```mermaid
sequenceDiagram
    actor Customer
    participant FE as Frontend (webapp)
    participant BE as Coordinator Backend
    participant DB as Coordinator Database
    participant Oracle as Quotes Oracle
    participant Gateway as SMS and USSD Gateway
    participant OM as Orange Money
    participant CELO as CELO Blockchain

    Customer->>FE: Connects, gives information, requests quote
    FE->>BE: purchase_quote(buyerName, wallet, phone, crypto)

    break invalid_input() || unavailable_services()
        BE-->>FE: error
    end

    BE->>Oracle: request quote
    Oracle-->>BE: quote
    BE->>DB: creates quote
    BE-->>FE: (token, timestamp, cryptoPriceInSle, minimum, maximum)

    loop every 10 seconds or until order_to_buy
        Customer->>FE: Confirms to buy
        FE->>BE: purchase_order(token, amountSle)

        break invalid_input() || expired_quote()
            BE-->>FE: error
        end
    end

    BE->>DB: creates order
    BE-->>FE: (token, secondsToPay, amountSle, amountCrypto, phoneNumberToPay, nameOfReceiver)
    FE-->>Customer: Order information and countdown 15 min.

    loop every 10 sec. for 15 min. or until sms_received
        FE->>BE: purchase_order_state(token)
        BE-->>FE: "pending"
    end

    alt user pays correctly
        Customer->>OM: Pays to the gateway number the expected amount

        OM-->>Gateway: SMS with correct amount from customer
        Gateway->>BE: sms_received(number, message)
        BE-->>Gateway: thanks

        BE->>DB: updates paid order
        BE->>CELO: Transfers crypto to customer's wallet
        CELO-->>BE: tx receipt

        BE-->>Customer: Receipt
    else
        Customer-->>Customer: User is suggested to contact customer support
    end
```

---

## Off-Ramp Flow (Sell Crypto)

```mermaid
sequenceDiagram
    actor Customer
    participant FE as Frontend (webapp)
    participant BE as Coordinator Backend
    participant DB as Coordinator Database
    participant Oracle as Quotes Oracle
    participant Gateway as SMS and USSD Gateway
    participant OM as Orange Money
    participant CELO as CELO Blockchain

    Customer->>FE: Connects, gives information, requests quote
    FE->>BE: sales_quote(sellerName, wallet, phone, crypto)

    break invalid_input() || unavailable_services()
        BE-->>FE: error
    end

    BE->>CELO: balanceOf(wallet)
    CELO-->>BE: balance_wallet
    BE->>DB: balance_orange
    BE->>Oracle: request quote
    Oracle-->>BE: quote
    BE->>DB: creates quote

    break any balance in 0
        BE-->>FE: error
    end

    BE-->>FE: (token, timestamp, cryptoPriceInSle, balance_w, minimum, maximum)

    loop every 10 seconds or until order_to_sell
        Customer->>FE: Confirms to sell
        FE->>BE: sales_order(token, amountCrypto)

        break invalid_input() || expired_quote()
            BE-->>FE: error
        end
    end

    BE->>DB: creates order pending
    BE-->>FE: (token, secondsToPay, amountSle, amountCrypto, balance_w)
    FE-->>Customer: Order confirmation

    Customer->>CELO: Transfers crypto to coordinator wallet
    Customer->>BE: POST /api/crypto_transferred(token, tx)
    BE->>DB: paid order, tx

    loop every 10 sec. for 15 min. or until completed/cancelled
        FE->>BE: sell_order_state(token)
        BE-->>FE: "received"
    end

    alt correct result
        Gateway->>BE: anything_to_send
        BE-->>Gateway: (ussd, number_to_dial)
        Gateway->>OM: number_to_dial (USSD)
        BE->>Gateway: result_ussd
        BE->>DB: completed order
        BE-->>Customer: Success notification
    else
        BE->>CELO: refunds payment (refund tx)
        CELO-->>BE: tx
        BE->>DB: cancelled order, refund tx
        BE-->>Customer: Refund notification
    end
```

---

## On-Ramp Flow (Text Summary)

1. **Frontend** calls `GET /api/purchase_quote` with buyer info.
2. **Frontend** calls `GET /api/purchase_order` with quote token and SLE amount.
3. **Buyer** sends SLE via Orange Money to the operator phone.
4. Orange Money sends an SMS notification → **gateway**.
5. **POST /api/sms_received** parses the SMS, updates order to `received`, and transfers crypto to the buyer's wallet.
6. **Frontend** polls `GET /api/purchase_order_state` until state is `paid`.

## Off-Ramp Flow (Text Summary)

1. **Frontend** calls `GET /api/sales_quote` with seller info.
2. **Frontend** calls `GET /api/sales_order` with quote token and crypto amount.
3. **Seller** transfers crypto from their wallet to the coordinator wallet.
4. Seller or gateway calls **POST /api/crypto_transferred**, order → `received`.
5. **Frontend** polls `GET /api/sales_order_state` until state is `received`.
6. **Gateway** polls `GET /api/anything_to_send`, gets USSD code.
7. Operator executes USSD to send SLE via Orange Money to seller.
8. **Gateway** calls **POST /api/report_send** to confirm, order → `paid`.

---

## Database

PostgreSQL gestionado con **Kysely** (antes Drizzle). Seis tablas (ver
`apps/stable-sl/app/api/db/db.d.ts` para el tipo `DB`):

| Table | Purpose |
|---|---|
| `purchasequote` | Cotizaciones de compra (buy crypto). |
| `purchaseorder` | Órdenes de compra. |
| `salesquote` | Cotizaciones de venta (sell crypto). |
| `salesorder` | Órdenes de venta. |
| `smslog` | Registro de SMS entrantes de Orange Money. |
| `movementsmobile` | Movimientos y saldo de Orange Money del operador. |

Las columnas monetarias/precio/saldo usan `numeric` (no `real`). La migración
`apps/stable-sl/app/api/db/migrations/20260908120000_numeric_fks_indexes.ts`
agrega las claves foráneas y los índices (la BD de producción solo tenía
`PRIMARY KEY (id)`):

- FK `purchaseorder.quoteId → purchasequote.id`
- FK `salesorder.quoteId → salesquote.id`
- FK `movementsmobile.salesOrderId → salesorder.id`
- FK `movementsmobile.purchaseOrderId → purchaseorder.id`
- Índices en `token`, `quoteId`, `state`, `phoneNumber`, etc.

---

## Price Strategy

Prices are set in env vars (`USD_IN_SLE_BUY`, `USD_IN_SLE_SELL`, etc.) and adjusted manually. The goal is not short-term profit but adoption:

- **Buy price (USD_IN_SLE_BUY):** higher than midrate — operator earns spread.
- **Sell price (USD_IN_SLE_SELL):** lower than midrate — operator earns spread.
- KYC/whitelisted wallets (`KYC1`-`KYC4`) get higher limits (`MAX_SLE_WHITELISTED`).

## Authentication

- For the customer — coordinator backend: a randomly generated authentication token.
- For the coordinator — gateway: a shared secret to encrypt messages.
