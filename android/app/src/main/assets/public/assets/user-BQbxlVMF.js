import { E as k, g as r, M as n, s as c } from './index-CRvy0G29.js'
import { u } from './user-DuiVKeQ2.js'
import './request-CrdghNby.js'
const T = k('user', () => {
  const t = r(n.getToken()),
    o = r(null),
    a = r(!!t.value)
  async function i(s) {
    const e = (await u.login(s)).data
    ;((t.value = e.token), (o.value = e.user), (a.value = !0), n.setToken(e.token), c('登录成功'))
  }
  async function f(s) {
    const e = (await u.register(s)).data
    ;((t.value = e.token), (o.value = e.user), (a.value = !0), n.setToken(e.token), c('注册成功'))
  }
  async function v() {
    try {
      const s = await u.getInfo()
      o.value = s.data
    } catch {
      l()
    }
  }
  function l() {
    ;((t.value = null), (o.value = null), (a.value = !1), n.removeToken())
  }
  return {
    token: t,
    userInfo: o,
    isLoggedIn: a,
    login: i,
    register: f,
    fetchUserInfo: v,
    logout: l
  }
})
export { T as u }
