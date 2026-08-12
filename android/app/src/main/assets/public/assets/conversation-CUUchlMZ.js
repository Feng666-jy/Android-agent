import { E as x, g as v } from './index-gd_PtegP.js'
import { a as N } from './agent-Bh8Q5wlv.js'
const u = 'agent.current_conversation',
  p = 'agent.conversations',
  S = 50
function l(o) {
  try {
    const n = localStorage.getItem(o)
    return n ? JSON.parse(n) : null
  } catch {
    return null
  }
}
function w(o, n) {
  try {
    localStorage.setItem(o, JSON.stringify(n))
  } catch {}
}
function m(o) {
  return !!o && typeof o == 'object' && typeof o.id == 'string' && typeof o.title == 'string'
}
const _ = x('conversation', () => {
  const o = v(l(u) && m(l(u)) ? l(u) : null),
    n = v([]),
    f = l(p)
  Array.isArray(f) && (n.value = f.filter(m))
  function i() {
    ;(w(u, o.value), w(p, n.value))
  }
  function C(t, e, a, r = 'completed') {
    const s = Date.now(),
      c = { id: t, title: e, modelId: a, status: r, createdAt: s, updatedAt: s }
    return ((o.value = c), d(c), i(), c)
  }
  function A(t, e, a) {
    const r = Date.now(),
      s = { id: t, title: e, modelId: a, status: 'active', createdAt: r, updatedAt: r }
    return ((o.value = s), d(s), i(), s)
  }
  function g() {
    const t = o.value
    t && ((t.status = 'completed'), (t.updatedAt = Date.now()), i())
  }
  function y() {
    ;((o.value = null), i())
  }
  function I(t) {
    var e
    ;((n.value = n.value.filter(a => a.id !== t)),
      ((e = o.value) == null ? void 0 : e.id) === t && (o.value = null),
      i())
  }
  function h(t, e, a) {
    const r = Date.now(),
      s = n.value.find(c => c.id === t)
    ;(s
      ? ((s.title = e), (s.modelId = a), (s.updatedAt = r))
      : d({ id: t, title: e, modelId: a, status: 'completed', createdAt: r, updatedAt: r }),
      i())
  }
  function D(t) {
    const e = t.trim().toLowerCase()
    return e
      ? n.value.filter(
          a => a.title.toLowerCase().includes(e) || a.modelId.toLowerCase().includes(e)
        )
      : n.value
  }
  async function E(t, e = 1, a = 20) {
    const r = await N.history(e, a, t)
    return r.code === 0 ? r.data : { list: [], total: 0, page: 1, pageSize: a }
  }
  function d(t) {
    const e = n.value.findIndex(a => a.id === t.id)
    e !== -1 ? (n.value[e] = { ...n.value[e], ...t }) : (n.value = [t, ...n.value].slice(0, S))
  }
  return {
    currentConversation: o,
    conversations: n,
    restore: C,
    createConversation: A,
    markCompleted: g,
    newConversation: y,
    deleteConversation: I,
    touchConversation: h,
    searchLocal: D,
    searchConversation: E,
    persist: i
  }
})
export { _ as u }
