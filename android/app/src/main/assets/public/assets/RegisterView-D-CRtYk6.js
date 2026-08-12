import {
  d as V,
  c as b,
  a as h,
  b as t,
  w as i,
  e as r,
  f as x,
  g as p,
  h as k,
  s as o,
  r as u,
  u as y,
  o as R,
  _ as C
} from './index-CRvy0G29.js'
import { u as U } from './user-BQbxlVMF.js'
import { G as q } from './GlassCard-aWEFUVVZ.js'
import './user-DuiVKeQ2.js'
import './request-CrdghNby.js'
const B = { class: 'register-page' },
  N = { style: { 'margin-top': '20px' } },
  S = V({
    __name: 'RegisterView',
    setup(A) {
      const m = y(),
        g = U(),
        n = p(!1),
        a = k({ username: '', password: '', email: '' }),
        d = p('')
      async function c() {
        if (!a.username.trim() || a.username.length < 3) {
          o('用户名至少 3 个字符')
          return
        }
        if (!a.password.trim() || a.password.length < 6) {
          o('密码至少 6 个字符')
          return
        }
        if (a.password !== d.value) {
          o('两次密码输入不一致')
          return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email)) {
          o('请输入有效的邮箱地址')
          return
        }
        n.value = !0
        try {
          ;(await g.register(a), m.push('/home'))
        } catch {
        } finally {
          n.value = !1
        }
      }
      function v() {
        m.push('/login')
      }
      return (f, e) => {
        const l = u('van-field'),
          _ = u('van-button'),
          w = u('van-form')
        return (
          R(),
          b('div', B, [
            e[7] ||
              (e[7] = h(
                '<div class="register-page__brand" data-v-4708a1dc><div class="register-page__logo" data-v-4708a1dc><svg width="56" height="56" viewBox="0 0 64 64" fill="none" data-v-4708a1dc><rect width="64" height="64" rx="16" fill="#1A1A1A" data-v-4708a1dc></rect><path d="M20 32l8 8 16-16" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" data-v-4708a1dc></path></svg></div><h1 class="register-page__title" data-v-4708a1dc>创建账号</h1><p class="register-page__subtitle" data-v-4708a1dc>加入平台</p></div>',
                1
              )),
            t(
              q,
              { class: 'register-page__card' },
              {
                default: i(() => [
                  e[6] || (e[6] = r('h2', { class: 'register-page__card-title' }, '注册', -1)),
                  t(
                    w,
                    { onSubmit: c },
                    {
                      default: i(() => [
                        t(
                          l,
                          {
                            modelValue: a.username,
                            'onUpdate:modelValue': e[0] || (e[0] = s => (a.username = s)),
                            name: 'username',
                            label: '用户名',
                            placeholder: '至少 3 个字符',
                            rules: [{ required: !0, message: '请输入用户名' }],
                            clearable: ''
                          },
                          null,
                          8,
                          ['modelValue']
                        ),
                        t(
                          l,
                          {
                            modelValue: a.email,
                            'onUpdate:modelValue': e[1] || (e[1] = s => (a.email = s)),
                            name: 'email',
                            label: '邮箱',
                            placeholder: '请输入邮箱地址',
                            rules: [
                              { required: !0, message: '请输入邮箱' },
                              { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '邮箱格式不正确' }
                            ],
                            clearable: ''
                          },
                          null,
                          8,
                          ['modelValue']
                        ),
                        t(
                          l,
                          {
                            modelValue: a.password,
                            'onUpdate:modelValue': e[2] || (e[2] = s => (a.password = s)),
                            type: 'password',
                            name: 'password',
                            label: '密码',
                            placeholder: '至少 6 个字符',
                            rules: [{ required: !0, message: '请输入密码' }],
                            clearable: ''
                          },
                          null,
                          8,
                          ['modelValue']
                        ),
                        t(
                          l,
                          {
                            modelValue: d.value,
                            'onUpdate:modelValue': e[3] || (e[3] = s => (d.value = s)),
                            type: 'password',
                            name: 'confirmPassword',
                            label: '确认密码',
                            placeholder: '请再次输入密码',
                            rules: [{ required: !0, message: '请确认密码' }],
                            clearable: ''
                          },
                          null,
                          8,
                          ['modelValue']
                        ),
                        r('div', N, [
                          t(
                            _,
                            {
                              round: '',
                              block: '',
                              type: 'primary',
                              'native-type': 'submit',
                              loading: n.value,
                              'loading-text': '注册中...'
                            },
                            { default: i(() => [...(e[4] || (e[4] = [x(' 注册 ', -1)]))]), _: 1 },
                            8,
                            ['loading']
                          )
                        ])
                      ]),
                      _: 1
                    }
                  ),
                  r('div', { class: 'register-page__footer' }, [
                    e[5] || (e[5] = r('span', null, '已有账号？', -1)),
                    r('button', { class: 'register-page__link', onClick: v }, '去登录')
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
  E = C(S, [['__scopeId', 'data-v-4708a1dc']])
export { E as default }
