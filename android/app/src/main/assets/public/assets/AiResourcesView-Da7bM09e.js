import {
  d as R,
  B as H,
  c as i,
  e as s,
  t,
  l as p,
  F as l,
  x as m,
  g,
  u as S,
  o,
  f,
  i as E,
  s as c,
  _ as D
} from './index-gd_PtegP.js'
import { r as b } from './request-DT7itpYf.js'
import { p as N } from './provider-CPPopWTb.js'
const B = {
    summary() {
      return b.get('/v2/ai-resources/summary')
    },
    usage(C) {
      return b.get('/v2/ai-resources/usage', { params: C })
    },
    models() {
      return b.get('/v2/ai-resources/models')
    }
  },
  F = { class: 'ai-res' },
  O = { key: 0, class: 'ai-res__error' },
  V = { key: 1, class: 'ai-res__loading' },
  G = { class: 'ai-res__card' },
  U = { class: 'ai-res__card-head' },
  q = { class: 'ai-res__card-meta' },
  Y = { class: 'ai-res__usage-grid' },
  W = { class: 'ai-res__usage-cell' },
  j = { class: 'ai-res__usage-num' },
  z = { class: 'ai-res__usage-label' },
  X = { class: 'ai-res__usage-cell' },
  J = { class: 'ai-res__usage-num' },
  Q = { class: 'ai-res__usage-label' },
  Z = { class: 'ai-res__usage-cell' },
  ss = { class: 'ai-res__usage-num' },
  es = { class: 'ai-res__card' },
  as = { key: 0, class: 'ai-res__list' },
  ts = { class: 'ai-res__provider-main' },
  is = { class: 'ai-res__provider-title' },
  os = { class: 'ai-res__provider-desc' },
  rs = { class: 'ai-res__provider-meta' },
  ns = { class: 'ai-res__provider-actions' },
  _s = ['disabled', 'onClick'],
  ls = ['onClick'],
  cs = { key: 1, class: 'ai-res__empty' },
  ds = { class: 'ai-res__card' },
  us = { key: 0, class: 'ai-res__list' },
  hs = { class: 'ai-res__key-main' },
  vs = { class: 'ai-res__key-title' },
  ms = { class: 'ai-res__key-meta' },
  gs = { class: 'ai-res__key-actions' },
  ys = ['onClick'],
  ks = ['onClick'],
  ps = ['onClick'],
  fs = { key: 1, class: 'ai-res__empty' },
  bs = { class: 'ai-res__card' },
  Cs = { class: 'ai-res__card-head' },
  As = { class: 'ai-res__card-title' },
  ws = { key: 0, class: 'ai-res__list' },
  $s = { class: 'ai-res__model-main' },
  Es = { class: 'ai-res__model-title' },
  Ns = { class: 'ai-res__model-name' },
  Ts = { class: 'ai-res__model-desc' },
  Ms = { class: 'ai-res__model-tags' },
  Ps = { class: 'ai-res__tag' },
  Is = { key: 1, class: 'ai-res__empty' },
  xs = R({
    __name: 'AiResourcesView',
    setup(C) {
      const y = S(),
        k = g(!1),
        d = g(''),
        n = g(null),
        u = g(new Set())
      async function h() {
        ;((k.value = !0), (d.value = ''))
        try {
          const e = await B.summary()
          n.value = e.data
        } catch (e) {
          d.value = e.message || '加载失败'
        } finally {
          k.value = !1
        }
      }
      H(h)
      function v(e) {
        return e >= 1e6
          ? `${(e / 1e6).toFixed(2)}M`
          : e >= 1e3
            ? `${(e / 1e3).toFixed(1)}K`
            : String(e)
      }
      function T(e) {
        return e <= 0 ? '$0' : e >= 1 ? `$${e.toFixed(2)}` : `$${e.toFixed(4)}`
      }
      function M(e) {
        return e ? e.slice(0, 16).replace('T', ' ') : '-'
      }
      function P(e) {
        return (
          { HEALTHY: '健康', DEGRADED: '异常', UNREACHABLE: '不可达', UNKNOWN: '未检测' }[e] ?? e
        )
      }
      function I(e) {
        return e === 'HEALTHY'
          ? 'is-ok'
          : e === 'DEGRADED'
            ? 'is-warn'
            : e === 'UNREACHABLE'
              ? 'is-bad'
              : 'is-unknown'
      }
      function A(e) {
        y.push(`/workspace/settings/providers/${e}`)
      }
      function w() {
        y.push('/workspace/settings/providers/new')
      }
      function x() {
        y.push('/workspace/settings/models')
      }
      async function $(e) {
        u.value.add(e.id)
        try {
          const a = (await N.healthCheck(e.id)).data
          ;(a.status === 'HEALTHY'
            ? c(`${e.name} 连接正常（${a.latencyMs}ms）`)
            : c(`${e.name} 连接失败：${a.errorMessage ?? a.status}`),
            await h())
        } catch (r) {
          c(r.message || '测试失败')
        } finally {
          u.value.delete(e.id)
        }
      }
      async function K(e) {
        if (
          e.hasApiKey &&
          window.confirm(`确认删除「${e.name}」的 API Key？删除后该供应商将无法调用。`)
        )
          try {
            ;(await N.update(e.id, { apiKeyEncrypted: '' }), c('已删除 API Key'), await h())
          } catch (r) {
            c(r.message || '删除失败')
          }
      }
      function L(e) {
        return (
          {
            TEXT: '文本',
            VISION: '视觉',
            TOOL_CALLING: '工具',
            REASONING: '推理',
            MCP: 'MCP',
            PROMPT_CACHE: '缓存',
            STREAMING: '流式'
          }[e] ?? e
        )
      }
      return (e, r) => (
        o(),
        i('div', F, [
          s('header', { class: 'ai-res__header' }, [
            r[1] ||
              (r[1] = s(
                'div',
                { class: 'ai-res__heading' },
                [
                  s('h1', { class: 'ai-res__title' }, 'AI 资源'),
                  s('p', { class: 'ai-res__subtitle' }, '供应商 · 模型目录 · 用量与成本')
                ],
                -1
              )),
            s('button', { class: 'ai-res__btn-icon', 'aria-label': '刷新', onClick: h }, [
              ...(r[0] ||
                (r[0] = [
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
          d.value ? (o(), i('div', O, t(d.value), 1)) : p('', !0),
          k.value && !n.value ? (o(), i('div', V, '加载中...')) : p('', !0),
          n.value
            ? (o(),
              i(
                l,
                { key: 2 },
                [
                  s('section', G, [
                    s('div', U, [
                      r[2] || (r[2] = s('h2', { class: 'ai-res__card-title' }, '用量统计', -1)),
                      s(
                        'span',
                        q,
                        '平均耗时 ' + t(n.value.usage.total.averageLatencyMs.toFixed(0)) + 'ms',
                        1
                      )
                    ]),
                    s('div', Y, [
                      s('div', W, [
                        s('span', j, t(n.value.usage.today.requests), 1),
                        s(
                          'span',
                          z,
                          '今日请求 · ' + t(v(n.value.usage.today.totalTokens)) + ' tokens',
                          1
                        )
                      ]),
                      s('div', X, [
                        s('span', J, t(n.value.usage.month.requests), 1),
                        s(
                          'span',
                          Q,
                          '本月请求 · ' + t(v(n.value.usage.month.totalTokens)) + ' tokens',
                          1
                        )
                      ]),
                      s('div', Z, [
                        s('span', ss, t(T(n.value.usage.total.estimatedCost)), 1),
                        r[3] ||
                          (r[3] = s(
                            'span',
                            { class: 'ai-res__usage-label' },
                            '累计成本估算（USD）',
                            -1
                          ))
                      ])
                    ])
                  ]),
                  s('section', es, [
                    s('div', { class: 'ai-res__card-head' }, [
                      r[4] || (r[4] = s('h2', { class: 'ai-res__card-title' }, '供应商总览', -1)),
                      s('button', { class: 'ai-res__btn-ghost', onClick: w }, '+ 新增供应商')
                    ]),
                    n.value.providers.length
                      ? (o(),
                        i('ul', as, [
                          (o(!0),
                          i(
                            l,
                            null,
                            m(
                              n.value.providers,
                              a => (
                                o(),
                                i('li', { key: a.id, class: 'ai-res__provider' }, [
                                  s('div', ts, [
                                    s('div', is, [
                                      f(t(a.name) + ' ', 1),
                                      s(
                                        'span',
                                        { class: E(['ai-res__badge', I(a.healthStatus)]) },
                                        t(P(a.healthStatus)),
                                        3
                                      )
                                    ]),
                                    s('div', os, t(a.baseUrl), 1),
                                    s('div', rs, t(a.modelCount) + ' 个模型 · ' + t(a.protocol), 1)
                                  ]),
                                  s('div', ns, [
                                    s(
                                      'button',
                                      {
                                        class: 'ai-res__btn-primary',
                                        disabled: u.value.has(a.id),
                                        onClick: _ => $(a)
                                      },
                                      t(u.value.has(a.id) ? '测试中...' : '测试连接'),
                                      9,
                                      _s
                                    ),
                                    s(
                                      'button',
                                      { class: 'ai-res__btn-ghost', onClick: _ => A(a.id) },
                                      '管理',
                                      8,
                                      ls
                                    )
                                  ])
                                ])
                              )
                            ),
                            128
                          ))
                        ]))
                      : (o(),
                        i('div', cs, ' 还没有供应商。点击「新增供应商」添加你的第一个 Provider。 '))
                  ]),
                  s('section', ds, [
                    s('div', { class: 'ai-res__card-head' }, [
                      r[5] || (r[5] = s('h2', { class: 'ai-res__card-title' }, 'API Key 管理', -1)),
                      s('button', { class: 'ai-res__btn-ghost', onClick: w }, '新增 Key')
                    ]),
                    n.value.providers.length
                      ? (o(),
                        i('ul', us, [
                          (o(!0),
                          i(
                            l,
                            null,
                            m(
                              n.value.providers,
                              a => (
                                o(),
                                i('li', { key: a.id, class: 'ai-res__key' }, [
                                  s('div', hs, [
                                    s('div', vs, [
                                      f(t(a.name) + ' ', 1),
                                      s(
                                        'span',
                                        {
                                          class: E([
                                            'ai-res__badge',
                                            a.hasApiKey ? 'is-ok' : 'is-unknown'
                                          ])
                                        },
                                        t(a.hasApiKey ? '已配置' : '未配置'),
                                        3
                                      )
                                    ]),
                                    s('div', ms, '最后使用 ' + t(M(a.lastCheckedAt)), 1)
                                  ]),
                                  s('div', gs, [
                                    a.hasApiKey
                                      ? (o(),
                                        i(
                                          l,
                                          { key: 1 },
                                          [
                                            s(
                                              'button',
                                              { class: 'ai-res__btn-primary', onClick: _ => $(a) },
                                              '测试连接',
                                              8,
                                              ks
                                            ),
                                            s(
                                              'button',
                                              { class: 'ai-res__btn-danger', onClick: _ => K(a) },
                                              '删除',
                                              8,
                                              ps
                                            )
                                          ],
                                          64
                                        ))
                                      : (o(),
                                        i(
                                          'button',
                                          {
                                            key: 0,
                                            class: 'ai-res__btn-primary',
                                            onClick: _ => A(a.id)
                                          },
                                          ' 配置 ',
                                          8,
                                          ys
                                        ))
                                  ])
                                ])
                              )
                            ),
                            128
                          ))
                        ]))
                      : (o(), i('div', fs, '暂无供应商，无需配置 API Key。'))
                  ]),
                  s('section', bs, [
                    s('div', Cs, [
                      s('h2', As, '模型目录（' + t(n.value.models.length) + '）', 1),
                      s('button', { class: 'ai-res__btn-ghost', onClick: x }, '管理模型')
                    ]),
                    n.value.models.length
                      ? (o(),
                        i('ul', ws, [
                          (o(!0),
                          i(
                            l,
                            null,
                            m(
                              n.value.models,
                              a => (
                                o(),
                                i('li', { key: a.id, class: 'ai-res__model' }, [
                                  s('div', $s, [
                                    s('div', Es, [
                                      f(t(a.displayName) + ' ', 1),
                                      s('span', Ns, t(a.modelName), 1)
                                    ]),
                                    s(
                                      'div',
                                      Ts,
                                      t(a.providerName) +
                                        ' · 上下文 ' +
                                        t(v(a.contextWindow)) +
                                        ' · 输出 ' +
                                        t(v(a.maxOutputTokens)),
                                      1
                                    ),
                                    s('div', Ms, [
                                      (o(!0),
                                      i(
                                        l,
                                        null,
                                        m(
                                          a.capabilities,
                                          _ => (
                                            o(),
                                            i('span', { key: _, class: 'ai-res__tag' }, t(L(_)), 1)
                                          )
                                        ),
                                        128
                                      )),
                                      s(
                                        'span',
                                        Ps,
                                        ' 输入 $' +
                                          t(a.inputPrice) +
                                          '/M · 输出 $' +
                                          t(a.outputPrice) +
                                          '/M ',
                                        1
                                      )
                                    ])
                                  ])
                                ])
                              )
                            ),
                            128
                          ))
                        ]))
                      : (o(), i('div', Is, '模型目录为空，请先通过「发现模型」导入。'))
                  ])
                ],
                64
              ))
            : p('', !0)
        ])
      )
    }
  }),
  Hs = D(xs, [['__scopeId', 'data-v-e6d1f8d2']])
export { Hs as default }
