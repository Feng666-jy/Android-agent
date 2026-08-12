import { E as d, g as u, M as n, s as c } from './index-gd_PtegP.js'
import { r as a } from './request-DT7itpYf.js'
const l = {
    login(e) {
      return a.post('/user/login', e)
    },
    register(e) {
      return a.post('/user/register', e)
    },
    getInfo() {
      return a.get('/user/info')
    },
    updateProfile(e) {
      return a.put('/user/profile', e)
    }
  },
  m = d('user', () => {
    const e = u(n.getToken()),
      r = u(null),
      o = u(!!e.value)
    async function f(s) {
      const t = (await l.login(s)).data
      ;((e.value = t.token), (r.value = t.user), (o.value = !0), n.setToken(t.token), c('登录成功'))
    }
    async function g(s) {
      const t = (await l.register(s)).data
      ;((e.value = t.token), (r.value = t.user), (o.value = !0), n.setToken(t.token), c('注册成功'))
    }
    async function v() {
      try {
        const s = await l.getInfo()
        r.value = s.data
      } catch {
        i()
      }
    }
    function i() {
      ;((e.value = null), (r.value = null), (o.value = !1), n.removeToken())
    }
    return {
      token: e,
      userInfo: r,
      isLoggedIn: o,
      login: f,
      register: g,
      fetchUserInfo: v,
      logout: i
    }
  })
export { m as u }
