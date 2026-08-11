import { mock } from 'node:test'

export interface MockRes {
  json: ReturnType<typeof mock.fn>
  status: ReturnType<typeof mock.fn>
  on: ReturnType<typeof mock.fn>
  writableEnded: boolean
}

export function createMockRes(): { res: MockRes; json: ReturnType<typeof mock.fn>; status: ReturnType<typeof mock.fn> } {
  const json = mock.fn()
  const status = mock.fn()
  const on = mock.fn()
  const res: MockRes = { json, status, on, writableEnded: false }
  status.mock.mockImplementation(() => res)
  return { res, json, status }
}

export function createMockReq(
  headers: Record<string, unknown> = {},
  body: any = {},
  query: any = {},
  params: any = {}
) {
  return { headers, body, query, params }
}

export function createMockNext(): ReturnType<typeof mock.fn> {
  return mock.fn()
}

