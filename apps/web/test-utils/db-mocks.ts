import { vi } from 'vitest'

// Shared mock functions for the kysely + pg layer. vitest.setup.ts wires them
// into vi.mock('kysely') / vi.mock('pg'); tests import these to control behavior.
export const mockExecuteTakeFirst = vi.fn()
export const mockExecute = vi.fn()
export const mockSqlExecute = vi.fn((_query: any) => ({ rows: [] }))
export const mockSql = vi.fn((...args: any[]) => ({ args }))
export const mockPgPool = vi.fn(() => ({}))
