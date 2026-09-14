// Vitest global setup — mocks kysely + pg at module scope (hoisted).
// Mirrors learn.tg/apps/nextjs/vitest.setup.ts and the mocks available in
// @pasosdejesus/m/test-utils/kysely-mocks.
import { vi } from 'vitest'
import {
  mockExecuteTakeFirst,
  mockExecute,
  mockSqlExecute,
  mockSql,
  mockPgPool,
} from './test-utils/db-mocks'

class GlobalMockKysely {
  selectFrom() { return this }
  where() { return this }
  selectAll() { return this }
  select(..._args: any[]) { return this }
  orderBy() { return this }
  limit() { return this }
  groupBy() { return this }
  having() { return this }
  leftJoin() { return this }
  innerJoin() { return this }
  insertInto() { return this }
  values() { return this }
  returning() { return this }
  returningAll() { return this }
  updateTable() { return this }
  set() { return this }
  deleteFrom() { return this }
  with() { return this }
  onConflict() { return this }
  doNothing() { return this }
  executeTakeFirst() { return mockExecuteTakeFirst() }
  executeTakeFirstOrThrow() { return mockExecuteTakeFirst() }
  execute() { return mockExecute() }
  transaction() {
    return {
      execute: async (callback: any) => {
        return callback(new GlobalMockKysely())
      },
    }
  }
  getExecutor() {
    return {
      executeQuery: (query: any) => mockSqlExecute(query),
      provideConnection: async (callback: any) => callback({}),
      releaseConnection: () => {},
      transformQuery: (query: any, transformer: any) => query,
      compileQuery: (query: any, ctx: any) => ({ sql: '', parameters: [] }),
    }
  }
  fn = {
    countAll: vi.fn(() => ({ as: vi.fn(() => ({})) })),
    sum: vi.fn(() => ({ as: vi.fn(() => ({})) })),
    avg: vi.fn(() => ({ as: vi.fn(() => ({})) })),
    max: vi.fn(() => ({ as: vi.fn(() => ({})) })),
    min: vi.fn(() => ({ as: vi.fn(() => ({})) })),
  }
}

vi.mock('kysely', () => ({
  Kysely: GlobalMockKysely,
  PostgresDialect: vi.fn(),
  sql: mockSql,
}))

vi.mock('pg', () => ({ Pool: mockPgPool, types: { setTypeParser: vi.fn() } }))

vi.mock('@celo/abis', () => ({ stableTokenABI: [] }))

vi.mock('viem', () => ({
  createPublicClient: vi.fn(() => ({
    readContract: vi.fn().mockResolvedValue(1000000n),
  })),
  getContract: vi.fn(() => ({ read: {}, write: {} })),
  encodeFunctionData: vi.fn(() => '0xmock'),
  parseUnits: vi.fn((v: string) => BigInt(v)),
  formatUnits: vi.fn((v: bigint, d: number) => (Number(v) / 10 ** d).toString()),
  http: vi.fn(() => ({})),
}))

vi.mock('viem/chains', () => ({
  celo: { id: 42220, name: 'Celo' },
  celoSepolia: { id: 44787, name: 'Celo Sepolia' },
}))

vi.mock('viem/accounts', () => ({
  privateKeyToAccount: vi.fn(() => ({ address: '0xmock' })),
}))
