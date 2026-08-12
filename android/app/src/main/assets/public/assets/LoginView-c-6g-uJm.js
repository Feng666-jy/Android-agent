import {
  d as c,
  c as v,
  a as w,
  b as o,
  w as l,
  u as h,
  r,
  o as b,
  e as t,
  f as V,
  g as k,
  h as x,
  s as u,
  _ as y
} from './index-gd_PtegP.js'
import { u as A } from './user-DY2KCaFn.js'
import { G as C } from './GlassCard-CWG_Ebya.js'
import './request-DT7itpYf.js'
const B = { class: 'login-page' },
  N = { style: { 'margin-top': '20px' } },
  S = c({
    __name: 'LoginView',
    setup(L) {
      const i = h(),
        p = A(),
        s = k(!1),
        a = x({ username: '', password: '' })
      async function m() {
        if (!a.username.trim()) {
          u('请输入用户名')
          return
        }
        if (!a.password.trim()) {
          u('请输入密码')
          return
        }
        s.value = !0
        try {
          ;(await p.login(a), i.push('/home'))
        } catch {
        } finally {
          s.value = !1
        }
      }
      function g() {
        i.push('/register')
      }
      return (U, e) => {
        const d = r('van-field'),
          f = r('van-button'),
          _ = r('van-form')
        return (
          b(),
          v('div', B, [
            e[5] ||
              (e[5] = w(
                '<div class="login-page__brand" data-v-f5e94506><div class="login-page__logo" data-v-f5e94506><svg width="56" height="56" viewBox="0 0 64 64" fill="none" data-v-f5e94506><rect width="64" height="64" rx="16" fill="#1A1A1A" data-v-f5e94506></rect><path d="M20 44V24l12 10 12-10v20" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" data-v-f5e94506></path></svg></div><h1 class="login-page__title" data-v-f5e94506>Android Agent</h1><p class="login-page__subtitle" data-v-f5e94506>企业级 AI 开发平台</p></div>',
                1
              )),
            o(
              C,
              { class: 'login-page__card' },
              {
                default: l(() => [
                  e[4] || (e[4] = t('h2', { class: 'login-page__card-title' }, '欢迎回来', -1)),
                  o(
                    _,
                    { onSubmit: m },
                    {
                      default: l(() => [
                        o(
                          d,
                          {
                            modelValue: a.username,
                            'onUpdate:modelValue': e[0] || (e[0] = n => (a.username = n)),
                            name: 'username',
                            label: '用户名',
                            placeholder: '请输入用户名',
                            rules: [{ required: !0, message: '请输入用户名' }],
                            clearable: ''
                          },
                          null,
                          8,
                          ['modelValue']
                        ),
                        o(
                          d,
                          {
                            modelValue: a.password,
                            'onUpdate:modelValue': e[1] || (e[1] = n => (a.password = n)),
                            type: 'password',
                            name: 'password',
                            label: '密码',
                            placeholder: '请输入密码',
                            rules: [{ required: !0, message: '请输入密码' }],
                            clearable: ''
                          },
                          null,
                          8,
                          ['modelValue']
                        ),
                        t('div', N, [
                          o(
                            f,
                            {
                              round: '',
                              block: '',
                              type: 'primary',
                              'native-type': 'submit',
                              loading: s.value,
                              'loading-text': '登录中...'
                            },
                            { default: l(() => [...(e[2] || (e[2] = [V(' 登录 ', -1)]))]), _: 1 },
                            8,
                            ['loading']
                          )
                        ])
                      ]),
                      _: 1
                    }
                  ),
                  t('div', { class: 'login-page__footer' }, [
                    e[3] || (e[3] = t('span', null, '还没有账号？', -1)),
                    t('button', { class: 'login-page__link', onClick: g }, '立即注册')
                  ])
                ]),
                _: 1
              }
            )
          ])
        )
      }
    }
  }),
  T = y(S, [['__scopeId', 'data-v-f5e94506']])
export { T as default }
