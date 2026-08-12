import {
  d as P,
  B as G,
  c as r,
  e as t,
  t as u,
  l as v,
  F as V,
  k as f,
  v as $,
  x as D,
  i as F,
  L as J,
  g as m,
  A as M,
  s as h,
  o as i,
  f as R,
  _ as K
} from './index-DTPmbI92.js'
import { r as g } from './request-B60bV0HZ.js'
import { u as Q } from './user-BTyDGE-J.js'
const w = {
    list() {
      return g.get('/v2/orgs')
    },
    create(l) {
      return g.post('/v2/orgs', l)
    },
    detail(l) {
      return g.get(`/v2/orgs/${l}`)
    },
    update(l, d) {
      return g.put(`/v2/orgs/${l}`, d)
    },
    remove(l) {
      return g.delete(`/v2/orgs/${l}`)
    },
    addMember(l, d) {
      return g.post(`/v2/orgs/${l}/members`, d)
    },
    updateMemberRole(l, d, p) {
      return g.put(`/v2/orgs/${l}/members/${d}`, { role: p })
    },
    removeMember(l, d) {
      return g.delete(`/v2/orgs/${l}/members/${d}`)
    }
  },
  W = { class: 'org-view' },
  X = { key: 0, class: 'org-view__error' },
  Y = { key: 1, class: 'org-view__loading' },
  Z = { class: 'org-view__row-actions' },
  ee = { key: 0, class: 'org-view__form' },
  te = { class: 'org-view__list' },
  se = ['onClick'],
  ae = { class: 'org-view__item-main' },
  oe = { class: 'org-view__item-title' },
  re = { class: 'org-view__item-desc' },
  ie = { class: 'org-view__item-meta' },
  le = { key: 0, class: 'org-view__badge is-disabled' },
  ne = { key: 1, class: 'org-view__empty' },
  ue = { class: 'org-view__row-actions' },
  ve = { class: 'org-view__card' },
  de = ['disabled'],
  ce = ['disabled'],
  _e = { class: 'org-view__card-actions' },
  me = { class: 'org-view__card' },
  ge = { class: 'org-view__card-title' },
  we = { class: 'org-view__row-actions' },
  pe = { key: 0, class: 'org-view__form' },
  fe = { class: 'org-view__list' },
  he = { class: 'org-view__item-main' },
  ye = { class: 'org-view__item-title' },
  ke = { class: 'org-view__item-desc' },
  be = { key: 0, class: 'org-view__item-actions' },
  Ce = ['value', 'onChange'],
  $e = ['onClick'],
  Me = P({
    __name: 'OrgView',
    setup(l) {
      const d = Q(),
        p = m(!1),
        n = m(''),
        U = m([]),
        o = m(null),
        y = m(!1),
        c = m({ name: '', description: '' }),
        k = m(!1),
        _ = m({ username: '', role: 'member' }),
        O = { owner: '拥有者', admin: '管理员', member: '成员' },
        B = M(() => {
          var a
          return ((a = d.userInfo) == null ? void 0 : a.id) ?? null
        }),
        I = M(() => {
          var a
          return !o.value || !B.value
            ? null
            : (((a = o.value.members.find(e => e.userId === B.value)) == null ? void 0 : a.role) ??
                null)
        }),
        b = M(() => {
          const a = I.value
          return a === 'owner' || a === 'admin'
        }),
        S = M(() => I.value === 'owner')
      async function x() {
        var a
        ;((p.value = !0), (n.value = ''))
        try {
          const e = await w.list()
          U.value = ((a = e.data) == null ? void 0 : a.items) ?? []
        } catch (e) {
          n.value = e.message || '加载失败'
        } finally {
          p.value = !1
        }
      }
      G(async () => {
        ;(d.userInfo || (await d.fetchUserInfo()), await x())
      })
      async function C(a) {
        n.value = ''
        try {
          const e = await w.detail(a.id)
          o.value = e.data
        } catch (e) {
          n.value = e.message || '加载失败'
        }
      }
      function A() {
        ;((o.value = null), x())
      }
      async function T() {
        if (c.value.name.trim())
          try {
            ;(await w.create({
              name: c.value.name.trim(),
              description: c.value.description.trim()
            }),
              (c.value = { name: '', description: '' }),
              (y.value = !1),
              h('创建成功'),
              await x())
          } catch (a) {
            n.value = a.message || '创建失败'
          }
      }
      async function j() {
        if (o.value)
          try {
            ;(await w.update(o.value.id, {
              name: o.value.name.trim(),
              description: o.value.description.trim()
            }),
              h('已保存'),
              await C(o.value))
          } catch (a) {
            n.value = a.message || '保存失败'
          }
      }
      async function N() {
        if (o.value && window.confirm(`确认解散组织「${o.value.name}」？此操作不可恢复。`))
          try {
            ;(await w.remove(o.value.id), h('组织已解散'), A())
          } catch (a) {
            n.value = a.message || '解散失败'
          }
      }
      async function q() {
        if (!(!o.value || !_.value.username.trim()))
          try {
            ;(await w.addMember(o.value.id, {
              username: _.value.username.trim(),
              role: _.value.role
            }),
              (_.value = { username: '', role: 'member' }),
              (k.value = !1),
              h('成员已添加'),
              await C(o.value))
          } catch (a) {
            n.value = a.message || '添加失败'
          }
      }
      async function z(a, e) {
        if (
          !(!o.value || a.role === e) &&
          window.confirm(`将 ${a.username ?? a.userId} 的角色改为「${O[e]}」？`)
        )
          try {
            ;(await w.updateMemberRole(o.value.id, a.userId, e), h('角色已更新'), await C(o.value))
          } catch (s) {
            n.value = s.message || '操作失败'
          }
      }
      async function E(a) {
        if (o.value && window.confirm(`确认将 ${a.username ?? a.userId} 移出组织？`))
          try {
            ;(await w.removeMember(o.value.id, a.userId), h('成员已移除'), await C(o.value))
          } catch (e) {
            n.value = e.message || '移除失败'
          }
      }
      const H = M(() => {
        if (!o.value) return []
        const a = { owner: 0, admin: 1, member: 2 }
        return [...o.value.members].sort(
          (e, s) => (a[e.role] ?? 9) - (a[s.role] ?? 9) || e.userId - s.userId
        )
      })
      return (a, e) => (
        i(),
        r('div', W, [
          t('header', { class: 'org-view__header' }, [
            e[9] || (e[9] = t('h1', { class: 'org-view__title' }, '组织管理', -1)),
            t('button', { class: 'org-view__btn-icon', 'aria-label': '刷新', onClick: x }, [
              ...(e[8] ||
                (e[8] = [
                  t(
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
                      t('polyline', { points: '23 4 23 10 17 10' }),
                      t('path', { d: 'M20.49 15a9 9 0 1 1-2.12-9.36L23 10' })
                    ],
                    -1
                  )
                ]))
            ])
          ]),
          n.value ? (i(), r('div', X, u(n.value), 1)) : v('', !0),
          p.value ? (i(), r('div', Y, '加载中...')) : v('', !0),
          o.value
            ? o.value
              ? (i(),
                r(
                  V,
                  { key: 3 },
                  [
                    t('div', ue, [
                      t('button', { class: 'org-view__btn-ghost', onClick: A }, '← 返回列表'),
                      t(
                        'div',
                        { class: F(['org-view__badge', `is-${I.value ?? 'member'}`]) },
                        u(O[I.value ?? 'member']),
                        3
                      )
                    ]),
                    t('div', ve, [
                      e[11] ||
                        (e[11] = t('div', { class: 'org-view__card-title' }, '组织信息', -1)),
                      f(
                        t(
                          'input',
                          {
                            'onUpdate:modelValue': e[3] || (e[3] = s => (o.value.name = s)),
                            class: 'org-view__input',
                            disabled: !b.value,
                            maxlength: '64'
                          },
                          null,
                          8,
                          de
                        ),
                        [[$, o.value.name]]
                      ),
                      f(
                        t(
                          'input',
                          {
                            'onUpdate:modelValue': e[4] || (e[4] = s => (o.value.description = s)),
                            class: 'org-view__input',
                            disabled: !b.value,
                            placeholder: '组织描述',
                            maxlength: '200'
                          },
                          null,
                          8,
                          ce
                        ),
                        [[$, o.value.description]]
                      ),
                      t('div', _e, [
                        b.value
                          ? (i(),
                            r(
                              'button',
                              { key: 0, class: 'org-view__btn-primary', onClick: j },
                              ' 保存修改 '
                            ))
                          : v('', !0),
                        S.value
                          ? (i(),
                            r(
                              'button',
                              { key: 1, class: 'org-view__btn-danger', onClick: N },
                              ' 解散组织 '
                            ))
                          : v('', !0)
                      ])
                    ]),
                    t('div', me, [
                      t('div', ge, '成员（' + u(o.value.members.length) + '）', 1),
                      t('div', we, [
                        b.value
                          ? (i(),
                            r(
                              'button',
                              {
                                key: 0,
                                class: 'org-view__btn-primary',
                                onClick: e[5] || (e[5] = s => (k.value = !k.value))
                              },
                              u(k.value ? '收起' : '+ 添加成员'),
                              1
                            ))
                          : v('', !0)
                      ]),
                      k.value
                        ? (i(),
                          r('div', pe, [
                            f(
                              t(
                                'input',
                                {
                                  'onUpdate:modelValue':
                                    e[6] || (e[6] = s => (_.value.username = s)),
                                  class: 'org-view__input',
                                  placeholder: '对方用户名（必填）',
                                  maxlength: '64'
                                },
                                null,
                                512
                              ),
                              [[$, _.value.username]]
                            ),
                            f(
                              t(
                                'select',
                                {
                                  'onUpdate:modelValue': e[7] || (e[7] = s => (_.value.role = s)),
                                  class: 'org-view__select'
                                },
                                [
                                  ...(e[12] ||
                                    (e[12] = [
                                      t('option', { value: 'member' }, '成员', -1),
                                      t('option', { value: 'admin' }, '管理员', -1)
                                    ]))
                                ],
                                512
                              ),
                              [[J, _.value.role]]
                            ),
                            t('button', { class: 'org-view__btn-primary', onClick: q }, '添加')
                          ]))
                        : v('', !0),
                      t('ul', fe, [
                        (i(!0),
                        r(
                          V,
                          null,
                          D(
                            H.value,
                            s => (
                              i(),
                              r('li', { key: s.id, class: 'org-view__item' }, [
                                t('div', he, [
                                  t('div', ye, [
                                    R(u(s.username ?? `用户 #${s.userId}`) + ' ', 1),
                                    t(
                                      'span',
                                      { class: F(['org-view__badge', `is-${s.role}`]) },
                                      u(O[s.role] ?? s.role),
                                      3
                                    )
                                  ]),
                                  t('div', ke, '加入于 ' + u(s.createdAt.slice(0, 10)), 1)
                                ]),
                                b.value && s.userId !== B.value
                                  ? (i(),
                                    r('div', be, [
                                      s.role !== 'owner'
                                        ? (i(),
                                          r(
                                            'select',
                                            {
                                              key: 0,
                                              class: 'org-view__select org-view__select-small',
                                              value: s.role,
                                              onChange: L => z(s, L.target.value)
                                            },
                                            [
                                              ...(e[13] ||
                                                (e[13] = [
                                                  t('option', { value: 'admin' }, '管理员', -1),
                                                  t('option', { value: 'member' }, '成员', -1)
                                                ]))
                                            ],
                                            40,
                                            Ce
                                          ))
                                        : v('', !0),
                                      t(
                                        'button',
                                        {
                                          class: 'org-view__btn-danger',
                                          'aria-label': '移除成员',
                                          onClick: L => E(s)
                                        },
                                        [
                                          ...(e[14] ||
                                            (e[14] = [
                                              t(
                                                'svg',
                                                {
                                                  width: '14',
                                                  height: '14',
                                                  viewBox: '0 0 24 24',
                                                  fill: 'none',
                                                  stroke: 'currentColor',
                                                  'stroke-width': '2',
                                                  'stroke-linecap': 'round',
                                                  'stroke-linejoin': 'round'
                                                },
                                                [
                                                  t('polyline', { points: '3 6 5 6 21 6' }),
                                                  t('path', {
                                                    d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'
                                                  })
                                                ],
                                                -1
                                              )
                                            ]))
                                        ],
                                        8,
                                        $e
                                      )
                                    ]))
                                  : v('', !0)
                              ])
                            )
                          ),
                          128
                        ))
                      ])
                    ])
                  ],
                  64
                ))
              : v('', !0)
            : (i(),
              r(
                V,
                { key: 2 },
                [
                  t('div', Z, [
                    t(
                      'button',
                      {
                        class: 'org-view__btn-primary',
                        onClick: e[0] || (e[0] = s => (y.value = !y.value))
                      },
                      u(y.value ? '收起' : '+ 创建组织'),
                      1
                    )
                  ]),
                  y.value
                    ? (i(),
                      r('div', ee, [
                        f(
                          t(
                            'input',
                            {
                              'onUpdate:modelValue': e[1] || (e[1] = s => (c.value.name = s)),
                              class: 'org-view__input',
                              placeholder: '组织名称（必填）',
                              maxlength: '64'
                            },
                            null,
                            512
                          ),
                          [[$, c.value.name]]
                        ),
                        f(
                          t(
                            'input',
                            {
                              'onUpdate:modelValue':
                                e[2] || (e[2] = s => (c.value.description = s)),
                              class: 'org-view__input',
                              placeholder: '组织描述（可选）',
                              maxlength: '200'
                            },
                            null,
                            512
                          ),
                          [[$, c.value.description]]
                        ),
                        t('button', { class: 'org-view__btn-primary', onClick: T }, '创建')
                      ]))
                    : v('', !0),
                  t('ul', te, [
                    (i(!0),
                    r(
                      V,
                      null,
                      D(
                        U.value,
                        s => (
                          i(),
                          r(
                            'li',
                            { key: s.id, class: 'org-view__item', onClick: L => C(s) },
                            [
                              t('div', ae, [
                                t('div', oe, u(s.name), 1),
                                t('div', re, u(s.description || '暂无描述'), 1),
                                t('div', ie, [
                                  R(' 创建于 ' + u(s.createdAt.slice(0, 10)) + ' ', 1),
                                  s.status !== 'active'
                                    ? (i(), r('span', le, u(s.status), 1))
                                    : v('', !0)
                                ])
                              ]),
                              e[10] ||
                                (e[10] = t(
                                  'svg',
                                  {
                                    width: '16',
                                    height: '16',
                                    viewBox: '0 0 24 24',
                                    fill: 'none',
                                    stroke: 'currentColor',
                                    'stroke-width': '2',
                                    'stroke-linecap': 'round',
                                    'stroke-linejoin': 'round',
                                    class: 'org-view__chevron'
                                  },
                                  [t('polyline', { points: '9 18 15 12 9 6' })],
                                  -1
                                ))
                            ],
                            8,
                            se
                          )
                        )
                      ),
                      128
                    ))
                  ]),
                  !U.value.length && !p.value
                    ? (i(),
                      r(
                        'div',
                        ne,
                        ' 还没有组织。创建组织后，可将 Agent、工作流与用量在团队内共享。 '
                      ))
                    : v('', !0)
                ],
                64
              ))
        ])
      )
    }
  }),
  Ue = K(Me, [['__scopeId', 'data-v-a0d38d44']])
export { Ue as default }
