import {
  d as h,
  r as v,
  s as g,
  c as k,
  a as x,
  b as s,
  w as i,
  u as y,
  e as d,
  o as c,
  f as l,
  g as B,
  h as C,
  i as N,
  j as A,
  k as S,
  l as u,
  _ as I
} from './index-B7ocQHAM.js'
import { u as U } from './user-Pp4P9df0.js'
import { G as L } from './GlassCard-s7oFwnwd.js'
import { i as j } from './device-bridge-BO8---nf.js'
import './request-eyLhzUlJ.js'
const q = { class: 'login-page' },
  G = { style: { 'margin-top': '20px' } },
  P = h({
    __name: 'LoginView',
    setup(R) {
      const p = y(),
        f = U(),
        r = v(!1),
        m = j(),
        t = v(g.getServerBase()),
        a = S({ username: '', password: '' })
      async function _() {
        if (m && !t.value.trim()) {
          u('手机端请先填写服务器地址（http://电脑IP:3000）')
          return
        }
        if (!a.username.trim()) {
          u('请输入用户名')
          return
        }
        if (!a.password.trim()) {
          u('请输入密码')
          return
        }
        r.value = !0
        try {
          ;(t.value.trim() && g.setServerBase(t.value.trim().replace(/\/+$/, '')),
            await f.login(a),
            p.push('/home'))
        } catch {
        } finally {
          r.value = !1
        }
      }
      function w() {
        p.push('/register')
      }
      return (T, e) => {
        const n = d('van-field'),
          V = d('van-button'),
          b = d('van-form')
        return (
          c(),
          k('div', q, [
            e[6] ||
              (e[6] = x(
                '<div class="login-page__brand" data-v-2394a634><div class="login-page__logo" data-v-2394a634><svg width="56" height="56" viewBox="0 0 64 64" fill="none" data-v-2394a634><rect width="64" height="64" rx="16" fill="#1A1A1A" data-v-2394a634></rect><path d="M20 44V24l12 10 12-10v20" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" data-v-2394a634></path></svg></div><h1 class="login-page__title" data-v-2394a634>Android Agent</h1><p class="login-page__subtitle" data-v-2394a634>企业级 AI 开发平台</p></div>',
                1
              )),
            s(
              L,
              { class: 'login-page__card' },
              {
                default: i(() => [
                  e[5] || (e[5] = l('h2', { class: 'login-page__card-title' }, '欢迎回来', -1)),
                  s(
                    b,
                    { onSubmit: _ },
                    {
                      default: i(() => [
                        B(m)
                          ? (c(),
                            C(
                              n,
                              {
                                key: 0,
                                modelValue: t.value,
                                'onUpdate:modelValue': e[0] || (e[0] = o => (t.value = o)),
                                name: 'serverBase',
                                label: '服务器',
                                placeholder: 'http://电脑IP:3000（必填）',
                                clearable: ''
                              },
                              null,
                              8,
                              ['modelValue']
                            ))
                          : N('', !0),
                        s(
                          n,
                          {
                            modelValue: a.username,
                            'onUpdate:modelValue': e[1] || (e[1] = o => (a.username = o)),
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
                        s(
                          n,
                          {
                            modelValue: a.password,
                            'onUpdate:modelValue': e[2] || (e[2] = o => (a.password = o)),
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
                        l('div', G, [
                          s(
                            V,
                            {
                              round: '',
                              block: '',
                              type: 'primary',
                              'native-type': 'submit',
                              loading: r.value,
                              'loading-text': '登录中...'
                            },
                            { default: i(() => [...(e[3] || (e[3] = [A(' 登录 ', -1)]))]), _: 1 },
                            8,
                            ['loading']
                          )
                        ])
                      ]),
                      _: 1
                    }
                  ),
                  l('div', { class: 'login-page__footer' }, [
                    e[4] || (e[4] = l('span', null, '还没有账号？', -1)),
                    l('button', { class: 'login-page__link', onClick: w }, '立即注册')
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
  F = I(P, [['__scopeId', 'data-v-2394a634']])
export { F as default }
