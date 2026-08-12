import {
  d as A,
  u as O,
  o as n,
  c as l,
  e,
  l as f,
  a as E,
  t as k,
  i as x,
  b as S,
  T as q,
  w as D,
  f as F,
  g as r,
  A as R,
  _ as M,
  B as te,
  m as se,
  F as I,
  x as j,
  q as oe,
  z as ae,
  k as ne,
  v as le,
  D as ie,
  s as H
} from './index-DTPmbI92.js'
import { a as re } from './agent-CF4HRCsr.js'
import { u as ce } from './conversation-CHD199ET.js'
import { u as de } from './model-CO2euHd2.js'
import './request-B60bV0HZ.js'
const ue = { class: 'page-header' },
  pe = { class: 'page-header__left' },
  ve = { class: 'page-header__title-icon' },
  _e = {
    key: 0,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  ke = {
    key: 1,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  fe = { class: 'page-header__title' },
  he = { class: 'page-header__actions' },
  me = { key: 0, class: 'pc-menu' },
  ye = A({
    __name: 'PageHeader',
    props: { showBack: { type: Boolean, default: !1 } },
    emits: ['update:mode', 'open-search', 'open-avatar'],
    setup($, { emit: u }) {
      const p = u,
        h = O(),
        c = r('all'),
        i = r(!1),
        w = { all: '全部任务', cloud: '云端' },
        C = R(() => w[c.value])
      function v(_) {
        if (c.value === _) {
          i.value = !1
          return
        }
        ;((c.value = _), p('update:mode', _), (i.value = !1))
      }
      function m() {
        h.push('/home')
      }
      return (_, t) => (
        n(),
        l('header', ue, [
          e('div', pe, [
            $.showBack
              ? (n(),
                l(
                  'button',
                  { key: 0, class: 'page-header__back', 'aria-label': '返回主页', onClick: m },
                  [
                    ...(t[6] ||
                      (t[6] = [
                        e(
                          'svg',
                          {
                            viewBox: '0 0 24 24',
                            fill: 'none',
                            stroke: 'currentColor',
                            'stroke-width': '2',
                            'stroke-linecap': 'round',
                            'stroke-linejoin': 'round'
                          },
                          [e('polyline', { points: '15 18 9 12 15 6' })],
                          -1
                        )
                      ]))
                  ]
                ))
              : f('', !0),
            e(
              'div',
              {
                class: 'page-header__title-group',
                onClick: t[0] || (t[0] = d => (i.value = !i.value))
              },
              [
                e('span', ve, [
                  c.value === 'all'
                    ? (n(),
                      l('svg', _e, [
                        ...(t[7] ||
                          (t[7] = [
                            E(
                              '<line x1="8" y1="6" x2="21" y2="6" data-v-3f1c22f3></line><line x1="8" y1="12" x2="21" y2="12" data-v-3f1c22f3></line><line x1="8" y1="18" x2="21" y2="18" data-v-3f1c22f3></line><line x1="3" y1="6" x2="3.01" y2="6" data-v-3f1c22f3></line><line x1="3" y1="12" x2="3.01" y2="12" data-v-3f1c22f3></line><line x1="3" y1="18" x2="3.01" y2="18" data-v-3f1c22f3></line>',
                              6
                            )
                          ]))
                      ]))
                    : (n(),
                      l('svg', ke, [
                        ...(t[8] ||
                          (t[8] = [
                            e(
                              'path',
                              { d: 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z' },
                              null,
                              -1
                            )
                          ]))
                      ]))
                ]),
                e('h1', fe, k(C.value), 1),
                (n(),
                l(
                  'svg',
                  {
                    class: x(['page-header__dropdown', { 'page-header__dropdown--open': i.value }]),
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': '2',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round'
                  },
                  [...(t[9] || (t[9] = [e('polyline', { points: '6 9 12 15 18 9' }, null, -1)]))],
                  2
                ))
              ]
            )
          ]),
          e('div', he, [
            e(
              'button',
              {
                class: 'page-header__btn page-header__btn--search',
                'aria-label': '搜索',
                onClick: t[1] || (t[1] = d => p('open-search'))
              },
              [
                ...(t[10] ||
                  (t[10] = [
                    e(
                      'svg',
                      {
                        viewBox: '0 0 24 24',
                        fill: 'none',
                        stroke: 'currentColor',
                        'stroke-width': '2',
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round'
                      },
                      [
                        e('circle', { cx: '11', cy: '11', r: '8' }),
                        e('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' })
                      ],
                      -1
                    )
                  ]))
              ]
            ),
            e(
              'button',
              {
                class: 'page-header__btn page-header__btn--avatar',
                'aria-label': '用户',
                onClick: t[2] || (t[2] = d => p('open-avatar'))
              },
              [
                ...(t[11] ||
                  (t[11] = [
                    e(
                      'svg',
                      { viewBox: '0 0 24 24', fill: 'currentColor' },
                      [
                        e('path', {
                          d: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'
                        })
                      ],
                      -1
                    )
                  ]))
              ]
            )
          ]),
          S(
            q,
            { name: 'pc-fade' },
            {
              default: D(() => [
                i.value
                  ? (n(),
                    l('div', {
                      key: 0,
                      class: 'pc-backdrop',
                      onClick: t[3] || (t[3] = d => (i.value = !1))
                    }))
                  : f('', !0)
              ]),
              _: 1
            }
          ),
          S(
            q,
            { name: 'pc-drop' },
            {
              default: D(() => [
                i.value
                  ? (n(),
                    l('div', me, [
                      e(
                        'button',
                        {
                          class: x([
                            'pc-menu__item',
                            { 'pc-menu__item--active': c.value === 'all' }
                          ]),
                          onClick: t[4] || (t[4] = d => v('all'))
                        },
                        [
                          ...(t[12] ||
                            (t[12] = [
                              e(
                                'span',
                                { class: 'pc-menu__icon pc-menu__icon--all' },
                                [
                                  e(
                                    'svg',
                                    {
                                      viewBox: '0 0 24 24',
                                      fill: 'none',
                                      stroke: 'currentColor',
                                      'stroke-width': '2',
                                      'stroke-linecap': 'round',
                                      'stroke-linejoin': 'round'
                                    },
                                    [
                                      e('line', { x1: '8', y1: '6', x2: '21', y2: '6' }),
                                      e('line', { x1: '8', y1: '12', x2: '21', y2: '12' }),
                                      e('line', { x1: '8', y1: '18', x2: '21', y2: '18' }),
                                      e('line', { x1: '3', y1: '6', x2: '3.01', y2: '6' }),
                                      e('line', { x1: '3', y1: '12', x2: '3.01', y2: '12' }),
                                      e('line', { x1: '3', y1: '18', x2: '3.01', y2: '18' })
                                    ]
                                  )
                                ],
                                -1
                              ),
                              F(' 全部任务 ', -1)
                            ]))
                        ],
                        2
                      ),
                      e(
                        'button',
                        {
                          class: x([
                            'pc-menu__item',
                            { 'pc-menu__item--active': c.value === 'cloud' }
                          ]),
                          onClick: t[5] || (t[5] = d => v('cloud'))
                        },
                        [
                          ...(t[13] ||
                            (t[13] = [
                              e(
                                'span',
                                { class: 'pc-menu__icon pc-menu__icon--cloud' },
                                [
                                  e(
                                    'svg',
                                    {
                                      viewBox: '0 0 24 24',
                                      fill: 'none',
                                      stroke: 'currentColor',
                                      'stroke-width': '2',
                                      'stroke-linecap': 'round',
                                      'stroke-linejoin': 'round'
                                    },
                                    [
                                      e('path', {
                                        d: 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z'
                                      })
                                    ]
                                  )
                                ],
                                -1
                              ),
                              F(' 云端 ', -1)
                            ]))
                        ],
                        2
                      )
                    ]))
                  : f('', !0)
              ]),
              _: 1
            }
          )
        ])
      )
    }
  }),
  ge = M(ye, [['__scopeId', 'data-v-3f1c22f3']]),
  xe = {},
  we = { class: 'empty-state' }
function Ce($, u) {
  return (
    n(),
    l('div', we, [
      ...(u[0] ||
        (u[0] = [
          E(
            '<div class="empty-state__icon" data-v-5c6b0e95><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-5c6b0e95><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" data-v-5c6b0e95></path></svg><span class="empty-state__plus" data-v-5c6b0e95>+</span></div><p class="empty-state__text" data-v-5c6b0e95> 还没有任务，点右下角「+」创建第一个<br data-v-5c6b0e95>任务 </p>',
            2
          )
        ]))
    ])
  )
}
const be = M(xe, [
    ['render', Ce],
    ['__scopeId', 'data-v-5c6b0e95']
  ]),
  $e = A({
    __name: 'CreateFab',
    emits: ['click'],
    setup($, { emit: u }) {
      const p = u
      return (h, c) => (
        n(),
        l(
          'button',
          {
            class: 'create-fab',
            'aria-label': '创建任务',
            onClick: c[0] || (c[0] = i => p('click'))
          },
          [
            ...(c[1] ||
              (c[1] = [
                e(
                  'svg',
                  {
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': '1.5'
                  },
                  [
                    e('path', {
                      d: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'
                    })
                  ],
                  -1
                ),
                e('span', { class: 'create-fab__plus' }, '+', -1)
              ]))
          ]
        )
      )
    }
  }),
  Be = M($e, [['__scopeId', 'data-v-b6add248']]),
  Se = { class: 'personal-center' },
  Me = { key: 0, class: 'pc-list pc-list--loading' },
  Te = { key: 1, class: 'pc-empty-wrap' },
  ze = { key: 2, class: 'pc-list' },
  Ie = ['onClick'],
  je = { class: 'pc-task__main' },
  Ae = { class: 'pc-task__head' },
  Ne = { class: 'pc-task__title' },
  Le = { class: 'pc-task__meta' },
  Pe = { class: 'pc-task__model' },
  Ve = { class: 'pc-task__time' },
  qe = { key: 0, class: 'pc-list__more' },
  De = { key: 1, class: 'pc-list__more' },
  Fe = { class: 'pc-search__bar' },
  He = { class: 'pc-search__results' },
  Oe = { key: 0, class: 'pc-search__hint' },
  Ee = { key: 1, class: 'pc-search__hint' },
  Re = { key: 2, class: 'pc-search__hint' },
  Ke = ['onClick'],
  Ue = { class: 'pc-task__main' },
  Qe = { class: 'pc-task__head' },
  Ge = { class: 'pc-task__title' },
  Je = { class: 'pc-task__meta' },
  We = { class: 'pc-task__model' },
  Xe = { class: 'pc-task__time' },
  Ye = 20,
  Ze = A({
    __name: 'PersonalCenter',
    setup($) {
      const u = O(),
        p = ce(),
        h = de(),
        c = r('all'),
        i = r([]),
        w = r(0),
        C = r(1),
        v = r(!1),
        m = r(!1),
        _ = r(''),
        t = r(!1),
        d = r(''),
        y = r([]),
        T = r(!1),
        b = r(!1)
      let g = null,
        B = 0
      const K = R(() => !v.value && i.value.length === 0)
      async function z(a = !1) {
        a ? (m.value = !0) : (v.value = !0)
        try {
          const s = await re.history(C.value, Ye)
          s.code === 0 &&
            ((w.value = s.data.total),
            (i.value = a ? [...i.value, ...s.data.list] : s.data.list),
            i.value.forEach(o => p.touchConversation(o.id, o.task, o.modelId)))
        } catch {
          H('加载任务失败')
        } finally {
          ;((v.value = !1), (m.value = !1))
        }
      }
      function U() {
        i.value.length >= w.value || m.value || v.value || ((C.value += 1), z(!0))
      }
      function Q() {
        ;((C.value = 1), z(!1))
      }
      function G(a) {
        const s = a.target
        s.scrollTop + s.clientHeight >= s.scrollHeight - 40 && U()
      }
      function J(a) {
        ;((c.value = a), Q())
      }
      function N(a) {
        const s = h.models.find(o => String(o.id) === a)
        return (
          (s == null ? void 0 : s.displayName) ||
          (s == null ? void 0 : s.modelName) ||
          a.slice(0, 8)
        )
      }
      function L(a) {
        try {
          return new Date(a).toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
        } catch {
          return a
        }
      }
      async function P(a) {
        if (!_.value) {
          _.value = a.id
          try {
            ;(p.restore(a.id, a.task, a.modelId), u.push('/home'))
          } finally {
            _.value = ''
          }
        }
      }
      function W() {
        ;(p.newConversation(), u.push('/home'))
      }
      function X() {
        u.push('/me')
      }
      function Y() {
        ;((d.value = ''),
          (y.value = []),
          (b.value = !1),
          (t.value = !0),
          setTimeout(() => {
            const a = document.querySelector('.pc-search__input')
            a == null || a.focus()
          }, 60))
      }
      function Z() {
        ;(g && clearTimeout(g), (g = setTimeout(() => V(), 300)))
      }
      async function V() {
        const a = d.value.trim(),
          s = ++B
        if (!a) {
          ;((y.value = []), (b.value = !1))
          return
        }
        T.value = !0
        try {
          const o = await p.searchConversation(a, 1, 20)
          if (s !== B) return
          ;((y.value = o.list), (b.value = !0))
        } catch {
          s === B && ((y.value = []), (b.value = !0), H('搜索失败'))
        } finally {
          s === B && (T.value = !1)
        }
      }
      return (
        te(() => {
          ;(z(!1), h.models.length === 0 && h.fetchModels({ page: 1, pageSize: 50 }))
        }),
        se(t, a => {
          !a && g && (clearTimeout(g), (g = null))
        }),
        (a, s) => (
          n(),
          l('div', Se, [
            S(ge, { 'onUpdate:mode': J, onOpenSearch: Y, onOpenAvatar: X }),
            e(
              'main',
              { class: 'personal-center__content', onScrollPassive: G },
              [
                v.value
                  ? (n(),
                    l('div', Me, [
                      (n(),
                      l(
                        I,
                        null,
                        j(4, o => e('div', { class: 'pc-skeleton', key: o })),
                        64
                      ))
                    ]))
                  : K.value
                    ? (n(), l('div', Te, [S(be)]))
                    : (n(),
                      l('div', ze, [
                        (n(!0),
                        l(
                          I,
                          null,
                          j(
                            i.value,
                            o => (
                              n(),
                              l(
                                'div',
                                {
                                  key: o.id,
                                  class: x(['pc-task', { 'pc-task--restoring': _.value === o.id }]),
                                  onClick: ee => P(o)
                                },
                                [
                                  e('div', je, [
                                    e('div', Ae, [
                                      e('span', Ne, k(o.task || '未命名任务'), 1),
                                      e(
                                        'span',
                                        { class: x(['pc-task__dot', `pc-task__dot--${o.status}`]) },
                                        null,
                                        2
                                      )
                                    ]),
                                    e('div', Le, [
                                      e('span', Pe, k(N(o.modelId)), 1),
                                      e('span', Ve, k(L(o.createdAt)), 1)
                                    ])
                                  ]),
                                  s[3] ||
                                    (s[3] = e(
                                      'div',
                                      { class: 'pc-task__arrow' },
                                      [
                                        e(
                                          'svg',
                                          {
                                            width: '16',
                                            height: '16',
                                            viewBox: '0 0 24 24',
                                            fill: 'none',
                                            stroke: 'currentColor',
                                            'stroke-width': '2',
                                            'stroke-linecap': 'round',
                                            'stroke-linejoin': 'round'
                                          },
                                          [e('polyline', { points: '9 18 15 12 9 6' })]
                                        )
                                      ],
                                      -1
                                    ))
                                ],
                                10,
                                Ie
                              )
                            )
                          ),
                          128
                        )),
                        m.value
                          ? (n(), l('p', qe, '加载中...'))
                          : i.value.length >= w.value
                            ? (n(), l('p', De, '— 没有更多了 —'))
                            : f('', !0)
                      ]))
              ],
              32
            ),
            v.value ? f('', !0) : (n(), oe(Be, { key: 0, onClick: W })),
            t.value
              ? (n(),
                l(
                  'div',
                  {
                    key: 1,
                    class: 'pc-search',
                    onClick: s[2] || (s[2] = ae(o => (t.value = !1), ['self']))
                  },
                  [
                    e('div', Fe, [
                      s[4] ||
                        (s[4] = e(
                          'svg',
                          {
                            class: 'pc-search__icon',
                            viewBox: '0 0 24 24',
                            fill: 'none',
                            stroke: 'currentColor',
                            'stroke-width': '2',
                            'stroke-linecap': 'round',
                            'stroke-linejoin': 'round'
                          },
                          [
                            e('circle', { cx: '11', cy: '11', r: '8' }),
                            e('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' })
                          ],
                          -1
                        )),
                      ne(
                        e(
                          'input',
                          {
                            class: 'pc-search__input',
                            'onUpdate:modelValue': s[0] || (s[0] = o => (d.value = o)),
                            placeholder: '搜索任务...',
                            onInput: Z,
                            onKeyup: ie(V, ['enter'])
                          },
                          null,
                          544
                        ),
                        [[le, d.value]]
                      ),
                      e(
                        'button',
                        {
                          class: 'pc-search__cancel',
                          onClick: s[1] || (s[1] = o => (t.value = !1))
                        },
                        '取消'
                      )
                    ]),
                    e('div', He, [
                      T.value
                        ? (n(), l('div', Oe, '搜索中...'))
                        : d.value.trim() && b.value && y.value.length === 0
                          ? (n(), l('div', Ee, ' 未找到相关任务 '))
                          : d.value.trim()
                            ? f('', !0)
                            : (n(), l('div', Re, '搜索历史任务标题或消息内容')),
                      (n(!0),
                      l(
                        I,
                        null,
                        j(
                          y.value,
                          o => (
                            n(),
                            l(
                              'div',
                              { key: o.id, class: 'pc-task', onClick: ee => P(o) },
                              [
                                e('div', Ue, [
                                  e('div', Qe, [
                                    e('span', Ge, k(o.task || '未命名任务'), 1),
                                    e(
                                      'span',
                                      { class: x(['pc-task__dot', `pc-task__dot--${o.status}`]) },
                                      null,
                                      2
                                    )
                                  ]),
                                  e('div', Je, [
                                    e('span', We, k(N(o.modelId)), 1),
                                    e('span', Xe, k(L(o.createdAt)), 1)
                                  ])
                                ]),
                                s[5] ||
                                  (s[5] = e(
                                    'div',
                                    { class: 'pc-task__arrow' },
                                    [
                                      e(
                                        'svg',
                                        {
                                          width: '16',
                                          height: '16',
                                          viewBox: '0 0 24 24',
                                          fill: 'none',
                                          stroke: 'currentColor',
                                          'stroke-width': '2',
                                          'stroke-linecap': 'round',
                                          'stroke-linejoin': 'round'
                                        },
                                        [e('polyline', { points: '9 18 15 12 9 6' })]
                                      )
                                    ],
                                    -1
                                  ))
                              ],
                              8,
                              Ke
                            )
                          )
                        ),
                        128
                      ))
                    ])
                  ]
                ))
              : f('', !0)
          ])
        )
      )
    }
  }),
  nt = M(Ze, [['__scopeId', 'data-v-c20ed2ee']])
export { nt as default }
