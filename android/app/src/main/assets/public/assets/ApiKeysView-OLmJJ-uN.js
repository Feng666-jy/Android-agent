import {
  d as P,
  B as E,
  c as n,
  e as s,
  t as o,
  l as p,
  k as m,
  v as K,
  L as I,
  F,
  x as L,
  g as r,
  s as g,
  o as l,
  f as N,
  i as O,
  _ as j
} from './index-DTPmbI92.js'
import { r as b } from './request-B60bV0HZ.js'
const x = {
    list() {
      return b.get('/v2/api-keys')
    },
    create(d) {
      return b.post('/v2/api-keys', d)
    },
    update(d, _) {
      return b.put(`/v2/api-keys/${d}`, _)
    },
    revoke(d) {
      return b.delete(`/v2/api-keys/${d}`)
    }
  },
  q = { class: 'api-keys-view' },
  z = { key: 0, class: 'api-keys-view__error' },
  G = { key: 1, class: 'api-keys-view__loading' },
  H = { class: 'api-keys-view__row-actions' },
  J = { key: 2, class: 'api-keys-view__form' },
  Q = { key: 3, class: 'api-keys-view__secret' },
  R = { class: 'api-keys-view__secret-value' },
  W = { class: 'api-keys-view__secret-actions' },
  X = { class: 'api-keys-view__list' },
  Y = { class: 'api-keys-view__item-main' },
  Z = { class: 'api-keys-view__item-title' },
  ee = { class: 'api-keys-view__item-desc' },
  se = { class: 'api-keys-view__item-meta' },
  te = { key: 0, class: 'api-keys-view__item-edit' },
  ae = { class: 'api-keys-view__item-actions' },
  ie = ['onClick'],
  ne = { key: 1, class: 'api-keys-view__item-actions' },
  le = ['onClick'],
  oe = ['onClick'],
  re = { key: 4, class: 'api-keys-view__empty' },
  ue = P({
    __name: 'ApiKeysView',
    setup(d) {
      const _ = r(!1),
        v = r(''),
        A = r([]),
        k = r(!1),
        i = r({ name: '', scope: 'agent', expiresAt: '' }),
        y = r(null),
        h = r(!1),
        f = r(null),
        u = r({ name: '', scope: 'agent' }),
        $ = { agent: 'Agent 调用', all: '全部' }
      async function w() {
        var a
        ;((_.value = !0), (v.value = ''))
        try {
          const e = await x.list()
          A.value = ((a = e.data) == null ? void 0 : a.items) ?? []
        } catch (e) {
          v.value = e.message || '加载失败'
        } finally {
          _.value = !1
        }
      }
      E(w)
      function V(a) {
        return a ? a.slice(0, 10) : '-'
      }
      function T(a) {
        return a ? a.slice(0, 16).replace('T', ' ') : '-'
      }
      function C(a) {
        return !!a.expiresAt && a.expiresAt <= new Date().toISOString()
      }
      async function B() {
        if (i.value.name.trim())
          try {
            const a = { name: i.value.name.trim(), scope: i.value.scope }
            i.value.expiresAt &&
              (a.expiresAt = new Date(i.value.expiresAt + 'T23:59:59').toISOString())
            const e = await x.create(a)
            ;((y.value = e.data),
              (h.value = !1),
              (i.value = { name: '', scope: 'agent', expiresAt: '' }),
              (k.value = !1),
              await w())
          } catch (a) {
            v.value = a.message || '创建失败'
          }
      }
      async function S() {
        if (y.value)
          try {
            ;(await navigator.clipboard.writeText(y.value.plainKey),
              (h.value = !0),
              g('已复制，请妥善保存'))
          } catch {
            g('复制失败，请手动选择复制')
          }
      }
      async function U(a) {
        if (window.confirm(`确认吊销「${a.name}」？使用该 Key 的集成将立即失效。`))
          try {
            ;(await x.revoke(a.id), g('已吊销'), await w())
          } catch (e) {
            v.value = e.message || '吊销失败'
          }
      }
      function D(a) {
        ;((f.value = a.id), (u.value = { name: a.name, scope: a.scope }))
      }
      async function M(a) {
        if (u.value.name.trim())
          try {
            ;(await x.update(a.id, { name: u.value.name.trim(), scope: u.value.scope }),
              (f.value = null),
              g('已保存'),
              await w())
          } catch (e) {
            v.value = e.message || '保存失败'
          }
      }
      return (a, e) => (
        l(),
        n('div', q, [
          s('header', { class: 'api-keys-view__header' }, [
            e[9] || (e[9] = s('h1', { class: 'api-keys-view__title' }, 'API Key 管理', -1)),
            s('button', { class: 'api-keys-view__btn-icon', 'aria-label': '刷新', onClick: w }, [
              ...(e[8] ||
                (e[8] = [
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
            ])
          ]),
          v.value ? (l(), n('div', z, o(v.value), 1)) : p('', !0),
          _.value ? (l(), n('div', G, '加载中...')) : p('', !0),
          s('div', H, [
            s(
              'button',
              {
                class: 'api-keys-view__btn-primary',
                onClick: e[0] || (e[0] = t => (k.value = !k.value))
              },
              o(k.value ? '收起' : '+ 创建 API Key'),
              1
            )
          ]),
          k.value
            ? (l(),
              n('div', J, [
                m(
                  s(
                    'input',
                    {
                      'onUpdate:modelValue': e[1] || (e[1] = t => (i.value.name = t)),
                      class: 'api-keys-view__input',
                      placeholder: 'Key 名称（如 生产环境 / CI）',
                      maxlength: '64'
                    },
                    null,
                    512
                  ),
                  [[K, i.value.name]]
                ),
                m(
                  s(
                    'select',
                    {
                      'onUpdate:modelValue': e[2] || (e[2] = t => (i.value.scope = t)),
                      class: 'api-keys-view__select'
                    },
                    [
                      ...(e[10] ||
                        (e[10] = [
                          s('option', { value: 'agent' }, 'Agent 调用', -1),
                          s('option', { value: 'all' }, '全部', -1)
                        ]))
                    ],
                    512
                  ),
                  [[I, i.value.scope]]
                ),
                m(
                  s(
                    'input',
                    {
                      'onUpdate:modelValue': e[3] || (e[3] = t => (i.value.expiresAt = t)),
                      class: 'api-keys-view__input',
                      type: 'date'
                    },
                    null,
                    512
                  ),
                  [[K, i.value.expiresAt]]
                ),
                s('button', { class: 'api-keys-view__btn-primary', onClick: B }, '创建')
              ]))
            : p('', !0),
          y.value
            ? (l(),
              n('div', Q, [
                e[11] ||
                  (e[11] = s(
                    'div',
                    { class: 'api-keys-view__secret-title' },
                    'Key 已创建（明文仅显示这一次）',
                    -1
                  )),
                s('code', R, o(y.value.plainKey), 1),
                s('div', W, [
                  s(
                    'button',
                    { class: 'api-keys-view__btn-primary', onClick: S },
                    o(h.value ? '已复制 ✓' : '复制 Key'),
                    1
                  ),
                  s(
                    'button',
                    {
                      class: 'api-keys-view__btn-ghost',
                      onClick: e[4] || (e[4] = t => (y.value = null))
                    },
                    '我知道了'
                  )
                ])
              ]))
            : p('', !0),
          s('ul', X, [
            (l(!0),
            n(
              F,
              null,
              L(
                A.value,
                t => (
                  l(),
                  n('li', { key: t.id, class: 'api-keys-view__item' }, [
                    s('div', Y, [
                      s('div', Z, [
                        N(o(t.name) + ' ', 1),
                        s(
                          'span',
                          {
                            class: O([
                              'api-keys-view__badge',
                              C(t) || t.status !== 'active' ? 'is-disabled' : 'is-active'
                            ])
                          },
                          o(C(t) ? '已过期' : t.status === 'active' ? '启用' : '已吊销'),
                          3
                        )
                      ]),
                      s('div', ee, o(t.prefix) + '... · ' + o($[t.scope] ?? t.scope), 1),
                      s(
                        'div',
                        se,
                        ' 创建于 ' +
                          o(V(t.createdAt)) +
                          ' · 过期 ' +
                          o(V(t.expiresAt)) +
                          ' · 最近使用 ' +
                          o(T(t.lastUsedAt)),
                        1
                      )
                    ]),
                    f.value === t.id
                      ? (l(),
                        n('div', te, [
                          m(
                            s(
                              'input',
                              {
                                'onUpdate:modelValue': e[5] || (e[5] = c => (u.value.name = c)),
                                class: 'api-keys-view__input',
                                maxlength: '64'
                              },
                              null,
                              512
                            ),
                            [[K, u.value.name]]
                          ),
                          m(
                            s(
                              'select',
                              {
                                'onUpdate:modelValue': e[6] || (e[6] = c => (u.value.scope = c)),
                                class: 'api-keys-view__select'
                              },
                              [
                                ...(e[12] ||
                                  (e[12] = [
                                    s('option', { value: 'agent' }, 'Agent 调用', -1),
                                    s('option', { value: 'all' }, '全部', -1)
                                  ]))
                              ],
                              512
                            ),
                            [[I, u.value.scope]]
                          ),
                          s('div', ae, [
                            s(
                              'button',
                              { class: 'api-keys-view__btn-primary', onClick: c => M(t) },
                              '保存',
                              8,
                              ie
                            ),
                            s(
                              'button',
                              {
                                class: 'api-keys-view__btn-ghost',
                                onClick: e[7] || (e[7] = c => (f.value = null))
                              },
                              '取消'
                            )
                          ])
                        ]))
                      : (l(),
                        n('div', ne, [
                          t.status === 'active' && !C(t)
                            ? (l(),
                              n(
                                'button',
                                { key: 0, class: 'api-keys-view__btn-ghost', onClick: c => D(t) },
                                ' 编辑 ',
                                8,
                                le
                              ))
                            : p('', !0),
                          t.status === 'active'
                            ? (l(),
                              n(
                                'button',
                                { key: 1, class: 'api-keys-view__btn-danger', onClick: c => U(t) },
                                ' 吊销 ',
                                8,
                                oe
                              ))
                            : p('', !0)
                        ]))
                  ])
                )
              ),
              128
            ))
          ]),
          !A.value.length && !_.value
            ? (l(),
              n(
                'div',
                re,
                ' 还没有 API Key。创建后可用于第三方系统调用你的 Agent 接口（`Bearer sk_...`）。 '
              ))
            : p('', !0)
        ])
      )
    }
  }),
  pe = j(ue, [['__scopeId', 'data-v-6d25e01b']])
export { pe as default }
