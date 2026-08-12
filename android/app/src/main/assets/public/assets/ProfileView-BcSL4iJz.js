import {
  d as g,
  B as f,
  c as k,
  e as s,
  t as e,
  a as l,
  A as t,
  s as i,
  u as m,
  o as h,
  _ as w
} from './index-gd_PtegP.js'
import { u as y } from './user-DY2KCaFn.js'
import './request-DT7itpYf.js'
const x = { class: 'profile' },
  b = { class: 'profile__content' },
  B = { class: 'pc-card profile__user' },
  C = {
    class: 'profile__avatar',
    style: { background: 'linear-gradient(135deg, #5B4CFF, #4530E0)' }
  },
  j = { class: 'profile__user-info' },
  I = { class: 'profile__name' },
  S = { class: 'profile__contact' },
  U = g({
    __name: 'ProfileView',
    setup(V) {
      const r = m(),
        a = y(),
        n = t(() => {
          var o
          return ((o = a.userInfo) == null ? void 0 : o.username) || '未登录'
        }),
        p = t(() => {
          var o
          return ((o = a.userInfo) == null ? void 0 : o.email) || ''
        }),
        d = t(() => (n.value || 'U').slice(0, 1).toUpperCase())
      f(() => {
        a.userInfo || a.fetchUserInfo()
      })
      function u() {
        r.push('/personal-center')
      }
      function _() {
        i('资料编辑即将上线')
      }
      function v() {
        i('会员功能即将上线')
      }
      return (o, c) => (
        h(),
        k('div', x, [
          s('header', { class: 'profile__header' }, [
            c[1] || (c[1] = s('h1', { class: 'profile__title' }, '设置', -1)),
            s('button', { class: 'profile__close', 'aria-label': '关闭', onClick: u }, [
              ...(c[0] ||
                (c[0] = [
                  s(
                    'svg',
                    {
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
                      s('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
                      s('line', { x1: '6', y1: '6', x2: '18', y2: '18' })
                    ],
                    -1
                  )
                ]))
            ])
          ]),
          s('main', b, [
            s('section', B, [
              s('div', C, e(d.value), 1),
              s('div', j, [
                s('p', I, e(n.value), 1),
                s('p', S, e(p.value || '未绑定邮箱') + ' · 暂无手机号', 1),
                c[2] || (c[2] = s('p', { class: 'profile__member' }, '普通会员', -1))
              ]),
              s('button', { class: 'profile__edit', onClick: _ }, '编辑资料')
            ]),
            s('section', { class: 'pc-card pc-group' }, [
              c[4] ||
                (c[4] = l(
                  '<div class="pc-group__item" data-v-277c0c0c><span class="pc-group__label" data-v-277c0c0c>账户</span><span class="pc-group__value" data-v-277c0c0c><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-277c0c0c><polyline points="9 18 15 12 9 6" data-v-277c0c0c></polyline></svg></span></div><div class="pc-group__item" data-v-277c0c0c><span class="pc-group__label" data-v-277c0c0c>消息</span><span class="pc-group__value" data-v-277c0c0c><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-277c0c0c><polyline points="9 18 15 12 9 6" data-v-277c0c0c></polyline></svg></span></div>',
                  2
                )),
              s('div', { class: 'pc-group__item' }, [
                c[3] || (c[3] = s('span', { class: 'pc-group__label' }, '积分', -1)),
                s('span', { class: 'pc-group__value pc-group__value--text', onClick: v }, '4500')
              ])
            ]),
            c[5] ||
              (c[5] = l(
                '<section class="pc-card pc-group" data-v-277c0c0c><div class="pc-group__item" data-v-277c0c0c><span class="pc-group__label" data-v-277c0c0c>语言</span><span class="pc-group__value pc-group__value--text" data-v-277c0c0c>中文</span></div><div class="pc-group__item" data-v-277c0c0c><span class="pc-group__label" data-v-277c0c0c>通知</span><span class="pc-group__value" data-v-277c0c0c><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-277c0c0c><polyline points="9 18 15 12 9 6" data-v-277c0c0c></polyline></svg></span></div><div class="pc-group__item" data-v-277c0c0c><span class="pc-group__label" data-v-277c0c0c>帮助与反馈</span><span class="pc-group__value" data-v-277c0c0c><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-277c0c0c><polyline points="9 18 15 12 9 6" data-v-277c0c0c></polyline></svg></span></div></section><section class="pc-card pc-group" data-v-277c0c0c><div class="pc-group__item" data-v-277c0c0c><span class="pc-group__label" data-v-277c0c0c>设备管理</span><span class="pc-group__value" data-v-277c0c0c><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-277c0c0c><polyline points="9 18 15 12 9 6" data-v-277c0c0c></polyline></svg></span></div></section>',
                2
              ))
          ])
        ])
      )
    }
  }),
  F = w(U, [['__scopeId', 'data-v-277c0c0c']])
export { F as default }
