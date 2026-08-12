import { d as g, c, e as s, b as u, u as k, o as _, r as v, _ as w } from './index-CRvy0G29.js'
const h = { class: 'settings' },
  m = { class: 'settings__content' },
  f = g({
    __name: 'SettingsView',
    setup(C) {
      const t = k()
      function o() {
        t.push('/workspace/settings/providers')
      }
      function i() {
        t.push('/workspace/settings/models')
      }
      function n() {
        t.push('/workspace/settings/tools')
      }
      function r() {
        t.push('/workspace/settings/ai-resources')
      }
      function l() {
        t.push('/workspace/settings/orgs')
      }
      function p() {
        t.push('/workspace/settings/api-keys')
      }
      function a() {
        t.push('/workspace/settings/devices')
      }
      return (x, e) => {
        const d = v('router-view')
        return (
          _(),
          c('section', h, [
            e[7] ||
              (e[7] = s(
                'div',
                { class: 'settings__header' },
                [s('h1', { class: 'settings__title' }, '设置')],
                -1
              )),
            s('div', m, [
              s('div', { class: 'settings__group' }, [
                s('div', { class: 'settings__item', onClick: o }, [
                  ...(e[0] ||
                    (e[0] = [
                      s('span', { class: 'settings__item-label' }, '供应商管理', -1),
                      s(
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
                        [s('polyline', { points: '9 18 15 12 9 6' })],
                        -1
                      )
                    ]))
                ]),
                s('div', { class: 'settings__item', onClick: i }, [
                  ...(e[1] ||
                    (e[1] = [
                      s('span', { class: 'settings__item-label' }, '模型管理', -1),
                      s(
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
                        [s('polyline', { points: '9 18 15 12 9 6' })],
                        -1
                      )
                    ]))
                ]),
                s('div', { class: 'settings__item', onClick: n }, [
                  ...(e[2] ||
                    (e[2] = [
                      s('span', { class: 'settings__item-label' }, '工具管理', -1),
                      s(
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
                        [s('polyline', { points: '9 18 15 12 9 6' })],
                        -1
                      )
                    ]))
                ]),
                s('div', { class: 'settings__item', onClick: r }, [
                  ...(e[3] ||
                    (e[3] = [
                      s('span', { class: 'settings__item-label' }, 'AI 资源', -1),
                      s(
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
                        [s('polyline', { points: '9 18 15 12 9 6' })],
                        -1
                      )
                    ]))
                ]),
                s('div', { class: 'settings__item', onClick: l }, [
                  ...(e[4] ||
                    (e[4] = [
                      s('span', { class: 'settings__item-label' }, '组织管理', -1),
                      s(
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
                        [s('polyline', { points: '9 18 15 12 9 6' })],
                        -1
                      )
                    ]))
                ]),
                s('div', { class: 'settings__item', onClick: p }, [
                  ...(e[5] ||
                    (e[5] = [
                      s('span', { class: 'settings__item-label' }, 'API Key', -1),
                      s(
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
                        [s('polyline', { points: '9 18 15 12 9 6' })],
                        -1
                      )
                    ]))
                ]),
                s('div', { class: 'settings__item', onClick: a }, [
                  ...(e[6] ||
                    (e[6] = [
                      s('span', { class: 'settings__item-label' }, '设备连接', -1),
                      s(
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
                        [s('polyline', { points: '9 18 15 12 9 6' })],
                        -1
                      )
                    ]))
                ])
              ]),
              u(d)
            ])
          ])
        )
      }
    }
  }),
  B = w(f, [['__scopeId', 'data-v-c4116f43']])
export { B as default }
