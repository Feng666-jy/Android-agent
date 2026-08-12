import {
  d as _,
  c as m,
  e,
  t as p,
  b as a,
  w as h,
  A as v,
  r as k,
  u as f,
  o,
  q as n,
  G as b,
  K as w,
  H as g
} from './index-DTPmbI92.js'
import { B } from './BottomToolbar-DEwv6Nne.js'
const C = { class: 'page' },
  y = { class: 'header' },
  x = { class: 'header__title' },
  T = { class: 'content' },
  A = { class: 'nav-bar' },
  N = _({
    __name: 'TabLayout',
    setup(D) {
      const t = g(),
        r = f(),
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
        const u = k('router-view')
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
            e('div', A, [a(B, { mode: 'work' })])
          ])
        )
      }
    }
  })
export { N as default }
