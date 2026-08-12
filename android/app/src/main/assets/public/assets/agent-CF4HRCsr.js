import { r as t } from './request-B60bV0HZ.js'
function o() {
  return `run_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}
const s = {
  run(e, r) {
    return t.post('/agent/run', e, { timeout: 0, signal: r })
  },
  pendingApprovals(e) {
    return t.get(`/agent/runs/${e}/approvals`)
  },
  approve(e) {
    return t.post(`/agent/approvals/${e}/approve`)
  },
  reject(e) {
    return t.post(`/agent/approvals/${e}/reject`)
  },
  history(e = 1, r = 20, n) {
    return t.get('/agent/runs', { params: { page: e, pageSize: r, q: n || void 0 } })
  },
  detail(e) {
    return t.get(`/agent/runs/${e}`)
  },
  remove(e) {
    return t.delete(`/agent/runs/${e}`)
  },
  batchDelete(e) {
    return t.post('/agent/runs/batch-delete', { ids: e })
  }
}
export { s as a, o as m }
