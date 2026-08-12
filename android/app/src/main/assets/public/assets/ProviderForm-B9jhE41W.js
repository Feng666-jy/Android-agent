import {
  d as S,
  D as G,
  c as E,
  f as s,
  t as w,
  F as q,
  z as F,
  h as $,
  w as _,
  b as l,
  C as x,
  k as H,
  r as u,
  l as y,
  e as d,
  u as D,
  o as b,
  J as Y,
  _ as j
} from './index-B7ocQHAM.js'
import { u as z } from './provider-B6_1_C4o.js'
import './provider-DkfW0_eM.js'
import './request-eyLhzUlJ.js'
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
        T = Y(),
        p = D(),
        h = z(),
        v = x(() => T.params.id || ''),
        m = x(() => !!v.value && T.path.includes('/edit')),
        e = H({
          name: '',
          baseUrl: '',
          protocol: 'OPENAI_COMPATIBLE',
          authType: 'API_KEY',
          apiKeyEncrypted: '',
          isEnabled: !0
        }),
        A = u(!1),
        n = u(!1),
        k = u(!1),
        K = u(null),
        c = u(!1),
        f = u(!1)
      G(async () => {
        if (m.value) {
          k.value = !0
          const a = await h.fetchProvider(v.value)
          ;(a &&
            ((e.name = a.name),
            (e.baseUrl = a.baseUrl),
            (e.protocol = a.protocol),
            (e.authType = a.authType),
            (e.isEnabled = a.isEnabled),
            (A.value = !!a.hasApiKey)),
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
          C = d('van-picker'),
          g = d('van-popup')
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
                      q,
                      null,
                      F(5, r => s('div', { class: 'provider-form__skeleton', key: r })),
                      64
                    ))
                  ]))
                : (b(),
                  $(
                    M,
                    { key: 1, ref_key: 'formRef', ref: K, class: 'provider-form__form' },
                    {
                      default: _(() => [
                        l(
                          N,
                          { inset: '' },
                          {
                            default: _(() => {
                              var r, I
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
                                      ((I = P.find(t => t.value === e.authType)) == null
                                        ? void 0
                                        : I.text) || e.authType,
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
                                    placeholder: A.value
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
              g,
              {
                show: c.value,
                'onUpdate:show': o[7] || (o[7] = r => (c.value = r)),
                position: 'bottom',
                round: ''
              },
              {
                default: _(() => [
                  l(C, { columns: U, onConfirm: V, onCancel: o[6] || (o[6] = r => (c.value = !1)) })
                ]),
                _: 1
              },
              8,
              ['show']
            ),
            l(
              g,
              {
                show: f.value,
                'onUpdate:show': o[9] || (o[9] = r => (f.value = r)),
                position: 'bottom',
                round: ''
              },
              {
                default: _(() => [
                  l(C, { columns: P, onConfirm: R, onCancel: o[8] || (o[8] = r => (f.value = !1)) })
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
  ue = j(te, [['__scopeId', 'data-v-ce5a9b4c']])
export { ue as default }
