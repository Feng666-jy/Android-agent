import { d as s, c as d, n as o, i as r, j as l, o as t, _ as n } from './index-DTPmbI92.js'
const c = s({
    __name: 'GlassCard',
    props: {
      padding: { default: '20px' },
      radius: { default: '16px' },
      hover: { type: Boolean, default: !1 }
    },
    setup(a) {
      return (e, i) => (
        t(),
        d(
          'div',
          {
            class: r(['glass-card', { 'glass-card--hover': a.hover }]),
            style: o({ padding: a.padding, borderRadius: a.radius })
          },
          [l(e.$slots, 'default', {}, void 0)],
          6
        )
      )
    }
  }),
  u = n(c, [['__scopeId', 'data-v-7c0ca261']])
export { u as G }
