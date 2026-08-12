import {
  d as H,
  B as D,
  c as n,
  e,
  J as r,
  t as a,
  F as g,
  x as C,
  g as A,
  u as P,
  o as l,
  i as L,
  l as b,
  z as f,
  n as $,
  _ as R
} from './index-gd_PtegP.js'
import { u as S } from './provider-Dii240zR.js'
import './provider-CPPopWTb.js'
import './request-DT7itpYf.js'
const N = { class: 'provider-list' },
  j = { class: 'provider-list__toolbar' },
  z = { class: 'provider-list__toggle' },
  T = ['checked'],
  U = ['disabled'],
  F = { class: 'provider-list__content' },
  G = { key: 0, class: 'provider-list__loading' },
  M = { key: 1, class: 'provider-list__empty' },
  V = { key: 2, class: 'provider-list__items' },
  Y = ['onClick'],
  I = { class: 'provider-card__main' },
  J = { class: 'provider-card__info' },
  q = { class: 'provider-card__name-row' },
  K = { class: 'provider-card__name' },
  O = { key: 0, class: 'provider-card__badge' },
  Q = { key: 1, class: 'provider-card__badge provider-card__badge--disabled' },
  W = { class: 'provider-card__url' },
  X = { class: 'provider-card__meta' },
  Z = { class: 'provider-card__protocol' },
  ee = { class: 'provider-card__count' },
  se = ['disabled', 'onClick'],
  te = ['onClick'],
  oe = ['onClick', 'disabled'],
  ie = H({
    __name: 'ProviderList',
    setup(ne) {
      const c = P(),
        o = S(),
        d = A(!1)
      D(() => {
        ;(o.fetchProviders(d.value), o.runHealthCheckAll())
      })
      function y() {
        ;((d.value = !d.value), o.fetchProviders(d.value))
      }
      function u(i) {
        c.push(`/workspace/settings/providers/${i}`)
      }
      function h() {
        c.push('/workspace/settings/providers/new')
      }
      function m() {
        c.push('/workspace/settings')
      }
      async function w(i) {
        await o.runHealthCheck(i)
      }
      async function x(i) {
        await o.deleteProvider(i)
      }
      function E(i) {
        switch (i) {
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
      function B(i) {
        switch (i) {
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
      return (i, t) => (
        l(),
        n('div', N, [
          e('header', { class: 'provider-list__header' }, [
            e('button', { class: 'provider-list__back', 'aria-label': '返回', onClick: m }, [
              ...(t[3] ||
                (t[3] = [
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
            t[5] || (t[5] = e('h1', { class: 'provider-list__title' }, '供应商管理', -1)),
            e('button', { class: 'provider-list__add', onClick: h }, [
              ...(t[4] ||
                (t[4] = [
                  e(
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
                      e('line', { x1: '12', y1: '5', x2: '12', y2: '19' }),
                      e('line', { x1: '5', y1: '12', x2: '19', y2: '12' })
                    ],
                    -1
                  ),
                  e('span', null, '添加', -1)
                ]))
            ])
          ]),
          e('div', j, [
            e('label', z, [
              e('input', { type: 'checkbox', checked: d.value, onChange: y }, null, 40, T),
              t[6] || (t[6] = e('span', null, '显示已禁用', -1))
            ]),
            e(
              'button',
              {
                class: 'provider-list__refresh',
                onClick: t[0] || (t[0] = s => r(o).runHealthCheckAll()),
                disabled: r(o).healthChecking
              },
              a(r(o).healthChecking ? '检查中...' : '全部检查'),
              9,
              U
            )
          ]),
          e('main', F, [
            r(o).loading
              ? (l(),
                n('div', G, [
                  (l(),
                  n(
                    g,
                    null,
                    C(3, s => e('div', { class: 'provider-list__skeleton', key: s })),
                    64
                  ))
                ]))
              : r(o).sortedProviders.length === 0
                ? (l(),
                  n('div', M, [
                    t[7] ||
                      (t[7] = e(
                        'svg',
                        {
                          width: '48',
                          height: '48',
                          viewBox: '0 0 24 24',
                          fill: 'none',
                          stroke: 'currentColor',
                          'stroke-width': '1.5',
                          'stroke-linecap': 'round',
                          'stroke-linejoin': 'round'
                        },
                        [
                          e('rect', {
                            x: '2',
                            y: '3',
                            width: '20',
                            height: '14',
                            rx: '2',
                            ry: '2'
                          }),
                          e('line', { x1: '8', y1: '21', x2: '16', y2: '21' }),
                          e('line', { x1: '12', y1: '17', x2: '12', y2: '21' })
                        ],
                        -1
                      )),
                    t[8] || (t[8] = e('p', null, '暂无供应商', -1)),
                    e(
                      'button',
                      { class: 'provider-list__empty-btn', onClick: h },
                      '添加第一个供应商'
                    )
                  ]))
                : (l(),
                  n('div', V, [
                    (l(!0),
                    n(
                      g,
                      null,
                      C(r(o).sortedProviders, s => {
                        var p, v, k
                        return (
                          l(),
                          n(
                            'div',
                            {
                              key: s.id,
                              class: L([
                                'provider-card',
                                { 'provider-card--disabled': !s.isEnabled }
                              ]),
                              onClick: _ => u(s.id)
                            },
                            [
                              e('div', I, [
                                e('div', J, [
                                  e('div', q, [
                                    e('h3', K, a(s.name), 1),
                                    s.isBuiltin ? (l(), n('span', O, '内置')) : b('', !0),
                                    s.isEnabled ? b('', !0) : (l(), n('span', Q, '已禁用'))
                                  ]),
                                  e('p', W, a(s.baseUrl), 1),
                                  e('div', X, [
                                    e('span', Z, a(s.protocol), 1),
                                    e(
                                      'span',
                                      ee,
                                      a(((p = s._count) == null ? void 0 : p.models) || 0) +
                                        ' 个模型',
                                      1
                                    )
                                  ])
                                ]),
                                e(
                                  'div',
                                  {
                                    class: 'provider-card__health',
                                    onClick: t[1] || (t[1] = f(() => {}, ['stop']))
                                  },
                                  [
                                    e(
                                      'div',
                                      {
                                        class: 'provider-card__status',
                                        style: $({
                                          background: E(
                                            ((v = r(o).getHealth(s.id)) == null
                                              ? void 0
                                              : v.status) || s.healthStatus
                                          )
                                        })
                                      },
                                      a(
                                        B(
                                          ((k = r(o).getHealth(s.id)) == null
                                            ? void 0
                                            : k.status) || s.healthStatus
                                        )
                                      ),
                                      5
                                    ),
                                    e(
                                      'button',
                                      {
                                        class: 'provider-card__check-btn',
                                        disabled: r(o).healthChecking,
                                        onClick: _ => w(s.id)
                                      },
                                      ' 检查 ',
                                      8,
                                      se
                                    )
                                  ]
                                )
                              ]),
                              e(
                                'div',
                                {
                                  class: 'provider-card__actions',
                                  onClick: t[2] || (t[2] = f(() => {}, ['stop']))
                                },
                                [
                                  e(
                                    'button',
                                    { class: 'provider-card__action', onClick: _ => u(s.id) },
                                    '编辑',
                                    8,
                                    te
                                  ),
                                  e(
                                    'button',
                                    {
                                      class: 'provider-card__action provider-card__action--danger',
                                      onClick: _ => x(s.id),
                                      disabled: s.isBuiltin
                                    },
                                    ' 删除 ',
                                    8,
                                    oe
                                  )
                                ]
                              )
                            ],
                            10,
                            Y
                          )
                        )
                      }),
                      128
                    ))
                  ]))
          ])
        ])
      )
    }
  }),
  ce = R(ie, [['__scopeId', 'data-v-9320538d']])
export { ce as default }
