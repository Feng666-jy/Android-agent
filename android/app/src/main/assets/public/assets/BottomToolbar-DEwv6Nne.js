import {
  d as v,
  c as l,
  F as _,
  x as g,
  A as y,
  o as n,
  u as f,
  e,
  a as r,
  l as x,
  t as B,
  _ as C
} from './index-DTPmbI92.js'
const M = ['aria-label'],
  m = ['aria-label', 'onClick'],
  j = {
    key: 0,
    class: 'toolbar__icon',
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.8',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  A = {
    key: 1,
    class: 'toolbar__icon',
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.8',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  V = {
    key: 2,
    class: 'toolbar__icon',
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.8',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  z = {
    key: 3,
    class: 'toolbar__icon',
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.8',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  H = {
    key: 4,
    class: 'toolbar__icon',
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.8',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  S = {
    key: 5,
    class: 'toolbar__icon',
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.8',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  I = {
    key: 6,
    class: 'toolbar__icon',
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.8',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  N = {
    key: 7,
    class: 'toolbar__icon',
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.8',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  F = {
    key: 8,
    class: 'toolbar__icon',
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.8',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  L = {
    key: 9,
    class: 'toolbar__icon',
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.8',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  T = {
    key: 10,
    class: 'toolbar__icon',
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.8',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  D = {
    key: 11,
    class: 'toolbar__icon',
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.8',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  E = { class: 'toolbar__label' },
  G = v({
    __name: 'BottomToolbar',
    props: { mode: {} },
    emits: ['select'],
    setup(s, { emit: a }) {
      const d = s,
        c = a,
        h = f(),
        u = {
          'web-search': '/workspace/search',
          'image-gen': '/workspace/image',
          files: '/workspace/files',
          code: '/workspace/code',
          history: '/workspace/history',
          settings: '/workspace/settings'
        },
        k = [
          { id: 'web-search', label: '搜索' },
          { id: 'image-gen', label: '绘图' },
          { id: 'files', label: '文件' },
          { id: 'code', label: '代码' },
          { id: 'history', label: '历史' },
          { id: 'settings', label: '设置' }
        ],
        p = [
          { id: 'github', label: 'GitHub' },
          { id: 'debug', label: '调试' },
          { id: 'terminal', label: '终端' },
          { id: 'review', label: '审查' },
          { id: 'deploy', label: '部署' },
          { id: 'docs', label: '文档' }
        ],
        b = y(() => (d.mode === 'work' ? k : p))
      function w(i) {
        c('select', i)
        const o = u[i]
        o && h.push(o)
      }
      return (i, o) => (
        n(),
        l(
          'div',
          {
            class: 'toolbar',
            role: 'toolbar',
            'aria-label': s.mode === 'work' ? '工作模式工具栏' : '代码模式工具栏'
          },
          [
            (n(!0),
            l(
              _,
              null,
              g(
                b.value,
                t => (
                  n(),
                  l(
                    'button',
                    {
                      key: t.id,
                      class: 'toolbar__item',
                      'aria-label': t.label,
                      onClick: R => w(t.id)
                    },
                    [
                      t.id === 'web-search'
                        ? (n(),
                          l('svg', j, [
                            ...(o[0] ||
                              (o[0] = [
                                e('circle', { cx: '11', cy: '11', r: '8' }, null, -1),
                                e('path', { d: 'M21 21l-4.35-4.35' }, null, -1)
                              ]))
                          ]))
                        : t.id === 'image-gen'
                          ? (n(),
                            l('svg', A, [
                              ...(o[1] ||
                                (o[1] = [
                                  e(
                                    'rect',
                                    { x: '3', y: '3', width: '18', height: '18', rx: '2', ry: '2' },
                                    null,
                                    -1
                                  ),
                                  e('circle', { cx: '8.5', cy: '8.5', r: '1.5' }, null, -1),
                                  e('polyline', { points: '21 15 16 10 5 21' }, null, -1)
                                ]))
                            ]))
                          : t.id === 'files'
                            ? (n(),
                              l('svg', V, [
                                ...(o[2] ||
                                  (o[2] = [
                                    e(
                                      'path',
                                      {
                                        d: 'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z'
                                      },
                                      null,
                                      -1
                                    )
                                  ]))
                              ]))
                            : t.id === 'code'
                              ? (n(),
                                l('svg', z, [
                                  ...(o[3] ||
                                    (o[3] = [
                                      e('polyline', { points: '16 18 22 12 16 6' }, null, -1),
                                      e('polyline', { points: '8 6 2 12 8 18' }, null, -1)
                                    ]))
                                ]))
                              : t.id === 'history'
                                ? (n(),
                                  l('svg', H, [
                                    ...(o[4] ||
                                      (o[4] = [
                                        e('circle', { cx: '12', cy: '12', r: '10' }, null, -1),
                                        e('polyline', { points: '12 6 12 12 16 14' }, null, -1)
                                      ]))
                                  ]))
                                : t.id === 'settings'
                                  ? (n(),
                                    l('svg', S, [
                                      ...(o[5] ||
                                        (o[5] = [
                                          e('circle', { cx: '12', cy: '12', r: '3' }, null, -1),
                                          e(
                                            'path',
                                            {
                                              d: 'M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z'
                                            },
                                            null,
                                            -1
                                          )
                                        ]))
                                    ]))
                                  : t.id === 'github'
                                    ? (n(),
                                      l('svg', I, [
                                        ...(o[6] ||
                                          (o[6] = [
                                            e(
                                              'path',
                                              {
                                                d: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22'
                                              },
                                              null,
                                              -1
                                            )
                                          ]))
                                      ]))
                                    : t.id === 'debug'
                                      ? (n(),
                                        l('svg', N, [
                                          ...(o[7] ||
                                            (o[7] = [
                                              r(
                                                '<path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2.5-2.5-2.5A2.5 2.5 0 006 12c0 1 .5 2.5 2.5 2.5z" data-v-fa783b2c></path><path d="M15.5 14.5A2.5 2.5 0 0018 12c0-1.38-.5-2.5-2.5-2.5A2.5 2.5 0 0013 12c0 1 .5 2.5 2.5 2.5z" data-v-fa783b2c></path><path d="M12 22c-5.52 0-10-4.48-10-10S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" data-v-fa783b2c></path><path d="M8.5 14.5c0 1 .5 2.5 2.5 2.5s2.5-1.5 2.5-2.5" data-v-fa783b2c></path><path d="M13 14.5c0 1 .5 2.5 2.5 2.5s2.5-1.5 2.5-2.5" data-v-fa783b2c></path><path d="M9 17c.5.5 1.5 1 3 1s2.5-.5 3-1" data-v-fa783b2c></path>',
                                                6
                                              )
                                            ]))
                                        ]))
                                      : t.id === 'terminal'
                                        ? (n(),
                                          l('svg', F, [
                                            ...(o[8] ||
                                              (o[8] = [
                                                e(
                                                  'polyline',
                                                  { points: '4 17 10 11 4 5' },
                                                  null,
                                                  -1
                                                ),
                                                e(
                                                  'line',
                                                  { x1: '12', y1: '19', x2: '20', y2: '19' },
                                                  null,
                                                  -1
                                                )
                                              ]))
                                          ]))
                                        : t.id === 'review'
                                          ? (n(),
                                            l('svg', L, [
                                              ...(o[9] ||
                                                (o[9] = [
                                                  e(
                                                    'path',
                                                    {
                                                      d: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'
                                                    },
                                                    null,
                                                    -1
                                                  ),
                                                  e(
                                                    'circle',
                                                    { cx: '12', cy: '12', r: '3' },
                                                    null,
                                                    -1
                                                  )
                                                ]))
                                            ]))
                                          : t.id === 'deploy'
                                            ? (n(),
                                              l('svg', T, [
                                                ...(o[10] ||
                                                  (o[10] = [
                                                    e(
                                                      'path',
                                                      { d: 'M12 2L2 7l10 5 10-5-10-5z' },
                                                      null,
                                                      -1
                                                    ),
                                                    e('path', { d: 'M2 17l10 5 10-5' }, null, -1),
                                                    e('path', { d: 'M2 12l10 5 10-5' }, null, -1)
                                                  ]))
                                              ]))
                                            : t.id === 'docs'
                                              ? (n(),
                                                l('svg', D, [
                                                  ...(o[11] ||
                                                    (o[11] = [
                                                      r(
                                                        '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" data-v-fa783b2c></path><polyline points="14 2 14 8 20 8" data-v-fa783b2c></polyline><line x1="16" y1="13" x2="8" y2="13" data-v-fa783b2c></line><line x1="16" y1="17" x2="8" y2="17" data-v-fa783b2c></line><polyline points="10 9 9 9 8 9" data-v-fa783b2c></polyline>',
                                                        5
                                                      )
                                                    ]))
                                                ]))
                                              : x('', !0),
                      e('span', E, B(t.label), 1)
                    ],
                    8,
                    m
                  )
                )
              ),
              128
            ))
          ],
          8,
          M
        )
      )
    }
  }),
  q = C(G, [['__scopeId', 'data-v-fa783b2c']])
export { q as B }
