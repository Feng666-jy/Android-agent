/*! Capacitor: https://capacitorjs.com/ - MIT License */ const Z = t => {
    const e = new Map()
    e.set('web', { name: 'web' })
    const r = t.CapacitorPlatforms || { currentPlatform: { name: 'web' }, platforms: e },
      o = (n, a) => {
        r.platforms.set(n, a)
      },
      i = n => {
        r.platforms.has(n) && (r.currentPlatform = r.platforms.get(n))
      }
    return ((r.addPlatform = o), (r.setPlatform = i), r)
  },
  N = t => (t.CapacitorPlatforms = Z(t)),
  W = N(
    typeof globalThis < 'u'
      ? globalThis
      : typeof self < 'u'
        ? self
        : typeof window < 'u'
          ? window
          : typeof global < 'u'
            ? global
            : {}
  )
W.addPlatform
W.setPlatform
var L
;(function (t) {
  ;((t.Unimplemented = 'UNIMPLEMENTED'), (t.Unavailable = 'UNAVAILABLE'))
})(L || (L = {}))
class S extends Error {
  constructor(e, r, o) {
    ;(super(e), (this.message = e), (this.code = r), (this.data = o))
  }
}
const ee = t => {
    var e, r
    return t != null && t.androidBridge
      ? 'android'
      : !(
            (r =
              (e = t == null ? void 0 : t.webkit) === null || e === void 0
                ? void 0
                : e.messageHandlers) === null || r === void 0
          ) && r.bridge
        ? 'ios'
        : 'web'
  },
  te = t => {
    var e, r, o, i, n
    const a = t.CapacitorCustomPlatform || null,
      s = t.Capacitor || {},
      f = (s.Plugins = s.Plugins || {}),
      l = t.CapacitorPlatforms,
      E = () => (a !== null ? a.name : ee(t)),
      P =
        ((e = l == null ? void 0 : l.currentPlatform) === null || e === void 0
          ? void 0
          : e.getPlatform) || E,
      x = () => P() !== 'web',
      F =
        ((r = l == null ? void 0 : l.currentPlatform) === null || r === void 0
          ? void 0
          : r.isNativePlatform) || x,
      I = c => {
        const d = A.get(c)
        return !!((d != null && d.platforms.has(P())) || _(c))
      },
      q =
        ((o = l == null ? void 0 : l.currentPlatform) === null || o === void 0
          ? void 0
          : o.isPluginAvailable) || I,
      G = c => {
        var d
        return (d = s.PluginHeaders) === null || d === void 0 ? void 0 : d.find(y => y.name === c)
      },
      _ =
        ((i = l == null ? void 0 : l.currentPlatform) === null || i === void 0
          ? void 0
          : i.getPluginHeader) || G,
      K = c => t.console.error(c),
      z = (c, d, y) => Promise.reject(`${y} does not have an implementation of "${d}".`),
      A = new Map(),
      V = (c, d = {}) => {
        const y = A.get(c)
        if (y)
          return (
            console.warn(
              `Capacitor plugin "${c}" already registered. Cannot register plugins twice.`
            ),
            y.proxy
          )
        const b = P(),
          C = _(c)
        let w
        const Q = async () => (
            !w && b in d
              ? (w = typeof d[b] == 'function' ? (w = await d[b]()) : (w = d[b]))
              : a !== null &&
                !w &&
                'web' in d &&
                (w = typeof d.web == 'function' ? (w = await d.web()) : (w = d.web)),
            w
          ),
          X = (u, g) => {
            var h, v
            if (C) {
              const p = C == null ? void 0 : C.methods.find(m => g === m.name)
              if (p)
                return p.rtype === 'promise'
                  ? m => s.nativePromise(c, g.toString(), m)
                  : (m, k) => s.nativeCallback(c, g.toString(), m, k)
              if (u) return (h = u[g]) === null || h === void 0 ? void 0 : h.bind(u)
            } else {
              if (u) return (v = u[g]) === null || v === void 0 ? void 0 : v.bind(u)
              throw new S(`"${c}" plugin is not implemented on ${b}`, L.Unimplemented)
            }
          },
          j = u => {
            let g
            const h = (...v) => {
              const p = Q().then(m => {
                const k = X(m, u)
                if (k) {
                  const $ = k(...v)
                  return ((g = $ == null ? void 0 : $.remove), $)
                } else throw new S(`"${c}.${u}()" is not implemented on ${b}`, L.Unimplemented)
              })
              return (u === 'addListener' && (p.remove = async () => g()), p)
            }
            return (
              (h.toString = () => `${u.toString()}() { [capacitor code] }`),
              Object.defineProperty(h, 'name', { value: u, writable: !1, configurable: !1 }),
              h
            )
          },
          H = j('addListener'),
          D = j('removeListener'),
          Y = (u, g) => {
            const h = H({ eventName: u }, g),
              v = async () => {
                const m = await h
                D({ eventName: u, callbackId: m }, g)
              },
              p = new Promise(m => h.then(() => m({ remove: v })))
            return (
              (p.remove = async () => {
                ;(console.warn("Using addListener() without 'await' is deprecated."), await v())
              }),
              p
            )
          },
          U = new Proxy(
            {},
            {
              get(u, g) {
                switch (g) {
                  case '$$typeof':
                    return
                  case 'toJSON':
                    return () => ({})
                  case 'addListener':
                    return C ? Y : H
                  case 'removeListener':
                    return D
                  default:
                    return j(g)
                }
              }
            }
          )
        return (
          (f[c] = U),
          A.set(c, {
            name: c,
            proxy: U,
            platforms: new Set([...Object.keys(d), ...(C ? [b] : [])])
          }),
          U
        )
      },
      J =
        ((n = l == null ? void 0 : l.currentPlatform) === null || n === void 0
          ? void 0
          : n.registerPlugin) || V
    return (
      s.convertFileSrc || (s.convertFileSrc = c => c),
      (s.getPlatform = P),
      (s.handleError = K),
      (s.isNativePlatform = F),
      (s.isPluginAvailable = q),
      (s.pluginMethodNoop = z),
      (s.registerPlugin = J),
      (s.Exception = S),
      (s.DEBUG = !!s.DEBUG),
      (s.isLoggingEnabled = !!s.isLoggingEnabled),
      (s.platform = s.getPlatform()),
      (s.isNative = s.isNativePlatform()),
      s
    )
  },
  re = t => (t.Capacitor = te(t)),
  O = re(
    typeof globalThis < 'u'
      ? globalThis
      : typeof self < 'u'
        ? self
        : typeof window < 'u'
          ? window
          : typeof global < 'u'
            ? global
            : {}
  ),
  T = O.registerPlugin
O.Plugins
class B {
  constructor(e) {
    ;((this.listeners = {}),
      (this.retainedEventArguments = {}),
      (this.windowListeners = {}),
      e &&
        (console.warn(
          `Capacitor WebPlugin "${e.name}" config object was deprecated in v3 and will be removed in v4.`
        ),
        (this.config = e)))
  }
  addListener(e, r) {
    let o = !1
    ;(this.listeners[e] || ((this.listeners[e] = []), (o = !0)), this.listeners[e].push(r))
    const n = this.windowListeners[e]
    ;(n && !n.registered && this.addWindowListener(n), o && this.sendRetainedArgumentsForEvent(e))
    const a = async () => this.removeListener(e, r)
    return Promise.resolve({ remove: a })
  }
  async removeAllListeners() {
    this.listeners = {}
    for (const e in this.windowListeners) this.removeWindowListener(this.windowListeners[e])
    this.windowListeners = {}
  }
  notifyListeners(e, r, o) {
    const i = this.listeners[e]
    if (!i) {
      if (o) {
        let n = this.retainedEventArguments[e]
        ;(n || (n = []), n.push(r), (this.retainedEventArguments[e] = n))
      }
      return
    }
    i.forEach(n => n(r))
  }
  hasListeners(e) {
    return !!this.listeners[e].length
  }
  registerWindowListener(e, r) {
    this.windowListeners[r] = {
      registered: !1,
      windowEventName: e,
      pluginEventName: r,
      handler: o => {
        this.notifyListeners(r, o)
      }
    }
  }
  unimplemented(e = 'not implemented') {
    return new O.Exception(e, L.Unimplemented)
  }
  unavailable(e = 'not available') {
    return new O.Exception(e, L.Unavailable)
  }
  async removeListener(e, r) {
    const o = this.listeners[e]
    if (!o) return
    const i = o.indexOf(r)
    ;(this.listeners[e].splice(i, 1),
      this.listeners[e].length || this.removeWindowListener(this.windowListeners[e]))
  }
  addWindowListener(e) {
    ;(window.addEventListener(e.windowEventName, e.handler), (e.registered = !0))
  }
  removeWindowListener(e) {
    e && (window.removeEventListener(e.windowEventName, e.handler), (e.registered = !1))
  }
  sendRetainedArgumentsForEvent(e) {
    const r = this.retainedEventArguments[e]
    r &&
      (delete this.retainedEventArguments[e],
      r.forEach(o => {
        this.notifyListeners(e, o)
      }))
  }
}
const R = t =>
    encodeURIComponent(t)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape),
  M = t => t.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
class ne extends B {
  async getCookies() {
    const e = document.cookie,
      r = {}
    return (
      e.split(';').forEach(o => {
        if (o.length <= 0) return
        let [i, n] = o.replace(/=/, 'CAP_COOKIE').split('CAP_COOKIE')
        ;((i = M(i).trim()), (n = M(n).trim()), (r[i] = n))
      }),
      r
    )
  }
  async setCookie(e) {
    try {
      const r = R(e.key),
        o = R(e.value),
        i = `; expires=${(e.expires || '').replace('expires=', '')}`,
        n = (e.path || '/').replace('path=', ''),
        a = e.url != null && e.url.length > 0 ? `domain=${e.url}` : ''
      document.cookie = `${r}=${o || ''}${i}; path=${n}; ${a};`
    } catch (r) {
      return Promise.reject(r)
    }
  }
  async deleteCookie(e) {
    try {
      document.cookie = `${e.key}=; Max-Age=0`
    } catch (r) {
      return Promise.reject(r)
    }
  }
  async clearCookies() {
    try {
      const e = document.cookie.split(';') || []
      for (const r of e)
        document.cookie = r
          .replace(/^ +/, '')
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
    } catch (e) {
      return Promise.reject(e)
    }
  }
  async clearAllCookies() {
    try {
      await this.clearCookies()
    } catch (e) {
      return Promise.reject(e)
    }
  }
}
T('CapacitorCookies', { web: () => new ne() })
const se = async t =>
    new Promise((e, r) => {
      const o = new FileReader()
      ;((o.onload = () => {
        const i = o.result
        e(i.indexOf(',') >= 0 ? i.split(',')[1] : i)
      }),
        (o.onerror = i => r(i)),
        o.readAsDataURL(t))
    }),
  oe = (t = {}) => {
    const e = Object.keys(t)
    return Object.keys(t)
      .map(i => i.toLocaleLowerCase())
      .reduce((i, n, a) => ((i[n] = t[e[a]]), i), {})
  },
  ie = (t, e = !0) =>
    t
      ? Object.entries(t)
          .reduce((o, i) => {
            const [n, a] = i
            let s, f
            return (
              Array.isArray(a)
                ? ((f = ''),
                  a.forEach(l => {
                    ;((s = e ? encodeURIComponent(l) : l), (f += `${n}=${s}&`))
                  }),
                  f.slice(0, -1))
                : ((s = e ? encodeURIComponent(a) : a), (f = `${n}=${s}`)),
              `${o}&${f}`
            )
          }, '')
          .substr(1)
      : null,
  ae = (t, e = {}) => {
    const r = Object.assign({ method: t.method || 'GET', headers: t.headers }, e),
      i = oe(t.headers)['content-type'] || ''
    if (typeof t.data == 'string') r.body = t.data
    else if (i.includes('application/x-www-form-urlencoded')) {
      const n = new URLSearchParams()
      for (const [a, s] of Object.entries(t.data || {})) n.set(a, s)
      r.body = n.toString()
    } else if (i.includes('multipart/form-data') || t.data instanceof FormData) {
      const n = new FormData()
      if (t.data instanceof FormData)
        t.data.forEach((s, f) => {
          n.append(f, s)
        })
      else for (const s of Object.keys(t.data)) n.append(s, t.data[s])
      r.body = n
      const a = new Headers(r.headers)
      ;(a.delete('content-type'), (r.headers = a))
    } else
      (i.includes('application/json') || typeof t.data == 'object') &&
        (r.body = JSON.stringify(t.data))
    return r
  }
class le extends B {
  async request(e) {
    const r = ae(e, e.webFetchExtra),
      o = ie(e.params, e.shouldEncodeUrlParams),
      i = o ? `${e.url}?${o}` : e.url,
      n = await fetch(i, r),
      a = n.headers.get('content-type') || ''
    let { responseType: s = 'text' } = n.ok ? e : {}
    a.includes('application/json') && (s = 'json')
    let f, l
    switch (s) {
      case 'arraybuffer':
      case 'blob':
        ;((l = await n.blob()), (f = await se(l)))
        break
      case 'json':
        f = await n.json()
        break
      case 'document':
      case 'text':
      default:
        f = await n.text()
    }
    const E = {}
    return (
      n.headers.forEach((P, x) => {
        E[x] = P
      }),
      { data: f, headers: E, status: n.status, url: n.url }
    )
  }
  async get(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: 'GET' }))
  }
  async post(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: 'POST' }))
  }
  async put(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: 'PUT' }))
  }
  async patch(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: 'PATCH' }))
  }
  async delete(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: 'DELETE' }))
  }
}
T('CapacitorHttp', { web: () => new le() })
const ce = T('DeviceBridge')
function de() {
  var t, e
  return (
    typeof window < 'u' &&
    !!(
      (e =
        (t = window == null ? void 0 : window.Capacitor) == null ? void 0 : t.isNativePlatform) !=
        null && e.call(t)
    )
  )
}
export { ce as D, de as i }
