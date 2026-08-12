import {
  d as G,
  D as J,
  c as i,
  f as e,
  g as C,
  F as f,
  z as y,
  t as a,
  i as p,
  n as Y,
  b as $,
  w as K,
  C as N,
  r as h,
  l as g,
  L as W,
  e as q,
  u as Q,
  o as l,
  m as L,
  j as M,
  J as X,
  _ as Z
} from './index-B7ocQHAM.js'
import { u as ee } from './provider-B6_1_C4o.js'
import './provider-DkfW0_eM.js'
import './request-eyLhzUlJ.js'
const te = { class: 'provider-detail' },
  se = { class: 'provider-detail__content' },
  oe = { key: 0, class: 'provider-detail__loading' },
  ie = { key: 1, class: 'provider-detail__empty' },
  le = { class: 'provider-detail__card' },
  ae = { class: 'provider-detail__card-header' },
  ne = { class: 'provider-detail__name' },
  re = { key: 0, class: 'provider-detail__badge' },
  de = { key: 1, class: 'provider-detail__badge provider-detail__badge--disabled' },
  _e = { class: 'provider-detail__field' },
  pe = { class: 'provider-detail__value provider-detail__value--mono' },
  ue = { class: 'provider-detail__field' },
  ce = { class: 'provider-detail__value' },
  ve = { class: 'provider-detail__field' },
  me = { class: 'provider-detail__value' },
  he = { class: 'provider-detail__field' },
  fe = { class: 'provider-detail__field' },
  ke = { class: 'provider-detail__value' },
  ye = { class: 'provider-detail__actions' },
  ge = ['disabled'],
  be = ['disabled'],
  we = { class: 'provider-detail__models' },
  xe = { class: 'provider-detail__section-head' },
  Ce = { class: 'provider-detail__section-title' },
  Ne = ['disabled'],
  Be = {
    key: 0,
    class: 'provider-detail__discover-icon',
    width: '14',
    height: '14',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  De = {
    key: 1,
    class: 'provider-detail__discover-icon provider-detail__discover-icon--spin',
    width: '14',
    height: '14',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  Ae = { key: 0, class: 'provider-detail__models-empty' },
  Ee = { key: 1, class: 'provider-detail__models-list' },
  He = { class: 'model-item__info' },
  Le = { class: 'model-item__name-row' },
  Me = { class: 'model-item__name' },
  je = { key: 0, class: 'model-item__tag model-item__tag--default' },
  Pe = { key: 1, class: 'model-item__tag model-item__tag--fav' },
  Re = { class: 'model-item__id' },
  Te = { key: 0, class: 'model-item__caps' },
  Se = { class: 'model-item__meta' },
  Ue = { key: 0 },
  ze = { class: 'mpop__sheet' },
  Fe = { class: 'mpop__header' },
  Ie = { key: 0, class: 'mpop__loading' },
  Ve = { key: 1, class: 'mpop__empty' },
  Oe = { key: 2, class: 'mpop__list' },
  Ge = { class: 'mpop__count' },
  Je = { class: 'mpop__cards' },
  Ye = ['onClick'],
  $e = { class: 'mpop-card__body' },
  Ke = { class: 'mpop-card__name' },
  We = { class: 'mpop-card__id' },
  qe = {
    key: 0,
    class: 'mpop-card__badge-icon',
    width: '12',
    height: '12',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2.5',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  Qe = { class: 'mpop__footer' },
  Xe = { class: 'mpop__footer-text' },
  Ze = ['disabled'],
  et = { key: 0, class: 'mpop__import-spinner' },
  tt = G({
    __name: 'ProviderDetail',
    setup(st) {
      const j = X(),
        b = Q(),
        d = ee(),
        r = N(() => j.params.id),
        k = h(!1)
      J(async () => {
        r.value && (await d.fetchProvider(r.value), await d.runHealthCheck(r.value))
      })
      const n = N(() => d.currentProvider),
        w = N(() => {
          const s = n.value
          return (s == null ? void 0 : s.models) || []
        })
      function P(s) {
        switch (s) {
          case 'HEALTHY':
            return '#07c160'
          case 'DEGRADED':
            return '#ff976a'
          case 'UNREACHABLE':
            return '#ee0a24'
          default:
            return '#969799'
        }
      }
      function B(s) {
        switch (s) {
          case 'HEALTHY':
            return '健康'
          case 'DEGRADED':
            return '异常'
          case 'UNREACHABLE':
            return '不可达'
          default:
            return '未知'
        }
      }
      function D(s) {
        if (!s) return []
        try {
          return JSON.parse(s)
        } catch {
          return []
        }
      }
      async function R() {
        if (r.value) {
          k.value = !0
          try {
            const s = await d.runHealthCheck(r.value)
            if (s) {
              const t = B(s.status) + ' 耗时 ' + s.latencyMs + 'ms'
              g(t)
            }
          } finally {
            k.value = !1
          }
        }
      }
      function T() {
        b.push('/workspace/settings/providers/' + r.value + '/edit')
      }
      async function S() {
        if (n.value)
          try {
            ;(await W({
              title: '确认删除',
              message: '删除供应商"' + n.value.name + '"将同时删除其下所有模型，确定继续？',
              confirmButtonText: '删除',
              confirmButtonColor: '#ee0a24'
            }),
              await d.deleteProvider(r.value),
              g('供应商已删除'),
              b.replace('/workspace/settings/providers'))
          } catch {}
      }
      function A() {
        b.push('/workspace/settings/providers')
      }
      function U(s) {
        if (!s) return '无'
        try {
          return new Date(s).toLocaleString('zh-CN')
        } catch {
          return s
        }
      }
      const c = h([]),
        v = h(!1),
        m = h(!1),
        u = h(!1),
        _ = h([])
      async function z() {
        if (r.value) {
          ;((c.value = []), (_.value = []), (v.value = !0), (m.value = !0))
          try {
            const s = await d.discoverModels(r.value)
            if (!s) return
            if (s.error) {
              ;((v.value = !1), g('获取失败: ' + s.error))
              return
            }
            ;((c.value = s.models || []),
              (_.value = c.value.filter(t => !t.exists).map(t => t.modelName)))
          } finally {
            m.value = !1
          }
        }
      }
      function F(s) {
        return _.value.includes(s)
      }
      function I(s) {
        if (s.exists || u.value) return
        const t = _.value.indexOf(s.modelName)
        t >= 0 ? _.value.splice(t, 1) : _.value.push(s.modelName)
      }
      async function V() {
        if (!(!r.value || _.value.length === 0)) {
          u.value = !0
          try {
            const s = await d.importModels(r.value, _.value)
            ;(s &&
              g(
                '导入成功 ' +
                  s.created +
                  ' 个' +
                  (s.skipped ? '（跳过 ' + s.skipped + ' 个已存在）' : '')
              ),
              (v.value = !1),
              await d.fetchProvider(r.value))
          } finally {
            u.value = !1
          }
        }
      }
      return (s, t) => {
        var E, H
        const O = q('van-popup')
        return (
          l(),
          i('div', te, [
            e('header', { class: 'provider-detail__header' }, [
              e('button', { class: 'provider-detail__back', 'aria-label': '返回', onClick: A }, [
                ...(t[2] ||
                  (t[2] = [
                    e(
                      'svg',
                      {
                        width: '20',
                        height: '20',
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
              ]),
              t[3] || (t[3] = e('h1', { class: 'provider-detail__title' }, '供应商详情', -1)),
              e('button', { class: 'provider-detail__edit', onClick: T }, '编辑')
            ]),
            e('main', se, [
              C(d).loading
                ? (l(),
                  i('div', oe, [
                    (l(),
                    i(
                      f,
                      null,
                      y(4, o => e('div', { class: 'provider-detail__skeleton', key: o })),
                      64
                    ))
                  ]))
                : n.value
                  ? (l(),
                    i(
                      f,
                      { key: 2 },
                      [
                        e('section', le, [
                          e('div', ae, [
                            e('h2', ne, a(n.value.name), 1),
                            n.value.isBuiltin ? (l(), i('span', re, '内置')) : p('', !0),
                            n.value.isEnabled ? p('', !0) : (l(), i('span', de, '已禁用'))
                          ]),
                          e('div', _e, [
                            t[5] ||
                              (t[5] = e(
                                'span',
                                { class: 'provider-detail__label' },
                                'Base URL',
                                -1
                              )),
                            e('span', pe, a(n.value.baseUrl), 1)
                          ]),
                          e('div', ue, [
                            t[6] ||
                              (t[6] = e(
                                'span',
                                { class: 'provider-detail__label' },
                                '协议类型',
                                -1
                              )),
                            e('span', ce, a(n.value.protocol), 1)
                          ]),
                          e('div', ve, [
                            t[7] ||
                              (t[7] = e(
                                'span',
                                { class: 'provider-detail__label' },
                                '认证方式',
                                -1
                              )),
                            e('span', me, a(n.value.authType), 1)
                          ]),
                          e('div', he, [
                            t[8] ||
                              (t[8] = e(
                                'span',
                                { class: 'provider-detail__label' },
                                '健康状态',
                                -1
                              )),
                            e(
                              'span',
                              {
                                class: 'provider-detail__status',
                                style: Y({
                                  background: P(
                                    ((E = C(d).getHealth(n.value.id)) == null
                                      ? void 0
                                      : E.status) || n.value.healthStatus
                                  )
                                })
                              },
                              a(
                                B(
                                  ((H = C(d).getHealth(n.value.id)) == null ? void 0 : H.status) ||
                                    n.value.healthStatus
                                )
                              ),
                              5
                            )
                          ]),
                          e('div', fe, [
                            t[9] ||
                              (t[9] = e(
                                'span',
                                { class: 'provider-detail__label' },
                                '最后检查',
                                -1
                              )),
                            e('span', ke, a(U(n.value.lastCheckedAt)), 1)
                          ]),
                          e('div', ye, [
                            e(
                              'button',
                              {
                                class: 'provider-detail__action provider-detail__action--primary',
                                disabled: k.value,
                                onClick: R
                              },
                              a(k.value ? '检查中...' : '健康检查'),
                              9,
                              ge
                            ),
                            e(
                              'button',
                              {
                                class: 'provider-detail__action provider-detail__action--danger',
                                disabled: n.value.isBuiltin,
                                onClick: S
                              },
                              ' 删除 ',
                              8,
                              be
                            )
                          ])
                        ]),
                        e('section', we, [
                          e('div', xe, [
                            e('h3', Ce, '模型列表 (' + a(w.value.length) + ')', 1),
                            e(
                              'button',
                              {
                                class: 'provider-detail__discover',
                                type: 'button',
                                disabled: m.value,
                                onClick: z
                              },
                              [
                                m.value
                                  ? (l(),
                                    i('svg', De, [
                                      ...(t[11] ||
                                        (t[11] = [
                                          e('polyline', { points: '23 4 23 10 17 10' }, null, -1),
                                          e(
                                            'path',
                                            { d: 'M20.49 15a9 9 0 1 1-2.12-9.36L23 10' },
                                            null,
                                            -1
                                          )
                                        ]))
                                    ]))
                                  : (l(),
                                    i('svg', Be, [
                                      ...(t[10] ||
                                        (t[10] = [
                                          e('polyline', { points: '8 17 12 21 16 17' }, null, -1),
                                          e(
                                            'line',
                                            { x1: '12', y1: '12', x2: '12', y2: '21' },
                                            null,
                                            -1
                                          ),
                                          e(
                                            'path',
                                            {
                                              d: 'M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29'
                                            },
                                            null,
                                            -1
                                          )
                                        ]))
                                    ])),
                                e('span', null, a(m.value ? '正在获取' : '从上游获取'), 1)
                              ],
                              8,
                              Ne
                            )
                          ]),
                          w.value.length === 0
                            ? (l(), i('div', Ae, '暂无模型'))
                            : (l(),
                              i('div', Ee, [
                                (l(!0),
                                i(
                                  f,
                                  null,
                                  y(
                                    w.value,
                                    o => (
                                      l(),
                                      i('div', { key: o.id, class: 'model-item' }, [
                                        e('div', He, [
                                          e('div', Le, [
                                            e('span', Me, a(o.displayName || o.modelName), 1),
                                            o.isDefault ? (l(), i('span', je, '默认')) : p('', !0),
                                            o.isFavorite ? (l(), i('span', Pe, '收藏')) : p('', !0)
                                          ]),
                                          e('span', Re, a(o.modelName), 1),
                                          D(o.capabilities).length
                                            ? (l(),
                                              i('div', Te, [
                                                (l(!0),
                                                i(
                                                  f,
                                                  null,
                                                  y(
                                                    D(o.capabilities),
                                                    x => (
                                                      l(),
                                                      i(
                                                        'span',
                                                        { key: x, class: 'model-item__cap' },
                                                        a(x),
                                                        1
                                                      )
                                                    )
                                                  ),
                                                  128
                                                ))
                                              ]))
                                            : p('', !0),
                                          e('div', Se, [
                                            e(
                                              'span',
                                              null,
                                              '上下文: ' +
                                                a((o.contextWindow / 1e3).toFixed(0)) +
                                                'K',
                                              1
                                            ),
                                            o.temperature != null
                                              ? (l(), i('span', Ue, '温度: ' + a(o.temperature), 1))
                                              : p('', !0)
                                          ])
                                        ])
                                      ])
                                    )
                                  ),
                                  128
                                ))
                              ]))
                        ])
                      ],
                      64
                    ))
                  : (l(),
                    i('div', ie, [
                      t[4] || (t[4] = e('p', null, '供应商不存在', -1)),
                      e('button', { class: 'provider-detail__empty-btn', onClick: A }, '返回列表')
                    ]))
            ]),
            $(
              O,
              {
                show: v.value,
                'onUpdate:show': t[1] || (t[1] = o => (v.value = o)),
                position: 'bottom',
                round: '',
                'overlay-style': { background: 'rgba(0, 0, 0, 0.45)' },
                class: 'mpop'
              },
              {
                default: K(() => [
                  e('div', ze, [
                    t[18] || (t[18] = e('div', { class: 'mpop__handle' }, null, -1)),
                    e('div', Fe, [
                      t[13] ||
                        (t[13] = e(
                          'div',
                          { class: 'mpop__heading' },
                          [
                            e('h3', { class: 'mpop__title' }, '从上游获取模型'),
                            e('p', { class: 'mpop__subtitle' }, '从供应商 API 获取最新模型列表')
                          ],
                          -1
                        )),
                      e(
                        'button',
                        {
                          class: 'mpop__close',
                          type: 'button',
                          'aria-label': '取消',
                          onClick: t[0] || (t[0] = o => (v.value = !1))
                        },
                        [
                          ...(t[12] ||
                            (t[12] = [
                              e(
                                'svg',
                                {
                                  width: '18',
                                  height: '18',
                                  viewBox: '0 0 24 24',
                                  fill: 'none',
                                  stroke: 'currentColor',
                                  'stroke-width': '2',
                                  'stroke-linecap': 'round',
                                  'stroke-linejoin': 'round'
                                },
                                [
                                  e('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
                                  e('line', { x1: '6', y1: '6', x2: '18', y2: '18' })
                                ],
                                -1
                              )
                            ]))
                        ]
                      )
                    ]),
                    m.value
                      ? (l(),
                        i('div', Ie, [
                          ...(t[14] ||
                            (t[14] = [
                              e(
                                'div',
                                { class: 'mpop__spinner' },
                                [
                                  e(
                                    'svg',
                                    {
                                      width: '28',
                                      height: '28',
                                      viewBox: '0 0 24 24',
                                      fill: 'none',
                                      stroke: 'currentColor',
                                      'stroke-width': '2',
                                      'stroke-linecap': 'round',
                                      'stroke-linejoin': 'round'
                                    },
                                    [
                                      e('polyline', { points: '23 4 23 10 17 10' }),
                                      e('path', { d: 'M20.49 15a9 9 0 1 1-2.12-9.36L23 10' })
                                    ]
                                  )
                                ],
                                -1
                              ),
                              e('p', { class: 'mpop__loading-title' }, '正在连接供应商...', -1),
                              e('p', { class: 'mpop__loading-sub' }, '正在同步模型列表', -1)
                            ]))
                        ]))
                      : c.value.length === 0
                        ? (l(),
                          i('div', Ve, [
                            ...(t[15] ||
                              (t[15] = [
                                e(
                                  'svg',
                                  {
                                    width: '36',
                                    height: '36',
                                    viewBox: '0 0 24 24',
                                    fill: 'none',
                                    stroke: 'currentColor',
                                    'stroke-width': '1.5',
                                    'stroke-linecap': 'round',
                                    'stroke-linejoin': 'round'
                                  },
                                  [
                                    e('polyline', { points: '8 17 12 21 16 17' }),
                                    e('line', { x1: '12', y1: '12', x2: '12', y2: '21' }),
                                    e('path', {
                                      d: 'M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29'
                                    })
                                  ],
                                  -1
                                ),
                                e('p', { class: 'mpop__empty-title' }, '没有可导入的模型', -1),
                                e(
                                  'p',
                                  { class: 'mpop__empty-sub' },
                                  '上游没有返回模型，请检查供应商配置后重试',
                                  -1
                                )
                              ]))
                          ]))
                        : (l(),
                          i('div', Oe, [
                            e('div', Ge, '共 ' + a(c.value.length) + ' 个模型', 1),
                            e('div', Je, [
                              (l(!0),
                              i(
                                f,
                                null,
                                y(
                                  c.value,
                                  o => (
                                    l(),
                                    i(
                                      'div',
                                      {
                                        key: o.modelName,
                                        class: L([
                                          'mpop-card',
                                          {
                                            'mpop-card--selected': F(o.modelName),
                                            'mpop-card--disabled': o.exists || u.value
                                          }
                                        ]),
                                        onClick: x => I(o)
                                      },
                                      [
                                        t[17] ||
                                          (t[17] = e(
                                            'div',
                                            { class: 'mpop-card__radio' },
                                            [e('span', { class: 'mpop-card__dot' })],
                                            -1
                                          )),
                                        e('div', $e, [
                                          e('span', Ke, a(o.displayName || o.modelName), 1),
                                          e('span', We, a(o.modelName), 1)
                                        ]),
                                        e(
                                          'span',
                                          {
                                            class: L([
                                              'mpop-card__badge',
                                              { 'mpop-card__badge--imported': o.exists }
                                            ])
                                          },
                                          [
                                            o.exists
                                              ? (l(),
                                                i('svg', qe, [
                                                  ...(t[16] ||
                                                    (t[16] = [
                                                      e(
                                                        'polyline',
                                                        { points: '20 6 9 17 4 12' },
                                                        null,
                                                        -1
                                                      )
                                                    ]))
                                                ]))
                                              : p('', !0),
                                            M(' ' + a(o.exists ? '已导入' : '未导入'), 1)
                                          ],
                                          2
                                        )
                                      ],
                                      10,
                                      Ye
                                    )
                                  )
                                ),
                                128
                              ))
                            ])
                          ])),
                    e('div', Qe, [
                      e('p', Xe, '已选择 ' + a(_.value.length) + ' 个模型', 1),
                      e(
                        'button',
                        {
                          class: 'mpop__import',
                          type: 'button',
                          disabled: u.value || _.value.length === 0,
                          onClick: V
                        },
                        [
                          u.value ? (l(), i('span', et)) : p('', !0),
                          M(' ' + a(u.value ? '导入中...' : '导入模型'), 1)
                        ],
                        8,
                        Ze
                      )
                    ])
                  ])
                ]),
                _: 1
              },
              8,
              ['show']
            )
          ])
        )
      }
    }
  }),
  nt = Z(tt, [['__scopeId', 'data-v-d8d059f9']])
export { nt as default }
