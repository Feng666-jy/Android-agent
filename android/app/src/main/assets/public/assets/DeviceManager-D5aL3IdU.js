import {
  d as ue,
  B as ve,
  c as C,
  e as d,
  t as w,
  l as H,
  i as X,
  k as W,
  v as F,
  F as te,
  x as se,
  g as _,
  s as U,
  o as L,
  f as fe,
  _ as me
} from './index-gd_PtegP.js'
import { r as ge } from './request-DT7itpYf.js'
const pe = {
  list() {
    return ge.get('/v2/devices')
  }
}
/*! Capacitor: https://capacitorjs.com/ - MIT License */ const he = s => {
    const e = new Map()
    e.set('web', { name: 'web' })
    const t = s.CapacitorPlatforms || { currentPlatform: { name: 'web' }, platforms: e },
      r = (n, c) => {
        t.platforms.set(n, c)
      },
      i = n => {
        t.platforms.has(n) && (t.currentPlatform = t.platforms.get(n))
      }
    return ((t.addPlatform = r), (t.setPlatform = i), t)
  },
  we = s => (s.CapacitorPlatforms = he(s)),
  ie = we(
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
ie.addPlatform
ie.setPlatform
var D
;(function (s) {
  ;((s.Unimplemented = 'UNIMPLEMENTED'), (s.Unavailable = 'UNAVAILABLE'))
})(D || (D = {}))
class Y extends Error {
  constructor(e, t, r) {
    ;(super(e), (this.message = e), (this.code = t), (this.data = r))
  }
}
const _e = s => {
    var e, t
    return s != null && s.androidBridge
      ? 'android'
      : !(
            (t =
              (e = s == null ? void 0 : s.webkit) === null || e === void 0
                ? void 0
                : e.messageHandlers) === null || t === void 0
          ) && t.bridge
        ? 'ios'
        : 'web'
  },
  be = s => {
    var e, t, r, i, n
    const c = s.CapacitorCustomPlatform || null,
      a = s.Capacitor || {},
      v = (a.Plugins = a.Plugins || {}),
      u = s.CapacitorPlatforms,
      $ = () => (c !== null ? c.name : _e(s)),
      b =
        ((e = u == null ? void 0 : u.currentPlatform) === null || e === void 0
          ? void 0
          : e.getPlatform) || $,
      y = () => b() !== 'web',
      S =
        ((t = u == null ? void 0 : u.currentPlatform) === null || t === void 0
          ? void 0
          : t.isNativePlatform) || y,
      V = g => {
        const m = f.get(g)
        return !!((m != null && m.platforms.has(b())) || M(g))
      },
      q =
        ((r = u == null ? void 0 : u.currentPlatform) === null || r === void 0
          ? void 0
          : r.isPluginAvailable) || V,
      G = g => {
        var m
        return (m = a.PluginHeaders) === null || m === void 0 ? void 0 : m.find(E => E.name === g)
      },
      M =
        ((i = u == null ? void 0 : u.currentPlatform) === null || i === void 0
          ? void 0
          : i.getPluginHeader) || G,
      K = g => s.console.error(g),
      z = (g, m, E) => Promise.reject(`${E} does not have an implementation of "${m}".`),
      f = new Map(),
      o = (g, m = {}) => {
        const E = f.get(g)
        if (E)
          return (
            console.warn(
              `Capacitor plugin "${g}" already registered. Cannot register plugins twice.`
            ),
            E.proxy
          )
        const A = b(),
          j = M(g)
        let x
        const le = async () => (
            !x && A in m
              ? (x = typeof m[A] == 'function' ? (x = await m[A]()) : (x = m[A]))
              : c !== null &&
                !x &&
                'web' in m &&
                (x = typeof m.web == 'function' ? (x = await m.web()) : (x = m.web)),
            x
          ),
          ce = (p, h) => {
            var k, T
            if (j) {
              const O = j == null ? void 0 : j.methods.find(P => h === P.name)
              if (O)
                return O.rtype === 'promise'
                  ? P => a.nativePromise(g, h.toString(), P)
                  : (P, I) => a.nativeCallback(g, h.toString(), P, I)
              if (p) return (k = p[h]) === null || k === void 0 ? void 0 : k.bind(p)
            } else {
              if (p) return (T = p[h]) === null || T === void 0 ? void 0 : T.bind(p)
              throw new Y(`"${g}" plugin is not implemented on ${A}`, D.Unimplemented)
            }
          },
          J = p => {
            let h
            const k = (...T) => {
              const O = le().then(P => {
                const I = ce(P, p)
                if (I) {
                  const B = I(...T)
                  return ((h = B == null ? void 0 : B.remove), B)
                } else throw new Y(`"${g}.${p}()" is not implemented on ${A}`, D.Unimplemented)
              })
              return (p === 'addListener' && (O.remove = async () => h()), O)
            }
            return (
              (k.toString = () => `${p.toString()}() { [capacitor code] }`),
              Object.defineProperty(k, 'name', { value: p, writable: !1, configurable: !1 }),
              k
            )
          },
          N = J('addListener'),
          ee = J('removeListener'),
          de = (p, h) => {
            const k = N({ eventName: p }, h),
              T = async () => {
                const P = await k
                ee({ eventName: p, callbackId: P }, h)
              },
              O = new Promise(P => k.then(() => P({ remove: T })))
            return (
              (O.remove = async () => {
                ;(console.warn("Using addListener() without 'await' is deprecated."), await T())
              }),
              O
            )
          },
          Q = new Proxy(
            {},
            {
              get(p, h) {
                switch (h) {
                  case '$$typeof':
                    return
                  case 'toJSON':
                    return () => ({})
                  case 'addListener':
                    return j ? de : N
                  case 'removeListener':
                    return ee
                  default:
                    return J(h)
                }
              }
            }
          )
        return (
          (v[g] = Q),
          f.set(g, {
            name: g,
            proxy: Q,
            platforms: new Set([...Object.keys(m), ...(j ? [A] : [])])
          }),
          Q
        )
      },
      l =
        ((n = u == null ? void 0 : u.currentPlatform) === null || n === void 0
          ? void 0
          : n.registerPlugin) || o
    return (
      a.convertFileSrc || (a.convertFileSrc = g => g),
      (a.getPlatform = b),
      (a.handleError = K),
      (a.isNativePlatform = S),
      (a.isPluginAvailable = q),
      (a.pluginMethodNoop = z),
      (a.registerPlugin = l),
      (a.Exception = Y),
      (a.DEBUG = !!a.DEBUG),
      (a.isLoggingEnabled = !!a.isLoggingEnabled),
      (a.platform = a.getPlatform()),
      (a.isNative = a.isNativePlatform()),
      a
    )
  },
  ye = s => (s.Capacitor = be(s)),
  R = ye(
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
  Z = R.registerPlugin
R.Plugins
class oe {
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
  addListener(e, t) {
    let r = !1
    ;(this.listeners[e] || ((this.listeners[e] = []), (r = !0)), this.listeners[e].push(t))
    const n = this.windowListeners[e]
    ;(n && !n.registered && this.addWindowListener(n), r && this.sendRetainedArgumentsForEvent(e))
    const c = async () => this.removeListener(e, t)
    return Promise.resolve({ remove: c })
  }
  async removeAllListeners() {
    this.listeners = {}
    for (const e in this.windowListeners) this.removeWindowListener(this.windowListeners[e])
    this.windowListeners = {}
  }
  notifyListeners(e, t, r) {
    const i = this.listeners[e]
    if (!i) {
      if (r) {
        let n = this.retainedEventArguments[e]
        ;(n || (n = []), n.push(t), (this.retainedEventArguments[e] = n))
      }
      return
    }
    i.forEach(n => n(t))
  }
  hasListeners(e) {
    return !!this.listeners[e].length
  }
  registerWindowListener(e, t) {
    this.windowListeners[t] = {
      registered: !1,
      windowEventName: e,
      pluginEventName: t,
      handler: r => {
        this.notifyListeners(t, r)
      }
    }
  }
  unimplemented(e = 'not implemented') {
    return new R.Exception(e, D.Unimplemented)
  }
  unavailable(e = 'not available') {
    return new R.Exception(e, D.Unavailable)
  }
  async removeListener(e, t) {
    const r = this.listeners[e]
    if (!r) return
    const i = r.indexOf(t)
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
    const t = this.retainedEventArguments[e]
    t &&
      (delete this.retainedEventArguments[e],
      t.forEach(r => {
        this.notifyListeners(e, r)
      }))
  }
}
const ne = s =>
    encodeURIComponent(s)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape),
  ae = s => s.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
class Pe extends oe {
  async getCookies() {
    const e = document.cookie,
      t = {}
    return (
      e.split(';').forEach(r => {
        if (r.length <= 0) return
        let [i, n] = r.replace(/=/, 'CAP_COOKIE').split('CAP_COOKIE')
        ;((i = ae(i).trim()), (n = ae(n).trim()), (t[i] = n))
      }),
      t
    )
  }
  async setCookie(e) {
    try {
      const t = ne(e.key),
        r = ne(e.value),
        i = `; expires=${(e.expires || '').replace('expires=', '')}`,
        n = (e.path || '/').replace('path=', ''),
        c = e.url != null && e.url.length > 0 ? `domain=${e.url}` : ''
      document.cookie = `${t}=${r || ''}${i}; path=${n}; ${c};`
    } catch (t) {
      return Promise.reject(t)
    }
  }
  async deleteCookie(e) {
    try {
      document.cookie = `${e.key}=; Max-Age=0`
    } catch (t) {
      return Promise.reject(t)
    }
  }
  async clearCookies() {
    try {
      const e = document.cookie.split(';') || []
      for (const t of e)
        document.cookie = t
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
Z('CapacitorCookies', { web: () => new Pe() })
const ke = async s =>
    new Promise((e, t) => {
      const r = new FileReader()
      ;((r.onload = () => {
        const i = r.result
        e(i.indexOf(',') >= 0 ? i.split(',')[1] : i)
      }),
        (r.onerror = i => t(i)),
        r.readAsDataURL(s))
    }),
  Ce = (s = {}) => {
    const e = Object.keys(s)
    return Object.keys(s)
      .map(i => i.toLocaleLowerCase())
      .reduce((i, n, c) => ((i[n] = s[e[c]]), i), {})
  },
  Le = (s, e = !0) =>
    s
      ? Object.entries(s)
          .reduce((r, i) => {
            const [n, c] = i
            let a, v
            return (
              Array.isArray(c)
                ? ((v = ''),
                  c.forEach(u => {
                    ;((a = e ? encodeURIComponent(u) : u), (v += `${n}=${a}&`))
                  }),
                  v.slice(0, -1))
                : ((a = e ? encodeURIComponent(c) : c), (v = `${n}=${a}`)),
              `${r}&${v}`
            )
          }, '')
          .substr(1)
      : null,
  Ee = (s, e = {}) => {
    const t = Object.assign({ method: s.method || 'GET', headers: s.headers }, e),
      i = Ce(s.headers)['content-type'] || ''
    if (typeof s.data == 'string') t.body = s.data
    else if (i.includes('application/x-www-form-urlencoded')) {
      const n = new URLSearchParams()
      for (const [c, a] of Object.entries(s.data || {})) n.set(c, a)
      t.body = n.toString()
    } else if (i.includes('multipart/form-data') || s.data instanceof FormData) {
      const n = new FormData()
      if (s.data instanceof FormData)
        s.data.forEach((a, v) => {
          n.append(v, a)
        })
      else for (const a of Object.keys(s.data)) n.append(a, s.data[a])
      t.body = n
      const c = new Headers(t.headers)
      ;(c.delete('content-type'), (t.headers = c))
    } else
      (i.includes('application/json') || typeof s.data == 'object') &&
        (t.body = JSON.stringify(s.data))
    return t
  }
class xe extends oe {
  async request(e) {
    const t = Ee(e, e.webFetchExtra),
      r = Le(e.params, e.shouldEncodeUrlParams),
      i = r ? `${e.url}?${r}` : e.url,
      n = await fetch(i, t),
      c = n.headers.get('content-type') || ''
    let { responseType: a = 'text' } = n.ok ? e : {}
    c.includes('application/json') && (a = 'json')
    let v, u
    switch (a) {
      case 'arraybuffer':
      case 'blob':
        ;((u = await n.blob()), (v = await ke(u)))
        break
      case 'json':
        v = await n.json()
        break
      case 'document':
      case 'text':
      default:
        v = await n.text()
    }
    const $ = {}
    return (
      n.headers.forEach((b, y) => {
        $[y] = b
      }),
      { data: v, headers: $, status: n.status, url: n.url }
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
Z('CapacitorHttp', { web: () => new xe() })
const re = Z('DeviceBridge')
function $e() {
  var s, e
  return (
    typeof window < 'u' &&
    !!(
      (e =
        (s = window == null ? void 0 : window.Capacitor) == null ? void 0 : s.isNativePlatform) !=
        null && e.call(s)
    )
  )
}
const Te = { class: 'device-manager' },
  Oe = { key: 0, class: 'device-manager__error' },
  Ue = { class: 'device-manager__card' },
  Ae = { class: 'device-manager__form-row' },
  je = { class: 'device-manager__card-actions' },
  De = ['disabled'],
  Se = { key: 0, class: 'device-manager__status is-ok' },
  Me = { class: 'device-manager__card' },
  Ie = { class: 'device-manager__form-row' },
  Be = ['disabled'],
  He = { class: 'device-manager__card' },
  We = { key: 0, class: 'device-manager__loading' },
  Fe = { key: 1, class: 'device-manager__list' },
  Re = { class: 'device-manager__item-main' },
  Ve = { class: 'device-manager__item-title' },
  qe = { class: 'device-manager__item-desc' },
  Ge = { class: 'device-manager__item-caps' },
  Ke = { key: 2, class: 'device-manager__empty' },
  ze = ue({
    __name: 'DeviceManager',
    setup(s) {
      const e = _(!1),
        t = _(!1),
        r = _(!1),
        i = _(''),
        n = _('未连接'),
        c = _('ws://192.168.1.100:3000'),
        a = _(''),
        v = _({ username: '', password: '' }),
        u = _(!1),
        $ = _([]),
        b = _(!1),
        y = _('')
      ve(async () => {
        ;((e.value = $e()),
          e.value || (n.value = '浏览器环境：原生桥不可用，仅可预览设备列表'),
          await S())
      })
      async function S() {
        var f, o
        ;((b.value = !0), (y.value = ''))
        try {
          const l = await pe.list()
          $.value = [
            ...(((f = l.data) == null ? void 0 : f.online) ?? []),
            ...(((o = l.data) == null ? void 0 : o.offline) ?? [])
          ]
        } catch (l) {
          y.value = l.message || '设备列表加载失败'
        } finally {
          b.value = !1
        }
      }
      async function V() {
        if (!v.value.username || !v.value.password) {
          U('请输入用户名和密码')
          return
        }
        u.value = !0
        try {
          let f = c.value.trim().replace(/\/+$/, '')
          f = f.replace(/^ws:\/\//, 'http://').replace(/^wss:\/\//, 'https://')
          const o = await fetch(`${f}/api/user/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: v.value.username, password: v.value.password })
            }),
            l = await o.json()
          if (!o.ok || l.code !== 0) throw new Error(l.message || `登录失败 (HTTP ${o.status})`)
          ;((a.value = l.data.token), U('Token 已获取'))
        } catch (f) {
          U(f.message || '登录失败')
        } finally {
          u.value = !1
        }
      }
      function q(f) {
        const o = f.trim().replace(/\/+$/, '')
        return o.startsWith('http://')
          ? 'ws://' + o.slice(7)
          : o.startsWith('https://')
            ? 'wss://' + o.slice(8)
            : o
      }
      async function G() {
        if (!e.value) {
          U('请在手机 App 内操作（浏览器无法调用原生桥）')
          return
        }
        if (!a.value.trim()) {
          U('请先获取或粘贴 Token')
          return
        }
        ;((t.value = !0), (y.value = ''))
        try {
          const f = await re.connect({ serverUrl: q(c.value), token: a.value.trim() })
          ;((r.value = !0),
            (i.value = f.deviceId),
            (n.value = '已连接'),
            U('设备已连接'),
            await S())
        } catch (f) {
          ;((y.value = f.message || '连接失败'), U('连接失败'))
        } finally {
          t.value = !1
        }
      }
      async function M() {
        if (e.value)
          try {
            ;(await re.disconnect(), (r.value = !1), (n.value = '已断开'), U('已断开'))
          } catch (f) {
            y.value = f.message || '断开失败'
          }
      }
      const K = { native: 'Native 工具', a11y: '无障碍', vision: '截图' }
      function z(f, o) {
        var l
        return (l = f.capabilities) != null && l[o] ? '已启用' : '未启用'
      }
      return (f, o) => (
        L(),
        C('div', Te, [
          d('header', { class: 'device-manager__header' }, [
            o[5] || (o[5] = d('h1', { class: 'device-manager__title' }, '设备连接', -1)),
            d(
              'button',
              { class: 'device-manager__btn-icon', 'aria-label': '刷新设备列表', onClick: S },
              [
                ...(o[4] ||
                  (o[4] = [
                    d(
                      'svg',
                      {
                        width: '16',
                        height: '16',
                        viewBox: '0 0 24 24',
                        fill: 'none',
                        stroke: 'currentColor',
                        'stroke-width': '2.5',
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round'
                      },
                      [
                        d('polyline', { points: '23 4 23 10 17 10' }),
                        d('path', { d: 'M20.49 15a9 9 0 1 1-2.12-9.36L23 10' })
                      ],
                      -1
                    )
                  ]))
              ]
            )
          ]),
          y.value ? (L(), C('div', Oe, w(y.value), 1)) : H('', !0),
          d(
            'div',
            { class: X(['device-manager__env', e.value ? 'is-native' : 'is-web']) },
            w(
              e.value ? '📱 Capacitor 原生环境（可连接）' : '🌐 浏览器环境（仅预览，原生桥不可用）'
            ),
            3
          ),
          d('div', Ue, [
            o[6] || (o[6] = d('div', { class: 'device-manager__card-title' }, '连接服务器', -1)),
            W(
              d(
                'input',
                {
                  'onUpdate:modelValue': o[0] || (o[0] = l => (c.value = l)),
                  class: 'device-manager__input',
                  placeholder: 'ws://192.168.1.100:3000（改为你电脑的局域网 IP）'
                },
                null,
                512
              ),
              [[F, c.value]]
            ),
            d('div', Ae, [
              W(
                d(
                  'input',
                  {
                    'onUpdate:modelValue': o[1] || (o[1] = l => (a.value = l)),
                    class: 'device-manager__input',
                    placeholder: 'JWT Token（登录后获取）',
                    type: 'password'
                  },
                  null,
                  512
                ),
                [[F, a.value]]
              )
            ]),
            d('div', je, [
              d(
                'button',
                { class: 'device-manager__btn-primary', disabled: t.value, onClick: G },
                w(t.value ? '连接中...' : r.value ? '重新连接' : '连接设备'),
                9,
                De
              ),
              r.value
                ? (L(),
                  C(
                    'button',
                    { key: 0, class: 'device-manager__btn-danger', onClick: M },
                    ' 断开 '
                  ))
                : H('', !0)
            ]),
            r.value ? (L(), C('div', Se, w(n.value) + ' · Device ID: ' + w(i.value), 1)) : H('', !0)
          ]),
          d('div', Me, [
            o[7] ||
              (o[7] = d(
                'div',
                { class: 'device-manager__card-title' },
                '获取 Token（电脑同账号登录）',
                -1
              )),
            d('div', Ie, [
              W(
                d(
                  'input',
                  {
                    'onUpdate:modelValue': o[2] || (o[2] = l => (v.value.username = l)),
                    class: 'device-manager__input',
                    placeholder: '用户名',
                    maxlength: '30'
                  },
                  null,
                  512
                ),
                [[F, v.value.username]]
              ),
              W(
                d(
                  'input',
                  {
                    'onUpdate:modelValue': o[3] || (o[3] = l => (v.value.password = l)),
                    class: 'device-manager__input',
                    placeholder: '密码',
                    type: 'password',
                    maxlength: '50'
                  },
                  null,
                  512
                ),
                [[F, v.value.password]]
              )
            ]),
            d(
              'button',
              { class: 'device-manager__btn-ghost', disabled: u.value, onClick: V },
              w(u.value ? '获取中...' : '获取 Token 并填入'),
              9,
              Be
            )
          ]),
          d('div', He, [
            o[8] ||
              (o[8] = d(
                'div',
                { class: 'device-manager__card-title' },
                '设备列表（后端视角）',
                -1
              )),
            b.value
              ? (L(), C('div', We, '加载中...'))
              : (L(),
                C('ul', Fe, [
                  (L(!0),
                  C(
                    te,
                    null,
                    se(
                      $.value,
                      l => (
                        L(),
                        C('li', { key: l.id, class: 'device-manager__item' }, [
                          d('div', Re, [
                            d('div', Ve, [
                              fe(w(l.model || '未知设备') + ' ', 1),
                              d(
                                'span',
                                {
                                  class: X([
                                    'device-manager__badge',
                                    l.status === 'online' ? 'is-online' : 'is-offline'
                                  ])
                                },
                                w(l.status === 'online' ? '在线' : '离线'),
                                3
                              )
                            ]),
                            d(
                              'div',
                              qe,
                              w(l.deviceId) + ' · ' + w(l.platform) + ' · v' + w(l.appVersion),
                              1
                            ),
                            d('div', Ge, [
                              (L(),
                              C(
                                te,
                                null,
                                se(K, (g, m) => {
                                  var E
                                  return d(
                                    'span',
                                    {
                                      key: m,
                                      class: X([
                                        'device-manager__cap',
                                        { 'is-on': (E = l.capabilities) == null ? void 0 : E[m] }
                                      ])
                                    },
                                    w(g) + ':' + w(z(l, m)),
                                    3
                                  )
                                }),
                                64
                              ))
                            ])
                          ])
                        ])
                      )
                    ),
                    128
                  ))
                ])),
            !$.value.length && !b.value
              ? (L(), C('div', Ke, ' 暂无设备。手机 App 连接后这里会出现在线设备。 '))
              : H('', !0)
          ])
        ])
      )
    }
  }),
  Xe = me(ze, [['__scopeId', 'data-v-7b57b616']])
export { Xe as default }
