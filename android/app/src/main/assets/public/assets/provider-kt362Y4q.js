import { r as e } from './request-B60bV0HZ.js'
const s = {
  getAll(r = !1) {
    return e.get(`/providers?include_disabled=${r}`)
  },
  getById(r) {
    return e.get(`/providers/${r}`)
  },
  create(r) {
    return e.post('/providers', r)
  },
  update(r, t) {
    return e.put(`/providers/${r}`, t)
  },
  remove(r) {
    return e.delete(`/providers/${r}`)
  },
  healthCheck(r) {
    return e.post(`/providers/${r}/health-check`)
  },
  healthCheckAll() {
    return e.get('/providers/health-check-all')
  },
  reorder(r) {
    return e.post('/providers/reorder', { providerIds: r })
  },
  discover(r) {
    return e.post(`/providers/${r}/discover`)
  },
  importModels(r, t) {
    return e.post(`/providers/${r}/models/import`, { modelNames: t })
  }
}
export { s as p }
