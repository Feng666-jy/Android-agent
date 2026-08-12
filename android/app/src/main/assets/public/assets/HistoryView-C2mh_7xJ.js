import {
  d as P,
  B as U,
  p as Y,
  c as o,
  F as h,
  x as y,
  e,
  t as l,
  l as u,
  z as D,
  g as r,
  s as v,
  A as q,
  I as z,
  o as n,
  i as $,
  n as G,
  _ as K
} from './index-gd_PtegP.js'
import { a as k } from './agent-Bh8Q5wlv.js'
import './request-DT7itpYf.js'
const Q = { class: 'history' },
  W = { key: 0, class: 'history__loading' },
  X = { key: 1, class: 'history__empty' },
  Z = { class: 'history__bar' },
  j = { class: 'history__select-all' },
  ee = ['checked'],
  te = { class: 'history__bar-actions' },
  se = { class: 'history__list' },
  ae = ['onClick'],
  le = { class: 'run-card__head' },
  oe = { class: 'run-card__task' },
  ne = { class: 'run-card__meta' },
  ie = { class: 'run-card__model' },
  de = { class: 'run-card__stats' },
  ce = { class: 'run-card__stat' },
  re = { class: 'run-card__stat' },
  _e = { class: 'run-card__stat' },
  ue = { class: 'run-card__side' },
  he = ['checked', 'onChange'],
  ve = ['onClick'],
  fe = ['disabled'],
  pe = { key: 1, class: 'history__end' },
  ye = { class: 'detail-sheet' },
  ke = { key: 0, class: 'detail-sheet__loading' },
  ge = { key: 1, class: 'detail-sheet__body' },
  me = { class: 'detail-sheet__section' },
  be = { class: 'detail-sheet__task' },
  Ce = { class: 'detail-sheet__meta' },
  we = { class: 'detail-sheet__stats' },
  xe = { class: 'detail-sheet__stat' },
  Se = { class: 'detail-sheet__stat' },
  $e = { class: 'detail-sheet__stat' },
  Be = { key: 0, class: 'detail-sheet__section detail-sheet__section--error' },
  Te = { class: 'detail-sheet__error' },
  Ae = { class: 'detail-sheet__section' },
  De = { key: 0, class: 'detail-sheet__none' },
  ze = { class: 'detail-sheet__tool-row' },
  Me = { class: 'detail-sheet__tool-ms' },
  Ee = { class: 'detail-sheet__args' },
  Je = { key: 0, class: 'detail-sheet__output' },
  Ie = { class: 'detail-sheet__section' },
  Le = { class: 'detail-sheet__msg-row' },
  Ne = { class: 'detail-sheet__msg-time' },
  Oe = { key: 0, class: 'detail-sheet__msg-content' },
  Ve = { key: 1 },
  Fe = 20,
  He = P({
    __name: 'HistoryView',
    setup(Re) {
      const d = r([]),
        f = r(0),
        g = r(1),
        m = r(!1),
        p = r(!1),
        c = r(new Set()),
        i = r(null),
        b = r(!1),
        C = r(!1)
      async function w(a = !1) {
        a ? (p.value = !0) : (m.value = !0)
        try {
          const s = await k.history(g.value, Fe)
          s.code === 0 &&
            ((f.value = s.data.total), (d.value = a ? [...d.value, ...s.data.list] : s.data.list))
        } catch {
          v('加载失败')
        } finally {
          ;((m.value = !1), (p.value = !1))
        }
      }
      function M() {
        d.value.length >= f.value || p.value || ((g.value += 1), w(!0))
      }
      function E() {
        ;((g.value = 1), w(!1))
      }
      function J(a) {
        c.value.has(a) ? c.value.delete(a) : c.value.add(a)
      }
      const B = q(() => d.value.length > 0 && c.value.size === d.value.length)
      function I() {
        B.value ? c.value.clear() : d.value.forEach(a => c.value.add(a.id))
      }
      async function L(a) {
        try {
          await z({
            title: '确认删除',
            message: '删除后该会话及其记录将无法恢复，确定继续？',
            confirmButtonText: '删除',
            confirmButtonColor: '#ee0a24'
          })
        } catch {
          return
        }
        try {
          ;(await k.remove(a)).code === 0 &&
            ((d.value = d.value.filter(t => t.id !== a)), c.value.delete(a), v('已删除'))
        } catch {
          v('删除失败')
        }
      }
      async function N() {
        const a = [...c.value]
        if (a.length !== 0) {
          try {
            await z({
              title: '批量删除',
              message: `确定删除选中的 ${a.length} 条会话记录？`,
              confirmButtonText: '删除',
              confirmButtonColor: '#ee0a24'
            })
          } catch {
            return
          }
          try {
            const s = await k.batchDelete(a)
            if (s.code === 0) {
              const t = new Set(a)
              ;((d.value = d.value.filter(_ => !t.has(_.id))),
                c.value.clear(),
                (f.value -= s.data.deleted),
                v(`已删除 ${s.data.deleted} 条`))
            }
          } catch {
            v('批量删除失败')
          }
        }
      }
      async function O(a) {
        ;((b.value = !0), (C.value = !0))
        try {
          const s = await k.detail(a)
          s.code === 0 && (i.value = s.data)
        } catch {
          v('加载详情失败')
        } finally {
          C.value = !1
        }
      }
      function x() {
        ;((b.value = !1), (i.value = null))
      }
      function V(a) {
        switch (a) {
          case 'completed':
            return '#07c160'
          case 'failed':
            return '#ee0a24'
          case 'budget_exceeded':
            return '#ff976a'
          case 'cancelled':
            return '#969799'
          default:
            return '#1989fa'
        }
      }
      function F(a) {
        switch (a) {
          case 'completed':
            return '已完成'
          case 'failed':
            return '失败'
          case 'budget_exceeded':
            return '超出预算'
          case 'cancelled':
            return '已取消'
          case 'running':
            return '运行中'
          default:
            return a
        }
      }
      function S(a) {
        if (!a) return '-'
        const s = new Date(a),
          t = _ => String(_).padStart(2, '0')
        return `${s.getFullYear()}-${t(s.getMonth() + 1)}-${t(s.getDate())} ${t(s.getHours())}:${t(s.getMinutes())}`
      }
      function H(a) {
        try {
          return JSON.stringify(JSON.parse(a), null, 2)
        } catch {
          return a || '{}'
        }
      }
      function R(a) {
        if (!a) return []
        try {
          return JSON.parse(a)
        } catch {
          return []
        }
      }
      function T(a) {
        a.key === 'Escape' && x()
      }
      return (
        U(() => {
          ;(w(!1), window.addEventListener('keydown', T))
        }),
        Y(() => {
          window.removeEventListener('keydown', T)
        }),
        (a, s) => (
          n(),
          o('div', Q, [
            m.value
              ? (n(),
                o('div', W, [
                  (n(),
                  o(
                    h,
                    null,
                    y(3, t => e('div', { key: t, class: 'history__skeleton' })),
                    64
                  ))
                ]))
              : d.value.length === 0
                ? (n(),
                  o('div', X, [
                    ...(s[1] ||
                      (s[1] = [
                        e(
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
                            e('circle', { cx: '12', cy: '12', r: '10' }),
                            e('polyline', { points: '12 6 12 12 16 14' })
                          ],
                          -1
                        ),
                        e('p', null, '暂无 Agent 运行记录', -1)
                      ]))
                  ]))
                : (n(),
                  o(
                    h,
                    { key: 2 },
                    [
                      e('div', Z, [
                        e('label', j, [
                          e(
                            'input',
                            { type: 'checkbox', checked: B.value, onChange: I },
                            null,
                            40,
                            ee
                          ),
                          s[2] || (s[2] = e('span', null, '全选', -1))
                        ]),
                        e('div', te, [
                          c.value.size
                            ? (n(),
                              o(
                                'button',
                                {
                                  key: 0,
                                  class: 'history__bar-btn history__bar-btn--danger',
                                  onClick: N
                                },
                                ' 删除选中（' + l(c.value.size) + '） ',
                                1
                              ))
                            : u('', !0),
                          e('button', { class: 'history__bar-btn', onClick: E }, '刷新')
                        ])
                      ]),
                      e('div', se, [
                        (n(!0),
                        o(
                          h,
                          null,
                          y(
                            d.value,
                            t => (
                              n(),
                              o(
                                'div',
                                {
                                  key: t.id,
                                  class: $([
                                    'run-card',
                                    { 'run-card--selected': c.value.has(t.id) }
                                  ])
                                },
                                [
                                  e(
                                    'div',
                                    { class: 'run-card__main', onClick: _ => O(t.id) },
                                    [
                                      e('div', le, [
                                        e('h3', oe, l(t.task), 1),
                                        e(
                                          'span',
                                          {
                                            class: 'run-card__badge',
                                            style: G({ background: V(t.status) })
                                          },
                                          l(F(t.status)),
                                          5
                                        )
                                      ]),
                                      e('p', ne, [
                                        e('span', null, l(S(t.createdAt)), 1),
                                        e('span', ie, l(t.modelId), 1)
                                      ]),
                                      e('div', de, [
                                        e('span', ce, l(t.iterations) + ' 轮', 1),
                                        e('span', re, l(t.toolCallCount) + ' 次工具', 1),
                                        e('span', _e, l(t.tokenTotal) + ' tokens', 1)
                                      ])
                                    ],
                                    8,
                                    ae
                                  ),
                                  e('div', ue, [
                                    e(
                                      'input',
                                      {
                                        type: 'checkbox',
                                        class: 'run-card__check',
                                        checked: c.value.has(t.id),
                                        onClick: s[0] || (s[0] = D(() => {}, ['stop'])),
                                        onChange: _ => J(t.id)
                                      },
                                      null,
                                      40,
                                      he
                                    ),
                                    e(
                                      'button',
                                      { class: 'run-card__del', onClick: _ => L(t.id) },
                                      '删除',
                                      8,
                                      ve
                                    )
                                  ])
                                ],
                                2
                              )
                            )
                          ),
                          128
                        ))
                      ]),
                      d.value.length < f.value
                        ? (n(),
                          o(
                            'button',
                            { key: 0, class: 'history__more', disabled: p.value, onClick: M },
                            l(p.value ? '加载中...' : '加载更多'),
                            9,
                            fe
                          ))
                        : (n(), o('p', pe, '已加载全部 ' + l(f.value) + ' 条', 1))
                    ],
                    64
                  )),
            b.value
              ? (n(),
                o('div', { key: 3, class: 'detail-overlay', onClick: D(x, ['self']) }, [
                  e('div', ye, [
                    e('div', { class: 'detail-sheet__head' }, [
                      s[3] || (s[3] = e('p', { class: 'detail-sheet__title' }, '运行详情', -1)),
                      e('button', { class: 'detail-sheet__close', onClick: x }, '✕')
                    ]),
                    C.value
                      ? (n(), o('div', ke, '加载中...'))
                      : i.value
                        ? (n(),
                          o('div', ge, [
                            e('div', me, [
                              s[4] || (s[4] = e('p', { class: 'detail-sheet__label' }, '任务', -1)),
                              e('p', be, l(i.value.task), 1),
                              e(
                                'p',
                                Ce,
                                l(S(i.value.createdAt)) +
                                  ' · ' +
                                  l(i.value.modelId) +
                                  ' · ' +
                                  l(i.value.sandboxRoot),
                                1
                              )
                            ]),
                            e('div', we, [
                              e('div', xe, [
                                e('span', null, l(i.value.iterations), 1),
                                s[5] || (s[5] = e('i', null, '轮次', -1))
                              ]),
                              e('div', Se, [
                                e('span', null, l(i.value.toolCallCount), 1),
                                s[6] || (s[6] = e('i', null, '工具调用', -1))
                              ]),
                              e('div', $e, [
                                e('span', null, l(i.value.tokenTotal), 1),
                                s[7] || (s[7] = e('i', null, 'Tokens', -1))
                              ])
                            ]),
                            i.value.error
                              ? (n(),
                                o('div', Be, [
                                  s[8] ||
                                    (s[8] = e('p', { class: 'detail-sheet__label' }, '错误', -1)),
                                  e('p', Te, l(i.value.error), 1)
                                ]))
                              : u('', !0),
                            e('div', Ae, [
                              s[9] ||
                                (s[9] = e('p', { class: 'detail-sheet__label' }, '工具调用', -1)),
                              i.value.toolCalls.length === 0
                                ? (n(), o('div', De, '无工具调用'))
                                : u('', !0),
                              (n(!0),
                              o(
                                h,
                                null,
                                y(
                                  i.value.toolCalls,
                                  t => (
                                    n(),
                                    o('div', { key: t.id, class: 'detail-sheet__tool' }, [
                                      e('div', ze, [
                                        e('code', null, l(t.name), 1),
                                        e(
                                          'span',
                                          {
                                            class: $([
                                              'detail-sheet__tool-ok',
                                              t.ok ? '--pass' : '--fail'
                                            ])
                                          },
                                          l(t.ok ? '成功' : '失败'),
                                          3
                                        ),
                                        e('span', Me, l(t.durationMs) + 'ms', 1)
                                      ]),
                                      e('pre', Ee, l(H(t.argumentsJson)), 1),
                                      t.output ? (n(), o('pre', Je, l(t.output), 1)) : u('', !0)
                                    ])
                                  )
                                ),
                                128
                              ))
                            ]),
                            e('div', Ie, [
                              s[10] ||
                                (s[10] = e('p', { class: 'detail-sheet__label' }, '对话消息', -1)),
                              (n(!0),
                              o(
                                h,
                                null,
                                y(
                                  i.value.messages,
                                  (t, _) => (
                                    n(),
                                    o('div', { key: _, class: 'detail-sheet__msg' }, [
                                      e('div', Le, [
                                        e(
                                          'span',
                                          { class: $(['detail-sheet__msg-role', `--${t.role}`]) },
                                          l(t.role),
                                          3
                                        ),
                                        e('span', Ne, l(S(t.createdAt)), 1)
                                      ]),
                                      t.content ? (n(), o('p', Oe, l(t.content), 1)) : u('', !0),
                                      t.toolCallsJson
                                        ? (n(),
                                          o('div', Ve, [
                                            (n(!0),
                                            o(
                                              h,
                                              null,
                                              y(
                                                R(t.toolCallsJson),
                                                A => (
                                                  n(),
                                                  o(
                                                    'div',
                                                    { key: A.id, class: 'detail-sheet__msg-tool' },
                                                    [e('code', null, l(A.name), 1)]
                                                  )
                                                )
                                              ),
                                              128
                                            ))
                                          ]))
                                        : u('', !0)
                                    ])
                                  )
                                ),
                                128
                              ))
                            ])
                          ]))
                        : u('', !0)
                  ])
                ]))
              : u('', !0)
          ])
        )
      )
    }
  }),
  qe = K(He, [['__scopeId', 'data-v-4e12a5da']])
export { qe as default }
