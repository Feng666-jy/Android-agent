import {
  d as Y,
  B as Z,
  c as l,
  e,
  F as V,
  x as $,
  t as r,
  l as _,
  k as u,
  v as g,
  L as x,
  g as p,
  A as ee,
  o as s,
  i as M,
  f as B
} from './index-CRvy0G29.js'
import { r as w } from './request-CrdghNby.js'
const y = {
    overview() {
      return w.get('/v2/tools')
    },
    createTool(i) {
      return w.post('/v2/tools', i)
    },
    toggleTool(i) {
      return w.post(`/v2/tools/${i}/toggle`)
    },
    deleteTool(i) {
      return w.delete(`/v2/tools/${i}`)
    },
    upsertPermission(i) {
      return w.put('/v2/tools/permissions', i)
    },
    deletePermission(i) {
      return w.delete(`/v2/tools/permissions/${i}`)
    },
    createMcpServer(i) {
      return w.post('/v2/tools/mcp-servers', i)
    },
    deleteMcpServer(i) {
      return w.delete(`/v2/tools/mcp-servers/${i}`)
    },
    testMcpServer(i) {
      return w.post(`/v2/tools/mcp-servers/${i}/test`)
    },
    createSkill(i) {
      return w.post('/v2/tools/skills', i)
    },
    deleteSkill(i) {
      return w.delete(`/v2/tools/skills/${i}`)
    }
  },
  oe = { class: 'tool-manager' },
  ae = { class: 'tool-manager__tabs' },
  te = ['onClick'],
  le = { key: 0, class: 'tool-manager__error' },
  se = { key: 1, class: 'tool-manager__loading' },
  ne = { key: 2, class: 'tool-manager__panel' },
  re = { class: 'tool-manager__row-actions' },
  ie = { key: 0, class: 'tool-manager__form' },
  ue = { class: 'tool-manager__list' },
  me = { class: 'tool-manager__item-main' },
  de = { class: 'tool-manager__item-title' },
  ve = { class: 'tool-manager__item-desc' },
  ce = { class: 'tool-manager__item-actions' },
  pe = ['aria-label', 'onClick'],
  _e = ['onClick'],
  ge = { key: 3, class: 'tool-manager__panel' },
  ke = { class: 'tool-manager__row-actions' },
  he = { key: 0, class: 'tool-manager__form' },
  we = ['value'],
  ye = { class: 'tool-manager__form-row' },
  be = { class: 'tool-manager__form-row' },
  fe = { class: 'tool-manager__form-row' },
  Se = { class: 'tool-manager__list' },
  Ce = { class: 'tool-manager__item-main' },
  Ve = { class: 'tool-manager__item-title' },
  $e = { class: 'tool-manager__badge' },
  xe = { key: 0, class: 'tool-manager__item-desc' },
  Me = ['onClick'],
  Pe = { key: 4, class: 'tool-manager__panel' },
  Ue = { class: 'tool-manager__row-actions' },
  Ne = { key: 0, class: 'tool-manager__form' },
  Te = { class: 'tool-manager__list' },
  Je = { class: 'tool-manager__item-main' },
  Be = { class: 'tool-manager__item-title' },
  je = { class: 'tool-manager__item-desc' },
  Oe = { class: 'tool-manager__item-actions' },
  Ae = ['disabled', 'onClick'],
  Fe = ['onClick'],
  Le = { key: 5, class: 'tool-manager__panel' },
  Ee = { class: 'tool-manager__row-actions' },
  Ie = { key: 0, class: 'tool-manager__form' },
  Re = { class: 'tool-manager__list' },
  He = { class: 'tool-manager__item-main' },
  qe = { class: 'tool-manager__item-title' },
  ze = { class: 'tool-manager__badge' },
  De = { class: 'tool-manager__item-desc' },
  Ge = ['onClick'],
  We = Y({
    __name: 'ToolManager',
    setup(i) {
      const C = p('tools'),
        k = p(null),
        j = p(!1),
        v = p(''),
        P = p(!1),
        h = p({ name: '', description: '', parametersJson: '' }),
        U = p(!1),
        n = p({
          scope: 'user',
          toolName: '',
          permission: 'ask',
          rulePath: '',
          ruleOperator: 'contains',
          ruleValue: '',
          rulePermission: 'ask'
        }),
        N = p(!1),
        d = p({ name: '', url: '', transport: 'sse', headersJson: '' }),
        T = p(!1),
        c = p({ name: '', description: '', content: '', version: '1.0.0' }),
        J = p(null),
        f = p(null),
        F = { builtin: '内置', custom: '自定义', mcp: 'MCP', skill: 'Skill' },
        O = { allow: '允许', ask: '需审批', deny: '禁止' },
        A = { global: '全局', user: '用户', agent: 'Agent' }
      async function b() {
        ;((j.value = !0), (v.value = ''))
        try {
          const t = await y.overview()
          t.code === 0 ? (k.value = t.data) : (v.value = t.message || '加载失败')
        } catch (t) {
          v.value = t.message || '加载失败'
        } finally {
          j.value = !1
        }
      }
      Z(b)
      const L = ee(() => {
        var a, o
        const t = new Set()
        return (
          (a = k.value) == null || a.tools.forEach(m => t.add(m.name)),
          (o = k.value) == null || o.permissions.forEach(m => t.add(m.toolName)),
          Array.from(t)
        )
      })
      async function E() {
        if (h.value.name.trim())
          try {
            ;(await y.createTool({
              name: h.value.name.trim(),
              description: h.value.description.trim(),
              parametersJson: h.value.parametersJson.trim() || '{}'
            }),
              (h.value = { name: '', description: '', parametersJson: '' }),
              (P.value = !1),
              await b())
          } catch (t) {
            v.value = t.message || '创建失败'
          }
      }
      async function I(t) {
        try {
          ;(await y.toggleTool(t.id), (t.enabled = !t.enabled))
        } catch (a) {
          v.value = a.message || '操作失败'
        }
      }
      async function R(t) {
        if (window.confirm(`删除工具 ${t.name}？`))
          try {
            ;(await y.deleteTool(t.id), await b())
          } catch (a) {
            v.value = a.message || '删除失败'
          }
      }
      function H() {
        if (n.value.rulePath.trim())
          return [
            {
              path: n.value.rulePath.trim(),
              operator: n.value.ruleOperator,
              value: n.value.ruleValue.trim() || void 0,
              permission: n.value.rulePermission
            }
          ]
      }
      async function q() {
        if (n.value.toolName.trim())
          try {
            ;(await y.upsertPermission({
              scope: n.value.scope,
              toolName: n.value.toolName.trim(),
              permission: n.value.permission,
              argumentRules: H()
            }),
              (n.value = {
                scope: 'user',
                toolName: '',
                permission: 'ask',
                rulePath: '',
                ruleOperator: 'contains',
                ruleValue: '',
                rulePermission: 'ask'
              }),
              (U.value = !1),
              await b())
          } catch (t) {
            v.value = t.message || '保存失败'
          }
      }
      async function z(t) {
        if (window.confirm(`删除 ${t.toolName} 的 ${A[t.scope]} 权限规则？`))
          try {
            ;(await y.deletePermission(t.id), await b())
          } catch (a) {
            v.value = a.message || '删除失败'
          }
      }
      async function D() {
        if (!(!d.value.name.trim() || !d.value.url.trim()))
          try {
            ;(await y.createMcpServer({
              name: d.value.name.trim(),
              url: d.value.url.trim(),
              transport: d.value.transport,
              headersJson: d.value.headersJson.trim() || '{}'
            }),
              (d.value = { name: '', url: '', transport: 'sse', headersJson: '' }),
              (N.value = !1),
              await b())
          } catch (t) {
            v.value = t.message || '创建失败'
          }
      }
      async function G(t) {
        if (window.confirm(`删除 MCP Server ${t.name}？`))
          try {
            ;(await y.deleteMcpServer(t.id), await b())
          } catch (a) {
            v.value = a.message || '删除失败'
          }
      }
      async function K(t) {
        var a
        ;((J.value = t.id), (f.value = null))
        try {
          const m = ((a = (await y.testMcpServer(t.id)).data) == null ? void 0 : a.tools) ?? []
          f.value = {
            serverId: t.id,
            ok: !0,
            text: `连接成功，发现 ${m.length} 个工具${m.length ? '：' + m.map(S => S.name).join(', ') : ''}`
          }
        } catch (o) {
          f.value = { serverId: t.id, ok: !1, text: o.message || '连接失败' }
        } finally {
          J.value = null
        }
      }
      async function Q() {
        if (c.value.name.trim())
          try {
            ;(await y.createSkill({
              name: c.value.name.trim(),
              description: c.value.description.trim(),
              content: c.value.content,
              version: c.value.version.trim() || '1.0.0'
            }),
              (c.value = { name: '', description: '', content: '', version: '1.0.0' }),
              (T.value = !1),
              await b())
          } catch (t) {
            v.value = t.message || '创建失败'
          }
      }
      async function W(t) {
        if (window.confirm(`删除 Skill ${t.name}？`))
          try {
            ;(await y.deleteSkill(t.id), await b())
          } catch (a) {
            v.value = a.message || '删除失败'
          }
      }
      const X = [
        { key: 'tools', label: '工具' },
        { key: 'permissions', label: '权限' },
        { key: 'mcp', label: 'MCP' },
        { key: 'skills', label: 'Skill' }
      ]
      return (t, a) => (
        s(),
        l('div', oe, [
          e('header', { class: 'tool-manager__header' }, [
            a[23] || (a[23] = e('h1', { class: 'tool-manager__title' }, '工具管理', -1)),
            e('button', { class: 'tool-manager__btn-icon', 'aria-label': '刷新', onClick: b }, [
              ...(a[22] ||
                (a[22] = [
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
                      e('polyline', { points: '23 4 23 10 17 10' }),
                      e('path', { d: 'M20.49 15a9 9 0 1 1-2.12-9.36L23 10' })
                    ],
                    -1
                  )
                ]))
            ])
          ]),
          e('nav', ae, [
            (s(),
            l(
              V,
              null,
              $(X, o =>
                e(
                  'button',
                  {
                    key: o.key,
                    class: M(['tool-manager__tab', { 'is-active': C.value === o.key }]),
                    onClick: m => (C.value = o.key)
                  },
                  r(o.label),
                  11,
                  te
                )
              ),
              64
            ))
          ]),
          v.value ? (s(), l('div', le, r(v.value), 1)) : _('', !0),
          j.value ? (s(), l('div', se, '加载中...')) : _('', !0),
          C.value === 'tools' && k.value
            ? (s(),
              l('section', ne, [
                e('div', re, [
                  e(
                    'button',
                    {
                      class: 'tool-manager__btn-primary',
                      onClick: a[0] || (a[0] = o => (P.value = !P.value))
                    },
                    r(P.value ? '收起' : '+ 新建工具'),
                    1
                  )
                ]),
                P.value
                  ? (s(),
                    l('div', ie, [
                      u(
                        e(
                          'input',
                          {
                            'onUpdate:modelValue': a[1] || (a[1] = o => (h.value.name = o)),
                            class: 'tool-manager__input',
                            placeholder: '工具名（英文，如 weather_now）',
                            maxlength: '64'
                          },
                          null,
                          512
                        ),
                        [[g, h.value.name]]
                      ),
                      u(
                        e(
                          'input',
                          {
                            'onUpdate:modelValue': a[2] || (a[2] = o => (h.value.description = o)),
                            class: 'tool-manager__input',
                            placeholder: '工具描述',
                            maxlength: '500'
                          },
                          null,
                          512
                        ),
                        [[g, h.value.description]]
                      ),
                      u(
                        e(
                          'textarea',
                          {
                            'onUpdate:modelValue':
                              a[3] || (a[3] = o => (h.value.parametersJson = o)),
                            class: 'tool-manager__textarea',
                            placeholder:
                              '参数 JSON Schema（可选，默认 {"type":"object","properties":{}}）',
                            rows: '3'
                          },
                          null,
                          512
                        ),
                        [[g, h.value.parametersJson]]
                      ),
                      e('button', { class: 'tool-manager__btn-primary', onClick: E }, '创建')
                    ]))
                  : _('', !0),
                e('ul', ue, [
                  (s(!0),
                  l(
                    V,
                    null,
                    $(
                      k.value.tools,
                      o => (
                        s(),
                        l('li', { key: o.id, class: 'tool-manager__item' }, [
                          e('div', me, [
                            e('div', de, [
                              B(r(o.name) + ' ', 1),
                              e(
                                'span',
                                { class: M(['tool-manager__badge', `is-${o.source}`]) },
                                r(F[o.source]),
                                3
                              )
                            ]),
                            e('div', ve, r(o.description || '无描述'), 1)
                          ]),
                          e('div', ce, [
                            e(
                              'button',
                              {
                                class: M(['tool-manager__switch', { 'is-on': o.enabled }]),
                                'aria-label': o.enabled ? '禁用' : '启用',
                                onClick: m => I(o)
                              },
                              [
                                ...(a[24] ||
                                  (a[24] = [
                                    e('span', { class: 'tool-manager__switch-knob' }, null, -1)
                                  ]))
                              ],
                              10,
                              pe
                            ),
                            o.source === 'custom'
                              ? (s(),
                                l(
                                  'button',
                                  {
                                    key: 0,
                                    class: 'tool-manager__btn-danger',
                                    'aria-label': '删除',
                                    onClick: m => R(o)
                                  },
                                  [
                                    ...(a[25] ||
                                      (a[25] = [
                                        e(
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
                                            e('polyline', { points: '3 6 5 6 21 6' }),
                                            e('path', {
                                              d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'
                                            })
                                          ],
                                          -1
                                        )
                                      ]))
                                  ],
                                  8,
                                  _e
                                ))
                              : _('', !0)
                          ])
                        ])
                      )
                    ),
                    128
                  ))
                ])
              ]))
            : _('', !0),
          C.value === 'permissions' && k.value
            ? (s(),
              l('section', ge, [
                e('div', ke, [
                  e(
                    'button',
                    {
                      class: 'tool-manager__btn-primary',
                      onClick: a[4] || (a[4] = o => (U.value = !U.value))
                    },
                    r(U.value ? '收起' : '+ 新增规则'),
                    1
                  )
                ]),
                U.value
                  ? (s(),
                    l('div', he, [
                      u(
                        e(
                          'select',
                          {
                            'onUpdate:modelValue': a[5] || (a[5] = o => (n.value.toolName = o)),
                            class: 'tool-manager__select'
                          },
                          [
                            a[26] ||
                              (a[26] = e('option', { value: '', disabled: '' }, '选择工具', -1)),
                            (s(!0),
                            l(
                              V,
                              null,
                              $(
                                L.value,
                                o => (s(), l('option', { key: o, value: o }, r(o), 9, we))
                              ),
                              128
                            ))
                          ],
                          512
                        ),
                        [[x, n.value.toolName]]
                      ),
                      e('div', ye, [
                        u(
                          e(
                            'select',
                            {
                              'onUpdate:modelValue': a[6] || (a[6] = o => (n.value.scope = o)),
                              class: 'tool-manager__select'
                            },
                            [
                              ...(a[27] ||
                                (a[27] = [
                                  e('option', { value: 'user' }, '用户级', -1),
                                  e('option', { value: 'global' }, '全局', -1)
                                ]))
                            ],
                            512
                          ),
                          [[x, n.value.scope]]
                        ),
                        u(
                          e(
                            'select',
                            {
                              'onUpdate:modelValue': a[7] || (a[7] = o => (n.value.permission = o)),
                              class: 'tool-manager__select'
                            },
                            [
                              ...(a[28] ||
                                (a[28] = [
                                  e('option', { value: 'allow' }, '允许', -1),
                                  e('option', { value: 'ask' }, '需审批', -1),
                                  e('option', { value: 'deny' }, '禁止', -1)
                                ]))
                            ],
                            512
                          ),
                          [[x, n.value.permission]]
                        )
                      ]),
                      e('div', be, [
                        u(
                          e(
                            'input',
                            {
                              'onUpdate:modelValue': a[8] || (a[8] = o => (n.value.rulePath = o)),
                              class: 'tool-manager__input',
                              placeholder: '参数路径（如 path，可选）'
                            },
                            null,
                            512
                          ),
                          [[g, n.value.rulePath]]
                        ),
                        u(
                          e(
                            'select',
                            {
                              'onUpdate:modelValue':
                                a[9] || (a[9] = o => (n.value.ruleOperator = o)),
                              class: 'tool-manager__select'
                            },
                            [
                              ...(a[29] ||
                                (a[29] = [
                                  e('option', { value: 'contains' }, '包含', -1),
                                  e('option', { value: 'eq' }, '等于', -1),
                                  e('option', { value: 'regex' }, '正则', -1)
                                ]))
                            ],
                            512
                          ),
                          [[x, n.value.ruleOperator]]
                        )
                      ]),
                      e('div', fe, [
                        u(
                          e(
                            'input',
                            {
                              'onUpdate:modelValue':
                                a[10] || (a[10] = o => (n.value.ruleValue = o)),
                              class: 'tool-manager__input',
                              placeholder: '匹配值（如 /etc）'
                            },
                            null,
                            512
                          ),
                          [[g, n.value.ruleValue]]
                        ),
                        u(
                          e(
                            'select',
                            {
                              'onUpdate:modelValue':
                                a[11] || (a[11] = o => (n.value.rulePermission = o)),
                              class: 'tool-manager__select'
                            },
                            [
                              ...(a[30] ||
                                (a[30] = [
                                  e('option', { value: 'ask' }, '命中→需审批', -1),
                                  e('option', { value: 'deny' }, '命中→禁止', -1)
                                ]))
                            ],
                            512
                          ),
                          [[x, n.value.rulePermission]]
                        )
                      ]),
                      e('button', { class: 'tool-manager__btn-primary', onClick: q }, '保存规则')
                    ]))
                  : _('', !0),
                e('ul', Se, [
                  (s(!0),
                  l(
                    V,
                    null,
                    $(k.value.permissions, o => {
                      var m
                      return (
                        s(),
                        l('li', { key: o.id, class: 'tool-manager__item' }, [
                          e('div', Ce, [
                            e('div', Ve, [
                              B(r(o.toolName) + ' ', 1),
                              e('span', $e, r(A[o.scope]), 1),
                              e(
                                'span',
                                { class: M(['tool-manager__badge', `is-${o.permission}`]) },
                                r(O[o.permission]),
                                3
                              )
                            ]),
                            (m = o.argumentRules) != null && m.length
                              ? (s(),
                                l(
                                  'div',
                                  xe,
                                  ' 参数规则：' +
                                    r(
                                      o.argumentRules
                                        .map(
                                          S =>
                                            `${S.path} ${S.operator} ${S.value ?? ''} → ${O[S.permission]}`
                                        )
                                        .join('；')
                                    ),
                                  1
                                ))
                              : _('', !0)
                          ]),
                          e(
                            'button',
                            {
                              class: 'tool-manager__btn-danger',
                              'aria-label': '删除规则',
                              onClick: S => z(o)
                            },
                            [
                              ...(a[31] ||
                                (a[31] = [
                                  e(
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
                                      e('polyline', { points: '3 6 5 6 21 6' }),
                                      e('path', {
                                        d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'
                                      })
                                    ],
                                    -1
                                  )
                                ]))
                            ],
                            8,
                            Me
                          )
                        ])
                      )
                    }),
                    128
                  ))
                ])
              ]))
            : _('', !0),
          C.value === 'mcp' && k.value
            ? (s(),
              l('section', Pe, [
                e('div', Ue, [
                  e(
                    'button',
                    {
                      class: 'tool-manager__btn-primary',
                      onClick: a[12] || (a[12] = o => (N.value = !N.value))
                    },
                    r(N.value ? '收起' : '+ 添加 MCP Server'),
                    1
                  )
                ]),
                N.value
                  ? (s(),
                    l('div', Ne, [
                      u(
                        e(
                          'input',
                          {
                            'onUpdate:modelValue': a[13] || (a[13] = o => (d.value.name = o)),
                            class: 'tool-manager__input',
                            placeholder: '名称（如 weather-mcp）',
                            maxlength: '64'
                          },
                          null,
                          512
                        ),
                        [[g, d.value.name]]
                      ),
                      u(
                        e(
                          'input',
                          {
                            'onUpdate:modelValue': a[14] || (a[14] = o => (d.value.url = o)),
                            class: 'tool-manager__input',
                            placeholder: 'SSE 地址（如 http://localhost:8080/sse）'
                          },
                          null,
                          512
                        ),
                        [[g, d.value.url]]
                      ),
                      u(
                        e(
                          'select',
                          {
                            'onUpdate:modelValue': a[15] || (a[15] = o => (d.value.transport = o)),
                            class: 'tool-manager__select'
                          },
                          [
                            ...(a[32] ||
                              (a[32] = [
                                e('option', { value: 'sse' }, 'SSE', -1),
                                e('option', { value: 'streamable-http' }, 'streamable-http', -1)
                              ]))
                          ],
                          512
                        ),
                        [[x, d.value.transport]]
                      ),
                      u(
                        e(
                          'input',
                          {
                            'onUpdate:modelValue':
                              a[16] || (a[16] = o => (d.value.headersJson = o)),
                            class: 'tool-manager__input',
                            placeholder: '请求头 JSON（可选，如 {"Authorization":"Bearer xxx"}）'
                          },
                          null,
                          512
                        ),
                        [[g, d.value.headersJson]]
                      ),
                      e('button', { class: 'tool-manager__btn-primary', onClick: D }, '创建')
                    ]))
                  : _('', !0),
                e('ul', Te, [
                  (s(!0),
                  l(
                    V,
                    null,
                    $(
                      k.value.mcpServers,
                      o => (
                        s(),
                        l('li', { key: o.id, class: 'tool-manager__item' }, [
                          e('div', Je, [
                            e('div', Be, [
                              B(r(o.name) + ' ', 1),
                              e(
                                'span',
                                { class: M(['tool-manager__badge', `is-${o.status}`]) },
                                r(o.status),
                                3
                              )
                            ]),
                            e('div', je, r(o.url), 1),
                            f.value && f.value.serverId === o.id
                              ? (s(),
                                l(
                                  'div',
                                  {
                                    key: 0,
                                    class: M([
                                      'tool-manager__item-desc',
                                      { 'is-error': !f.value.ok }
                                    ])
                                  },
                                  r(f.value.text),
                                  3
                                ))
                              : _('', !0)
                          ]),
                          e('div', Oe, [
                            e(
                              'button',
                              {
                                class: 'tool-manager__btn-ghost',
                                disabled: J.value === o.id,
                                onClick: m => K(o)
                              },
                              r(J.value === o.id ? '测试中' : '测试'),
                              9,
                              Ae
                            ),
                            e(
                              'button',
                              {
                                class: 'tool-manager__btn-danger',
                                'aria-label': '删除',
                                onClick: m => G(o)
                              },
                              [
                                ...(a[33] ||
                                  (a[33] = [
                                    e(
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
                                        e('polyline', { points: '3 6 5 6 21 6' }),
                                        e('path', {
                                          d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'
                                        })
                                      ],
                                      -1
                                    )
                                  ]))
                              ],
                              8,
                              Fe
                            )
                          ])
                        ])
                      )
                    ),
                    128
                  ))
                ])
              ]))
            : _('', !0),
          C.value === 'skills' && k.value
            ? (s(),
              l('section', Le, [
                e('div', Ee, [
                  e(
                    'button',
                    {
                      class: 'tool-manager__btn-primary',
                      onClick: a[17] || (a[17] = o => (T.value = !T.value))
                    },
                    r(T.value ? '收起' : '+ 新建 Skill'),
                    1
                  )
                ]),
                T.value
                  ? (s(),
                    l('div', Ie, [
                      u(
                        e(
                          'input',
                          {
                            'onUpdate:modelValue': a[18] || (a[18] = o => (c.value.name = o)),
                            class: 'tool-manager__input',
                            placeholder: 'Skill 名称（如 json-fixer）',
                            maxlength: '64'
                          },
                          null,
                          512
                        ),
                        [[g, c.value.name]]
                      ),
                      u(
                        e(
                          'input',
                          {
                            'onUpdate:modelValue':
                              a[19] || (a[19] = o => (c.value.description = o)),
                            class: 'tool-manager__input',
                            placeholder: '一句话描述（注入 system prompt）',
                            maxlength: '500'
                          },
                          null,
                          512
                        ),
                        [[g, c.value.description]]
                      ),
                      u(
                        e(
                          'textarea',
                          {
                            'onUpdate:modelValue': a[20] || (a[20] = o => (c.value.content = o)),
                            class: 'tool-manager__textarea',
                            placeholder: 'Skill 完整内容（Agent 通过 read_skill 按需读取）',
                            rows: '4'
                          },
                          null,
                          512
                        ),
                        [[g, c.value.content]]
                      ),
                      u(
                        e(
                          'input',
                          {
                            'onUpdate:modelValue': a[21] || (a[21] = o => (c.value.version = o)),
                            class: 'tool-manager__input',
                            placeholder: '版本（默认 1.0.0）',
                            maxlength: '32'
                          },
                          null,
                          512
                        ),
                        [[g, c.value.version]]
                      ),
                      e('button', { class: 'tool-manager__btn-primary', onClick: Q }, '创建')
                    ]))
                  : _('', !0),
                e('ul', Re, [
                  (s(!0),
                  l(
                    V,
                    null,
                    $(
                      k.value.skills,
                      o => (
                        s(),
                        l('li', { key: o.id, class: 'tool-manager__item' }, [
                          e('div', He, [
                            e('div', qe, [
                              B(r(o.name) + ' ', 1),
                              e('span', ze, 'v' + r(o.version), 1)
                            ]),
                            e('div', De, r(o.description || '无描述'), 1)
                          ]),
                          e(
                            'button',
                            {
                              class: 'tool-manager__btn-danger',
                              'aria-label': '删除',
                              onClick: m => W(o)
                            },
                            [
                              ...(a[34] ||
                                (a[34] = [
                                  e(
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
                                      e('polyline', { points: '3 6 5 6 21 6' }),
                                      e('path', {
                                        d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'
                                      })
                                    ],
                                    -1
                                  )
                                ]))
                            ],
                            8,
                            Ge
                          )
                        ])
                      )
                    ),
                    128
                  ))
                ])
              ]))
            : _('', !0)
        ])
      )
    }
  })
export { We as default }
