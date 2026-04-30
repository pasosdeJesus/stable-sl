# stable-sl

Making easy to buy and sell crypto for people from Sierra Leone

Prototype running in production mode on <https://stable-sl.pdJ.app> and in
development mode on <https://stable-sl.pdJ.app:9001>

See also:
- [ARCHITECTURE.md](ARCHITECTURE.md) — design, diagrams, flows
- [CONTRIBUTING.md](CONTRIBUTING.md) — development guide
- [packages/nextjs-app/README.md](packages/nextjs-app/README.md) — frontend setup

---

## Problem

In Sierra Leone few people manages a crypto wallet or an exchange and at the
moment of this writing neither FonBnk nor MiniPay support Sierra Leone.
Regargind exchanges only Binance and OKX operate there.

There are interesting saving and investment options in the web3, but this
requires tools and education. We want to create tools and promote education
about this in Sierra Leone.

## Solution

* Building a webapp or app that will make easy to buy/sell stable crypto
  to the people of Sierra Leone.
* Educate in the usage of stable cryptocoins and saving and investment
  opportunities.
* Motivated by the initial Divvi offering of FonBnk
  as a possible backend protocol, in march 2025 we proposed to FonBnk to be
  their partners in Sierra Leone. Later they told us that they already
  had a team there, but up to now they still don't support the currency,
  neither payment methods of Sierra Leone not even in their sandbox.
* So at least while FonBnk or another group offers an on-ramp/off-ramp
  solution we have started building one, operating with a team based on the
  Mission Hope School located in Kabala (the school is lead by the pastor
  Zechariah Conteh who is in the team).

## Location of Impact

Sierra Leone

## Contents of this monorepo

This monorepo includes:
1. `packages/nextjs-app` — The frontend to interact with the customers that
   initially can run as a web application.
2. `packages/hardhat` — Smart contracts (MockG for testing) and deployment
   scripts.
3. The APK of the Gateway application that runs in our phone to manage
   transactions (at `gatewaySmsUssd/app-debug.apk`).

## Repositories

This service is split across two repositories:

| Repo | Purpose | Location |
|---|---|---|
| `stable-sl` (this one) | Frontend + smart contracts | `/htdocs/stable-sl` |
| `coordinator-stable-sl` | Backend API (coordinator) | `/htdocs/coordinator-stable-sl` |

The frontend communicates with the coordinator via `NEXT_PUBLIC_COORDINATOR`.

## Frontend environment variables

See `packages/nextjs-app/README.md` for a full list. Key variables:

- `NEXT_PUBLIC_COORDINATOR` — coordinator backend URL
- `NEXT_PUBLIC_NETWORK` — `ALFAJORES` (testnet) or `CELO` (mainnet)
- `PORT` — dev server port (default 9002)

## Running the frontend in development mode

The frontend is better served in SSL with nginx.  See detailed
instructions in [packages/nextjs-app/README.md](packages/nextjs-app/README.md)

## Design

See [ARCHITECTURE.md](ARCHITECTURE.md) for:
- C4 architecture diagram
- On-ramp and off-ramp sequence diagrams
- Database schema
- Price strategy
- Authentication

## Status of Implementation

It is a prototype that:
1. Has fully functional on-ramp with USDT and GoodDollar
2. Shows how off-ramp works with USDT and GoodDollar
3. Still doesn't use an API for quotes, we set buying and selling prices
   manually and adjust periodically (that makes sense given the stability
   of SLE)
4. It interacts with the gateway receiving the SMS with Orange Money
   notifications --a method that has to be improved.
5. The on-ramp version in production can make payments in mainnet in USDT
   or GoodDollar limited to small amounts.
   The development version runs on Alfajores and makes payments in
   Mock USDT and Mock GoodDollar (deployed by us).
