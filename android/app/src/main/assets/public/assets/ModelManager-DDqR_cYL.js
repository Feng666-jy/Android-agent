import {
  d as E,
  B as N,
  c as n,
  e,
  k as x,
  v as M,
  l as c,
  J as i,
  f as V,
  t as d,
  F as g,
  x as k,
  i as m,
  g as u,
  A as j,
  o as r,
  n as S,
  _ as A
} from './index-gd_PtegP.js'
import { u as D } from './model-C5mwqF1A.js'
import './request-DT7itpYf.js'
const I = { class: 'model-manager' },
  T = { class: 'model-manager__header' },
  U = { key: 0, class: 'model-manager__group-form' },
  W = { class: 'model-manager__search' },
  q = ['value'],
  J = { class: 'model-manager__toolbar' },
  K = { class: 'model-manager__sort' },
  O = { key: 0, class: 'model-manager__sort-menu' },
  Q = ['onClick'],
  H = { class: 'model-manager__groups' },
  P = ['onClick'],
  R = { key: 1, class: 'model-manager__action-bar' },
  X = { class: 'model-manager__action-count' },
  Y = ['onClick'],
  Z = { class: 'model-manager__list' },
  ee = { key: 0, class: 'model-manager__loading' },
  oe = { key: 1, class: 'model-manager__empty' },
  te = { class: 'model-card__check' },
  le = ['checked', 'onChange'],
  ae = { class: 'model-card__body' },
  se = { class: 'model-card__top' },
  ne = { class: 'model-card__name' },
  re = { key: 0, class: 'model-card__badge' },
  ie = { class: 'model-card__meta' },
  de = { class: 'model-card__provider' },
  ce = { key: 0, class: 'model-card__ctx' },
  ue = { class: 'model-card__actions' },
  _e = ['aria-label', 'onClick'],
  ve = ['fill'],
  me = ['onClick'],
  he = E({
    __name: 'ModelManager',
    setup(pe) {
      const l = D(),
        h = u(!1),
        _ = u(''),
        f = u('#4F46E5'),
        s = u(new Set()),
        y = u(void 0),
        p = u(!1),
        b = [
          { value: 'default', label: '默认排序' },
          { value: 'name', label: '按名称' },
          { value: 'created', label: '按创建时间' },
          { value: 'usage', label: '按使用频率' },
          { value: 'favorite', label: '收藏优先' }
        ],
        B = j(() => {
          var a
          return ((a = b.find(t => t.value === l.sortBy)) == null ? void 0 : a.label) || '排序'
        })
      N(() => {
        ;(l.fetchModels(), l.fetchGroups())
      })
      function G(a) {
        const t = a.target.value
        ;(l.setSearch(t), l.fetchModels())
      }
      function $(a) {
        ;(l.setSort(a), l.fetchModels(), (p.value = !1))
      }
      function w(a) {
        ;((y.value = a), l.setActiveGroup(a), l.fetchModels())
      }
      function F(a) {
        ;(s.value.has(a) ? s.value.delete(a) : s.value.add(a), (s.value = new Set(s.value)))
      }
      function z() {
        s.value.size === l.models.length
          ? (s.value = new Set())
          : (s.value = new Set(l.models.map(a => a.id)))
      }
      async function L() {
        _.value.trim() &&
          (await l.createGroup({ name: _.value.trim(), color: f.value }),
          (_.value = ''),
          (h.value = !1))
      }
      async function C(a) {
        s.value.size !== 0 && (await l.moveToGroup(Array.from(s.value), a), (s.value = new Set()))
      }
      return (a, t) => (
        r(),
        n('div', I, [
          e('header', T, [
            t[7] || (t[7] = e('h1', { class: 'model-manager__title' }, '模型管理', -1)),
            e(
              'button',
              {
                class: 'model-manager__btn-icon',
                'aria-label': '新建分组',
                onClick: t[0] || (t[0] = o => (h.value = !h.value))
              },
              [
                ...(t[6] ||
                  (t[6] = [
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
                    )
                  ]))
              ]
            )
          ]),
          h.value
            ? (r(),
              n('div', U, [
                x(
                  e(
                    'input',
                    {
                      'onUpdate:modelValue': t[1] || (t[1] = o => (_.value = o)),
                      class: 'model-manager__input',
                      placeholder: '分组名称',
                      maxlength: '20'
                    },
                    null,
                    512
                  ),
                  [[M, _.value]]
                ),
                x(
                  e(
                    'input',
                    {
                      'onUpdate:modelValue': t[2] || (t[2] = o => (f.value = o)),
                      type: 'color',
                      class: 'model-manager__color'
                    },
                    null,
                    512
                  ),
                  [[M, f.value]]
                ),
                e('button', { class: 'model-manager__btn-primary', onClick: L }, '创建')
              ]))
            : c('', !0),
          e('div', W, [
            t[8] ||
              (t[8] = e(
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
                [
                  e('circle', { cx: '11', cy: '11', r: '8' }),
                  e('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' })
                ],
                -1
              )),
            e(
              'input',
              {
                value: i(l).searchQuery,
                class: 'model-manager__search-input',
                placeholder: '搜索模型名称或别名',
                onInput: G
              },
              null,
              40,
              q
            )
          ]),
          e('div', J, [
            e('div', K, [
              e(
                'button',
                {
                  class: 'model-manager__sort-btn',
                  onClick: t[3] || (t[3] = o => (p.value = !p.value))
                },
                [
                  V(d(B.value) + ' ', 1),
                  t[9] ||
                    (t[9] = e(
                      'svg',
                      {
                        width: '12',
                        height: '12',
                        viewBox: '0 0 24 24',
                        fill: 'none',
                        stroke: 'currentColor',
                        'stroke-width': '2.5'
                      },
                      [e('polyline', { points: '6 9 12 15 18 9' })],
                      -1
                    ))
                ]
              ),
              p.value
                ? (r(),
                  n('div', O, [
                    (r(),
                    n(
                      g,
                      null,
                      k(b, o =>
                        e(
                          'button',
                          {
                            key: o.value,
                            class: m([
                              'model-manager__sort-item',
                              { 'model-manager__sort-item--active': i(l).sortBy === o.value }
                            ]),
                            onClick: v => $(o.value)
                          },
                          d(o.label),
                          11,
                          Q
                        )
                      ),
                      64
                    ))
                  ]))
                : c('', !0)
            ]),
            e(
              'button',
              { class: 'model-manager__btn-text', onClick: z },
              d(
                s.value.size === i(l).models.length && i(l).models.length > 0 ? '取消全选' : '全选'
              ),
              1
            )
          ]),
          e('div', H, [
            e(
              'button',
              {
                class: m([
                  'model-manager__group-chip',
                  { 'model-manager__group-chip--active': y.value === void 0 }
                ]),
                onClick: t[4] || (t[4] = o => w(void 0))
              },
              ' 全部 ',
              2
            ),
            (r(!0),
            n(
              g,
              null,
              k(
                i(l).groups,
                o => (
                  r(),
                  n(
                    'button',
                    {
                      key: o.id,
                      class: m([
                        'model-manager__group-chip',
                        { 'model-manager__group-chip--active': y.value === o.id }
                      ]),
                      style: S({ '--chip-color': o.color || '#8E8E93' }),
                      onClick: v => w(o.id)
                    },
                    d(o.name),
                    15,
                    P
                  )
                )
              ),
              128
            ))
          ]),
          s.value.size > 0
            ? (r(),
              n('div', R, [
                e('span', X, '已选 ' + d(s.value.size) + ' 个', 1),
                e(
                  'button',
                  { class: 'model-manager__action-btn', onClick: t[5] || (t[5] = o => C(null)) },
                  ' 移至未分组 '
                ),
                (r(!0),
                n(
                  g,
                  null,
                  k(
                    i(l).groups,
                    o => (
                      r(),
                      n(
                        'button',
                        {
                          key: o.id,
                          class: 'model-manager__action-btn',
                          style: S({ '--chip-color': o.color || '#4F46E5' }),
                          onClick: v => C(o.id)
                        },
                        d(o.name),
                        13,
                        Y
                      )
                    )
                  ),
                  128
                ))
              ]))
            : c('', !0),
          e('div', Z, [
            i(l).loading
              ? (r(), n('div', ee, '加载中...'))
              : i(l).models.length === 0
                ? (r(), n('div', oe, '暂无模型'))
                : c('', !0),
            (r(!0),
            n(
              g,
              null,
              k(
                i(l).models,
                o => (
                  r(),
                  n(
                    'div',
                    {
                      key: o.id,
                      class: m(['model-card', { 'model-card--selected': s.value.has(o.id) }])
                    },
                    [
                      e('label', te, [
                        e(
                          'input',
                          { type: 'checkbox', checked: s.value.has(o.id), onChange: v => F(o.id) },
                          null,
                          40,
                          le
                        )
                      ]),
                      e('div', ae, [
                        e('div', se, [
                          e('span', ne, d(o.displayName), 1),
                          o.isDefault ? (r(), n('span', re, '默认')) : c('', !0)
                        ]),
                        e('div', ie, [
                          e('span', de, d(o.providerId || ''), 1),
                          o.contextWindow
                            ? (r(), n('span', ce, d(Math.round(o.contextWindow / 1e3)) + 'K ', 1))
                            : c('', !0)
                        ])
                      ]),
                      e('div', ue, [
                        e(
                          'button',
                          {
                            class: m([
                              'model-card__action',
                              { 'model-card__action--active': o.isFavorite }
                            ]),
                            'aria-label': o.isFavorite ? '取消收藏' : '收藏',
                            onClick: v => i(l).toggleFavorite(o.id)
                          },
                          [
                            (r(),
                            n(
                              'svg',
                              {
                                width: '16',
                                height: '16',
                                viewBox: '0 0 24 24',
                                fill: o.isFavorite ? 'currentColor' : 'none',
                                stroke: 'currentColor',
                                'stroke-width': '2',
                                'stroke-linecap': 'round',
                                'stroke-linejoin': 'round'
                              },
                              [
                                ...(t[10] ||
                                  (t[10] = [
                                    e(
                                      'polygon',
                                      {
                                        points:
                                          '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'
                                      },
                                      null,
                                      -1
                                    )
                                  ]))
                              ],
                              8,
                              ve
                            ))
                          ],
                          10,
                          _e
                        ),
                        e(
                          'button',
                          {
                            class: 'model-card__action',
                            'aria-label': '设为默认',
                            onClick: v => i(l).setDefault(o.id)
                          },
                          [
                            ...(t[11] ||
                              (t[11] = [
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
                                  [
                                    e('path', {
                                      d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
                                    })
                                  ],
                                  -1
                                )
                              ]))
                          ],
                          8,
                          me
                        )
                      ])
                    ],
                    2
                  )
                )
              ),
              128
            ))
          ])
        ])
      )
    }
  }),
  ye = A(he, [['__scopeId', 'data-v-69a11a55']])
export { ye as default }
