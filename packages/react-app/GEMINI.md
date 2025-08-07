# GEMINI.md - Context for stable-sl React App

This file provides context for the `stable-sl` frontend, a Next.js React application. It is intended for use with AI tools like Qwen Code to provide project-specific information for development assistance.

## Project Overview

*   **Name:** stable-sl
*   **Type:** Web Frontend Application
*   **Framework:** Next.js (v15+)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Key Libraries:**
    *   `wagmi` & `@rainbow-me/rainbowkit`: For Celo blockchain wallet integration.
    *   `@tanstack/react-query`: For data fetching and state management.
    *   `axios`: For making HTTP requests.
    *   `lucide-react`: For icons.
    *   `zod`: (Likely) for data validation.

### Purpose

This application serves as the frontend for "Stable SL", a service facilitating the buying and selling of USDT (and potentially other cryptocurrencies like GoodDollar) in Sierra Leone using Orange Money. Users connect their Celo-compatible wallets, provide their Orange Money phone number and name, and then proceed to either buy or sell crypto.

### Architecture

*   **App Directory:** The application uses the Next.js App Router (`src/app`).
*   **Main Page (`src/app/page.tsx`):** The core landing page where users connect their wallet and enter their identification details (phone number, name). It handles basic validation and navigation to `/buy` or `/sell` pages, passing user data via query parameters.
*   **State Management:** Uses React hooks (`useState`, `useEffect`) for local component state. `@tanstack/react-query` is integrated for potential API data fetching.
*   **Wallet Integration:** `wagmi` and `@rainbow-me/rainbowkit` manage wallet connections, specifically targeting the Celo (mainnet) and Celo Alfajores (testnet) networks.
*   **UI Components:** Custom UI components are located in `src/components/` and `src/components/ui/`, likely built with Radix UI primitives and styled using Tailwind CSS. A `Layout` component (`src/components/Layout.tsx`) wraps the main content, including a `Header` and `Footer`.
*   **Providers:** The `AppProvider` (`src/providers/AppProvider.tsx`) wraps the entire application, setting up `wagmi`, `@tanstack/react-query`, and `@rainbow-me/rainbowkit`.

## Development Environment

### Getting Started

1.  **Install Dependencies:** `pnpm install`
2.  **Run Development Server:** `./bin/dev` (This script likely runs `next dev`). The app will be available on port 9002 according to the README.
3.  **Environment Variables:** Uses `.env` files. `.env.template` likely shows required variables (e.g., `NEXT_PUBLIC_COORDINATOR` for the backend API URL, `NEXT_PUBLIC_NETWORK` for CELO/ALFAJORES, `WC_PROJECT_ID` for WalletConnect).

### Building and Running

*   **Development Mode:**
    *   Command: `./bin/dev` or `pnpm run dev`
    *   Description: Starts the Next.js development server with hot reloading.
*   **Production Build:**
    *   Command: `pnpm run build` or `make` (from the root project directory, which likely calls `pnpm run build`)
    *   Description: Creates an optimized production build in the `out` directory (configured via `output: 'export'` in `next.config.ts`).
*   **Run Production Build:**
    *   Command: `pnpm run start`
    *   Description: Starts the Next.js production server (though static export is configured, this might be for SSR if needed, or just a standard command).
*   **Linting:**
    *   Command: `pnpm run lint` or `make syntax`
    *   Description: Runs ESLint to check for code style and potential errors.
*   **Type Checking:**
    *   Command: `pnpm run typecheck`
    *   Description: Runs TypeScript compiler to check for type errors without emitting files.

### Deployment

The production build generates static files in the `out` directory. The README provides an example `nginx` configuration to serve these files.

## Development Conventions

*   **Component Structure:** Components are typically located in `src/components/`, with UI primitives often in `src/components/ui/`.
*   **Styling:** Uses Tailwind CSS extensively for styling components.
*   **TypeScript:** Used for type safety throughout the application.
*   **Routing:** Utilizes the Next.js App Router file-system based routing within `src/app`.
*   **State Management:** Combines React's built-in hooks with `@tanstack/react-query` for managing local and remote state.