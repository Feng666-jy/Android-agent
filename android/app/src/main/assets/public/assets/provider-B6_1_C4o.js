import { H, r as c, C as v, l as a, L as I } from './index-B7ocQHAM.js'
import { p as s } from './provider-DkfW0_eM.js'
const E = H('provider', () => {
  const n = c([]),
    i = c(null),
    l = c(!1),
    o = c(!1),
    u = c(new Map()),
    f = v(() => n.value.filter(e => e.isEnabled)),
    h = v(() => [...n.value].sort((e, t) => e.sortOrder - t.sortOrder))
  async function y(e = !1) {
    l.value = !0
    try {
      const t = await s.getAll(e)
      n.value = t.data || []
    } catch {
      a('加载供应商失败')
    } finally {
      l.value = !1
    }
  }
  async function p(e) {
    l.value = !0
    try {
      const t = await s.getById(e)
      return ((i.value = t.data), t.data)
    } catch {
      return (a('加载供应商详情失败'), null)
    } finally {
      l.value = !1
    }
  }
  async function w(e) {
    try {
      const t = await s.create(e)
      return (n.value.push(t.data), a('供应商创建成功'), t.data)
    } catch (t) {
      return (a(t.message || '创建失败'), null)
    }
  }
  async function g(e, t) {
    try {
      const r = await s.update(e, t),
        d = n.value.findIndex(A => A.id === e)
      return (d !== -1 && (n.value[d] = r.data), a('供应商更新成功'), r.data)
    } catch (r) {
      return (a(r.message || '更新失败'), null)
    }
  }
  async function m(e) {
    try {
      ;(await I({
        title: '确认删除',
        message: '删除供应商将同时删除其下所有模型，确定继续？',
        confirmButtonText: '删除',
        confirmButtonColor: '#ee0a24'
      }),
        await s.remove(e),
        (n.value = n.value.filter(t => t.id !== e)),
        a('供应商已删除'))
    } catch {}
  }
  async function P(e) {
    o.value = !0
    try {
      const t = await s.healthCheck(e)
      return (u.value.set(e, t.data), t.data)
    } catch {
      return (a('健康检查失败'), null)
    } finally {
      o.value = !1
    }
  }
  async function M() {
    var e
    o.value = !0
    try {
      ;(e = (await s.healthCheckAll()).data) == null ||
        e.forEach(r => {
          u.value.set(r.providerId, {
            status: r.status,
            latencyMs: r.latencyMs,
            errorMessage: r.errorMessage
          })
        })
    } catch {
      a('批量健康检查失败')
    } finally {
      o.value = !1
    }
  }
  function C(e) {
    return u.value.get(e)
  }
  async function k(e) {
    try {
      return (await s.discover(e)).data
    } catch {
      return (a('获取上游模型失败'), null)
    }
  }
  async function x(e, t) {
    try {
      return (await s.importModels(e, t)).data
    } catch {
      return (a('导入模型失败'), null)
    }
  }
  return {
    providers: n,
    currentProvider: i,
    loading: l,
    healthChecking: o,
    healthMap: u,
    enabledProviders: f,
    sortedProviders: h,
    fetchProviders: y,
    fetchProvider: p,
    createProvider: w,
    updateProvider: g,
    deleteProvider: m,
    runHealthCheck: P,
    runHealthCheckAll: M,
    getHealth: C,
    discoverModels: k,
    importModels: x
  }
})
export { E as u }
