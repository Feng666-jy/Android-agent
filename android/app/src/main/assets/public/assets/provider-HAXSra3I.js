import { E as x, g as c, A as v, s as a, I as B } from './index-CRvy0G29.js'
import { p as n } from './provider-r4aRWO2Y.js'
const b = x('provider', () => {
  const s = c([]),
    i = c(null),
    l = c(!1),
    o = c(!1),
    u = c(new Map()),
    f = v(() => s.value.filter(e => e.isEnabled)),
    h = v(() => [...s.value].sort((e, t) => e.sortOrder - t.sortOrder))
  async function y(e = !1) {
    l.value = !0
    try {
      const t = await n.getAll(e)
      s.value = t.data || []
    } catch {
      a('加载供应商失败')
    } finally {
      l.value = !1
    }
  }
  async function p(e) {
    l.value = !0
    try {
      const t = await n.getById(e)
      return ((i.value = t.data), t.data)
    } catch {
      return (a('加载供应商详情失败'), null)
    } finally {
      l.value = !1
    }
  }
  async function g(e) {
    try {
      const t = await n.create(e)
      return (s.value.push(t.data), a('供应商创建成功'), t.data)
    } catch (t) {
      return (a(t.message || '创建失败'), null)
    }
  }
  async function w(e, t) {
    try {
      const r = await n.update(e, t),
        d = s.value.findIndex(I => I.id === e)
      return (d !== -1 && (s.value[d] = r.data), a('供应商更新成功'), r.data)
    } catch (r) {
      return (a(r.message || '更新失败'), null)
    }
  }
  async function m(e) {
    try {
      ;(await B({
        title: '确认删除',
        message: '删除供应商将同时删除其下所有模型，确定继续？',
        confirmButtonText: '删除',
        confirmButtonColor: '#ee0a24'
      }),
        await n.remove(e),
        (s.value = s.value.filter(t => t.id !== e)),
        a('供应商已删除'))
    } catch {}
  }
  async function P(e) {
    o.value = !0
    try {
      const t = await n.healthCheck(e)
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
      ;(e = (await n.healthCheckAll()).data) == null ||
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
      return (await n.discover(e)).data
    } catch {
      return (a('获取上游模型失败'), null)
    }
  }
  async function A(e, t) {
    try {
      return (await n.importModels(e, t)).data
    } catch {
      return (a('导入模型失败'), null)
    }
  }
  return {
    providers: s,
    currentProvider: i,
    loading: l,
    healthChecking: o,
    healthMap: u,
    enabledProviders: f,
    sortedProviders: h,
    fetchProviders: y,
    fetchProvider: p,
    createProvider: g,
    updateProvider: w,
    deleteProvider: m,
    runHealthCheck: P,
    runHealthCheckAll: M,
    getHealth: C,
    discoverModels: k,
    importModels: A
  }
})
export { b as u }
