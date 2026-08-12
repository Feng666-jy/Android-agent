import {
  d as _,
  c as m,
  f as e,
  t as p,
  b as a,
  w as h,
  C as v,
  e as f,
  u as k,
  o,
  h as n,
  I as b,
  K as w,
  J as g
} from './index-B7ocQHAM.js'
import { B } from './BottomToolbar-32zLjNyG.js'
const C = { class: 'page' },
  y = { class: 'header' },
  x = { class: 'header__title' },
  T = { class: 'content' },
  D = { class: 'nav-bar' },
  V = _({
    __name: 'TabLayout',
    setup(K) {
      const t = g(),
        r = k(),
        i = v(
          () =>
            ({
              search: '搜索',
              image: '绘图',
              files: '文件',
              code: '代码',
              history: '历史',
              settings: '设置'
            })[t.name] ??
            t.meta.title ??
            ''
        )
      function c() {
        r.push('/home')
      }
      return (l, s) => {
        const u = f('router-view')
        return (
          o(),
          m('div', C, [
            e('header', y, [
              e('button', { class: 'header__back', 'aria-label': '返回首页', onClick: c }, [
                ...(s[0] ||
                  (s[0] = [
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
              e('h1', x, p(i.value), 1)
            ]),
            e('main', T, [
              a(u, null, {
                default: h(({ Component: d }) => [(o(), n(w, null, [(o(), n(b(d)))], 1024))]),
                _: 1
              })
            ]),
            e('div', D, [a(B, { mode: 'work' })])
          ])
        )
      }
    }
  })
export { V as default }
