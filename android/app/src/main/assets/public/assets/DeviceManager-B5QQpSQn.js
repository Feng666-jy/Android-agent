import {
  d as L,
  r as i,
  s as U,
  D as W,
  c as l,
  f as s,
  t as n,
  i as w,
  m as C,
  q as k,
  v as y,
  F as V,
  z as B,
  l as r,
  o,
  j as q,
  _ as E
} from './index-B7ocQHAM.js'
import { i as J, D as N } from './device-bridge-BO8---nf.js'
import { r as O } from './request-eyLhzUlJ.js'
const H = {
    list() {
      return O.get('/v2/devices')
    }
  },
  G = { class: 'device-manager' },
  K = { key: 0, class: 'device-manager__error' },
  Q = { class: 'device-manager__card' },
  R = { class: 'device-manager__form-row' },
  X = { class: 'device-manager__card-actions' },
  Y = ['disabled'],
  Z = { key: 0, class: 'device-manager__status is-ok' },
  ee = { class: 'device-manager__card' },
  ae = { class: 'device-manager__form-row' },
  se = ['disabled'],
  te = { class: 'device-manager__card' },
  ne = { key: 0, class: 'device-manager__loading' },
  ie = { key: 1, class: 'device-manager__list' },
  le = { class: 'device-manager__item-main' },
  re = { class: 'device-manager__item-title' },
  oe = { class: 'device-manager__item-desc' },
  ce = { class: 'device-manager__item-caps' },
  de = { key: 2, class: 'device-manager__empty' },
  ve = L({
    __name: 'DeviceManager',
    setup(ue) {
      const v = i(!1),
        p = i(!1),
        _ = i(!1),
        x = i(''),
        g = i('未连接')
      function S() {
        const t = U.getServerBase()
        return t ? 'ws://' + t.replace(/^https?:\/\//, '').replace(/\/+$/, '') : ''
      }
      const u = i(S()),
        m = i(U.getToken() || ''),
        c = i({ username: '', password: '' }),
        f = i(!1),
        b = i([]),
        h = i(!1),
        d = i('')
      W(async () => {
        ;((v.value = J()),
          v.value || (g.value = '浏览器环境：原生桥不可用，仅可预览设备列表'),
          await T())
      })
      async function T() {
        var t, e
        ;((h.value = !0), (d.value = ''))
        try {
          const a = await H.list()
          b.value = [
            ...(((t = a.data) == null ? void 0 : t.online) ?? []),
            ...(((e = a.data) == null ? void 0 : e.offline) ?? [])
          ]
        } catch (a) {
          d.value = a.message || '设备列表加载失败'
        } finally {
          h.value = !1
        }
      }
      async function M() {
        if (!u.value.trim()) {
          r('请先填写服务器地址（ws://电脑IP:3000）')
          return
        }
        if (!c.value.username || !c.value.password) {
          r('请输入用户名和密码')
          return
        }
        f.value = !0
        try {
          let t = u.value.trim().replace(/\/+$/, '')
          t = t.replace(/^ws:\/\//, 'http://').replace(/^wss:\/\//, 'https://')
          const e = await fetch(`${t}/api/user/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: c.value.username, password: c.value.password })
            }),
            a = await e.json()
          if (!e.ok || a.code !== 0) throw new Error(a.message || `登录失败 (HTTP ${e.status})`)
          ;((m.value = a.data.token), r('Token 已获取'))
        } catch (t) {
          r(t.message || '登录失败')
        } finally {
          f.value = !1
        }
      }
      function P(t) {
        const e = t.trim().replace(/\/+$/, '')
        return e.startsWith('http://')
          ? 'ws://' + e.slice(7)
          : e.startsWith('https://')
            ? 'wss://' + e.slice(8)
            : e
      }
      async function $() {
        if (!u.value.trim()) {
          r('请先填写服务器地址（ws://电脑IP:3000）')
          return
        }
        if (!v.value) {
          r('请在手机 App 内操作（浏览器无法调用原生桥）')
          return
        }
        if (!m.value.trim()) {
          r('请先获取或粘贴 Token')
          return
        }
        ;((p.value = !0), (d.value = ''))
        try {
          const t = await N.connect({ serverUrl: P(u.value), token: m.value.trim() })
          ;((_.value = !0),
            (x.value = t.deviceId),
            (g.value = '已连接'),
            r('设备已连接'),
            await T())
        } catch (t) {
          ;((d.value = t.message || '连接失败'), r('连接失败'))
        } finally {
          p.value = !1
        }
      }
      async function j() {
        if (v.value)
          try {
            ;(await N.disconnect(), (_.value = !1), (g.value = '已断开'), r('已断开'))
          } catch (t) {
            d.value = t.message || '断开失败'
          }
      }
      const z = { native: 'Native 工具', a11y: '无障碍', vision: '截图' }
      function A(t, e) {
        var a
        return (a = t.capabilities) != null && a[e] ? '已启用' : '未启用'
      }
      return (t, e) => (
        o(),
        l('div', G, [
          s('header', { class: 'device-manager__header' }, [
            e[5] || (e[5] = s('h1', { class: 'device-manager__title' }, '设备连接', -1)),
            s(
              'button',
              { class: 'device-manager__btn-icon', 'aria-label': '刷新设备列表', onClick: T },
              [
                ...(e[4] ||
                  (e[4] = [
                    s(
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
                        s('polyline', { points: '23 4 23 10 17 10' }),
                        s('path', { d: 'M20.49 15a9 9 0 1 1-2.12-9.36L23 10' })
                      ],
                      -1
                    )
                  ]))
              ]
            )
          ]),
          d.value ? (o(), l('div', K, n(d.value), 1)) : w('', !0),
          s(
            'div',
            { class: C(['device-manager__env', v.value ? 'is-native' : 'is-web']) },
            n(
              v.value ? '📱 Capacitor 原生环境（可连接）' : '🌐 浏览器环境（仅预览，原生桥不可用）'
            ),
            3
          ),
          s('div', Q, [
            e[6] || (e[6] = s('div', { class: 'device-manager__card-title' }, '连接服务器', -1)),
            k(
              s(
                'input',
                {
                  'onUpdate:modelValue': e[0] || (e[0] = a => (u.value = a)),
                  class: 'device-manager__input',
                  placeholder: 'ws://192.168.1.100:3000（改为你电脑的局域网 IP）'
                },
                null,
                512
              ),
              [[y, u.value]]
            ),
            s('div', R, [
              k(
                s(
                  'input',
                  {
                    'onUpdate:modelValue': e[1] || (e[1] = a => (m.value = a)),
                    class: 'device-manager__input',
                    placeholder: 'JWT Token（登录后获取）',
                    type: 'password'
                  },
                  null,
                  512
                ),
                [[y, m.value]]
              )
            ]),
            s('div', X, [
              s(
                'button',
                { class: 'device-manager__btn-primary', disabled: p.value, onClick: $ },
                n(p.value ? '连接中...' : _.value ? '重新连接' : '连接设备'),
                9,
                Y
              ),
              _.value
                ? (o(),
                  l(
                    'button',
                    { key: 0, class: 'device-manager__btn-danger', onClick: j },
                    ' 断开 '
                  ))
                : w('', !0)
            ]),
            _.value ? (o(), l('div', Z, n(g.value) + ' · Device ID: ' + n(x.value), 1)) : w('', !0)
          ]),
          s('div', ee, [
            e[7] ||
              (e[7] = s(
                'div',
                { class: 'device-manager__card-title' },
                '获取 Token（电脑同账号登录）',
                -1
              )),
            s('div', ae, [
              k(
                s(
                  'input',
                  {
                    'onUpdate:modelValue': e[2] || (e[2] = a => (c.value.username = a)),
                    class: 'device-manager__input',
                    placeholder: '用户名',
                    maxlength: '30'
                  },
                  null,
                  512
                ),
                [[y, c.value.username]]
              ),
              k(
                s(
                  'input',
                  {
                    'onUpdate:modelValue': e[3] || (e[3] = a => (c.value.password = a)),
                    class: 'device-manager__input',
                    placeholder: '密码',
                    type: 'password',
                    maxlength: '50'
                  },
                  null,
                  512
                ),
                [[y, c.value.password]]
              )
            ]),
            s(
              'button',
              { class: 'device-manager__btn-ghost', disabled: f.value, onClick: M },
              n(f.value ? '获取中...' : '获取 Token 并填入'),
              9,
              se
            )
          ]),
          s('div', te, [
            e[8] ||
              (e[8] = s(
                'div',
                { class: 'device-manager__card-title' },
                '设备列表（后端视角）',
                -1
              )),
            h.value
              ? (o(), l('div', ne, '加载中...'))
              : (o(),
                l('ul', ie, [
                  (o(!0),
                  l(
                    V,
                    null,
                    B(
                      b.value,
                      a => (
                        o(),
                        l('li', { key: a.id, class: 'device-manager__item' }, [
                          s('div', le, [
                            s('div', re, [
                              q(n(a.model || '未知设备') + ' ', 1),
                              s(
                                'span',
                                {
                                  class: C([
                                    'device-manager__badge',
                                    a.status === 'online' ? 'is-online' : 'is-offline'
                                  ])
                                },
                                n(a.status === 'online' ? '在线' : '离线'),
                                3
                              )
                            ]),
                            s(
                              'div',
                              oe,
                              n(a.deviceId) + ' · ' + n(a.platform) + ' · v' + n(a.appVersion),
                              1
                            ),
                            s('div', ce, [
                              (o(),
                              l(
                                V,
                                null,
                                B(z, (F, D) => {
                                  var I
                                  return s(
                                    'span',
                                    {
                                      key: D,
                                      class: C([
                                        'device-manager__cap',
                                        { 'is-on': (I = a.capabilities) == null ? void 0 : I[D] }
                                      ])
                                    },
                                    n(F) + ':' + n(A(a, D)),
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
            !b.value.length && !h.value
              ? (o(), l('div', de, ' 暂无设备。手机 App 连接后这里会出现在线设备。 '))
              : w('', !0)
          ])
        ])
      )
    }
  }),
  ge = E(ve, [['__scopeId', 'data-v-07b6a217']])
export { ge as default }
