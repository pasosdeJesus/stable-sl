# Contributing

## Development setup

See [README.md](README.md) and [packages/nextjs-app/README.md](packages/nextjs-app/README.md) for environment setup and running instructions.

## Code quality

Run the TypeScript type checker:

```sh
cd packages/nextjs-app
pnpm typecheck
```

Run the linter:

```sh
cd packages/nextjs-app
pnpm lint
```

> **Note:** Some pre-existing type errors in `shadcn/ui` components may appear.
> The `next.config.ts` has `ignoreBuildErrors: true` for this reason.

## Smart contracts

Hardhat projects are in `packages/hardhat/`:

```sh
cd packages/hardhat
pnpm compile
pnpm test
```

## Project structure

```
stable-sl/
├── packages/
│   ├── nextjs-app/       # Frontend web application (Next.js)
│   │   ├── src/
│   │   │   ├── app/      # Pages (buy, sell, admin)
│   │   │   └── components/ui/  # shadcn UI components
│   │   └── public/       # Static assets
│   ├── hardhat/          # Smart contracts and deployment scripts
│   │   ├── contracts/    # Solidity contracts
│   │   └── scripts/      # Deployment scripts
├── doc/img/              # Architecture and sequence diagrams
├── gatewaySmsUssd/       # Android gateway APK
│   └── app-debug.apk
└── ARCHITECTURE.md       # Architecture documentation
```

## Conventions

- Use TypeScript strict mode.
- Follow the existing code style (ESLint + Prettier configs provided).
- Smart contracts follow Hardhat conventions.
- Frontend uses Next.js App Router.

## Support

For questions or support, contact us on Telegram:
[@soporte_pdJ_bot](https://t.me/soporte_pdJ_bot)
