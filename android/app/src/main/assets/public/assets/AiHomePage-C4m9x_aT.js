const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f || (m.f = ['assets/index-B7ocQHAM.js', 'assets/index-CprlDezj.css'])
) => i.map(i => d[i])
import {
  d as I,
  c as _,
  f as e,
  m as B,
  o as u,
  _ as S,
  b as M,
  u as se,
  q as le,
  v as oe,
  r as k,
  t as g,
  i as x,
  x as ae,
  y as q,
  h as j,
  w as re,
  T as ie,
  F as z,
  z as H,
  A as ue,
  B as Q,
  C as J,
  a as de,
  j as ce,
  n as _e,
  l as V,
  D as pe,
  E as ve
} from './index-B7ocQHAM.js'
import { m as L, u as me } from './model-DfDNvLOK.js'
import { B as fe } from './BottomToolbar-32zLjNyG.js'
import { m as ke, a as R } from './agent-BmSbCKqF.js'
import { u as ge } from './conversation-CQUa4R_f.js'
import './request-eyLhzUlJ.js'
const he = { class: 'segment', role: 'tablist', 'aria-label': '模式切换' },
  be = ['aria-selected'],
  ye = ['aria-selected'],
  Ce = I({
    __name: 'SegmentControl',
    props: { modelValue: {} },
    emits: ['update:modelValue'],
    setup(c, { emit: p }) {
      const r = p
      function v(n) {
        r('update:modelValue', n)
      }
      return (n, i) => (
        u(),
        _('div', he, [
          e(
            'div',
            {
              class: B(['segment__slider', c.modelValue === 'code' ? 'segment__slider--right' : ''])
            },
            null,
            2
          ),
          e(
            'button',
            {
              class: B(['segment__item', c.modelValue === 'work' ? 'segment__item--active' : '']),
              role: 'tab',
              'aria-selected': c.modelValue === 'work',
              'aria-label': '工作模式',
              onClick: i[0] || (i[0] = s => v('work'))
            },
            ' 工作 ',
            10,
            be
          ),
          e(
            'button',
            {
              class: B(['segment__item', c.modelValue === 'code' ? 'segment__item--active' : '']),
              role: 'tab',
              'aria-selected': c.modelValue === 'code',
              'aria-label': '代码模式',
              onClick: i[1] || (i[1] = s => v('code'))
            },
            ' 代码 ',
            10,
            ye
          )
        ])
      )
    }
  }),
  we = S(Ce, [['__scopeId', 'data-v-516875ab']]),
  Te = { class: 'topbar' },
  Me = I({
    __name: 'TopBar',
    props: { currentTab: {} },
    emits: ['update:currentTab'],
    setup(c, { emit: p }) {
      const r = p,
        v = se()
      function n(s) {
        r('update:currentTab', s)
      }
      function i() {
        v.push('/personal-center')
      }
      return (s, t) => (
        u(),
        _('header', Te, [
          e('button', { class: 'topbar__back', 'aria-label': '返回', onClick: i }, [
            ...(t[0] ||
              (t[0] = [
                e(
                  'svg',
                  {
                    width: '18',
                    height: '18',
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': '2.5',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round'
                  },
                  [e('polyline', { points: '15 18 9 12 15 6' })],
                  -1
                )
              ]))
          ]),
          M(we, { 'model-value': c.currentTab, 'onUpdate:modelValue': n }, null, 8, ['model-value'])
        ])
      )
    }
  }),
  $e = S(Me, [['__scopeId', 'data-v-a15068f0']]),
  Ie = { class: 'chat-input' },
  Se = { class: 'chat-input__field' },
  xe = ['disabled'],
  Ae = I({
    __name: 'ChatInput',
    emits: ['send'],
    setup(c, { emit: p }) {
      const r = k(''),
        v = p
      function n() {
        r.value.trim() && (v('send', r.value), (r.value = ''))
      }
      function i(s) {
        s.key === 'Enter' && !s.shiftKey && (s.preventDefault(), n())
      }
      return (s, t) => (
        u(),
        _('div', Ie, [
          e('div', Se, [
            t[2] ||
              (t[2] = e(
                'svg',
                {
                  class: 'chat-input__sparkle',
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
                  e('path', {
                    d: 'M12 3l2.121 6.879L21 12l-6.879 2.121L12 21l-2.121-6.879L3 12l6.879-2.121z'
                  }),
                  e('path', { d: 'M5 5l14 14' })
                ],
                -1
              )),
            le(
              e(
                'textarea',
                {
                  'onUpdate:modelValue': t[0] || (t[0] = l => (r.value = l)),
                  class: 'chat-input__textarea',
                  placeholder: '今天有什么可以帮你的？',
                  rows: '1',
                  onKeydown: i
                },
                null,
                544
              ),
              [[oe, r.value]]
            ),
            e(
              'button',
              {
                class: 'chat-input__send',
                'aria-label': '发送消息',
                disabled: !r.value.trim(),
                onClick: n
              },
              [
                ...(t[1] ||
                  (t[1] = [
                    e(
                      'svg',
                      {
                        width: '18',
                        height: '18',
                        viewBox: '0 0 24 24',
                        fill: 'none',
                        stroke: 'currentColor',
                        'stroke-width': '2.5',
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round'
                      },
                      [
                        e('line', { x1: '22', y1: '2', x2: '11', y2: '13' }),
                        e('polygon', { points: '22 2 15 22 11 13 2 9 22 2' })
                      ],
                      -1
                    )
                  ]))
              ],
              8,
              xe
            )
          ])
        ])
      )
    }
  }),
  Be = S(Ae, [['__scopeId', 'data-v-383b38fb']]),
  Ee = { class: 'model-item__name' },
  Ve = {
    key: 0,
    class: 'model-item__check',
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2.5',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  Pe = I({
    __name: 'ModelItem',
    props: { model: {}, selected: { type: Boolean } },
    emits: ['select'],
    setup(c, { emit: p }) {
      const r = p
      return (v, n) => (
        u(),
        _(
          'button',
          {
            class: B(['model-item', { 'model-item--selected': c.selected }]),
            onClick: n[0] || (n[0] = i => r('select', c.model))
          },
          [
            e('span', Ee, g(c.model.displayName), 1),
            c.selected
              ? (u(),
                _('svg', Ve, [
                  ...(n[1] || (n[1] = [e('polyline', { points: '20 6 9 17 4 12' }, null, -1)]))
                ]))
              : x('', !0)
          ],
          2
        )
      )
    }
  }),
  Re = S(Pe, [['__scopeId', 'data-v-5f9a6d60']]),
  De = {},
  Ne = { class: 'model-empty' }
function je(c, p) {
  return (
    u(),
    _('div', Ne, [
      ...(p[0] || (p[0] = [e('span', { class: 'model-empty__text' }, '当前无可用模型', -1)]))
    ])
  )
}
const Le = S(De, [
    ['render', je],
    ['__scopeId', 'data-v-d4645cb8']
  ]),
  Oe = { class: 'model-dropdown__list' },
  ze = I({
    __name: 'ModelDropdown',
    props: { models: {}, selectedModel: {}, visible: { type: Boolean }, triggerEl: {} },
    emits: ['select', 'close'],
    setup(c, { emit: p }) {
      const r = c,
        v = p,
        n = k(null)
      function i(t) {
        v('select', t)
      }
      function s(t) {
        if (!r.visible) return
        const l = t.target
        ;(n.value && n.value.contains(l)) || (r.triggerEl && r.triggerEl.contains(l)) || v('close')
      }
      return (
        ae(
          () => r.visible,
          async t => {
            t
              ? (await ue(), document.addEventListener('click', s))
              : document.removeEventListener('click', s)
          }
        ),
        q(() => {
          document.removeEventListener('click', s)
        }),
        (t, l) => (
          u(),
          j(
            ie,
            { name: 'dropdown' },
            {
              default: re(() => [
                c.visible
                  ? (u(),
                    _(
                      'div',
                      { key: 0, ref_key: 'panelRef', ref: n, class: 'model-dropdown' },
                      [
                        e('div', Oe, [
                          (u(!0),
                          _(
                            z,
                            null,
                            H(c.models, h => {
                              var T
                              return (
                                u(),
                                j(
                                  Re,
                                  {
                                    key: h.id,
                                    model: h,
                                    selected:
                                      ((T = c.selectedModel) == null ? void 0 : T.id) === h.id,
                                    onSelect: i
                                  },
                                  null,
                                  8,
                                  ['model', 'selected']
                                )
                              )
                            }),
                            128
                          )),
                          c.models.length === 0 ? (u(), j(Le, { key: 0 })) : x('', !0)
                        ])
                      ],
                      512
                    ))
                  : x('', !0)
              ]),
              _: 1
            }
          )
        )
      )
    }
  }),
  He = S(ze, [['__scopeId', 'data-v-dc07318c']]),
  Je = { class: 'model-selector' },
  Ue = ['aria-label'],
  Fe = { class: 'model-selector__label' },
  Ge = I({
    __name: 'ModelSelector',
    props: { provider: {}, label: {} },
    emits: ['open', 'select'],
    setup(c, { expose: p, emit: r }) {
      const v = c,
        n = r,
        i = k([]),
        s = k(null),
        t = k(!1),
        l = k(!1),
        h = k(null),
        T = J(() => (s.value ? s.value.displayName : v.label))
      async function A() {
        if (t.value) {
          t.value = !1
          return
        }
        ;(await m(), (t.value = !0), n('open'))
      }
      async function m() {
        if (!(i.value.length > 0)) {
          l.value = !0
          try {
            let y
            ;(v.provider === 'deepseek'
              ? (y = await L.getDeepSeekModels())
              : v.provider === 'claude'
                ? (y = await L.getClaudeModels())
                : (y = await L.getChatGPTModels()),
              (i.value = y.data || []))
          } catch {
            i.value = []
          } finally {
            l.value = !1
          }
        }
      }
      function b(y) {
        ;((s.value = y), (t.value = !1), n('select', y))
      }
      function C() {
        t.value = !1
      }
      return (
        p({
          close: () => {
            t.value = !1
          }
        }),
        (y, E) => (
          u(),
          _('div', Je, [
            e(
              'button',
              {
                ref_key: 'buttonRef',
                ref: h,
                class: B(['model-selector__btn', { 'model-selector__btn--active': t.value }]),
                'aria-label': 'Select ' + c.label,
                onClick: Q(A, ['stop'])
              },
              [
                e('span', Fe, g(T.value), 1),
                (u(),
                _(
                  'svg',
                  {
                    class: B(['model-selector__arrow', { 'model-selector__arrow--up': t.value }]),
                    width: '12',
                    height: '12',
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': '2.5',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round'
                  },
                  [...(E[0] || (E[0] = [e('polyline', { points: '6 9 12 15 18 9' }, null, -1)]))],
                  2
                ))
              ],
              10,
              Ue
            ),
            M(
              He,
              {
                models: i.value,
                'selected-model': s.value,
                visible: t.value,
                'trigger-el': h.value,
                onSelect: b,
                onClose: C
              },
              null,
              8,
              ['models', 'selected-model', 'visible', 'trigger-el']
            )
          ])
        )
      )
    }
  }),
  O = S(Ge, [['__scopeId', 'data-v-f4681cf3']]),
  Ke = { class: 'action-buttons', role: 'group', 'aria-label': 'AI model selection' },
  qe = I({
    __name: 'ActionButtons',
    emits: ['select'],
    setup(c, { emit: p }) {
      const r = p,
        v = k([])
      function n(s, t) {
        !s || s instanceof Element || (v.value[t] = s)
      }
      function i(s) {
        v.value.forEach((t, l) => {
          l !== s && t && t.close()
        })
      }
      return (s, t) => (
        u(),
        _('div', Ke, [
          M(
            O,
            {
              ref: l => n(l, 0),
              provider: 'deepseek',
              label: 'DeepSeek',
              onOpen: t[0] || (t[0] = l => i(0)),
              onSelect: t[1] || (t[1] = l => r('select', l))
            },
            null,
            512
          ),
          M(
            O,
            {
              ref: l => n(l, 1),
              provider: 'claude',
              label: 'Claude',
              onOpen: t[2] || (t[2] = l => i(1)),
              onSelect: t[3] || (t[3] = l => r('select', l))
            },
            null,
            512
          ),
          M(
            O,
            {
              ref: l => n(l, 2),
              provider: 'chatgpt',
              label: 'ChatGPT',
              onOpen: t[4] || (t[4] = l => i(2)),
              onSelect: t[5] || (t[5] = l => r('select', l))
            },
            null,
            512
          )
        ])
      )
    }
  }),
  Qe = S(qe, [['__scopeId', 'data-v-f9bd0011']]),
  We = { class: 'bottom-card' },
  Xe = { class: 'bottom-card__content' },
  Ye = I({
    __name: 'BottomCard',
    props: { mode: {} },
    emits: ['send', 'selectAction', 'selectTool', 'selectModel'],
    setup(c, { emit: p }) {
      const r = p
      return (v, n) => (
        u(),
        _('footer', We, [
          n[3] || (n[3] = e('div', { class: 'bottom-card__divider' }, null, -1)),
          e('div', Xe, [
            M(Be, { onSend: n[0] || (n[0] = i => r('send', i)) }),
            M(Qe, { onSelect: n[1] || (n[1] = i => r('selectModel', i)) }),
            M(fe, { mode: c.mode, onSelect: n[2] || (n[2] = i => r('selectTool', i)) }, null, 8, [
              'mode'
            ])
          ])
        ])
      )
    }
  }),
  Ze = S(Ye, [['__scopeId', 'data-v-4120d441']]),
  et = { class: 'run-panel' },
  tt = { key: 0, class: 'run-panel__empty' },
  nt = { key: 1, class: 'run-panel__running' },
  st = { class: 'run-panel__running-body' },
  lt = { class: 'run-panel__task' },
  ot = { class: 'run-panel__hint' },
  at = { key: 0, class: 'run-panel__hint--ask' },
  rt = { key: 2, class: 'run-panel__result' },
  it = { class: 'run-panel__result-head' },
  ut = { class: 'run-panel__time' },
  dt = { class: 'run-panel__stats' },
  ct = { class: 'run-panel__stat' },
  _t = { class: 'run-panel__stat-num' },
  pt = { class: 'run-panel__stat' },
  vt = { class: 'run-panel__stat-num' },
  mt = { class: 'run-panel__stat' },
  ft = { class: 'run-panel__stat-num' },
  kt = { key: 0, class: 'run-panel__error' },
  gt = { class: 'run-panel__error-msg' },
  ht = { key: 1, class: 'run-panel__output' },
  bt = { key: 2, class: 'run-panel__tools' },
  yt = { class: 'run-panel__tool-row' },
  Ct = { class: 'run-panel__tool-name' },
  wt = { class: 'run-panel__tool-ms' },
  Tt = { class: 'run-panel__tool-detail' },
  Mt = { key: 3, class: 'run-panel__error' },
  $t = { class: 'run-panel__error-msg' },
  It = { class: 'approval-modal' },
  St = { class: 'approval-modal__list' },
  xt = { class: 'approval-item__head' },
  At = { class: 'approval-item__name' },
  Bt = { class: 'approval-item__args' },
  Et = { class: 'approval-item__actions' },
  Vt = ['disabled', 'onClick'],
  Pt = ['disabled', 'onClick'],
  Rt = I({
    __name: 'AgentRunPanel',
    emits: ['done'],
    setup(c, { expose: p, emit: r }) {
      const v = r,
        n = k('idle'),
        i = k(''),
        s = k(null),
        t = k(''),
        l = k([]),
        h = k(!1),
        T = k(new Set())
      let A = '',
        m = null,
        b = null,
        C = !1
      const y = J(() => l.value.filter(d => d.status === 'pending'))
      function E() {
        ;(b && (clearInterval(b), (b = null)), (C = !1))
      }
      function P() {
        ;(E(), m == null || m.abort(), (h.value = !1))
      }
      async function N(d) {
        if (!C) {
          C = !0
          try {
            const o = await R.pendingApprovals(d)
            o.code === 0 &&
              ((l.value = o.data || []),
              l.value.some($ => $.status === 'pending') && n.value === 'running' && (h.value = !0))
          } catch {
          } finally {
            C = !1
          }
        }
      }
      async function U(d, o) {
        var $
        if (!o) {
          V('请先在设置中选择模型')
          return
        }
        ;(P(),
          (A = o),
          (i.value = d),
          (n.value = 'running'),
          (s.value = null),
          (t.value = ''),
          (l.value = []),
          (h.value = !1))
        const a = ke()
        ;((m = new AbortController()), N(a), (b = setInterval(() => N(a), 1500)))
        try {
          const w = await R.run(
            {
              modelId: o,
              task: d,
              clientRunId: a,
              permission: {
                default: 'allow',
                tools: { write_file: 'ask', edit_file: 'ask', run_command: 'ask' }
              }
            },
            m.signal
          )
          if ((E(), (h.value = !1), w.code === 0)) {
            const { runId: f, ...D } = w.data
            ;((s.value = D),
              (n.value = 'done'),
              (t.value = (($ = D.state) == null ? void 0 : $.error) || D.error || ''),
              v('done', { runId: f, task: d, modelId: o, status: D.status }))
          }
        } catch (w) {
          if (
            (E(),
            (h.value = !1),
            (w == null ? void 0 : w.name) === 'CanceledError' ||
              (w == null ? void 0 : w.code) === 'ERR_CANCELED')
          ) {
            ;((n.value = 'done'),
              (s.value = {
                status: 'cancelled',
                result: '已取消',
                error: null,
                iterations: 0,
                toolCalls: 0,
                tokens: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
                usageByIteration: [],
                state: { status: 'cancelled', messages: [], toolHistory: [] }
              }),
              v('done', { runId: a, task: d, modelId: o, status: 'cancelled' }))
            return
          }
          ;((n.value = 'error'), (t.value = (w == null ? void 0 : w.message) || '任务执行失败'))
        }
      }
      function F(d) {
        if (!d) return {}
        try {
          return JSON.parse(d)
        } catch {
          return {}
        }
      }
      async function W(d) {
        P()
        try {
          const o = await R.detail(d)
          if (o.code !== 0) return (V('恢复会话失败'), !1)
          const a = o.data,
            $ = (a.toolCalls || []).map(f => ({
              id: f.toolCallId || f.id,
              name: f.name,
              arguments: F(f.argumentsJson),
              ok: f.ok,
              output: f.output ?? '',
              durationMs: f.durationMs
            })),
            w = (a.messages || []).map(f => ({
              role: f.role,
              content: f.content,
              toolCallId: f.toolCallId,
              toolCalls: f.toolCallsJson ? F(f.toolCallsJson) : void 0
            }))
          return (
            (A = a.modelId),
            (i.value = a.task),
            (s.value = {
              status: a.status,
              result: a.result,
              error: a.error,
              iterations: a.iterations,
              toolCalls: a.toolCallCount,
              tokens: {
                inputTokens: a.tokenInput,
                outputTokens: a.tokenOutput,
                totalTokens: a.tokenTotal
              },
              usageByIteration: (a.tokenEvents || []).map(f => ({
                inputTokens: f.inputTokens,
                outputTokens: f.outputTokens,
                cachedTokens: f.cachedTokens,
                totalTokens: f.totalTokens
              })),
              state: { status: a.status, error: a.error, messages: w, toolHistory: $ }
            }),
            (n.value = 'done'),
            (t.value = a.error || ''),
            !0
          )
        } catch {
          return (V('恢复会话失败'), !1)
        }
      }
      function X() {
        ;(P(), (n.value = 'idle'), (i.value = ''), (s.value = null), (t.value = ''), (l.value = []))
      }
      async function G(d, o) {
        if (!T.value.has(d.id)) {
          T.value.add(d.id)
          try {
            if (
              (o === 'approve' ? await R.approve(d.id) : await R.reject(d.id)).code === 0 &&
              ((d.status = o === 'approve' ? 'approved' : 'rejected'),
              V(o === 'approve' ? '已批准' : '已拒绝'),
              m && n.value === 'running')
            ) {
              const $ = d.runId
              N($)
            }
          } catch {
            V('操作失败')
          } finally {
            T.value.delete(d.id)
          }
        }
      }
      function Y() {
        y.value.length === 0 && (h.value = !1)
      }
      function K(d) {
        try {
          return JSON.stringify(d, null, 2)
        } catch {
          return String(d)
        }
      }
      function Z() {
        if (!A) {
          V('请先在设置中选择模型')
          return
        }
        U(i.value, A)
      }
      function ee(d) {
        switch (d) {
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
      function te(d) {
        switch (d) {
          case 'completed':
            return '已完成'
          case 'failed':
            return '失败'
          case 'budget_exceeded':
            return '超出预算'
          case 'cancelled':
            return '已取消'
          default:
            return '运行中'
        }
      }
      function ne() {
        return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
      return (
        q(P),
        p({ start: U, loadRun: W, clear: X }),
        (d, o) => (
          u(),
          _('div', et, [
            n.value === 'idle'
              ? (u(),
                _('div', tt, [
                  ...(o[0] ||
                    (o[0] = [
                      de(
                        '<div class="run-panel__empty-icon" data-v-5e55423c><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" data-v-5e55423c><path d="M12 2a10 10 0 109.95 9h-2.02a8 8 0 11-7.93-7V2z" data-v-5e55423c></path><path d="M12 2v8l5 3" data-v-5e55423c></path></svg></div><p class="run-panel__empty-title" data-v-5e55423c>Agent 待命</p><p class="run-panel__empty-sub" data-v-5e55423c>输入任务让 Agent 在沙盒中自动执行，涉及敏感操作时需你的批准</p>',
                        3
                      )
                    ]))
                ]))
              : n.value === 'running'
                ? (u(),
                  _('div', nt, [
                    o[2] || (o[2] = e('div', { class: 'run-panel__spinner' }, null, -1)),
                    e('div', st, [
                      e('p', lt, g(i.value), 1),
                      e('p', ot, [
                        o[1] || (o[1] = ce(' 运行中，等待模型响应 ', -1)),
                        y.value.length
                          ? (u(), _('span', at, '（' + g(y.value.length) + ' 个操作待批准）', 1))
                          : x('', !0)
                      ])
                    ]),
                    e('button', { class: 'run-panel__stop', onClick: P }, '停止')
                  ]))
                : n.value === 'done' && s.value
                  ? (u(),
                    _('div', rt, [
                      e('div', it, [
                        e(
                          'span',
                          {
                            class: 'run-panel__badge',
                            style: _e({ background: ee(s.value.status) })
                          },
                          g(te(s.value.status)),
                          5
                        ),
                        e('span', ut, g(ne()), 1)
                      ]),
                      e('div', dt, [
                        e('div', ct, [
                          e('span', _t, g(s.value.iterations), 1),
                          o[3] || (o[3] = e('span', { class: 'run-panel__stat-label' }, '轮次', -1))
                        ]),
                        e('div', pt, [
                          e('span', vt, g(s.value.toolCalls), 1),
                          o[4] ||
                            (o[4] = e('span', { class: 'run-panel__stat-label' }, '工具调用', -1))
                        ]),
                        e('div', mt, [
                          e('span', ft, g(s.value.tokens.totalTokens), 1),
                          o[5] ||
                            (o[5] = e('span', { class: 'run-panel__stat-label' }, 'Tokens', -1))
                        ])
                      ]),
                      t.value
                        ? (u(),
                          _('div', kt, [
                            o[6] ||
                              (o[6] = e('p', { class: 'run-panel__error-title' }, '执行出错', -1)),
                            e('p', gt, g(t.value), 1)
                          ]))
                        : x('', !0),
                      s.value.result ? (u(), _('div', ht, g(s.value.result), 1)) : x('', !0),
                      s.value.state.toolHistory.length
                        ? (u(),
                          _('div', bt, [
                            o[7] ||
                              (o[7] = e(
                                'p',
                                { class: 'run-panel__tools-title' },
                                '工具执行记录',
                                -1
                              )),
                            (u(!0),
                            _(
                              z,
                              null,
                              H(
                                s.value.state.toolHistory,
                                a => (
                                  u(),
                                  _('div', { key: a.id, class: 'run-panel__tool' }, [
                                    e('div', yt, [
                                      e('code', Ct, g(a.name), 1),
                                      e(
                                        'span',
                                        {
                                          class: B([
                                            'run-panel__tool-ok',
                                            a.ok
                                              ? 'run-panel__tool-ok--pass'
                                              : 'run-panel__tool-ok--fail'
                                          ])
                                        },
                                        g(a.ok ? '成功' : '失败'),
                                        3
                                      ),
                                      e('span', wt, g(a.durationMs) + 'ms', 1)
                                    ]),
                                    e('div', Tt, [e('code', null, g(K(a.arguments)), 1)])
                                  ])
                                )
                              ),
                              128
                            ))
                          ]))
                        : x('', !0),
                      e('button', { class: 'run-panel__again', onClick: Z }, '再次运行')
                    ]))
                  : n.value === 'error'
                    ? (u(),
                      _('div', Mt, [
                        o[8] ||
                          (o[8] = e('p', { class: 'run-panel__error-title' }, '任务失败', -1)),
                        e('p', $t, g(t.value), 1)
                      ]))
                    : x('', !0),
            h.value
              ? (u(),
                _('div', { key: 4, class: 'approval-overlay', onClick: Q(Y, ['self']) }, [
                  e('div', It, [
                    o[10] ||
                      (o[10] = e(
                        'div',
                        { class: 'approval-modal__head' },
                        [
                          e('p', { class: 'approval-modal__title' }, '操作需要批准'),
                          e('p', { class: 'approval-modal__sub' }, 'Agent 请求执行以下操作')
                        ],
                        -1
                      )),
                    e('div', St, [
                      (u(!0),
                      _(
                        z,
                        null,
                        H(
                          y.value,
                          a => (
                            u(),
                            _('div', { key: a.id, class: 'approval-item' }, [
                              e('div', xt, [
                                e('code', At, g(a.toolName), 1),
                                o[9] ||
                                  (o[9] = e(
                                    'span',
                                    { class: 'approval-item__badge' },
                                    '待批准',
                                    -1
                                  ))
                              ]),
                              e('pre', Bt, g(K(a.arguments)), 1),
                              e('div', Et, [
                                e(
                                  'button',
                                  {
                                    class: 'approval-item__btn approval-item__btn--reject',
                                    disabled: T.value.has(a.id),
                                    onClick: $ => G(a, 'reject')
                                  },
                                  '拒绝',
                                  8,
                                  Vt
                                ),
                                e(
                                  'button',
                                  {
                                    class: 'approval-item__btn approval-item__btn--approve',
                                    disabled: T.value.has(a.id),
                                    onClick: $ => G(a, 'approve')
                                  },
                                  '批准',
                                  8,
                                  Pt
                                )
                              ])
                            ])
                          )
                        ),
                        128
                      ))
                    ])
                  ])
                ]))
              : x('', !0)
          ])
        )
      )
    }
  }),
  Dt = S(Rt, [['__scopeId', 'data-v-5e55423c']]),
  Nt = { class: 'page' },
  jt = { class: 'content' },
  Ft = I({
    __name: 'AiHomePage',
    setup(c) {
      const p = k('work'),
        r = me(),
        v = ge(),
        n = k(null),
        i = k(null),
        s = k(!1),
        t = J(() => r.models),
        l = k(r.defaultModel)
      pe(async () => {
        ;(r.models.length === 0 && (await r.fetchModels({ page: 1, pageSize: 50 })),
          l.value || (l.value = r.defaultModel))
        const m = v.currentConversation
        if (m && n.value) {
          await n.value.loadRun(m.id)
          const b = t.value.find(C => String(C.id) === m.modelId)
          b && (l.value = b)
        }
      })
      function h(m) {
        l.value = m
      }
      function T(m) {
        if (!l.value) {
          ve(
            async () => {
              const { showToast: C } = await import('./index-B7ocQHAM.js').then(y => y.N)
              return { showToast: C }
            },
            __vite__mapDeps([0, 1])
          ).then(({ showToast: C }) => C('请先在设置中配置并选择模型'))
          return
        }
        const b = s.value ? i.value : n.value
        b == null || b.start(m, String(l.value.id))
      }
      function A(m) {
        v.createConversation(m.runId, m.task, m.modelId)
      }
      return (m, b) => (
        u(),
        _('div', Nt, [
          M(
            $e,
            { 'current-tab': p.value, 'onUpdate:currentTab': b[0] || (b[0] = C => (p.value = C)) },
            null,
            8,
            ['current-tab']
          ),
          e('main', jt, [M(Dt, { ref_key: 'runPanel', ref: n, onDone: A }, null, 512)]),
          M(Ze, { mode: p.value, onSend: T, onSelectModel: h }, null, 8, ['mode'])
        ])
      )
    }
  })
export { Ft as default }
