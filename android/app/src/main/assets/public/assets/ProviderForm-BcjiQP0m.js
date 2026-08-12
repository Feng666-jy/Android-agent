import {
  d as S,
  B as q,
  c as E,
  e as s,
  t as w,
  F as G,
  x as F,
  q as H,
  w as _,
  b as l,
  A as I,
  h as $,
  g as u,
  s as y,
  r as d,
  u as Y,
  o as b,
  H as j,
  _ as D
} from './index-CRvy0G29.js'
import { u as z } from './provider-HAXSra3I.js'
import './provider-r4aRWO2Y.js'
import './request-CrdghNby.js'
const J = { class: 'provider-form' },
  Q = { class: 'provider-form__header' },
  W = { class: 'provider-form__title' },
  X = ['disabled'],
  Z = { class: 'provider-form__content' },
  ee = { key: 0, class: 'provider-form__loading' },
  oe = { class: 'provider-form__footer' },
  ae = ['disabled'],
  te = S({
    __name: 'ProviderForm',
    setup(le) {
      const U = [
          { text: 'OpenAI 兼容', value: 'OPENAI_COMPATIBLE' },
          { text: 'Anthropic', value: 'ANTHROPIC' },
          { text: 'Google Gemini', value: 'GOOGLE_GEMINI' },
          { text: 'Ollama', value: 'OLLAMA' }
        ],
        P = [
          { text: 'API Key', value: 'API_KEY' },
          { text: 'Bearer Token', value: 'BEARER_TOKEN' },
          { text: 'OAuth', value: 'OAUTH' },
          { text: '无', value: 'NONE' }
        ],
        A = j(),
        p = Y(),
        h = z(),
        v = I(() => A.params.id || ''),
        m = I(() => !!v.value && A.path.includes('/edit')),
        e = $({
          name: '',
          baseUrl: '',
          protocol: 'OPENAI_COMPATIBLE',
          authType: 'API_KEY',
          apiKeyEncrypted: '',
          isEnabled: !0
        }),
        T = u(!1),
        n = u(!1),
        k = u(!1),
        K = u(null),
        c = u(!1),
        f = u(!1)
      q(async () => {
        if (m.value) {
          k.value = !0
          const a = await h.fetchProvider(v.value)
          ;(a &&
            ((e.name = a.name),
            (e.baseUrl = a.baseUrl),
            (e.protocol = a.protocol),
            (e.authType = a.authType),
            (e.isEnabled = a.isEnabled),
            (T.value = !!a.hasApiKey)),
            (k.value = !1))
        }
      })
      function B() {
        m.value
          ? p.push('/workspace/settings/providers/' + v.value)
          : p.push('/workspace/settings/providers')
      }
      async function O() {
        if (!e.name.trim()) {
          y('请输入供应商名称')
          return
        }
        if (!e.baseUrl.trim()) {
          y('请输入 Base URL')
          return
        }
        try {
          new URL(e.baseUrl.trim())
        } catch {
          y('Base URL 格式无效')
          return
        }
        n.value = !0
        try {
          if (m.value)
            (await h.updateProvider(v.value, {
              name: e.name.trim(),
              baseUrl: e.baseUrl.trim(),
              protocol: e.protocol,
              authType: e.authType,
              isEnabled: e.isEnabled,
              apiKeyEncrypted: e.apiKeyEncrypted || void 0
            }),
              y('供应商更新成功'),
              p.replace('/workspace/settings/providers/' + v.value))
          else {
            const a = await h.createProvider({
              name: e.name.trim(),
              baseUrl: e.baseUrl.trim(),
              protocol: e.protocol,
              authType: e.authType,
              apiKeyEncrypted: e.apiKeyEncrypted || void 0
            })
            ;(y('供应商创建成功'),
              a && a.id
                ? p.replace('/workspace/settings/providers/' + a.id)
                : p.replace('/workspace/settings/providers'))
          }
        } finally {
          n.value = !1
        }
      }
      function V({ selectedValues: a }) {
        ;((e.protocol = a[0]), (c.value = !1))
      }
      function R({ selectedValues: a }) {
        ;((e.authType = a[0]), (f.value = !1))
      }
      return (a, o) => {
        const i = d('van-field'),
          L = d('van-switch'),
          N = d('van-cell-group'),
          M = d('van-form'),
          g = d('van-picker'),
          C = d('van-popup')
        return (
          b(),
          E('div', J, [
            s('header', Q, [
              s('button', { class: 'provider-form__back', 'aria-label': '返回', onClick: B }, [
                ...(o[10] ||
                  (o[10] = [
                    s(
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
                      [s('polyline', { points: '15 18 9 12 15 6' })],
                      -1
                    )
                  ]))
              ]),
              s('h1', W, w(m.value ? '编辑供应商' : '添加供应商'), 1),
              s(
                'button',
                { class: 'provider-form__save', disabled: n.value, onClick: O },
                w(n.value ? '保存中...' : '保存'),
                9,
                X
              )
            ]),
            s('main', Z, [
              k.value
                ? (b(),
                  E('div', ee, [
                    (b(),
                    E(
                      G,
                      null,
                      F(5, r => s('div', { class: 'provider-form__skeleton', key: r })),
                      64
                    ))
                  ]))
                : (b(),
                  H(
                    M,
                    { key: 1, ref_key: 'formRef', ref: K, class: 'provider-form__form' },
                    {
                      default: _(() => [
                        l(
                          N,
                          { inset: '' },
                          {
                            default: _(() => {
                              var r, x
                              return [
                                l(
                                  i,
                                  {
                                    modelValue: e.name,
                                    'onUpdate:modelValue': o[0] || (o[0] = t => (e.name = t)),
                                    name: 'name',
                                    label: '名称',
                                    placeholder: '输入供应商名称',
                                    required: '',
                                    rules: [{ required: !0, message: '请输入名称' }]
                                  },
                                  null,
                                  8,
                                  ['modelValue']
                                ),
                                l(
                                  i,
                                  {
                                    modelValue: e.baseUrl,
                                    'onUpdate:modelValue': o[1] || (o[1] = t => (e.baseUrl = t)),
                                    name: 'baseUrl',
                                    label: 'Base URL',
                                    placeholder: 'https://api.example.com/v1',
                                    required: '',
                                    rules: [{ required: !0, message: '请输入 Base URL' }]
                                  },
                                  null,
                                  8,
                                  ['modelValue']
                                ),
                                l(
                                  i,
                                  {
                                    'model-value':
                                      ((r = U.find(t => t.value === e.protocol)) == null
                                        ? void 0
                                        : r.text) || e.protocol,
                                    'is-link': '',
                                    readonly: '',
                                    name: 'protocol',
                                    label: '协议类型',
                                    placeholder: '选择协议',
                                    onClick: o[2] || (o[2] = t => (c.value = !0))
                                  },
                                  null,
                                  8,
                                  ['model-value']
                                ),
                                l(
                                  i,
                                  {
                                    'model-value':
                                      ((x = P.find(t => t.value === e.authType)) == null
                                        ? void 0
                                        : x.text) || e.authType,
                                    'is-link': '',
                                    readonly: '',
                                    name: 'authType',
                                    label: '认证方式',
                                    placeholder: '选择认证方式',
                                    onClick: o[3] || (o[3] = t => (f.value = !0))
                                  },
                                  null,
                                  8,
                                  ['model-value']
                                ),
                                l(
                                  i,
                                  {
                                    modelValue: e.apiKeyEncrypted,
                                    'onUpdate:modelValue':
                                      o[4] || (o[4] = t => (e.apiKeyEncrypted = t)),
                                    name: 'apiKey',
                                    label: 'API Key',
                                    placeholder: T.value
                                      ? '已保存，留空表示不修改'
                                      : '输入 API Key',
                                    type: 'password',
                                    autocomplete: 'off'
                                  },
                                  null,
                                  8,
                                  ['modelValue', 'placeholder']
                                ),
                                l(
                                  i,
                                  { name: 'isEnabled', label: '启用' },
                                  {
                                    input: _(() => [
                                      l(
                                        L,
                                        {
                                          modelValue: e.isEnabled,
                                          'onUpdate:modelValue':
                                            o[5] || (o[5] = t => (e.isEnabled = t))
                                        },
                                        null,
                                        8,
                                        ['modelValue']
                                      )
                                    ]),
                                    _: 1
                                  }
                                )
                              ]
                            }),
                            _: 1
                          }
                        )
                      ]),
                      _: 1
                    },
                    512
                  )),
              s('div', oe, [
                s(
                  'button',
                  { class: 'provider-form__submit', disabled: n.value, onClick: O },
                  w(n.value ? '保存中...' : m.value ? '保存修改' : '创建供应商'),
                  9,
                  ae
                )
              ])
            ]),
            l(
              C,
              {
                show: c.value,
                'onUpdate:show': o[7] || (o[7] = r => (c.value = r)),
                position: 'bottom',
                round: ''
              },
              {
                default: _(() => [
                  l(g, { columns: U, onConfirm: V, onCancel: o[6] || (o[6] = r => (c.value = !1)) })
                ]),
                _: 1
              },
              8,
              ['show']
            ),
            l(
              C,
              {
                show: f.value,
                'onUpdate:show': o[9] || (o[9] = r => (f.value = r)),
                position: 'bottom',
                round: ''
              },
              {
                default: _(() => [
                  l(g, { columns: P, onConfirm: R, onCancel: o[8] || (o[8] = r => (f.value = !1)) })
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
  ue = D(te, [['__scopeId', 'data-v-ce5a9b4c']])
export { ue as default }
