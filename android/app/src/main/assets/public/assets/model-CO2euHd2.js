import { E as A, g as n, A as i, s, I as $ } from './index-DTPmbI92.js'
import { r } from './request-B60bV0HZ.js'
const P = {
    getDeepSeekModels() {
      return r.get('/models/deepseek')
    },
    getClaudeModels() {
      return r.get('/models/claude')
    },
    getChatGPTModels() {
      return r.get('/models/chatgpt')
    }
  },
  c = {
    list(o) {
      return r.get('/models', { params: o })
    },
    search(o) {
      return r.post('/models/search', { q: o })
    },
    toggleFavorite(o) {
      return r.post(`/models/${o}/favorite`)
    },
    setDefault(o) {
      return r.post(`/models/${o}/default`)
    },
    moveToGroup(o, u) {
      return r.post('/models/move', { modelIds: o, groupId: u })
    },
    listGroups() {
      return r.get('/models/groups')
    },
    createGroup(o) {
      return r.post('/models/groups', o)
    },
    deleteGroup(o) {
      return r.delete(`/models/groups/${o}`)
    }
  },
  k = A('model', () => {
    const o = n([]),
      u = n([]),
      g = n(0),
      f = n(!1),
      d = n(''),
      p = n(void 0),
      v = n('default'),
      h = i(() => o.value.filter(e => e.isFavorite)),
      y = i(() => o.value.find(e => e.isDefault) || null),
      G = i(() => {
        let e = o.value
        if (d.value) {
          const t = d.value.toLowerCase()
          e = e.filter(a => {
            var l, m
            return (
              ((l = a.displayName) == null ? void 0 : l.toLowerCase().includes(t)) ||
              ((m = a.modelName) == null ? void 0 : m.toLowerCase().includes(t))
            )
          })
        }
        return e
      }),
      w = i(() => {
        const e = new Map()
        return (
          u.value.forEach(t => e.set(t.id, [])),
          e.set('__ungrouped__', []),
          o.value.forEach(t => {
            const a = t.groupId || '__ungrouped__'
            ;(e.has(a) || e.set('__ungrouped__', []), e.get(a).push(t))
          }),
          e
        )
      })
    async function _(e) {
      f.value = !0
      try {
        const t = await c.list({ search: d.value || void 0, groupId: p.value, sort: v.value, ...e })
        t.code === 0 && t.data && ((o.value = t.data.models), (g.value = t.data.total))
      } catch {
        s('加载模型失败')
      } finally {
        f.value = !1
      }
    }
    async function M() {
      try {
        const e = await c.listGroups()
        e.code === 0 && (u.value = e.data || [])
      } catch {
        s('加载分组失败')
      }
    }
    async function I(e) {
      try {
        const t = await c.toggleFavorite(e)
        if (t.code === 0) {
          const a = o.value.findIndex(l => l.id === e)
          ;(a !== -1 && (o.value[a].isFavorite = t.data.isFavorite),
            s(t.data.isFavorite ? '已收藏' : '已取消收藏'))
        }
      } catch {
        s('操作失败')
      }
    }
    async function D(e) {
      try {
        ;(await c.setDefault(e)).code === 0 &&
          (o.value.forEach(a => {
            a.isDefault = a.id === e
          }),
          s('已设为默认模型'))
      } catch {
        s('设置失败')
      }
    }
    async function F(e) {
      try {
        const t = await c.createGroup(e)
        if (t.code === 0) return (u.value.push(t.data), s('分组创建成功'), t.data)
      } catch (t) {
        s(t.message || '创建失败')
      }
      return null
    }
    async function C(e) {
      try {
        ;(await $({
          title: '确认删除',
          message: '删除分组后，原分组下的模型将移至未分组。确定继续？',
          confirmButtonText: '删除',
          confirmButtonColor: '#ee0a24'
        }),
          await c.deleteGroup(e),
          (u.value = u.value.filter(t => t.id !== e)),
          o.value.forEach(t => {
            t.groupId === e && (t.groupId = null)
          }),
          s('分组已删除'))
      } catch {}
    }
    async function E(e, t) {
      try {
        const a = await c.moveToGroup(e, t)
        a.code === 0 &&
          (o.value.forEach(l => {
            e.includes(l.id) && (l.groupId = t)
          }),
          s(`已移动 ${a.data.updated} 个模型`))
      } catch {
        s('移动失败')
      }
    }
    function T(e) {
      d.value = e
    }
    function S(e) {
      v.value = e
    }
    function x(e) {
      p.value = e
    }
    return {
      models: o,
      groups: u,
      total: g,
      loading: f,
      searchQuery: d,
      activeGroupId: p,
      sortBy: v,
      favorites: h,
      defaultModel: y,
      filteredModels: G,
      groupedModels: w,
      fetchModels: _,
      fetchGroups: M,
      toggleFavorite: I,
      setDefault: D,
      createGroup: F,
      deleteGroup: C,
      moveToGroup: E,
      setSearch: T,
      setSort: S,
      setActiveGroup: x
    }
  })
export { P as m, k as u }
