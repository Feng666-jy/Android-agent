const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      'assets/LoginView-DKEW63gp.js',
      'assets/user-BTyDGE-J.js',
      'assets/request-B60bV0HZ.js',
      'assets/GlassCard-DL78tJOj.js',
      'assets/GlassCard-D1XDQemc.css',
      'assets/LoginView-Lk-Q_Lck.css',
      'assets/RegisterView-BLkQEd8T.js',
      'assets/RegisterView-6skarRRI.css',
      'assets/AiHomePage-CsMTzAsh.js',
      'assets/model-CO2euHd2.js',
      'assets/BottomToolbar-DEwv6Nne.js',
      'assets/BottomToolbar-COviZtNj.css',
      'assets/agent-CF4HRCsr.js',
      'assets/conversation-CHD199ET.js',
      'assets/AiHomePage-Ctq15q1V.css',
      'assets/PersonalCenter-CgDp-kQr.js',
      'assets/PersonalCenter-6XLKTbtg.css',
      'assets/ProfileView-D6BdPWq1.js',
      'assets/ProfileView-Dcvpn_sH.css',
      'assets/TabLayout-CPz4OoTE.js',
      'assets/TabLayout-BrDXqkZV.css',
      'assets/SearchView-DF57gNzp.js',
      'assets/SearchView-C2EJGDjK.css',
      'assets/ImageView-DR4c9S_C.js',
      'assets/ImageView-ClPpmMnD.css',
      'assets/FilesView-BV0TM7ka.js',
      'assets/FilesView-CJ_PR2o3.css',
      'assets/CodeView-CwTecvIE.js',
      'assets/CodeView-BE8ZNmL_.css',
      'assets/HistoryView-MZsenzc-.js',
      'assets/HistoryView-ah7FSUUg.css',
      'assets/SettingsView--jQp8DEn.js',
      'assets/SettingsView-BAc2jLrv.css',
      'assets/ProviderList-zOMKbCs0.js',
      'assets/provider-CbtpCNgc.js',
      'assets/provider-kt362Y4q.js',
      'assets/ProviderList-cIbvtxqL.css',
      'assets/ProviderForm-C08ZKv1j.js',
      'assets/ProviderForm--mkgfX5U.css',
      'assets/ProviderDetail-BMxyliOm.js',
      'assets/ProviderDetail-DKeIWUxo.css',
      'assets/ModelManager-DJrN8EN2.js',
      'assets/ModelManager-DLdlfxtR.css',
      'assets/ToolManager-BdJhozn_.js',
      'assets/ToolManager-CDZ506jM.css',
      'assets/DeviceManager-RRMUrkYq.js',
      'assets/DeviceManager-Cc9Pqijy.css',
      'assets/AiResourcesView-706CC_GZ.js',
      'assets/AiResourcesView-Kh7A7eTs.css',
      'assets/OrgView-CAo4WHLb.js',
      'assets/OrgView-B_HL7hX7.css',
      'assets/ApiKeysView-OLmJJ-uN.js',
      'assets/ApiKeysView-CGRfpY8v.css'
    ])
) => i.map(i => d[i])
;(function () {
  const t = document.createElement('link').relList
  if (t && t.supports && t.supports('modulepreload')) return
  for (const a of document.querySelectorAll('link[rel="modulepreload"]')) o(a)
  new MutationObserver(a => {
    for (const i of a)
      if (i.type === 'childList')
        for (const l of i.addedNodes) l.tagName === 'LINK' && l.rel === 'modulepreload' && o(l)
  }).observe(document, { childList: !0, subtree: !0 })
  function n(a) {
    const i = {}
    return (
      a.integrity && (i.integrity = a.integrity),
      a.referrerPolicy && (i.referrerPolicy = a.referrerPolicy),
      a.crossOrigin === 'use-credentials'
        ? (i.credentials = 'include')
        : a.crossOrigin === 'anonymous'
          ? (i.credentials = 'omit')
          : (i.credentials = 'same-origin'),
      i
    )
  }
  function o(a) {
    if (a.ep) return
    a.ep = !0
    const i = n(a)
    fetch(a.href, i)
  }
})()
/**
 * @vue/shared v3.5.39
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function bs(e) {
  const t = Object.create(null)
  for (const n of e.split(',')) t[n] = 1
  return n => n in t
}
const Le = {},
  Wo = [],
  fn = () => {},
  Ad = () => !1,
  fl = e =>
    e.charCodeAt(0) === 111 &&
    e.charCodeAt(1) === 110 &&
    (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97),
  hl = e => e.startsWith('onUpdate:'),
  at = Object.assign,
  ys = (e, t) => {
    const n = e.indexOf(t)
    n > -1 && e.splice(n, 1)
  },
  Lb = Object.prototype.hasOwnProperty,
  De = (e, t) => Lb.call(e, t),
  ve = Array.isArray,
  Uo = e => la(e) === '[object Map]',
  ml = e => la(e) === '[object Set]',
  bc = e => la(e) === '[object Date]',
  Nb = e => la(e) === '[object RegExp]',
  xe = e => typeof e == 'function',
  Me = e => typeof e == 'string',
  It = e => typeof e == 'symbol',
  $e = e => e !== null && typeof e == 'object',
  Pd = e => ($e(e) || xe(e)) && xe(e.then) && xe(e.catch),
  Id = Object.prototype.toString,
  la = e => Id.call(e),
  Fb = e => la(e).slice(8, -1),
  Od = e => la(e) === '[object Object]',
  gl = e => Me(e) && e !== 'NaN' && e[0] !== '-' && '' + parseInt(e, 10) === e,
  Oa = bs(
    ',key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted'
  ),
  vl = e => {
    const t = Object.create(null)
    return n => t[n] || (t[n] = e(n))
  },
  Hb = /-\w/g,
  _t = vl(e => e.replace(Hb, t => t.slice(1).toUpperCase())),
  zb = /\B([A-Z])/g,
  Ln = vl(e => e.replace(zb, '-$1').toLowerCase()),
  bl = vl(e => e.charAt(0).toUpperCase() + e.slice(1)),
  Zl = vl(e => (e ? `on${bl(e)}` : '')),
  dn = (e, t) => !Object.is(e, t),
  Ko = (e, ...t) => {
    for (let n = 0; n < e.length; n++) e[n](...t)
  },
  Rd = (e, t, n, o = !1) => {
    Object.defineProperty(e, t, { configurable: !0, enumerable: !1, writable: o, value: n })
  },
  yl = e => {
    const t = parseFloat(e)
    return isNaN(t) ? e : t
  },
  jb = e => {
    const t = Me(e) ? Number(e) : NaN
    return isNaN(t) ? e : t
  }
let yc
const pl = () =>
  yc ||
  (yc =
    typeof globalThis < 'u'
      ? globalThis
      : typeof self < 'u'
        ? self
        : typeof window < 'u'
          ? window
          : typeof global < 'u'
            ? global
            : {})
function wl(e) {
  if (ve(e)) {
    const t = {}
    for (let n = 0; n < e.length; n++) {
      const o = e[n],
        a = Me(o) ? Yb(o) : wl(o)
      if (a) for (const i in a) t[i] = a[i]
    }
    return t
  } else if (Me(e) || $e(e)) return e
}
const Wb = /;(?![^(]*\))/g,
  Ub = /:([^]+)/,
  Kb = /\/\*[^]*?\*\//g
function Yb(e) {
  const t = {}
  return (
    e
      .replace(Kb, '')
      .split(Wb)
      .forEach(n => {
        if (n) {
          const o = n.split(Ub)
          o.length > 1 && (t[o[0].trim()] = o[1].trim())
        }
      }),
    t
  )
}
function Gb(e) {
  if (!e) return ''
  if (Me(e)) return e
  let t = ''
  for (const n in e) {
    const o = e[n]
    if (Me(o) || typeof o == 'number') {
      const a = n.startsWith('--') ? n : Ln(n)
      t += `${a}:${o};`
    }
  }
  return t
}
function xl(e) {
  let t = ''
  if (Me(e)) t = e
  else if (ve(e))
    for (let n = 0; n < e.length; n++) {
      const o = xl(e[n])
      o && (t += o + ' ')
    }
  else if ($e(e)) for (const n in e) e[n] && (t += n + ' ')
  return t.trim()
}
const qb = 'itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly',
  Xb = bs(qb)
function Dd(e) {
  return !!e || e === ''
}
function Zb(e, t) {
  if (e.length !== t.length) return !1
  let n = !0
  for (let o = 0; n && o < e.length; o++) n = Qa(e[o], t[o])
  return n
}
function Qa(e, t) {
  if (e === t) return !0
  let n = bc(e),
    o = bc(t)
  if (n || o) return n && o ? e.getTime() === t.getTime() : !1
  if (((n = It(e)), (o = It(t)), n || o)) return e === t
  if (((n = ve(e)), (o = ve(t)), n || o)) return n && o ? Zb(e, t) : !1
  if (((n = $e(e)), (o = $e(t)), n || o)) {
    if (!n || !o) return !1
    const a = Object.keys(e).length,
      i = Object.keys(t).length
    if (a !== i) return !1
    for (const l in e) {
      const r = e.hasOwnProperty(l),
        s = t.hasOwnProperty(l)
      if ((r && !s) || (!r && s) || !Qa(e[l], t[l])) return !1
    }
  }
  return String(e) === String(t)
}
function Jb(e, t) {
  return e.findIndex(n => Qa(n, t))
}
const $d = e => !!(e && e.__v_isRef === !0),
  Qb = e =>
    Me(e)
      ? e
      : e == null
        ? ''
        : ve(e) || ($e(e) && (e.toString === Id || !xe(e.toString)))
          ? $d(e)
            ? Qb(e.value)
            : JSON.stringify(e, Bd, 2)
          : String(e),
  Bd = (e, t) =>
    $d(t)
      ? Bd(e, t.value)
      : Uo(t)
        ? {
            [`Map(${t.size})`]: [...t.entries()].reduce(
              (n, [o, a], i) => ((n[Jl(o, i) + ' =>'] = a), n),
              {}
            )
          }
        : ml(t)
          ? { [`Set(${t.size})`]: [...t.values()].map(n => Jl(n)) }
          : It(t)
            ? Jl(t)
            : $e(t) && !ve(t) && !Od(t)
              ? String(t)
              : t,
  Jl = (e, t = '') => {
    var n
    return It(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  }
/**
 * @vue/reactivity v3.5.39
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ let et
class Md {
  constructor(t = !1) {
    ;((this.detached = t),
      (this._active = !0),
      (this._on = 0),
      (this.effects = []),
      (this.cleanups = []),
      (this._isPaused = !1),
      (this._warnOnRun = !0),
      (this.__v_skip = !0),
      !t &&
        et &&
        (et.active
          ? ((this.parent = et), (this.index = (et.scopes || (et.scopes = [])).push(this) - 1))
          : ((this._active = !1), (this._warnOnRun = !1))))
  }
  get active() {
    return this._active
  }
  pause() {
    if (this._active) {
      this._isPaused = !0
      let t, n
      if (this.scopes) for (t = 0, n = this.scopes.length; t < n; t++) this.scopes[t].pause()
      for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].pause()
    }
  }
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1
      let t, n
      if (this.scopes) for (t = 0, n = this.scopes.length; t < n; t++) this.scopes[t].resume()
      for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].resume()
    }
  }
  run(t) {
    if (this._active) {
      const n = et
      try {
        return ((et = this), t())
      } finally {
        et = n
      }
    }
  }
  on() {
    ++this._on === 1 && ((this.prevScope = et), (et = this))
  }
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (et === this) et = this.prevScope
      else {
        let t = et
        for (; t;) {
          if (t.prevScope === this) {
            t.prevScope = this.prevScope
            break
          }
          t = t.prevScope
        }
      }
      this.prevScope = void 0
    }
  }
  stop(t) {
    if (this._active) {
      this._active = !1
      let n, o
      for (n = 0, o = this.effects.length; n < o; n++) this.effects[n].stop()
      for (this.effects.length = 0, n = 0, o = this.cleanups.length; n < o; n++) this.cleanups[n]()
      if (((this.cleanups.length = 0), this.scopes)) {
        for (n = 0, o = this.scopes.length; n < o; n++) this.scopes[n].stop(!0)
        this.scopes.length = 0
      }
      if (!this.detached && this.parent && !t) {
        const a = this.parent.scopes.pop()
        a && a !== this && ((this.parent.scopes[this.index] = a), (a.index = this.index))
      }
      this.parent = void 0
    }
  }
}
function Vd(e) {
  return new Md(e)
}
function Ld() {
  return et
}
function ey(e, t = !1) {
  et && et.cleanups.push(e)
}
let Ne
const Ql = new WeakSet()
class Nd {
  constructor(t) {
    ;((this.fn = t),
      (this.deps = void 0),
      (this.depsTail = void 0),
      (this.flags = 5),
      (this.next = void 0),
      (this.cleanup = void 0),
      (this.scheduler = void 0),
      et && (et.active ? et.effects.push(this) : (this.flags &= -2)))
  }
  pause() {
    this.flags |= 64
  }
  resume() {
    this.flags & 64 && ((this.flags &= -65), Ql.has(this) && (Ql.delete(this), this.trigger()))
  }
  notify() {
    ;(this.flags & 2 && !(this.flags & 32)) || this.flags & 8 || Hd(this)
  }
  run() {
    if (!(this.flags & 1)) return this.fn()
    ;((this.flags |= 2), pc(this), zd(this))
    const t = Ne,
      n = Gt
    ;((Ne = this), (Gt = !0))
    try {
      return this.fn()
    } finally {
      ;(jd(this), (Ne = t), (Gt = n), (this.flags &= -3))
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep) xs(t)
      ;((this.deps = this.depsTail = void 0),
        pc(this),
        this.onStop && this.onStop(),
        (this.flags &= -2))
    }
  }
  trigger() {
    this.flags & 64 ? Ql.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty()
  }
  runIfDirty() {
    Mr(this) && this.run()
  }
  get dirty() {
    return Mr(this)
  }
}
let Fd = 0,
  Ra,
  Da
function Hd(e, t = !1) {
  if (((e.flags |= 8), t)) {
    ;((e.next = Da), (Da = e))
    return
  }
  ;((e.next = Ra), (Ra = e))
}
function ps() {
  Fd++
}
function ws() {
  if (--Fd > 0) return
  if (Da) {
    let t = Da
    for (Da = void 0; t;) {
      const n = t.next
      ;((t.next = void 0), (t.flags &= -9), (t = n))
    }
  }
  let e
  for (; Ra;) {
    let t = Ra
    for (Ra = void 0; t;) {
      const n = t.next
      if (((t.next = void 0), (t.flags &= -9), t.flags & 1))
        try {
          t.trigger()
        } catch (o) {
          e || (e = o)
        }
      t = n
    }
  }
  if (e) throw e
}
function zd(e) {
  for (let t = e.deps; t; t = t.nextDep)
    ((t.version = -1), (t.prevActiveLink = t.dep.activeLink), (t.dep.activeLink = t))
}
function jd(e) {
  let t,
    n = e.depsTail,
    o = n
  for (; o;) {
    const a = o.prevDep
    ;(o.version === -1 ? (o === n && (n = a), xs(o), ty(o)) : (t = o),
      (o.dep.activeLink = o.prevActiveLink),
      (o.prevActiveLink = void 0),
      (o = a))
  }
  ;((e.deps = t), (e.depsTail = n))
}
function Mr(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (
      t.dep.version !== t.version ||
      (t.dep.computed && (Wd(t.dep.computed) || t.dep.version !== t.version))
    )
      return !0
  return !!e._dirty
}
function Wd(e) {
  if (
    (e.flags & 4 && !(e.flags & 16)) ||
    ((e.flags &= -17), e.globalVersion === za) ||
    ((e.globalVersion = za), !e.isSSR && e.flags & 128 && ((!e.deps && !e._dirty) || !Mr(e)))
  )
    return
  e.flags |= 2
  const t = e.dep,
    n = Ne,
    o = Gt
  ;((Ne = e), (Gt = !0))
  try {
    zd(e)
    const a = e.fn(e._value)
    ;(t.version === 0 || dn(a, e._value)) && ((e.flags |= 128), (e._value = a), t.version++)
  } catch (a) {
    throw (t.version++, a)
  } finally {
    ;((Ne = n), (Gt = o), jd(e), (e.flags &= -3))
  }
}
function xs(e, t = !1) {
  const { dep: n, prevSub: o, nextSub: a } = e
  if (
    (o && ((o.nextSub = a), (e.prevSub = void 0)),
    a && ((a.prevSub = o), (e.nextSub = void 0)),
    n.subs === e && ((n.subs = o), !o && n.computed))
  ) {
    n.computed.flags &= -5
    for (let i = n.computed.deps; i; i = i.nextDep) xs(i, !0)
  }
  !t && !--n.sc && n.map && n.map.delete(n.key)
}
function ty(e) {
  const { prevDep: t, nextDep: n } = e
  ;(t && ((t.nextDep = n), (e.prevDep = void 0)), n && ((n.prevDep = t), (e.nextDep = void 0)))
}
let Gt = !0
const Ud = []
function vn() {
  ;(Ud.push(Gt), (Gt = !1))
}
function bn() {
  const e = Ud.pop()
  Gt = e === void 0 ? !0 : e
}
function pc(e) {
  const { cleanup: t } = e
  if (((e.cleanup = void 0), t)) {
    const n = Ne
    Ne = void 0
    try {
      t()
    } finally {
      Ne = n
    }
  }
}
let za = 0
class ny {
  constructor(t, n) {
    ;((this.sub = t),
      (this.dep = n),
      (this.version = n.version),
      (this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0))
  }
}
class Ss {
  constructor(t) {
    ;((this.computed = t),
      (this.version = 0),
      (this.activeLink = void 0),
      (this.subs = void 0),
      (this.map = void 0),
      (this.key = void 0),
      (this.sc = 0),
      (this.__v_skip = !0))
  }
  track(t) {
    if (!Ne || !Gt || Ne === this.computed) return
    let n = this.activeLink
    if (n === void 0 || n.sub !== Ne)
      ((n = this.activeLink = new ny(Ne, this)),
        Ne.deps
          ? ((n.prevDep = Ne.depsTail), (Ne.depsTail.nextDep = n), (Ne.depsTail = n))
          : (Ne.deps = Ne.depsTail = n),
        Kd(n))
    else if (n.version === -1 && ((n.version = this.version), n.nextDep)) {
      const o = n.nextDep
      ;((o.prevDep = n.prevDep),
        n.prevDep && (n.prevDep.nextDep = o),
        (n.prevDep = Ne.depsTail),
        (n.nextDep = void 0),
        (Ne.depsTail.nextDep = n),
        (Ne.depsTail = n),
        Ne.deps === n && (Ne.deps = o))
    }
    return n
  }
  trigger(t) {
    ;(this.version++, za++, this.notify(t))
  }
  notify(t) {
    ps()
    try {
      for (let n = this.subs; n; n = n.prevSub) n.sub.notify() && n.sub.dep.notify()
    } finally {
      ws()
    }
  }
}
function Kd(e) {
  if ((e.dep.sc++, e.sub.flags & 4)) {
    const t = e.dep.computed
    if (t && !e.dep.subs) {
      t.flags |= 20
      for (let o = t.deps; o; o = o.nextDep) Kd(o)
    }
    const n = e.dep.subs
    ;(n !== e && ((e.prevSub = n), n && (n.nextSub = e)), (e.dep.subs = e))
  }
}
const Fi = new WeakMap(),
  wo = Symbol(''),
  Vr = Symbol(''),
  ja = Symbol('')
function mt(e, t, n) {
  if (Gt && Ne) {
    let o = Fi.get(e)
    o || Fi.set(e, (o = new Map()))
    let a = o.get(n)
    ;(a || (o.set(n, (a = new Ss())), (a.map = o), (a.key = n)), a.track())
  }
}
function An(e, t, n, o, a, i) {
  const l = Fi.get(e)
  if (!l) {
    za++
    return
  }
  const r = s => {
    s && s.trigger()
  }
  if ((ps(), t === 'clear')) l.forEach(r)
  else {
    const s = ve(e),
      c = s && gl(n)
    if (s && n === 'length') {
      const u = Number(o)
      l.forEach((d, h) => {
        ;(h === 'length' || h === ja || (!It(h) && h >= u)) && r(d)
      })
    } else
      switch (((n !== void 0 || l.has(void 0)) && r(l.get(n)), c && r(l.get(ja)), t)) {
        case 'add':
          s ? c && r(l.get('length')) : (r(l.get(wo)), Uo(e) && r(l.get(Vr)))
          break
        case 'delete':
          s || (r(l.get(wo)), Uo(e) && r(l.get(Vr)))
          break
        case 'set':
          Uo(e) && r(l.get(wo))
          break
      }
  }
  ws()
}
function oy(e, t) {
  const n = Fi.get(e)
  return n && n.get(t)
}
function Ao(e) {
  const t = Pe(e)
  return t === e ? t : (mt(t, 'iterate', ja), Pt(e) ? t : t.map(Zt))
}
function Sl(e) {
  return (mt((e = Pe(e)), 'iterate', ja), e)
}
function cn(e, t) {
  return Dn(e) ? Jo(On(e) ? Zt(t) : t) : Zt(t)
}
const ay = {
  __proto__: null,
  [Symbol.iterator]() {
    return er(this, Symbol.iterator, e => cn(this, e))
  },
  concat(...e) {
    return Ao(this).concat(...e.map(t => (ve(t) ? Ao(t) : t)))
  },
  entries() {
    return er(this, 'entries', e => ((e[1] = cn(this, e[1])), e))
  },
  every(e, t) {
    return wn(this, 'every', e, t, void 0, arguments)
  },
  filter(e, t) {
    return wn(this, 'filter', e, t, n => n.map(o => cn(this, o)), arguments)
  },
  find(e, t) {
    return wn(this, 'find', e, t, n => cn(this, n), arguments)
  },
  findIndex(e, t) {
    return wn(this, 'findIndex', e, t, void 0, arguments)
  },
  findLast(e, t) {
    return wn(this, 'findLast', e, t, n => cn(this, n), arguments)
  },
  findLastIndex(e, t) {
    return wn(this, 'findLastIndex', e, t, void 0, arguments)
  },
  forEach(e, t) {
    return wn(this, 'forEach', e, t, void 0, arguments)
  },
  includes(...e) {
    return tr(this, 'includes', e)
  },
  indexOf(...e) {
    return tr(this, 'indexOf', e)
  },
  join(e) {
    return Ao(this).join(e)
  },
  lastIndexOf(...e) {
    return tr(this, 'lastIndexOf', e)
  },
  map(e, t) {
    return wn(this, 'map', e, t, void 0, arguments)
  },
  pop() {
    return ma(this, 'pop')
  },
  push(...e) {
    return ma(this, 'push', e)
  },
  reduce(e, ...t) {
    return wc(this, 'reduce', e, t)
  },
  reduceRight(e, ...t) {
    return wc(this, 'reduceRight', e, t)
  },
  shift() {
    return ma(this, 'shift')
  },
  some(e, t) {
    return wn(this, 'some', e, t, void 0, arguments)
  },
  splice(...e) {
    return ma(this, 'splice', e)
  },
  toReversed() {
    return Ao(this).toReversed()
  },
  toSorted(e) {
    return Ao(this).toSorted(e)
  },
  toSpliced(...e) {
    return Ao(this).toSpliced(...e)
  },
  unshift(...e) {
    return ma(this, 'unshift', e)
  },
  values() {
    return er(this, 'values', e => cn(this, e))
  }
}
function er(e, t, n) {
  const o = Sl(e),
    a = o[t]()
  return (
    o !== e &&
      !Pt(e) &&
      ((a._next = a.next),
      (a.next = () => {
        const i = a._next()
        return (i.done || (i.value = n(i.value)), i)
      })),
    a
  )
}
const iy = Array.prototype
function wn(e, t, n, o, a, i) {
  const l = Sl(e),
    r = l !== e && !Pt(e),
    s = l[t]
  if (s !== iy[t]) {
    const d = s.apply(e, i)
    return r ? Zt(d) : d
  }
  let c = n
  l !== e &&
    (r
      ? (c = function (d, h) {
          return n.call(this, cn(e, d), h, e)
        })
      : n.length > 2 &&
        (c = function (d, h) {
          return n.call(this, d, h, e)
        }))
  const u = s.call(l, c, o)
  return r && a ? a(u) : u
}
function wc(e, t, n, o) {
  const a = Sl(e),
    i = a !== e && !Pt(e)
  let l = n,
    r = !1
  a !== e &&
    (i
      ? ((r = o.length === 0),
        (l = function (c, u, d) {
          return (r && ((r = !1), (c = cn(e, c))), n.call(this, c, cn(e, u), d, e))
        }))
      : n.length > 3 &&
        (l = function (c, u, d) {
          return n.call(this, c, u, d, e)
        }))
  const s = a[t](l, ...o)
  return r ? cn(e, s) : s
}
function tr(e, t, n) {
  const o = Pe(e)
  mt(o, 'iterate', ja)
  const a = o[t](...n)
  return (a === -1 || a === !1) && Cl(n[0]) ? ((n[0] = Pe(n[0])), o[t](...n)) : a
}
function ma(e, t, n = []) {
  ;(vn(), ps())
  const o = Pe(e)[t].apply(e, n)
  return (ws(), bn(), o)
}
const ly = bs('__proto__,__v_isRef,__isVue'),
  Yd = new Set(
    Object.getOwnPropertyNames(Symbol)
      .filter(e => e !== 'arguments' && e !== 'caller')
      .map(e => Symbol[e])
      .filter(It)
  )
function ry(e) {
  It(e) || (e = String(e))
  const t = Pe(this)
  return (mt(t, 'has', e), t.hasOwnProperty(e))
}
class Gd {
  constructor(t = !1, n = !1) {
    ;((this._isReadonly = t), (this._isShallow = n))
  }
  get(t, n, o) {
    if (n === '__v_skip') return t.__v_skip
    const a = this._isReadonly,
      i = this._isShallow
    if (n === '__v_isReactive') return !a
    if (n === '__v_isReadonly') return a
    if (n === '__v_isShallow') return i
    if (n === '__v_raw')
      return o === (a ? (i ? by : Jd) : i ? Zd : Xd).get(t) ||
        Object.getPrototypeOf(t) === Object.getPrototypeOf(o)
        ? t
        : void 0
    const l = ve(t)
    if (!a) {
      let s
      if (l && (s = ay[n])) return s
      if (n === 'hasOwnProperty') return ry
    }
    const r = Reflect.get(t, n, Ue(t) ? t : o)
    if ((It(n) ? Yd.has(n) : ly(n)) || (a || mt(t, 'get', n), i)) return r
    if (Ue(r)) {
      const s = l && gl(n) ? r : r.value
      return a && $e(s) ? Nr(s) : s
    }
    return $e(r) ? (a ? Nr(r) : He(r)) : r
  }
}
class qd extends Gd {
  constructor(t = !1) {
    super(!1, t)
  }
  set(t, n, o, a) {
    let i = t[n]
    const l = ve(t) && gl(n)
    if (!this._isShallow) {
      const c = Dn(i)
      if ((!Pt(o) && !Dn(o) && ((i = Pe(i)), (o = Pe(o))), !l && Ue(i) && !Ue(o)))
        return (c || (i.value = o), !0)
    }
    const r = l ? Number(n) < t.length : De(t, n),
      s = Reflect.set(t, n, o, Ue(t) ? t : a)
    return (t === Pe(a) && s && (r ? dn(o, i) && An(t, 'set', n, o) : An(t, 'add', n, o)), s)
  }
  deleteProperty(t, n) {
    const o = De(t, n)
    t[n]
    const a = Reflect.deleteProperty(t, n)
    return (a && o && An(t, 'delete', n, void 0), a)
  }
  has(t, n) {
    const o = Reflect.has(t, n)
    return ((!It(n) || !Yd.has(n)) && mt(t, 'has', n), o)
  }
  ownKeys(t) {
    return (mt(t, 'iterate', ve(t) ? 'length' : wo), Reflect.ownKeys(t))
  }
}
class sy extends Gd {
  constructor(t = !1) {
    super(!0, t)
  }
  set(t, n) {
    return !0
  }
  deleteProperty(t, n) {
    return !0
  }
}
const cy = new qd(),
  uy = new sy(),
  dy = new qd(!0)
const Lr = e => e,
  ci = e => Reflect.getPrototypeOf(e)
function fy(e, t, n) {
  return function (...o) {
    const a = this.__v_raw,
      i = Pe(a),
      l = Uo(i),
      r = e === 'entries' || (e === Symbol.iterator && l),
      s = e === 'keys' && l,
      c = a[e](...o),
      u = n ? Lr : t ? Jo : Zt
    return (
      !t && mt(i, 'iterate', s ? Vr : wo),
      at(Object.create(c), {
        next() {
          const { value: d, done: h } = c.next()
          return h ? { value: d, done: h } : { value: r ? [u(d[0]), u(d[1])] : u(d), done: h }
        }
      })
    )
  }
}
function ui(e) {
  return function (...t) {
    return e === 'delete' ? !1 : e === 'clear' ? void 0 : this
  }
}
function hy(e, t) {
  const n = {
    get(a) {
      const i = this.__v_raw,
        l = Pe(i),
        r = Pe(a)
      e || (dn(a, r) && mt(l, 'get', a), mt(l, 'get', r))
      const { has: s } = ci(l),
        c = t ? Lr : e ? Jo : Zt
      if (s.call(l, a)) return c(i.get(a))
      if (s.call(l, r)) return c(i.get(r))
      i !== l && i.get(a)
    },
    get size() {
      const a = this.__v_raw
      return (!e && mt(Pe(a), 'iterate', wo), a.size)
    },
    has(a) {
      const i = this.__v_raw,
        l = Pe(i),
        r = Pe(a)
      return (
        e || (dn(a, r) && mt(l, 'has', a), mt(l, 'has', r)),
        a === r ? i.has(a) : i.has(a) || i.has(r)
      )
    },
    forEach(a, i) {
      const l = this,
        r = l.__v_raw,
        s = Pe(r),
        c = t ? Lr : e ? Jo : Zt
      return (!e && mt(s, 'iterate', wo), r.forEach((u, d) => a.call(i, c(u), c(d), l)))
    }
  }
  return (
    at(
      n,
      e
        ? { add: ui('add'), set: ui('set'), delete: ui('delete'), clear: ui('clear') }
        : {
            add(a) {
              const i = Pe(this),
                l = ci(i),
                r = Pe(a),
                s = !t && !Pt(a) && !Dn(a) ? r : a
              return (
                l.has.call(i, s) ||
                  (dn(a, s) && l.has.call(i, a)) ||
                  (dn(r, s) && l.has.call(i, r)) ||
                  (i.add(s), An(i, 'add', s, s)),
                this
              )
            },
            set(a, i) {
              !t && !Pt(i) && !Dn(i) && (i = Pe(i))
              const l = Pe(this),
                { has: r, get: s } = ci(l)
              let c = r.call(l, a)
              c || ((a = Pe(a)), (c = r.call(l, a)))
              const u = s.call(l, a)
              return (l.set(a, i), c ? dn(i, u) && An(l, 'set', a, i) : An(l, 'add', a, i), this)
            },
            delete(a) {
              const i = Pe(this),
                { has: l, get: r } = ci(i)
              let s = l.call(i, a)
              ;(s || ((a = Pe(a)), (s = l.call(i, a))), r && r.call(i, a))
              const c = i.delete(a)
              return (s && An(i, 'delete', a, void 0), c)
            },
            clear() {
              const a = Pe(this),
                i = a.size !== 0,
                l = a.clear()
              return (i && An(a, 'clear', void 0, void 0), l)
            }
          }
    ),
    ['keys', 'values', 'entries', Symbol.iterator].forEach(a => {
      n[a] = fy(a, e, t)
    }),
    n
  )
}
function Cs(e, t) {
  const n = hy(e, t)
  return (o, a, i) =>
    a === '__v_isReactive'
      ? !e
      : a === '__v_isReadonly'
        ? e
        : a === '__v_raw'
          ? o
          : Reflect.get(De(n, a) && a in o ? n : o, a, i)
}
const my = { get: Cs(!1, !1) },
  gy = { get: Cs(!1, !0) },
  vy = { get: Cs(!0, !1) }
const Xd = new WeakMap(),
  Zd = new WeakMap(),
  Jd = new WeakMap(),
  by = new WeakMap()
function yy(e) {
  switch (e) {
    case 'Object':
    case 'Array':
      return 1
    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeakSet':
      return 2
    default:
      return 0
  }
}
function He(e) {
  return Dn(e) ? e : _s(e, !1, cy, my, Xd)
}
function Qd(e) {
  return _s(e, !1, dy, gy, Zd)
}
function Nr(e) {
  return _s(e, !0, uy, vy, Jd)
}
function _s(e, t, n, o, a) {
  if (!$e(e) || (e.__v_raw && !(t && e.__v_isReactive)) || e.__v_skip || !Object.isExtensible(e))
    return e
  const i = a.get(e)
  if (i) return i
  const l = yy(Fb(e))
  if (l === 0) return e
  const r = new Proxy(e, l === 2 ? o : n)
  return (a.set(e, r), r)
}
function On(e) {
  return Dn(e) ? On(e.__v_raw) : !!(e && e.__v_isReactive)
}
function Dn(e) {
  return !!(e && e.__v_isReadonly)
}
function Pt(e) {
  return !!(e && e.__v_isShallow)
}
function Cl(e) {
  return e ? !!e.__v_raw : !1
}
function Pe(e) {
  const t = e && e.__v_raw
  return t ? Pe(t) : e
}
function Ts(e) {
  return (!De(e, '__v_skip') && Object.isExtensible(e) && Rd(e, '__v_skip', !0), e)
}
const Zt = e => ($e(e) ? He(e) : e),
  Jo = e => ($e(e) ? Nr(e) : e)
function Ue(e) {
  return e ? e.__v_isRef === !0 : !1
}
function M(e) {
  return ef(e, !1)
}
function py(e) {
  return ef(e, !0)
}
function ef(e, t) {
  return Ue(e) ? e : new wy(e, t)
}
class wy {
  constructor(t, n) {
    ;((this.dep = new Ss()),
      (this.__v_isRef = !0),
      (this.__v_isShallow = !1),
      (this._rawValue = n ? t : Pe(t)),
      (this._value = n ? t : Zt(t)),
      (this.__v_isShallow = n))
  }
  get value() {
    return (this.dep.track(), this._value)
  }
  set value(t) {
    const n = this._rawValue,
      o = this.__v_isShallow || Pt(t) || Dn(t)
    ;((t = o ? t : Pe(t)),
      dn(t, n) && ((this._rawValue = t), (this._value = o ? t : Zt(t)), this.dep.trigger()))
  }
}
function Vt(e) {
  return Ue(e) ? e.value : e
}
const xy = {
  get: (e, t, n) => (t === '__v_raw' ? e : Vt(Reflect.get(e, t, n))),
  set: (e, t, n, o) => {
    const a = e[t]
    return Ue(a) && !Ue(n) ? ((a.value = n), !0) : Reflect.set(e, t, n, o)
  }
}
function tf(e) {
  return On(e) ? e : new Proxy(e, xy)
}
function Sy(e) {
  const t = ve(e) ? new Array(e.length) : {}
  for (const n in e) t[n] = _y(e, n)
  return t
}
class Cy {
  constructor(t, n, o) {
    ;((this._object = t),
      (this._defaultValue = o),
      (this.__v_isRef = !0),
      (this._value = void 0),
      (this._key = It(n) ? n : String(n)),
      (this._raw = Pe(t)))
    let a = !0,
      i = t
    if (!ve(t) || It(this._key) || !gl(this._key))
      do a = !Cl(i) || Pt(i)
      while (a && (i = i.__v_raw))
    this._shallow = a
  }
  get value() {
    let t = this._object[this._key]
    return (this._shallow && (t = Vt(t)), (this._value = t === void 0 ? this._defaultValue : t))
  }
  set value(t) {
    if (this._shallow && Ue(this._raw[this._key])) {
      const n = this._object[this._key]
      if (Ue(n)) {
        n.value = t
        return
      }
    }
    this._object[this._key] = t
  }
  get dep() {
    return oy(this._raw, this._key)
  }
}
function _y(e, t, n) {
  return new Cy(e, t, n)
}
class Ty {
  constructor(t, n, o) {
    ;((this.fn = t),
      (this.setter = n),
      (this._value = void 0),
      (this.dep = new Ss(this)),
      (this.__v_isRef = !0),
      (this.deps = void 0),
      (this.depsTail = void 0),
      (this.flags = 16),
      (this.globalVersion = za - 1),
      (this.next = void 0),
      (this.effect = this),
      (this.__v_isReadonly = !n),
      (this.isSSR = o))
  }
  notify() {
    if (((this.flags |= 16), !(this.flags & 8) && Ne !== this)) return (Hd(this, !0), !0)
  }
  get value() {
    const t = this.dep.track()
    return (Wd(this), t && (t.version = this.dep.version), this._value)
  }
  set value(t) {
    this.setter && this.setter(t)
  }
}
function Ey(e, t, n = !1) {
  let o, a
  return (xe(e) ? (o = e) : ((o = e.get), (a = e.set)), new Ty(o, a, n))
}
const di = {},
  Hi = new WeakMap()
let go
function ky(e, t = !1, n = go) {
  if (n) {
    let o = Hi.get(n)
    ;(o || Hi.set(n, (o = [])), o.push(e))
  }
}
function Ay(e, t, n = Le) {
  const { immediate: o, deep: a, once: i, scheduler: l, augmentJob: r, call: s } = n,
    c = S => (a ? S : Pt(S) || a === !1 || a === 0 ? Pn(S, 1) : Pn(S))
  let u,
    d,
    h,
    m,
    y = !1,
    p = !1
  if (
    (Ue(e)
      ? ((d = () => e.value), (y = Pt(e)))
      : On(e)
        ? ((d = () => c(e)), (y = !0))
        : ve(e)
          ? ((p = !0),
            (y = e.some(S => On(S) || Pt(S))),
            (d = () =>
              e.map(S => {
                if (Ue(S)) return S.value
                if (On(S)) return c(S)
                if (xe(S)) return s ? s(S, 2) : S()
              })))
          : xe(e)
            ? t
              ? (d = s ? () => s(e, 2) : e)
              : (d = () => {
                  if (h) {
                    vn()
                    try {
                      h()
                    } finally {
                      bn()
                    }
                  }
                  const S = go
                  go = u
                  try {
                    return s ? s(e, 3, [m]) : e(m)
                  } finally {
                    go = S
                  }
                })
            : (d = fn),
    t && a)
  ) {
    const S = d,
      v = a === !0 ? 1 / 0 : a
    d = () => Pn(S(), v)
  }
  const b = Ld(),
    x = () => {
      ;(u.stop(), b && b.active && ys(b.effects, u))
    }
  if (i && t) {
    const S = t
    t = (...v) => {
      const _ = S(...v)
      return (x(), _)
    }
  }
  let g = p ? new Array(e.length).fill(di) : di
  const C = S => {
    if (!(!(u.flags & 1) || (!u.dirty && !S)))
      if (t) {
        const v = u.run()
        if (S || a || y || (p ? v.some((_, P) => dn(_, g[P])) : dn(v, g))) {
          h && h()
          const _ = go
          go = u
          try {
            const P = [v, g === di ? void 0 : p && g[0] === di ? [] : g, m]
            ;((g = v), s ? s(t, 3, P) : t(...P))
          } finally {
            go = _
          }
        }
      } else u.run()
  }
  return (
    r && r(C),
    (u = new Nd(d)),
    (u.scheduler = l ? () => l(C, !1) : C),
    (m = S => ky(S, !1, u)),
    (h = u.onStop =
      () => {
        const S = Hi.get(u)
        if (S) {
          if (s) s(S, 4)
          else for (const v of S) v()
          Hi.delete(u)
        }
      }),
    t ? (o ? C(!0) : (g = u.run())) : l ? l(C.bind(null, !0), !0) : u.run(),
    (x.pause = u.pause.bind(u)),
    (x.resume = u.resume.bind(u)),
    (x.stop = x),
    x
  )
}
function Pn(e, t = 1 / 0, n) {
  if (t <= 0 || !$e(e) || e.__v_skip || ((n = n || new Map()), (n.get(e) || 0) >= t)) return e
  if ((n.set(e, t), t--, Ue(e))) Pn(e.value, t, n)
  else if (ve(e)) for (let o = 0; o < e.length; o++) Pn(e[o], t, n)
  else if (ml(e) || Uo(e))
    e.forEach(o => {
      Pn(o, t, n)
    })
  else if (Od(e)) {
    for (const o in e) Pn(e[o], t, n)
    for (const o of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, o) && Pn(e[o], t, n)
  }
  return e
}
/**
 * @vue/runtime-core v3.5.39
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function ei(e, t, n, o) {
  try {
    return o ? e(...o) : e()
  } catch (a) {
    _l(a, t, n)
  }
}
function Nt(e, t, n, o) {
  if (xe(e)) {
    const a = ei(e, t, n, o)
    return (
      a &&
        Pd(a) &&
        a.catch(i => {
          _l(i, t, n)
        }),
      a
    )
  }
  if (ve(e)) {
    const a = []
    for (let i = 0; i < e.length; i++) a.push(Nt(e[i], t, n, o))
    return a
  }
}
function _l(e, t, n, o = !0) {
  const a = t ? t.vnode : null,
    { errorHandler: i, throwUnhandledErrorInProduction: l } = (t && t.appContext.config) || Le
  if (t) {
    let r = t.parent
    const s = t.proxy,
      c = `https://vuejs.org/error-reference/#runtime-${n}`
    for (; r;) {
      const u = r.ec
      if (u) {
        for (let d = 0; d < u.length; d++) if (u[d](e, s, c) === !1) return
      }
      r = r.parent
    }
    if (i) {
      ;(vn(), ei(i, null, 10, [e, s, c]), bn())
      return
    }
  }
  Py(e, n, a, o, l)
}
function Py(e, t, n, o = !0, a = !1) {
  if (a) throw e
  console.error(e)
}
const Ct = []
let sn = -1
const Yo = []
let Jn = null,
  zo = 0
const nf = Promise.resolve()
let zi = null
function Se(e) {
  const t = zi || nf
  return e ? t.then(this ? e.bind(this) : e) : t
}
function Iy(e) {
  let t = sn + 1,
    n = Ct.length
  for (; t < n;) {
    const o = (t + n) >>> 1,
      a = Ct[o],
      i = Wa(a)
    i < e || (i === e && a.flags & 2) ? (t = o + 1) : (n = o)
  }
  return t
}
function Es(e) {
  if (!(e.flags & 1)) {
    const t = Wa(e),
      n = Ct[Ct.length - 1]
    ;(!n || (!(e.flags & 2) && t >= Wa(n)) ? Ct.push(e) : Ct.splice(Iy(t), 0, e),
      (e.flags |= 1),
      of())
  }
}
function of() {
  zi || (zi = nf.then(lf))
}
function Oy(e) {
  ;(ve(e)
    ? Yo.push(...e)
    : Jn && e.id === -1
      ? Jn.splice(zo + 1, 0, e)
      : e.flags & 1 || (Yo.push(e), (e.flags |= 1)),
    of())
}
function xc(e, t, n = sn + 1) {
  for (; n < Ct.length; n++) {
    const o = Ct[n]
    if (o && o.flags & 2) {
      if (e && o.id !== e.uid) continue
      ;(Ct.splice(n, 1), n--, o.flags & 4 && (o.flags &= -2), o(), o.flags & 4 || (o.flags &= -2))
    }
  }
}
function af(e) {
  if (Yo.length) {
    const t = [...new Set(Yo)].sort((n, o) => Wa(n) - Wa(o))
    if (((Yo.length = 0), Jn)) {
      Jn.push(...t)
      return
    }
    for (Jn = t, zo = 0; zo < Jn.length; zo++) {
      const n = Jn[zo]
      ;(n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), (n.flags &= -2))
    }
    ;((Jn = null), (zo = 0))
  }
}
const Wa = e => (e.id == null ? (e.flags & 2 ? -1 : 1 / 0) : e.id)
function lf(e) {
  try {
    for (sn = 0; sn < Ct.length; sn++) {
      const t = Ct[sn]
      t &&
        !(t.flags & 8) &&
        (t.flags & 4 && (t.flags &= -2), ei(t, t.i, t.i ? 15 : 14), t.flags & 4 || (t.flags &= -2))
    }
  } finally {
    for (; sn < Ct.length; sn++) {
      const t = Ct[sn]
      t && (t.flags &= -2)
    }
    ;((sn = -1), (Ct.length = 0), af(), (zi = null), (Ct.length || Yo.length) && lf())
  }
}
let ut = null,
  rf = null
function ji(e) {
  const t = ut
  return ((ut = e), (rf = (e && e.type.__scopeId) || null), t)
}
function Fr(e, t = ut, n) {
  if (!t || e._n) return e
  const o = (...a) => {
    o._d && Gi(-1)
    const i = ji(t)
    let l
    try {
      l = e(...a)
    } finally {
      ;(ji(i), o._d && Gi(1))
    }
    return l
  }
  return ((o._n = !0), (o._c = !0), (o._d = !0), o)
}
function rt(e, t) {
  if (ut === null) return e
  const n = Al(ut),
    o = e.dirs || (e.dirs = [])
  for (let a = 0; a < t.length; a++) {
    let [i, l, r, s = Le] = t[a]
    i &&
      (xe(i) && (i = { mounted: i, updated: i }),
      i.deep && Pn(l),
      o.push({ dir: i, instance: n, value: l, oldValue: void 0, arg: r, modifiers: s }))
  }
  return e
}
function so(e, t, n, o) {
  const a = e.dirs,
    i = t && t.dirs
  for (let l = 0; l < a.length; l++) {
    const r = a[l]
    i && (r.oldValue = i[l].value)
    let s = r.dir[o]
    s && (vn(), Nt(s, n, 8, [e.el, r, e, t]), bn())
  }
}
function hn(e, t) {
  if (gt) {
    let n = gt.provides
    const o = gt.parent && gt.parent.provides
    ;(o === n && (n = gt.provides = Object.create(o)), (n[e] = t))
  }
}
function dt(e, t, n = !1) {
  const o = Et()
  if (o || xo) {
    let a = xo
      ? xo._context.provides
      : o
        ? o.parent == null || o.ce
          ? o.vnode.appContext && o.vnode.appContext.provides
          : o.parent.provides
        : void 0
    if (a && e in a) return a[e]
    if (arguments.length > 1) return n && xe(t) ? t.call(o && o.proxy) : t
  }
}
function Ry() {
  return !!(Et() || xo)
}
const Dy = Symbol.for('v-scx'),
  $y = () => dt(Dy)
function ra(e, t) {
  return ks(e, null, t)
}
function te(e, t, n) {
  return ks(e, t, n)
}
function ks(e, t, n = Le) {
  const { immediate: o, deep: a, flush: i, once: l } = n,
    r = at({}, n),
    s = (t && o) || (!t && i !== 'post')
  let c
  if (Ya) {
    if (i === 'sync') {
      const m = $y()
      c = m.__watcherHandles || (m.__watcherHandles = [])
    } else if (!s) {
      const m = () => {}
      return ((m.stop = fn), (m.resume = fn), (m.pause = fn), m)
    }
  }
  const u = gt
  r.call = (m, y, p) => Nt(m, u, y, p)
  let d = !1
  ;(i === 'post'
    ? (r.scheduler = m => {
        tt(m, u && u.suspense)
      })
    : i !== 'sync' &&
      ((d = !0),
      (r.scheduler = (m, y) => {
        y ? m() : Es(m)
      })),
    (r.augmentJob = m => {
      ;(t && (m.flags |= 4), d && ((m.flags |= 2), u && ((m.id = u.uid), (m.i = u))))
    }))
  const h = Ay(e, t, r)
  return (Ya && (c ? c.push(h) : s && h()), h)
}
function By(e, t, n) {
  const o = this.proxy,
    a = Me(e) ? (e.includes('.') ? sf(o, e) : () => o[e]) : e.bind(o, o)
  let i
  xe(t) ? (i = t) : ((i = t.handler), (n = t))
  const l = ni(this),
    r = ks(a, i.bind(o), n)
  return (l(), r)
}
function sf(e, t) {
  const n = t.split('.')
  return () => {
    let o = e
    for (let a = 0; a < n.length && o; a++) o = o[n[a]]
    return o
  }
}
const Xn = new WeakMap(),
  cf = Symbol('_vte'),
  uf = e => e.__isTeleport,
  vo = e => e && (e.disabled || e.disabled === ''),
  My = e => e && (e.defer || e.defer === ''),
  Sc = e => typeof SVGElement < 'u' && e instanceof SVGElement,
  Cc = e => typeof MathMLElement == 'function' && e instanceof MathMLElement,
  Hr = (e, t) => {
    const n = e && e.to
    return Me(n) ? (t ? t(n) : null) : n
  },
  Vy = {
    name: 'Teleport',
    __isTeleport: !0,
    process(e, t, n, o, a, i, l, r, s, c) {
      const {
          mc: u,
          pc: d,
          pbc: h,
          o: { insert: m, querySelector: y, createText: p, createComment: b, parentNode: x }
        } = c,
        g = vo(t.props)
      let { dynamicChildren: C } = t
      const S = (P, w, A) => {
          P.shapeFlag & 16 && u(P.children, w, A, a, i, l, r, s)
        },
        v = (P = t) => {
          const w = vo(P.props),
            A = (P.target = Hr(P.props, y)),
            O = zr(A, P, p, m)
          A &&
            (l !== 'svg' && Sc(A) ? (l = 'svg') : l !== 'mathml' && Cc(A) && (l = 'mathml'),
            a && a.isCE && (a.ce._teleportTargets || (a.ce._teleportTargets = new Set())).add(A),
            w || (S(P, A, O), ka(P, !1)))
        },
        _ = P => {
          const w = () => {
            if (Xn.get(P) === w) {
              if ((Xn.delete(P), vo(P.props))) {
                const A = x(P.el) || n
                ;(S(P, A, P.anchor), ka(P, !0))
              }
              v(P)
            }
          }
          ;(Xn.set(P, w), tt(w, i))
        }
      if (e == null) {
        const P = (t.el = p('')),
          w = (t.anchor = p(''))
        if ((m(P, n, o), m(w, n, o), My(t.props) || (i && i.pendingBranch))) {
          _(t)
          return
        }
        ;(g && (S(t, n, w), ka(t, !0)), v())
      } else {
        t.el = e.el
        const P = (t.anchor = e.anchor),
          w = Xn.get(e)
        if (w) {
          ;((w.flags |= 8), Xn.delete(e), _(t))
          return
        }
        t.targetStart = e.targetStart
        const A = (t.target = e.target),
          O = (t.targetAnchor = e.targetAnchor),
          I = vo(e.props),
          T = I ? n : A,
          D = I ? P : O
        if (
          (l === 'svg' || Sc(A) ? (l = 'svg') : (l === 'mathml' || Cc(A)) && (l = 'mathml'),
          C
            ? (h(e.dynamicChildren, C, T, a, i, l, r), Ds(e, t, !0))
            : s || d(e, t, T, D, a, i, l, r, !1),
          g)
        )
          I
            ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to)
            : fi(t, n, P, c, 1)
        else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
          const z = Hr(t.props, y)
          z && ((t.target = z), fi(t, z, null, c, 0))
        } else I && fi(t, A, O, c, 1)
        ka(t, g)
      }
    },
    remove(e, t, n, { um: o, o: { remove: a } }, i) {
      const {
          shapeFlag: l,
          children: r,
          anchor: s,
          targetStart: c,
          targetAnchor: u,
          target: d,
          props: h
        } = e,
        m = vo(h),
        y = i || !m,
        p = Xn.get(e)
      if (
        (p && ((p.flags |= 8), Xn.delete(e)),
        d && (a(c), a(u)),
        i && a(s),
        !p && (m || d) && l & 16)
      )
        for (let b = 0; b < r.length; b++) {
          const x = r[b]
          o(x, t, n, y, !!x.dynamicChildren)
        }
    },
    move: fi,
    hydrate: Ly
  }
function fi(e, t, n, { o: { insert: o }, m: a }, i = 2) {
  i === 0 && o(e.targetAnchor, t, n)
  const { el: l, anchor: r, shapeFlag: s, children: c, props: u } = e,
    d = i === 2
  if ((d && o(l, t, n), !Xn.has(e) && (!d || vo(u)) && s & 16))
    for (let h = 0; h < c.length; h++) a(c[h], t, n, 2)
  d && o(r, t, n)
}
function Ly(
  e,
  t,
  n,
  o,
  a,
  i,
  { o: { nextSibling: l, parentNode: r, querySelector: s, insert: c, createText: u } },
  d
) {
  function h(b, x) {
    let g = x
    for (; g;) {
      if (g && g.nodeType === 8) {
        if (g.data === 'teleport start anchor') t.targetStart = g
        else if (g.data === 'teleport anchor') {
          ;((t.targetAnchor = g), (b._lpa = t.targetAnchor && l(t.targetAnchor)))
          break
        }
      }
      g = l(g)
    }
  }
  function m(b, x) {
    x.anchor = d(l(b), x, r(b), n, o, a, i)
  }
  const y = (t.target = Hr(t.props, s)),
    p = vo(t.props)
  if (y) {
    const b = y._lpa || y.firstChild
    ;(t.shapeFlag & 16 &&
      (p
        ? (m(e, t), h(y, b), t.targetAnchor || zr(y, t, u, c, r(e) === y ? e : null))
        : ((t.anchor = l(e)),
          h(y, b),
          t.targetAnchor || zr(y, t, u, c),
          d(b && l(b), t, y, n, o, a, i))),
      ka(t, p))
  } else p && t.shapeFlag & 16 && (m(e, t), (t.targetStart = e), (t.targetAnchor = l(e)))
  return t.anchor && l(t.anchor)
}
const Eo = Vy
function ka(e, t) {
  const n = e.ctx
  if (n && n.ut) {
    let o, a
    for (
      t ? ((o = e.el), (a = e.anchor)) : ((o = e.targetStart), (a = e.targetAnchor));
      o && o !== a;
    )
      (o.nodeType === 1 && o.setAttribute('data-v-owner', n.uid), (o = o.nextSibling))
    n.ut()
  }
}
function zr(e, t, n, o, a = null) {
  const i = (t.targetStart = n('')),
    l = (t.targetAnchor = n(''))
  return ((i[cf] = l), e && (o(i, e, a), o(l, e, a)), l)
}
const Mt = Symbol('_leaveCb'),
  ga = Symbol('_enterCb')
function Ny() {
  const e = { isMounted: !1, isLeaving: !1, isUnmounting: !1, leavingVNodes: new Map() }
  return (
    We(() => {
      e.isMounted = !0
    }),
    en(() => {
      e.isUnmounting = !0
    }),
    e
  )
}
const Rt = [Function, Array],
  df = {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    onBeforeEnter: Rt,
    onEnter: Rt,
    onAfterEnter: Rt,
    onEnterCancelled: Rt,
    onBeforeLeave: Rt,
    onLeave: Rt,
    onAfterLeave: Rt,
    onLeaveCancelled: Rt,
    onBeforeAppear: Rt,
    onAppear: Rt,
    onAfterAppear: Rt,
    onAppearCancelled: Rt
  },
  ff = e => {
    const t = e.subTree
    return t.component ? ff(t.component) : t
  },
  Fy = {
    name: 'BaseTransition',
    props: df,
    setup(e, { slots: t }) {
      const n = Et(),
        o = Ny()
      return () => {
        const a = t.default && gf(t.default(), !0),
          i = a && a.length ? hf(a) : n.subTree ? P0() : void 0
        if (!i) return
        const l = Pe(e),
          { mode: r } = l
        if (o.isLeaving) return nr(i)
        const s = _c(i)
        if (!s) return nr(i)
        let c = jr(s, l, o, n, d => (c = d))
        s.type !== ot && Qo(s, c)
        let u = n.subTree && _c(n.subTree)
        if (u && u.type !== ot && !eo(u, s) && ff(n).type !== ot) {
          let d = jr(u, l, o, n)
          if ((Qo(u, d), r === 'out-in' && s.type !== ot))
            return (
              (o.isLeaving = !0),
              (d.afterLeave = () => {
                ;((o.isLeaving = !1),
                  n.job.flags & 8 || n.update(),
                  delete d.afterLeave,
                  (u = void 0))
              }),
              nr(i)
            )
          r === 'in-out' && s.type !== ot
            ? (d.delayLeave = (h, m, y) => {
                const p = mf(o, u)
                ;((p[String(u.key)] = u),
                  (h[Mt] = () => {
                    ;(m(), (h[Mt] = void 0), delete c.delayedLeave, (u = void 0))
                  }),
                  (c.delayedLeave = () => {
                    ;(y(), delete c.delayedLeave, (u = void 0))
                  }))
              })
            : (u = void 0)
        } else u && (u = void 0)
        return i
      }
    }
  }
function hf(e) {
  let t = e[0]
  if (e.length > 1) {
    for (const n of e)
      if (n.type !== ot) {
        t = n
        break
      }
  }
  return t
}
const Hy = Fy
function mf(e, t) {
  const { leavingVNodes: n } = e
  let o = n.get(t.type)
  return (o || ((o = Object.create(null)), n.set(t.type, o)), o)
}
function jr(e, t, n, o, a) {
  const {
      appear: i,
      mode: l,
      persisted: r = !1,
      onBeforeEnter: s,
      onEnter: c,
      onAfterEnter: u,
      onEnterCancelled: d,
      onBeforeLeave: h,
      onLeave: m,
      onAfterLeave: y,
      onLeaveCancelled: p,
      onBeforeAppear: b,
      onAppear: x,
      onAfterAppear: g,
      onAppearCancelled: C
    } = t,
    S = String(e.key),
    v = mf(n, e),
    _ = (A, O) => {
      A && Nt(A, o, 9, O)
    },
    P = (A, O) => {
      const I = O[1]
      ;(_(A, O), ve(A) ? A.every(T => T.length <= 1) && I() : A.length <= 1 && I())
    },
    w = {
      mode: l,
      persisted: r,
      beforeEnter(A) {
        let O = s
        if (!n.isMounted)
          if (i) O = b || s
          else return
        A[Mt] && A[Mt](!0)
        const I = v[S]
        ;(I && eo(e, I) && I.el[Mt] && I.el[Mt](), _(O, [A]))
      },
      enter(A) {
        if (v[S] === e) return
        let O = c,
          I = u,
          T = d
        if (!n.isMounted)
          if (i) ((O = x || c), (I = g || u), (T = C || d))
          else return
        let D = !1
        A[ga] = oe => {
          D ||
            ((D = !0),
            oe ? _(T, [A]) : _(I, [A]),
            w.delayedLeave && w.delayedLeave(),
            (A[ga] = void 0))
        }
        const z = A[ga].bind(null, !1)
        O ? P(O, [A, z]) : z()
      },
      leave(A, O) {
        const I = String(e.key)
        if ((A[ga] && A[ga](!0), n.isUnmounting)) return O()
        _(h, [A])
        let T = !1
        A[Mt] = z => {
          T ||
            ((T = !0), O(), z ? _(p, [A]) : _(y, [A]), (A[Mt] = void 0), v[I] === e && delete v[I])
        }
        const D = A[Mt].bind(null, !1)
        ;((v[I] = e), m ? P(m, [A, D]) : D())
      },
      clone(A) {
        const O = jr(A, t, n, o, a)
        return (a && a(O), O)
      }
    }
  return w
}
function nr(e) {
  if (Tl(e)) return ((e = $n(e)), (e.children = null), e)
}
function _c(e) {
  if (!Tl(e)) return uf(e.type) && e.children ? hf(e.children) : e
  if (e.component) return e.component.subTree
  const { shapeFlag: t, children: n } = e
  if (n) {
    if (t & 16) return n[0]
    if (t & 32 && xe(n.default)) return n.default()
  }
}
function Qo(e, t) {
  e.shapeFlag & 6 && e.component
    ? ((e.transition = t), Qo(e.component.subTree, t))
    : e.shapeFlag & 128
      ? ((e.ssContent.transition = t.clone(e.ssContent)),
        (e.ssFallback.transition = t.clone(e.ssFallback)))
      : (e.transition = t)
}
function gf(e, t = !1, n) {
  let o = [],
    a = 0
  for (let i = 0; i < e.length; i++) {
    let l = e[i]
    const r = n == null ? l.key : String(n) + String(l.key != null ? l.key : i)
    l.type === qe
      ? (l.patchFlag & 128 && a++, (o = o.concat(gf(l.children, t, r))))
      : (t || l.type !== ot) && o.push(r != null ? $n(l, { key: r }) : l)
  }
  if (a > 1) for (let i = 0; i < o.length; i++) o[i].patchFlag = -2
  return o
}
function U(e, t) {
  return xe(e) ? at({ name: e.name }, t, { setup: e }) : e
}
function vf(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + '-', 0, 0]
}
function Tc(e, t) {
  let n
  return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable)
}
const Wi = new WeakMap()
function $a(e, t, n, o, a = !1) {
  if (ve(e)) {
    e.forEach((p, b) => $a(p, t && (ve(t) ? t[b] : t), n, o, a))
    return
  }
  if (no(o) && !a) {
    o.shapeFlag & 512 &&
      o.type.__asyncResolved &&
      o.component.subTree.component &&
      $a(e, t, n, o.component.subTree)
    return
  }
  const i = o.shapeFlag & 4 ? Al(o.component) : o.el,
    l = a ? null : i,
    { i: r, r: s } = e,
    c = t && t.r,
    u = r.refs === Le ? (r.refs = {}) : r.refs,
    d = r.setupState,
    h = Pe(d),
    m = d === Le ? Ad : p => (Tc(u, p) ? !1 : De(h, p)),
    y = (p, b) => !(b && Tc(u, b))
  if (c != null && c !== s) {
    if ((Ec(t), Me(c))) ((u[c] = null), m(c) && (d[c] = null))
    else if (Ue(c)) {
      const p = t
      ;(y(c, p.k) && (c.value = null), p.k && (u[p.k] = null))
    }
  }
  if (xe(s)) {
    vn()
    try {
      ei(s, r, 12, [l, u])
    } finally {
      bn()
    }
  } else {
    const p = Me(s),
      b = Ue(s)
    if (p || b) {
      const x = () => {
        if (e.f) {
          const g = p ? (m(s) ? d[s] : u[s]) : y() || !e.k ? s.value : u[e.k]
          if (a) ve(g) && ys(g, i)
          else if (ve(g)) g.includes(i) || g.push(i)
          else if (p) ((u[s] = [i]), m(s) && (d[s] = u[s]))
          else {
            const C = [i]
            ;(y(s, e.k) && (s.value = C), e.k && (u[e.k] = C))
          }
        } else
          p
            ? ((u[s] = l), m(s) && (d[s] = l))
            : b && (y(s, e.k) && (s.value = l), e.k && (u[e.k] = l))
      }
      if (l) {
        const g = () => {
          ;(x(), Wi.delete(e))
        }
        ;((g.id = -1), Wi.set(e, g), tt(g, n))
      } else (Ec(e), x())
    }
  }
}
function Ec(e) {
  const t = Wi.get(e)
  t && ((t.flags |= 8), Wi.delete(e))
}
pl().requestIdleCallback
pl().cancelIdleCallback
const no = e => !!e.type.__asyncLoader,
  Tl = e => e.type.__isKeepAlive,
  zy = {
    name: 'KeepAlive',
    __isKeepAlive: !0,
    props: {
      include: [String, RegExp, Array],
      exclude: [String, RegExp, Array],
      max: [String, Number]
    },
    setup(e, { slots: t }) {
      const n = Et(),
        o = n.ctx
      if (!o.renderer)
        return () => {
          const g = t.default && t.default()
          return g && g.length === 1 ? g[0] : g
        }
      const a = new Map(),
        i = new Set()
      let l = null
      const r = n.suspense,
        {
          renderer: {
            p: s,
            m: c,
            um: u,
            o: { createElement: d }
          }
        } = o,
        h = d('div')
      ;((o.activate = (g, C, S, v, _) => {
        const P = g.component
        ;(c(g, C, S, 0, r),
          s(P.vnode, g, C, S, P, r, v, g.slotScopeIds, _),
          tt(() => {
            ;((P.isDeactivated = !1), P.a && Ko(P.a))
            const w = g.props && g.props.onVnodeMounted
            w && Bt(w, P.parent, g)
          }, r))
      }),
        (o.deactivate = g => {
          const C = g.component
          ;(Ki(C.m),
            Ki(C.a),
            c(g, h, null, 1, r),
            tt(() => {
              C.da && Ko(C.da)
              const S = g.props && g.props.onVnodeUnmounted
              ;(S && Bt(S, C.parent, g), (C.isDeactivated = !0))
            }, r))
        }))
      function m(g) {
        ;(or(g), u(g, n, r, !0))
      }
      function y(g) {
        a.forEach((C, S) => {
          const v = qr(no(C) ? C.type.__asyncResolved || {} : C.type)
          v && !g(v) && p(S)
        })
      }
      function p(g) {
        const C = a.get(g)
        ;(C && (!l || !eo(C, l)) ? m(C) : l && or(l), a.delete(g), i.delete(g))
      }
      te(
        () => [e.include, e.exclude],
        ([g, C]) => {
          ;(g && y(S => Aa(g, S)), C && y(S => !Aa(C, S)))
        },
        { flush: 'post', deep: !0 }
      )
      let b = null
      const x = () => {
        b != null &&
          (Yi(n.subTree.type)
            ? tt(() => {
                a.set(b, hi(n.subTree))
              }, n.subTree.suspense)
            : a.set(b, hi(n.subTree)))
      }
      return (
        We(x),
        As(x),
        en(() => {
          a.forEach(g => {
            const { subTree: C, suspense: S } = n,
              v = hi(C)
            if (g.type === v.type && g.key === v.key) {
              or(v)
              const _ = v.component.da
              _ && tt(_, S)
              return
            }
            m(g)
          })
        }),
        () => {
          if (((b = null), !t.default)) return (l = null)
          const g = t.default(),
            C = g[0]
          if (g.length > 1) return ((l = null), g)
          if (!_o(C) || (!(C.shapeFlag & 4) && !(C.shapeFlag & 128))) return ((l = null), C)
          let S = hi(C)
          if (S.type === ot) return ((l = null), S)
          const v = S.type,
            _ = qr(no(S) ? S.type.__asyncResolved || {} : v),
            { include: P, exclude: w, max: A } = e
          if ((P && (!_ || !Aa(P, _))) || (w && _ && Aa(w, _)))
            return ((S.shapeFlag &= -257), (l = S), C)
          const O = S.key == null ? v : S.key,
            I = a.get(O)
          return (
            S.el && ((S = $n(S)), C.shapeFlag & 128 && (C.ssContent = S)),
            (b = O),
            I
              ? ((S.el = I.el),
                (S.component = I.component),
                S.transition && Qo(S, S.transition),
                (S.shapeFlag |= 512),
                i.delete(O),
                i.add(O))
              : (i.add(O), A && i.size > parseInt(A, 10) && p(i.values().next().value)),
            (S.shapeFlag |= 256),
            (l = S),
            Yi(C.type) ? C : S
          )
        }
      )
    }
  },
  lk = zy
function Aa(e, t) {
  return ve(e)
    ? e.some(n => Aa(n, t))
    : Me(e)
      ? e.split(',').includes(t)
      : Nb(e)
        ? ((e.lastIndex = 0), e.test(t))
        : !1
}
function yn(e, t) {
  bf(e, 'a', t)
}
function pn(e, t) {
  bf(e, 'da', t)
}
function bf(e, t, n = gt) {
  const o =
    e.__wdc ||
    (e.__wdc = () => {
      let a = n
      for (; a;) {
        if (a.isDeactivated) return
        a = a.parent
      }
      return e()
    })
  if ((El(t, o, n), n)) {
    let a = n.parent
    for (; a && a.parent;) (Tl(a.parent.vnode) && jy(o, t, n, a), (a = a.parent))
  }
}
function jy(e, t, n, o) {
  const a = El(t, e, o, !0)
  sa(() => {
    ys(o[t], a)
  }, n)
}
function or(e) {
  ;((e.shapeFlag &= -257), (e.shapeFlag &= -513))
}
function hi(e) {
  return e.shapeFlag & 128 ? e.ssContent : e
}
function El(e, t, n = gt, o = !1) {
  if (n) {
    const a = n[e] || (n[e] = []),
      i =
        t.__weh ||
        (t.__weh = (...l) => {
          vn()
          const r = ni(n),
            s = Nt(t, n, e, l)
          return (r(), bn(), s)
        })
    return (o ? a.unshift(i) : a.push(i), i)
  }
}
const Nn =
    e =>
    (t, n = gt) => {
      ;(!Ya || e === 'sp') && El(e, (...o) => t(...o), n)
    },
  Wy = Nn('bm'),
  We = Nn('m'),
  yf = Nn('bu'),
  As = Nn('u'),
  en = Nn('bum'),
  sa = Nn('um'),
  Uy = Nn('sp'),
  Ky = Nn('rtg'),
  Yy = Nn('rtc')
function Gy(e, t = gt) {
  El('ec', e, t)
}
const Ps = 'components',
  qy = 'directives'
function Xy(e, t) {
  return Is(Ps, e, !0, t) || e
}
const pf = Symbol.for('v-ndc')
function Zy(e) {
  return Me(e) ? Is(Ps, e, !1) || e : e || pf
}
function Jy(e) {
  return Is(qy, e)
}
function Is(e, t, n = !0, o = !1) {
  const a = ut || gt
  if (a) {
    const i = a.type
    if (e === Ps) {
      const r = qr(i, !1)
      if (r && (r === t || r === _t(t) || r === bl(_t(t)))) return i
    }
    const l = kc(a[e] || i[e], t) || kc(a.appContext[e], t)
    return !l && o ? i : l
  }
}
function kc(e, t) {
  return e && (e[t] || e[_t(t)] || e[bl(_t(t))])
}
function rk(e, t, n, o) {
  let a
  const i = n,
    l = ve(e)
  if (l || Me(e)) {
    const r = l && On(e)
    let s = !1,
      c = !1
    ;(r && ((s = !Pt(e)), (c = Dn(e)), (e = Sl(e))), (a = new Array(e.length)))
    for (let u = 0, d = e.length; u < d; u++)
      a[u] = t(s ? (c ? Jo(Zt(e[u])) : Zt(e[u])) : e[u], u, void 0, i)
  } else if (typeof e == 'number') {
    a = new Array(e)
    for (let r = 0; r < e; r++) a[r] = t(r + 1, r, void 0, i)
  } else if ($e(e))
    if (e[Symbol.iterator]) a = Array.from(e, (r, s) => t(r, s, void 0, i))
    else {
      const r = Object.keys(e)
      a = new Array(r.length)
      for (let s = 0, c = r.length; s < c; s++) {
        const u = r[s]
        a[s] = t(e[u], u, s, i)
      }
    }
  else a = []
  return a
}
function sk(e, t, n = {}, o, a) {
  if (ut.ce || (ut.parent && no(ut.parent) && ut.parent.ce)) {
    const c = Object.keys(n).length > 0
    return (Ua(), qi(qe, null, [f('slot', n, o)], c ? -2 : 64))
  }
  let i = e[t]
  ;(i && i._c && (i._d = !1), Ua())
  const l = i && wf(i(n)),
    r = n.key || (l && l.key),
    s = qi(
      qe,
      { key: (r && !It(r) ? r : `_${t}`) + (!l && o ? '_fb' : '') },
      l || [],
      l && e._ === 1 ? 64 : -2
    )
  return (i && i._c && (i._d = !0), s)
}
function wf(e) {
  return e.some(t => (_o(t) ? !(t.type === ot || (t.type === qe && !wf(t.children))) : !0))
    ? e
    : null
}
const Wr = e => (e ? (Nf(e) ? Al(e) : Wr(e.parent)) : null),
  Ba = at(Object.create(null), {
    $: e => e,
    $el: e => e.vnode.el,
    $data: e => e.data,
    $props: e => e.props,
    $attrs: e => e.attrs,
    $slots: e => e.slots,
    $refs: e => e.refs,
    $parent: e => Wr(e.parent),
    $root: e => Wr(e.root),
    $host: e => e.ce,
    $emit: e => e.emit,
    $options: e => Sf(e),
    $forceUpdate: e =>
      e.f ||
      (e.f = () => {
        Es(e.update)
      }),
    $nextTick: e => e.n || (e.n = Se.bind(e.proxy)),
    $watch: e => By.bind(e)
  }),
  ar = (e, t) => e !== Le && !e.__isScriptSetup && De(e, t),
  Qy = {
    get({ _: e }, t) {
      if (t === '__v_skip') return !0
      const { ctx: n, setupState: o, data: a, props: i, accessCache: l, type: r, appContext: s } = e
      if (t[0] !== '$') {
        const h = l[t]
        if (h !== void 0)
          switch (h) {
            case 1:
              return o[t]
            case 2:
              return a[t]
            case 4:
              return n[t]
            case 3:
              return i[t]
          }
        else {
          if (ar(o, t)) return ((l[t] = 1), o[t])
          if (a !== Le && De(a, t)) return ((l[t] = 2), a[t])
          if (De(i, t)) return ((l[t] = 3), i[t])
          if (n !== Le && De(n, t)) return ((l[t] = 4), n[t])
          Ur && (l[t] = 0)
        }
      }
      const c = Ba[t]
      let u, d
      if (c) return (t === '$attrs' && mt(e.attrs, 'get', ''), c(e))
      if ((u = r.__cssModules) && (u = u[t])) return u
      if (n !== Le && De(n, t)) return ((l[t] = 4), n[t])
      if (((d = s.config.globalProperties), De(d, t))) return d[t]
    },
    set({ _: e }, t, n) {
      const { data: o, setupState: a, ctx: i } = e
      return ar(a, t)
        ? ((a[t] = n), !0)
        : o !== Le && De(o, t)
          ? ((o[t] = n), !0)
          : De(e.props, t) || (t[0] === '$' && t.slice(1) in e)
            ? !1
            : ((i[t] = n), !0)
    },
    has(
      { _: { data: e, setupState: t, accessCache: n, ctx: o, appContext: a, props: i, type: l } },
      r
    ) {
      let s
      return !!(
        n[r] ||
        (e !== Le && r[0] !== '$' && De(e, r)) ||
        ar(t, r) ||
        De(i, r) ||
        De(o, r) ||
        De(Ba, r) ||
        De(a.config.globalProperties, r) ||
        ((s = l.__cssModules) && s[r])
      )
    },
    defineProperty(e, t, n) {
      return (
        n.get != null ? (e._.accessCache[t] = 0) : De(n, 'value') && this.set(e, t, n.value, null),
        Reflect.defineProperty(e, t, n)
      )
    }
  }
function Ac(e) {
  return ve(e) ? e.reduce((t, n) => ((t[n] = null), t), {}) : e
}
let Ur = !0
function e0(e) {
  const t = Sf(e),
    n = e.proxy,
    o = e.ctx
  ;((Ur = !1), t.beforeCreate && Pc(t.beforeCreate, e, 'bc'))
  const {
    data: a,
    computed: i,
    methods: l,
    watch: r,
    provide: s,
    inject: c,
    created: u,
    beforeMount: d,
    mounted: h,
    beforeUpdate: m,
    updated: y,
    activated: p,
    deactivated: b,
    beforeDestroy: x,
    beforeUnmount: g,
    destroyed: C,
    unmounted: S,
    render: v,
    renderTracked: _,
    renderTriggered: P,
    errorCaptured: w,
    serverPrefetch: A,
    expose: O,
    inheritAttrs: I,
    components: T,
    directives: D,
    filters: z
  } = t
  if ((c && t0(c, o, null), l))
    for (const ee in l) {
      const ae = l[ee]
      xe(ae) && (o[ee] = ae.bind(n))
    }
  if (a) {
    const ee = a.call(n, n)
    $e(ee) && (e.data = He(ee))
  }
  if (((Ur = !0), i))
    for (const ee in i) {
      const ae = i[ee],
        _e = xe(ae) ? ae.bind(n, n) : xe(ae.get) ? ae.get.bind(n, n) : fn,
        ke = !xe(ae) && xe(ae.set) ? ae.set.bind(n) : fn,
        re = B({ get: _e, set: ke })
      Object.defineProperty(o, ee, {
        enumerable: !0,
        configurable: !0,
        get: () => re.value,
        set: H => (re.value = H)
      })
    }
  if (r) for (const ee in r) xf(r[ee], o, n, ee)
  if (s) {
    const ee = xe(s) ? s.call(n) : s
    Reflect.ownKeys(ee).forEach(ae => {
      hn(ae, ee[ae])
    })
  }
  u && Pc(u, e, 'c')
  function L(ee, ae) {
    ve(ae) ? ae.forEach(_e => ee(_e.bind(n))) : ae && ee(ae.bind(n))
  }
  if (
    (L(Wy, d),
    L(We, h),
    L(yf, m),
    L(As, y),
    L(yn, p),
    L(pn, b),
    L(Gy, w),
    L(Yy, _),
    L(Ky, P),
    L(en, g),
    L(sa, S),
    L(Uy, A),
    ve(O))
  )
    if (O.length) {
      const ee = e.exposed || (e.exposed = {})
      O.forEach(ae => {
        Object.defineProperty(ee, ae, { get: () => n[ae], set: _e => (n[ae] = _e), enumerable: !0 })
      })
    } else e.exposed || (e.exposed = {})
  ;(v && e.render === fn && (e.render = v),
    I != null && (e.inheritAttrs = I),
    T && (e.components = T),
    D && (e.directives = D),
    A && vf(e))
}
function t0(e, t, n = fn) {
  ve(e) && (e = Kr(e))
  for (const o in e) {
    const a = e[o]
    let i
    ;($e(a)
      ? 'default' in a
        ? (i = dt(a.from || o, a.default, !0))
        : (i = dt(a.from || o))
      : (i = dt(a)),
      Ue(i)
        ? Object.defineProperty(t, o, {
            enumerable: !0,
            configurable: !0,
            get: () => i.value,
            set: l => (i.value = l)
          })
        : (t[o] = i))
  }
}
function Pc(e, t, n) {
  Nt(ve(e) ? e.map(o => o.bind(t.proxy)) : e.bind(t.proxy), t, n)
}
function xf(e, t, n, o) {
  let a = o.includes('.') ? sf(n, o) : () => n[o]
  if (Me(e)) {
    const i = t[e]
    xe(i) && te(a, i)
  } else if (xe(e)) te(a, e.bind(n))
  else if ($e(e))
    if (ve(e)) e.forEach(i => xf(i, t, n, o))
    else {
      const i = xe(e.handler) ? e.handler.bind(n) : t[e.handler]
      xe(i) && te(a, i, e)
    }
}
function Sf(e) {
  const t = e.type,
    { mixins: n, extends: o } = t,
    {
      mixins: a,
      optionsCache: i,
      config: { optionMergeStrategies: l }
    } = e.appContext,
    r = i.get(t)
  let s
  return (
    r
      ? (s = r)
      : !a.length && !n && !o
        ? (s = t)
        : ((s = {}), a.length && a.forEach(c => Ui(s, c, l, !0)), Ui(s, t, l)),
    $e(t) && i.set(t, s),
    s
  )
}
function Ui(e, t, n, o = !1) {
  const { mixins: a, extends: i } = t
  ;(i && Ui(e, i, n, !0), a && a.forEach(l => Ui(e, l, n, !0)))
  for (const l in t)
    if (!(o && l === 'expose')) {
      const r = n0[l] || (n && n[l])
      e[l] = r ? r(e[l], t[l]) : t[l]
    }
  return e
}
const n0 = {
  data: Ic,
  props: Oc,
  emits: Oc,
  methods: Pa,
  computed: Pa,
  beforeCreate: xt,
  created: xt,
  beforeMount: xt,
  mounted: xt,
  beforeUpdate: xt,
  updated: xt,
  beforeDestroy: xt,
  beforeUnmount: xt,
  destroyed: xt,
  unmounted: xt,
  activated: xt,
  deactivated: xt,
  errorCaptured: xt,
  serverPrefetch: xt,
  components: Pa,
  directives: Pa,
  watch: a0,
  provide: Ic,
  inject: o0
}
function Ic(e, t) {
  return t
    ? e
      ? function () {
          return at(xe(e) ? e.call(this, this) : e, xe(t) ? t.call(this, this) : t)
        }
      : t
    : e
}
function o0(e, t) {
  return Pa(Kr(e), Kr(t))
}
function Kr(e) {
  if (ve(e)) {
    const t = {}
    for (let n = 0; n < e.length; n++) t[e[n]] = e[n]
    return t
  }
  return e
}
function xt(e, t) {
  return e ? [...new Set([].concat(e, t))] : t
}
function Pa(e, t) {
  return e ? at(Object.create(null), e, t) : t
}
function Oc(e, t) {
  return e
    ? ve(e) && ve(t)
      ? [...new Set([...e, ...t])]
      : at(Object.create(null), Ac(e), Ac(t ?? {}))
    : t
}
function a0(e, t) {
  if (!e) return t
  if (!t) return e
  const n = at(Object.create(null), e)
  for (const o in t) n[o] = xt(e[o], t[o])
  return n
}
function Cf() {
  return {
    app: null,
    config: {
      isNativeTag: Ad,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null),
    optionsCache: new WeakMap(),
    propsCache: new WeakMap(),
    emitsCache: new WeakMap()
  }
}
let i0 = 0
function l0(e, t) {
  return function (o, a = null) {
    ;(xe(o) || (o = at({}, o)), a != null && !$e(a) && (a = null))
    const i = Cf(),
      l = new WeakSet(),
      r = []
    let s = !1
    const c = (i.app = {
      _uid: i0++,
      _component: o,
      _props: a,
      _container: null,
      _context: i,
      _instance: null,
      version: L0,
      get config() {
        return i.config
      },
      set config(u) {},
      use(u, ...d) {
        return (
          l.has(u) ||
            (u && xe(u.install) ? (l.add(u), u.install(c, ...d)) : xe(u) && (l.add(u), u(c, ...d))),
          c
        )
      },
      mixin(u) {
        return (i.mixins.includes(u) || i.mixins.push(u), c)
      },
      component(u, d) {
        return d ? ((i.components[u] = d), c) : i.components[u]
      },
      directive(u, d) {
        return d ? ((i.directives[u] = d), c) : i.directives[u]
      },
      mount(u, d, h) {
        if (!s) {
          const m = c._ceVNode || f(o, a)
          return (
            (m.appContext = i),
            h === !0 ? (h = 'svg') : h === !1 && (h = void 0),
            e(m, u, h),
            (s = !0),
            (c._container = u),
            (u.__vue_app__ = c),
            Al(m.component)
          )
        }
      },
      onUnmount(u) {
        r.push(u)
      },
      unmount() {
        s && (Nt(r, c._instance, 16), e(null, c._container), delete c._container.__vue_app__)
      },
      provide(u, d) {
        return ((i.provides[u] = d), c)
      },
      runWithContext(u) {
        const d = xo
        xo = c
        try {
          return u()
        } finally {
          xo = d
        }
      }
    })
    return c
  }
}
let xo = null
const r0 = (e, t) =>
  t === 'modelValue' || t === 'model-value'
    ? e.modelModifiers
    : e[`${t}Modifiers`] || e[`${_t(t)}Modifiers`] || e[`${Ln(t)}Modifiers`]
function s0(e, t, ...n) {
  if (e.isUnmounted) return
  const o = e.vnode.props || Le
  let a = n
  const i = t.startsWith('update:'),
    l = i && r0(o, t.slice(7))
  l && (l.trim && (a = n.map(u => (Me(u) ? u.trim() : u))), l.number && (a = n.map(yl)))
  let r,
    s = o[(r = Zl(t))] || o[(r = Zl(_t(t)))]
  ;(!s && i && (s = o[(r = Zl(Ln(t)))]), s && Nt(s, e, 6, a))
  const c = o[r + 'Once']
  if (c) {
    if (!e.emitted) e.emitted = {}
    else if (e.emitted[r]) return
    ;((e.emitted[r] = !0), Nt(c, e, 6, a))
  }
}
const c0 = new WeakMap()
function _f(e, t, n = !1) {
  const o = n ? c0 : t.emitsCache,
    a = o.get(e)
  if (a !== void 0) return a
  const i = e.emits
  let l = {},
    r = !1
  if (!xe(e)) {
    const s = c => {
      const u = _f(c, t, !0)
      u && ((r = !0), at(l, u))
    }
    ;(!n && t.mixins.length && t.mixins.forEach(s),
      e.extends && s(e.extends),
      e.mixins && e.mixins.forEach(s))
  }
  return !i && !r
    ? ($e(e) && o.set(e, null), null)
    : (ve(i) ? i.forEach(s => (l[s] = null)) : at(l, i), $e(e) && o.set(e, l), l)
}
function kl(e, t) {
  return !e || !fl(t)
    ? !1
    : ((t = t.slice(2)),
      (t = t === 'Once' ? t : t.replace(/Once$/, '')),
      De(e, t[0].toLowerCase() + t.slice(1)) || De(e, Ln(t)) || De(e, t))
}
function Rc(e) {
  const {
      type: t,
      vnode: n,
      proxy: o,
      withProxy: a,
      propsOptions: [i],
      slots: l,
      attrs: r,
      emit: s,
      render: c,
      renderCache: u,
      props: d,
      data: h,
      setupState: m,
      ctx: y,
      inheritAttrs: p
    } = e,
    b = ji(e)
  let x, g
  try {
    if (n.shapeFlag & 4) {
      const S = a || o,
        v = S
      ;((x = un(c.call(v, S, u, d, m, h, y))), (g = r))
    } else {
      const S = t
      ;((x = un(S.length > 1 ? S(d, { attrs: r, slots: l, emit: s }) : S(d, null))),
        (g = t.props ? r : u0(r)))
    }
  } catch (S) {
    ;((Ma.length = 0), _l(S, e, 1), (x = f(ot)))
  }
  let C = x
  if (g && p !== !1) {
    const S = Object.keys(g),
      { shapeFlag: v } = C
    S.length && v & 7 && (i && S.some(hl) && (g = d0(g, i)), (C = $n(C, g, !1, !0)))
  }
  return (
    n.dirs && ((C = $n(C, null, !1, !0)), (C.dirs = C.dirs ? C.dirs.concat(n.dirs) : n.dirs)),
    n.transition && Qo(C, n.transition),
    (x = C),
    ji(b),
    x
  )
}
const u0 = e => {
    let t
    for (const n in e) (n === 'class' || n === 'style' || fl(n)) && ((t || (t = {}))[n] = e[n])
    return t
  },
  d0 = (e, t) => {
    const n = {}
    for (const o in e) (!hl(o) || !(o.slice(9) in t)) && (n[o] = e[o])
    return n
  }
function f0(e, t, n) {
  const { props: o, children: a, component: i } = e,
    { props: l, children: r, patchFlag: s } = t,
    c = i.emitsOptions
  if (t.dirs || t.transition) return !0
  if (n && s >= 0) {
    if (s & 1024) return !0
    if (s & 16) return o ? Dc(o, l, c) : !!l
    if (s & 8) {
      const u = t.dynamicProps
      for (let d = 0; d < u.length; d++) {
        const h = u[d]
        if (Tf(l, o, h) && !kl(c, h)) return !0
      }
    }
  } else
    return (a || r) && (!r || !r.$stable) ? !0 : o === l ? !1 : o ? (l ? Dc(o, l, c) : !0) : !!l
  return !1
}
function Dc(e, t, n) {
  const o = Object.keys(t)
  if (o.length !== Object.keys(e).length) return !0
  for (let a = 0; a < o.length; a++) {
    const i = o[a]
    if (Tf(t, e, i) && !kl(n, i)) return !0
  }
  return !1
}
function Tf(e, t, n) {
  const o = e[n],
    a = t[n]
  return n === 'style' && $e(o) && $e(a) ? !Qa(o, a) : o !== a
}
function h0({ vnode: e, parent: t, suspense: n }, o) {
  for (; t;) {
    const a = t.subTree
    if (
      (a.suspense && a.suspense.activeBranch === e && ((a.suspense.vnode.el = a.el = o), (e = a)),
      a === e)
    )
      (((e = t.vnode).el = o), (t = t.parent))
    else break
  }
  n && n.activeBranch === e && (n.vnode.el = o)
}
const Ef = {},
  kf = () => Object.create(Ef),
  Af = e => Object.getPrototypeOf(e) === Ef
function m0(e, t, n, o = !1) {
  const a = {},
    i = kf()
  ;((e.propsDefaults = Object.create(null)), Pf(e, t, a, i))
  for (const l in e.propsOptions[0]) l in a || (a[l] = void 0)
  ;(n ? (e.props = o ? a : Qd(a)) : e.type.props ? (e.props = a) : (e.props = i), (e.attrs = i))
}
function g0(e, t, n, o) {
  const {
      props: a,
      attrs: i,
      vnode: { patchFlag: l }
    } = e,
    r = Pe(a),
    [s] = e.propsOptions
  let c = !1
  if ((o || l > 0) && !(l & 16)) {
    if (l & 8) {
      const u = e.vnode.dynamicProps
      for (let d = 0; d < u.length; d++) {
        let h = u[d]
        if (kl(e.emitsOptions, h)) continue
        const m = t[h]
        if (s)
          if (De(i, h)) m !== i[h] && ((i[h] = m), (c = !0))
          else {
            const y = _t(h)
            a[y] = Yr(s, r, y, m, e, !1)
          }
        else m !== i[h] && ((i[h] = m), (c = !0))
      }
    }
  } else {
    Pf(e, t, a, i) && (c = !0)
    let u
    for (const d in r)
      (!t || (!De(t, d) && ((u = Ln(d)) === d || !De(t, u)))) &&
        (s
          ? n && (n[d] !== void 0 || n[u] !== void 0) && (a[d] = Yr(s, r, d, void 0, e, !0))
          : delete a[d])
    if (i !== r) for (const d in i) (!t || !De(t, d)) && (delete i[d], (c = !0))
  }
  c && An(e.attrs, 'set', '')
}
function Pf(e, t, n, o) {
  const [a, i] = e.propsOptions
  let l = !1,
    r
  if (t)
    for (let s in t) {
      if (Oa(s)) continue
      const c = t[s]
      let u
      a && De(a, (u = _t(s)))
        ? !i || !i.includes(u)
          ? (n[u] = c)
          : ((r || (r = {}))[u] = c)
        : kl(e.emitsOptions, s) || ((!(s in o) || c !== o[s]) && ((o[s] = c), (l = !0)))
    }
  if (i) {
    const s = Pe(n),
      c = r || Le
    for (let u = 0; u < i.length; u++) {
      const d = i[u]
      n[d] = Yr(a, s, d, c[d], e, !De(c, d))
    }
  }
  return l
}
function Yr(e, t, n, o, a, i) {
  const l = e[n]
  if (l != null) {
    const r = De(l, 'default')
    if (r && o === void 0) {
      const s = l.default
      if (l.type !== Function && !l.skipFactory && xe(s)) {
        const { propsDefaults: c } = a
        if (n in c) o = c[n]
        else {
          const u = ni(a)
          ;((o = c[n] = s.call(null, t)), u())
        }
      } else o = s
      a.ce && a.ce._setProp(n, o)
    }
    l[0] && (i && !r ? (o = !1) : l[1] && (o === '' || o === Ln(n)) && (o = !0))
  }
  return o
}
const v0 = new WeakMap()
function If(e, t, n = !1) {
  const o = n ? v0 : t.propsCache,
    a = o.get(e)
  if (a) return a
  const i = e.props,
    l = {},
    r = []
  let s = !1
  if (!xe(e)) {
    const u = d => {
      s = !0
      const [h, m] = If(d, t, !0)
      ;(at(l, h), m && r.push(...m))
    }
    ;(!n && t.mixins.length && t.mixins.forEach(u),
      e.extends && u(e.extends),
      e.mixins && e.mixins.forEach(u))
  }
  if (!i && !s) return ($e(e) && o.set(e, Wo), Wo)
  if (ve(i))
    for (let u = 0; u < i.length; u++) {
      const d = _t(i[u])
      $c(d) && (l[d] = Le)
    }
  else if (i)
    for (const u in i) {
      const d = _t(u)
      if ($c(d)) {
        const h = i[u],
          m = (l[d] = ve(h) || xe(h) ? { type: h } : at({}, h)),
          y = m.type
        let p = !1,
          b = !0
        if (ve(y))
          for (let x = 0; x < y.length; ++x) {
            const g = y[x],
              C = xe(g) && g.name
            if (C === 'Boolean') {
              p = !0
              break
            } else C === 'String' && (b = !1)
          }
        else p = xe(y) && y.name === 'Boolean'
        ;((m[0] = p), (m[1] = b), (p || De(m, 'default')) && r.push(d))
      }
    }
  const c = [l, r]
  return ($e(e) && o.set(e, c), c)
}
function $c(e) {
  return e[0] !== '$' && !Oa(e)
}
const Os = e => e === '_' || e === '_ctx' || e === '$stable',
  Rs = e => (ve(e) ? e.map(un) : [un(e)]),
  b0 = (e, t, n) => {
    if (t._n) return t
    const o = Fr((...a) => Rs(t(...a)), n)
    return ((o._c = !1), o)
  },
  Of = (e, t, n) => {
    const o = e._ctx
    for (const a in e) {
      if (Os(a)) continue
      const i = e[a]
      if (xe(i)) t[a] = b0(a, i, o)
      else if (i != null) {
        const l = Rs(i)
        t[a] = () => l
      }
    }
  },
  Rf = (e, t) => {
    const n = Rs(t)
    e.slots.default = () => n
  },
  Df = (e, t, n) => {
    for (const o in t) (n || !Os(o)) && (e[o] = t[o])
  },
  y0 = (e, t, n) => {
    const o = (e.slots = kf())
    if (e.vnode.shapeFlag & 32) {
      const a = t._
      a ? (Df(o, t, n), n && Rd(o, '_', a, !0)) : Of(t, o)
    } else t && Rf(e, t)
  },
  p0 = (e, t, n) => {
    const { vnode: o, slots: a } = e
    let i = !0,
      l = Le
    if (o.shapeFlag & 32) {
      const r = t._
      ;(r ? (n && r === 1 ? (i = !1) : Df(a, t, n)) : ((i = !t.$stable), Of(t, a)), (l = t))
    } else t && (Rf(e, t), (l = { default: 1 }))
    if (i) for (const r in a) !Os(r) && l[r] == null && delete a[r]
  },
  tt = _0
function w0(e) {
  return x0(e)
}
function x0(e, t) {
  const n = pl()
  n.__VUE__ = !0
  const {
      insert: o,
      remove: a,
      patchProp: i,
      createElement: l,
      createText: r,
      createComment: s,
      setText: c,
      setElementText: u,
      parentNode: d,
      nextSibling: h,
      setScopeId: m = fn,
      insertStaticContent: y
    } = e,
    p = (
      k,
      R,
      $,
      N = null,
      Y = null,
      W = null,
      ce = void 0,
      le = null,
      ie = !!R.dynamicChildren
    ) => {
      if (k === R) return
      ;(k && !eo(k, R) && ((N = E(k)), H(k, Y, W, !0), (k = null)),
        R.patchFlag === -2 && ((ie = !1), (R.dynamicChildren = null)))
      const { type: X, ref: be, shapeFlag: de } = R
      switch (X) {
        case ti:
          b(k, R, $, N)
          break
        case ot:
          x(k, R, $, N)
          break
        case $i:
          k == null && g(R, $, N, ce)
          break
        case qe:
          T(k, R, $, N, Y, W, ce, le, ie)
          break
        default:
          de & 1
            ? v(k, R, $, N, Y, W, ce, le, ie)
            : de & 6
              ? D(k, R, $, N, Y, W, ce, le, ie)
              : (de & 64 || de & 128) && X.process(k, R, $, N, Y, W, ce, le, ie, Q)
      }
      be != null && Y
        ? $a(be, k && k.ref, W, R || k, !R)
        : be == null && k && k.ref != null && $a(k.ref, null, W, k, !0)
    },
    b = (k, R, $, N) => {
      if (k == null) o((R.el = r(R.children)), $, N)
      else {
        const Y = (R.el = k.el)
        R.children !== k.children && c(Y, R.children)
      }
    },
    x = (k, R, $, N) => {
      k == null ? o((R.el = s(R.children || '')), $, N) : (R.el = k.el)
    },
    g = (k, R, $, N) => {
      ;[k.el, k.anchor] = y(k.children, R, $, N, k.el, k.anchor)
    },
    C = ({ el: k, anchor: R }, $, N) => {
      let Y
      for (; k && k !== R;) ((Y = h(k)), o(k, $, N), (k = Y))
      o(R, $, N)
    },
    S = ({ el: k, anchor: R }) => {
      let $
      for (; k && k !== R;) (($ = h(k)), a(k), (k = $))
      a(R)
    },
    v = (k, R, $, N, Y, W, ce, le, ie) => {
      if ((R.type === 'svg' ? (ce = 'svg') : R.type === 'math' && (ce = 'mathml'), k == null))
        _(R, $, N, Y, W, ce, le, ie)
      else {
        const X = k.el && k.el._isVueCE ? k.el : null
        try {
          ;(X && X._beginPatch(), A(k, R, Y, W, ce, le, ie))
        } finally {
          X && X._endPatch()
        }
      }
    },
    _ = (k, R, $, N, Y, W, ce, le) => {
      let ie, X
      const { props: be, shapeFlag: de, transition: ge, dirs: ye } = k
      if (
        ((ie = k.el = l(k.type, W, be && be.is, be)),
        de & 8 ? u(ie, k.children) : de & 16 && w(k.children, ie, null, N, Y, ir(k, W), ce, le),
        ye && so(k, null, N, 'created'),
        P(ie, k, k.scopeId, ce, N),
        be)
      ) {
        for (const Ve in be) Ve !== 'value' && !Oa(Ve) && i(ie, Ve, null, be[Ve], W, N)
        ;('value' in be && i(ie, 'value', null, be.value, W),
          (X = be.onVnodeBeforeMount) && Bt(X, N, k))
      }
      ye && so(k, null, N, 'beforeMount')
      const Ae = S0(Y, ge)
      ;(Ae && ge.beforeEnter(ie),
        o(ie, R, $),
        ((X = be && be.onVnodeMounted) || Ae || ye) &&
          tt(() => {
            try {
              ;(X && Bt(X, N, k), Ae && ge.enter(ie), ye && so(k, null, N, 'mounted'))
            } finally {
            }
          }, Y))
    },
    P = (k, R, $, N, Y) => {
      if (($ && m(k, $), N)) for (let W = 0; W < N.length; W++) m(k, N[W])
      if (Y) {
        let W = Y.subTree
        if (R === W || (Yi(W.type) && (W.ssContent === R || W.ssFallback === R))) {
          const ce = Y.vnode
          P(k, ce, ce.scopeId, ce.slotScopeIds, Y.parent)
        }
      }
    },
    w = (k, R, $, N, Y, W, ce, le, ie = 0) => {
      for (let X = ie; X < k.length; X++) {
        const be = (k[X] = le ? kn(k[X]) : un(k[X]))
        p(null, be, R, $, N, Y, W, ce, le)
      }
    },
    A = (k, R, $, N, Y, W, ce) => {
      const le = (R.el = k.el)
      let { patchFlag: ie, dynamicChildren: X, dirs: be } = R
      ie |= k.patchFlag & 16
      const de = k.props || Le,
        ge = R.props || Le
      let ye
      if (
        ($ && co($, !1),
        (ye = ge.onVnodeBeforeUpdate) && Bt(ye, $, R, k),
        be && so(R, k, $, 'beforeUpdate'),
        $ && co($, !0),
        X &&
          (!k.dynamicChildren || k.dynamicChildren.length !== X.length) &&
          ((ie = 0), (ce = !1), (X = null)),
        ((de.innerHTML && ge.innerHTML == null) || (de.textContent && ge.textContent == null)) &&
          u(le, ''),
        X
          ? O(k.dynamicChildren, X, le, $, N, ir(R, Y), W)
          : ce || ae(k, R, le, null, $, N, ir(R, Y), W, !1),
        ie > 0)
      ) {
        if (ie & 16) I(le, de, ge, $, Y)
        else if (
          (ie & 2 && de.class !== ge.class && i(le, 'class', null, ge.class, Y),
          ie & 4 && i(le, 'style', de.style, ge.style, Y),
          ie & 8)
        ) {
          const Ae = R.dynamicProps
          for (let Ve = 0; Ve < Ae.length; Ve++) {
            const Be = Ae[Ve],
              Ze = de[Be],
              ct = ge[Be]
            ;(ct !== Ze || Be === 'value') && i(le, Be, Ze, ct, Y, $)
          }
        }
        ie & 1 && k.children !== R.children && u(le, R.children)
      } else !ce && X == null && I(le, de, ge, $, Y)
      ;((ye = ge.onVnodeUpdated) || be) &&
        tt(() => {
          ;(ye && Bt(ye, $, R, k), be && so(R, k, $, 'updated'))
        }, N)
    },
    O = (k, R, $, N, Y, W, ce) => {
      for (let le = 0; le < R.length; le++) {
        const ie = k[le],
          X = R[le],
          be = ie.el && (ie.type === qe || !eo(ie, X) || ie.shapeFlag & 198) ? d(ie.el) : $
        p(ie, X, be, null, N, Y, W, ce, !0)
      }
    },
    I = (k, R, $, N, Y) => {
      if (R !== $) {
        if (R !== Le) for (const W in R) !Oa(W) && !(W in $) && i(k, W, R[W], null, Y, N)
        for (const W in $) {
          if (Oa(W)) continue
          const ce = $[W],
            le = R[W]
          ce !== le && W !== 'value' && i(k, W, le, ce, Y, N)
        }
        'value' in $ && i(k, 'value', R.value, $.value, Y)
      }
    },
    T = (k, R, $, N, Y, W, ce, le, ie) => {
      const X = (R.el = k ? k.el : r('')),
        be = (R.anchor = k ? k.anchor : r(''))
      let { patchFlag: de, dynamicChildren: ge, slotScopeIds: ye } = R
      ;(ye && (le = le ? le.concat(ye) : ye),
        k == null
          ? (o(X, $, N), o(be, $, N), w(R.children || [], $, be, Y, W, ce, le, ie))
          : de > 0 && de & 64 && ge && k.dynamicChildren && k.dynamicChildren.length === ge.length
            ? (O(k.dynamicChildren, ge, $, Y, W, ce, le),
              (R.key != null || (Y && R === Y.subTree)) && Ds(k, R, !0))
            : ae(k, R, $, be, Y, W, ce, le, ie))
    },
    D = (k, R, $, N, Y, W, ce, le, ie) => {
      ;((R.slotScopeIds = le),
        k == null
          ? R.shapeFlag & 512
            ? Y.ctx.activate(R, $, N, ce, ie)
            : z(R, $, N, Y, W, ce, ie)
          : oe(k, R, ie))
    },
    z = (k, R, $, N, Y, W, ce) => {
      const le = (k.component = R0(k, N, Y))
      if ((Tl(k) && (le.ctx.renderer = Q), D0(le, !1, ce), le.asyncDep)) {
        if ((Y && Y.registerDep(le, L, ce), !k.el)) {
          const ie = (le.subTree = f(ot))
          ;(x(null, ie, R, $), (k.placeholder = ie.el))
        }
      } else L(le, k, R, $, Y, W, ce)
    },
    oe = (k, R, $) => {
      const N = (R.component = k.component)
      if (f0(k, R, $))
        if (N.asyncDep && !N.asyncResolved) {
          ee(N, R, $)
          return
        } else ((N.next = R), N.update())
      else ((R.el = k.el), (N.vnode = R))
    },
    L = (k, R, $, N, Y, W, ce) => {
      const le = () => {
        if (k.isMounted) {
          let { next: de, bu: ge, u: ye, parent: Ae, vnode: Ve } = k
          {
            const on = $f(k)
            if (on) {
              ;(de && ((de.el = Ve.el), ee(k, de, ce)),
                on.asyncDep.then(() => {
                  tt(() => {
                    k.isUnmounted || X()
                  }, Y)
                }))
              return
            }
          }
          let Be = de,
            Ze
          ;(co(k, !1),
            de ? ((de.el = Ve.el), ee(k, de, ce)) : (de = Ve),
            ge && Ko(ge),
            (Ze = de.props && de.props.onVnodeBeforeUpdate) && Bt(Ze, Ae, de, Ve),
            co(k, !0))
          const ct = Rc(k),
            nn = k.subTree
          ;((k.subTree = ct),
            p(nn, ct, d(nn.el), E(nn), k, Y, W),
            (de.el = ct.el),
            Be === null && h0(k, ct.el),
            ye && tt(ye, Y),
            (Ze = de.props && de.props.onVnodeUpdated) && tt(() => Bt(Ze, Ae, de, Ve), Y))
        } else {
          let de
          const { el: ge, props: ye } = R,
            { bm: Ae, m: Ve, parent: Be, root: Ze, type: ct } = k,
            nn = no(R)
          ;(co(k, !1),
            Ae && Ko(Ae),
            !nn && (de = ye && ye.onVnodeBeforeMount) && Bt(de, Be, R),
            co(k, !0))
          {
            Ze.ce &&
              Ze.ce._hasShadowRoot() &&
              Ze.ce._injectChildStyle(ct, k.parent ? k.parent.type : void 0)
            const on = (k.subTree = Rc(k))
            ;(p(null, on, $, N, k, Y, W), (R.el = on.el))
          }
          if ((Ve && tt(Ve, Y), !nn && (de = ye && ye.onVnodeMounted))) {
            const on = R
            tt(() => Bt(de, Be, on), Y)
          }
          ;((R.shapeFlag & 256 || (Be && no(Be.vnode) && Be.vnode.shapeFlag & 256)) &&
            k.a &&
            tt(k.a, Y),
            (k.isMounted = !0),
            (R = $ = N = null))
        }
      }
      k.scope.on()
      const ie = (k.effect = new Nd(le))
      k.scope.off()
      const X = (k.update = ie.run.bind(ie)),
        be = (k.job = ie.runIfDirty.bind(ie))
      ;((be.i = k), (be.id = k.uid), (ie.scheduler = () => Es(be)), co(k, !0), X())
    },
    ee = (k, R, $) => {
      R.component = k
      const N = k.vnode.props
      ;((k.vnode = R),
        (k.next = null),
        g0(k, R.props, N, $),
        p0(k, R.children, $),
        vn(),
        xc(k),
        bn())
    },
    ae = (k, R, $, N, Y, W, ce, le, ie = !1) => {
      const X = k && k.children,
        be = k ? k.shapeFlag : 0,
        de = R.children,
        { patchFlag: ge, shapeFlag: ye } = R
      if (ge > 0) {
        if (ge & 128) {
          ke(X, de, $, N, Y, W, ce, le, ie)
          return
        } else if (ge & 256) {
          _e(X, de, $, N, Y, W, ce, le, ie)
          return
        }
      }
      ye & 8
        ? (be & 16 && ue(X, Y, W), de !== X && u($, de))
        : be & 16
          ? ye & 16
            ? ke(X, de, $, N, Y, W, ce, le, ie)
            : ue(X, Y, W, !0)
          : (be & 8 && u($, ''), ye & 16 && w(de, $, N, Y, W, ce, le, ie))
    },
    _e = (k, R, $, N, Y, W, ce, le, ie) => {
      ;((k = k || Wo), (R = R || Wo))
      const X = k.length,
        be = R.length,
        de = Math.min(X, be)
      let ge
      for (ge = 0; ge < de; ge++) {
        const ye = (R[ge] = ie ? kn(R[ge]) : un(R[ge]))
        p(k[ge], ye, $, null, Y, W, ce, le, ie)
      }
      X > be ? ue(k, Y, W, !0, !1, de) : w(R, $, N, Y, W, ce, le, ie, de)
    },
    ke = (k, R, $, N, Y, W, ce, le, ie) => {
      let X = 0
      const be = R.length
      let de = k.length - 1,
        ge = be - 1
      for (; X <= de && X <= ge;) {
        const ye = k[X],
          Ae = (R[X] = ie ? kn(R[X]) : un(R[X]))
        if (eo(ye, Ae)) p(ye, Ae, $, null, Y, W, ce, le, ie)
        else break
        X++
      }
      for (; X <= de && X <= ge;) {
        const ye = k[de],
          Ae = (R[ge] = ie ? kn(R[ge]) : un(R[ge]))
        if (eo(ye, Ae)) p(ye, Ae, $, null, Y, W, ce, le, ie)
        else break
        ;(de--, ge--)
      }
      if (X > de) {
        if (X <= ge) {
          const ye = ge + 1,
            Ae = ye < be ? R[ye].el : N
          for (; X <= ge;)
            (p(null, (R[X] = ie ? kn(R[X]) : un(R[X])), $, Ae, Y, W, ce, le, ie), X++)
        }
      } else if (X > ge) for (; X <= de;) (H(k[X], Y, W, !0), X++)
      else {
        const ye = X,
          Ae = X,
          Ve = new Map()
        for (X = Ae; X <= ge; X++) {
          const kt = (R[X] = ie ? kn(R[X]) : un(R[X]))
          kt.key != null && Ve.set(kt.key, X)
        }
        let Be,
          Ze = 0
        const ct = ge - Ae + 1
        let nn = !1,
          on = 0
        const ha = new Array(ct)
        for (X = 0; X < ct; X++) ha[X] = 0
        for (X = ye; X <= de; X++) {
          const kt = k[X]
          if (Ze >= ct) {
            H(kt, Y, W, !0)
            continue
          }
          let an
          if (kt.key != null) an = Ve.get(kt.key)
          else
            for (Be = Ae; Be <= ge; Be++)
              if (ha[Be - Ae] === 0 && eo(kt, R[Be])) {
                an = Be
                break
              }
          an === void 0
            ? H(kt, Y, W, !0)
            : ((ha[an - Ae] = X + 1),
              an >= on ? (on = an) : (nn = !0),
              p(kt, R[an], $, null, Y, W, ce, le, ie),
              Ze++)
        }
        const mc = nn ? C0(ha) : Wo
        for (Be = mc.length - 1, X = ct - 1; X >= 0; X--) {
          const kt = Ae + X,
            an = R[kt],
            gc = R[kt + 1],
            vc = kt + 1 < be ? gc.el || Bf(gc) : N
          ha[X] === 0
            ? p(null, an, $, vc, Y, W, ce, le, ie)
            : nn && (Be < 0 || X !== mc[Be] ? re(an, $, vc, 2) : Be--)
        }
      }
    },
    re = (k, R, $, N, Y = null) => {
      const { el: W, type: ce, transition: le, children: ie, shapeFlag: X } = k
      if (X & 6) {
        re(k.component.subTree, R, $, N)
        return
      }
      if (X & 128) {
        k.suspense.move(R, $, N)
        return
      }
      if (X & 64) {
        ce.move(k, R, $, Q)
        return
      }
      if (ce === qe) {
        o(W, R, $)
        for (let de = 0; de < ie.length; de++) re(ie[de], R, $, N)
        o(k.anchor, R, $)
        return
      }
      if (ce === $i) {
        C(k, R, $)
        return
      }
      if (N !== 2 && X & 1 && le)
        if (N === 0)
          le.persisted && !W[Mt]
            ? o(W, R, $)
            : (le.beforeEnter(W), o(W, R, $), tt(() => le.enter(W), Y))
        else {
          const { leave: de, delayLeave: ge, afterLeave: ye } = le,
            Ae = () => {
              k.ctx.isUnmounted ? a(W) : o(W, R, $)
            },
            Ve = () => {
              const Be = W._isLeaving || !!W[Mt]
              ;(W._isLeaving && W[Mt](!0),
                le.persisted && !Be
                  ? Ae()
                  : de(W, () => {
                      ;(Ae(), ye && ye())
                    }))
            }
          ge ? ge(W, Ae, Ve) : Ve()
        }
      else o(W, R, $)
    },
    H = (k, R, $, N = !1, Y = !1) => {
      const {
        type: W,
        props: ce,
        ref: le,
        children: ie,
        dynamicChildren: X,
        shapeFlag: be,
        patchFlag: de,
        dirs: ge,
        cacheIndex: ye,
        memo: Ae
      } = k
      if (
        (de === -2 && (Y = !1),
        le != null && (vn(), $a(le, null, $, k, !0), bn()),
        ye != null && (R.renderCache[ye] = void 0),
        be & 256)
      ) {
        R.ctx.deactivate(k)
        return
      }
      const Ve = be & 1 && ge,
        Be = !no(k)
      let Ze
      if ((Be && (Ze = ce && ce.onVnodeBeforeUnmount) && Bt(Ze, R, k), be & 6)) G(k.component, $, N)
      else {
        if (be & 128) {
          k.suspense.unmount($, N)
          return
        }
        ;(Ve && so(k, null, R, 'beforeUnmount'),
          be & 64
            ? k.type.remove(k, R, $, Q, N)
            : X && !X.hasOnce && (W !== qe || (de > 0 && de & 64))
              ? ue(X, R, $, !1, !0)
              : ((W === qe && de & 384) || (!Y && be & 16)) && ue(ie, R, $),
          N && ne(k))
      }
      const ct = Ae != null && ye == null
      ;((Be && (Ze = ce && ce.onVnodeUnmounted)) || Ve || ct) &&
        tt(() => {
          ;(Ze && Bt(Ze, R, k), Ve && so(k, null, R, 'unmounted'), ct && (k.el = null))
        }, $)
    },
    ne = k => {
      const { type: R, el: $, anchor: N, transition: Y } = k
      if (R === qe) {
        me($, N)
        return
      }
      if (R === $i) {
        S(k)
        return
      }
      const W = () => {
        ;(a($), Y && !Y.persisted && Y.afterLeave && Y.afterLeave())
      }
      if (k.shapeFlag & 1 && Y && !Y.persisted) {
        const { leave: ce, delayLeave: le } = Y,
          ie = () => ce($, W)
        le ? le(k.el, W, ie) : ie()
      } else W()
    },
    me = (k, R) => {
      let $
      for (; k !== R;) (($ = h(k)), a(k), (k = $))
      a(R)
    },
    G = (k, R, $) => {
      const { bum: N, scope: Y, job: W, subTree: ce, um: le, m: ie, a: X } = k
      ;(Ki(ie),
        Ki(X),
        N && Ko(N),
        Y.stop(),
        W && ((W.flags |= 8), H(ce, k, R, $)),
        le && tt(le, R),
        tt(() => {
          k.isUnmounted = !0
        }, R))
    },
    ue = (k, R, $, N = !1, Y = !1, W = 0) => {
      for (let ce = W; ce < k.length; ce++) H(k[ce], R, $, N, Y)
    },
    E = k => {
      if (k.shapeFlag & 6) return E(k.component.subTree)
      if (k.shapeFlag & 128) return k.suspense.next()
      const R = h(k.anchor || k.el),
        $ = R && R[cf]
      return $ ? h($) : R
    }
  let F = !1
  const V = (k, R, $) => {
      let N
      ;(k == null
        ? R._vnode && (H(R._vnode, null, null, !0), (N = R._vnode.component))
        : p(R._vnode || null, k, R, null, null, null, $),
        (R._vnode = k),
        F || ((F = !0), xc(N), af(), (F = !1)))
    },
    Q = { p, um: H, m: re, r: ne, mt: z, mc: w, pc: ae, pbc: O, n: E, o: e }
  return { render: V, hydrate: void 0, createApp: l0(V) }
}
function ir({ type: e, props: t }, n) {
  return (n === 'svg' && e === 'foreignObject') ||
    (n === 'mathml' && e === 'annotation-xml' && t && t.encoding && t.encoding.includes('html'))
    ? void 0
    : n
}
function co({ effect: e, job: t }, n) {
  n ? ((e.flags |= 32), (t.flags |= 4)) : ((e.flags &= -33), (t.flags &= -5))
}
function S0(e, t) {
  return (!e || (e && !e.pendingBranch)) && t && !t.persisted
}
function Ds(e, t, n = !1) {
  const o = e.children,
    a = t.children
  if (ve(o) && ve(a))
    for (let i = 0; i < o.length; i++) {
      const l = o[i]
      let r = a[i]
      ;(r.shapeFlag & 1 &&
        !r.dynamicChildren &&
        ((r.patchFlag <= 0 || r.patchFlag === 32) && ((r = a[i] = kn(a[i])), (r.el = l.el)),
        !n && r.patchFlag !== -2 && Ds(l, r)),
        r.type === ti && (r.patchFlag === -1 && (r = a[i] = kn(r)), (r.el = l.el)),
        r.type === ot && !r.el && (r.el = l.el))
    }
}
function C0(e) {
  const t = e.slice(),
    n = [0]
  let o, a, i, l, r
  const s = e.length
  for (o = 0; o < s; o++) {
    const c = e[o]
    if (c !== 0) {
      if (((a = n[n.length - 1]), e[a] < c)) {
        ;((t[o] = a), n.push(o))
        continue
      }
      for (i = 0, l = n.length - 1; i < l;)
        ((r = (i + l) >> 1), e[n[r]] < c ? (i = r + 1) : (l = r))
      c < e[n[i]] && (i > 0 && (t[o] = n[i - 1]), (n[i] = o))
    }
  }
  for (i = n.length, l = n[i - 1]; i-- > 0;) ((n[i] = l), (l = t[l]))
  return n
}
function $f(e) {
  const t = e.subTree.component
  if (t) return t.asyncDep && !t.asyncResolved ? t : $f(t)
}
function Ki(e) {
  if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8
}
function Bf(e) {
  if (e.placeholder) return e.placeholder
  const t = e.component
  return t ? Bf(t.subTree) : null
}
const Yi = e => e.__isSuspense
function _0(e, t) {
  t && t.pendingBranch ? (ve(e) ? t.effects.push(...e) : t.effects.push(e)) : Oy(e)
}
const qe = Symbol.for('v-fgt'),
  ti = Symbol.for('v-txt'),
  ot = Symbol.for('v-cmt'),
  $i = Symbol.for('v-stc'),
  Ma = []
let At = null
function Ua(e = !1) {
  Ma.push((At = e ? null : []))
}
function T0() {
  ;(Ma.pop(), (At = Ma[Ma.length - 1] || null))
}
let Ka = 1
function Gi(e, t = !1) {
  ;((Ka += e), e < 0 && At && t && (At.hasOnce = !0))
}
function Mf(e) {
  return ((e.dynamicChildren = Ka > 0 ? At || Wo : null), T0(), Ka > 0 && At && At.push(e), e)
}
function E0(e, t, n, o, a, i) {
  return Mf(Lf(e, t, n, o, a, i, !0))
}
function qi(e, t, n, o, a) {
  return Mf(f(e, t, n, o, a, !0))
}
function _o(e) {
  return e ? e.__v_isVNode === !0 : !1
}
function eo(e, t) {
  return e.type === t.type && e.key === t.key
}
const Vf = ({ key: e }) => e ?? null,
  Bi = ({ ref: e, ref_key: t, ref_for: n }) => (
    typeof e == 'number' && (e = '' + e),
    e != null ? (Me(e) || Ue(e) || xe(e) ? { i: ut, r: e, k: t, f: !!n } : e) : null
  )
function Lf(e, t = null, n = null, o = 0, a = null, i = e === qe ? 0 : 1, l = !1, r = !1) {
  const s = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Vf(t),
    ref: t && Bi(t),
    scopeId: rf,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: i,
    patchFlag: o,
    dynamicProps: a,
    dynamicChildren: null,
    appContext: null,
    ctx: ut
  }
  return (
    r ? (Xi(s, n), i & 128 && e.normalize(s)) : n && (s.shapeFlag |= Me(n) ? 8 : 16),
    Ka > 0 && !l && At && (s.patchFlag > 0 || i & 6) && s.patchFlag !== 32 && At.push(s),
    s
  )
}
const f = k0
function k0(e, t = null, n = null, o = 0, a = null, i = !1) {
  if (((!e || e === pf) && (e = ot), _o(e))) {
    const r = $n(e, t, !0)
    return (
      n && Xi(r, n),
      Ka > 0 && !i && At && (r.shapeFlag & 6 ? (At[At.indexOf(e)] = r) : At.push(r)),
      (r.patchFlag = -2),
      r
    )
  }
  if ((V0(e) && (e = e.__vccOpts), t)) {
    t = A0(t)
    let { class: r, style: s } = t
    ;(r && !Me(r) && (t.class = xl(r)),
      $e(s) && (Cl(s) && !ve(s) && (s = at({}, s)), (t.style = wl(s))))
  }
  const l = Me(e) ? 1 : Yi(e) ? 128 : uf(e) ? 64 : $e(e) ? 4 : xe(e) ? 2 : 0
  return Lf(e, t, n, o, a, l, i, !0)
}
function A0(e) {
  return e ? (Cl(e) || Af(e) ? at({}, e) : e) : null
}
function $n(e, t, n = !1, o = !1) {
  const { props: a, ref: i, patchFlag: l, children: r, transition: s } = e,
    c = t ? Ce(a || {}, t) : a,
    u = {
      __v_isVNode: !0,
      __v_skip: !0,
      type: e.type,
      props: c,
      key: c && Vf(c),
      ref: t && t.ref ? (n && i ? (ve(i) ? i.concat(Bi(t)) : [i, Bi(t)]) : Bi(t)) : i,
      scopeId: e.scopeId,
      slotScopeIds: e.slotScopeIds,
      children: r,
      target: e.target,
      targetStart: e.targetStart,
      targetAnchor: e.targetAnchor,
      staticCount: e.staticCount,
      shapeFlag: e.shapeFlag,
      patchFlag: t && e.type !== qe ? (l === -1 ? 16 : l | 16) : l,
      dynamicProps: e.dynamicProps,
      dynamicChildren: e.dynamicChildren,
      appContext: e.appContext,
      dirs: e.dirs,
      transition: s,
      component: e.component,
      suspense: e.suspense,
      ssContent: e.ssContent && $n(e.ssContent),
      ssFallback: e.ssFallback && $n(e.ssFallback),
      placeholder: e.placeholder,
      el: e.el,
      anchor: e.anchor,
      ctx: e.ctx,
      ce: e.ce
    }
  return (s && o && Qo(u, s.clone(u)), u)
}
function $s(e = ' ', t = 0) {
  return f(ti, null, e, t)
}
function ck(e, t) {
  const n = f($i, null, e)
  return ((n.staticCount = t), n)
}
function P0(e = '', t = !1) {
  return t ? (Ua(), qi(ot, null, e)) : f(ot, null, e)
}
function un(e) {
  return e == null || typeof e == 'boolean'
    ? f(ot)
    : ve(e)
      ? f(qe, null, e.slice())
      : _o(e)
        ? kn(e)
        : f(ti, null, String(e))
}
function kn(e) {
  return (e.el === null && e.patchFlag !== -1) || e.memo ? e : $n(e)
}
function Xi(e, t) {
  let n = 0
  const { shapeFlag: o } = e
  if (t == null) t = null
  else if (ve(t)) n = 16
  else if (typeof t == 'object')
    if (o & 65) {
      const a = t.default
      a && (a._c && (a._d = !1), Xi(e, a()), a._c && (a._d = !0))
      return
    } else {
      n = 32
      const a = t._
      !a && !Af(t)
        ? (t._ctx = ut)
        : a === 3 && ut && (ut.slots._ === 1 ? (t._ = 1) : ((t._ = 2), (e.patchFlag |= 1024)))
    }
  else if (xe(t)) {
    if (o & 65) {
      Xi(e, { default: t })
      return
    }
    ;((t = { default: t, _ctx: ut }), (n = 32))
  } else ((t = String(t)), o & 64 ? ((n = 16), (t = [$s(t)])) : (n = 8))
  ;((e.children = t), (e.shapeFlag |= n))
}
function Ce(...e) {
  const t = {}
  for (let n = 0; n < e.length; n++) {
    const o = e[n]
    for (const a in o)
      if (a === 'class') t.class !== o.class && (t.class = xl([t.class, o.class]))
      else if (a === 'style') t.style = wl([t.style, o.style])
      else if (fl(a)) {
        const i = t[a],
          l = o[a]
        l && i !== l && !(ve(i) && i.includes(l))
          ? (t[a] = i ? [].concat(i, l) : l)
          : l == null && i == null && !hl(a) && (t[a] = l)
      } else a !== '' && (t[a] = o[a])
  }
  return t
}
function Bt(e, t, n, o = null) {
  Nt(e, t, 7, [n, o])
}
const I0 = Cf()
let O0 = 0
function R0(e, t, n) {
  const o = e.type,
    a = (t ? t.appContext : e.appContext) || I0,
    i = {
      uid: O0++,
      vnode: e,
      type: o,
      parent: t,
      appContext: a,
      root: null,
      next: null,
      subTree: null,
      effect: null,
      update: null,
      job: null,
      scope: new Md(!0),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: t ? t.provides : Object.create(a.provides),
      ids: t ? t.ids : ['', 0, 0],
      accessCache: null,
      renderCache: [],
      components: null,
      directives: null,
      propsOptions: If(o, a),
      emitsOptions: _f(o, a),
      emit: null,
      emitted: null,
      propsDefaults: Le,
      inheritAttrs: o.inheritAttrs,
      ctx: Le,
      data: Le,
      props: Le,
      attrs: Le,
      slots: Le,
      refs: Le,
      setupState: Le,
      setupContext: null,
      suspense: n,
      suspenseId: n ? n.pendingId : 0,
      asyncDep: null,
      asyncResolved: !1,
      isMounted: !1,
      isUnmounted: !1,
      isDeactivated: !1,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null
    }
  return (
    (i.ctx = { _: i }),
    (i.root = t ? t.root : i),
    (i.emit = s0.bind(null, i)),
    e.ce && e.ce(i),
    i
  )
}
let gt = null
const Et = () => gt || ut
let Zi, Gr
{
  const e = pl(),
    t = (n, o) => {
      let a
      return (
        (a = e[n]) || (a = e[n] = []),
        a.push(o),
        i => {
          a.length > 1 ? a.forEach(l => l(i)) : a[0](i)
        }
      )
    }
  ;((Zi = t('__VUE_INSTANCE_SETTERS__', n => (gt = n))),
    (Gr = t('__VUE_SSR_SETTERS__', n => (Ya = n))))
}
const ni = e => {
    const t = gt
    return (
      Zi(e),
      e.scope.on(),
      () => {
        ;(e.scope.off(), Zi(t))
      }
    )
  },
  Bc = () => {
    ;(gt && gt.scope.off(), Zi(null))
  }
function Nf(e) {
  return e.vnode.shapeFlag & 4
}
let Ya = !1
function D0(e, t = !1, n = !1) {
  t && Gr(t)
  const { props: o, children: a } = e.vnode,
    i = Nf(e)
  ;(m0(e, o, i, t), y0(e, a, n || t))
  const l = i ? $0(e, t) : void 0
  return (t && Gr(!1), l)
}
function $0(e, t) {
  const n = e.type
  ;((e.accessCache = Object.create(null)), (e.proxy = new Proxy(e.ctx, Qy)))
  const { setup: o } = n
  if (o) {
    vn()
    const a = (e.setupContext = o.length > 1 ? M0(e) : null),
      i = ni(e),
      l = ei(o, e, 0, [e.props, a]),
      r = Pd(l)
    if ((bn(), i(), (r || e.sp) && !no(e) && vf(e), r)) {
      if ((l.then(Bc, Bc), t))
        return l
          .then(s => {
            Mc(e, s)
          })
          .catch(s => {
            _l(s, e, 0)
          })
      e.asyncDep = l
    } else Mc(e, l)
  } else Ff(e)
}
function Mc(e, t, n) {
  ;(xe(t)
    ? e.type.__ssrInlineRender
      ? (e.ssrRender = t)
      : (e.render = t)
    : $e(t) && (e.setupState = tf(t)),
    Ff(e))
}
function Ff(e, t, n) {
  const o = e.type
  e.render || (e.render = o.render || fn)
  {
    const a = ni(e)
    vn()
    try {
      e0(e)
    } finally {
      ;(bn(), a())
    }
  }
}
const B0 = {
  get(e, t) {
    return (mt(e, 'get', ''), e[t])
  }
}
function M0(e) {
  const t = n => {
    e.exposed = n || {}
  }
  return { attrs: new Proxy(e.attrs, B0), slots: e.slots, emit: e.emit, expose: t }
}
function Al(e) {
  return e.exposed
    ? e.exposeProxy ||
        (e.exposeProxy = new Proxy(tf(Ts(e.exposed)), {
          get(t, n) {
            if (n in t) return t[n]
            if (n in Ba) return Ba[n](e)
          },
          has(t, n) {
            return n in t || n in Ba
          }
        }))
    : e.proxy
}
function qr(e, t = !0) {
  return xe(e) ? e.displayName || e.name : e.name || (t && e.__name)
}
function V0(e) {
  return xe(e) && '__vccOpts' in e
}
const B = (e, t) => Ey(e, t, Ya)
function Bs(e, t, n) {
  try {
    Gi(-1)
    const o = arguments.length
    return o === 2
      ? $e(t) && !ve(t)
        ? _o(t)
          ? f(e, null, [t])
          : f(e, t)
        : f(e, null, t)
      : (o > 3 ? (n = Array.prototype.slice.call(arguments, 2)) : o === 3 && _o(n) && (n = [n]),
        f(e, t, n))
  } finally {
    Gi(1)
  }
}
const L0 = '3.5.39'
/**
 * @vue/runtime-dom v3.5.39
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ let Xr
const Vc = typeof window < 'u' && window.trustedTypes
if (Vc)
  try {
    Xr = Vc.createPolicy('vue', { createHTML: e => e })
  } catch {}
const Hf = Xr ? e => Xr.createHTML(e) : e => e,
  N0 = 'http://www.w3.org/2000/svg',
  F0 = 'http://www.w3.org/1998/Math/MathML',
  En = typeof document < 'u' ? document : null,
  Lc = En && En.createElement('template'),
  H0 = {
    insert: (e, t, n) => {
      t.insertBefore(e, n || null)
    },
    remove: e => {
      const t = e.parentNode
      t && t.removeChild(e)
    },
    createElement: (e, t, n, o) => {
      const a =
        t === 'svg'
          ? En.createElementNS(N0, e)
          : t === 'mathml'
            ? En.createElementNS(F0, e)
            : n
              ? En.createElement(e, { is: n })
              : En.createElement(e)
      return (
        e === 'select' && o && o.multiple != null && a.setAttribute('multiple', o.multiple),
        a
      )
    },
    createText: e => En.createTextNode(e),
    createComment: e => En.createComment(e),
    setText: (e, t) => {
      e.nodeValue = t
    },
    setElementText: (e, t) => {
      e.textContent = t
    },
    parentNode: e => e.parentNode,
    nextSibling: e => e.nextSibling,
    querySelector: e => En.querySelector(e),
    setScopeId(e, t) {
      e.setAttribute(t, '')
    },
    insertStaticContent(e, t, n, o, a, i) {
      const l = n ? n.previousSibling : t.lastChild
      if (a && (a === i || a.nextSibling))
        for (; t.insertBefore(a.cloneNode(!0), n), !(a === i || !(a = a.nextSibling)););
      else {
        Lc.innerHTML = Hf(
          o === 'svg' ? `<svg>${e}</svg>` : o === 'mathml' ? `<math>${e}</math>` : e
        )
        const r = Lc.content
        if (o === 'svg' || o === 'mathml') {
          const s = r.firstChild
          for (; s.firstChild;) r.appendChild(s.firstChild)
          r.removeChild(s)
        }
        t.insertBefore(r, n)
      }
      return [l ? l.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild]
    }
  },
  jn = 'transition',
  va = 'animation',
  Ga = Symbol('_vtc'),
  zf = {
    name: String,
    type: String,
    css: { type: Boolean, default: !0 },
    duration: [String, Number, Object],
    enterFromClass: String,
    enterActiveClass: String,
    enterToClass: String,
    appearFromClass: String,
    appearActiveClass: String,
    appearToClass: String,
    leaveFromClass: String,
    leaveActiveClass: String,
    leaveToClass: String
  },
  z0 = at({}, df, zf),
  j0 = e => ((e.displayName = 'Transition'), (e.props = z0), e),
  oi = j0((e, { slots: t }) => Bs(Hy, W0(e), t)),
  uo = (e, t = []) => {
    ve(e) ? e.forEach(n => n(...t)) : e && e(...t)
  },
  Nc = e => (e ? (ve(e) ? e.some(t => t.length > 1) : e.length > 1) : !1)
function W0(e) {
  const t = {}
  for (const T in e) T in zf || (t[T] = e[T])
  if (e.css === !1) return t
  const {
      name: n = 'v',
      type: o,
      duration: a,
      enterFromClass: i = `${n}-enter-from`,
      enterActiveClass: l = `${n}-enter-active`,
      enterToClass: r = `${n}-enter-to`,
      appearFromClass: s = i,
      appearActiveClass: c = l,
      appearToClass: u = r,
      leaveFromClass: d = `${n}-leave-from`,
      leaveActiveClass: h = `${n}-leave-active`,
      leaveToClass: m = `${n}-leave-to`
    } = e,
    y = U0(a),
    p = y && y[0],
    b = y && y[1],
    {
      onBeforeEnter: x,
      onEnter: g,
      onEnterCancelled: C,
      onLeave: S,
      onLeaveCancelled: v,
      onBeforeAppear: _ = x,
      onAppear: P = g,
      onAppearCancelled: w = C
    } = t,
    A = (T, D, z, oe) => {
      ;((T._enterCancelled = oe), fo(T, D ? u : r), fo(T, D ? c : l), z && z())
    },
    O = (T, D) => {
      ;((T._isLeaving = !1), fo(T, d), fo(T, m), fo(T, h), D && D())
    },
    I = T => (D, z) => {
      const oe = T ? P : g,
        L = () => A(D, T, z)
      ;(uo(oe, [D, L]),
        Fc(() => {
          ;(fo(D, T ? s : i), xn(D, T ? u : r), Nc(oe) || Hc(D, o, p, L))
        }))
    }
  return at(t, {
    onBeforeEnter(T) {
      ;(uo(x, [T]), xn(T, i), xn(T, l))
    },
    onBeforeAppear(T) {
      ;(uo(_, [T]), xn(T, s), xn(T, c))
    },
    onEnter: I(!1),
    onAppear: I(!0),
    onLeave(T, D) {
      T._isLeaving = !0
      const z = () => O(T, D)
      ;(xn(T, d),
        T._enterCancelled ? (xn(T, h), Wc(T)) : (Wc(T), xn(T, h)),
        Fc(() => {
          T._isLeaving && (fo(T, d), xn(T, m), Nc(S) || Hc(T, o, b, z))
        }),
        uo(S, [T, z]))
    },
    onEnterCancelled(T) {
      ;(A(T, !1, void 0, !0), uo(C, [T]))
    },
    onAppearCancelled(T) {
      ;(A(T, !0, void 0, !0), uo(w, [T]))
    },
    onLeaveCancelled(T) {
      ;(O(T), uo(v, [T]))
    }
  })
}
function U0(e) {
  if (e == null) return null
  if ($e(e)) return [lr(e.enter), lr(e.leave)]
  {
    const t = lr(e)
    return [t, t]
  }
}
function lr(e) {
  return jb(e)
}
function xn(e, t) {
  ;(t.split(/\s+/).forEach(n => n && e.classList.add(n)), (e[Ga] || (e[Ga] = new Set())).add(t))
}
function fo(e, t) {
  t.split(/\s+/).forEach(o => o && e.classList.remove(o))
  const n = e[Ga]
  n && (n.delete(t), n.size || (e[Ga] = void 0))
}
function Fc(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e)
  })
}
let K0 = 0
function Hc(e, t, n, o) {
  const a = (e._endId = ++K0),
    i = () => {
      a === e._endId && o()
    }
  if (n != null) return setTimeout(i, n)
  const { type: l, timeout: r, propCount: s } = Y0(e, t)
  if (!l) return o()
  const c = l + 'end'
  let u = 0
  const d = () => {
      ;(e.removeEventListener(c, h), i())
    },
    h = m => {
      m.target === e && ++u >= s && d()
    }
  ;(setTimeout(() => {
    u < s && d()
  }, r + 1),
    e.addEventListener(c, h))
}
function Y0(e, t) {
  const n = window.getComputedStyle(e),
    o = y => (n[y] || '').split(', '),
    a = o(`${jn}Delay`),
    i = o(`${jn}Duration`),
    l = zc(a, i),
    r = o(`${va}Delay`),
    s = o(`${va}Duration`),
    c = zc(r, s)
  let u = null,
    d = 0,
    h = 0
  t === jn
    ? l > 0 && ((u = jn), (d = l), (h = i.length))
    : t === va
      ? c > 0 && ((u = va), (d = c), (h = s.length))
      : ((d = Math.max(l, c)),
        (u = d > 0 ? (l > c ? jn : va) : null),
        (h = u ? (u === jn ? i.length : s.length) : 0))
  const m = u === jn && /\b(?:transform|all)(?:,|$)/.test(o(`${jn}Property`).toString())
  return { type: u, timeout: d, propCount: h, hasTransform: m }
}
function zc(e, t) {
  for (; e.length < t.length;) e = e.concat(e)
  return Math.max(...t.map((n, o) => jc(n) + jc(e[o])))
}
function jc(e) {
  return e === 'auto' ? 0 : Number(e.slice(0, -1).replace(',', '.')) * 1e3
}
function Wc(e) {
  return (e ? e.ownerDocument : document).body.offsetHeight
}
function G0(e, t, n) {
  const o = e[Ga]
  ;(o && (t = (t ? [t, ...o] : [...o]).join(' ')),
    t == null ? e.removeAttribute('class') : n ? e.setAttribute('class', t) : (e.className = t))
}
const Ji = Symbol('_vod'),
  jf = Symbol('_vsh'),
  ft = {
    name: 'show',
    beforeMount(e, { value: t }, { transition: n }) {
      ;((e[Ji] = e.style.display === 'none' ? '' : e.style.display),
        n && t ? n.beforeEnter(e) : ba(e, t))
    },
    mounted(e, { value: t }, { transition: n }) {
      n && t && n.enter(e)
    },
    updated(e, { value: t, oldValue: n }, { transition: o }) {
      !t != !n &&
        (o
          ? t
            ? (o.beforeEnter(e), ba(e, !0), o.enter(e))
            : o.leave(e, () => {
                ba(e, !1)
              })
          : ba(e, t))
    },
    beforeUnmount(e, { value: t }) {
      ba(e, t)
    }
  }
function ba(e, t) {
  ;((e.style.display = t ? e[Ji] : 'none'), (e[jf] = !t))
}
const q0 = Symbol(''),
  X0 = /(?:^|;)\s*display\s*:/
function Z0(e, t, n) {
  const o = e.style,
    a = Me(n)
  let i = !1
  if (n && !a) {
    if (t)
      if (Me(t))
        for (const l of t.split(';')) {
          const r = l.slice(0, l.indexOf(':')).trim()
          n[r] == null && Ia(o, r, '')
        }
      else for (const l in t) n[l] == null && Ia(o, l, '')
    for (const l in n) {
      l === 'display' && (i = !0)
      const r = n[l]
      r != null ? Q0(e, l, !Me(t) && t ? t[l] : void 0, r) || Ia(o, l, r) : Ia(o, l, '')
    }
  } else if (a) {
    if (t !== n) {
      const l = o[q0]
      ;(l && (n += ';' + l), (o.cssText = n), (i = X0.test(n)))
    }
  } else t && e.removeAttribute('style')
  Ji in e && ((e[Ji] = i ? o.display : ''), e[jf] && (o.display = 'none'))
}
const Uc = /\s*!important$/
function Ia(e, t, n) {
  if (ve(n)) n.forEach(o => Ia(e, t, o))
  else if ((n == null && (n = ''), t.startsWith('--'))) e.setProperty(t, n)
  else {
    const o = J0(e, t)
    Uc.test(n) ? e.setProperty(Ln(o), n.replace(Uc, ''), 'important') : (e[o] = n)
  }
}
const Kc = ['Webkit', 'Moz', 'ms'],
  rr = {}
function J0(e, t) {
  const n = rr[t]
  if (n) return n
  let o = _t(t)
  if (o !== 'filter' && o in e) return (rr[t] = o)
  o = bl(o)
  for (let a = 0; a < Kc.length; a++) {
    const i = Kc[a] + o
    if (i in e) return (rr[t] = i)
  }
  return t
}
function Q0(e, t, n, o) {
  return e.tagName === 'TEXTAREA' && (t === 'width' || t === 'height') && Me(o) && n === o
}
const Yc = 'http://www.w3.org/1999/xlink'
function Gc(e, t, n, o, a, i = Xb(t)) {
  o && t.startsWith('xlink:')
    ? n == null
      ? e.removeAttributeNS(Yc, t.slice(6, t.length))
      : e.setAttributeNS(Yc, t, n)
    : n == null || (i && !Dd(n))
      ? e.removeAttribute(t)
      : e.setAttribute(t, i ? '' : It(n) ? String(n) : n)
}
function qc(e, t, n, o, a) {
  if (t === 'innerHTML' || t === 'textContent') {
    n != null && (e[t] = t === 'innerHTML' ? Hf(n) : n)
    return
  }
  const i = e.tagName
  if (t === 'value' && i !== 'PROGRESS' && !i.includes('-')) {
    const r = i === 'OPTION' ? e.getAttribute('value') || '' : e.value,
      s = n == null ? (e.type === 'checkbox' ? 'on' : '') : String(n)
    ;((r !== s || !('_value' in e)) && (e.value = s),
      n == null && e.removeAttribute(t),
      (e._value = n))
    return
  }
  let l = !1
  if (n === '' || n == null) {
    const r = typeof e[t]
    r === 'boolean'
      ? (n = Dd(n))
      : n == null && r === 'string'
        ? ((n = ''), (l = !0))
        : r === 'number' && ((n = 0), (l = !0))
  }
  try {
    e[t] = n
  } catch {}
  l && e.removeAttribute(a || t)
}
function bo(e, t, n, o) {
  e.addEventListener(t, n, o)
}
function ep(e, t, n, o) {
  e.removeEventListener(t, n, o)
}
const Xc = Symbol('_vei')
function tp(e, t, n, o, a = null) {
  const i = e[Xc] || (e[Xc] = {}),
    l = i[t]
  if (o && l) l.value = o
  else {
    const [r, s] = ap(t)
    if (o) {
      const c = (i[t] = rp(o, a))
      bo(e, r, c, s)
    } else l && (ep(e, r, l, s), (i[t] = void 0))
  }
}
const np = /(Once|Passive|Capture)$/,
  op = /^on:?(?:Once|Passive|Capture)$/
function ap(e) {
  let t, n
  for (; (n = e.match(np)) && !op.test(e);)
    (t || (t = {}), (e = e.slice(0, e.length - n[1].length)), (t[n[1].toLowerCase()] = !0))
  return [e[2] === ':' ? e.slice(3) : Ln(e.slice(2)), t]
}
let sr = 0
const ip = Promise.resolve(),
  lp = () => sr || (ip.then(() => (sr = 0)), (sr = Date.now()))
function rp(e, t) {
  const n = o => {
    if (!o._vts) o._vts = Date.now()
    else if (o._vts <= n.attached) return
    const a = n.value
    if (ve(a)) {
      const i = o.stopImmediatePropagation
      o.stopImmediatePropagation = () => {
        ;(i.call(o), (o._stopped = !0))
      }
      const l = a.slice(),
        r = [o]
      for (let s = 0; s < l.length && !o._stopped; s++) {
        const c = l[s]
        c && Nt(c, t, 5, r)
      }
    } else Nt(a, t, 5, [o])
  }
  return ((n.value = e), (n.attached = lp()), n)
}
const Zc = e =>
    e.charCodeAt(0) === 111 &&
    e.charCodeAt(1) === 110 &&
    e.charCodeAt(2) > 96 &&
    e.charCodeAt(2) < 123,
  sp = (e, t, n, o, a, i) => {
    const l = a === 'svg'
    t === 'class'
      ? G0(e, o, l)
      : t === 'style'
        ? Z0(e, n, o)
        : fl(t)
          ? hl(t) || tp(e, t, n, o, i)
          : (
                t[0] === '.'
                  ? ((t = t.slice(1)), !0)
                  : t[0] === '^'
                    ? ((t = t.slice(1)), !1)
                    : cp(e, t, o, l)
              )
            ? (qc(e, t, o),
              !e.tagName.includes('-') &&
                (t === 'value' || t === 'checked' || t === 'selected') &&
                Gc(e, t, o, l, i, t !== 'value'))
            : e._isVueCE && (up(e, t) || (e._def.__asyncLoader && (/[A-Z]/.test(t) || !Me(o))))
              ? qc(e, _t(t), o, i, t)
              : (t === 'true-value'
                  ? (e._trueValue = o)
                  : t === 'false-value' && (e._falseValue = o),
                Gc(e, t, o, l))
  }
function cp(e, t, n, o) {
  if (o) return !!(t === 'innerHTML' || t === 'textContent' || (t in e && Zc(t) && xe(n)))
  if (
    t === 'spellcheck' ||
    t === 'draggable' ||
    t === 'translate' ||
    t === 'autocorrect' ||
    (t === 'sandbox' && e.tagName === 'IFRAME') ||
    t === 'form' ||
    (t === 'list' && e.tagName === 'INPUT') ||
    (t === 'type' && e.tagName === 'TEXTAREA')
  )
    return !1
  if (t === 'width' || t === 'height') {
    const a = e.tagName
    if (a === 'IMG' || a === 'VIDEO' || a === 'CANVAS' || a === 'SOURCE') return !1
  }
  return Zc(t) && Me(n) ? !1 : t in e
}
function up(e, t) {
  const n = e._def.props
  if (!n) return !1
  const o = _t(t)
  return Array.isArray(n) ? n.some(a => _t(a) === o) : Object.keys(n).some(a => _t(a) === o)
}
const Qi = e => {
  const t = e.props['onUpdate:modelValue'] || !1
  return ve(t) ? n => Ko(t, n) : t
}
function dp(e) {
  e.target.composing = !0
}
function Jc(e) {
  const t = e.target
  t.composing && ((t.composing = !1), t.dispatchEvent(new Event('input')))
}
const Go = Symbol('_assign')
function Qc(e, t, n) {
  return (t && (e = e.trim()), n && (e = yl(e)), e)
}
const uk = {
    created(e, { modifiers: { lazy: t, trim: n, number: o } }, a) {
      e[Go] = Qi(a)
      const i = o || (a.props && a.props.type === 'number')
      ;(bo(e, t ? 'change' : 'input', l => {
        l.target.composing || e[Go](Qc(e.value, n, i))
      }),
        (n || i) &&
          bo(e, 'change', () => {
            e.value = Qc(e.value, n, i)
          }),
        t || (bo(e, 'compositionstart', dp), bo(e, 'compositionend', Jc), bo(e, 'change', Jc)))
    },
    mounted(e, { value: t }) {
      e.value = t ?? ''
    },
    beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: o, trim: a, number: i } }, l) {
      if (((e[Go] = Qi(l)), e.composing)) return
      const r = (i || e.type === 'number') && !/^0\d/.test(e.value) ? yl(e.value) : e.value,
        s = t ?? ''
      if (r === s) return
      const c = e.getRootNode()
      ;((c instanceof Document || c instanceof ShadowRoot) &&
        c.activeElement === e &&
        e.type !== 'range' &&
        ((o && t === n) || (a && e.value.trim() === s))) ||
        (e.value = s)
    }
  },
  dk = {
    deep: !0,
    created(e, { value: t, modifiers: { number: n } }, o) {
      const a = ml(t)
      ;(bo(e, 'change', () => {
        const i = Array.prototype.filter
          .call(e.options, l => l.selected)
          .map(l => (n ? yl(el(l)) : el(l)))
        ;(e[Go](e.multiple ? (a ? new Set(i) : i) : i[0]),
          (e._assigning = !0),
          Se(() => {
            e._assigning = !1
          }))
      }),
        (e[Go] = Qi(o)))
    },
    mounted(e, { value: t }) {
      eu(e, t)
    },
    beforeUpdate(e, t, n) {
      e[Go] = Qi(n)
    },
    updated(e, { value: t }) {
      e._assigning || eu(e, t)
    }
  }
function eu(e, t) {
  const n = e.multiple,
    o = ve(t)
  if (!(n && !o && !ml(t))) {
    for (let a = 0, i = e.options.length; a < i; a++) {
      const l = e.options[a],
        r = el(l)
      if (n)
        if (o) {
          const s = typeof r
          s === 'string' || s === 'number'
            ? (l.selected = t.some(c => String(c) === String(r)))
            : (l.selected = Jb(t, r) > -1)
        } else l.selected = t.has(r)
      else if (Qa(el(l), t)) {
        e.selectedIndex !== a && (e.selectedIndex = a)
        return
      }
    }
    !n && e.selectedIndex !== -1 && (e.selectedIndex = -1)
  }
}
function el(e) {
  return '_value' in e ? e._value : e.value
}
const fp = ['ctrl', 'shift', 'alt', 'meta'],
  hp = {
    stop: e => e.stopPropagation(),
    prevent: e => e.preventDefault(),
    self: e => e.target !== e.currentTarget,
    ctrl: e => !e.ctrlKey,
    shift: e => !e.shiftKey,
    alt: e => !e.altKey,
    meta: e => !e.metaKey,
    left: e => 'button' in e && e.button !== 0,
    middle: e => 'button' in e && e.button !== 1,
    right: e => 'button' in e && e.button !== 2,
    exact: (e, t) => fp.some(n => e[`${n}Key`] && !t.includes(n))
  },
  fk = (e, t) => {
    if (!e) return e
    const n = e._withMods || (e._withMods = {}),
      o = t.join('.')
    return (
      n[o] ||
      (n[o] = (a, ...i) => {
        for (let l = 0; l < t.length; l++) {
          const r = hp[t[l]]
          if (r && r(a, t)) return
        }
        return e(a, ...i)
      })
    )
  },
  mp = {
    esc: 'escape',
    space: ' ',
    up: 'arrow-up',
    left: 'arrow-left',
    right: 'arrow-right',
    down: 'arrow-down',
    delete: 'backspace'
  },
  gp = (e, t) => {
    const n = e._withKeys || (e._withKeys = {}),
      o = t.join('.')
    return (
      n[o] ||
      (n[o] = a => {
        if (!('key' in a)) return
        const i = Ln(a.key)
        if (t.some(l => l === i || mp[l] === i)) return e(a)
      })
    )
  },
  vp = at({ patchProp: sp }, H0)
let tu
function bp() {
  return tu || (tu = w0(vp))
}
const Wf = (...e) => {
  const t = bp().createApp(...e),
    { mount: n } = t
  return (
    (t.mount = o => {
      const a = pp(o)
      if (!a) return
      const i = t._component
      ;(!xe(i) && !i.render && !i.template && (i.template = a.innerHTML),
        a.nodeType === 1 && (a.textContent = ''))
      const l = n(a, !1, yp(a))
      return (
        a instanceof Element && (a.removeAttribute('v-cloak'), a.setAttribute('data-v-app', '')),
        l
      )
    }),
    t
  )
}
function yp(e) {
  if (e instanceof SVGElement) return 'svg'
  if (typeof MathMLElement == 'function' && e instanceof MathMLElement) return 'mathml'
}
function pp(e) {
  return Me(e) ? document.querySelector(e) : e
}
const wp = (e, t) => {
    const n = e.__vccOpts || e
    for (const [o, a] of t) n[o] = a
    return n
  },
  xp = {},
  Sp = { class: 'app-root' }
function Cp(e, t) {
  const n = Xy('router-view')
  return (
    Ua(),
    E0('div', Sp, [
      f(n, null, {
        default: Fr(({ Component: o }) => [
          f(
            oi,
            { name: 'fade', mode: 'out-in' },
            { default: Fr(() => [(Ua(), qi(Zy(o)))]), _: 2 },
            1024
          )
        ]),
        _: 1
      })
    ])
  )
}
const _p = wp(xp, [['render', Cp]]),
  Tp = 'modulepreload',
  Ep = function (e) {
    return '/' + e
  },
  nu = {},
  Ke = function (t, n, o) {
    let a = Promise.resolve()
    if (n && n.length > 0) {
      document.getElementsByTagName('link')
      const l = document.querySelector('meta[property=csp-nonce]'),
        r = (l == null ? void 0 : l.nonce) || (l == null ? void 0 : l.getAttribute('nonce'))
      a = Promise.allSettled(
        n.map(s => {
          if (((s = Ep(s)), s in nu)) return
          nu[s] = !0
          const c = s.endsWith('.css'),
            u = c ? '[rel="stylesheet"]' : ''
          if (document.querySelector(`link[href="${s}"]${u}`)) return
          const d = document.createElement('link')
          if (
            ((d.rel = c ? 'stylesheet' : Tp),
            c || (d.as = 'script'),
            (d.crossOrigin = ''),
            (d.href = s),
            r && d.setAttribute('nonce', r),
            document.head.appendChild(d),
            c)
          )
            return new Promise((h, m) => {
              ;(d.addEventListener('load', h),
                d.addEventListener('error', () => m(new Error(`Unable to preload CSS for ${s}`))))
            })
        })
      )
    }
    function i(l) {
      const r = new Event('vite:preloadError', { cancelable: !0 })
      if (((r.payload = l), window.dispatchEvent(r), !r.defaultPrevented)) throw l
    }
    return a.then(l => {
      for (const r of l || []) r.status === 'rejected' && i(r.reason)
      return t().catch(i)
    })
  }
/*!
 * vue-router v4.6.4
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */ const jo = typeof document < 'u'
function Uf(e) {
  return typeof e == 'object' || 'displayName' in e || 'props' in e || '__vccOpts' in e
}
function kp(e) {
  return e.__esModule || e[Symbol.toStringTag] === 'Module' || (e.default && Uf(e.default))
}
const Re = Object.assign
function cr(e, t) {
  const n = {}
  for (const o in t) {
    const a = t[o]
    n[o] = Jt(a) ? a.map(e) : e(a)
  }
  return n
}
const Va = () => {},
  Jt = Array.isArray
function ou(e, t) {
  const n = {}
  for (const o in e) n[o] = o in t ? t[o] : e[o]
  return n
}
const Kf = /#/g,
  Ap = /&/g,
  Pp = /\//g,
  Ip = /=/g,
  Op = /\?/g,
  Yf = /\+/g,
  Rp = /%5B/g,
  Dp = /%5D/g,
  Gf = /%5E/g,
  $p = /%60/g,
  qf = /%7B/g,
  Bp = /%7C/g,
  Xf = /%7D/g,
  Mp = /%20/g
function Ms(e) {
  return e == null
    ? ''
    : encodeURI('' + e)
        .replace(Bp, '|')
        .replace(Rp, '[')
        .replace(Dp, ']')
}
function Vp(e) {
  return Ms(e).replace(qf, '{').replace(Xf, '}').replace(Gf, '^')
}
function Zr(e) {
  return Ms(e)
    .replace(Yf, '%2B')
    .replace(Mp, '+')
    .replace(Kf, '%23')
    .replace(Ap, '%26')
    .replace($p, '`')
    .replace(qf, '{')
    .replace(Xf, '}')
    .replace(Gf, '^')
}
function Lp(e) {
  return Zr(e).replace(Ip, '%3D')
}
function Np(e) {
  return Ms(e).replace(Kf, '%23').replace(Op, '%3F')
}
function Fp(e) {
  return Np(e).replace(Pp, '%2F')
}
function qa(e) {
  if (e == null) return null
  try {
    return decodeURIComponent('' + e)
  } catch {}
  return '' + e
}
const Hp = /\/$/,
  zp = e => e.replace(Hp, '')
function ur(e, t, n = '/') {
  let o,
    a = {},
    i = '',
    l = ''
  const r = t.indexOf('#')
  let s = t.indexOf('?')
  return (
    (s = r >= 0 && s > r ? -1 : s),
    s >= 0 && ((o = t.slice(0, s)), (i = t.slice(s, r > 0 ? r : t.length)), (a = e(i.slice(1)))),
    r >= 0 && ((o = o || t.slice(0, r)), (l = t.slice(r, t.length))),
    (o = Kp(o ?? t, n)),
    { fullPath: o + i + l, path: o, query: a, hash: qa(l) }
  )
}
function jp(e, t) {
  const n = t.query ? e(t.query) : ''
  return t.path + (n && '?') + n + (t.hash || '')
}
function au(e, t) {
  return !t || !e.toLowerCase().startsWith(t.toLowerCase()) ? e : e.slice(t.length) || '/'
}
function Wp(e, t, n) {
  const o = t.matched.length - 1,
    a = n.matched.length - 1
  return (
    o > -1 &&
    o === a &&
    ea(t.matched[o], n.matched[a]) &&
    Zf(t.params, n.params) &&
    e(t.query) === e(n.query) &&
    t.hash === n.hash
  )
}
function ea(e, t) {
  return (e.aliasOf || e) === (t.aliasOf || t)
}
function Zf(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length) return !1
  for (var n in e) if (!Up(e[n], t[n])) return !1
  return !0
}
function Up(e, t) {
  return Jt(e)
    ? iu(e, t)
    : Jt(t)
      ? iu(t, e)
      : (e == null ? void 0 : e.valueOf()) === (t == null ? void 0 : t.valueOf())
}
function iu(e, t) {
  return Jt(t)
    ? e.length === t.length && e.every((n, o) => n === t[o])
    : e.length === 1 && e[0] === t
}
function Kp(e, t) {
  if (e.startsWith('/')) return e
  if (!e) return t
  const n = t.split('/'),
    o = e.split('/'),
    a = o[o.length - 1]
  ;(a === '..' || a === '.') && o.push('')
  let i = n.length - 1,
    l,
    r
  for (l = 0; l < o.length; l++)
    if (((r = o[l]), r !== '.'))
      if (r === '..') i > 1 && i--
      else break
  return n.slice(0, i).join('/') + '/' + o.slice(l).join('/')
}
const Wn = {
  path: '/',
  name: void 0,
  params: {},
  query: {},
  hash: '',
  fullPath: '/',
  matched: [],
  meta: {},
  redirectedFrom: void 0
}
let Jr = (function (e) {
    return ((e.pop = 'pop'), (e.push = 'push'), e)
  })({}),
  dr = (function (e) {
    return ((e.back = 'back'), (e.forward = 'forward'), (e.unknown = ''), e)
  })({})
function Yp(e) {
  if (!e)
    if (jo) {
      const t = document.querySelector('base')
      ;((e = (t && t.getAttribute('href')) || '/'), (e = e.replace(/^\w+:\/\/[^\/]+/, '')))
    } else e = '/'
  return (e[0] !== '/' && e[0] !== '#' && (e = '/' + e), zp(e))
}
const Gp = /^[^#]+#/
function qp(e, t) {
  return e.replace(Gp, '#') + t
}
function Xp(e, t) {
  const n = document.documentElement.getBoundingClientRect(),
    o = e.getBoundingClientRect()
  return {
    behavior: t.behavior,
    left: o.left - n.left - (t.left || 0),
    top: o.top - n.top - (t.top || 0)
  }
}
const Pl = () => ({ left: window.scrollX, top: window.scrollY })
function Zp(e) {
  let t
  if ('el' in e) {
    const n = e.el,
      o = typeof n == 'string' && n.startsWith('#'),
      a =
        typeof n == 'string'
          ? o
            ? document.getElementById(n.slice(1))
            : document.querySelector(n)
          : n
    if (!a) return
    t = Xp(a, e)
  } else t = e
  'scrollBehavior' in document.documentElement.style
    ? window.scrollTo(t)
    : window.scrollTo(
        t.left != null ? t.left : window.scrollX,
        t.top != null ? t.top : window.scrollY
      )
}
function lu(e, t) {
  return (history.state ? history.state.position - t : -1) + e
}
const Qr = new Map()
function Jp(e, t) {
  Qr.set(e, t)
}
function Qp(e) {
  const t = Qr.get(e)
  return (Qr.delete(e), t)
}
function ew(e) {
  return typeof e == 'string' || (e && typeof e == 'object')
}
function Jf(e) {
  return typeof e == 'string' || typeof e == 'symbol'
}
let Ye = (function (e) {
  return (
    (e[(e.MATCHER_NOT_FOUND = 1)] = 'MATCHER_NOT_FOUND'),
    (e[(e.NAVIGATION_GUARD_REDIRECT = 2)] = 'NAVIGATION_GUARD_REDIRECT'),
    (e[(e.NAVIGATION_ABORTED = 4)] = 'NAVIGATION_ABORTED'),
    (e[(e.NAVIGATION_CANCELLED = 8)] = 'NAVIGATION_CANCELLED'),
    (e[(e.NAVIGATION_DUPLICATED = 16)] = 'NAVIGATION_DUPLICATED'),
    e
  )
})({})
const Qf = Symbol('')
;(Ye.MATCHER_NOT_FOUND + '',
  Ye.NAVIGATION_GUARD_REDIRECT + '',
  Ye.NAVIGATION_ABORTED + '',
  Ye.NAVIGATION_CANCELLED + '',
  Ye.NAVIGATION_DUPLICATED + '')
function ta(e, t) {
  return Re(new Error(), { type: e, [Qf]: !0 }, t)
}
function Sn(e, t) {
  return e instanceof Error && Qf in e && (t == null || !!(e.type & t))
}
const tw = ['params', 'query', 'hash']
function nw(e) {
  if (typeof e == 'string') return e
  if (e.path != null) return e.path
  const t = {}
  for (const n of tw) n in e && (t[n] = e[n])
  return JSON.stringify(t, null, 2)
}
function ow(e) {
  const t = {}
  if (e === '' || e === '?') return t
  const n = (e[0] === '?' ? e.slice(1) : e).split('&')
  for (let o = 0; o < n.length; ++o) {
    const a = n[o].replace(Yf, ' '),
      i = a.indexOf('='),
      l = qa(i < 0 ? a : a.slice(0, i)),
      r = i < 0 ? null : qa(a.slice(i + 1))
    if (l in t) {
      let s = t[l]
      ;(Jt(s) || (s = t[l] = [s]), s.push(r))
    } else t[l] = r
  }
  return t
}
function ru(e) {
  let t = ''
  for (let n in e) {
    const o = e[n]
    if (((n = Lp(n)), o == null)) {
      o !== void 0 && (t += (t.length ? '&' : '') + n)
      continue
    }
    ;(Jt(o) ? o.map(a => a && Zr(a)) : [o && Zr(o)]).forEach(a => {
      a !== void 0 && ((t += (t.length ? '&' : '') + n), a != null && (t += '=' + a))
    })
  }
  return t
}
function aw(e) {
  const t = {}
  for (const n in e) {
    const o = e[n]
    o !== void 0 &&
      (t[n] = Jt(o) ? o.map(a => (a == null ? null : '' + a)) : o == null ? o : '' + o)
  }
  return t
}
const iw = Symbol(''),
  su = Symbol(''),
  Il = Symbol(''),
  Vs = Symbol(''),
  es = Symbol('')
function ya() {
  let e = []
  function t(o) {
    return (
      e.push(o),
      () => {
        const a = e.indexOf(o)
        a > -1 && e.splice(a, 1)
      }
    )
  }
  function n() {
    e = []
  }
  return { add: t, list: () => e.slice(), reset: n }
}
function Qn(e, t, n, o, a, i = l => l()) {
  const l = o && (o.enterCallbacks[a] = o.enterCallbacks[a] || [])
  return () =>
    new Promise((r, s) => {
      const c = h => {
          h === !1
            ? s(ta(Ye.NAVIGATION_ABORTED, { from: n, to: t }))
            : h instanceof Error
              ? s(h)
              : ew(h)
                ? s(ta(Ye.NAVIGATION_GUARD_REDIRECT, { from: t, to: h }))
                : (l && o.enterCallbacks[a] === l && typeof h == 'function' && l.push(h), r())
        },
        u = i(() => e.call(o && o.instances[a], t, n, c))
      let d = Promise.resolve(u)
      ;(e.length < 3 && (d = d.then(c)), d.catch(h => s(h)))
    })
}
function fr(e, t, n, o, a = i => i()) {
  const i = []
  for (const l of e)
    for (const r in l.components) {
      let s = l.components[r]
      if (!(t !== 'beforeRouteEnter' && !l.instances[r]))
        if (Uf(s)) {
          const c = (s.__vccOpts || s)[t]
          c && i.push(Qn(c, n, o, l, r, a))
        } else {
          let c = s()
          i.push(() =>
            c.then(u => {
              if (!u) throw new Error(`Couldn't resolve component "${r}" at "${l.path}"`)
              const d = kp(u) ? u.default : u
              ;((l.mods[r] = u), (l.components[r] = d))
              const h = (d.__vccOpts || d)[t]
              return h && Qn(h, n, o, l, r, a)()
            })
          )
        }
    }
  return i
}
function lw(e, t) {
  const n = [],
    o = [],
    a = [],
    i = Math.max(t.matched.length, e.matched.length)
  for (let l = 0; l < i; l++) {
    const r = t.matched[l]
    r && (e.matched.find(c => ea(c, r)) ? o.push(r) : n.push(r))
    const s = e.matched[l]
    s && (t.matched.find(c => ea(c, s)) || a.push(s))
  }
  return [n, o, a]
}
/*!
 * vue-router v4.6.4
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */ let rw = () => location.protocol + '//' + location.host
function eh(e, t) {
  const { pathname: n, search: o, hash: a } = t,
    i = e.indexOf('#')
  if (i > -1) {
    let l = a.includes(e.slice(i)) ? e.slice(i).length : 1,
      r = a.slice(l)
    return (r[0] !== '/' && (r = '/' + r), au(r, ''))
  }
  return au(n, e) + o + a
}
function sw(e, t, n, o) {
  let a = [],
    i = [],
    l = null
  const r = ({ state: h }) => {
    const m = eh(e, location),
      y = n.value,
      p = t.value
    let b = 0
    if (h) {
      if (((n.value = m), (t.value = h), l && l === y)) {
        l = null
        return
      }
      b = p ? h.position - p.position : 0
    } else o(m)
    a.forEach(x => {
      x(n.value, y, {
        delta: b,
        type: Jr.pop,
        direction: b ? (b > 0 ? dr.forward : dr.back) : dr.unknown
      })
    })
  }
  function s() {
    l = n.value
  }
  function c(h) {
    a.push(h)
    const m = () => {
      const y = a.indexOf(h)
      y > -1 && a.splice(y, 1)
    }
    return (i.push(m), m)
  }
  function u() {
    if (document.visibilityState === 'hidden') {
      const { history: h } = window
      if (!h.state) return
      h.replaceState(Re({}, h.state, { scroll: Pl() }), '')
    }
  }
  function d() {
    for (const h of i) h()
    ;((i = []),
      window.removeEventListener('popstate', r),
      window.removeEventListener('pagehide', u),
      document.removeEventListener('visibilitychange', u))
  }
  return (
    window.addEventListener('popstate', r),
    window.addEventListener('pagehide', u),
    document.addEventListener('visibilitychange', u),
    { pauseListeners: s, listen: c, destroy: d }
  )
}
function cu(e, t, n, o = !1, a = !1) {
  return {
    back: e,
    current: t,
    forward: n,
    replaced: o,
    position: window.history.length,
    scroll: a ? Pl() : null
  }
}
function cw(e) {
  const { history: t, location: n } = window,
    o = { value: eh(e, n) },
    a = { value: t.state }
  a.value ||
    i(
      o.value,
      {
        back: null,
        current: o.value,
        forward: null,
        position: t.length - 1,
        replaced: !0,
        scroll: null
      },
      !0
    )
  function i(s, c, u) {
    const d = e.indexOf('#'),
      h = d > -1 ? (n.host && document.querySelector('base') ? e : e.slice(d)) + s : rw() + e + s
    try {
      ;(t[u ? 'replaceState' : 'pushState'](c, '', h), (a.value = c))
    } catch (m) {
      ;(console.error(m), n[u ? 'replace' : 'assign'](h))
    }
  }
  function l(s, c) {
    ;(i(
      s,
      Re({}, t.state, cu(a.value.back, s, a.value.forward, !0), c, { position: a.value.position }),
      !0
    ),
      (o.value = s))
  }
  function r(s, c) {
    const u = Re({}, a.value, t.state, { forward: s, scroll: Pl() })
    ;(i(u.current, u, !0),
      i(s, Re({}, cu(o.value, s, null), { position: u.position + 1 }, c), !1),
      (o.value = s))
  }
  return { location: o, state: a, push: r, replace: l }
}
function uw(e) {
  e = Yp(e)
  const t = cw(e),
    n = sw(e, t.state, t.location, t.replace)
  function o(i, l = !0) {
    ;(l || n.pauseListeners(), history.go(i))
  }
  const a = Re({ location: '', base: e, go: o, createHref: qp.bind(null, e) }, t, n)
  return (
    Object.defineProperty(a, 'location', { enumerable: !0, get: () => t.location.value }),
    Object.defineProperty(a, 'state', { enumerable: !0, get: () => t.state.value }),
    a
  )
}
let yo = (function (e) {
  return (
    (e[(e.Static = 0)] = 'Static'),
    (e[(e.Param = 1)] = 'Param'),
    (e[(e.Group = 2)] = 'Group'),
    e
  )
})({})
var Qe = (function (e) {
  return (
    (e[(e.Static = 0)] = 'Static'),
    (e[(e.Param = 1)] = 'Param'),
    (e[(e.ParamRegExp = 2)] = 'ParamRegExp'),
    (e[(e.ParamRegExpEnd = 3)] = 'ParamRegExpEnd'),
    (e[(e.EscapeNext = 4)] = 'EscapeNext'),
    e
  )
})(Qe || {})
const dw = { type: yo.Static, value: '' },
  fw = /[a-zA-Z0-9_]/
function hw(e) {
  if (!e) return [[]]
  if (e === '/') return [[dw]]
  if (!e.startsWith('/')) throw new Error(`Invalid path "${e}"`)
  function t(m) {
    throw new Error(`ERR (${n})/"${c}": ${m}`)
  }
  let n = Qe.Static,
    o = n
  const a = []
  let i
  function l() {
    ;(i && a.push(i), (i = []))
  }
  let r = 0,
    s,
    c = '',
    u = ''
  function d() {
    c &&
      (n === Qe.Static
        ? i.push({ type: yo.Static, value: c })
        : n === Qe.Param || n === Qe.ParamRegExp || n === Qe.ParamRegExpEnd
          ? (i.length > 1 &&
              (s === '*' || s === '+') &&
              t(`A repeatable param (${c}) must be alone in its segment. eg: '/:ids+.`),
            i.push({
              type: yo.Param,
              value: c,
              regexp: u,
              repeatable: s === '*' || s === '+',
              optional: s === '*' || s === '?'
            }))
          : t('Invalid state to consume buffer'),
      (c = ''))
  }
  function h() {
    c += s
  }
  for (; r < e.length;) {
    if (((s = e[r++]), s === '\\' && n !== Qe.ParamRegExp)) {
      ;((o = n), (n = Qe.EscapeNext))
      continue
    }
    switch (n) {
      case Qe.Static:
        s === '/' ? (c && d(), l()) : s === ':' ? (d(), (n = Qe.Param)) : h()
        break
      case Qe.EscapeNext:
        ;(h(), (n = o))
        break
      case Qe.Param:
        s === '('
          ? (n = Qe.ParamRegExp)
          : fw.test(s)
            ? h()
            : (d(), (n = Qe.Static), s !== '*' && s !== '?' && s !== '+' && r--)
        break
      case Qe.ParamRegExp:
        s === ')'
          ? u[u.length - 1] == '\\'
            ? (u = u.slice(0, -1) + s)
            : (n = Qe.ParamRegExpEnd)
          : (u += s)
        break
      case Qe.ParamRegExpEnd:
        ;(d(), (n = Qe.Static), s !== '*' && s !== '?' && s !== '+' && r--, (u = ''))
        break
      default:
        t('Unknown state')
        break
    }
  }
  return (n === Qe.ParamRegExp && t(`Unfinished custom RegExp for param "${c}"`), d(), l(), a)
}
const uu = '[^/]+?',
  mw = { sensitive: !1, strict: !1, start: !0, end: !0 }
var St = (function (e) {
  return (
    (e[(e._multiplier = 10)] = '_multiplier'),
    (e[(e.Root = 90)] = 'Root'),
    (e[(e.Segment = 40)] = 'Segment'),
    (e[(e.SubSegment = 30)] = 'SubSegment'),
    (e[(e.Static = 40)] = 'Static'),
    (e[(e.Dynamic = 20)] = 'Dynamic'),
    (e[(e.BonusCustomRegExp = 10)] = 'BonusCustomRegExp'),
    (e[(e.BonusWildcard = -50)] = 'BonusWildcard'),
    (e[(e.BonusRepeatable = -20)] = 'BonusRepeatable'),
    (e[(e.BonusOptional = -8)] = 'BonusOptional'),
    (e[(e.BonusStrict = 0.7000000000000001)] = 'BonusStrict'),
    (e[(e.BonusCaseSensitive = 0.25)] = 'BonusCaseSensitive'),
    e
  )
})(St || {})
const gw = /[.+*?^${}()[\]/\\]/g
function vw(e, t) {
  const n = Re({}, mw, t),
    o = []
  let a = n.start ? '^' : ''
  const i = []
  for (const c of e) {
    const u = c.length ? [] : [St.Root]
    n.strict && !c.length && (a += '/')
    for (let d = 0; d < c.length; d++) {
      const h = c[d]
      let m = St.Segment + (n.sensitive ? St.BonusCaseSensitive : 0)
      if (h.type === yo.Static)
        (d || (a += '/'), (a += h.value.replace(gw, '\\$&')), (m += St.Static))
      else if (h.type === yo.Param) {
        const { value: y, repeatable: p, optional: b, regexp: x } = h
        i.push({ name: y, repeatable: p, optional: b })
        const g = x || uu
        if (g !== uu) {
          m += St.BonusCustomRegExp
          try {
            ;`${g}`
          } catch (S) {
            throw new Error(`Invalid custom RegExp for param "${y}" (${g}): ` + S.message)
          }
        }
        let C = p ? `((?:${g})(?:/(?:${g}))*)` : `(${g})`
        ;(d || (C = b && c.length < 2 ? `(?:/${C})` : '/' + C),
          b && (C += '?'),
          (a += C),
          (m += St.Dynamic),
          b && (m += St.BonusOptional),
          p && (m += St.BonusRepeatable),
          g === '.*' && (m += St.BonusWildcard))
      }
      u.push(m)
    }
    o.push(u)
  }
  if (n.strict && n.end) {
    const c = o.length - 1
    o[c][o[c].length - 1] += St.BonusStrict
  }
  ;(n.strict || (a += '/?'), n.end ? (a += '$') : n.strict && !a.endsWith('/') && (a += '(?:/|$)'))
  const l = new RegExp(a, n.sensitive ? '' : 'i')
  function r(c) {
    const u = c.match(l),
      d = {}
    if (!u) return null
    for (let h = 1; h < u.length; h++) {
      const m = u[h] || '',
        y = i[h - 1]
      d[y.name] = m && y.repeatable ? m.split('/') : m
    }
    return d
  }
  function s(c) {
    let u = '',
      d = !1
    for (const h of e) {
      ;((!d || !u.endsWith('/')) && (u += '/'), (d = !1))
      for (const m of h)
        if (m.type === yo.Static) u += m.value
        else if (m.type === yo.Param) {
          const { value: y, repeatable: p, optional: b } = m,
            x = y in c ? c[y] : ''
          if (Jt(x) && !p)
            throw new Error(
              `Provided param "${y}" is an array but it is not repeatable (* or + modifiers)`
            )
          const g = Jt(x) ? x.join('/') : x
          if (!g)
            if (b) h.length < 2 && (u.endsWith('/') ? (u = u.slice(0, -1)) : (d = !0))
            else throw new Error(`Missing required param "${y}"`)
          u += g
        }
    }
    return u || '/'
  }
  return { re: l, score: o, keys: i, parse: r, stringify: s }
}
function bw(e, t) {
  let n = 0
  for (; n < e.length && n < t.length;) {
    const o = t[n] - e[n]
    if (o) return o
    n++
  }
  return e.length < t.length
    ? e.length === 1 && e[0] === St.Static + St.Segment
      ? -1
      : 1
    : e.length > t.length
      ? t.length === 1 && t[0] === St.Static + St.Segment
        ? 1
        : -1
      : 0
}
function th(e, t) {
  let n = 0
  const o = e.score,
    a = t.score
  for (; n < o.length && n < a.length;) {
    const i = bw(o[n], a[n])
    if (i) return i
    n++
  }
  if (Math.abs(a.length - o.length) === 1) {
    if (du(o)) return 1
    if (du(a)) return -1
  }
  return a.length - o.length
}
function du(e) {
  const t = e[e.length - 1]
  return e.length > 0 && t[t.length - 1] < 0
}
const yw = { strict: !1, end: !0, sensitive: !1 }
function pw(e, t, n) {
  const o = vw(hw(e.path), n),
    a = Re(o, { record: e, parent: t, children: [], alias: [] })
  return (t && !a.record.aliasOf == !t.record.aliasOf && t.children.push(a), a)
}
function ww(e, t) {
  const n = [],
    o = new Map()
  t = ou(yw, t)
  function a(d) {
    return o.get(d)
  }
  function i(d, h, m) {
    const y = !m,
      p = hu(d)
    p.aliasOf = m && m.record
    const b = ou(t, d),
      x = [p]
    if ('alias' in d) {
      const S = typeof d.alias == 'string' ? [d.alias] : d.alias
      for (const v of S)
        x.push(
          hu(
            Re({}, p, {
              components: m ? m.record.components : p.components,
              path: v,
              aliasOf: m ? m.record : p
            })
          )
        )
    }
    let g, C
    for (const S of x) {
      const { path: v } = S
      if (h && v[0] !== '/') {
        const _ = h.record.path,
          P = _[_.length - 1] === '/' ? '' : '/'
        S.path = h.record.path + (v && P + v)
      }
      if (
        ((g = pw(S, h, b)),
        m
          ? m.alias.push(g)
          : ((C = C || g), C !== g && C.alias.push(g), y && d.name && !mu(g) && l(d.name)),
        nh(g) && s(g),
        p.children)
      ) {
        const _ = p.children
        for (let P = 0; P < _.length; P++) i(_[P], g, m && m.children[P])
      }
      m = m || g
    }
    return C
      ? () => {
          l(C)
        }
      : Va
  }
  function l(d) {
    if (Jf(d)) {
      const h = o.get(d)
      h && (o.delete(d), n.splice(n.indexOf(h), 1), h.children.forEach(l), h.alias.forEach(l))
    } else {
      const h = n.indexOf(d)
      h > -1 &&
        (n.splice(h, 1),
        d.record.name && o.delete(d.record.name),
        d.children.forEach(l),
        d.alias.forEach(l))
    }
  }
  function r() {
    return n
  }
  function s(d) {
    const h = Cw(d, n)
    ;(n.splice(h, 0, d), d.record.name && !mu(d) && o.set(d.record.name, d))
  }
  function c(d, h) {
    let m,
      y = {},
      p,
      b
    if ('name' in d && d.name) {
      if (((m = o.get(d.name)), !m)) throw ta(Ye.MATCHER_NOT_FOUND, { location: d })
      ;((b = m.record.name),
        (y = Re(
          fu(
            h.params,
            m.keys
              .filter(C => !C.optional)
              .concat(m.parent ? m.parent.keys.filter(C => C.optional) : [])
              .map(C => C.name)
          ),
          d.params &&
            fu(
              d.params,
              m.keys.map(C => C.name)
            )
        )),
        (p = m.stringify(y)))
    } else if (d.path != null)
      ((p = d.path), (m = n.find(C => C.re.test(p))), m && ((y = m.parse(p)), (b = m.record.name)))
    else {
      if (((m = h.name ? o.get(h.name) : n.find(C => C.re.test(h.path))), !m))
        throw ta(Ye.MATCHER_NOT_FOUND, { location: d, currentLocation: h })
      ;((b = m.record.name), (y = Re({}, h.params, d.params)), (p = m.stringify(y)))
    }
    const x = []
    let g = m
    for (; g;) (x.unshift(g.record), (g = g.parent))
    return { name: b, path: p, params: y, matched: x, meta: Sw(x) }
  }
  e.forEach(d => i(d))
  function u() {
    ;((n.length = 0), o.clear())
  }
  return {
    addRoute: i,
    resolve: c,
    removeRoute: l,
    clearRoutes: u,
    getRoutes: r,
    getRecordMatcher: a
  }
}
function fu(e, t) {
  const n = {}
  for (const o of t) o in e && (n[o] = e[o])
  return n
}
function hu(e) {
  const t = {
    path: e.path,
    redirect: e.redirect,
    name: e.name,
    meta: e.meta || {},
    aliasOf: e.aliasOf,
    beforeEnter: e.beforeEnter,
    props: xw(e),
    children: e.children || [],
    instances: {},
    leaveGuards: new Set(),
    updateGuards: new Set(),
    enterCallbacks: {},
    components: 'components' in e ? e.components || null : e.component && { default: e.component }
  }
  return (Object.defineProperty(t, 'mods', { value: {} }), t)
}
function xw(e) {
  const t = {},
    n = e.props || !1
  if ('component' in e) t.default = n
  else for (const o in e.components) t[o] = typeof n == 'object' ? n[o] : n
  return t
}
function mu(e) {
  for (; e;) {
    if (e.record.aliasOf) return !0
    e = e.parent
  }
  return !1
}
function Sw(e) {
  return e.reduce((t, n) => Re(t, n.meta), {})
}
function Cw(e, t) {
  let n = 0,
    o = t.length
  for (; n !== o;) {
    const i = (n + o) >> 1
    th(e, t[i]) < 0 ? (o = i) : (n = i + 1)
  }
  const a = _w(e)
  return (a && (o = t.lastIndexOf(a, o - 1)), o)
}
function _w(e) {
  let t = e
  for (; (t = t.parent);) if (nh(t) && th(e, t) === 0) return t
}
function nh({ record: e }) {
  return !!(e.name || (e.components && Object.keys(e.components).length) || e.redirect)
}
function gu(e) {
  const t = dt(Il),
    n = dt(Vs),
    o = B(() => {
      const s = Vt(e.to)
      return t.resolve(s)
    }),
    a = B(() => {
      const { matched: s } = o.value,
        { length: c } = s,
        u = s[c - 1],
        d = n.matched
      if (!u || !d.length) return -1
      const h = d.findIndex(ea.bind(null, u))
      if (h > -1) return h
      const m = vu(s[c - 2])
      return c > 1 && vu(u) === m && d[d.length - 1].path !== m
        ? d.findIndex(ea.bind(null, s[c - 2]))
        : h
    }),
    i = B(() => a.value > -1 && Pw(n.params, o.value.params)),
    l = B(() => a.value > -1 && a.value === n.matched.length - 1 && Zf(n.params, o.value.params))
  function r(s = {}) {
    if (Aw(s)) {
      const c = t[Vt(e.replace) ? 'replace' : 'push'](Vt(e.to)).catch(Va)
      return (
        e.viewTransition &&
          typeof document < 'u' &&
          'startViewTransition' in document &&
          document.startViewTransition(() => c),
        c
      )
    }
    return Promise.resolve()
  }
  return { route: o, href: B(() => o.value.href), isActive: i, isExactActive: l, navigate: r }
}
function Tw(e) {
  return e.length === 1 ? e[0] : e
}
const Ew = U({
    name: 'RouterLink',
    compatConfig: { MODE: 3 },
    props: {
      to: { type: [String, Object], required: !0 },
      replace: Boolean,
      activeClass: String,
      exactActiveClass: String,
      custom: Boolean,
      ariaCurrentValue: { type: String, default: 'page' },
      viewTransition: Boolean
    },
    useLink: gu,
    setup(e, { slots: t }) {
      const n = He(gu(e)),
        { options: o } = dt(Il),
        a = B(() => ({
          [bu(e.activeClass, o.linkActiveClass, 'router-link-active')]: n.isActive,
          [bu(e.exactActiveClass, o.linkExactActiveClass, 'router-link-exact-active')]:
            n.isExactActive
        }))
      return () => {
        const i = t.default && Tw(t.default(n))
        return e.custom
          ? i
          : Bs(
              'a',
              {
                'aria-current': n.isExactActive ? e.ariaCurrentValue : null,
                href: n.href,
                onClick: n.navigate,
                class: a.value
              },
              i
            )
      }
    }
  }),
  kw = Ew
function Aw(e) {
  if (
    !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) &&
    !e.defaultPrevented &&
    !(e.button !== void 0 && e.button !== 0)
  ) {
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const t = e.currentTarget.getAttribute('target')
      if (/\b_blank\b/i.test(t)) return
    }
    return (e.preventDefault && e.preventDefault(), !0)
  }
}
function Pw(e, t) {
  for (const n in t) {
    const o = t[n],
      a = e[n]
    if (typeof o == 'string') {
      if (o !== a) return !1
    } else if (!Jt(a) || a.length !== o.length || o.some((i, l) => i.valueOf() !== a[l].valueOf()))
      return !1
  }
  return !0
}
function vu(e) {
  return e ? (e.aliasOf ? e.aliasOf.path : e.path) : ''
}
const bu = (e, t, n) => e ?? t ?? n,
  Iw = U({
    name: 'RouterView',
    inheritAttrs: !1,
    props: { name: { type: String, default: 'default' }, route: Object },
    compatConfig: { MODE: 3 },
    setup(e, { attrs: t, slots: n }) {
      const o = dt(es),
        a = B(() => e.route || o.value),
        i = dt(su, 0),
        l = B(() => {
          let c = Vt(i)
          const { matched: u } = a.value
          let d
          for (; (d = u[c]) && !d.components;) c++
          return c
        }),
        r = B(() => a.value.matched[l.value])
      ;(hn(
        su,
        B(() => l.value + 1)
      ),
        hn(iw, r),
        hn(es, a))
      const s = M()
      return (
        te(
          () => [s.value, r.value, e.name],
          ([c, u, d], [h, m, y]) => {
            ;(u &&
              ((u.instances[d] = c),
              m &&
                m !== u &&
                c &&
                c === h &&
                (u.leaveGuards.size || (u.leaveGuards = m.leaveGuards),
                u.updateGuards.size || (u.updateGuards = m.updateGuards))),
              c && u && (!m || !ea(u, m) || !h) && (u.enterCallbacks[d] || []).forEach(p => p(c)))
          },
          { flush: 'post' }
        ),
        () => {
          const c = a.value,
            u = e.name,
            d = r.value,
            h = d && d.components[u]
          if (!h) return yu(n.default, { Component: h, route: c })
          const m = d.props[u],
            y = m ? (m === !0 ? c.params : typeof m == 'function' ? m(c) : m) : null,
            b = Bs(
              h,
              Re({}, y, t, {
                onVnodeUnmounted: x => {
                  x.component.isUnmounted && (d.instances[u] = null)
                },
                ref: s
              })
            )
          return yu(n.default, { Component: b, route: c }) || b
        }
      )
    }
  })
function yu(e, t) {
  if (!e) return null
  const n = e(t)
  return n.length === 1 ? n[0] : n
}
const Ow = Iw
function Rw(e) {
  const t = ww(e.routes, e),
    n = e.parseQuery || ow,
    o = e.stringifyQuery || ru,
    a = e.history,
    i = ya(),
    l = ya(),
    r = ya(),
    s = py(Wn)
  let c = Wn
  jo && e.scrollBehavior && 'scrollRestoration' in history && (history.scrollRestoration = 'manual')
  const u = cr.bind(null, E => '' + E),
    d = cr.bind(null, Fp),
    h = cr.bind(null, qa)
  function m(E, F) {
    let V, Q
    return (Jf(E) ? ((V = t.getRecordMatcher(E)), (Q = F)) : (Q = E), t.addRoute(Q, V))
  }
  function y(E) {
    const F = t.getRecordMatcher(E)
    F && t.removeRoute(F)
  }
  function p() {
    return t.getRoutes().map(E => E.record)
  }
  function b(E) {
    return !!t.getRecordMatcher(E)
  }
  function x(E, F) {
    if (((F = Re({}, F || s.value)), typeof E == 'string')) {
      const $ = ur(n, E, F.path),
        N = t.resolve({ path: $.path }, F),
        Y = a.createHref($.fullPath)
      return Re($, N, { params: h(N.params), hash: qa($.hash), redirectedFrom: void 0, href: Y })
    }
    let V
    if (E.path != null) V = Re({}, E, { path: ur(n, E.path, F.path).path })
    else {
      const $ = Re({}, E.params)
      for (const N in $) $[N] == null && delete $[N]
      ;((V = Re({}, E, { params: d($) })), (F.params = d(F.params)))
    }
    const Q = t.resolve(V, F),
      fe = E.hash || ''
    Q.params = u(h(Q.params))
    const k = jp(o, Re({}, E, { hash: Vp(fe), path: Q.path })),
      R = a.createHref(k)
    return Re({ fullPath: k, hash: fe, query: o === ru ? aw(E.query) : E.query || {} }, Q, {
      redirectedFrom: void 0,
      href: R
    })
  }
  function g(E) {
    return typeof E == 'string' ? ur(n, E, s.value.path) : Re({}, E)
  }
  function C(E, F) {
    if (c !== E) return ta(Ye.NAVIGATION_CANCELLED, { from: F, to: E })
  }
  function S(E) {
    return P(E)
  }
  function v(E) {
    return S(Re(g(E), { replace: !0 }))
  }
  function _(E, F) {
    const V = E.matched[E.matched.length - 1]
    if (V && V.redirect) {
      const { redirect: Q } = V
      let fe = typeof Q == 'function' ? Q(E, F) : Q
      return (
        typeof fe == 'string' &&
          ((fe = fe.includes('?') || fe.includes('#') ? (fe = g(fe)) : { path: fe }),
          (fe.params = {})),
        Re({ query: E.query, hash: E.hash, params: fe.path != null ? {} : E.params }, fe)
      )
    }
  }
  function P(E, F) {
    const V = (c = x(E)),
      Q = s.value,
      fe = E.state,
      k = E.force,
      R = E.replace === !0,
      $ = _(V, Q)
    if ($)
      return P(
        Re(g($), { state: typeof $ == 'object' ? Re({}, fe, $.state) : fe, force: k, replace: R }),
        F || V
      )
    const N = V
    N.redirectedFrom = F
    let Y
    return (
      !k &&
        Wp(o, Q, V) &&
        ((Y = ta(Ye.NAVIGATION_DUPLICATED, { to: N, from: Q })), re(Q, Q, !0, !1)),
      (Y ? Promise.resolve(Y) : O(N, Q))
        .catch(W => (Sn(W) ? (Sn(W, Ye.NAVIGATION_GUARD_REDIRECT) ? W : ke(W)) : ae(W, N, Q)))
        .then(W => {
          if (W) {
            if (Sn(W, Ye.NAVIGATION_GUARD_REDIRECT))
              return P(
                Re({ replace: R }, g(W.to), {
                  state: typeof W.to == 'object' ? Re({}, fe, W.to.state) : fe,
                  force: k
                }),
                F || N
              )
          } else W = T(N, Q, !0, R, fe)
          return (I(N, Q, W), W)
        })
    )
  }
  function w(E, F) {
    const V = C(E, F)
    return V ? Promise.reject(V) : Promise.resolve()
  }
  function A(E) {
    const F = me.values().next().value
    return F && typeof F.runWithContext == 'function' ? F.runWithContext(E) : E()
  }
  function O(E, F) {
    let V
    const [Q, fe, k] = lw(E, F)
    V = fr(Q.reverse(), 'beforeRouteLeave', E, F)
    for (const $ of Q)
      $.leaveGuards.forEach(N => {
        V.push(Qn(N, E, F))
      })
    const R = w.bind(null, E, F)
    return (
      V.push(R),
      ue(V)
        .then(() => {
          V = []
          for (const $ of i.list()) V.push(Qn($, E, F))
          return (V.push(R), ue(V))
        })
        .then(() => {
          V = fr(fe, 'beforeRouteUpdate', E, F)
          for (const $ of fe)
            $.updateGuards.forEach(N => {
              V.push(Qn(N, E, F))
            })
          return (V.push(R), ue(V))
        })
        .then(() => {
          V = []
          for (const $ of k)
            if ($.beforeEnter)
              if (Jt($.beforeEnter)) for (const N of $.beforeEnter) V.push(Qn(N, E, F))
              else V.push(Qn($.beforeEnter, E, F))
          return (V.push(R), ue(V))
        })
        .then(
          () => (
            E.matched.forEach($ => ($.enterCallbacks = {})),
            (V = fr(k, 'beforeRouteEnter', E, F, A)),
            V.push(R),
            ue(V)
          )
        )
        .then(() => {
          V = []
          for (const $ of l.list()) V.push(Qn($, E, F))
          return (V.push(R), ue(V))
        })
        .catch($ => (Sn($, Ye.NAVIGATION_CANCELLED) ? $ : Promise.reject($)))
    )
  }
  function I(E, F, V) {
    r.list().forEach(Q => A(() => Q(E, F, V)))
  }
  function T(E, F, V, Q, fe) {
    const k = C(E, F)
    if (k) return k
    const R = F === Wn,
      $ = jo ? history.state : {}
    ;(V &&
      (Q || R
        ? a.replace(E.fullPath, Re({ scroll: R && $ && $.scroll }, fe))
        : a.push(E.fullPath, fe)),
      (s.value = E),
      re(E, F, V, R),
      ke())
  }
  let D
  function z() {
    D ||
      (D = a.listen((E, F, V) => {
        if (!G.listening) return
        const Q = x(E),
          fe = _(Q, G.currentRoute.value)
        if (fe) {
          P(Re(fe, { replace: !0, force: !0 }), Q).catch(Va)
          return
        }
        c = Q
        const k = s.value
        ;(jo && Jp(lu(k.fullPath, V.delta), Pl()),
          O(Q, k)
            .catch(R =>
              Sn(R, Ye.NAVIGATION_ABORTED | Ye.NAVIGATION_CANCELLED)
                ? R
                : Sn(R, Ye.NAVIGATION_GUARD_REDIRECT)
                  ? (P(Re(g(R.to), { force: !0 }), Q)
                      .then($ => {
                        Sn($, Ye.NAVIGATION_ABORTED | Ye.NAVIGATION_DUPLICATED) &&
                          !V.delta &&
                          V.type === Jr.pop &&
                          a.go(-1, !1)
                      })
                      .catch(Va),
                    Promise.reject())
                  : (V.delta && a.go(-V.delta, !1), ae(R, Q, k))
            )
            .then(R => {
              ;((R = R || T(Q, k, !1)),
                R &&
                  (V.delta && !Sn(R, Ye.NAVIGATION_CANCELLED)
                    ? a.go(-V.delta, !1)
                    : V.type === Jr.pop &&
                      Sn(R, Ye.NAVIGATION_ABORTED | Ye.NAVIGATION_DUPLICATED) &&
                      a.go(-1, !1)),
                I(Q, k, R))
            })
            .catch(Va))
      }))
  }
  let oe = ya(),
    L = ya(),
    ee
  function ae(E, F, V) {
    ke(E)
    const Q = L.list()
    return (Q.length ? Q.forEach(fe => fe(E, F, V)) : console.error(E), Promise.reject(E))
  }
  function _e() {
    return ee && s.value !== Wn
      ? Promise.resolve()
      : new Promise((E, F) => {
          oe.add([E, F])
        })
  }
  function ke(E) {
    return (ee || ((ee = !E), z(), oe.list().forEach(([F, V]) => (E ? V(E) : F())), oe.reset()), E)
  }
  function re(E, F, V, Q) {
    const { scrollBehavior: fe } = e
    if (!jo || !fe) return Promise.resolve()
    const k =
      (!V && Qp(lu(E.fullPath, 0))) || ((Q || !V) && history.state && history.state.scroll) || null
    return Se()
      .then(() => fe(E, F, k))
      .then(R => R && Zp(R))
      .catch(R => ae(R, E, F))
  }
  const H = E => a.go(E)
  let ne
  const me = new Set(),
    G = {
      currentRoute: s,
      listening: !0,
      addRoute: m,
      removeRoute: y,
      clearRoutes: t.clearRoutes,
      hasRoute: b,
      getRoutes: p,
      resolve: x,
      options: e,
      push: S,
      replace: v,
      go: H,
      back: () => H(-1),
      forward: () => H(1),
      beforeEach: i.add,
      beforeResolve: l.add,
      afterEach: r.add,
      onError: L.add,
      isReady: _e,
      install(E) {
        ;(E.component('RouterLink', kw),
          E.component('RouterView', Ow),
          (E.config.globalProperties.$router = G),
          Object.defineProperty(E.config.globalProperties, '$route', {
            enumerable: !0,
            get: () => Vt(s)
          }),
          jo && !ne && s.value === Wn && ((ne = !0), S(a.location).catch(Q => {})))
        const F = {}
        for (const Q in Wn) Object.defineProperty(F, Q, { get: () => s.value[Q], enumerable: !0 })
        ;(E.provide(Il, G), E.provide(Vs, Qd(F)), E.provide(es, s))
        const V = E.unmount
        ;(me.add(E),
          (E.unmount = function () {
            ;(me.delete(E),
              me.size < 1 && ((c = Wn), D && D(), (D = null), (s.value = Wn), (ne = !1), (ee = !1)),
              V())
          }))
      }
    }
  function ue(E) {
    return E.reduce((F, V) => F.then(() => A(V)), Promise.resolve())
  }
  return G
}
function hk() {
  return dt(Il)
}
function mk(e) {
  return dt(Vs)
}
const hr = 'app_token',
  pu = 'app_theme',
  Mi = {
    getToken() {
      return localStorage.getItem(hr)
    },
    setToken(e) {
      localStorage.setItem(hr, e)
    },
    removeToken() {
      localStorage.removeItem(hr)
    },
    getTheme() {
      return localStorage.getItem(pu)
    },
    setTheme(e) {
      localStorage.setItem(pu, e)
    }
  },
  oh = Rw({
    history: uw(),
    routes: [
      { path: '/', redirect: '/home' },
      {
        path: '/login',
        name: 'Login',
        component: () =>
          Ke(() => import('./LoginView-DKEW63gp.js'), __vite__mapDeps([0, 1, 2, 3, 4, 5])),
        meta: { title: '登录', guest: !0 }
      },
      {
        path: '/register',
        name: 'Register',
        component: () =>
          Ke(() => import('./RegisterView-BLkQEd8T.js'), __vite__mapDeps([6, 1, 2, 3, 4, 7])),
        meta: { title: '注册', guest: !0 }
      },
      {
        path: '/home',
        name: 'Home',
        component: () =>
          Ke(
            () => import('./AiHomePage-CsMTzAsh.js'),
            __vite__mapDeps([8, 9, 2, 10, 11, 12, 13, 14])
          ),
        meta: { title: '首页', requiresAuth: !0 }
      },
      {
        path: '/personal-center',
        name: 'PersonalCenter',
        component: () =>
          Ke(() => import('./PersonalCenter-CgDp-kQr.js'), __vite__mapDeps([15, 12, 2, 13, 9, 16])),
        meta: { title: '个人中心', requiresAuth: !0 }
      },
      {
        path: '/me',
        name: 'Profile',
        component: () =>
          Ke(() => import('./ProfileView-D6BdPWq1.js'), __vite__mapDeps([17, 1, 2, 18])),
        meta: { title: '设置', requiresAuth: !0 }
      },
      {
        path: '/workspace',
        component: () =>
          Ke(() => import('./TabLayout-CPz4OoTE.js'), __vite__mapDeps([19, 10, 11, 20])),
        meta: { requiresAuth: !0 },
        redirect: '/workspace/search',
        children: [
          {
            path: 'search',
            name: 'search',
            component: () =>
              Ke(() => import('./SearchView-DF57gNzp.js'), __vite__mapDeps([21, 22])),
            meta: { title: '搜索' }
          },
          {
            path: 'image',
            name: 'image',
            component: () => Ke(() => import('./ImageView-DR4c9S_C.js'), __vite__mapDeps([23, 24])),
            meta: { title: '绘图' }
          },
          {
            path: 'files',
            name: 'files',
            component: () => Ke(() => import('./FilesView-BV0TM7ka.js'), __vite__mapDeps([25, 26])),
            meta: { title: '文件' }
          },
          {
            path: 'code',
            name: 'code',
            component: () => Ke(() => import('./CodeView-CwTecvIE.js'), __vite__mapDeps([27, 28])),
            meta: { title: '代码' }
          },
          {
            path: 'history',
            name: 'history',
            component: () =>
              Ke(() => import('./HistoryView-MZsenzc-.js'), __vite__mapDeps([29, 12, 2, 30])),
            meta: { title: '历史' }
          },
          {
            path: 'settings',
            name: 'settings',
            component: () =>
              Ke(() => import('./SettingsView--jQp8DEn.js'), __vite__mapDeps([31, 32])),
            meta: { title: '设置' },
            children: [
              {
                path: 'providers',
                name: 'provider-list',
                component: () =>
                  Ke(
                    () => import('./ProviderList-zOMKbCs0.js'),
                    __vite__mapDeps([33, 34, 35, 2, 36])
                  ),
                meta: { title: '供应商管理' }
              },
              {
                path: 'providers/new',
                name: 'provider-create',
                component: () =>
                  Ke(
                    () => import('./ProviderForm-C08ZKv1j.js'),
                    __vite__mapDeps([37, 34, 35, 2, 38])
                  ),
                meta: { title: '新增供应商' }
              },
              {
                path: 'providers/:id',
                name: 'provider-detail',
                component: () =>
                  Ke(
                    () => import('./ProviderDetail-BMxyliOm.js'),
                    __vite__mapDeps([39, 34, 35, 2, 40])
                  ),
                meta: { title: '供应商详情' }
              },
              {
                path: 'providers/:id/edit',
                name: 'provider-edit',
                component: () =>
                  Ke(
                    () => import('./ProviderForm-C08ZKv1j.js'),
                    __vite__mapDeps([37, 34, 35, 2, 38])
                  ),
                meta: { title: '编辑供应商' }
              },
              {
                path: 'models',
                name: 'model-manager',
                component: () =>
                  Ke(() => import('./ModelManager-DJrN8EN2.js'), __vite__mapDeps([41, 9, 2, 42])),
                meta: { title: '模型管理' }
              },
              {
                path: 'tools',
                name: 'tool-manager',
                component: () =>
                  Ke(() => import('./ToolManager-BdJhozn_.js'), __vite__mapDeps([43, 2, 44])),
                meta: { title: '工具管理' }
              },
              {
                path: 'devices',
                name: 'device-manager',
                component: () =>
                  Ke(() => import('./DeviceManager-RRMUrkYq.js'), __vite__mapDeps([45, 2, 46])),
                meta: { title: '设备连接' }
              },
              {
                path: 'ai-resources',
                name: 'ai-resources',
                component: () =>
                  Ke(
                    () => import('./AiResourcesView-706CC_GZ.js'),
                    __vite__mapDeps([47, 2, 35, 48])
                  ),
                meta: { title: 'AI 资源' }
              },
              {
                path: 'orgs',
                name: 'org-manager',
                component: () =>
                  Ke(() => import('./OrgView-CAo4WHLb.js'), __vite__mapDeps([49, 2, 1, 50])),
                meta: { title: '组织管理' }
              },
              {
                path: 'api-keys',
                name: 'api-keys',
                component: () =>
                  Ke(() => import('./ApiKeysView-OLmJJ-uN.js'), __vite__mapDeps([51, 2, 52])),
                meta: { title: 'API Key' }
              }
            ]
          }
        ]
      }
    ]
  })
oh.beforeEach((e, t, n) => {
  document.title = (e.meta.title || 'App') + ' - Android Agent'
  const o = Mi.getToken()
  e.meta.requiresAuth && !o ? n('/login') : e.meta.guest && o ? n('/home') : n()
})
/*!
 * pinia v2.3.1
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */ let ah
const Ol = e => (ah = e),
  ih = Symbol()
function ts(e) {
  return (
    e &&
    typeof e == 'object' &&
    Object.prototype.toString.call(e) === '[object Object]' &&
    typeof e.toJSON != 'function'
  )
}
var La
;(function (e) {
  ;((e.direct = 'direct'), (e.patchObject = 'patch object'), (e.patchFunction = 'patch function'))
})(La || (La = {}))
function Dw() {
  const e = Vd(!0),
    t = e.run(() => M({}))
  let n = [],
    o = []
  const a = Ts({
    install(i) {
      ;(Ol(a),
        (a._a = i),
        i.provide(ih, a),
        (i.config.globalProperties.$pinia = a),
        o.forEach(l => n.push(l)),
        (o = []))
    },
    use(i) {
      return (this._a ? n.push(i) : o.push(i), this)
    },
    _p: n,
    _a: null,
    _e: e,
    _s: new Map(),
    state: t
  })
  return a
}
const lh = () => {}
function wu(e, t, n, o = lh) {
  e.push(t)
  const a = () => {
    const i = e.indexOf(t)
    i > -1 && (e.splice(i, 1), o())
  }
  return (!n && Ld() && ey(a), a)
}
function Po(e, ...t) {
  e.slice().forEach(n => {
    n(...t)
  })
}
const $w = e => e(),
  xu = Symbol(),
  mr = Symbol()
function ns(e, t) {
  e instanceof Map && t instanceof Map
    ? t.forEach((n, o) => e.set(o, n))
    : e instanceof Set && t instanceof Set && t.forEach(e.add, e)
  for (const n in t) {
    if (!t.hasOwnProperty(n)) continue
    const o = t[n],
      a = e[n]
    ts(a) && ts(o) && e.hasOwnProperty(n) && !Ue(o) && !On(o) ? (e[n] = ns(a, o)) : (e[n] = o)
  }
  return e
}
const Bw = Symbol()
function Mw(e) {
  return !ts(e) || !e.hasOwnProperty(Bw)
}
const { assign: Zn } = Object
function Vw(e) {
  return !!(Ue(e) && e.effect)
}
function Lw(e, t, n, o) {
  const { state: a, actions: i, getters: l } = t,
    r = n.state.value[e]
  let s
  function c() {
    r || (n.state.value[e] = a ? a() : {})
    const u = Sy(n.state.value[e])
    return Zn(
      u,
      i,
      Object.keys(l || {}).reduce(
        (d, h) => (
          (d[h] = Ts(
            B(() => {
              Ol(n)
              const m = n._s.get(e)
              return l[h].call(m, m)
            })
          )),
          d
        ),
        {}
      )
    )
  }
  return ((s = rh(e, c, t, n, o, !0)), s)
}
function rh(e, t, n = {}, o, a, i) {
  let l
  const r = Zn({ actions: {} }, n),
    s = { deep: !0 }
  let c,
    u,
    d = [],
    h = [],
    m
  const y = o.state.value[e]
  !i && !y && (o.state.value[e] = {})
  let p
  function b(w) {
    let A
    ;((c = u = !1),
      typeof w == 'function'
        ? (w(o.state.value[e]), (A = { type: La.patchFunction, storeId: e, events: m }))
        : (ns(o.state.value[e], w),
          (A = { type: La.patchObject, payload: w, storeId: e, events: m })))
    const O = (p = Symbol())
    ;(Se().then(() => {
      p === O && (c = !0)
    }),
      (u = !0),
      Po(d, A, o.state.value[e]))
  }
  const x = i
    ? function () {
        const { state: A } = n,
          O = A ? A() : {}
        this.$patch(I => {
          Zn(I, O)
        })
      }
    : lh
  function g() {
    ;(l.stop(), (d = []), (h = []), o._s.delete(e))
  }
  const C = (w, A = '') => {
      if (xu in w) return ((w[mr] = A), w)
      const O = function () {
        Ol(o)
        const I = Array.from(arguments),
          T = [],
          D = []
        function z(ee) {
          T.push(ee)
        }
        function oe(ee) {
          D.push(ee)
        }
        Po(h, { args: I, name: O[mr], store: v, after: z, onError: oe })
        let L
        try {
          L = w.apply(this && this.$id === e ? this : v, I)
        } catch (ee) {
          throw (Po(D, ee), ee)
        }
        return L instanceof Promise
          ? L.then(ee => (Po(T, ee), ee)).catch(ee => (Po(D, ee), Promise.reject(ee)))
          : (Po(T, L), L)
      }
      return ((O[xu] = !0), (O[mr] = A), O)
    },
    S = {
      _p: o,
      $id: e,
      $onAction: wu.bind(null, h),
      $patch: b,
      $reset: x,
      $subscribe(w, A = {}) {
        const O = wu(d, w, A.detached, () => I()),
          I = l.run(() =>
            te(
              () => o.state.value[e],
              T => {
                ;(A.flush === 'sync' ? u : c) && w({ storeId: e, type: La.direct, events: m }, T)
              },
              Zn({}, s, A)
            )
          )
        return O
      },
      $dispose: g
    },
    v = He(S)
  o._s.set(e, v)
  const P = ((o._a && o._a.runWithContext) || $w)(() =>
    o._e.run(() => (l = Vd()).run(() => t({ action: C })))
  )
  for (const w in P) {
    const A = P[w]
    if ((Ue(A) && !Vw(A)) || On(A))
      i || (y && Mw(A) && (Ue(A) ? (A.value = y[w]) : ns(A, y[w])), (o.state.value[e][w] = A))
    else if (typeof A == 'function') {
      const O = C(A, w)
      ;((P[w] = O), (r.actions[w] = A))
    }
  }
  return (
    Zn(v, P),
    Zn(Pe(v), P),
    Object.defineProperty(v, '$state', {
      get: () => o.state.value[e],
      set: w => {
        b(A => {
          Zn(A, w)
        })
      }
    }),
    o._p.forEach(w => {
      Zn(
        v,
        l.run(() => w({ store: v, app: o._a, pinia: o, options: r }))
      )
    }),
    y && i && n.hydrate && n.hydrate(v.$state, y),
    (c = !0),
    (u = !0),
    v
  )
}
/*! #__NO_SIDE_EFFECTS__ */ function Nw(e, t, n) {
  let o, a
  const i = typeof t == 'function'
  typeof e == 'string' ? ((o = e), (a = i ? n : t)) : ((a = e), (o = e.id))
  function l(r, s) {
    const c = Ry()
    return (
      (r = r || (c ? dt(ih, null) : null)),
      r && Ol(r),
      (r = ah),
      r._s.has(o) || (i ? rh(o, t, a, r) : Lw(o, a, r)),
      r._s.get(o)
    )
  }
  return ((l.$id = o), l)
}
const Fw = Nw('theme', () => {
  const e = M(Mi.getTheme() === 'dark')
  function t() {
    const a = Mi.getTheme()
    ;(a
      ? (e.value = a === 'dark')
      : (e.value = window.matchMedia('(prefers-color-scheme: dark)').matches),
      o())
  }
  function n() {
    ;((e.value = !e.value), o())
  }
  function o() {
    const a = e.value ? 'dark' : 'light'
    ;(document.documentElement.setAttribute('data-theme', a), Mi.setTheme(a))
  }
  return (te(e, o), { isDark: e, init: t, toggle: n })
})
function os() {}
const he = Object.assign,
  Ot = typeof window < 'u',
  Qt = e => e !== null && typeof e == 'object',
  Ee = e => e != null,
  na = e => typeof e == 'function',
  Ls = e => Qt(e) && na(e.then) && na(e.catch),
  Xa = e => Object.prototype.toString.call(e) === '[object Date]' && !Number.isNaN(e.getTime())
function sh(e) {
  return (
    (e = e.replace(/[^-|\d]/g, '')),
    /^((\+86)|(86))?(1)\d{10}$/.test(e) || /^0[0-9-]{10,13}$/.test(e)
  )
}
const ch = e => typeof e == 'number' || /^\d+(\.\d+)?$/.test(e),
  Hw = () => (Ot ? /ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) : !1)
function Su(e, t) {
  const n = t.split('.')
  let o = e
  return (
    n.forEach(a => {
      var i
      o = Qt(o) && (i = o[a]) != null ? i : ''
    }),
    o
  )
}
function Ie(e, t, n) {
  return t.reduce((o, a) => ((!n || e[a] !== void 0) && (o[a] = e[a]), o), {})
}
const mn = (e, t) => JSON.stringify(e) === JSON.stringify(t),
  tl = e => (Array.isArray(e) ? e : [e]),
  zw = e => e.reduce((t, n) => t.concat(n), []),
  je = null,
  q = [Number, String],
  j = { type: Boolean, default: !0 },
  lt = e => ({ type: e, required: !0 }),
  ze = () => ({ type: Array, default: () => [] }),
  Je = e => ({ type: Number, default: e }),
  se = e => ({ type: q, default: e }),
  J = e => ({ type: String, default: e })
var oo = typeof window < 'u'
function vt(e) {
  return oo ? requestAnimationFrame(e) : -1
}
function Rl(e) {
  oo && cancelAnimationFrame(e)
}
function to(e) {
  vt(() => vt(e))
}
var jw = e => e === window,
  Cu = (e, t) => ({ top: 0, left: 0, right: e, bottom: t, width: e, height: t }),
  Oe = e => {
    const t = Vt(e)
    if (jw(t)) {
      const n = t.innerWidth,
        o = t.innerHeight
      return Cu(n, o)
    }
    return t != null && t.getBoundingClientRect ? t.getBoundingClientRect() : Cu(0, 0)
  }
function Ww(e = !1) {
  const t = M(e)
  return [
    t,
    (o = !t.value) => {
      t.value = o
    }
  ]
}
function ht(e) {
  const t = dt(e, null)
  if (t) {
    const n = Et(),
      { link: o, unlink: a, internalChildren: i } = t
    ;(o(n), sa(() => a(n)))
    const l = B(() => i.indexOf(n))
    return { parent: t, index: l }
  }
  return { parent: null, index: M(-1) }
}
function Uw(e) {
  const t = [],
    n = o => {
      Array.isArray(o) &&
        o.forEach(a => {
          var i
          _o(a) &&
            (t.push(a),
            (i = a.component) != null &&
              i.subTree &&
              (t.push(a.component.subTree), n(a.component.subTree.children)),
            a.children && n(a.children))
        })
    }
  return (n(e), t)
}
var _u = (e, t) => {
  const n = e.indexOf(t)
  return n === -1
    ? e.findIndex(o => t.key !== void 0 && t.key !== null && o.type === t.type && o.key === t.key)
    : n
}
function Kw(e, t, n) {
  const o = Uw(e.subTree.children)
  n.sort((i, l) => _u(o, i.vnode) - _u(o, l.vnode))
  const a = n.map(i => i.proxy)
  t.sort((i, l) => {
    const r = a.indexOf(i),
      s = a.indexOf(l)
    return r - s
  })
}
function yt(e) {
  const t = He([]),
    n = He([]),
    o = Et()
  return {
    children: t,
    linkChildren: i => {
      hn(
        e,
        Object.assign(
          {
            link: s => {
              s.proxy && (n.push(s), t.push(s.proxy), Kw(o, t, n))
            },
            unlink: s => {
              const c = n.indexOf(s)
              ;(t.splice(c, 1), n.splice(c, 1))
            },
            children: t,
            internalChildren: n
          },
          i
        )
      )
    }
  }
}
var as = 1e3,
  is = 60 * as,
  ls = 60 * is,
  Tu = 24 * ls
function Yw(e) {
  const t = Math.floor(e / Tu),
    n = Math.floor((e % Tu) / ls),
    o = Math.floor((e % ls) / is),
    a = Math.floor((e % is) / as),
    i = Math.floor(e % as)
  return { total: e, days: t, hours: n, minutes: o, seconds: a, milliseconds: i }
}
function Gw(e, t) {
  return Math.floor(e / 1e3) === Math.floor(t / 1e3)
}
function qw(e) {
  let t, n, o, a
  const i = M(e.time),
    l = B(() => Yw(i.value)),
    r = () => {
      ;((o = !1), Rl(t))
    },
    s = () => Math.max(n - Date.now(), 0),
    c = p => {
      var b, x
      ;((i.value = p),
        (b = e.onChange) == null || b.call(e, l.value),
        p === 0 && (r(), (x = e.onFinish) == null || x.call(e)))
    },
    u = () => {
      t = vt(() => {
        o && (c(s()), i.value > 0 && u())
      })
    },
    d = () => {
      t = vt(() => {
        if (o) {
          const p = s()
          ;((!Gw(p, i.value) || p === 0) && c(p), i.value > 0 && d())
        }
      })
    },
    h = () => {
      oo && (e.millisecond ? u() : d())
    },
    m = () => {
      o || ((n = Date.now() + i.value), (o = !0), h())
    },
    y = (p = e.time) => {
      ;(r(), (i.value = p))
    }
  return (
    en(r),
    yn(() => {
      a && ((o = !0), (a = !1), h())
    }),
    pn(() => {
      o && (r(), (a = !0))
    }),
    { start: m, pause: r, reset: y, current: l }
  )
}
function ca(e) {
  let t
  ;(We(() => {
    ;(e(),
      Se(() => {
        t = !0
      }))
  }),
    yn(() => {
      t && e()
    }))
}
function Xe(e, t, n = {}) {
  if (!oo) return
  const { target: o = window, passive: a = !1, capture: i = !1 } = n
  let l = !1,
    r
  const s = d => {
      if (l) return
      const h = Vt(d)
      h && !r && (h.addEventListener(e, t, { capture: i, passive: a }), (r = !0))
    },
    c = d => {
      if (l) return
      const h = Vt(d)
      h && r && (h.removeEventListener(e, t, i), (r = !1))
    }
  ;(sa(() => c(o)), pn(() => c(o)), ca(() => s(o)))
  let u
  return (
    Ue(o) &&
      (u = te(o, (d, h) => {
        ;(c(h), s(d))
      })),
    () => {
      ;(u == null || u(), c(o), (l = !0))
    }
  )
}
function Dl(e, t, n = {}) {
  if (!oo) return
  const { eventName: o = 'click' } = n
  Xe(
    o,
    i => {
      ;(Array.isArray(e) ? e : [e]).every(s => {
        const c = Vt(s)
        return c && !c.contains(i.target)
      }) && t(i)
    },
    { target: document }
  )
}
var mi, gr
function Xw() {
  if (!mi && ((mi = M(0)), (gr = M(0)), oo)) {
    const e = () => {
      ;((mi.value = window.innerWidth), (gr.value = window.innerHeight))
    }
    ;(e(),
      window.addEventListener('resize', e, { passive: !0 }),
      window.addEventListener('orientationchange', e, { passive: !0 }))
  }
  return { width: mi, height: gr }
}
var Zw = /scroll|auto|overlay/i,
  uh = oo ? window : void 0
function Jw(e) {
  return e.tagName !== 'HTML' && e.tagName !== 'BODY' && e.nodeType === 1
}
function nl(e, t = uh) {
  let n = e
  for (; n && n !== t && Jw(n);) {
    const { overflowY: o } = window.getComputedStyle(n)
    if (Zw.test(o)) return n
    n = n.parentNode
  }
  return t
}
function ua(e, t = uh) {
  const n = M()
  return (
    We(() => {
      e.value && (n.value = nl(e.value, t))
    }),
    n
  )
}
var gi
function Qw() {
  if (!gi && ((gi = M('visible')), oo)) {
    const e = () => {
      gi.value = document.hidden ? 'hidden' : 'visible'
    }
    ;(e(), window.addEventListener('visibilitychange', e))
  }
  return gi
}
var dh = Symbol('van-field')
function ao(e) {
  const t = dt(dh, null)
  t &&
    !t.customValue.value &&
    ((t.customValue.value = e),
    te(e, () => {
      ;(t.resetValidation(), t.validateWithTrigger('onChange'))
    }))
}
function Bn(e) {
  const t = 'scrollTop' in e ? e.scrollTop : e.pageYOffset
  return Math.max(t, 0)
}
function ol(e, t) {
  'scrollTop' in e ? (e.scrollTop = t) : e.scrollTo(e.scrollX, t)
}
function So() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
}
function Za(e) {
  ;(ol(window, e), ol(document.body, e))
}
function Eu(e, t) {
  if (e === window) return 0
  const n = t ? Bn(t) : So()
  return Oe(e).top + n
}
const ex = Hw()
function fh() {
  ex && Za(So())
}
const Ns = e => e.stopPropagation()
function Fe(e, t) {
  ;((typeof e.cancelable != 'boolean' || e.cancelable) && e.preventDefault(), t && Ns(e))
}
function To(e) {
  const t = Vt(e)
  if (!t) return !1
  const n = window.getComputedStyle(t),
    o = n.display === 'none',
    a = t.offsetParent === null && n.position !== 'fixed'
  return o || a
}
const { width: qt, height: Lt } = Xw()
function tx(e) {
  const t = window.getComputedStyle(e)
  return (
    t.transform !== 'none' ||
    t.perspective !== 'none' ||
    ['transform', 'perspective', 'filter'].some(n => (t.willChange || '').includes(n))
  )
}
function nx(e) {
  let t = e.parentElement
  for (; t;) {
    if (t && t.tagName !== 'HTML' && t.tagName !== 'BODY' && tx(t)) return t
    t = t.parentElement
  }
  return null
}
function pe(e) {
  if (Ee(e)) return ch(e) ? `${e}px` : String(e)
}
function Fn(e) {
  if (Ee(e)) {
    if (Array.isArray(e)) return { width: pe(e[0]), height: pe(e[1]) }
    const t = pe(e)
    return { width: t, height: t }
  }
}
function Hn(e) {
  const t = {}
  return (e !== void 0 && (t.zIndex = +e), t)
}
let vr
function ox() {
  if (!vr) {
    const e = document.documentElement,
      t = e.style.fontSize || window.getComputedStyle(e).fontSize
    vr = parseFloat(t)
  }
  return vr
}
function ax(e) {
  return ((e = e.replace(/rem/g, '')), +e * ox())
}
function ix(e) {
  return ((e = e.replace(/vw/g, '')), (+e * qt.value) / 100)
}
function lx(e) {
  return ((e = e.replace(/vh/g, '')), (+e * Lt.value) / 100)
}
function Fs(e) {
  if (typeof e == 'number') return e
  if (Ot) {
    if (e.includes('rem')) return ax(e)
    if (e.includes('vw')) return ix(e)
    if (e.includes('vh')) return lx(e)
  }
  return parseFloat(e)
}
const rx = /-(\w)/g,
  hh = e => e.replace(rx, (t, n) => n.toUpperCase()),
  sx = e =>
    e
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '')
function Yt(e, t = 2) {
  let n = e + ''
  for (; n.length < t;) n = '0' + n
  return n
}
const it = (e, t, n) => Math.min(Math.max(e, t), n)
function ku(e, t, n) {
  const o = e.indexOf(t)
  return o === -1
    ? e
    : t === '-' && o !== 0
      ? e.slice(0, o)
      : e.slice(0, o + 1) + e.slice(o).replace(n, '')
}
function rs(e, t = !0, n = !0) {
  ;(t ? (e = ku(e, '.', /\./g)) : (e = e.split('.')[0]),
    n ? (e = ku(e, '-', /-/g)) : (e = e.replace(/-/, '')))
  const o = t ? /[^-0-9.]/g : /[^-0-9]/g
  return e.replace(o, '')
}
function mh(e, t) {
  return Math.round((e + t) * 1e10) / 1e10
}
const { hasOwnProperty: cx } = Object.prototype
function ux(e, t, n) {
  const o = t[n]
  Ee(o) && (!cx.call(e, n) || !Qt(o) ? (e[n] = o) : (e[n] = gh(Object(e[n]), o)))
}
function gh(e, t) {
  return (
    Object.keys(t).forEach(n => {
      ux(e, t, n)
    }),
    e
  )
}
var dx = {
  name: '姓名',
  tel: '电话',
  save: '保存',
  clear: '清空',
  undo: '撤销',
  cancel: '取消',
  confirm: '确认',
  delete: '删除',
  loading: '加载中...',
  noCoupon: '暂无优惠券',
  nameEmpty: '请填写姓名',
  addContact: '添加联系人',
  telInvalid: '请填写正确的电话',
  vanCalendar: {
    end: '结束',
    start: '开始',
    title: '日期选择',
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    monthTitle: (e, t) => `${e}年${t}月`,
    rangePrompt: e => `最多选择 ${e} 天`
  },
  vanCascader: { select: '请选择' },
  vanPagination: { prev: '上一页', next: '下一页' },
  vanPullRefresh: { pulling: '下拉即可刷新...', loosing: '释放即可刷新...' },
  vanSubmitBar: { label: '合计:' },
  vanCoupon: { unlimited: '无门槛', discount: e => `${e}折`, condition: e => `满${e}元可用` },
  vanCouponCell: { title: '优惠券', count: e => `${e}张可用` },
  vanCouponList: {
    exchange: '兑换',
    close: '不使用',
    enable: '可用',
    disabled: '不可用',
    placeholder: '输入优惠码'
  },
  vanAddressEdit: {
    area: '地区',
    areaEmpty: '请选择地区',
    addressEmpty: '请填写详细地址',
    addressDetail: '详细地址',
    defaultAddress: '设为默认收货地址'
  },
  vanAddressList: { add: '新增地址' }
}
const Au = M('zh-CN'),
  Pu = He({ 'zh-CN': dx }),
  Hs = {
    messages() {
      return Pu[Au.value]
    },
    use(e, t) {
      ;((Au.value = e), this.add({ [e]: t }))
    },
    add(e = {}) {
      gh(Pu, e)
    }
  }
var fx = Hs
function hx(e) {
  const t = hh(e) + '.'
  return (n, ...o) => {
    const a = fx.messages(),
      i = Su(a, t + n) || Su(a, n)
    return na(i) ? i(...o) : i
  }
}
function ss(e, t) {
  return t
    ? typeof t == 'string'
      ? ` ${e}--${t}`
      : Array.isArray(t)
        ? t.reduce((n, o) => n + ss(e, o), '')
        : Object.keys(t).reduce((n, o) => n + (t[o] ? ss(e, o) : ''), '')
    : ''
}
function mx(e) {
  return (t, n) => (
    t && typeof t != 'string' && ((n = t), (t = '')),
    (t = t ? `${e}__${t}` : e),
    `${t}${ss(t, n)}`
  )
}
function K(e) {
  const t = `van-${e}`
  return [t, mx(t), hx(t)]
}
const zn = 'van-hairline',
  vh = `${zn}--top`,
  bh = `${zn}--left`,
  gx = `${zn}--right`,
  zs = `${zn}--bottom`,
  Na = `${zn}--surround`,
  $l = `${zn}--top-bottom`,
  vx = `${zn}-unset--top-bottom`,
  bt = 'van-haptics-feedback',
  yh = Symbol('van-form'),
  ph = 500,
  Iu = 5
function io(e, { args: t = [], done: n, canceled: o, error: a }) {
  if (e) {
    const i = e.apply(null, t)
    Ls(i)
      ? i
          .then(l => {
            l ? n() : o && o()
          })
          .catch(a || os)
      : i
        ? n()
        : o && o()
  } else n()
}
function Z(e) {
  return (
    (e.install = t => {
      const { name: n } = e
      n && (t.component(n, e), t.component(hh(`-${n}`), e))
    }),
    e
  )
}
function al(e, t) {
  return e.reduce((n, o) => (Math.abs(n - t) < Math.abs(o - t) ? n : o))
}
const wh = Symbol()
function Bl(e) {
  const t = dt(wh, null)
  t &&
    te(t, n => {
      n && e()
    })
}
const xh = (e, t) => {
  const n = M(),
    o = () => {
      n.value = Oe(e).height
    }
  return (
    We(() => {
      if ((Se(o), t)) for (let a = 1; a <= 3; a++) setTimeout(o, 100 * a)
    }),
    Bl(() => Se(o)),
    te([qt, Lt], o),
    n
  )
}
function Ml(e, t) {
  const n = xh(e, !0)
  return o =>
    f('div', { class: t('placeholder'), style: { height: n.value ? `${n.value}px` : void 0 } }, [
      o()
    ])
}
const [Sh, Ou] = K('action-bar'),
  js = Symbol(Sh),
  Ch = { placeholder: Boolean, safeAreaInsetBottom: j }
var bx = U({
  name: Sh,
  props: Ch,
  setup(e, { slots: t }) {
    const n = M(),
      o = Ml(n, Ou),
      { linkChildren: a } = yt(js)
    a()
    const i = () => {
      var l
      return f(
        'div',
        { ref: n, class: [Ou(), { 'van-safe-area-bottom': e.safeAreaInsetBottom }] },
        [(l = t.default) == null ? void 0 : l.call(t)]
      )
    }
    return () => (e.placeholder ? o(i) : i())
  }
})
const Ws = Z(bx)
function Te(e) {
  const t = Et()
  t && he(t.proxy, e)
}
const lo = { to: [String, Object], url: String, replace: Boolean }
function _h({ to: e, url: t, replace: n, $router: o }) {
  e && o ? o[n ? 'replace' : 'push'](e) : t && (n ? location.replace(t) : (location.href = t))
}
function ko() {
  const e = Et().proxy
  return () => _h(e)
}
const [yx, Ru] = K('badge'),
  Th = {
    dot: Boolean,
    max: q,
    tag: J('div'),
    color: String,
    offset: Array,
    content: q,
    showZero: j,
    position: J('top-right')
  }
var px = U({
  name: yx,
  props: Th,
  setup(e, { slots: t }) {
    const n = () => {
        if (t.content) return !0
        const { content: r, showZero: s } = e
        return Ee(r) && r !== '' && (s || (r !== 0 && r !== '0'))
      },
      o = () => {
        const { dot: r, max: s, content: c } = e
        if (!r && n()) return t.content ? t.content() : Ee(s) && ch(c) && +c > +s ? `${s}+` : c
      },
      a = r => (r.startsWith('-') ? r.replace('-', '') : `-${r}`),
      i = B(() => {
        const r = { background: e.color }
        if (e.offset) {
          const [s, c] = e.offset,
            { position: u } = e,
            [d, h] = u.split('-')
          t.default
            ? (typeof c == 'number'
                ? (r[d] = pe(d === 'top' ? c : -c))
                : (r[d] = d === 'top' ? pe(c) : a(c)),
              typeof s == 'number'
                ? (r[h] = pe(h === 'left' ? s : -s))
                : (r[h] = h === 'left' ? pe(s) : a(s)))
            : ((r.marginTop = pe(c)), (r.marginLeft = pe(s)))
        }
        return r
      }),
      l = () => {
        if (n() || e.dot)
          return f(
            'div',
            { class: Ru([e.position, { dot: e.dot, fixed: !!t.default }]), style: i.value },
            [o()]
          )
      }
    return () => {
      if (t.default) {
        const { tag: r } = e
        return f(r, { class: Ru('wrapper') }, { default: () => [t.default(), l()] })
      }
      return l()
    }
  }
})
const ro = Z(px)
let Eh = 2e3
const kh = () => ++Eh,
  Ah = e => {
    Eh = e
  },
  [Ph, wx] = K('config-provider'),
  Ih = Symbol(Ph),
  Oh = {
    tag: J('div'),
    theme: J('light'),
    zIndex: Number,
    themeVars: Object,
    themeVarsDark: Object,
    themeVarsLight: Object,
    themeVarsScope: J('local'),
    iconPrefix: String
  }
function xx(e) {
  return e.replace(/([a-zA-Z])(\d)/g, '$1-$2')
}
function Sx(e) {
  const t = {}
  return (
    Object.keys(e).forEach(n => {
      const o = xx(sx(n))
      t[`--van-${o}`] = e[n]
    }),
    t
  )
}
function vi(e = {}, t = {}) {
  ;(Object.keys(e).forEach(n => {
    e[n] !== t[n] && document.documentElement.style.setProperty(n, e[n])
  }),
    Object.keys(t).forEach(n => {
      e[n] || document.documentElement.style.removeProperty(n)
    }))
}
var Cx = U({
  name: Ph,
  props: Oh,
  setup(e, { slots: t }) {
    const n = B(() =>
      Sx(he({}, e.themeVars, e.theme === 'dark' ? e.themeVarsDark : e.themeVarsLight))
    )
    if (Ot) {
      const o = () => {
          document.documentElement.classList.add(`van-theme-${e.theme}`)
        },
        a = (i = e.theme) => {
          document.documentElement.classList.remove(`van-theme-${i}`)
        }
      ;(te(
        () => e.theme,
        (i, l) => {
          ;(l && a(l), o())
        },
        { immediate: !0 }
      ),
        yn(o),
        pn(a),
        en(a),
        te(n, (i, l) => {
          e.themeVarsScope === 'global' && vi(i, l)
        }),
        te(
          () => e.themeVarsScope,
          (i, l) => {
            ;(l === 'global' && vi({}, n.value), i === 'global' && vi(n.value, {}))
          }
        ),
        e.themeVarsScope === 'global' && vi(n.value, {}))
    }
    return (
      hn(Ih, e),
      ra(() => {
        e.zIndex !== void 0 && Ah(e.zIndex)
      }),
      () =>
        f(
          e.tag,
          { class: wx(), style: e.themeVarsScope === 'local' ? n.value : void 0 },
          {
            default: () => {
              var o
              return [(o = t.default) == null ? void 0 : o.call(t)]
            }
          }
        )
    )
  }
})
const [_x, Du] = K('icon'),
  Tx = e => (e == null ? void 0 : e.includes('/')),
  Rh = {
    dot: Boolean,
    tag: J('i'),
    name: String,
    size: q,
    badge: q,
    color: String,
    badgeProps: Object,
    classPrefix: String
  }
var Ex = U({
  name: _x,
  props: Rh,
  setup(e, { slots: t }) {
    const n = dt(Ih, null),
      o = B(() => e.classPrefix || (n == null ? void 0 : n.iconPrefix) || Du())
    return () => {
      const { tag: a, dot: i, name: l, size: r, badge: s, color: c } = e,
        u = Tx(l)
      return f(
        ro,
        Ce(
          {
            dot: i,
            tag: a,
            class: [o.value, u ? '' : `${o.value}-${l}`],
            style: { color: c, fontSize: pe(r) },
            content: s
          },
          e.badgeProps
        ),
        {
          default: () => {
            var d
            return [
              (d = t.default) == null ? void 0 : d.call(t),
              u && f('img', { class: Du('image'), src: l }, null)
            ]
          }
        }
      )
    }
  }
})
const we = Z(Ex)
var kx = we
const [Ax, Fa] = K('loading'),
  Px = Array(12)
    .fill(null)
    .map((e, t) => f('i', { class: Fa('line', String(t + 1)) }, null)),
  Ix = f('svg', { class: Fa('circular'), viewBox: '25 25 50 50' }, [
    f('circle', { cx: '50', cy: '50', r: '20', fill: 'none' }, null)
  ]),
  Dh = {
    size: q,
    type: J('circular'),
    color: String,
    vertical: Boolean,
    textSize: q,
    textColor: String
  }
var Ox = U({
  name: Ax,
  props: Dh,
  setup(e, { slots: t }) {
    const n = B(() => he({ color: e.color }, Fn(e.size))),
      o = () => {
        const i = e.type === 'spinner' ? Px : Ix
        return f('span', { class: Fa('spinner', e.type), style: n.value }, [t.icon ? t.icon() : i])
      },
      a = () => {
        var i
        if (t.default)
          return f(
            'span',
            {
              class: Fa('text'),
              style: { fontSize: pe(e.textSize), color: (i = e.textColor) != null ? i : e.color }
            },
            [t.default()]
          )
      }
    return () => {
      const { type: i, vertical: l } = e
      return f('div', { class: Fa([i, { vertical: l }]), 'aria-live': 'polite', 'aria-busy': !0 }, [
        o(),
        a()
      ])
    }
  }
})
const Ft = Z(Ox),
  [Rx, Io] = K('button'),
  $h = he({}, lo, {
    tag: J('button'),
    text: String,
    icon: String,
    type: J('default'),
    size: J('normal'),
    color: String,
    block: Boolean,
    plain: Boolean,
    round: Boolean,
    square: Boolean,
    loading: Boolean,
    hairline: Boolean,
    disabled: Boolean,
    iconPrefix: String,
    nativeType: J('button'),
    loadingSize: q,
    loadingText: String,
    loadingType: String,
    iconPosition: J('left')
  })
var Dx = U({
  name: Rx,
  props: $h,
  emits: ['click'],
  setup(e, { emit: t, slots: n }) {
    const o = ko(),
      a = () =>
        n.loading
          ? n.loading()
          : f(Ft, { size: e.loadingSize, type: e.loadingType, class: Io('loading') }, null),
      i = () => {
        if (e.loading) return a()
        if (n.icon) return f('div', { class: Io('icon') }, [n.icon()])
        if (e.icon)
          return f(we, { name: e.icon, class: Io('icon'), classPrefix: e.iconPrefix }, null)
      },
      l = () => {
        let c
        if ((e.loading ? (c = e.loadingText) : (c = n.default ? n.default() : e.text), c))
          return f('span', { class: Io('text') }, [c])
      },
      r = () => {
        const { color: c, plain: u } = e
        if (c) {
          const d = { color: u ? c : 'white' }
          return (
            u || (d.background = c),
            c.includes('gradient') ? (d.border = 0) : (d.borderColor = c),
            d
          )
        }
      },
      s = c => {
        e.loading ? Fe(c) : e.disabled || (t('click', c), o())
      }
    return () => {
      const {
          tag: c,
          type: u,
          size: d,
          block: h,
          round: m,
          plain: y,
          square: p,
          loading: b,
          disabled: x,
          hairline: g,
          nativeType: C,
          iconPosition: S
        } = e,
        v = [
          Io([
            u,
            d,
            { plain: y, block: h, round: m, square: p, loading: b, disabled: x, hairline: g }
          ]),
          { [Na]: g }
        ]
      return f(
        c,
        { type: C, class: v, style: r(), disabled: x, onClick: s },
        {
          default: () => [
            f('div', { class: Io('content') }, [S === 'left' && i(), l(), S === 'right' && i()])
          ]
        }
      )
    }
  }
})
const st = Z(Dx),
  [$x, Bx] = K('action-bar-button'),
  Bh = he({}, lo, {
    type: String,
    text: String,
    icon: String,
    color: String,
    loading: Boolean,
    disabled: Boolean
  })
var Mx = U({
  name: $x,
  props: Bh,
  setup(e, { slots: t }) {
    const n = ko(),
      { parent: o, index: a } = ht(js),
      i = B(() => {
        if (o) {
          const r = o.children[a.value - 1]
          return !(r && 'isButton' in r)
        }
      }),
      l = B(() => {
        if (o) {
          const r = o.children[a.value + 1]
          return !(r && 'isButton' in r)
        }
      })
    return (
      Te({ isButton: !0 }),
      () => {
        const { type: r, icon: s, text: c, color: u, loading: d, disabled: h } = e
        return f(
          st,
          {
            class: Bx([r, { last: l.value, first: i.value }]),
            size: 'large',
            type: r,
            icon: s,
            color: u,
            loading: d,
            disabled: h,
            onClick: n
          },
          { default: () => [t.default ? t.default() : c] }
        )
      }
    )
  }
})
const il = Z(Mx),
  [Vx, br] = K('action-bar-icon'),
  Mh = he({}, lo, {
    dot: Boolean,
    text: String,
    icon: String,
    color: String,
    badge: q,
    iconClass: je,
    badgeProps: Object,
    iconPrefix: String,
    disabled: Boolean
  })
var Lx = U({
  name: Vx,
  props: Mh,
  setup(e, { slots: t }) {
    const n = ko()
    ht(js)
    const o = () => {
        const {
          dot: i,
          badge: l,
          icon: r,
          color: s,
          iconClass: c,
          badgeProps: u,
          iconPrefix: d
        } = e
        return t.icon
          ? f(ro, Ce({ dot: i, class: br('icon'), content: l }, u), { default: t.icon })
          : f(
              we,
              {
                tag: 'div',
                dot: i,
                name: r,
                badge: l,
                color: s,
                class: [br('icon'), c],
                badgeProps: u,
                classPrefix: d
              },
              null
            )
      },
      a = () => {
        e.disabled || n()
      }
    return () =>
      f(
        'div',
        {
          role: 'button',
          class: br({ disabled: e.disabled }),
          tabindex: e.disabled ? -1 : 0,
          onClick: a
        },
        [o(), t.default ? t.default() : e.text]
      )
  }
})
const Vh = Z(Lx),
  da = {
    show: Boolean,
    zIndex: q,
    overlay: j,
    duration: q,
    teleport: [String, Object],
    lockScroll: j,
    lazyRender: j,
    beforeClose: Function,
    overlayProps: Object,
    overlayStyle: Object,
    overlayClass: je,
    transitionAppear: Boolean,
    closeOnClickOverlay: j
  },
  Us = Object.keys(da)
function Nx(e, t) {
  return e > t ? 'horizontal' : t > e ? 'vertical' : ''
}
function Ht() {
  const e = M(0),
    t = M(0),
    n = M(0),
    o = M(0),
    a = M(0),
    i = M(0),
    l = M(''),
    r = M(!0),
    s = () => l.value === 'vertical',
    c = () => l.value === 'horizontal',
    u = () => {
      ;((n.value = 0), (o.value = 0), (a.value = 0), (i.value = 0), (l.value = ''), (r.value = !0))
    }
  return {
    move: m => {
      const y = m.touches[0]
      ;((n.value = (y.clientX < 0 ? 0 : y.clientX) - e.value),
        (o.value = y.clientY - t.value),
        (a.value = Math.abs(n.value)),
        (i.value = Math.abs(o.value)))
      const p = 10
      ;((!l.value || (a.value < p && i.value < p)) && (l.value = Nx(a.value, i.value)),
        r.value && (a.value > Iu || i.value > Iu) && (r.value = !1))
    },
    start: m => {
      ;(u(), (e.value = m.touches[0].clientX), (t.value = m.touches[0].clientY))
    },
    reset: u,
    startX: e,
    startY: t,
    deltaX: n,
    deltaY: o,
    offsetX: a,
    offsetY: i,
    direction: l,
    isVertical: s,
    isHorizontal: c,
    isTap: r
  }
}
let pa = 0
const $u = 'van-overflow-hidden'
function Lh(e, t) {
  const n = Ht(),
    o = '01',
    a = '10',
    i = u => {
      n.move(u)
      const d = n.deltaY.value > 0 ? a : o
      let h = nl(u.target, e.value)
      for (; h.scrollHeight <= h.offsetHeight && h !== e.value && h.parentElement;)
        h = nl(h.parentElement, e.value)
      const { scrollHeight: m, offsetHeight: y, scrollTop: p } = h
      let b = '11'
      ;(p === 0 ? (b = y >= m ? '00' : '01') : p + y >= m && (b = '10'),
        b !== '11' && n.isVertical() && !(parseInt(b, 2) & parseInt(d, 2)) && Fe(u, !0))
    },
    l = () => {
      ;(document.addEventListener('touchstart', n.start),
        document.addEventListener('touchmove', i, { passive: !1 }),
        pa || document.body.classList.add($u),
        pa++)
    },
    r = () => {
      pa &&
        (document.removeEventListener('touchstart', n.start),
        document.removeEventListener('touchmove', i),
        pa--,
        pa || document.body.classList.remove($u))
    },
    s = () => t() && l(),
    c = () => t() && r()
  ;(ca(s),
    pn(c),
    en(c),
    te(t, u => {
      u ? l() : r()
    }))
}
function Ks(e) {
  const t = M(!1)
  return (
    te(
      e,
      n => {
        n && (t.value = n)
      },
      { immediate: !0 }
    ),
    n => () => (t.value ? n() : null)
  )
}
const ll = () => {
    var e
    const { scopeId: t } = ((e = Et()) == null ? void 0 : e.vnode) || {}
    return t ? { [t]: '' } : null
  },
  [Fx, Hx] = K('overlay'),
  Nh = {
    show: Boolean,
    zIndex: q,
    duration: q,
    className: je,
    lockScroll: j,
    lazyRender: j,
    customStyle: Object,
    teleport: [String, Object]
  }
var zx = U({
  name: Fx,
  inheritAttrs: !1,
  props: Nh,
  setup(e, { attrs: t, slots: n }) {
    const o = M(),
      a = Ks(() => e.show || !e.lazyRender),
      i = r => {
        e.lockScroll && Fe(r, !0)
      },
      l = a(() => {
        var r
        const s = he(Hn(e.zIndex), e.customStyle)
        return (
          Ee(e.duration) && (s.animationDuration = `${e.duration}s`),
          rt(
            f('div', Ce({ ref: o, style: s, class: [Hx(), e.className] }, t), [
              (r = n.default) == null ? void 0 : r.call(n)
            ]),
            [[ft, e.show]]
          )
        )
      })
    return (
      Xe('touchmove', i, { target: o }),
      () => {
        const r = f(oi, { name: 'van-fade', appear: !0 }, { default: l })
        return e.teleport ? f(Eo, { to: e.teleport }, { default: () => [r] }) : r
      }
    )
  }
})
const Ys = Z(zx),
  Fh = he({}, da, {
    round: Boolean,
    position: J('center'),
    closeIcon: J('cross'),
    closeable: Boolean,
    transition: String,
    iconPrefix: String,
    closeOnPopstate: Boolean,
    closeIconPosition: J('top-right'),
    destroyOnClose: Boolean,
    safeAreaInsetTop: Boolean,
    safeAreaInsetBottom: Boolean
  }),
  [jx, Bu] = K('popup')
var Wx = U({
  name: jx,
  inheritAttrs: !1,
  props: Fh,
  emits: [
    'open',
    'close',
    'opened',
    'closed',
    'keydown',
    'update:show',
    'clickOverlay',
    'clickCloseIcon'
  ],
  setup(e, { emit: t, attrs: n, slots: o }) {
    let a, i
    const l = M(),
      r = M(),
      s = Ks(() => e.show || !e.lazyRender),
      c = B(() => {
        const _ = { zIndex: l.value }
        if (Ee(e.duration)) {
          const P = e.position === 'center' ? 'animationDuration' : 'transitionDuration'
          _[P] = `${e.duration}s`
        }
        return _
      }),
      u = () => {
        a || ((a = !0), (l.value = e.zIndex !== void 0 ? +e.zIndex : kh()), t('open'))
      },
      d = () => {
        a &&
          io(e.beforeClose, {
            done() {
              ;((a = !1), t('close'), t('update:show', !1))
            }
          })
      },
      h = _ => {
        ;(t('clickOverlay', _), e.closeOnClickOverlay && d())
      },
      m = () => {
        if (e.overlay) {
          const _ = he(
            {
              show: e.show,
              class: e.overlayClass,
              zIndex: l.value,
              duration: e.duration,
              customStyle: e.overlayStyle,
              role: e.closeOnClickOverlay ? 'button' : void 0,
              tabindex: e.closeOnClickOverlay ? 0 : void 0
            },
            e.overlayProps
          )
          return f(Ys, Ce(_, ll(), { onClick: h }), { default: o['overlay-content'] })
        }
      },
      y = _ => {
        ;(t('clickCloseIcon', _), d())
      },
      p = () => {
        if (e.closeable)
          return f(
            we,
            {
              role: 'button',
              tabindex: 0,
              name: e.closeIcon,
              class: [Bu('close-icon', e.closeIconPosition), bt],
              classPrefix: e.iconPrefix,
              onClick: y
            },
            null
          )
      }
    let b
    const x = () => {
        ;(b && clearTimeout(b),
          (b = setTimeout(() => {
            t('opened')
          })))
      },
      g = () => t('closed'),
      C = _ => t('keydown', _),
      S = s(() => {
        var _
        const {
          destroyOnClose: P,
          round: w,
          position: A,
          safeAreaInsetTop: O,
          safeAreaInsetBottom: I,
          show: T
        } = e
        if (!(!T && P))
          return rt(
            f(
              'div',
              Ce(
                {
                  ref: r,
                  style: c.value,
                  role: 'dialog',
                  tabindex: 0,
                  class: [
                    Bu({ round: w, [A]: A }),
                    { 'van-safe-area-top': O, 'van-safe-area-bottom': I }
                  ],
                  onKeydown: C
                },
                n,
                ll()
              ),
              [(_ = o.default) == null ? void 0 : _.call(o), p()]
            ),
            [[ft, T]]
          )
      }),
      v = () => {
        const { position: _, transition: P, transitionAppear: w } = e,
          A = _ === 'center' ? 'van-fade' : `van-popup-slide-${_}`
        return f(oi, { name: P || A, appear: w, onAfterEnter: x, onAfterLeave: g }, { default: S })
      }
    return (
      te(
        () => e.show,
        _ => {
          ;(_ &&
            !a &&
            (u(),
            n.tabindex === 0 &&
              Se(() => {
                var P
                ;(P = r.value) == null || P.focus()
              })),
            !_ && a && ((a = !1), t('close')))
        }
      ),
      Te({ popupRef: r }),
      Lh(r, () => e.show && e.lockScroll),
      Xe('popstate', () => {
        e.closeOnPopstate && (d(), (i = !1))
      }),
      We(() => {
        e.show && u()
      }),
      yn(() => {
        i && (t('update:show', !0), (i = !1))
      }),
      pn(() => {
        e.show && e.teleport && (d(), (i = !0))
      }),
      hn(wh, () => e.show),
      () =>
        e.teleport
          ? f(Eo, { to: e.teleport }, { default: () => [m(), v()] })
          : f(qe, null, [m(), v()])
    )
  }
})
const zt = Z(Wx),
  [Ux, Dt] = K('action-sheet'),
  Hh = he({}, da, {
    title: String,
    round: j,
    actions: ze(),
    closeIcon: J('cross'),
    closeable: j,
    cancelText: String,
    description: String,
    closeOnPopstate: j,
    closeOnClickAction: Boolean,
    safeAreaInsetBottom: j
  }),
  Kx = [...Us, 'round', 'closeOnPopstate', 'safeAreaInsetBottom']
var Yx = U({
  name: Ux,
  props: Hh,
  emits: ['select', 'cancel', 'update:show'],
  setup(e, { slots: t, emit: n }) {
    const o = d => n('update:show', d),
      a = () => {
        ;(o(!1), n('cancel'))
      },
      i = () => {
        if (e.title)
          return f('div', { class: Dt('header') }, [
            e.title,
            e.closeable && f(we, { name: e.closeIcon, class: [Dt('close'), bt], onClick: a }, null)
          ])
      },
      l = () => {
        if (t.cancel || e.cancelText)
          return [
            f('div', { class: Dt('gap') }, null),
            f('button', { type: 'button', class: Dt('cancel'), onClick: a }, [
              t.cancel ? t.cancel() : e.cancelText
            ])
          ]
      },
      r = d => {
        if (d.icon) return f(we, { class: Dt('item-icon'), name: d.icon }, null)
      },
      s = (d, h) =>
        d.loading
          ? f(Ft, { class: Dt('loading-icon') }, null)
          : t.action
            ? t.action({ action: d, index: h })
            : [
                f('span', { class: Dt('name') }, [d.name]),
                d.subname && f('div', { class: Dt('subname') }, [d.subname])
              ],
      c = (d, h) => {
        const { color: m, loading: y, callback: p, disabled: b, className: x } = d,
          g = () => {
            b || y || (p && p(d), e.closeOnClickAction && o(!1), Se(() => n('select', d, h)))
          }
        return f(
          'button',
          {
            type: 'button',
            style: { color: m },
            class: [Dt('item', { loading: y, disabled: b }), x],
            onClick: g
          },
          [r(d), s(d, h)]
        )
      },
      u = () => {
        if (e.description || t.description) {
          const d = t.description ? t.description() : e.description
          return f('div', { class: Dt('description') }, [d])
        }
      }
    return () =>
      f(zt, Ce({ class: Dt(), position: 'bottom', 'onUpdate:show': o }, Ie(e, Kx)), {
        default: () => {
          var d
          return [
            i(),
            u(),
            f('div', { class: Dt('content') }, [
              e.actions.map(c),
              (d = t.default) == null ? void 0 : d.call(t)
            ]),
            l()
          ]
        }
      })
  }
})
const zh = Z(Yx),
  [Gx, In, Mu] = K('picker'),
  jh = e => e.find(t => !t.disabled) || e[0]
function qx(e, t) {
  const n = e[0]
  if (n) {
    if (Array.isArray(n)) return 'multiple'
    if (t.children in n) return 'cascade'
  }
  return 'default'
}
function Vi(e, t) {
  t = it(t, 0, e.length)
  for (let n = t; n < e.length; n++) if (!e[n].disabled) return n
  for (let n = t - 1; n >= 0; n--) if (!e[n].disabled) return n
  return 0
}
const Vu = (e, t, n) => t !== void 0 && e.some(o => o[n.value] === t)
function cs(e, t, n) {
  const o = e.findIndex(i => i[n.value] === t),
    a = Vi(e, o)
  return e[a]
}
function Xx(e, t, n) {
  const o = []
  let a = { [t.children]: e },
    i = 0
  for (; a && a[t.children];) {
    const l = a[t.children],
      r = n.value[i]
    if (((a = Ee(r) ? cs(l, r, t) : void 0), !a && l.length)) {
      const s = jh(l)[t.value]
      a = cs(l, s, t)
    }
    ;(i++, o.push(l))
  }
  return o
}
function Zx(e) {
  const { transform: t } = window.getComputedStyle(e),
    n = t.slice(7, t.length - 1).split(', ')[5]
  return Number(n)
}
function Jx(e) {
  return he({ text: 'text', value: 'value', children: 'children' }, e)
}
const Lu = 200,
  Nu = 300,
  Qx = 15,
  [Wh, yr] = K('picker-column'),
  Uh = Symbol(Wh)
var eS = U({
  name: Wh,
  props: {
    value: q,
    fields: lt(Object),
    options: ze(),
    readonly: Boolean,
    allowHtml: Boolean,
    optionHeight: lt(Number),
    swipeDuration: lt(q),
    visibleOptionNum: lt(q)
  },
  emits: ['change', 'clickOption', 'scrollInto'],
  setup(e, { emit: t, slots: n }) {
    let o, a, i, l, r
    const s = M(),
      c = M(),
      u = M(0),
      d = M(0),
      h = Ht(),
      m = () => e.options.length,
      y = () => (e.optionHeight * (+e.visibleOptionNum - 1)) / 2,
      p = O => {
        let I = Vi(e.options, O)
        const T = -I * e.optionHeight,
          D = () => {
            I > m() - 1 && (I = Vi(e.options, O))
            const z = e.options[I][e.fields.value]
            z !== e.value && t('change', z)
          }
        ;(o && T !== u.value ? (r = D) : D(), (u.value = T))
      },
      b = () => e.readonly || !e.options.length,
      x = O => {
        o || b() || ((r = null), (d.value = Lu), p(O), t('clickOption', e.options[O]))
      },
      g = O => it(Math.round(-O / e.optionHeight), 0, m() - 1),
      C = B(() => g(u.value)),
      S = (O, I) => {
        const T = Math.abs(O / I)
        O = u.value + (T / 0.003) * (O < 0 ? -1 : 1)
        const D = g(O)
        ;((d.value = +e.swipeDuration), p(D))
      },
      v = () => {
        ;((o = !1), (d.value = 0), r && (r(), (r = null)))
      },
      _ = O => {
        if (!b()) {
          if ((h.start(O), o)) {
            const I = Zx(c.value)
            u.value = Math.min(0, I - y())
          }
          ;((d.value = 0), (a = u.value), (i = Date.now()), (l = a), (r = null))
        }
      },
      P = O => {
        if (b()) return
        ;(h.move(O), h.isVertical() && ((o = !0), Fe(O, !0)))
        const I = it(a + h.deltaY.value, -(m() * e.optionHeight), e.optionHeight),
          T = g(I)
        ;(T !== C.value && t('scrollInto', e.options[T]), (u.value = I))
        const D = Date.now()
        D - i > Nu && ((i = D), (l = I))
      },
      w = () => {
        if (b()) return
        const O = u.value - l,
          I = Date.now() - i
        if (I < Nu && Math.abs(O) > Qx) {
          S(O, I)
          return
        }
        const D = g(u.value)
        ;((d.value = Lu),
          p(D),
          setTimeout(() => {
            o = !1
          }, 0))
      },
      A = () => {
        const O = { height: `${e.optionHeight}px` }
        return e.options.map((I, T) => {
          const D = I[e.fields.text],
            { disabled: z } = I,
            oe = I[e.fields.value],
            L = {
              role: 'button',
              style: O,
              tabindex: z ? -1 : 0,
              class: [yr('item', { disabled: z, selected: oe === e.value }), I.className],
              onClick: () => x(T)
            },
            ee = { class: 'van-ellipsis', [e.allowHtml ? 'innerHTML' : 'textContent']: D }
          return f('li', L, [n.option ? n.option(I, T) : f('div', ee, null)])
        })
      }
    return (
      ht(Uh),
      Te({ stopMomentum: v }),
      ra(() => {
        const O = o
            ? Math.floor(-u.value / e.optionHeight)
            : e.options.findIndex(D => D[e.fields.value] === e.value),
          I = Vi(e.options, O),
          T = -I * e.optionHeight
        ;(o && I < O && v(), (u.value = T))
      }),
      Xe('touchmove', P, { target: s }),
      () =>
        f('div', { ref: s, class: yr(), onTouchstartPassive: _, onTouchend: w, onTouchcancel: w }, [
          f(
            'ul',
            {
              ref: c,
              style: {
                transform: `translate3d(0, ${u.value + y()}px, 0)`,
                transitionDuration: `${d.value}ms`,
                transitionProperty: d.value ? 'all' : 'none'
              },
              class: yr('wrapper'),
              onTransitionend: v
            },
            [A()]
          )
        ])
    )
  }
})
const [tS] = K('picker-toolbar'),
  Vl = { title: String, cancelButtonText: String, confirmButtonText: String },
  Kh = ['cancel', 'confirm', 'title', 'toolbar'],
  nS = Object.keys(Vl)
var Yh = U({
  name: tS,
  props: Vl,
  emits: ['confirm', 'cancel'],
  setup(e, { emit: t, slots: n }) {
    const o = () => {
        if (n.title) return n.title()
        if (e.title) return f('div', { class: [In('title'), 'van-ellipsis'] }, [e.title])
      },
      a = () => t('cancel'),
      i = () => t('confirm'),
      l = () => {
        var s
        const c = (s = e.cancelButtonText) != null ? s : Mu('cancel')
        if (!(!n.cancel && !c))
          return f('button', { type: 'button', class: [In('cancel'), bt], onClick: a }, [
            n.cancel ? n.cancel() : c
          ])
      },
      r = () => {
        var s
        const c = (s = e.confirmButtonText) != null ? s : Mu('confirm')
        if (!(!n.confirm && !c))
          return f('button', { type: 'button', class: [In('confirm'), bt], onClick: i }, [
            n.confirm ? n.confirm() : c
          ])
      }
    return () => f('div', { class: In('toolbar') }, [n.toolbar ? n.toolbar() : [l(), o(), r()]])
  }
})
const Gs = (e, t) => {
  const n = M(e())
  return (
    te(e, o => {
      o !== n.value && (n.value = o)
    }),
    te(n, o => {
      o !== e() && t(o)
    }),
    n
  )
}
function oS(e, t, n) {
  let o,
    a = 0
  const i = e.scrollLeft,
    l = n === 0 ? 1 : Math.round((n * 1e3) / 16)
  let r = i
  function s() {
    Rl(o)
  }
  function c() {
    ;((r += (t - i) / l), (e.scrollLeft = r), ++a < l && (o = vt(c)))
  }
  return (c(), s)
}
function aS(e, t, n, o) {
  let a,
    i = Bn(e)
  const l = i < t,
    r = n === 0 ? 1 : Math.round((n * 1e3) / 16),
    s = (t - i) / r
  function c() {
    Rl(a)
  }
  function u() {
    ;((i += s),
      ((l && i > t) || (!l && i < t)) && (i = t),
      ol(e, i),
      (l && i < t) || (!l && i > t) ? (a = vt(u)) : o && (a = vt(o)))
  }
  return (u(), c)
}
let iS = 0
function fa() {
  const e = Et(),
    { name: t = 'unknown' } = (e == null ? void 0 : e.type) || {}
  return `${t}-${++iS}`
}
function ai() {
  const e = M([]),
    t = []
  return (
    yf(() => {
      e.value = []
    }),
    [
      e,
      o => (
        t[o] ||
          (t[o] = a => {
            e.value[o] = a
          }),
        t[o]
      )
    ]
  )
}
function Gh(e, t) {
  if (!Ot || !window.IntersectionObserver) return
  const n = new IntersectionObserver(
      i => {
        t(i[0].intersectionRatio > 0)
      },
      { root: document.body }
    ),
    o = () => {
      e.value && n.observe(e.value)
    },
    a = () => {
      e.value && n.unobserve(e.value)
    }
  ;(pn(a), en(a), ca(o))
}
const [lS, rS] = K('sticky'),
  qh = { zIndex: q, position: J('top'), container: Object, offsetTop: se(0), offsetBottom: se(0) }
var sS = U({
  name: lS,
  props: qh,
  emits: ['scroll', 'change'],
  setup(e, { emit: t, slots: n }) {
    const o = M(),
      a = ua(o),
      i = He({ fixed: !1, width: 0, height: 0, transform: 0 }),
      l = M(!1),
      r = B(() => Fs(e.position === 'top' ? e.offsetTop : e.offsetBottom)),
      s = B(() => {
        if (l.value) return
        const { fixed: h, height: m, width: y } = i
        if (h) return { width: `${y}px`, height: `${m}px` }
      }),
      c = B(() => {
        if (!i.fixed || l.value) return
        const h = he(Hn(e.zIndex), {
          width: `${i.width}px`,
          height: `${i.height}px`,
          [e.position]: `${r.value}px`
        })
        return (i.transform && (h.transform = `translate3d(0, ${i.transform}px, 0)`), h)
      }),
      u = h => t('scroll', { scrollTop: h, isFixed: i.fixed }),
      d = () => {
        if (!o.value || To(o)) return
        const { container: h, position: m } = e,
          y = Oe(o),
          p = Bn(window)
        if (((i.width = y.width), (i.height = y.height), m === 'top'))
          if (h) {
            const b = Oe(h),
              x = b.bottom - r.value - i.height
            ;((i.fixed = r.value > y.top && b.bottom > 0), (i.transform = x < 0 ? x : 0))
          } else i.fixed = r.value > y.top
        else {
          const { clientHeight: b } = document.documentElement
          if (h) {
            const x = Oe(h),
              g = b - x.top - r.value - i.height
            ;((i.fixed = b - r.value < y.bottom && b > x.top), (i.transform = g < 0 ? -g : 0))
          } else i.fixed = b - r.value < y.bottom
        }
        u(p)
      }
    return (
      te(
        () => i.fixed,
        h => t('change', h)
      ),
      Xe('scroll', d, { target: a, passive: !0 }),
      Gh(o, d),
      te([qt, Lt], () => {
        !o.value ||
          To(o) ||
          !i.fixed ||
          ((l.value = !0),
          Se(() => {
            const h = Oe(o)
            ;((i.width = h.width), (i.height = h.height), (l.value = !1))
          }))
      }),
      () => {
        var h
        return f('div', { ref: o, style: s.value }, [
          f('div', { class: rS({ fixed: i.fixed && !l.value }), style: c.value }, [
            (h = n.default) == null ? void 0 : h.call(n)
          ])
        ])
      }
    )
  }
})
const qs = Z(sS),
  [Xh, bi] = K('swipe'),
  Zh = {
    loop: j,
    width: q,
    height: q,
    vertical: Boolean,
    autoplay: se(0),
    duration: se(500),
    touchable: j,
    lazyRender: Boolean,
    initialSwipe: se(0),
    indicatorColor: String,
    showIndicators: j,
    stopPropagation: j
  },
  Jh = Symbol(Xh)
var cS = U({
  name: Xh,
  props: Zh,
  emits: ['change', 'dragStart', 'dragEnd'],
  setup(e, { emit: t, slots: n }) {
    const o = M(),
      a = M(),
      i = He({ rect: null, width: 0, height: 0, offset: 0, active: 0, swiping: !1 })
    let l = !1
    const r = Ht(),
      { children: s, linkChildren: c } = yt(Jh),
      u = B(() => s.length),
      d = B(() => i[e.vertical ? 'height' : 'width']),
      h = B(() => (e.vertical ? r.deltaY.value : r.deltaX.value)),
      m = B(() => (i.rect ? (e.vertical ? i.rect.height : i.rect.width) - d.value * u.value : 0)),
      y = B(() => (d.value ? Math.ceil(Math.abs(m.value) / d.value) : u.value)),
      p = B(() => u.value * d.value),
      b = B(() => (i.active + u.value) % u.value),
      x = B(() => {
        const re = e.vertical ? 'vertical' : 'horizontal'
        return r.direction.value === re
      }),
      g = B(() => {
        const re = {
          transitionDuration: `${i.swiping ? 0 : e.duration}ms`,
          transform: `translate${e.vertical ? 'Y' : 'X'}(${+i.offset.toFixed(2)}px)`
        }
        if (d.value) {
          const H = e.vertical ? 'height' : 'width',
            ne = e.vertical ? 'width' : 'height'
          ;((re[H] = `${p.value}px`), (re[ne] = e[ne] ? `${e[ne]}px` : ''))
        }
        return re
      }),
      C = re => {
        const { active: H } = i
        return re ? (e.loop ? it(H + re, -1, u.value) : it(H + re, 0, y.value)) : H
      },
      S = (re, H = 0) => {
        let ne = re * d.value
        e.loop || (ne = Math.min(ne, -m.value))
        let me = H - ne
        return (e.loop || (me = it(me, m.value, 0)), me)
      },
      v = ({ pace: re = 0, offset: H = 0, emitChange: ne }) => {
        if (u.value <= 1) return
        const { active: me } = i,
          G = C(re),
          ue = S(G, H)
        if (e.loop) {
          if (s[0] && ue !== m.value) {
            const E = ue < m.value
            s[0].setOffset(E ? p.value : 0)
          }
          if (s[u.value - 1] && ue !== 0) {
            const E = ue > 0
            s[u.value - 1].setOffset(E ? -p.value : 0)
          }
        }
        ;((i.active = G), (i.offset = ue), ne && G !== me && t('change', b.value))
      },
      _ = () => {
        ;((i.swiping = !0),
          i.active <= -1 ? v({ pace: u.value }) : i.active >= u.value && v({ pace: -u.value }))
      },
      P = () => {
        ;(_(),
          r.reset(),
          to(() => {
            ;((i.swiping = !1), v({ pace: -1, emitChange: !0 }))
          }))
      },
      w = () => {
        ;(_(),
          r.reset(),
          to(() => {
            ;((i.swiping = !1), v({ pace: 1, emitChange: !0 }))
          }))
      }
    let A
    const O = () => clearTimeout(A),
      I = () => {
        ;(O(),
          +e.autoplay > 0 &&
            u.value > 1 &&
            (A = setTimeout(() => {
              ;(w(), I())
            }, +e.autoplay)))
      },
      T = (re = +e.initialSwipe) => {
        if (!o.value) return
        const H = () => {
          var ne, me
          if (!To(o)) {
            const G = { width: o.value.offsetWidth, height: o.value.offsetHeight }
            ;((i.rect = G),
              (i.width = +((ne = e.width) != null ? ne : G.width)),
              (i.height = +((me = e.height) != null ? me : G.height)))
          }
          ;(u.value && ((re = Math.min(u.value - 1, re)), re === -1 && (re = u.value - 1)),
            (i.active = re),
            (i.swiping = !0),
            (i.offset = S(re)),
            s.forEach(G => {
              G.setOffset(0)
            }),
            I())
        }
        To(o) ? Se().then(H) : H()
      },
      D = () => T(i.active)
    let z
    const oe = re => {
        !e.touchable || re.touches.length > 1 || (r.start(re), (l = !1), (z = Date.now()), O(), _())
      },
      L = re => {
        e.touchable &&
          i.swiping &&
          (r.move(re),
          x.value &&
            ((!e.loop &&
              ((i.active === 0 && h.value > 0) || (i.active === u.value - 1 && h.value < 0))) ||
              (Fe(re, e.stopPropagation),
              v({ offset: h.value }),
              l || (t('dragStart', { index: b.value }), (l = !0)))))
      },
      ee = () => {
        if (!e.touchable || !i.swiping) return
        const re = Date.now() - z,
          H = h.value / re
        if ((Math.abs(H) > 0.25 || Math.abs(h.value) > d.value / 2) && x.value) {
          const me = e.vertical ? r.offsetY.value : r.offsetX.value
          let G = 0
          ;(e.loop
            ? (G = me > 0 ? (h.value > 0 ? -1 : 1) : 0)
            : (G = -Math[h.value > 0 ? 'ceil' : 'floor'](h.value / d.value)),
            v({ pace: G, emitChange: !0 }))
        } else h.value && v({ pace: 0 })
        ;((l = !1), (i.swiping = !1), t('dragEnd', { index: b.value }), I())
      },
      ae = (re, H = {}) => {
        ;(_(),
          r.reset(),
          to(() => {
            let ne
            ;(e.loop && re === u.value ? (ne = i.active === 0 ? 0 : re) : (ne = re % u.value),
              H.immediate
                ? to(() => {
                    i.swiping = !1
                  })
                : (i.swiping = !1),
              v({ pace: ne - i.active, emitChange: !0 }))
          }))
      },
      _e = (re, H) => {
        const ne = H === b.value,
          me = ne ? { backgroundColor: e.indicatorColor } : void 0
        return f('i', { style: me, class: bi('indicator', { active: ne }) }, null)
      },
      ke = () => {
        if (n.indicator) return n.indicator({ active: b.value, total: u.value })
        if (e.showIndicators && u.value > 1)
          return f('div', { class: bi('indicators', { vertical: e.vertical }) }, [
            Array(u.value).fill('').map(_e)
          ])
      }
    return (
      Te({ prev: P, next: w, state: i, resize: D, swipeTo: ae }),
      c({ size: d, props: e, count: u, activeIndicator: b }),
      te(
        () => e.initialSwipe,
        re => T(+re)
      ),
      te(u, () => T(i.active)),
      te(() => e.autoplay, I),
      te([qt, Lt, () => e.width, () => e.height], D),
      te(Qw(), re => {
        re === 'visible' ? I() : O()
      }),
      We(T),
      yn(() => T(i.active)),
      Bl(() => T(i.active)),
      pn(O),
      en(O),
      Xe('touchmove', L, { target: a }),
      () => {
        var re
        return f('div', { ref: o, class: bi() }, [
          f(
            'div',
            {
              ref: a,
              style: g.value,
              class: bi('track', { vertical: e.vertical }),
              onTouchstartPassive: oe,
              onTouchend: ee,
              onTouchcancel: ee
            },
            [(re = n.default) == null ? void 0 : re.call(n)]
          ),
          ke()
        ])
      }
    )
  }
})
const Ll = Z(cS),
  [uS, Fu] = K('tabs')
var dS = U({
  name: uS,
  props: {
    count: lt(Number),
    inited: Boolean,
    animated: Boolean,
    duration: lt(q),
    swipeable: Boolean,
    lazyRender: Boolean,
    currentIndex: lt(Number)
  },
  emits: ['change'],
  setup(e, { emit: t, slots: n }) {
    const o = M(),
      a = r => t('change', r),
      i = () => {
        var r
        const s = (r = n.default) == null ? void 0 : r.call(n)
        return e.animated || e.swipeable
          ? f(
              Ll,
              {
                ref: o,
                loop: !1,
                class: Fu('track'),
                duration: +e.duration * 1e3,
                touchable: e.swipeable,
                lazyRender: e.lazyRender,
                showIndicators: !1,
                onChange: a
              },
              { default: () => [s] }
            )
          : s
      },
      l = r => {
        const s = o.value
        s && s.state.active !== r && s.swipeTo(r, { immediate: !e.inited })
      }
    return (
      te(() => e.currentIndex, l),
      We(() => {
        l(e.currentIndex)
      }),
      Te({ swipeRef: o }),
      () => f('div', { class: Fu('content', { animated: e.animated || e.swipeable }) }, [i()])
    )
  }
})
const [Qh, yi] = K('tabs'),
  em = {
    type: J('line'),
    color: String,
    border: Boolean,
    sticky: Boolean,
    shrink: Boolean,
    active: se(0),
    duration: se(0.3),
    animated: Boolean,
    ellipsis: j,
    swipeable: Boolean,
    scrollspy: Boolean,
    offsetTop: se(0),
    background: String,
    lazyRender: j,
    showHeader: j,
    lineWidth: q,
    lineHeight: q,
    beforeChange: Function,
    swipeThreshold: se(5),
    titleActiveColor: String,
    titleInactiveColor: String
  },
  tm = Symbol(Qh)
var fS = U({
  name: Qh,
  props: em,
  emits: ['change', 'scroll', 'rendered', 'clickTab', 'update:active'],
  setup(e, { emit: t, slots: n }) {
    let o, a, i, l, r
    const s = M(),
      c = M(),
      u = M(),
      d = M(),
      h = fa(),
      m = ua(s),
      [y, p] = ai(),
      { children: b, linkChildren: x } = yt(tm),
      g = He({ inited: !1, position: '', lineStyle: {}, currentIndex: -1 }),
      C = B(() => b.length > +e.swipeThreshold || !e.ellipsis || e.shrink),
      S = B(() => ({ borderColor: e.color, background: e.background })),
      v = (G, ue) => {
        var E
        return (E = G.name) != null ? E : ue
      },
      _ = B(() => {
        const G = b[g.currentIndex]
        if (G) return v(G, g.currentIndex)
      }),
      P = B(() => Fs(e.offsetTop)),
      w = B(() => (e.sticky ? P.value + o : 0)),
      A = G => {
        const ue = c.value,
          E = y.value
        if (!C.value || !ue || !E || !E[g.currentIndex]) return
        const F = E[g.currentIndex].$el,
          V = F.offsetLeft - (ue.offsetWidth - F.offsetWidth) / 2
        ;(l && l(), (l = oS(ue, V, G ? 0 : +e.duration)))
      },
      O = () => {
        const G = g.inited
        Se(() => {
          const ue = y.value
          if (!ue || !ue[g.currentIndex] || e.type !== 'line' || To(s.value)) return
          const E = ue[g.currentIndex].$el,
            { lineWidth: F, lineHeight: V } = e,
            Q = E.offsetLeft + E.offsetWidth / 2,
            fe = {
              width: pe(F),
              backgroundColor: e.color,
              transform: `translateX(${Q}px) translateX(-50%)`
            }
          if ((G && (fe.transitionDuration = `${e.duration}s`), Ee(V))) {
            const k = pe(V)
            ;((fe.height = k), (fe.borderRadius = k))
          }
          g.lineStyle = fe
        })
      },
      I = G => {
        const ue = G < g.currentIndex ? -1 : 1
        for (; G >= 0 && G < b.length;) {
          if (!b[G].disabled) return G
          G += ue
        }
      },
      T = (G, ue) => {
        const E = I(G)
        if (!Ee(E)) return
        const F = b[E],
          V = v(F, E),
          Q = g.currentIndex !== null
        ;(g.currentIndex !== E && ((g.currentIndex = E), ue || A(), O()),
          V !== e.active && (t('update:active', V), Q && t('change', V, F.title)),
          i && !e.scrollspy && Za(Math.ceil(Eu(s.value) - P.value)))
      },
      D = (G, ue) => {
        const E = b.findIndex((F, V) => v(F, V) === G)
        T(E === -1 ? 0 : E, ue)
      },
      z = (G = !1) => {
        if (e.scrollspy) {
          const ue = b[g.currentIndex].$el
          if (ue && m.value) {
            const E = Eu(ue, m.value) - w.value
            ;((a = !0),
              r && r(),
              (r = aS(m.value, E, G ? 0 : +e.duration, () => {
                a = !1
              })))
          }
        }
      },
      oe = (G, ue, E) => {
        const { title: F, disabled: V } = b[ue],
          Q = v(b[ue], ue)
        ;(V ||
          (io(e.beforeChange, {
            args: [Q],
            done: () => {
              ;(T(ue), z())
            }
          }),
          _h(G)),
          t('clickTab', { name: Q, title: F, event: E, disabled: V }))
      },
      L = G => {
        ;((i = G.isFixed), t('scroll', G))
      },
      ee = G => {
        Se(() => {
          ;(D(G), z(!0))
        })
      },
      ae = () => {
        for (let G = 0; G < b.length; G++) {
          const { top: ue } = Oe(b[G].$el)
          if (ue > w.value) return G === 0 ? 0 : G - 1
        }
        return b.length - 1
      },
      _e = () => {
        if (e.scrollspy && !a) {
          const G = ae()
          T(G)
        }
      },
      ke = () => {
        if (e.type === 'line' && b.length)
          return f('div', { class: yi('line'), style: g.lineStyle }, null)
      },
      re = () => {
        var G, ue, E
        const { type: F, border: V, sticky: Q } = e,
          fe = [
            f('div', { ref: Q ? void 0 : u, class: [yi('wrap'), { [$l]: F === 'line' && V }] }, [
              f(
                'div',
                {
                  ref: c,
                  role: 'tablist',
                  class: yi('nav', [F, { shrink: e.shrink, complete: C.value }]),
                  style: S.value,
                  'aria-orientation': 'horizontal'
                },
                [
                  (G = n['nav-left']) == null ? void 0 : G.call(n),
                  b.map(k => k.renderTitle(oe)),
                  ke(),
                  (ue = n['nav-right']) == null ? void 0 : ue.call(n)
                ]
              )
            ]),
            (E = n['nav-bottom']) == null ? void 0 : E.call(n)
          ]
        return Q ? f('div', { ref: u }, [fe]) : fe
      },
      H = () => {
        ;(O(),
          Se(() => {
            var G, ue
            ;(A(!0),
              (ue = (G = d.value) == null ? void 0 : G.swipeRef.value) == null || ue.resize())
          }))
      }
    ;(te(() => [e.color, e.duration, e.lineWidth, e.lineHeight], O),
      te(qt, H),
      te(
        () => e.active,
        G => {
          G !== _.value && D(G)
        }
      ),
      te(
        () => b.length,
        () => {
          g.inited &&
            (D(e.active),
            O(),
            Se(() => {
              A(!0)
            }))
        }
      ))
    const ne = () => {
        ;(D(e.active, !0),
          Se(() => {
            ;((g.inited = !0), u.value && (o = Oe(u.value).height), A(!0))
          }))
      },
      me = (G, ue) => t('rendered', G, ue)
    return (
      Te({ resize: H, scrollTo: ee }),
      yn(O),
      Bl(O),
      ca(ne),
      Gh(s, O),
      Xe('scroll', _e, { target: m, passive: !0 }),
      x({
        id: h,
        props: e,
        setLine: O,
        scrollable: C,
        onRendered: me,
        currentName: _,
        setTitleRefs: p,
        scrollIntoView: A
      }),
      () =>
        f('div', { ref: s, class: yi([e.type]) }, [
          e.showHeader
            ? e.sticky
              ? f(
                  qs,
                  { container: s.value, offsetTop: P.value, onScroll: L },
                  { default: () => [re()] }
                )
              : re()
            : null,
          f(
            dS,
            {
              ref: d,
              count: b.length,
              inited: g.inited,
              animated: e.animated,
              duration: e.duration,
              swipeable: e.swipeable,
              lazyRender: e.lazyRender,
              currentIndex: g.currentIndex,
              onChange: T
            },
            {
              default: () => {
                var G
                return [(G = n.default) == null ? void 0 : G.call(n)]
              }
            }
          )
        ])
    )
  }
})
const hS = Symbol(),
  nm = Symbol(),
  Xs = () => dt(nm, null),
  mS = e => {
    const t = Xs()
    ;(hn(hS, e),
      hn(
        nm,
        B(() => (t == null || t.value) && e.value)
      ))
  },
  [gS, Hu] = K('tab'),
  vS = U({
    name: gS,
    props: {
      id: String,
      dot: Boolean,
      type: String,
      color: String,
      title: String,
      badge: q,
      shrink: Boolean,
      isActive: Boolean,
      disabled: Boolean,
      controls: String,
      scrollable: Boolean,
      activeColor: String,
      inactiveColor: String,
      showZeroBadge: j
    },
    setup(e, { slots: t }) {
      const n = B(() => {
          const a = {},
            { type: i, color: l, disabled: r, isActive: s, activeColor: c, inactiveColor: u } = e
          l &&
            i === 'card' &&
            ((a.borderColor = l), r || (s ? (a.backgroundColor = l) : (a.color = l)))
          const h = s ? c : u
          return (h && (a.color = h), a)
        }),
        o = () => {
          const a = f('span', { class: Hu('text', { ellipsis: !e.scrollable }) }, [
            t.title ? t.title() : e.title
          ])
          return e.dot || (Ee(e.badge) && e.badge !== '')
            ? f(
                ro,
                { dot: e.dot, content: e.badge, showZero: e.showZeroBadge },
                { default: () => [a] }
              )
            : a
        }
      return () =>
        f(
          'div',
          {
            id: e.id,
            role: 'tab',
            class: [
              Hu([
                e.type,
                {
                  grow: e.scrollable && !e.shrink,
                  shrink: e.shrink,
                  active: e.isActive,
                  disabled: e.disabled
                }
              ])
            ],
            style: n.value,
            tabindex: e.disabled ? void 0 : e.isActive ? 0 : -1,
            'aria-selected': e.isActive,
            'aria-disabled': e.disabled || void 0,
            'aria-controls': e.controls,
            'data-allow-mismatch': 'attribute'
          },
          [o()]
        )
    }
  }),
  [bS, yS] = K('swipe-item')
var pS = U({
  name: bS,
  setup(e, { slots: t }) {
    let n
    const o = He({ offset: 0, inited: !1, mounted: !1 }),
      { parent: a, index: i } = ht(Jh)
    if (!a) return
    const l = B(() => {
        const c = {},
          { vertical: u } = a.props
        return (
          a.size.value && (c[u ? 'height' : 'width'] = `${a.size.value}px`),
          o.offset && (c.transform = `translate${u ? 'Y' : 'X'}(${o.offset}px)`),
          c
        )
      }),
      r = B(() => {
        const { loop: c, lazyRender: u } = a.props
        if (!u || n) return !0
        if (!o.mounted) return !1
        const d = a.activeIndicator.value,
          h = a.count.value - 1,
          m = d === 0 && c ? h : d - 1,
          y = d === h && c ? 0 : d + 1
        return ((n = i.value === d || i.value === m || i.value === y), n)
      }),
      s = c => {
        o.offset = c
      }
    return (
      We(() => {
        Se(() => {
          o.mounted = !0
        })
      }),
      Te({ setOffset: s }),
      () => {
        var c
        return f('div', { class: yS(), style: l.value }, [
          r.value ? ((c = t.default) == null ? void 0 : c.call(t)) : null
        ])
      }
    )
  }
})
const Nl = Z(pS),
  [wS, pr] = K('tab'),
  om = he({}, lo, {
    dot: Boolean,
    name: q,
    badge: q,
    title: String,
    disabled: Boolean,
    titleClass: je,
    titleStyle: [String, Object],
    showZeroBadge: j
  })
var xS = U({
  name: wS,
  props: om,
  setup(e, { slots: t }) {
    const n = fa(),
      o = M(!1),
      a = Et(),
      { parent: i, index: l } = ht(tm)
    if (!i) return
    const r = () => {
        var y
        return (y = e.name) != null ? y : l.value
      },
      s = () => {
        ;((o.value = !0),
          i.props.lazyRender &&
            Se(() => {
              i.onRendered(r(), e.title)
            }))
      },
      c = B(() => {
        const y = r() === i.currentName.value
        return (y && !o.value && s(), y)
      }),
      u = M(''),
      d = M('')
    ra(() => {
      const { titleClass: y, titleStyle: p } = e
      ;((u.value = y ? xl(y) : ''), (d.value = p && typeof p != 'string' ? Gb(wl(p)) : p))
    })
    const h = y =>
        f(
          vS,
          Ce(
            {
              key: n,
              id: `${i.id}-${l.value}`,
              ref: i.setTitleRefs(l.value),
              style: d.value,
              class: u.value,
              isActive: c.value,
              controls: n,
              scrollable: i.scrollable.value,
              activeColor: i.props.titleActiveColor,
              inactiveColor: i.props.titleInactiveColor,
              onClick: p => y(a.proxy, l.value, p)
            },
            Ie(i.props, ['type', 'color', 'shrink']),
            Ie(e, ['dot', 'badge', 'title', 'disabled', 'showZeroBadge'])
          ),
          { title: t.title }
        ),
      m = M(!c.value)
    return (
      te(c, y => {
        y
          ? (m.value = !1)
          : to(() => {
              m.value = !0
            })
      }),
      te(
        () => e.title,
        () => {
          ;(i.setLine(), i.scrollIntoView())
        }
      ),
      mS(c),
      Te({ id: n, renderTitle: h }),
      () => {
        var y
        const p = `${i.id}-${l.value}`,
          { animated: b, swipeable: x, scrollspy: g, lazyRender: C } = i.props
        if (!t.default && !b) return
        const S = g || c.value
        if (b || x)
          return f(
            Nl,
            {
              id: n,
              role: 'tabpanel',
              class: pr('panel-wrapper', { inactive: m.value }),
              tabindex: c.value ? 0 : -1,
              'aria-hidden': !c.value,
              'aria-labelledby': p,
              'data-allow-mismatch': 'attribute'
            },
            {
              default: () => {
                var P
                return [
                  f('div', { class: pr('panel') }, [(P = t.default) == null ? void 0 : P.call(t)])
                ]
              }
            }
          )
        const _ = o.value || g || !C ? ((y = t.default) == null ? void 0 : y.call(t)) : null
        return rt(
          f(
            'div',
            {
              id: n,
              role: 'tabpanel',
              class: pr('panel'),
              tabindex: S ? 0 : -1,
              'aria-labelledby': p,
              'data-allow-mismatch': 'attribute'
            },
            [_]
          ),
          [[ft, S]]
        )
      }
    )
  }
})
const oa = Z(xS),
  ii = Z(fS),
  [am, wr] = K('picker-group'),
  im = Symbol(am),
  lm = he({ tabs: ze(), activeTab: se(0), nextStepText: String, showToolbar: j }, Vl)
var SS = U({
  name: am,
  props: lm,
  emits: ['confirm', 'cancel', 'update:activeTab'],
  setup(e, { emit: t, slots: n }) {
    const o = Gs(
        () => e.activeTab,
        c => t('update:activeTab', c)
      ),
      { children: a, linkChildren: i } = yt(im)
    i()
    const l = () => +o.value < e.tabs.length - 1 && e.nextStepText,
      r = () => {
        l()
          ? (o.value = +o.value + 1)
          : t(
              'confirm',
              a.map(c => c.confirm())
            )
      },
      s = () => t('cancel')
    return () => {
      var c, u
      let d =
        (u = (c = n.default) == null ? void 0 : c.call(n)) == null
          ? void 0
          : u.filter(m => m.type !== ot).map(m => (m.type === qe ? m.children : m))
      d && (d = zw(d))
      const h = l() ? e.nextStepText : e.confirmButtonText
      return f('div', { class: wr() }, [
        e.showToolbar
          ? f(
              Yh,
              {
                title: e.title,
                cancelButtonText: e.cancelButtonText,
                confirmButtonText: h,
                onConfirm: r,
                onCancel: s
              },
              Ie(n, Kh)
            )
          : null,
        f(
          ii,
          {
            active: o.value,
            'onUpdate:active': m => (o.value = m),
            class: wr('tabs'),
            shrink: !0,
            animated: !0,
            lazyRender: !1
          },
          {
            default: () => [
              e.tabs.map((m, y) =>
                f(
                  oa,
                  { title: m, titleClass: wr('tab-title') },
                  { default: () => [d == null ? void 0 : d[y]] }
                )
              )
            ]
          }
        )
      ])
    }
  }
})
const Fl = he(
    {
      loading: Boolean,
      readonly: Boolean,
      allowHtml: Boolean,
      optionHeight: se(44),
      showToolbar: j,
      swipeDuration: se(1e3),
      visibleOptionNum: se(6)
    },
    Vl
  ),
  rm = he({}, Fl, {
    columns: ze(),
    modelValue: ze(),
    toolbarPosition: J('top'),
    columnsFieldNames: Object
  })
var CS = U({
  name: Gx,
  props: rm,
  emits: ['confirm', 'cancel', 'change', 'scrollInto', 'clickOption', 'update:modelValue'],
  setup(e, { emit: t, slots: n }) {
    const o = M(),
      a = M(e.modelValue.slice(0)),
      { parent: i } = ht(im),
      { children: l, linkChildren: r } = yt(Uh)
    r()
    const s = B(() => Jx(e.columnsFieldNames)),
      c = B(() => Fs(e.optionHeight)),
      u = B(() => qx(e.columns, s.value)),
      d = B(() => {
        const { columns: T } = e
        switch (u.value) {
          case 'multiple':
            return T
          case 'cascade':
            return Xx(T, s.value, a)
          default:
            return [T]
        }
      }),
      h = B(() => d.value.some(T => T.length)),
      m = B(() => d.value.map((T, D) => cs(T, a.value[D], s.value))),
      y = B(() => d.value.map((T, D) => T.findIndex(z => z[s.value.value] === a.value[D]))),
      p = (T, D) => {
        if (a.value[T] !== D) {
          const z = a.value.slice(0)
          ;((z[T] = D), (a.value = z))
        }
      },
      b = () => ({
        selectedValues: a.value.slice(0),
        selectedOptions: m.value,
        selectedIndexes: y.value
      }),
      x = (T, D) => {
        ;(p(D, T),
          u.value === 'cascade' &&
            a.value.forEach((z, oe) => {
              const L = d.value[oe]
              Vu(L, z, s.value) || p(oe, L.length ? L[0][s.value.value] : void 0)
            }),
          Se(() => {
            t('change', he({ columnIndex: D }, b()))
          }))
      },
      g = (T, D) => {
        const z = { columnIndex: D, currentOption: T }
        ;(t('clickOption', he(b(), z)), t('scrollInto', z))
      },
      C = () => {
        l.forEach(D => D.stopMomentum())
        const T = b()
        return (
          Se(() => {
            const D = b()
            t('confirm', D)
          }),
          T
        )
      },
      S = () => t('cancel', b()),
      v = () =>
        d.value.map((T, D) =>
          f(
            eS,
            {
              value: a.value[D],
              fields: s.value,
              options: T,
              readonly: e.readonly,
              allowHtml: e.allowHtml,
              optionHeight: c.value,
              swipeDuration: e.swipeDuration,
              visibleOptionNum: e.visibleOptionNum,
              onChange: z => x(z, D),
              onClickOption: z => g(z, D),
              onScrollInto: z => {
                t('scrollInto', { currentOption: z, columnIndex: D })
              }
            },
            { option: n.option }
          )
        ),
      _ = T => {
        if (h.value) {
          const D = { height: `${c.value}px` },
            z = { backgroundSize: `100% ${(T - c.value) / 2}px` }
          return [
            f('div', { class: In('mask'), style: z }, null),
            f('div', { class: [vx, In('frame')], style: D }, null)
          ]
        }
      },
      P = () => {
        const T = c.value * +e.visibleOptionNum,
          D = { height: `${T}px` }
        return !e.loading && !h.value && n.empty
          ? n.empty()
          : f('div', { ref: o, class: In('columns'), style: D }, [v(), _(T)])
      },
      w = () => {
        if (e.showToolbar && !i)
          return f(Yh, Ce(Ie(e, nS), { onConfirm: C, onCancel: S }), Ie(n, Kh))
      },
      A = T => {
        T.forEach((D, z) => {
          D.length && !Vu(D, a.value[z], s.value) && p(z, jh(D)[s.value.value])
        })
      }
    te(d, T => A(T), { immediate: !0 })
    let O
    return (
      te(
        () => e.modelValue,
        T => {
          ;(!mn(T, a.value) && !mn(T, O) && ((a.value = T.slice(0)), (O = T.slice(0))),
            e.modelValue.length === 0 && A(d.value))
        },
        { deep: !0 }
      ),
      te(
        a,
        T => {
          mn(T, e.modelValue) || ((O = T.slice(0)), t('update:modelValue', O))
        },
        { immediate: !0 }
      ),
      Xe('touchmove', Fe, { target: o }),
      Te({ confirm: C, getSelectedOptions: () => m.value }),
      () => {
        var T, D
        return f('div', { class: In() }, [
          e.toolbarPosition === 'top' ? w() : null,
          e.loading ? f(Ft, { class: In('loading') }, null) : null,
          (T = n['columns-top']) == null ? void 0 : T.call(n),
          P(),
          (D = n['columns-bottom']) == null ? void 0 : D.call(n),
          e.toolbarPosition === 'bottom' ? w() : null
        ])
      }
    )
  }
})
const qo = '000000',
  _S = ['title', 'cancel', 'confirm', 'toolbar', 'columns-top', 'columns-bottom'],
  sm = [
    'title',
    'loading',
    'readonly',
    'optionHeight',
    'swipeDuration',
    'visibleOptionNum',
    'cancelButtonText',
    'confirmButtonText'
  ],
  Un = (e = '', t = qo, n = void 0) => ({ text: e, value: t, children: n })
function TS({ areaList: e, columnsNum: t, columnsPlaceholder: n }) {
  const { city_list: o = {}, county_list: a = {}, province_list: i = {} } = e,
    l = +t > 1,
    r = +t > 2,
    s = () => {
      if (l) return n.length > 1 ? [Un(n[1], qo, r ? [] : void 0)] : []
    },
    c = new Map()
  Object.keys(i).forEach(h => {
    c.set(h.slice(0, 2), Un(i[h], h, s()))
  })
  const u = new Map()
  if (l) {
    const h = () => {
      if (r) return n.length > 2 ? [Un(n[2])] : []
    }
    Object.keys(o).forEach(m => {
      const y = Un(o[m], m, h())
      u.set(m.slice(0, 4), y)
      const p = c.get(m.slice(0, 2))
      p && p.children.push(y)
    })
  }
  r &&
    Object.keys(a).forEach(h => {
      const m = u.get(h.slice(0, 4))
      m && m.children.push(Un(a[h], h))
    })
  const d = Array.from(c.values())
  if (n.length) {
    const h = r ? [Un(n[2])] : void 0,
      m = l ? [Un(n[1], qo, h)] : void 0
    d.unshift(Un(n[0], qo, m))
  }
  return d
}
const li = Z(CS),
  [ES, kS] = K('area'),
  cm = he({}, Ie(Fl, sm), {
    modelValue: String,
    columnsNum: se(3),
    columnsPlaceholder: ze(),
    areaList: { type: Object, default: () => ({}) }
  })
var AS = U({
  name: ES,
  props: cm,
  emits: ['change', 'confirm', 'cancel', 'update:modelValue'],
  setup(e, { emit: t, slots: n }) {
    const o = M([]),
      a = M(),
      i = B(() => TS(e)),
      l = (...c) => t('change', ...c),
      r = (...c) => t('cancel', ...c),
      s = (...c) => t('confirm', ...c)
    return (
      te(
        o,
        c => {
          const u = c.length ? c[c.length - 1] : ''
          u && u !== e.modelValue && t('update:modelValue', u)
        },
        { deep: !0 }
      ),
      te(
        () => e.modelValue,
        c => {
          if (c) {
            const u = o.value.length ? o.value[o.value.length - 1] : ''
            c !== u &&
              (o.value = [`${c.slice(0, 2)}0000`, `${c.slice(0, 4)}00`, c].slice(0, +e.columnsNum))
          } else o.value = []
        },
        { immediate: !0 }
      ),
      Te({
        confirm: () => {
          var c
          return (c = a.value) == null ? void 0 : c.confirm()
        },
        getSelectedOptions: () => {
          var c
          return ((c = a.value) == null ? void 0 : c.getSelectedOptions()) || []
        }
      }),
      () =>
        f(
          li,
          Ce(
            {
              ref: a,
              modelValue: o.value,
              'onUpdate:modelValue': c => (o.value = c),
              class: kS(),
              columns: i.value,
              onChange: l,
              onCancel: r,
              onConfirm: s
            },
            Ie(e, sm)
          ),
          Ie(n, _S)
        )
    )
  }
})
const Zs = Z(AS),
  [PS, Oo] = K('cell'),
  Hl = {
    tag: J('div'),
    icon: String,
    size: String,
    title: q,
    value: q,
    label: q,
    center: Boolean,
    isLink: Boolean,
    border: j,
    iconPrefix: String,
    valueClass: je,
    labelClass: je,
    titleClass: je,
    titleStyle: null,
    arrowDirection: String,
    required: { type: [Boolean, String], default: null },
    clickable: { type: Boolean, default: null }
  },
  um = he({}, Hl, lo)
var IS = U({
  name: PS,
  props: um,
  setup(e, { slots: t }) {
    const n = ko(),
      o = () => {
        if (t.label || Ee(e.label))
          return f('div', { class: [Oo('label'), e.labelClass] }, [t.label ? t.label() : e.label])
      },
      a = () => {
        var s
        if (t.title || Ee(e.title)) {
          const c = (s = t.title) == null ? void 0 : s.call(t)
          return Array.isArray(c) && c.length === 0
            ? void 0
            : f('div', { class: [Oo('title'), e.titleClass], style: e.titleStyle }, [
                c || f('span', null, [e.title]),
                o()
              ])
        }
      },
      i = () => {
        const s = t.value || t.default
        if (s || Ee(e.value))
          return f('div', { class: [Oo('value'), e.valueClass] }, [
            s ? s() : f('span', null, [e.value])
          ])
      },
      l = () => {
        if (t.icon) return t.icon()
        if (e.icon)
          return f(we, { name: e.icon, class: Oo('left-icon'), classPrefix: e.iconPrefix }, null)
      },
      r = () => {
        if (t['right-icon']) return t['right-icon']()
        if (e.isLink) {
          const s =
            e.arrowDirection && e.arrowDirection !== 'right' ? `arrow-${e.arrowDirection}` : 'arrow'
          return f(we, { name: s, class: Oo('right-icon') }, null)
        }
      }
    return () => {
      var s
      const { tag: c, size: u, center: d, border: h, isLink: m, required: y } = e,
        p = (s = e.clickable) != null ? s : m,
        b = { center: d, required: !!y, clickable: p, borderless: !h }
      return (
        u && (b[u] = !!u),
        f(
          c,
          {
            class: Oo(b),
            role: p ? 'button' : void 0,
            tabindex: p ? 0 : void 0,
            onClick: p ? n : void 0
          },
          {
            default: () => {
              var x
              return [l(), a(), i(), r(), (x = t.extra) == null ? void 0 : x.call(t)]
            }
          }
        )
      )
    }
  }
})
const jt = Z(IS),
  [OS, RS] = K('form'),
  dm = {
    colon: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    required: [Boolean, String],
    showError: Boolean,
    labelWidth: q,
    labelAlign: String,
    inputAlign: String,
    scrollToError: Boolean,
    scrollToErrorPosition: String,
    validateFirst: Boolean,
    submitOnEnter: j,
    showErrorMessage: j,
    errorMessageAlign: String,
    validateTrigger: { type: [String, Array], default: 'onBlur' }
  }
var DS = U({
  name: OS,
  props: dm,
  emits: ['submit', 'failed'],
  setup(e, { emit: t, slots: n }) {
    const { children: o, linkChildren: a } = yt(yh),
      i = b => (b ? o.filter(x => b.includes(x.name)) : o),
      l = b =>
        new Promise((x, g) => {
          const C = []
          i(b)
            .reduce(
              (v, _) =>
                v.then(() => {
                  if (!C.length)
                    return _.validate().then(P => {
                      P && C.push(P)
                    })
                }),
              Promise.resolve()
            )
            .then(() => {
              C.length ? g(C) : x()
            })
        }),
      r = b =>
        new Promise((x, g) => {
          const C = i(b)
          Promise.all(C.map(S => S.validate())).then(S => {
            ;((S = S.filter(Boolean)), S.length ? g(S) : x())
          })
        }),
      s = b => {
        const x = o.find(g => g.name === b)
        return x
          ? new Promise((g, C) => {
              x.validate().then(S => {
                S ? C(S) : g()
              })
            })
          : Promise.reject()
      },
      c = b => (typeof b == 'string' ? s(b) : e.validateFirst ? l(b) : r(b)),
      u = b => {
        ;(typeof b == 'string' && (b = [b]),
          i(b).forEach(g => {
            g.resetValidation()
          }))
      },
      d = () => o.reduce((b, x) => ((b[x.name] = x.getValidationStatus()), b), {}),
      h = (b, x) => {
        o.some(g => (g.name === b ? (g.$el.scrollIntoView(x), !0) : !1))
      },
      m = () => o.reduce((b, x) => (x.name !== void 0 && (b[x.name] = x.formValue.value), b), {}),
      y = () => {
        const b = m()
        c()
          .then(() => t('submit', b))
          .catch(x => {
            t('failed', { values: b, errors: x })
            const { scrollToError: g, scrollToErrorPosition: C } = e
            g && x[0].name && h(x[0].name, C ? { block: C } : void 0)
          })
      },
      p = b => {
        ;(Fe(b), y())
      }
    return (
      a({ props: e }),
      Te({
        submit: y,
        validate: c,
        getValues: m,
        scrollToField: h,
        resetValidation: u,
        getValidationStatus: d
      }),
      () => {
        var b
        return f('form', { class: RS(), onSubmit: p }, [
          (b = n.default) == null ? void 0 : b.call(n)
        ])
      }
    )
  }
})
const zl = Z(DS)
function fm(e) {
  return Array.isArray(e) ? !e.length : e === 0 ? !1 : !e
}
function $S(e, t) {
  if (fm(e)) {
    if (t.required) return !1
    if (t.validateEmpty === !1) return !0
  }
  return !(t.pattern && !t.pattern.test(String(e)))
}
function BS(e, t) {
  return new Promise(n => {
    const o = t.validator(e, t)
    if (Ls(o)) {
      o.then(n)
      return
    }
    n(o)
  })
}
function zu(e, t) {
  const { message: n } = t
  return na(n) ? n(e, t) : n || ''
}
function MS({ target: e }) {
  e.composing = !0
}
function ju({ target: e }) {
  e.composing && ((e.composing = !1), e.dispatchEvent(new Event('input')))
}
function VS(e, t) {
  const n = So()
  e.style.height = 'auto'
  let o = e.scrollHeight
  if (Qt(t)) {
    const { maxHeight: a, minHeight: i } = t
    ;(a !== void 0 && (o = Math.min(o, a)), i !== void 0 && (o = Math.max(o, i)))
  }
  o && ((e.style.height = `${o}px`), Za(n))
}
function LS(e, t) {
  return (
    e === 'number' && ((e = 'text'), t ?? (t = 'decimal')),
    e === 'digit' && ((e = 'tel'), t ?? (t = 'numeric')),
    { type: e, inputmode: t }
  )
}
function wa(e) {
  return [...e].length
}
function xr(e, t) {
  return [...e].slice(0, t).join('')
}
const [NS, $t] = K('field'),
  Js = {
    id: String,
    name: String,
    leftIcon: String,
    rightIcon: String,
    autofocus: Boolean,
    clearable: Boolean,
    maxlength: q,
    max: Number,
    min: Number,
    formatter: Function,
    clearIcon: J('clear'),
    modelValue: se(''),
    inputAlign: String,
    placeholder: String,
    autocomplete: String,
    autocapitalize: String,
    autocorrect: String,
    errorMessage: String,
    enterkeyhint: String,
    clearTrigger: J('focus'),
    formatTrigger: J('onChange'),
    spellcheck: { type: Boolean, default: null },
    error: { type: Boolean, default: null },
    disabled: { type: Boolean, default: null },
    readonly: { type: Boolean, default: null },
    inputmode: String
  },
  hm = he({}, Hl, Js, {
    rows: q,
    type: J('text'),
    rules: Array,
    autosize: [Boolean, Object],
    labelWidth: q,
    labelClass: je,
    labelAlign: String,
    showWordLimit: Boolean,
    errorMessageAlign: String,
    colon: { type: Boolean, default: null }
  })
var FS = U({
  name: NS,
  props: hm,
  emits: [
    'blur',
    'focus',
    'clear',
    'keypress',
    'clickInput',
    'endValidate',
    'startValidate',
    'clickLeftIcon',
    'clickRightIcon',
    'update:modelValue'
  ],
  setup(e, { emit: t, slots: n }) {
    const o = fa(),
      a = He({ status: 'unvalidated', focused: !1, validateMessage: '' }),
      i = M(),
      l = M(),
      r = M(),
      { parent: s } = ht(yh),
      c = () => {
        var E
        return String((E = e.modelValue) != null ? E : '')
      },
      u = E => {
        if (Ee(e[E])) return e[E]
        if (s && Ee(s.props[E])) return s.props[E]
      },
      d = B(() => {
        const E = u('readonly')
        if (e.clearable && !E) {
          const F = c() !== '',
            V = e.clearTrigger === 'always' || (e.clearTrigger === 'focus' && a.focused)
          return F && V
        }
        return !1
      }),
      h = B(() => (r.value && n.input ? r.value() : e.modelValue)),
      m = B(() => {
        var E
        const F = u('required')
        return F === 'auto' ? ((E = e.rules) == null ? void 0 : E.some(V => V.required)) : F
      }),
      y = E =>
        E.reduce(
          (F, V) =>
            F.then(() => {
              if (a.status === 'failed') return
              let { value: Q } = h
              if ((V.formatter && (Q = V.formatter(Q, V)), !$S(Q, V))) {
                ;((a.status = 'failed'), (a.validateMessage = zu(Q, V)))
                return
              }
              if (V.validator)
                return fm(Q) && V.validateEmpty === !1
                  ? void 0
                  : BS(Q, V).then(fe => {
                      fe && typeof fe == 'string'
                        ? ((a.status = 'failed'), (a.validateMessage = fe))
                        : fe === !1 && ((a.status = 'failed'), (a.validateMessage = zu(Q, V)))
                    })
            }),
          Promise.resolve()
        ),
      p = () => {
        ;((a.status = 'unvalidated'), (a.validateMessage = ''))
      },
      b = () => t('endValidate', { status: a.status, message: a.validateMessage }),
      x = (E = e.rules) =>
        new Promise(F => {
          ;(p(),
            E
              ? (t('startValidate'),
                y(E).then(() => {
                  a.status === 'failed'
                    ? (F({ name: e.name, message: a.validateMessage }), b())
                    : ((a.status = 'passed'), F(), b())
                }))
              : F())
        }),
      g = E => {
        if (s && e.rules) {
          const { validateTrigger: F } = s.props,
            V = tl(F).includes(E),
            Q = e.rules.filter(fe => (fe.trigger ? tl(fe.trigger).includes(E) : V))
          Q.length && x(Q)
        }
      },
      C = E => {
        var F
        const { maxlength: V } = e
        if (Ee(V) && wa(E) > +V) {
          const Q = c()
          if (Q && wa(Q) === +V) return Q
          let fe = (F = i.value) == null ? void 0 : F.selectionEnd
          if (a.focused && fe) {
            const k = [...E],
              R = k.length - +V
            return ((fe = wa(E.slice(0, fe))), k.splice(fe - R, R), k.join(''))
          }
          return xr(E, +V)
        }
        return E
      },
      S = (E, F = 'onChange') => {
        var V, Q
        const fe = E
        E = C(E)
        const k = fe.length - E.length
        if (e.type === 'number' || e.type === 'digit') {
          const $ = e.type === 'number'
          if (
            ((E = rs(E, $, $)),
            F === 'onBlur' && E !== '' && (e.min !== void 0 || e.max !== void 0))
          ) {
            const N = it(+E, (V = e.min) != null ? V : -1 / 0, (Q = e.max) != null ? Q : 1 / 0)
            ;+E !== N && (E = N.toString())
          }
        }
        let R = 0
        if (e.formatter && F === e.formatTrigger) {
          const { formatter: $, maxlength: N } = e
          if (((E = $(E)), Ee(N) && wa(E) > +N && (E = xr(E, +N)), i.value && a.focused)) {
            const { selectionEnd: Y } = i.value,
              W = xr(fe, Y)
            R = $(W).length - W.length
          }
        }
        if (i.value && i.value.value !== E)
          if (a.focused) {
            let { selectionStart: $, selectionEnd: N } = i.value
            if (((i.value.value = E), Ee($) && Ee(N))) {
              const Y = E.length
              ;(k ? (($ -= k), (N -= k)) : R && (($ += R), (N += R)),
                i.value.setSelectionRange(Math.min($, Y), Math.min(N, Y)))
            }
          } else i.value.value = E
        E !== e.modelValue && t('update:modelValue', E)
      },
      v = E => {
        E.target.composing || S(E.target.value)
      },
      _ = () => {
        var E
        return (E = i.value) == null ? void 0 : E.blur()
      },
      P = () => {
        var E
        return (E = i.value) == null ? void 0 : E.focus()
      },
      w = () => {
        const E = i.value
        e.type === 'textarea' && e.autosize && E && VS(E, e.autosize)
      },
      A = E => {
        ;((a.focused = !0), t('focus', E), Se(w), u('readonly') && _())
      },
      O = E => {
        ;((a.focused = !1),
          S(c(), 'onBlur'),
          t('blur', E),
          !u('readonly') && (g('onBlur'), Se(w), fh()))
      },
      I = E => t('clickInput', E),
      T = E => t('clickLeftIcon', E),
      D = E => t('clickRightIcon', E),
      z = E => {
        ;(Fe(E), t('update:modelValue', ''), t('clear', E))
      },
      oe = B(() => {
        if (typeof e.error == 'boolean') return e.error
        if (s && s.props.showError && a.status === 'failed') return !0
      }),
      L = B(() => {
        const E = u('labelWidth'),
          F = u('labelAlign')
        if (E && F !== 'top') return { width: pe(E) }
      }),
      ee = E => {
        ;(E.keyCode === 13 &&
          (!(s && s.props.submitOnEnter) && e.type !== 'textarea' && Fe(E),
          e.type === 'search' && _()),
          t('keypress', E))
      },
      ae = () => e.id || `${o}-input`,
      _e = () => a.status,
      ke = () => {
        const E = $t('control', [
          u('inputAlign'),
          { error: oe.value, custom: !!n.input, 'min-height': e.type === 'textarea' && !e.autosize }
        ])
        if (n.input) return f('div', { class: E, onClick: I }, [n.input()])
        const F = {
          id: ae(),
          ref: i,
          name: e.name,
          rows: e.rows !== void 0 ? +e.rows : void 0,
          class: E,
          disabled: u('disabled'),
          readonly: u('readonly'),
          autofocus: e.autofocus,
          placeholder: e.placeholder,
          autocomplete: e.autocomplete,
          autocapitalize: e.autocapitalize,
          autocorrect: e.autocorrect,
          enterkeyhint: e.enterkeyhint,
          spellcheck: e.spellcheck,
          'aria-labelledby': e.label ? `${o}-label` : void 0,
          'data-allow-mismatch': 'attribute',
          onBlur: O,
          onFocus: A,
          onInput: v,
          onClick: I,
          onChange: ju,
          onKeypress: ee,
          onCompositionend: ju,
          onCompositionstart: MS
        }
        return e.type === 'textarea'
          ? f('textarea', Ce(F, { inputmode: e.inputmode }), null)
          : f('input', Ce(LS(e.type, e.inputmode), F), null)
      },
      re = () => {
        const E = n['left-icon']
        if (e.leftIcon || E)
          return f('div', { class: $t('left-icon'), onClick: T }, [
            E ? E() : f(we, { name: e.leftIcon, classPrefix: e.iconPrefix }, null)
          ])
      },
      H = () => {
        const E = n['right-icon']
        if (e.rightIcon || E)
          return f('div', { class: $t('right-icon'), onClick: D }, [
            E ? E() : f(we, { name: e.rightIcon, classPrefix: e.iconPrefix }, null)
          ])
      },
      ne = () => {
        if (e.showWordLimit && e.maxlength) {
          const E = wa(c())
          return f('div', { class: $t('word-limit') }, [
            f('span', { class: $t('word-num') }, [E]),
            $s('/'),
            e.maxlength
          ])
        }
      },
      me = () => {
        if (s && s.props.showErrorMessage === !1) return
        const E = e.errorMessage || a.validateMessage
        if (E) {
          const F = n['error-message'],
            V = u('errorMessageAlign')
          return f('div', { class: $t('error-message', V) }, [F ? F({ message: E }) : E])
        }
      },
      G = () => {
        const E = u('labelWidth'),
          F = u('labelAlign'),
          V = u('colon') ? ':' : ''
        if (n.label) return [n.label(), V]
        if (e.label)
          return f(
            'label',
            {
              id: `${o}-label`,
              for: n.input ? void 0 : ae(),
              'data-allow-mismatch': 'attribute',
              onClick: Q => {
                ;(Fe(Q), P())
              },
              style: F === 'top' && E ? { width: pe(E) } : void 0
            },
            [e.label + V]
          )
      },
      ue = () => [
        f('div', { class: $t('body') }, [
          ke(),
          d.value && f(we, { ref: l, name: e.clearIcon, class: $t('clear') }, null),
          H(),
          n.button && f('div', { class: $t('button') }, [n.button()])
        ]),
        ne(),
        me()
      ]
    return (
      Te({
        blur: _,
        focus: P,
        validate: x,
        formValue: h,
        resetValidation: p,
        getValidationStatus: _e,
        adjustTextareaSize: w
      }),
      hn(dh, { customValue: r, resetValidation: p, validateWithTrigger: g }),
      te(
        () => e.modelValue,
        () => {
          ;(S(c()), p(), g('onChange'), Se(w))
        }
      ),
      We(() => {
        ;(S(c(), e.formatTrigger), Se(w))
      }),
      Xe('touchstart', z, {
        target: B(() => {
          var E
          return (E = l.value) == null ? void 0 : E.$el
        })
      }),
      () => {
        const E = u('disabled'),
          F = u('labelAlign'),
          V = re(),
          Q = () => {
            const fe = G()
            return F === 'top' ? [V, fe].filter(Boolean) : fe || []
          }
        return f(
          jt,
          {
            size: e.size,
            class: $t({ error: oe.value, disabled: E, [`label-${F}`]: F }),
            center: e.center,
            border: e.border,
            isLink: E ? !1 : e.isLink,
            clickable: E ? !1 : e.clickable,
            onClick: E ? fe => fe.stopImmediatePropagation() : void 0,
            titleStyle: L.value,
            valueClass: $t('value'),
            titleClass: [$t('label', [F, { required: m.value }]), e.labelClass],
            arrowDirection: e.arrowDirection
          },
          { icon: V && F !== 'top' ? () => V : null, title: Q, value: ue, extra: n.extra }
        )
      }
    )
  }
})
const gn = Z(FS)
let xa = 0
function HS(e) {
  e
    ? (xa || document.body.classList.add('van-toast--unclickable'), xa++)
    : xa && (xa--, xa || document.body.classList.remove('van-toast--unclickable'))
}
const [zS, Ro] = K('toast'),
  jS = [
    'show',
    'overlay',
    'teleport',
    'transition',
    'overlayClass',
    'overlayStyle',
    'closeOnClickOverlay',
    'zIndex'
  ],
  mm = {
    icon: String,
    show: Boolean,
    type: J('text'),
    overlay: Boolean,
    message: q,
    iconSize: q,
    duration: Je(2e3),
    position: J('middle'),
    teleport: [String, Object],
    wordBreak: String,
    className: je,
    iconPrefix: String,
    transition: J('van-fade'),
    loadingType: String,
    forbidClick: Boolean,
    overlayClass: je,
    overlayStyle: Object,
    closeOnClick: Boolean,
    closeOnClickOverlay: Boolean,
    zIndex: q
  }
var gm = U({
  name: zS,
  props: mm,
  emits: ['update:show'],
  setup(e, { emit: t, slots: n }) {
    let o,
      a = !1
    const i = () => {
        const d = e.show && e.forbidClick
        a !== d && ((a = d), HS(a))
      },
      l = d => t('update:show', d),
      r = () => {
        e.closeOnClick && l(!1)
      },
      s = () => clearTimeout(o),
      c = () => {
        const { icon: d, type: h, iconSize: m, iconPrefix: y, loadingType: p } = e
        if (d || h === 'success' || h === 'fail')
          return f(we, { name: d || h, size: m, class: Ro('icon'), classPrefix: y }, null)
        if (h === 'loading') return f(Ft, { class: Ro('loading'), size: m, type: p }, null)
      },
      u = () => {
        const { type: d, message: h } = e
        if (n.message) return f('div', { class: Ro('text') }, [n.message()])
        if (Ee(h) && h !== '')
          return d === 'html'
            ? f('div', { key: 0, class: Ro('text'), innerHTML: String(h) }, null)
            : f('div', { class: Ro('text') }, [h])
      }
    return (
      te(() => [e.show, e.forbidClick], i),
      te(
        () => [e.show, e.type, e.message, e.duration],
        () => {
          ;(s(),
            e.show &&
              e.duration > 0 &&
              (o = setTimeout(() => {
                l(!1)
              }, e.duration)))
        }
      ),
      We(i),
      sa(i),
      () =>
        f(
          zt,
          Ce(
            {
              class: [
                Ro([
                  e.position,
                  e.wordBreak === 'normal' ? 'break-normal' : e.wordBreak,
                  { [e.type]: !e.icon }
                ]),
                e.className
              ],
              lockScroll: !1,
              onClick: r,
              onClosed: s,
              'onUpdate:show': l
            },
            Ie(e, jS)
          ),
          { default: () => [c(), u()] }
        )
    )
  }
})
function Qs() {
  const e = He({ show: !1 }),
    t = a => {
      e.show = a
    },
    n = a => {
      ;(he(e, a, { transitionAppear: !0 }), t(!0))
    },
    o = () => t(!1)
  return (Te({ open: n, close: o, toggle: t }), { open: n, close: o, state: e, toggle: t })
}
function ec(e) {
  const t = Wf(e),
    n = document.createElement('div')
  return (
    document.body.appendChild(n),
    {
      instance: t.mount(n),
      unmount() {
        ;(t.unmount(), document.body.removeChild(n))
      }
    }
  )
}
const WS = {
  icon: '',
  type: 'text',
  message: '',
  className: '',
  overlay: !1,
  onClose: void 0,
  onOpened: void 0,
  duration: 2e3,
  teleport: 'body',
  iconSize: void 0,
  iconPrefix: void 0,
  position: 'middle',
  transition: 'van-fade',
  forbidClick: !1,
  loadingType: void 0,
  overlayClass: '',
  overlayStyle: void 0,
  closeOnClick: !1,
  closeOnClickOverlay: !1
}
let pi = [],
  US = !1,
  Wu = he({}, WS)
const KS = new Map()
function YS(e) {
  return Qt(e) ? e : { message: e }
}
function GS() {
  const { instance: e } = ec({
    setup() {
      const t = M(''),
        { open: n, state: o, close: a, toggle: i } = Qs(),
        l = () => {},
        r = () => f(gm, Ce(o, { onClosed: l, 'onUpdate:show': i }), null)
      return (
        te(t, s => {
          o.message = s
        }),
        (Et().render = r),
        { open: n, close: a, message: t }
      )
    }
  })
  return e
}
function qS() {
  if (!pi.length || US) {
    const e = GS()
    pi.push(e)
  }
  return pi[pi.length - 1]
}
function rl(e = {}) {
  if (!Ot) return {}
  const t = qS(),
    n = YS(e)
  return (t.open(he({}, Wu, KS.get(n.type || Wu.type), n)), t)
}
const vm = Z(gm),
  [XS, Sr] = K('switch'),
  bm = {
    size: q,
    loading: Boolean,
    disabled: Boolean,
    modelValue: je,
    activeColor: String,
    inactiveColor: String,
    activeValue: { type: je, default: !0 },
    inactiveValue: { type: je, default: !1 }
  }
var ZS = U({
  name: XS,
  props: bm,
  emits: ['change', 'update:modelValue'],
  setup(e, { emit: t, slots: n }) {
    const o = () => e.modelValue === e.activeValue,
      a = () => {
        if (!e.disabled && !e.loading) {
          const l = o() ? e.inactiveValue : e.activeValue
          ;(t('update:modelValue', l), t('change', l))
        }
      },
      i = () => {
        if (e.loading) {
          const l = o() ? e.activeColor : e.inactiveColor
          return f(Ft, { class: Sr('loading'), color: l }, null)
        }
        if (n.node) return n.node()
      }
    return (
      ao(() => e.modelValue),
      () => {
        var l
        const { size: r, loading: s, disabled: c, activeColor: u, inactiveColor: d } = e,
          h = o(),
          m = { fontSize: pe(r), backgroundColor: h ? u : d }
        return f(
          'div',
          {
            role: 'switch',
            class: Sr({ on: h, loading: s, disabled: c }),
            style: m,
            tabindex: c ? void 0 : 0,
            'aria-checked': h,
            onClick: a
          },
          [f('div', { class: Sr('node') }, [i()]), (l = n.background) == null ? void 0 : l.call(n)]
        )
      }
    )
  }
})
const jl = Z(ZS),
  [JS, Uu] = K('address-edit-detail'),
  Ku = K('address-edit')[2]
var QS = U({
  name: JS,
  props: {
    show: Boolean,
    rows: q,
    value: String,
    rules: Array,
    focused: Boolean,
    maxlength: q,
    searchResult: Array,
    showSearchResult: Boolean
  },
  emits: ['blur', 'focus', 'input', 'selectSearch'],
  setup(e, { emit: t }) {
    const n = M(),
      o = () => e.focused && e.searchResult && e.showSearchResult,
      a = c => {
        ;(t('selectSearch', c), t('input', `${c.address || ''} ${c.name || ''}`.trim()))
      },
      i = () => {
        if (!o()) return
        const { searchResult: c } = e
        return c.map(u =>
          f(
            jt,
            {
              clickable: !0,
              key: (u.name || '') + (u.address || ''),
              icon: 'location-o',
              title: u.name,
              label: u.address,
              class: Uu('search-item'),
              border: !1,
              onClick: () => a(u)
            },
            null
          )
        )
      },
      l = c => t('blur', c),
      r = c => t('focus', c),
      s = c => t('input', c)
    return () => {
      if (e.show)
        return f(qe, null, [
          f(
            gn,
            {
              autosize: !0,
              clearable: !0,
              ref: n,
              class: Uu(),
              rows: e.rows,
              type: 'textarea',
              rules: e.rules,
              label: Ku('addressDetail'),
              border: !o(),
              maxlength: e.maxlength,
              modelValue: e.value,
              placeholder: Ku('addressDetail'),
              onBlur: l,
              onFocus: r,
              'onUpdate:modelValue': s
            },
            null
          ),
          i()
        ])
    }
  }
})
const [eC, Do, pt] = K('address-edit'),
  ym = {
    name: '',
    tel: '',
    city: '',
    county: '',
    province: '',
    areaCode: '',
    isDefault: !1,
    addressDetail: ''
  },
  pm = {
    areaList: Object,
    isSaving: Boolean,
    isDeleting: Boolean,
    validator: Function,
    showArea: j,
    showDetail: j,
    showDelete: Boolean,
    disableArea: Boolean,
    searchResult: Array,
    telMaxlength: q,
    showSetDefault: Boolean,
    saveButtonText: String,
    areaPlaceholder: String,
    deleteButtonText: String,
    showSearchResult: Boolean,
    detailRows: se(1),
    detailMaxlength: se(200),
    areaColumnsPlaceholder: ze(),
    addressInfo: { type: Object, default: () => he({}, ym) },
    telValidator: { type: Function, default: sh }
  }
var tC = U({
  name: eC,
  props: pm,
  emits: [
    'save',
    'focus',
    'change',
    'delete',
    'clickArea',
    'changeArea',
    'changeDetail',
    'selectSearch',
    'changeDefault'
  ],
  setup(e, { emit: t, slots: n }) {
    const o = M(),
      a = He({}),
      i = M(!1),
      l = M(!1),
      r = B(() => Qt(e.areaList) && Object.keys(e.areaList).length),
      s = B(() => {
        const { province: _, city: P, county: w, areaCode: A } = a
        if (A) {
          const O = [_, P, w]
          return (_ && _ === P && O.splice(1, 1), O.filter(Boolean).join('/'))
        }
        return ''
      }),
      c = B(() => {
        var _
        return ((_ = e.searchResult) == null ? void 0 : _.length) && l.value
      }),
      u = _ => {
        ;((l.value = _ === 'addressDetail'), t('focus', _))
      },
      d = (_, P) => {
        t('change', { key: _, value: P })
      },
      h = B(() => {
        const { validator: _, telValidator: P } = e,
          w = (A, O) => ({
            validator: I => {
              if (_) {
                const T = _(A, I)
                if (T) return T
              }
              return I ? !0 : O
            }
          })
        return {
          name: [w('name', pt('nameEmpty'))],
          tel: [w('tel', pt('telInvalid')), { validator: P, message: pt('telInvalid') }],
          areaCode: [w('areaCode', pt('areaEmpty'))],
          addressDetail: [w('addressDetail', pt('addressEmpty'))]
        }
      }),
      m = () => t('save', a),
      y = _ => {
        ;((a.addressDetail = _), t('changeDetail', _))
      },
      p = _ => {
        ;((a.province = _[0].text), (a.city = _[1].text), (a.county = _[2].text))
      },
      b = ({ selectedValues: _, selectedOptions: P }) => {
        _.some(w => w === qo) ? rl(pt('areaEmpty')) : ((i.value = !1), p(P), t('changeArea', P))
      },
      x = () => t('delete', a),
      g = _ => {
        a.areaCode = _ || ''
      },
      C = () => {
        setTimeout(() => {
          l.value = !1
        })
      },
      S = _ => {
        a.addressDetail = _
      },
      v = () => {
        if (e.showSetDefault) {
          const _ = {
            'right-icon': () =>
              f(
                jl,
                {
                  modelValue: a.isDefault,
                  'onUpdate:modelValue': P => (a.isDefault = P),
                  onChange: P => t('changeDefault', P)
                },
                null
              )
          }
          return rt(
            f(jt, { center: !0, border: !1, title: pt('defaultAddress'), class: Do('default') }, _),
            [[ft, !c.value]]
          )
        }
      }
    return (
      Te({ setAreaCode: g, setAddressDetail: S }),
      te(
        () => e.addressInfo,
        _ => {
          ;(he(a, ym, _),
            Se(() => {
              var P
              const w = (P = o.value) == null ? void 0 : P.getSelectedOptions()
              w && w.every(A => A && A.value !== qo) && p(w)
            }))
        },
        { deep: !0, immediate: !0 }
      ),
      () => {
        const { disableArea: _ } = e
        return f(
          zl,
          { class: Do(), onSubmit: m },
          {
            default: () => {
              var P
              return [
                f('div', { class: Do('fields') }, [
                  f(
                    gn,
                    {
                      modelValue: a.name,
                      'onUpdate:modelValue': [w => (a.name = w), w => d('name', w)],
                      clearable: !0,
                      label: pt('name'),
                      rules: h.value.name,
                      placeholder: pt('name'),
                      onFocus: () => u('name')
                    },
                    null
                  ),
                  f(
                    gn,
                    {
                      modelValue: a.tel,
                      'onUpdate:modelValue': [w => (a.tel = w), w => d('tel', w)],
                      clearable: !0,
                      type: 'tel',
                      label: pt('tel'),
                      rules: h.value.tel,
                      maxlength: e.telMaxlength,
                      placeholder: pt('tel'),
                      onFocus: () => u('tel')
                    },
                    null
                  ),
                  rt(
                    f(
                      gn,
                      {
                        readonly: !0,
                        label: pt('area'),
                        'is-link': !_,
                        modelValue: s.value,
                        rules: e.showArea ? h.value.areaCode : void 0,
                        placeholder: e.areaPlaceholder || pt('area'),
                        onFocus: () => u('areaCode'),
                        onClick: () => {
                          ;(t('clickArea'), (i.value = !_))
                        }
                      },
                      null
                    ),
                    [[ft, e.showArea]]
                  ),
                  f(
                    QS,
                    {
                      show: e.showDetail,
                      rows: e.detailRows,
                      rules: h.value.addressDetail,
                      value: a.addressDetail,
                      focused: l.value,
                      maxlength: e.detailMaxlength,
                      searchResult: e.searchResult,
                      showSearchResult: e.showSearchResult,
                      onBlur: C,
                      onFocus: () => u('addressDetail'),
                      onInput: y,
                      onSelectSearch: w => t('selectSearch', w)
                    },
                    null
                  ),
                  (P = n.default) == null ? void 0 : P.call(n)
                ]),
                v(),
                rt(
                  f('div', { class: Do('buttons') }, [
                    f(
                      st,
                      {
                        block: !0,
                        round: !0,
                        type: 'primary',
                        text: e.saveButtonText || pt('save'),
                        class: Do('button'),
                        loading: e.isSaving,
                        nativeType: 'submit'
                      },
                      null
                    ),
                    e.showDelete &&
                      f(
                        st,
                        {
                          block: !0,
                          round: !0,
                          class: Do('button'),
                          loading: e.isDeleting,
                          text: e.deleteButtonText || pt('delete'),
                          onClick: x
                        },
                        null
                      )
                  ]),
                  [[ft, !c.value]]
                ),
                f(
                  zt,
                  {
                    show: i.value,
                    'onUpdate:show': w => (i.value = w),
                    round: !0,
                    teleport: 'body',
                    position: 'bottom',
                    lazyRender: !1
                  },
                  {
                    default: () => [
                      f(
                        Zs,
                        {
                          modelValue: a.areaCode,
                          'onUpdate:modelValue': w => (a.areaCode = w),
                          ref: o,
                          loading: !r.value,
                          areaList: e.areaList,
                          columnsPlaceholder: e.areaColumnsPlaceholder,
                          onConfirm: b,
                          onCancel: () => {
                            i.value = !1
                          }
                        },
                        null
                      )
                    ]
                  }
                )
              ]
            }
          }
        )
      }
    )
  }
})
const wm = Z(tC),
  [xm, nC] = K('radio-group'),
  Sm = {
    shape: String,
    disabled: Boolean,
    iconSize: q,
    direction: String,
    modelValue: je,
    checkedColor: String
  },
  Cm = Symbol(xm)
var oC = U({
  name: xm,
  props: Sm,
  emits: ['change', 'update:modelValue'],
  setup(e, { emit: t, slots: n }) {
    const { linkChildren: o } = yt(Cm),
      a = i => t('update:modelValue', i)
    return (
      te(
        () => e.modelValue,
        i => t('change', i)
      ),
      o({ props: e, updateValue: a }),
      ao(() => e.modelValue),
      () => {
        var i
        return f('div', { class: nC([e.direction]), role: 'radiogroup' }, [
          (i = n.default) == null ? void 0 : i.call(n)
        ])
      }
    )
  }
})
const Wl = Z(oC),
  [_m, aC] = K('checkbox-group'),
  Tm = {
    max: q,
    shape: J('round'),
    disabled: Boolean,
    iconSize: q,
    direction: String,
    modelValue: ze(),
    checkedColor: String
  },
  Em = Symbol(_m)
var iC = U({
  name: _m,
  props: Tm,
  emits: ['change', 'update:modelValue'],
  setup(e, { emit: t, slots: n }) {
    const { children: o, linkChildren: a } = yt(Em),
      i = r => t('update:modelValue', r),
      l = (r = {}) => {
        typeof r == 'boolean' && (r = { checked: r })
        const { checked: s, skipDisabled: c } = r,
          d = o
            .filter(h =>
              h.props.bindGroup
                ? h.props.disabled && c
                  ? h.checked.value
                  : (s ?? !h.checked.value)
                : !1
            )
            .map(h => h.name)
        i(d)
      }
    return (
      te(
        () => e.modelValue,
        r => t('change', r)
      ),
      Te({ toggleAll: l }),
      ao(() => e.modelValue),
      a({ props: e, updateValue: i }),
      () => {
        var r
        return f('div', { class: aC([e.direction]) }, [
          (r = n.default) == null ? void 0 : r.call(n)
        ])
      }
    )
  }
})
const tc = Z(iC),
  [lC, Yu] = K('tag'),
  km = {
    size: String,
    mark: Boolean,
    show: j,
    type: J('default'),
    color: String,
    plain: Boolean,
    round: Boolean,
    textColor: String,
    closeable: Boolean
  }
var rC = U({
  name: lC,
  props: km,
  emits: ['close'],
  setup(e, { slots: t, emit: n }) {
    const o = l => {
        ;(l.stopPropagation(), n('close', l))
      },
      a = () =>
        e.plain
          ? { color: e.textColor || e.color, borderColor: e.color }
          : { color: e.textColor, background: e.color },
      i = () => {
        var l
        const { type: r, mark: s, plain: c, round: u, size: d, closeable: h } = e,
          m = { mark: s, plain: c, round: u }
        d && (m[d] = d)
        const y = h && f(we, { name: 'cross', class: [Yu('close'), bt], onClick: o }, null)
        return f('span', { style: a(), class: Yu([m, r]) }, [
          (l = t.default) == null ? void 0 : l.call(t),
          y
        ])
      }
    return () =>
      f(oi, { name: e.closeable ? 'van-fade' : void 0 }, { default: () => [e.show ? i() : null] })
  }
})
const ri = Z(rC),
  nc = {
    name: je,
    disabled: Boolean,
    iconSize: q,
    modelValue: je,
    checkedColor: String,
    labelPosition: String,
    labelDisabled: Boolean
  }
var Am = U({
  props: he({}, nc, {
    bem: lt(Function),
    role: String,
    shape: String,
    parent: Object,
    checked: Boolean,
    bindGroup: j,
    indeterminate: { type: Boolean, default: null }
  }),
  emits: ['click', 'toggle'],
  setup(e, { emit: t, slots: n }) {
    const o = M(),
      a = h => {
        if (e.parent && e.bindGroup) return e.parent.props[h]
      },
      i = B(() => {
        if (e.parent && e.bindGroup) {
          const h = a('disabled') || e.disabled
          if (e.role === 'checkbox') {
            const m = a('modelValue').length,
              y = a('max'),
              p = y && m >= +y
            return h || (p && !e.checked)
          }
          return h
        }
        return e.disabled
      }),
      l = B(() => a('direction')),
      r = B(() => {
        const h = e.checkedColor || a('checkedColor')
        if (h && (e.checked || e.indeterminate) && !i.value)
          return { borderColor: h, backgroundColor: h }
      }),
      s = B(() => e.shape || a('shape') || 'round'),
      c = h => {
        const { target: m } = h,
          y = o.value,
          p = y === m || (y == null ? void 0 : y.contains(m))
        ;(!i.value && (p || !e.labelDisabled) && t('toggle'), t('click', h))
      },
      u = () => {
        var h, m
        const { bem: y, checked: p, indeterminate: b } = e,
          x = e.iconSize || a('iconSize')
        return f(
          'div',
          {
            ref: o,
            class: y('icon', [s.value, { disabled: i.value, checked: p, indeterminate: b }]),
            style:
              s.value !== 'dot'
                ? { fontSize: pe(x) }
                : {
                    width: pe(x),
                    height: pe(x),
                    borderColor: (h = r.value) == null ? void 0 : h.borderColor
                  }
          },
          [
            n.icon
              ? n.icon({ checked: p, disabled: i.value })
              : s.value !== 'dot'
                ? f(we, { name: b ? 'minus' : 'success', style: r.value }, null)
                : f(
                    'div',
                    {
                      class: y('icon--dot__icon'),
                      style: { backgroundColor: (m = r.value) == null ? void 0 : m.backgroundColor }
                    },
                    null
                  )
          ]
        )
      },
      d = () => {
        const { checked: h } = e
        if (n.default)
          return f('span', { class: e.bem('label', [e.labelPosition, { disabled: i.value }]) }, [
            n.default({ checked: h, disabled: i.value })
          ])
      }
    return () => {
      const h = e.labelPosition === 'left' ? [d(), u()] : [u(), d()]
      return f(
        'div',
        {
          role: e.role,
          class: e.bem([{ disabled: i.value, 'label-disabled': e.labelDisabled }, l.value]),
          tabindex: i.value ? void 0 : 0,
          'aria-checked': e.checked,
          onClick: c
        },
        [h]
      )
    }
  }
})
const Pm = he({}, nc, { shape: String }),
  [sC, cC] = K('radio')
var uC = U({
  name: sC,
  props: Pm,
  emits: ['update:modelValue'],
  setup(e, { emit: t, slots: n }) {
    const { parent: o } = ht(Cm),
      a = () => (o ? o.props.modelValue : e.modelValue) === e.name,
      i = () => {
        o ? o.updateValue(e.name) : t('update:modelValue', e.name)
      }
    return () =>
      f(
        Am,
        Ce({ bem: cC, role: 'radio', parent: o, checked: a(), onToggle: i }, e),
        Ie(n, ['default', 'icon'])
      )
  }
})
const Ul = Z(uC),
  [dC, fC] = K('checkbox'),
  Im = he({}, nc, { shape: String, bindGroup: j, indeterminate: { type: Boolean, default: null } })
var hC = U({
  name: dC,
  props: Im,
  emits: ['change', 'update:modelValue'],
  setup(e, { emit: t, slots: n }) {
    const { parent: o } = ht(Em),
      a = r => {
        const { name: s } = e,
          { max: c, modelValue: u } = o.props,
          d = u.slice()
        if (r)
          !(c && d.length >= +c) && !d.includes(s) && (d.push(s), e.bindGroup && o.updateValue(d))
        else {
          const h = d.indexOf(s)
          h !== -1 && (d.splice(h, 1), e.bindGroup && o.updateValue(d))
        }
      },
      i = B(() => (o && e.bindGroup ? o.props.modelValue.indexOf(e.name) !== -1 : !!e.modelValue)),
      l = (r = !i.value) => {
        ;(o && e.bindGroup ? a(r) : t('update:modelValue', r),
          e.indeterminate !== null && t('change', r))
      }
    return (
      te(
        () => e.modelValue,
        r => {
          e.indeterminate === null && t('change', r)
        }
      ),
      Te({ toggle: l, props: e, checked: i }),
      ao(() => e.modelValue),
      () =>
        f(
          Am,
          Ce({ bem: fC, role: 'checkbox', parent: o, checked: i.value, onToggle: l }, e),
          Ie(n, ['default', 'icon'])
        )
    )
  }
})
const Kl = Z(hC),
  [mC, $o] = K('address-item')
var gC = U({
  name: mC,
  props: {
    address: lt(Object),
    disabled: Boolean,
    switchable: Boolean,
    singleChoice: Boolean,
    defaultTagText: String,
    rightIcon: J('edit')
  },
  emits: ['edit', 'click', 'select'],
  setup(e, { slots: t, emit: n }) {
    const o = r => {
        ;(e.switchable && n('select'), n('click', r))
      },
      a = () =>
        f(
          we,
          {
            name: e.rightIcon,
            class: $o('edit'),
            onClick: r => {
              ;(r.stopPropagation(), n('edit'), n('click', r))
            }
          },
          null
        ),
      i = () => {
        if (t.tag) return t.tag(e.address)
        if (e.address.isDefault && e.defaultTagText)
          return f(
            ri,
            { type: 'primary', round: !0, class: $o('tag') },
            { default: () => [e.defaultTagText] }
          )
      },
      l = () => {
        const { address: r, disabled: s, switchable: c, singleChoice: u } = e,
          d = [
            f('div', { class: $o('name') }, [`${r.name} ${r.tel}`, i()]),
            f('div', { class: $o('address') }, [r.address])
          ]
        return c && !s
          ? u
            ? f(Ul, { name: r.id, iconSize: 18 }, { default: () => [d] })
            : f(Kl, { name: r.id, iconSize: 18 }, { default: () => [d] })
          : d
      }
    return () => {
      var r
      const { disabled: s } = e
      return f('div', { class: $o({ disabled: s }), onClick: o }, [
        f(jt, { border: !1, titleClass: $o('title') }, { title: l, 'right-icon': a }),
        (r = t.bottom) == null ? void 0 : r.call(t, he({}, e.address, { disabled: s }))
      ])
    }
  }
})
const [vC, wi, bC] = K('address-list'),
  Om = {
    list: ze(),
    modelValue: [...q, Array],
    switchable: j,
    disabledText: String,
    disabledList: ze(),
    showAddButton: j,
    addButtonText: String,
    defaultTagText: String,
    rightIcon: J('edit')
  }
var yC = U({
  name: vC,
  props: Om,
  emits: [
    'add',
    'edit',
    'select',
    'clickItem',
    'editDisabled',
    'selectDisabled',
    'update:modelValue'
  ],
  setup(e, { slots: t, emit: n }) {
    const o = B(() => !Array.isArray(e.modelValue)),
      a = (r, s, c) => {
        const u = () => n(c ? 'editDisabled' : 'edit', r, s),
          d = m => n('clickItem', r, s, { event: m }),
          h = () => {
            if ((n(c ? 'selectDisabled' : 'select', r, s), !c))
              if (o.value) n('update:modelValue', r.id)
              else {
                const m = e.modelValue
                m.includes(r.id)
                  ? n(
                      'update:modelValue',
                      m.filter(y => y !== r.id)
                    )
                  : n('update:modelValue', [...m, r.id])
              }
          }
        return f(
          gC,
          {
            key: r.id,
            address: r,
            disabled: c,
            switchable: e.switchable,
            singleChoice: o.value,
            defaultTagText: e.defaultTagText,
            rightIcon: e.rightIcon,
            onEdit: u,
            onClick: d,
            onSelect: h
          },
          { bottom: t['item-bottom'], tag: t.tag }
        )
      },
      i = (r, s) => {
        if (r) return r.map((c, u) => a(c, u, s))
      },
      l = () =>
        e.showAddButton
          ? f('div', { class: [wi('bottom'), 'van-safe-area-bottom'] }, [
              f(
                st,
                {
                  round: !0,
                  block: !0,
                  type: 'primary',
                  text: e.addButtonText || bC('add'),
                  class: wi('add'),
                  onClick: () => n('add')
                },
                null
              )
            ])
          : void 0
    return () => {
      var r, s
      const c = i(e.list),
        u = i(e.disabledList, !0),
        d = e.disabledText && f('div', { class: wi('disabled-text') }, [e.disabledText])
      return f('div', { class: wi() }, [
        (r = t.top) == null ? void 0 : r.call(t),
        !o.value && Array.isArray(e.modelValue)
          ? f(tc, { modelValue: e.modelValue }, { default: () => [c] })
          : f(Wl, { modelValue: e.modelValue }, { default: () => [c] }),
        d,
        u,
        (s = t.default) == null ? void 0 : s.call(t),
        l()
      ])
    }
  }
})
const Rm = Z(yC)
function pC(e, t) {
  let n = null,
    o = 0
  return function (...a) {
    if (n) return
    const i = Date.now() - o,
      l = () => {
        ;((o = Date.now()), (n = !1), e.apply(this, a))
      }
    i >= t ? l() : (n = setTimeout(l, t))
  }
}
const [wC, Cr] = K('back-top'),
  Dm = {
    right: q,
    bottom: q,
    zIndex: q,
    target: [String, Object],
    offset: se(200),
    immediate: Boolean,
    teleport: { type: [String, Object], default: 'body' }
  }
var xC = U({
  name: wC,
  inheritAttrs: !1,
  props: Dm,
  emits: ['click'],
  setup(e, { emit: t, slots: n, attrs: o }) {
    let a = !1
    const i = M(!1),
      l = M(),
      r = M(),
      s = B(() => he(Hn(e.zIndex), { right: pe(e.right), bottom: pe(e.bottom) })),
      c = m => {
        var y
        ;(t('click', m),
          (y = r.value) == null ||
            y.scrollTo({ top: 0, behavior: e.immediate ? 'auto' : 'smooth' }))
      },
      u = () => {
        i.value = r.value ? Bn(r.value) >= +e.offset : !1
      },
      d = () => {
        const { target: m } = e
        if (typeof m == 'string') {
          const y = document.querySelector(m)
          if (y) return y
        } else return m
      },
      h = () => {
        Ot &&
          Se(() => {
            ;((r.value = e.target ? d() : nl(l.value)), u())
          })
      }
    return (
      Xe('scroll', pC(u, 100), { target: r }),
      We(h),
      yn(() => {
        a && ((i.value = !0), (a = !1))
      }),
      pn(() => {
        i.value && e.teleport && ((i.value = !1), (a = !0))
      }),
      te(() => e.target, h),
      () => {
        const m = f(
          'div',
          Ce(
            {
              ref: e.teleport ? void 0 : l,
              class: Cr({ active: i.value }),
              style: s.value,
              onClick: c
            },
            o
          ),
          [n.default ? n.default() : f(we, { name: 'back-top', class: Cr('icon') }, null)]
        )
        return e.teleport
          ? [
              f('div', { ref: l, class: Cr('placeholder') }, null),
              f(Eo, { to: e.teleport }, { default: () => [m] })
            ]
          : m
      }
    )
  }
})
const $m = Z(xC)
var SC = (e, t, n) =>
  new Promise((o, a) => {
    var i = s => {
        try {
          r(n.next(s))
        } catch (c) {
          a(c)
        }
      },
      l = s => {
        try {
          r(n.throw(s))
        } catch (c) {
          a(c)
        }
      },
      r = s => (s.done ? o(s.value) : Promise.resolve(s.value).then(i, l))
    r((n = n.apply(e, t)).next())
  })
const Bm = {
    top: se(10),
    rows: se(4),
    duration: se(4e3),
    autoPlay: j,
    delay: Je(300),
    modelValue: ze()
  },
  [CC, Gu] = K('barrage')
var _C = U({
  name: CC,
  props: Bm,
  emits: ['update:modelValue'],
  setup(e, { emit: t, slots: n }) {
    const o = M(),
      a = Gu('item'),
      i = M(0),
      l = [],
      r = (p, b = e.delay) => {
        const x = document.createElement('span')
        return (
          (x.className = a),
          (x.innerText = String(p)),
          (x.style.animationDuration = `${e.duration}ms`),
          (x.style.animationDelay = `${b}ms`),
          (x.style.animationName = 'van-barrage'),
          (x.style.animationTimingFunction = 'linear'),
          x
        )
      },
      s = M(!0),
      c = M(e.autoPlay),
      u = ({ id: p, text: b }, x) => {
        var g
        const C = r(b, s.value ? x * e.delay : void 0)
        ;(!e.autoPlay && c.value === !1 && (C.style.animationPlayState = 'paused'),
          (g = o.value) == null || g.append(C),
          i.value++)
        const S = ((i.value - 1) % +e.rows) * C.offsetHeight + +e.top
        ;((C.style.top = `${S}px`),
          (C.dataset.id = String(p)),
          l.push(C),
          C.addEventListener('animationend', () => {
            t(
              'update:modelValue',
              [...e.modelValue].filter(v => String(v.id) !== C.dataset.id)
            )
          }))
      },
      d = (p, b) => {
        const x = new Map(b.map(g => [g.id, g]))
        ;(p.forEach((g, C) => {
          x.has(g.id) ? x.delete(g.id) : u(g, C)
        }),
          x.forEach(g => {
            const C = l.findIndex(S => S.dataset.id === String(g.id))
            C > -1 && (l[C].remove(), l.splice(C, 1))
          }),
          (s.value = !1))
      }
    te(
      () => e.modelValue.slice(),
      (p, b) => d(p ?? [], b ?? []),
      { deep: !0 }
    )
    const h = M({})
    return (
      We(() =>
        SC(null, null, function* () {
          var p
          ;((h.value['--move-distance'] = `-${(p = o.value) == null ? void 0 : p.offsetWidth}px`),
            yield Se(),
            d(e.modelValue, []))
        })
      ),
      Te({
        play: () => {
          ;((c.value = !0),
            l.forEach(p => {
              p.style.animationPlayState = 'running'
            }))
        },
        pause: () => {
          ;((c.value = !1),
            l.forEach(p => {
              p.style.animationPlayState = 'paused'
            }))
        }
      }),
      () => {
        var p
        return f('div', { class: Gu(), ref: o, style: h.value }, [
          (p = n.default) == null ? void 0 : p.call(n)
        ])
      }
    )
  }
})
const Mm = Z(_C),
  [TC, Ge, Rn] = K('calendar'),
  EC = e => Rn('monthTitle', e.getFullYear(), e.getMonth() + 1)
function po(e, t) {
  const n = e.getFullYear(),
    o = t.getFullYear()
  if (n === o) {
    const a = e.getMonth(),
      i = t.getMonth()
    return a === i ? 0 : a > i ? 1 : -1
  }
  return n > o ? 1 : -1
}
function Tt(e, t) {
  const n = po(e, t)
  if (n === 0) {
    const o = e.getDate(),
      a = t.getDate()
    return o === a ? 0 : o > a ? 1 : -1
  }
  return n
}
const aa = e => new Date(e),
  qu = e => (Array.isArray(e) ? e.map(aa) : aa(e))
function oc(e, t) {
  const n = aa(e)
  return (n.setDate(n.getDate() + t), n)
}
function ac(e, t) {
  const n = aa(e)
  return (n.setMonth(n.getMonth() + t), n.getDate() !== e.getDate() && n.setDate(0), n)
}
function Vm(e, t) {
  const n = aa(e)
  return (n.setFullYear(n.getFullYear() + t), n.getDate() !== e.getDate() && n.setDate(0), n)
}
const us = e => oc(e, -1),
  ds = e => oc(e, 1),
  Xu = e => ac(e, -1),
  Zu = e => ac(e, 1),
  Ju = e => Vm(e, -1),
  Qu = e => Vm(e, 1),
  xi = () => {
    const e = new Date()
    return (e.setHours(0, 0, 0, 0), e)
  }
function kC(e) {
  const t = e[0].getTime()
  return (e[1].getTime() - t) / (1e3 * 60 * 60 * 24) + 1
}
function AC(e, t = 0) {
  const n = new Date(e.getFullYear(), e.getMonth() + 1, 0),
    o = t + e.getDate() - 1,
    a = t + n.getDate() - 1
  return Math.floor(o / 7) === Math.floor(a / 7)
}
const Lm = he({}, Fl, {
    modelValue: ze(),
    filter: Function,
    formatter: { type: Function, default: (e, t) => t }
  }),
  Nm = Object.keys(Fl)
function PC(e, t) {
  if (e < 0) return []
  const n = Array(e)
  let o = -1
  for (; ++o < e;) n[o] = t(o)
  return n
}
const Fm = (e, t) => 32 - new Date(e, t - 1, 32).getDate(),
  Xo = (e, t, n, o, a, i) => {
    const l = PC(t - e + 1, r => {
      const s = Yt(e + r)
      return o(n, { text: s, value: s })
    })
    return a ? a(n, l, i) : l
  },
  Hm = (e, t) =>
    e.map((n, o) => {
      const a = t[o]
      if (a.length) {
        const i = +a[0].value,
          l = +a[a.length - 1].value
        return Yt(it(+n, i, l))
      }
      return n
    }),
  [IC] = K('calendar-day')
var OC = U({
  name: IC,
  props: { item: lt(Object), color: String, index: Number, offset: Je(0), rowHeight: String },
  emits: ['click', 'clickDisabledDate'],
  setup(e, { emit: t, slots: n }) {
    const o = B(() => {
        const { item: c, index: u, color: d, offset: h, rowHeight: m } = e,
          y = { height: m }
        if (c.type === 'placeholder') return ((y.width = '100%'), y)
        if ((u === 0 && (y.marginLeft = `${(100 * h) / 7}%`), d))
          switch (c.type) {
            case 'end':
            case 'start':
            case 'start-end':
            case 'multiple-middle':
            case 'multiple-selected':
              y.background = d
              break
            case 'middle':
              y.color = d
              break
          }
        return (c.date && AC(c.date, h) && (y.marginBottom = 0), y)
      }),
      a = () => {
        e.item.type !== 'disabled' ? t('click', e.item) : t('clickDisabledDate', e.item)
      },
      i = () => {
        const { topInfo: c } = e.item
        if (c || n['top-info'])
          return f('div', { class: Ge('top-info') }, [n['top-info'] ? n['top-info'](e.item) : c])
      },
      l = () => {
        const { bottomInfo: c } = e.item
        if (c || n['bottom-info'])
          return f('div', { class: Ge('bottom-info') }, [
            n['bottom-info'] ? n['bottom-info'](e.item) : c
          ])
      },
      r = () => (n.text ? n.text(e.item) : e.item.text),
      s = () => {
        const { item: c, color: u, rowHeight: d } = e,
          { type: h } = c,
          m = [i(), r(), l()]
        return h === 'selected'
          ? f('div', { class: Ge('selected-day'), style: { width: d, height: d, background: u } }, [
              m
            ])
          : m
      }
    return () => {
      const { type: c, className: u } = e.item
      return c === 'placeholder'
        ? f('div', { class: Ge('day'), style: o.value }, null)
        : f(
            'div',
            {
              role: 'gridcell',
              style: o.value,
              class: [Ge('day', c), u],
              tabindex: c === 'disabled' ? void 0 : -1,
              onClick: a
            },
            [s()]
          )
    }
  }
})
const [RC] = K('calendar-month'),
  DC = {
    date: lt(Date),
    type: String,
    color: String,
    minDate: Date,
    maxDate: Date,
    showMark: Boolean,
    rowHeight: q,
    formatter: Function,
    lazyRender: Boolean,
    currentDate: [Date, Array],
    allowSameDay: Boolean,
    showSubtitle: Boolean,
    showMonthTitle: Boolean,
    firstDayOfWeek: Number
  }
var $C = U({
  name: RC,
  props: DC,
  emits: ['click', 'clickDisabledDate'],
  setup(e, { emit: t, slots: n }) {
    const [o, a] = Ww(),
      i = M(),
      l = M(),
      r = xh(l),
      s = B(() => EC(e.date)),
      c = B(() => pe(e.rowHeight)),
      u = B(() => {
        const O = e.date.getDate(),
          T = (e.date.getDay() - (O % 7) + 8) % 7
        return e.firstDayOfWeek ? (T + 7 - e.firstDayOfWeek) % 7 : T
      }),
      d = B(() => Fm(e.date.getFullYear(), e.date.getMonth() + 1)),
      h = B(() => o.value || !e.lazyRender),
      m = () => s.value,
      y = O => {
        const I = T => e.currentDate.some(D => Tt(D, T) === 0)
        if (I(O)) {
          const T = us(O),
            D = ds(O),
            z = I(T),
            oe = I(D)
          return z && oe ? 'multiple-middle' : z ? 'end' : oe ? 'start' : 'multiple-selected'
        }
        return ''
      },
      p = O => {
        const [I, T] = e.currentDate
        if (!I) return ''
        const D = Tt(O, I)
        if (!T) return D === 0 ? 'start' : ''
        const z = Tt(O, T)
        return e.allowSameDay && D === 0 && z === 0
          ? 'start-end'
          : D === 0
            ? 'start'
            : z === 0
              ? 'end'
              : D > 0 && z < 0
                ? 'middle'
                : ''
      },
      b = O => {
        const { type: I, minDate: T, maxDate: D, currentDate: z } = e
        if ((T && Tt(O, T) < 0) || (D && Tt(O, D) > 0)) return 'disabled'
        if (z === null) return ''
        if (Array.isArray(z)) {
          if (I === 'multiple') return y(O)
          if (I === 'range') return p(O)
        } else if (I === 'single') return Tt(O, z) === 0 ? 'selected' : ''
        return ''
      },
      x = O => {
        if (e.type === 'range') {
          if (O === 'start' || O === 'end') return Rn(O)
          if (O === 'start-end') return `${Rn('start')}/${Rn('end')}`
        }
      },
      g = () => {
        if (e.showMonthTitle)
          return f('div', { class: Ge('month-title') }, [
            n['month-title'] ? n['month-title']({ date: e.date, text: s.value }) : s.value
          ])
      },
      C = () => {
        if (e.showMark && h.value)
          return f('div', { class: Ge('month-mark') }, [e.date.getMonth() + 1])
      },
      S = B(() => {
        const O = Math.ceil((d.value + u.value) / 7)
        return Array(O).fill({ type: 'placeholder' })
      }),
      v = B(() => {
        const O = [],
          I = e.date.getFullYear(),
          T = e.date.getMonth()
        for (let D = 1; D <= d.value; D++) {
          const z = new Date(I, T, D),
            oe = b(z)
          let L = { date: z, type: oe, text: D, bottomInfo: x(oe) }
          ;(e.formatter && (L = e.formatter(L)), O.push(L))
        }
        return O
      }),
      _ = B(() => v.value.filter(O => O.type === 'disabled')),
      P = (O, I) => {
        if (i.value) {
          const T = Oe(i.value),
            D = S.value.length,
            oe = ((Math.ceil((I.getDate() + u.value) / 7) - 1) * T.height) / D
          ol(O, T.top + oe + O.scrollTop - Oe(O).top)
        }
      },
      w = (O, I) =>
        f(
          OC,
          {
            item: O,
            index: I,
            color: e.color,
            offset: u.value,
            rowHeight: c.value,
            onClick: T => t('click', T),
            onClickDisabledDate: T => t('clickDisabledDate', T)
          },
          Ie(n, ['top-info', 'bottom-info', 'text'])
        ),
      A = () =>
        f('div', { ref: i, role: 'grid', class: Ge('days') }, [C(), (h.value ? v : S).value.map(w)])
    return (
      Te({
        getTitle: m,
        getHeight: () => r.value,
        setVisible: a,
        scrollToDate: P,
        disabledDays: _
      }),
      () => f('div', { class: Ge('month'), ref: l }, [g(), A()])
    )
  }
})
const [BC] = K('calendar-header')
var MC = U({
  name: BC,
  props: {
    date: Date,
    minDate: Date,
    maxDate: Date,
    title: String,
    subtitle: String,
    showTitle: Boolean,
    showSubtitle: Boolean,
    firstDayOfWeek: Number,
    switchMode: J('none')
  },
  emits: ['clickSubtitle', 'panelChange'],
  setup(e, { slots: t, emit: n }) {
    const o = B(() => e.date && e.minDate && po(Xu(e.date), e.minDate) < 0),
      a = B(() => e.date && e.minDate && po(Ju(e.date), e.minDate) < 0),
      i = B(() => e.date && e.maxDate && po(Zu(e.date), e.maxDate) > 0),
      l = B(() => e.date && e.maxDate && po(Qu(e.date), e.maxDate) > 0),
      r = () => {
        if (e.showTitle) {
          const m = e.title || Rn('title'),
            y = t.title ? t.title() : m
          return f('div', { class: Ge('header-title') }, [y])
        }
      },
      s = m => n('clickSubtitle', m),
      c = m => n('panelChange', m),
      u = m => {
        const y = e.switchMode === 'year-month',
          p = t[m ? 'next-month' : 'prev-month'],
          b = t[m ? 'next-year' : 'prev-year'],
          x = m ? i.value : o.value,
          g = m ? l.value : a.value,
          C = m ? 'arrow' : 'arrow-left',
          S = m ? 'arrow-double-right' : 'arrow-double-left',
          v = () => c((m ? Zu : Xu)(e.date)),
          _ = () => c((m ? Qu : Ju)(e.date)),
          P = f('view', { class: Ge('header-action', { disabled: x }), onClick: x ? void 0 : v }, [
            p ? p({ disabled: x }) : f(we, { class: { [bt]: !x }, name: C }, null)
          ]),
          w =
            y &&
            f('view', { class: Ge('header-action', { disabled: g }), onClick: g ? void 0 : _ }, [
              b ? b({ disabled: g }) : f(we, { class: { [bt]: !g }, name: S }, null)
            ])
        return m ? [P, w] : [w, P]
      },
      d = () => {
        if (e.showSubtitle) {
          const m = t.subtitle ? t.subtitle({ date: e.date, text: e.subtitle }) : e.subtitle,
            y = e.switchMode !== 'none'
          return f('div', { class: Ge('header-subtitle', { 'with-switch': y }), onClick: s }, [
            y ? [u(), f('div', { class: Ge('header-subtitle-text') }, [m]), u(!0)] : m
          ])
        }
      },
      h = () => {
        const { firstDayOfWeek: m } = e,
          y = Rn('weekdays'),
          p = [...y.slice(m, 7), ...y.slice(0, m)]
        return f('div', { class: Ge('weekdays') }, [
          p.map(b => f('span', { class: Ge('weekday') }, [b]))
        ])
      }
    return () => f('div', { class: Ge('header') }, [r(), d(), h()])
  }
})
const zm = {
  show: Boolean,
  type: J('single'),
  switchMode: J('none'),
  title: String,
  color: String,
  round: j,
  readonly: Boolean,
  poppable: j,
  maxRange: se(null),
  position: J('bottom'),
  teleport: [String, Object],
  showMark: j,
  showTitle: j,
  formatter: Function,
  rowHeight: q,
  confirmText: String,
  rangePrompt: String,
  lazyRender: j,
  showConfirm: j,
  defaultDate: [Date, Array],
  allowSameDay: Boolean,
  showSubtitle: j,
  closeOnPopstate: j,
  showRangePrompt: j,
  confirmDisabledText: String,
  closeOnClickOverlay: j,
  safeAreaInsetTop: Boolean,
  safeAreaInsetBottom: j,
  minDate: { type: Date, validator: Xa },
  maxDate: { type: Date, validator: Xa },
  firstDayOfWeek: { type: q, default: 0, validator: e => e >= 0 && e <= 6 }
}
var VC = U({
  name: TC,
  props: zm,
  emits: [
    'select',
    'confirm',
    'unselect',
    'monthShow',
    'overRange',
    'update:show',
    'clickSubtitle',
    'clickDisabledDate',
    'clickOverlay',
    'panelChange'
  ],
  setup(e, { emit: t, slots: n }) {
    const o = B(() => e.switchMode !== 'none'),
      a = B(() => (!e.minDate && !o.value ? xi() : e.minDate)),
      i = B(() => (!e.maxDate && !o.value ? ac(xi(), 6) : e.maxDate)),
      l = (H, ne = a.value, me = i.value) =>
        ne && Tt(H, ne) === -1 ? ne : me && Tt(H, me) === 1 ? me : H,
      r = (H = e.defaultDate) => {
        const { type: ne, allowSameDay: me } = e
        if (H === null) return H
        const G = xi()
        if (ne === 'range') {
          ;(Array.isArray(H) || (H = []), H.length === 1 && Tt(H[0], G) === 1 && (H = []))
          const ue = a.value,
            E = i.value,
            F = l(H[0] || G, ue, E ? (me ? E : us(E)) : void 0),
            V = l(H[1] || (me ? G : ds(G)), ue ? (me ? ue : ds(ue)) : void 0)
          return [F, V]
        }
        return ne === 'multiple'
          ? Array.isArray(H)
            ? H.map(ue => l(ue))
            : [l(G)]
          : ((!H || Array.isArray(H)) && (H = G), l(H))
      },
      s = () => {
        const H = Array.isArray(d.value) ? d.value[0] : d.value
        return H || l(xi())
      }
    let c
    const u = M(),
      d = M(r()),
      h = M(s()),
      m = M(),
      [y, p] = ai(),
      b = B(() => (e.firstDayOfWeek ? +e.firstDayOfWeek % 7 : 0)),
      x = B(() => {
        const H = []
        if (!a.value || !i.value) return H
        const ne = new Date(a.value)
        ne.setDate(1)
        do (H.push(new Date(ne)), ne.setMonth(ne.getMonth() + 1))
        while (po(ne, i.value) !== 1)
        return H
      }),
      g = B(() => {
        if (d.value) {
          if (e.type === 'range') return !d.value[0] || !d.value[1]
          if (e.type === 'multiple') return !d.value.length
        }
        return !d.value
      }),
      C = () => d.value,
      S = () => {
        const H = Bn(u.value),
          ne = H + c,
          me = x.value.map((V, Q) => y.value[Q].getHeight()),
          G = me.reduce((V, Q) => V + Q, 0)
        if (ne > G && H > 0) return
        let ue = 0,
          E
        const F = [-1, -1]
        for (let V = 0; V < x.value.length; V++) {
          const Q = y.value[V]
          ;(ue <= ne &&
            ue + me[V] >= H &&
            ((F[1] = V),
            E || ((E = Q), (F[0] = V)),
            y.value[V].showed ||
              ((y.value[V].showed = !0), t('monthShow', { date: Q.date, title: Q.getTitle() }))),
            (ue += me[V]))
        }
        ;(x.value.forEach((V, Q) => {
          const fe = Q >= F[0] - 1 && Q <= F[1] + 1
          y.value[Q].setVisible(fe)
        }),
          E && (m.value = E))
      },
      v = H => {
        o.value
          ? (h.value = H)
          : vt(() => {
              ;(x.value.some((ne, me) =>
                po(ne, H) === 0 ? (u.value && y.value[me].scrollToDate(u.value, H), !0) : !1
              ),
                S())
            })
      },
      _ = () => {
        if (!(e.poppable && !e.show))
          if (d.value) {
            const H = e.type === 'single' ? d.value : d.value[0]
            Xa(H) && v(H)
          } else o.value || vt(S)
      },
      P = () => {
        ;(e.poppable && !e.show) ||
          (o.value ||
            vt(() => {
              c = Math.floor(Oe(u).height)
            }),
          _())
      },
      w = (H = r()) => {
        ;((d.value = H), _())
      },
      A = H => {
        const { maxRange: ne, rangePrompt: me, showRangePrompt: G } = e
        return ne && kC(H) > +ne ? (G && rl(me || Rn('rangePrompt', ne)), t('overRange'), !1) : !0
      },
      O = H => {
        ;((h.value = H), t('panelChange', { date: H }))
      },
      I = () => {
        var H
        return t('confirm', (H = d.value) != null ? H : qu(d.value))
      },
      T = (H, ne) => {
        const me = G => {
          ;((d.value = G), t('select', qu(G)))
        }
        if (ne && e.type === 'range' && !A(H)) {
          me([H[0], oc(H[0], +e.maxRange - 1)])
          return
        }
        ;(me(H), ne && !e.showConfirm && I())
      },
      D = (H, ne, me) => {
        var G
        return (G = H.find(ue => Tt(ne, ue.date) === -1 && Tt(ue.date, me) === -1)) == null
          ? void 0
          : G.date
      },
      z = B(() =>
        y.value.reduce((H, ne) => {
          var me, G
          return (
            H.push(...((G = (me = ne.disabledDays) == null ? void 0 : me.value) != null ? G : [])),
            H
          )
        }, [])
      ),
      oe = H => {
        if (e.readonly || !H.date) return
        const { date: ne } = H,
          { type: me } = e
        if (me === 'range') {
          if (!d.value) {
            T([ne])
            return
          }
          const [G, ue] = d.value
          if (G && !ue) {
            const E = Tt(ne, G)
            if (E === 1) {
              const F = D(z.value, G, ne)
              if (F) {
                const V = us(F)
                Tt(G, V) === -1 ? T([G, V]) : T([ne])
              } else T([G, ne], !0)
            } else E === -1 ? T([ne]) : e.allowSameDay && T([ne, ne], !0)
          } else T([ne])
        } else if (me === 'multiple') {
          if (!d.value) {
            T([ne])
            return
          }
          const G = d.value,
            ue = G.findIndex(E => Tt(E, ne) === 0)
          if (ue !== -1) {
            const [E] = G.splice(ue, 1)
            t('unselect', aa(E))
          } else
            e.maxRange && G.length >= +e.maxRange
              ? rl(e.rangePrompt || Rn('rangePrompt', e.maxRange))
              : T([...G, ne])
        } else T(ne, !0)
      },
      L = H => t('clickOverlay', H),
      ee = H => t('update:show', H),
      ae = (H, ne) => {
        const me = ne !== 0 || !e.showSubtitle
        return f(
          $C,
          Ce(
            {
              ref: o.value ? m : p(ne),
              date: H,
              currentDate: d.value,
              showMonthTitle: me,
              firstDayOfWeek: b.value,
              lazyRender: o.value ? !1 : e.lazyRender,
              maxDate: i.value,
              minDate: a.value
            },
            Ie(e, [
              'type',
              'color',
              'showMark',
              'formatter',
              'rowHeight',
              'showSubtitle',
              'allowSameDay'
            ]),
            { onClick: oe, onClickDisabledDate: G => t('clickDisabledDate', G) }
          ),
          Ie(n, ['top-info', 'bottom-info', 'month-title', 'text'])
        )
      },
      _e = () => {
        if (n.footer) return n.footer()
        if (e.showConfirm) {
          const H = n['confirm-text'],
            ne = g.value,
            me = ne ? e.confirmDisabledText : e.confirmText
          return f(
            st,
            {
              round: !0,
              block: !0,
              type: 'primary',
              color: e.color,
              class: Ge('confirm'),
              disabled: ne,
              nativeType: 'button',
              onClick: I
            },
            { default: () => [H ? H({ disabled: ne }) : me || Rn('confirm')] }
          )
        }
      },
      ke = () =>
        f('div', { class: [Ge('footer'), { 'van-safe-area-bottom': e.safeAreaInsetBottom }] }, [
          _e()
        ]),
      re = () => {
        var H, ne
        return f('div', { class: Ge() }, [
          f(
            MC,
            {
              date: (H = m.value) == null ? void 0 : H.date,
              maxDate: i.value,
              minDate: a.value,
              title: e.title,
              subtitle: (ne = m.value) == null ? void 0 : ne.getTitle(),
              showTitle: e.showTitle,
              showSubtitle: e.showSubtitle,
              switchMode: e.switchMode,
              firstDayOfWeek: b.value,
              onClickSubtitle: me => t('clickSubtitle', me),
              onPanelChange: O
            },
            Ie(n, ['title', 'subtitle', 'prev-month', 'prev-year', 'next-month', 'next-year'])
          ),
          f('div', { ref: u, class: Ge('body'), onScroll: o.value ? void 0 : S }, [
            o.value ? ae(h.value, 0) : x.value.map(ae)
          ]),
          ke()
        ])
      }
    return (
      te(() => e.show, P),
      te(
        () => [e.type, e.minDate, e.maxDate, e.switchMode],
        () => w(r(d.value))
      ),
      te(
        () => e.defaultDate,
        H => {
          w(H)
        }
      ),
      Te({ reset: w, scrollToDate: v, getSelectedDate: C }),
      ca(P),
      () =>
        e.poppable
          ? f(
              zt,
              {
                show: e.show,
                class: Ge('popup'),
                round: e.round,
                position: e.position,
                closeable: e.showTitle || e.showSubtitle,
                teleport: e.teleport,
                closeOnPopstate: e.closeOnPopstate,
                safeAreaInsetTop: e.safeAreaInsetTop,
                closeOnClickOverlay: e.closeOnClickOverlay,
                onClickOverlay: L,
                'onUpdate:show': ee
              },
              { default: re }
            )
          : re()
    )
  }
})
const jm = Z(VC),
  [LC, Bo] = K('image'),
  Wm = {
    src: String,
    alt: String,
    fit: String,
    position: String,
    round: Boolean,
    block: Boolean,
    width: q,
    height: q,
    radius: q,
    lazyLoad: Boolean,
    iconSize: q,
    showError: j,
    errorIcon: J('photo-fail'),
    iconPrefix: String,
    showLoading: j,
    loadingIcon: J('photo'),
    crossorigin: String,
    referrerpolicy: String,
    decoding: String
  }
var NC = U({
  name: LC,
  props: Wm,
  emits: ['load', 'error'],
  setup(e, { emit: t, slots: n }) {
    const o = M(!1),
      a = M(!0),
      i = M(),
      { $Lazyload: l } = Et().proxy,
      r = B(() => {
        const b = { width: pe(e.width), height: pe(e.height) }
        return (Ee(e.radius) && ((b.overflow = 'hidden'), (b.borderRadius = pe(e.radius))), b)
      })
    te(
      () => e.src,
      () => {
        ;((o.value = !1), (a.value = !0))
      }
    )
    const s = b => {
        a.value && ((a.value = !1), t('load', b))
      },
      c = () => {
        const b = new Event('load')
        ;(Object.defineProperty(b, 'target', { value: i.value, enumerable: !0 }), s(b))
      },
      u = b => {
        ;((o.value = !0), (a.value = !1), t('error', b))
      },
      d = (b, x, g) =>
        g ? g() : f(we, { name: b, size: e.iconSize, class: x, classPrefix: e.iconPrefix }, null),
      h = () => {
        if (a.value && e.showLoading)
          return f('div', { class: Bo('loading') }, [
            d(e.loadingIcon, Bo('loading-icon'), n.loading)
          ])
        if (o.value && e.showError)
          return f('div', { class: Bo('error') }, [d(e.errorIcon, Bo('error-icon'), n.error)])
      },
      m = () => {
        if (o.value || !e.src) return
        const b = {
          alt: e.alt,
          class: Bo('img'),
          decoding: e.decoding,
          style: { objectFit: e.fit, objectPosition: e.position },
          crossorigin: e.crossorigin,
          referrerpolicy: e.referrerpolicy
        }
        return e.lazyLoad
          ? rt(f('img', Ce({ ref: i }, b), null), [[Jy('lazy'), e.src]])
          : f('img', Ce({ ref: i, src: e.src, onLoad: s, onError: u }, b), null)
      },
      y = ({ el: b }) => {
        const x = () => {
          b === i.value && a.value && c()
        }
        i.value ? x() : Se(x)
      },
      p = ({ el: b }) => {
        b === i.value && !o.value && u()
      }
    return (
      l &&
        Ot &&
        (l.$on('loaded', y),
        l.$on('error', p),
        en(() => {
          ;(l.$off('loaded', y), l.$off('error', p))
        })),
      We(() => {
        Se(() => {
          var b
          ;(b = i.value) != null && b.complete && !e.lazyLoad && c()
        })
      }),
      () => {
        var b
        return f('div', { class: Bo({ round: e.round, block: e.block }), style: r.value }, [
          m(),
          h(),
          (b = n.default) == null ? void 0 : b.call(n)
        ])
      }
    )
  }
})
const si = Z(NC),
  [FC, wt] = K('card'),
  Um = {
    tag: String,
    num: q,
    desc: String,
    thumb: String,
    title: String,
    price: q,
    centered: Boolean,
    lazyLoad: Boolean,
    currency: J('¥'),
    thumbLink: String,
    originPrice: q
  }
var HC = U({
  name: FC,
  props: Um,
  emits: ['clickThumb'],
  setup(e, { slots: t, emit: n }) {
    const o = () => {
        if (t.title) return t.title()
        if (e.title) return f('div', { class: [wt('title'), 'van-multi-ellipsis--l2'] }, [e.title])
      },
      a = () => {
        if (t.tag || e.tag)
          return f('div', { class: wt('tag') }, [
            t.tag ? t.tag() : f(ri, { mark: !0, type: 'primary' }, { default: () => [e.tag] })
          ])
      },
      i = () =>
        t.thumb
          ? t.thumb()
          : f(
              si,
              { src: e.thumb, fit: 'cover', width: '100%', height: '100%', lazyLoad: e.lazyLoad },
              null
            ),
      l = () => {
        if (t.thumb || e.thumb)
          return f(
            'a',
            { href: e.thumbLink, class: wt('thumb'), onClick: c => n('clickThumb', c) },
            [i(), a()]
          )
      },
      r = () => {
        if (t.desc) return t.desc()
        if (e.desc) return f('div', { class: [wt('desc'), 'van-ellipsis'] }, [e.desc])
      },
      s = () => {
        const c = e.price.toString().split('.')
        return f('div', null, [
          f('span', { class: wt('price-currency') }, [e.currency]),
          f('span', { class: wt('price-integer') }, [c[0]]),
          c.length > 1 && f(qe, null, [$s('.'), f('span', { class: wt('price-decimal') }, [c[1]])])
        ])
      }
    return () => {
      var c, u, d
      const h = t.num || Ee(e.num),
        m = t.price || Ee(e.price),
        y = t['origin-price'] || Ee(e.originPrice),
        p = h || m || y || t.bottom,
        b = m && f('div', { class: wt('price') }, [t.price ? t.price() : s()]),
        x =
          y &&
          f('div', { class: wt('origin-price') }, [
            t['origin-price'] ? t['origin-price']() : `${e.currency} ${e.originPrice}`
          ]),
        g = h && f('div', { class: wt('num') }, [t.num ? t.num() : `x${e.num}`]),
        C = t.footer && f('div', { class: wt('footer') }, [t.footer()]),
        S =
          p &&
          f('div', { class: wt('bottom') }, [
            (c = t['price-top']) == null ? void 0 : c.call(t),
            b,
            x,
            g,
            (u = t.bottom) == null ? void 0 : u.call(t)
          ])
      return f('div', { class: wt() }, [
        f('div', { class: wt('header') }, [
          l(),
          f('div', { class: wt('content', { centered: e.centered }) }, [
            f('div', null, [o(), r(), (d = t.tags) == null ? void 0 : d.call(t)]),
            S
          ])
        ]),
        C
      ])
    }
  }
})
const Km = Z(HC),
  [zC, Cn, jC] = K('cascader'),
  Ym = {
    title: String,
    options: ze(),
    closeable: j,
    swipeable: j,
    closeIcon: J('cross'),
    showHeader: j,
    modelValue: q,
    fieldNames: Object,
    placeholder: String,
    activeColor: String
  }
var WC = U({
  name: zC,
  props: Ym,
  emits: ['close', 'change', 'finish', 'clickTab', 'update:modelValue'],
  setup(e, { slots: t, emit: n }) {
    const o = M([]),
      a = M(0),
      [i, l] = ai(),
      {
        text: r,
        value: s,
        children: c
      } = he({ text: 'text', value: 'value', children: 'children' }, e.fieldNames),
      u = (v, _) => {
        for (const P of v) {
          if (P[s] === _) return [P]
          if (P[c]) {
            const w = u(P[c], _)
            if (w) return [P, ...w]
          }
        }
      },
      d = () => {
        const { options: v, modelValue: _ } = e
        if (_ !== void 0) {
          const P = u(v, _)
          if (P) {
            let w = v
            ;((o.value = P.map(A => {
              const O = { options: w, selected: A },
                I = w.find(T => T[s] === A[s])
              return (I && (w = I[c]), O)
            })),
              w && o.value.push({ options: w, selected: null }),
              Se(() => {
                a.value = o.value.length - 1
              }))
            return
          }
        }
        o.value = [{ options: v, selected: null }]
      },
      h = (v, _) => {
        if (v.disabled) return
        if (
          ((o.value[_].selected = v),
          o.value.length > _ + 1 && (o.value = o.value.slice(0, _ + 1)),
          v[c])
        ) {
          const A = { options: v[c], selected: null }
          ;(o.value[_ + 1] ? (o.value[_ + 1] = A) : o.value.push(A),
            Se(() => {
              a.value++
            }))
        }
        const P = o.value.map(A => A.selected).filter(Boolean)
        n('update:modelValue', v[s])
        const w = { value: v[s], tabIndex: _, selectedOptions: P }
        ;(n('change', w), v[c] || n('finish', w))
      },
      m = () => n('close'),
      y = ({ name: v, title: _ }) => n('clickTab', v, _),
      p = () =>
        e.showHeader
          ? f('div', { class: Cn('header') }, [
              f('h2', { class: Cn('title') }, [t.title ? t.title() : e.title]),
              e.closeable
                ? f(we, { name: e.closeIcon, class: [Cn('close-icon'), bt], onClick: m }, null)
                : null
            ])
          : null,
      b = (v, _, P) => {
        const { disabled: w } = v,
          A = !!(_ && v[s] === _[s]),
          O = v.color || (A ? e.activeColor : void 0),
          I = t.option ? t.option({ option: v, selected: A }) : f('span', null, [v[r]])
        return f(
          'li',
          {
            ref: A ? l(P) : void 0,
            role: 'menuitemradio',
            class: [Cn('option', { selected: A, disabled: w }), v.className],
            style: { color: O },
            tabindex: w ? void 0 : A ? 0 : -1,
            'aria-checked': A,
            'aria-disabled': w || void 0,
            onClick: () => h(v, P)
          },
          [I, A ? f(we, { name: 'success', class: Cn('selected-icon') }, null) : null]
        )
      },
      x = (v, _, P) => f('ul', { role: 'menu', class: Cn('options') }, [v.map(w => b(w, _, P))]),
      g = (v, _) => {
        const { options: P, selected: w } = v,
          A = e.placeholder || jC('select'),
          O = w ? w[r] : A
        return f(
          oa,
          { title: O, titleClass: Cn('tab', { unselected: !w }) },
          {
            default: () => {
              var I, T
              return [
                (I = t['options-top']) == null ? void 0 : I.call(t, { tabIndex: _ }),
                x(P, w, _),
                (T = t['options-bottom']) == null ? void 0 : T.call(t, { tabIndex: _ })
              ]
            }
          }
        )
      },
      C = () =>
        f(
          ii,
          {
            active: a.value,
            'onUpdate:active': v => (a.value = v),
            shrink: !0,
            animated: !0,
            class: Cn('tabs'),
            color: e.activeColor,
            swipeable: e.swipeable,
            onClickTab: y
          },
          { default: () => [o.value.map(g)] }
        ),
      S = v => {
        const _ = v.parentElement
        _ && (_.scrollTop = v.offsetTop - (_.offsetHeight - v.offsetHeight) / 2)
      }
    return (
      d(),
      te(a, v => {
        const _ = i.value[v]
        _ && S(_)
      }),
      te(() => e.options, d, { deep: !0 }),
      te(
        () => e.modelValue,
        v => {
          ;(v !== void 0 &&
            o.value
              .map(P => {
                var w
                return (w = P.selected) == null ? void 0 : w[s]
              })
              .includes(v)) ||
            d()
        }
      ),
      () => f('div', { class: Cn() }, [p(), C()])
    )
  }
})
const Gm = Z(WC),
  [UC, ed] = K('cell-group'),
  qm = { title: String, inset: Boolean, border: j }
var KC = U({
  name: UC,
  inheritAttrs: !1,
  props: qm,
  setup(e, { slots: t, attrs: n }) {
    const o = () => {
        var i
        return f(
          'div',
          Ce({ class: [ed({ inset: e.inset }), { [$l]: e.border && !e.inset }] }, n, ll()),
          [(i = t.default) == null ? void 0 : i.call(t)]
        )
      },
      a = () =>
        f('div', { class: ed('title', { inset: e.inset }) }, [t.title ? t.title() : e.title])
    return () => (e.title || t.title ? f(qe, null, [a(), o()]) : o())
  }
})
const Xm = Z(KC),
  [YC, Si] = K('circle')
let GC = 0
const td = e => Math.min(Math.max(+e, 0), 100)
function qC(e, t) {
  const n = e ? 1 : 0
  return `M ${t / 2} ${t / 2} m 0, -500 a 500, 500 0 1, ${n} 0, 1000 a 500, 500 0 1, ${n} 0, -1000`
}
const Zm = {
  text: String,
  size: q,
  fill: J('none'),
  rate: se(100),
  speed: se(0),
  color: [String, Object],
  clockwise: j,
  layerColor: String,
  currentRate: Je(0),
  strokeWidth: se(40),
  strokeLinecap: String,
  startPosition: J('top')
}
var XC = U({
  name: YC,
  props: Zm,
  emits: ['update:currentRate'],
  setup(e, { emit: t, slots: n }) {
    const o = `van-circle-${GC++}`,
      a = B(() => +e.strokeWidth + 1e3),
      i = B(() => qC(e.clockwise, a.value)),
      l = B(() => {
        const h = { top: 0, right: 90, bottom: 180, left: 270 }[e.startPosition]
        if (h) return { transform: `rotate(${h}deg)` }
      })
    te(
      () => e.rate,
      d => {
        let h
        const m = Date.now(),
          y = e.currentRate,
          p = td(d),
          b = Math.abs(((y - p) * 1e3) / +e.speed),
          x = () => {
            const g = Date.now(),
              S = Math.min((g - m) / b, 1) * (p - y) + y
            ;(t('update:currentRate', td(parseFloat(S.toFixed(1)))),
              (p > y ? S < p : S > p) && (h = vt(x)))
          }
        e.speed ? (h && Rl(h), (h = vt(x))) : t('update:currentRate', p)
      },
      { immediate: !0 }
    )
    const r = () => {
        const { strokeWidth: h, currentRate: m, strokeLinecap: y } = e,
          p = (3140 * m) / 100,
          b = Qt(e.color) ? `url(#${o})` : e.color,
          x = {
            stroke: b,
            strokeWidth: `${+h + 1}px`,
            strokeLinecap: y,
            strokeDasharray: `${p}px 3140px`
          }
        return f('path', { d: i.value, style: x, class: Si('hover'), stroke: b }, null)
      },
      s = () => {
        const d = { fill: e.fill, stroke: e.layerColor, strokeWidth: `${e.strokeWidth}px` }
        return f('path', { class: Si('layer'), style: d, d: i.value }, null)
      },
      c = () => {
        const { color: d } = e
        if (!Qt(d)) return
        const h = Object.keys(d)
          .sort((m, y) => parseFloat(m) - parseFloat(y))
          .map((m, y) => f('stop', { key: y, offset: m, 'stop-color': d[m] }, null))
        return f('defs', null, [
          f('linearGradient', { id: o, x1: '100%', y1: '0%', x2: '0%', y2: '0%' }, [h])
        ])
      },
      u = () => {
        if (n.default) return n.default()
        if (e.text) return f('div', { class: Si('text') }, [e.text])
      }
    return () =>
      f('div', { class: Si(), style: Fn(e.size) }, [
        f('svg', { viewBox: `0 0 ${a.value} ${a.value}`, style: l.value }, [c(), s(), r()]),
        u()
      ])
  }
})
const Jm = Z(XC),
  [Qm, ZC] = K('row'),
  eg = Symbol(Qm),
  tg = {
    tag: J('div'),
    wrap: j,
    align: String,
    gutter: { type: [String, Number, Array], default: 0 },
    justify: String
  }
var JC = U({
  name: Qm,
  props: tg,
  setup(e, { slots: t }) {
    const { children: n, linkChildren: o } = yt(eg),
      a = B(() => {
        const r = [[]]
        let s = 0
        return (
          n.forEach((c, u) => {
            ;((s += Number(c.span)), s > 24 ? (r.push([u]), (s -= 24)) : r[r.length - 1].push(u))
          }),
          r
        )
      }),
      i = B(() => {
        let r = 0
        Array.isArray(e.gutter) ? (r = Number(e.gutter[0]) || 0) : (r = Number(e.gutter))
        const s = []
        return (
          r &&
            a.value.forEach(c => {
              const u = (r * (c.length - 1)) / c.length
              c.forEach((d, h) => {
                if (h === 0) s.push({ right: u })
                else {
                  const m = r - s[d - 1].right,
                    y = u - m
                  s.push({ left: m, right: y })
                }
              })
            }),
          s
        )
      }),
      l = B(() => {
        const { gutter: r } = e,
          s = []
        if (Array.isArray(r) && r.length > 1) {
          const c = Number(r[1]) || 0
          if (c <= 0) return s
          a.value.forEach((u, d) => {
            d !== a.value.length - 1 &&
              u.forEach(() => {
                s.push({ bottom: c })
              })
          })
        }
        return s
      })
    return (
      o({ spaces: i, verticalSpaces: l }),
      () => {
        const { tag: r, wrap: s, align: c, justify: u } = e
        return f(
          r,
          { class: ZC({ [`align-${c}`]: c, [`justify-${u}`]: u, nowrap: !s }) },
          {
            default: () => {
              var d
              return [(d = t.default) == null ? void 0 : d.call(t)]
            }
          }
        )
      }
    )
  }
})
const [QC, e_] = K('col'),
  ng = { tag: J('div'), span: se(0), offset: q }
var t_ = U({
  name: QC,
  props: ng,
  setup(e, { slots: t }) {
    const { parent: n, index: o } = ht(eg),
      a = B(() => {
        if (!n) return
        const { spaces: i, verticalSpaces: l } = n
        let r = {}
        if (i && i.value && i.value[o.value]) {
          const { left: c, right: u } = i.value[o.value]
          r = { paddingLeft: c ? `${c}px` : null, paddingRight: u ? `${u}px` : null }
        }
        const { bottom: s } = l.value[o.value] || {}
        return he(r, { marginBottom: s ? `${s}px` : null })
      })
    return () => {
      const { tag: i, span: l, offset: r } = e
      return f(
        i,
        { style: a.value, class: e_({ [l]: l, [`offset-${r}`]: r }) },
        {
          default: () => {
            var s
            return [(s = t.default) == null ? void 0 : s.call(t)]
          }
        }
      )
    }
  }
})
const og = Z(t_),
  [ag, n_] = K('collapse'),
  ig = Symbol(ag),
  lg = { border: j, accordion: Boolean, modelValue: { type: [String, Number, Array], default: '' } }
var o_ = U({
  name: ag,
  props: lg,
  emits: ['change', 'update:modelValue'],
  setup(e, { emit: t, slots: n }) {
    const { linkChildren: o, children: a } = yt(ig),
      i = c => {
        ;(t('change', c), t('update:modelValue', c))
      },
      l = (c, u) => {
        const { accordion: d, modelValue: h } = e
        i(d ? (c === h ? '' : c) : u ? h.concat(c) : h.filter(m => m !== c))
      },
      r = (c = {}) => {
        if (e.accordion) return
        typeof c == 'boolean' && (c = { expanded: c })
        const { expanded: u, skipDisabled: d } = c,
          m = a
            .filter(y => (y.disabled && d ? y.expanded.value : (u ?? !y.expanded.value)))
            .map(y => y.itemName.value)
        i(m)
      },
      s = c => {
        const { accordion: u, modelValue: d } = e
        return u ? d === c : d.includes(c)
      }
    return (
      Te({ toggleAll: r }),
      o({ toggle: l, isExpanded: s }),
      () => {
        var c
        return f('div', { class: [n_(), { [$l]: e.border }] }, [
          (c = n.default) == null ? void 0 : c.call(n)
        ])
      }
    )
  }
})
const rg = Z(o_),
  [a_, Ci] = K('collapse-item'),
  i_ = ['icon', 'title', 'value', 'label', 'right-icon'],
  sg = he({}, Hl, { name: q, isLink: j, disabled: Boolean, readonly: Boolean, lazyRender: j })
var l_ = U({
  name: a_,
  props: sg,
  setup(e, { slots: t }) {
    const n = M(),
      o = M(),
      { parent: a, index: i } = ht(ig)
    if (!a) return
    const l = B(() => {
        var p
        return (p = e.name) != null ? p : i.value
      }),
      r = B(() => a.isExpanded(l.value)),
      s = M(r.value),
      c = Ks(() => s.value || !e.lazyRender),
      u = () => {
        r.value ? n.value && (n.value.style.height = '') : (s.value = !1)
      }
    te(r, (p, b) => {
      if (b === null) return
      ;(p && (s.value = !0),
        (p ? Se : vt)(() => {
          if (!o.value || !n.value) return
          const { offsetHeight: g } = o.value
          if (g) {
            const C = `${g}px`
            ;((n.value.style.height = p ? '0' : C),
              to(() => {
                n.value && (n.value.style.height = p ? C : '0')
              }))
          } else u()
        }))
    })
    const d = (p = !r.value) => {
        a.toggle(l.value, p)
      },
      h = () => {
        !e.disabled && !e.readonly && d()
      },
      m = () => {
        const { border: p, disabled: b, readonly: x } = e,
          g = Ie(e, Object.keys(Hl))
        return (
          x && (g.isLink = !1),
          (b || x) && (g.clickable = !1),
          f(
            jt,
            Ce(
              {
                role: 'button',
                class: Ci('title', { disabled: b, expanded: r.value, borderless: !p }),
                'aria-expanded': String(r.value),
                onClick: h
              },
              g
            ),
            Ie(t, i_)
          )
        )
      },
      y = c(() => {
        var p
        return rt(
          f('div', { ref: n, class: Ci('wrapper'), onTransitionend: u }, [
            f('div', { ref: o, class: Ci('content') }, [
              (p = t.default) == null ? void 0 : p.call(t)
            ])
          ]),
          [[ft, s.value]]
        )
      })
    return (
      Te({ toggle: d, expanded: r, itemName: l }),
      () => f('div', { class: [Ci({ border: i.value && e.border })] }, [m(), y()])
    )
  }
})
const cg = Z(l_),
  ug = Z(Cx),
  [r_, nd, _r] = K('contact-card'),
  dg = { tel: String, name: String, type: J('add'), addText: String, editable: j }
var s_ = U({
  name: r_,
  props: dg,
  emits: ['click'],
  setup(e, { emit: t }) {
    const n = a => {
        e.editable && t('click', a)
      },
      o = () =>
        e.type === 'add'
          ? e.addText || _r('addContact')
          : [
              f('div', null, [`${_r('name')}：${e.name}`]),
              f('div', null, [`${_r('tel')}：${e.tel}`])
            ]
    return () =>
      f(
        jt,
        {
          center: !0,
          icon: e.type === 'edit' ? 'contact' : 'add-square',
          class: nd([e.type]),
          border: !1,
          isLink: e.editable,
          titleClass: nd('title'),
          onClick: n
        },
        { title: o }
      )
  }
})
const fg = Z(s_),
  [c_, Mo, Kn] = K('contact-edit'),
  fs = { tel: '', name: '' },
  hg = {
    isEdit: Boolean,
    isSaving: Boolean,
    isDeleting: Boolean,
    showSetDefault: Boolean,
    setDefaultLabel: String,
    contactInfo: { type: Object, default: () => he({}, fs) },
    telValidator: { type: Function, default: sh }
  }
var u_ = U({
  name: c_,
  props: hg,
  emits: ['save', 'delete', 'changeDefault'],
  setup(e, { emit: t }) {
    const n = He(he({}, fs, e.contactInfo)),
      o = () => {
        e.isSaving || t('save', n)
      },
      a = () => t('delete', n),
      i = () =>
        f('div', { class: Mo('buttons') }, [
          f(
            st,
            {
              block: !0,
              round: !0,
              type: 'primary',
              text: Kn('save'),
              class: Mo('button'),
              loading: e.isSaving,
              nativeType: 'submit'
            },
            null
          ),
          e.isEdit &&
            f(
              st,
              {
                block: !0,
                round: !0,
                text: Kn('delete'),
                class: Mo('button'),
                loading: e.isDeleting,
                onClick: a
              },
              null
            )
        ]),
      l = () =>
        f(
          jl,
          {
            modelValue: n.isDefault,
            'onUpdate:modelValue': s => (n.isDefault = s),
            onChange: s => t('changeDefault', s)
          },
          null
        ),
      r = () => {
        if (e.showSetDefault)
          return f(
            jt,
            { title: e.setDefaultLabel, class: Mo('switch-cell'), border: !1 },
            { 'right-icon': l }
          )
      }
    return (
      te(
        () => e.contactInfo,
        s => he(n, fs, s)
      ),
      () =>
        f(
          zl,
          { class: Mo(), onSubmit: o },
          {
            default: () => [
              f('div', { class: Mo('fields') }, [
                f(
                  gn,
                  {
                    modelValue: n.name,
                    'onUpdate:modelValue': s => (n.name = s),
                    clearable: !0,
                    label: Kn('name'),
                    rules: [{ required: !0, message: Kn('nameEmpty') }],
                    maxlength: '30',
                    placeholder: Kn('name')
                  },
                  null
                ),
                f(
                  gn,
                  {
                    modelValue: n.tel,
                    'onUpdate:modelValue': s => (n.tel = s),
                    clearable: !0,
                    type: 'tel',
                    label: Kn('tel'),
                    rules: [{ validator: e.telValidator, message: Kn('telInvalid') }],
                    placeholder: Kn('tel')
                  },
                  null
                )
              ]),
              r(),
              i()
            ]
          }
        )
    )
  }
})
const mg = Z(u_),
  [d_, _n, f_] = K('contact-list'),
  gg = { list: Array, addText: String, modelValue: je, defaultTagText: String }
var h_ = U({
  name: d_,
  props: gg,
  emits: ['add', 'edit', 'select', 'update:modelValue'],
  setup(e, { emit: t }) {
    const n = (o, a) => {
      const i = () => {
          ;(t('update:modelValue', o.id), t('select', o, a))
        },
        l = () => f(Ul, { class: _n('radio'), name: o.id, iconSize: 18 }, null),
        r = () =>
          f(
            we,
            {
              name: 'edit',
              class: _n('edit'),
              onClick: c => {
                ;(c.stopPropagation(), t('edit', o, a))
              }
            },
            null
          ),
        s = () => {
          const c = [`${o.name}，${o.tel}`]
          return (
            o.isDefault &&
              e.defaultTagText &&
              c.push(
                f(
                  ri,
                  { type: 'primary', round: !0, class: _n('item-tag') },
                  { default: () => [e.defaultTagText] }
                )
              ),
            c
          )
        }
      return f(
        jt,
        {
          key: o.id,
          isLink: !0,
          center: !0,
          class: _n('item'),
          titleClass: _n('item-title'),
          onClick: i
        },
        { icon: r, title: s, 'right-icon': l }
      )
    }
    return () =>
      f('div', { class: _n() }, [
        f(
          Wl,
          { modelValue: e.modelValue, class: _n('group') },
          { default: () => [e.list && e.list.map(n)] }
        ),
        f('div', { class: [_n('bottom'), 'van-safe-area-bottom'] }, [
          f(
            st,
            {
              round: !0,
              block: !0,
              type: 'primary',
              class: _n('add'),
              text: e.addText || f_('addContact'),
              onClick: () => t('add')
            },
            null
          )
        ])
      ])
  }
})
const vg = Z(h_)
function m_(e, t) {
  const { days: n } = t
  let { hours: o, minutes: a, seconds: i, milliseconds: l } = t
  if (
    (e.includes('DD') ? (e = e.replace('DD', Yt(n))) : (o += n * 24),
    e.includes('HH') ? (e = e.replace('HH', Yt(o))) : (a += o * 60),
    e.includes('mm') ? (e = e.replace('mm', Yt(a))) : (i += a * 60),
    e.includes('ss') ? (e = e.replace('ss', Yt(i))) : (l += i * 1e3),
    e.includes('S'))
  ) {
    const r = Yt(l, 3)
    e.includes('SSS')
      ? (e = e.replace('SSS', r))
      : e.includes('SS')
        ? (e = e.replace('SS', r.slice(0, 2)))
        : (e = e.replace('S', r.charAt(0)))
  }
  return e
}
const [g_, v_] = K('count-down'),
  bg = { time: se(0), format: J('HH:mm:ss'), autoStart: j, millisecond: Boolean }
var b_ = U({
  name: g_,
  props: bg,
  emits: ['change', 'finish'],
  setup(e, { emit: t, slots: n }) {
    const {
        start: o,
        pause: a,
        reset: i,
        current: l
      } = qw({
        time: +e.time,
        millisecond: e.millisecond,
        onChange: c => t('change', c),
        onFinish: () => t('finish')
      }),
      r = B(() => m_(e.format, l.value)),
      s = () => {
        ;(i(+e.time), e.autoStart && o())
      }
    return (
      te(() => e.time, s, { immediate: !0 }),
      Te({ start: o, pause: a, reset: s }),
      () => f('div', { role: 'timer', class: v_() }, [n.default ? n.default(l.value) : r.value])
    )
  }
})
const yg = Z(b_)
function od(e) {
  const t = new Date(e * 1e3)
  return `${t.getFullYear()}.${Yt(t.getMonth() + 1)}.${Yt(t.getDate())}`
}
const y_ = e => (e / 10).toFixed(e % 10 === 0 ? 0 : 1),
  ad = e => (e / 100).toFixed(e % 100 === 0 ? 0 : e % 10 === 0 ? 1 : 2),
  [p_, ln, Tr] = K('coupon')
var w_ = U({
  name: p_,
  props: { chosen: Boolean, coupon: lt(Object), disabled: Boolean, currency: J('¥') },
  setup(e) {
    const t = B(() => {
        const { startAt: a, endAt: i } = e.coupon
        return `${od(a)} - ${od(i)}`
      }),
      n = B(() => {
        const { coupon: a, currency: i } = e
        if (a.valueDesc) return [a.valueDesc, f('span', null, [a.unitDesc || ''])]
        if (a.denominations) {
          const l = ad(a.denominations)
          return [f('span', null, [i]), ` ${l}`]
        }
        return a.discount ? Tr('discount', y_(a.discount)) : ''
      }),
      o = B(() => {
        const a = ad(e.coupon.originCondition || 0)
        return a === '0' ? Tr('unlimited') : Tr('condition', a)
      })
    return () => {
      const { chosen: a, coupon: i, disabled: l } = e,
        r = (l && i.reason) || i.description
      return f('div', { class: ln({ disabled: l }) }, [
        f('div', { class: ln('content') }, [
          f('div', { class: ln('head') }, [
            f('h2', { class: ln('amount') }, [n.value]),
            f('p', { class: ln('condition') }, [i.condition || o.value])
          ]),
          f('div', { class: ln('body') }, [
            f('p', { class: ln('name') }, [i.name]),
            f('p', { class: ln('valid') }, [t.value]),
            !l && f(Kl, { class: ln('corner'), modelValue: a }, null)
          ])
        ]),
        r && f('p', { class: ln('description') }, [r])
      ])
    }
  }
})
const sl = Z(w_),
  [x_, id, hs] = K('coupon-cell'),
  pg = {
    title: String,
    border: j,
    editable: j,
    coupons: ze(),
    currency: J('¥'),
    chosenCoupon: { type: [Number, Array], default: -1 }
  },
  S_ = e => {
    const { value: t, denominations: n } = e
    return Ee(t) ? t : Ee(n) ? n : 0
  }
function C_({ coupons: e, chosenCoupon: t, currency: n }) {
  let o = 0,
    a = !1
  return (
    (Array.isArray(t) ? t : [t]).forEach(i => {
      const l = e[+i]
      l && ((a = !0), (o += S_(l)))
    }),
    a ? `-${n} ${(o / 100).toFixed(2)}` : e.length === 0 ? hs('noCoupon') : hs('count', e.length)
  )
}
var __ = U({
  name: x_,
  props: pg,
  setup(e) {
    return () => {
      const t = Array.isArray(e.chosenCoupon) ? e.chosenCoupon.length : e.coupons[+e.chosenCoupon]
      return f(
        jt,
        {
          class: id(),
          value: C_(e),
          title: e.title || hs('title'),
          border: e.border,
          isLink: e.editable,
          valueClass: id('value', { selected: t })
        },
        null
      )
    }
  }
})
const wg = Z(__),
  [T_, _i] = K('empty'),
  xg = { image: J('default'), imageSize: [Number, String, Array], description: String }
var E_ = U({
  name: T_,
  props: xg,
  setup(e, { slots: t }) {
    const n = () => {
        const x = t.description ? t.description() : e.description
        if (x) return f('p', { class: _i('description') }, [x])
      },
      o = () => {
        if (t.default) return f('div', { class: _i('bottom') }, [t.default()])
      },
      a = fa(),
      i = x => `${a}-${x}`,
      l = x => `url(#${i(x)})`,
      r = (x, g, C) => f('stop', { 'stop-color': x, offset: `${g}%`, 'stop-opacity': C }, null),
      s = (x, g) => [r(x, 0), r(g, 100)],
      c = x => [
        f('defs', null, [
          f(
            'radialGradient',
            {
              id: i(x),
              cx: '50%',
              cy: '54%',
              fx: '50%',
              fy: '54%',
              r: '297%',
              gradientTransform: 'matrix(-.16 0 0 -.33 .58 .72)',
              'data-allow-mismatch': 'attribute'
            },
            [r('#EBEDF0', 0), r('#F2F3F5', 100, 0.3)]
          )
        ]),
        f(
          'ellipse',
          {
            fill: l(x),
            opacity: '.8',
            cx: '80',
            cy: '140',
            rx: '46',
            ry: '8',
            'data-allow-mismatch': 'attribute'
          },
          null
        )
      ],
      u = () => [
        f('defs', null, [
          f(
            'linearGradient',
            { id: i('a'), x1: '64%', y1: '100%', x2: '64%', 'data-allow-mismatch': 'attribute' },
            [r('#FFF', 0, 0.5), r('#F2F3F5', 100)]
          )
        ]),
        f('g', { opacity: '.8', 'data-allow-mismatch': 'children' }, [
          f('path', { d: 'M36 131V53H16v20H2v58h34z', fill: l('a') }, null),
          f('path', { d: 'M123 15h22v14h9v77h-31V15z', fill: l('a') }, null)
        ])
      ],
      d = () => [
        f('defs', null, [
          f(
            'linearGradient',
            {
              id: i('b'),
              x1: '64%',
              y1: '97%',
              x2: '64%',
              y2: '0%',
              'data-allow-mismatch': 'attribute'
            },
            [r('#F2F3F5', 0, 0.3), r('#F2F3F5', 100)]
          )
        ]),
        f('g', { opacity: '.8', 'data-allow-mismatch': 'children' }, [
          f(
            'path',
            {
              d: 'M87 6c3 0 7 3 8 6a8 8 0 1 1-1 16H80a7 7 0 0 1-8-6c0-4 3-7 6-7 0-5 4-9 9-9Z',
              fill: l('b')
            },
            null
          ),
          f(
            'path',
            {
              d: 'M19 23c2 0 3 1 4 3 2 0 4 2 4 4a4 4 0 0 1-4 3v1h-7v-1l-1 1c-2 0-3-2-3-4 0-1 1-3 3-3 0-2 2-4 4-4Z',
              fill: l('b')
            },
            null
          )
        ])
      ],
      h = () =>
        f('svg', { viewBox: '0 0 160 160' }, [
          f('defs', { 'data-allow-mismatch': 'children' }, [
            f('linearGradient', { id: i(1), x1: '64%', y1: '100%', x2: '64%' }, [
              r('#FFF', 0, 0.5),
              r('#F2F3F5', 100)
            ]),
            f('linearGradient', { id: i(2), x1: '50%', x2: '50%', y2: '84%' }, [
              r('#EBEDF0', 0),
              r('#DCDEE0', 100, 0)
            ]),
            f('linearGradient', { id: i(3), x1: '100%', x2: '100%', y2: '100%' }, [
              s('#EAEDF0', '#DCDEE0')
            ]),
            f(
              'radialGradient',
              {
                id: i(4),
                cx: '50%',
                cy: '0%',
                fx: '50%',
                fy: '0%',
                r: '100%',
                gradientTransform: 'matrix(0 1 -.54 0 .5 -.5)'
              },
              [r('#EBEDF0', 0), r('#FFF', 100, 0)]
            )
          ]),
          f('g', { fill: 'none' }, [
            u(),
            f(
              'path',
              { fill: l(4), d: 'M0 139h160v21H0z', 'data-allow-mismatch': 'attribute' },
              null
            ),
            f(
              'path',
              {
                d: 'M80 54a7 7 0 0 1 3 13v27l-2 2h-2a2 2 0 0 1-2-2V67a7 7 0 0 1 3-13z',
                fill: l(2),
                'data-allow-mismatch': 'attribute'
              },
              null
            ),
            f(
              'g',
              {
                opacity: '.6',
                'stroke-linecap': 'round',
                'stroke-width': '7',
                'data-allow-mismatch': 'children'
              },
              [
                f('path', { d: 'M64 47a19 19 0 0 0-5 13c0 5 2 10 5 13', stroke: l(3) }, null),
                f('path', { d: 'M53 36a34 34 0 0 0 0 48', stroke: l(3) }, null),
                f('path', { d: 'M95 73a19 19 0 0 0 6-13c0-5-2-9-6-13', stroke: l(3) }, null),
                f('path', { d: 'M106 84a34 34 0 0 0 0-48', stroke: l(3) }, null)
              ]
            ),
            f('g', { transform: 'translate(31 105)' }, [
              f('rect', { fill: '#EBEDF0', width: '98', height: '34', rx: '2' }, null),
              f(
                'rect',
                { fill: '#FFF', x: '9', y: '8', width: '80', height: '18', rx: '1.1' },
                null
              ),
              f(
                'rect',
                { fill: '#EBEDF0', x: '15', y: '12', width: '18', height: '6', rx: '1.1' },
                null
              )
            ])
          ])
        ]),
      m = () =>
        f('svg', { viewBox: '0 0 160 160' }, [
          f('defs', { 'data-allow-mismatch': 'children' }, [
            f('linearGradient', { x1: '50%', x2: '50%', y2: '100%', id: i(5) }, [
              s('#F2F3F5', '#DCDEE0')
            ]),
            f('linearGradient', { x1: '95%', y1: '48%', x2: '5.5%', y2: '51%', id: i(6) }, [
              s('#EAEDF1', '#DCDEE0')
            ]),
            f('linearGradient', { y1: '45%', x2: '100%', y2: '54%', id: i(7) }, [
              s('#EAEDF1', '#DCDEE0')
            ])
          ]),
          u(),
          d(),
          f('g', { transform: 'translate(36 50)', fill: 'none' }, [
            f('g', { transform: 'translate(8)' }, [
              f(
                'rect',
                {
                  fill: '#EBEDF0',
                  opacity: '.6',
                  x: '38',
                  y: '13',
                  width: '36',
                  height: '53',
                  rx: '2'
                },
                null
              ),
              f(
                'rect',
                {
                  fill: l(5),
                  width: '64',
                  height: '66',
                  rx: '2',
                  'data-allow-mismatch': 'attribute'
                },
                null
              ),
              f('rect', { fill: '#FFF', x: '6', y: '6', width: '52', height: '55', rx: '1' }, null),
              f(
                'g',
                { transform: 'translate(15 17)', fill: l(6), 'data-allow-mismatch': 'attribute' },
                [
                  f('rect', { width: '34', height: '6', rx: '1' }, null),
                  f('path', { d: 'M0 14h34v6H0z' }, null),
                  f('rect', { y: '28', width: '34', height: '6', rx: '1' }, null)
                ]
              )
            ]),
            f(
              'rect',
              {
                fill: l(7),
                y: '61',
                width: '88',
                height: '28',
                rx: '1',
                'data-allow-mismatch': 'attribute'
              },
              null
            ),
            f(
              'rect',
              { fill: '#F7F8FA', x: '29', y: '72', width: '30', height: '6', rx: '1' },
              null
            )
          ])
        ]),
      y = () =>
        f('svg', { viewBox: '0 0 160 160' }, [
          f('defs', null, [
            f(
              'linearGradient',
              { x1: '50%', x2: '50%', y2: '100%', id: i(8), 'data-allow-mismatch': 'attribute' },
              [s('#EAEDF1', '#DCDEE0')]
            )
          ]),
          u(),
          d(),
          c('c'),
          f(
            'path',
            {
              d: 'm59 60 21 21 21-21h3l9 9v3L92 93l21 21v3l-9 9h-3l-21-21-21 21h-3l-9-9v-3l21-21-21-21v-3l9-9h3Z',
              fill: l(8),
              'data-allow-mismatch': 'attribute'
            },
            null
          )
        ]),
      p = () =>
        f('svg', { viewBox: '0 0 160 160' }, [
          f('defs', { 'data-allow-mismatch': 'children' }, [
            f('linearGradient', { x1: '50%', y1: '100%', x2: '50%', id: i(9) }, [
              s('#EEE', '#D8D8D8')
            ]),
            f('linearGradient', { x1: '100%', y1: '50%', y2: '50%', id: i(10) }, [
              s('#F2F3F5', '#DCDEE0')
            ]),
            f('linearGradient', { x1: '50%', x2: '50%', y2: '100%', id: i(11) }, [
              s('#F2F3F5', '#DCDEE0')
            ]),
            f('linearGradient', { x1: '50%', x2: '50%', y2: '100%', id: i(12) }, [
              s('#FFF', '#F7F8FA')
            ])
          ]),
          u(),
          d(),
          c('d'),
          f(
            'g',
            { transform: 'rotate(-45 113 -4)', fill: 'none', 'data-allow-mismatch': 'children' },
            [
              f(
                'rect',
                { fill: l(9), x: '24', y: '52.8', width: '5.8', height: '19', rx: '1' },
                null
              ),
              f(
                'rect',
                { fill: l(10), x: '22.1', y: '67.3', width: '9.9', height: '28', rx: '1' },
                null
              ),
              f(
                'circle',
                { stroke: l(11), 'stroke-width': '8', cx: '27', cy: '27', r: '27' },
                null
              ),
              f('circle', { fill: l(12), cx: '27', cy: '27', r: '16' }, null),
              f(
                'path',
                {
                  d: 'M37 7c-8 0-15 5-16 12',
                  stroke: l(11),
                  'stroke-width': '3',
                  opacity: '.5',
                  'stroke-linecap': 'round',
                  transform: 'rotate(45 29 13)'
                },
                null
              )
            ]
          )
        ]),
      b = () => {
        var x
        if (t.image) return t.image()
        const g = { error: y, search: p, network: h, default: m }
        return ((x = g[e.image]) == null ? void 0 : x.call(g)) || f('img', { src: e.image }, null)
      }
    return () =>
      f('div', { class: _i() }, [
        f('div', { class: _i('image'), style: Fn(e.imageSize) }, [b()]),
        n(),
        o()
      ])
  }
})
const ic = Z(E_),
  [k_, rn, Vo] = K('coupon-list'),
  Sg = {
    code: J(''),
    coupons: ze(),
    currency: J('¥'),
    showCount: j,
    emptyImage: String,
    enabledTitle: String,
    disabledTitle: String,
    disabledCoupons: ze(),
    showExchangeBar: j,
    showCloseButton: j,
    closeButtonText: String,
    inputPlaceholder: String,
    exchangeMinLength: Je(1),
    exchangeButtonText: String,
    displayedCouponIndex: Je(-1),
    exchangeButtonLoading: Boolean,
    exchangeButtonDisabled: Boolean,
    chosenCoupon: { type: [Number, Array], default: -1 }
  }
var A_ = U({
  name: k_,
  props: Sg,
  emits: ['change', 'exchange', 'update:code'],
  setup(e, { emit: t, slots: n }) {
    const [o, a] = ai(),
      i = M(),
      l = M(),
      r = M(0),
      s = M(0),
      c = M(e.code),
      u = B(
        () =>
          !e.exchangeButtonLoading &&
          (e.exchangeButtonDisabled || !c.value || c.value.length < e.exchangeMinLength)
      ),
      d = () => {
        const C = Oe(i).height,
          S = Oe(l).height + 44
        s.value = (C > S ? C : Lt.value) - S
      },
      h = () => {
        ;(t('exchange', c.value), e.code || (c.value = ''))
      },
      m = g => {
        Se(() => {
          var C
          return (C = o.value[g]) == null ? void 0 : C.scrollIntoView()
        })
      },
      y = () =>
        f(
          ic,
          { image: e.emptyImage },
          { default: () => [f('p', { class: rn('empty-tip') }, [Vo('noCoupon')])] }
        ),
      p = () => {
        if (e.showExchangeBar)
          return f('div', { ref: l, class: rn('exchange-bar') }, [
            f(
              gn,
              {
                modelValue: c.value,
                'onUpdate:modelValue': g => (c.value = g),
                clearable: !0,
                border: !1,
                class: rn('field'),
                placeholder: e.inputPlaceholder || Vo('placeholder'),
                maxlength: '20'
              },
              null
            ),
            f(
              st,
              {
                plain: !0,
                type: 'primary',
                class: rn('exchange'),
                text: e.exchangeButtonText || Vo('exchange'),
                loading: e.exchangeButtonLoading,
                disabled: u.value,
                onClick: h
              },
              null
            )
          ])
      },
      b = () => {
        const { coupons: g, chosenCoupon: C } = e,
          S = e.showCount ? ` (${g.length})` : '',
          v = (e.enabledTitle || Vo('enable')) + S,
          _ = (P = [], w = 0) => (P.includes(w) ? P.filter(A => A !== w) : [...P, w])
        return f(
          oa,
          { title: v },
          {
            default: () => {
              var P
              return [
                f(
                  'div',
                  {
                    class: rn('list', { 'with-bottom': e.showCloseButton }),
                    style: { height: `${s.value}px` }
                  },
                  [
                    g.map((w, A) =>
                      f(
                        sl,
                        {
                          key: w.id,
                          ref: a(A),
                          coupon: w,
                          chosen: Array.isArray(C) ? C.includes(A) : A === C,
                          currency: e.currency,
                          onClick: () => t('change', Array.isArray(C) ? _(C, A) : A)
                        },
                        null
                      )
                    ),
                    !g.length && y(),
                    (P = n['list-footer']) == null ? void 0 : P.call(n)
                  ]
                )
              ]
            }
          }
        )
      },
      x = () => {
        const { disabledCoupons: g } = e,
          C = e.showCount ? ` (${g.length})` : '',
          S = (e.disabledTitle || Vo('disabled')) + C
        return f(
          oa,
          { title: S },
          {
            default: () => {
              var v
              return [
                f(
                  'div',
                  {
                    class: rn('list', { 'with-bottom': e.showCloseButton }),
                    style: { height: `${s.value}px` }
                  },
                  [
                    g.map(_ =>
                      f(sl, { disabled: !0, key: _.id, coupon: _, currency: e.currency }, null)
                    ),
                    !g.length && y(),
                    (v = n['disabled-list-footer']) == null ? void 0 : v.call(n)
                  ]
                )
              ]
            }
          }
        )
      }
    return (
      te(
        () => e.code,
        g => {
          c.value = g
        }
      ),
      te(Lt, d),
      te(c, g => t('update:code', g)),
      te(() => e.displayedCouponIndex, m),
      We(() => {
        ;(d(), m(e.displayedCouponIndex))
      }),
      () =>
        f('div', { ref: i, class: rn() }, [
          p(),
          f(
            ii,
            { active: r.value, 'onUpdate:active': g => (r.value = g), class: rn('tab') },
            { default: () => [b(), x()] }
          ),
          f('div', { class: rn('bottom') }, [
            n['list-button']
              ? n['list-button']()
              : rt(
                  f(
                    st,
                    {
                      round: !0,
                      block: !0,
                      type: 'primary',
                      class: rn('close'),
                      text: e.closeButtonText || Vo('close'),
                      onClick: () => t('change', Array.isArray(e.chosenCoupon) ? [] : -1)
                    },
                    null
                  ),
                  [[ft, e.showCloseButton]]
                )
          ])
        ])
    )
  }
})
const Cg = Z(A_),
  ld = new Date().getFullYear(),
  [P_] = K('date-picker'),
  _g = he({}, Lm, {
    columnsType: { type: Array, default: () => ['year', 'month', 'day'] },
    minDate: { type: Date, default: () => new Date(ld - 10, 0, 1), validator: Xa },
    maxDate: { type: Date, default: () => new Date(ld + 10, 11, 31), validator: Xa }
  })
var I_ = U({
  name: P_,
  props: _g,
  emits: ['confirm', 'cancel', 'change', 'update:modelValue'],
  setup(e, { emit: t, slots: n }) {
    const o = M(e.modelValue),
      a = M(!1),
      i = M(),
      l = B(() => (a.value ? e.modelValue : o.value)),
      r = v => v === e.minDate.getFullYear(),
      s = v => v === e.maxDate.getFullYear(),
      c = v => v === e.minDate.getMonth() + 1,
      u = v => v === e.maxDate.getMonth() + 1,
      d = v => {
        const { minDate: _, columnsType: P } = e,
          w = P.indexOf(v),
          A = l.value[w]
        if (A) return +A
        switch (v) {
          case 'year':
            return _.getFullYear()
          case 'month':
            return _.getMonth() + 1
          case 'day':
            return _.getDate()
        }
      },
      h = () => {
        const v = e.minDate.getFullYear(),
          _ = e.maxDate.getFullYear()
        return Xo(v, _, 'year', e.formatter, e.filter, l.value)
      },
      m = () => {
        const v = d('year'),
          _ = r(v) ? e.minDate.getMonth() + 1 : 1,
          P = s(v) ? e.maxDate.getMonth() + 1 : 12
        return Xo(_, P, 'month', e.formatter, e.filter, l.value)
      },
      y = () => {
        const v = d('year'),
          _ = d('month'),
          P = r(v) && c(_) ? e.minDate.getDate() : 1,
          w = s(v) && u(_) ? e.maxDate.getDate() : Fm(v, _)
        return Xo(P, w, 'day', e.formatter, e.filter, l.value)
      },
      p = () => {
        var v
        return (v = i.value) == null ? void 0 : v.confirm()
      },
      b = () => o.value,
      x = B(() =>
        e.columnsType.map(v => {
          switch (v) {
            case 'year':
              return h()
            case 'month':
              return m()
            case 'day':
              return y()
            default:
              return []
          }
        })
      )
    ;(te(o, v => {
      mn(v, e.modelValue) || t('update:modelValue', v)
    }),
      te(
        () => e.modelValue,
        (v, _) => {
          ;((a.value = mn(_, o.value)),
            (v = Hm(v, x.value)),
            mn(v, o.value) || (o.value = v),
            (a.value = !1))
        },
        { immediate: !0 }
      ))
    const g = (...v) => t('change', ...v),
      C = (...v) => t('cancel', ...v),
      S = (...v) => t('confirm', ...v)
    return (
      Te({ confirm: p, getSelectedDate: b }),
      () =>
        f(
          li,
          Ce(
            {
              ref: i,
              modelValue: o.value,
              'onUpdate:modelValue': v => (o.value = v),
              columns: x.value,
              onChange: g,
              onCancel: C,
              onConfirm: S
            },
            Ie(e, Nm)
          ),
          n
        )
    )
  }
})
const Tg = Z(I_),
  [O_, Wt, Ti] = K('dialog'),
  Eg = he({}, da, {
    title: String,
    theme: String,
    width: q,
    message: [String, Function],
    callback: Function,
    allowHtml: Boolean,
    className: je,
    transition: J('van-dialog-bounce'),
    messageAlign: String,
    closeOnPopstate: j,
    showCancelButton: Boolean,
    cancelButtonText: String,
    cancelButtonColor: String,
    cancelButtonDisabled: Boolean,
    confirmButtonText: String,
    confirmButtonColor: String,
    confirmButtonDisabled: Boolean,
    showConfirmButton: j,
    closeOnClickOverlay: Boolean,
    keyboardEnabled: j,
    destroyOnClose: Boolean
  }),
  R_ = [...Us, 'transition', 'closeOnPopstate', 'destroyOnClose']
var kg = U({
  name: O_,
  props: Eg,
  emits: ['confirm', 'cancel', 'keydown', 'update:show'],
  setup(e, { emit: t, slots: n }) {
    const o = M(),
      a = He({ confirm: !1, cancel: !1 }),
      i = x => t('update:show', x),
      l = x => {
        var g
        ;(i(!1), (g = e.callback) == null || g.call(e, x))
      },
      r = x => () => {
        e.show &&
          (t(x),
          e.beforeClose
            ? ((a[x] = !0),
              io(e.beforeClose, {
                args: [x],
                done() {
                  ;(l(x), (a[x] = !1))
                },
                canceled() {
                  a[x] = !1
                }
              }))
            : l(x))
      },
      s = r('cancel'),
      c = r('confirm'),
      u = gp(
        x => {
          var g, C
          if (
            !e.keyboardEnabled ||
            x.target !==
              ((C = (g = o.value) == null ? void 0 : g.popupRef) == null ? void 0 : C.value)
          )
            return
          ;(({ Enter: e.showConfirmButton ? c : os, Escape: e.showCancelButton ? s : os })[x.key](),
            t('keydown', x))
        },
        ['enter', 'esc']
      ),
      d = () => {
        const x = n.title ? n.title() : e.title
        if (x) return f('div', { class: Wt('header', { isolated: !e.message && !n.default }) }, [x])
      },
      h = x => {
        const { message: g, allowHtml: C, messageAlign: S } = e,
          v = Wt('message', { 'has-title': x, [S]: S }),
          _ = na(g) ? g() : g
        return C && typeof _ == 'string'
          ? f('div', { class: v, innerHTML: _ }, null)
          : f('div', { class: v }, [_])
      },
      m = () => {
        if (n.default) return f('div', { class: Wt('content') }, [n.default()])
        const { title: x, message: g, allowHtml: C } = e
        if (g) {
          const S = !!(x || n.title)
          return f('div', { key: C ? 1 : 0, class: Wt('content', { isolated: !S }) }, [h(S)])
        }
      },
      y = () =>
        f('div', { class: [vh, Wt('footer')] }, [
          e.showCancelButton &&
            f(
              st,
              {
                size: 'large',
                text: e.cancelButtonText || Ti('cancel'),
                class: Wt('cancel'),
                style: { color: e.cancelButtonColor },
                loading: a.cancel,
                disabled: e.cancelButtonDisabled,
                onClick: s
              },
              null
            ),
          e.showConfirmButton &&
            f(
              st,
              {
                size: 'large',
                text: e.confirmButtonText || Ti('confirm'),
                class: [Wt('confirm'), { [bh]: e.showCancelButton }],
                style: { color: e.confirmButtonColor },
                loading: a.confirm,
                disabled: e.confirmButtonDisabled,
                onClick: c
              },
              null
            )
        ]),
      p = () =>
        f(
          Ws,
          { class: Wt('footer') },
          {
            default: () => [
              e.showCancelButton &&
                f(
                  il,
                  {
                    type: 'warning',
                    text: e.cancelButtonText || Ti('cancel'),
                    class: Wt('cancel'),
                    color: e.cancelButtonColor,
                    loading: a.cancel,
                    disabled: e.cancelButtonDisabled,
                    onClick: s
                  },
                  null
                ),
              e.showConfirmButton &&
                f(
                  il,
                  {
                    type: 'danger',
                    text: e.confirmButtonText || Ti('confirm'),
                    class: Wt('confirm'),
                    color: e.confirmButtonColor,
                    loading: a.confirm,
                    disabled: e.confirmButtonDisabled,
                    onClick: c
                  },
                  null
                )
            ]
          }
        ),
      b = () => (n.footer ? n.footer() : e.theme === 'round-button' ? p() : y())
    return () => {
      const { width: x, title: g, theme: C, message: S, className: v } = e
      return f(
        zt,
        Ce(
          {
            ref: o,
            role: 'dialog',
            class: [Wt([C]), v],
            style: { width: pe(x) },
            tabindex: 0,
            'aria-labelledby': g || S,
            onKeydown: u,
            'onUpdate:show': i
          },
          Ie(e, R_)
        ),
        { default: () => [d(), m(), b()] }
      )
    }
  }
})
let ms
const D_ = {
  title: '',
  width: '',
  theme: null,
  message: '',
  overlay: !0,
  callback: null,
  teleport: 'body',
  className: '',
  allowHtml: !1,
  lockScroll: !0,
  transition: void 0,
  beforeClose: null,
  overlayClass: '',
  overlayStyle: void 0,
  messageAlign: '',
  cancelButtonText: '',
  cancelButtonColor: null,
  cancelButtonDisabled: !1,
  confirmButtonText: '',
  confirmButtonColor: null,
  confirmButtonDisabled: !1,
  showConfirmButton: !0,
  showCancelButton: !1,
  closeOnPopstate: !0,
  closeOnClickOverlay: !1,
  destroyOnClose: !1
}
let $_ = he({}, D_)
function B_() {
  ;({ instance: ms } = ec({
    setup() {
      const { state: t, toggle: n } = Qs()
      return () => f(kg, Ce(t, { 'onUpdate:show': n }), null)
    }
  }))
}
function M_(e) {
  return Ot
    ? new Promise((t, n) => {
        ;(ms || B_(),
          ms.open(
            he({}, $_, e, {
              callback: o => {
                ;(o === 'confirm' ? t : n)(o)
              }
            })
          ))
      })
    : Promise.resolve(void 0)
}
const Ag = Z(kg),
  [V_, L_] = K('divider'),
  Pg = { dashed: Boolean, hairline: j, vertical: Boolean, contentPosition: J('center') }
var N_ = U({
  name: V_,
  props: Pg,
  setup(e, { slots: t }) {
    return () => {
      var n
      return f(
        'div',
        {
          role: 'separator',
          class: L_({
            dashed: e.dashed,
            hairline: e.hairline,
            vertical: e.vertical,
            [`content-${e.contentPosition}`]: !!t.default && !e.vertical
          })
        },
        [!e.vertical && ((n = t.default) == null ? void 0 : n.call(t))]
      )
    }
  }
})
const Ig = Z(N_),
  [Og, Ei] = K('dropdown-menu'),
  Rg = {
    overlay: j,
    zIndex: q,
    duration: se(0.2),
    direction: J('down'),
    activeColor: String,
    autoLocate: Boolean,
    closeOnClickOutside: j,
    closeOnClickOverlay: j,
    swipeThreshold: q
  },
  Dg = Symbol(Og)
var F_ = U({
  name: Og,
  props: Rg,
  setup(e, { slots: t }) {
    const n = fa(),
      o = M(),
      a = M(),
      i = M(0),
      { children: l, linkChildren: r } = yt(Dg),
      s = ua(o),
      c = B(() => l.some(g => g.state.showWrapper)),
      u = B(() => e.swipeThreshold && l.length > +e.swipeThreshold),
      d = B(() => {
        if (c.value && Ee(e.zIndex)) return { zIndex: +e.zIndex + 1 }
      }),
      h = () => {
        l.forEach(g => {
          g.toggle(!1)
        })
      },
      m = () => {
        e.closeOnClickOutside && h()
      },
      y = () => {
        if (a.value) {
          const g = Oe(a)
          e.direction === 'down' ? (i.value = g.bottom) : (i.value = Lt.value - g.top)
        }
      },
      p = () => {
        c.value && y()
      },
      b = g => {
        l.forEach((C, S) => {
          S === g ? C.toggle() : C.state.showPopup && C.toggle(!1, { immediate: !0 })
        })
      },
      x = (g, C) => {
        const { showPopup: S } = g.state,
          { disabled: v, titleClass: _ } = g
        return f(
          'div',
          {
            id: `${n}-${C}`,
            role: 'button',
            tabindex: v ? void 0 : 0,
            'data-allow-mismatch': 'attribute',
            class: [Ei('item', { disabled: v, grow: u.value }), { [bt]: !v }],
            onClick: () => {
              v || b(C)
            }
          },
          [
            f(
              'span',
              {
                class: [Ei('title', { down: S === (e.direction === 'down'), active: S }), _],
                style: { color: S ? e.activeColor : '' }
              },
              [f('div', { class: 'van-ellipsis' }, [g.renderTitle()])]
            )
          ]
        )
      }
    return (
      Te({ close: h, opened: c }),
      r({ id: n, props: e, offset: i, opened: c, updateOffset: y }),
      Dl(o, m),
      Xe('scroll', p, { target: s, passive: !0 }),
      () => {
        var g
        return f('div', { ref: o, class: Ei() }, [
          f(
            'div',
            { ref: a, style: d.value, class: Ei('bar', { opened: c.value, scrollable: u.value }) },
            [l.map(x)]
          ),
          (g = t.default) == null ? void 0 : g.call(t)
        ])
      }
    )
  }
})
const [H_, ki] = K('dropdown-item'),
  $g = {
    title: String,
    options: ze(),
    disabled: Boolean,
    teleport: [String, Object],
    lazyRender: j,
    modelValue: je,
    titleClass: je
  }
var z_ = U({
  name: H_,
  inheritAttrs: !1,
  props: $g,
  emits: ['open', 'opened', 'close', 'closed', 'change', 'update:modelValue'],
  setup(e, { emit: t, slots: n, attrs: o }) {
    const a = He({ showPopup: !1, transition: !0, showWrapper: !1 }),
      i = M(),
      { parent: l, index: r } = ht(Dg)
    if (!l) return
    const s = g => () => t(g),
      c = s('open'),
      u = s('close'),
      d = s('opened'),
      h = () => {
        ;((a.showWrapper = !1), t('closed'))
      },
      m = g => {
        e.teleport && g.stopPropagation()
      },
      y = (g = !a.showPopup, C = {}) => {
        g !== a.showPopup &&
          ((a.showPopup = g),
          (a.transition = !C.immediate),
          g && (l.updateOffset(), (a.showWrapper = !0)))
      },
      p = () => {
        if (n.title) return n.title()
        if (e.title) return e.title
        const g = e.options.find(C => C.value === e.modelValue)
        return g ? g.text : ''
      },
      b = g => {
        const { activeColor: C } = l.props,
          { disabled: S } = g,
          v = g.value === e.modelValue,
          _ = () => {
            S ||
              ((a.showPopup = !1),
              g.value !== e.modelValue && (t('update:modelValue', g.value), t('change', g.value)))
          },
          P = () => {
            if (v) return f(we, { class: ki('icon'), color: S ? void 0 : C, name: 'success' }, null)
          }
        return f(
          jt,
          {
            role: 'menuitem',
            key: String(g.value),
            icon: g.icon,
            title: g.text,
            class: ki('option', { active: v, disabled: S }),
            style: { color: v ? C : '' },
            tabindex: v ? 0 : -1,
            clickable: !S,
            onClick: _
          },
          { value: P }
        )
      },
      x = () => {
        const { offset: g } = l,
          {
            autoLocate: C,
            zIndex: S,
            overlay: v,
            duration: _,
            direction: P,
            closeOnClickOverlay: w
          } = l.props,
          A = Hn(S)
        let O = g.value
        if (C && i.value) {
          const I = nx(i.value)
          I && (O -= Oe(I).top)
        }
        return (
          P === 'down' ? (A.top = `${O}px`) : (A.bottom = `${O}px`),
          rt(
            f('div', Ce({ ref: i, style: A, class: ki([P]), onClick: m }, o), [
              f(
                zt,
                {
                  show: a.showPopup,
                  'onUpdate:show': I => (a.showPopup = I),
                  role: 'menu',
                  class: ki('content'),
                  overlay: v,
                  overlayProps: { duration: a.transition && !l.opened.value ? _ : 0 },
                  position: P === 'down' ? 'top' : 'bottom',
                  duration: a.transition ? _ : 0,
                  lazyRender: e.lazyRender,
                  overlayStyle: { position: 'absolute' },
                  'aria-labelledby': `${l.id}-${r.value}`,
                  'data-allow-mismatch': 'attribute',
                  closeOnClickOverlay: w,
                  onOpen: c,
                  onClose: u,
                  onOpened: d,
                  onClosed: h
                },
                {
                  default: () => {
                    var I
                    return [e.options.map(b), (I = n.default) == null ? void 0 : I.call(n)]
                  }
                }
              )
            ]),
            [[ft, a.showWrapper]]
          )
        )
      }
    return (
      Te({ state: a, toggle: y, renderTitle: p }),
      () => (e.teleport ? f(Eo, { to: e.teleport }, { default: () => [x()] }) : x())
    )
  }
})
const Bg = Z(z_),
  Mg = Z(F_),
  Vg = {
    gap: { type: [Number, Object], default: 24 },
    icon: String,
    axis: J('y'),
    magnetic: String,
    offset: Object,
    teleport: { type: [String, Object], default: 'body' }
  },
  [j_, rd] = K('floating-bubble')
var W_ = U({
  name: j_,
  inheritAttrs: !1,
  props: Vg,
  emits: ['click', 'update:offset', 'offsetChange'],
  setup(e, { slots: t, emit: n, attrs: o }) {
    const a = M(),
      i = M({ x: 0, y: 0, width: 0, height: 0 }),
      l = B(() => (Qt(e.gap) ? e.gap.x : e.gap)),
      r = B(() => (Qt(e.gap) ? e.gap.y : e.gap)),
      s = B(() => ({
        top: r.value,
        right: qt.value - i.value.width - l.value,
        bottom: Lt.value - i.value.height - r.value,
        left: l.value
      })),
      c = M(!1)
    let u = !1
    const d = B(() => {
        const v = {},
          _ = pe(i.value.x),
          P = pe(i.value.y)
        return (
          (v.transform = `translate3d(${_}, ${P}, 0)`),
          (c.value || !u) && (v.transition = 'none'),
          v
        )
      }),
      h = () => {
        if (!S.value) return
        const { width: v, height: _ } = Oe(a.value),
          { offset: P } = e
        i.value = {
          x: P ? P.x : qt.value - v - l.value,
          y: P ? P.y : Lt.value - _ - r.value,
          width: v,
          height: _
        }
      },
      m = Ht()
    let y = 0,
      p = 0
    const b = v => {
      ;(m.start(v), (c.value = !0), (y = i.value.x), (p = i.value.y))
    }
    Xe(
      'touchmove',
      v => {
        if ((v.preventDefault(), m.move(v), e.axis !== 'lock' && !m.isTap.value)) {
          if (e.axis === 'x' || e.axis === 'xy') {
            let P = y + m.deltaX.value
            ;(P < s.value.left && (P = s.value.left),
              P > s.value.right && (P = s.value.right),
              (i.value.x = P))
          }
          if (e.axis === 'y' || e.axis === 'xy') {
            let P = p + m.deltaY.value
            ;(P < s.value.top && (P = s.value.top),
              P > s.value.bottom && (P = s.value.bottom),
              (i.value.y = P))
          }
          const _ = Ie(i.value, ['x', 'y'])
          n('update:offset', _)
        }
      },
      { target: a }
    )
    const g = () => {
        ;((c.value = !1),
          Se(() => {
            if (e.magnetic === 'x') {
              const v = al([s.value.left, s.value.right], i.value.x)
              i.value.x = v
            }
            if (e.magnetic === 'y') {
              const v = al([s.value.top, s.value.bottom], i.value.y)
              i.value.y = v
            }
            if (!m.isTap.value) {
              const v = Ie(i.value, ['x', 'y'])
              ;(n('update:offset', v), (y !== v.x || p !== v.y) && n('offsetChange', v))
            }
          }))
      },
      C = v => {
        m.isTap.value ? n('click', v) : v.stopPropagation()
      }
    ;(We(() => {
      ;(h(),
        Se(() => {
          u = !0
        }))
    }),
      te([qt, Lt, l, r, () => e.offset], h, { deep: !0 }))
    const S = M(!0)
    return (
      yn(() => {
        S.value = !0
      }),
      pn(() => {
        e.teleport && (S.value = !1)
      }),
      () => {
        const v = rt(
          f(
            'div',
            Ce(
              {
                class: rd(),
                ref: a,
                onTouchstartPassive: b,
                onTouchend: g,
                onTouchcancel: g,
                onClickCapture: C,
                style: d.value
              },
              o
            ),
            [t.default ? t.default() : f(kx, { name: e.icon, class: rd('icon') }, null)]
          ),
          [[ft, S.value]]
        )
        return e.teleport ? f(Eo, { to: e.teleport }, { default: () => [v] }) : v
      }
    )
  }
})
const Lg = Z(W_),
  Ng = {
    height: se(0),
    anchors: ze(),
    duration: se(0.3),
    magnetic: j,
    draggable: j,
    contentDraggable: j,
    lockScroll: Boolean,
    safeAreaInsetBottom: j
  },
  [U_, Ai] = K('floating-panel')
var K_ = U({
  name: U_,
  props: Ng,
  emits: ['heightChange', 'update:height'],
  setup(e, { emit: t, slots: n }) {
    const a = M(),
      i = M(),
      l = Gs(
        () => +e.height,
        C => t('update:height', C)
      ),
      r = B(() => {
        var C, S
        return {
          min: (C = e.anchors[0]) != null ? C : 100,
          max: (S = e.anchors[e.anchors.length - 1]) != null ? S : Math.round(Lt.value * 0.6)
        }
      }),
      s = B(() => (e.anchors.length >= 2 ? e.anchors : [r.value.min, r.value.max])),
      c = M(!1),
      u = B(() => ({
        height: pe(r.value.max),
        transform: `translateY(calc(100% + ${pe(-l.value)}))`,
        transition: c.value
          ? 'none'
          : `transform ${e.duration}s cubic-bezier(0.18, 0.89, 0.32, 1.28)`
      })),
      d = C => {
        const S = Math.abs(C),
          { min: v, max: _ } = r.value
        return S > _ ? -(_ + (S - _) * 0.2) : S < v ? -(v - (v - S) * 0.2) : C
      }
    let h,
      m = -1
    const y = Ht(),
      p = C => {
        e.draggable && (y.start(C), (c.value = !0), (h = -l.value), (m = -1))
      },
      b = C => {
        var S
        if (!e.draggable) return
        y.move(C)
        const v = C.target
        if (i.value === v || ((S = i.value) != null && S.contains(v))) {
          const { scrollTop: P } = i.value
          if (((m = Math.max(m, P)), !e.contentDraggable)) return
          if (-h < r.value.max) Fe(C, !0)
          else if (!(P <= 0 && y.deltaY.value > 0) || m > 0) return
        }
        const _ = y.deltaY.value + h
        l.value = -d(_)
      },
      x = () => {
        if (((m = -1), !!c.value && ((c.value = !1), !!e.draggable))) {
          if (e.magnetic) l.value = al(s.value, l.value)
          else {
            const { min: C, max: S } = r.value
            l.value = Math.max(C, Math.min(S, l.value))
          }
          l.value !== -h && t('heightChange', { height: l.value })
        }
      }
    ;(te(
      r,
      () => {
        l.value = al(s.value, l.value)
      },
      { immediate: !0 }
    ),
      Lh(a, () => e.lockScroll || c.value),
      Xe('touchmove', b, { target: a }))
    const g = () =>
      n.header
        ? n.header()
        : e.draggable
          ? f('div', { class: Ai('header') }, [f('div', { class: Ai('header-bar') }, null)])
          : null
    return () => {
      var C
      return f(
        'div',
        {
          class: [Ai(), { 'van-safe-area-bottom': e.safeAreaInsetBottom }],
          ref: a,
          style: u.value,
          onTouchstartPassive: p,
          onTouchend: x,
          onTouchcancel: x
        },
        [
          g(),
          f(
            'div',
            { class: Ai('content'), ref: i, style: { paddingBottom: pe(r.value.max - l.value) } },
            [(C = n.default) == null ? void 0 : C.call(n)]
          )
        ]
      )
    }
  }
})
const Fg = Z(K_),
  [Hg, Y_] = K('grid'),
  zg = {
    square: Boolean,
    center: j,
    border: j,
    gutter: q,
    reverse: Boolean,
    iconSize: q,
    direction: String,
    clickable: Boolean,
    columnNum: se(4)
  },
  jg = Symbol(Hg)
var G_ = U({
  name: Hg,
  props: zg,
  setup(e, { slots: t }) {
    const { linkChildren: n } = yt(jg)
    return (
      n({ props: e }),
      () => {
        var o
        return f(
          'div',
          { style: { paddingLeft: pe(e.gutter) }, class: [Y_(), { [vh]: e.border && !e.gutter }] },
          [(o = t.default) == null ? void 0 : o.call(t)]
        )
      }
    )
  }
})
const Wg = Z(G_),
  [q_, Pi] = K('grid-item'),
  Ug = he({}, lo, {
    dot: Boolean,
    text: String,
    icon: String,
    badge: q,
    iconColor: String,
    iconPrefix: String,
    badgeProps: Object
  })
var X_ = U({
  name: q_,
  props: Ug,
  setup(e, { slots: t }) {
    const { parent: n, index: o } = ht(jg),
      a = ko()
    if (!n) return
    const i = B(() => {
        const { square: u, gutter: d, columnNum: h } = n.props,
          m = `${100 / +h}%`,
          y = { flexBasis: m }
        if (u) y.paddingTop = m
        else if (d) {
          const p = pe(d)
          ;((y.paddingRight = p), o.value >= +h && (y.marginTop = p))
        }
        return y
      }),
      l = B(() => {
        const { square: u, gutter: d } = n.props
        if (u && d) {
          const h = pe(d)
          return { right: h, bottom: h, height: 'auto' }
        }
      }),
      r = () => {
        if (t.icon)
          return f(ro, Ce({ dot: e.dot, content: e.badge }, e.badgeProps), { default: t.icon })
        if (e.icon)
          return f(
            we,
            {
              dot: e.dot,
              name: e.icon,
              size: n.props.iconSize,
              badge: e.badge,
              class: Pi('icon'),
              color: e.iconColor,
              badgeProps: e.badgeProps,
              classPrefix: e.iconPrefix
            },
            null
          )
      },
      s = () => {
        if (t.text) return t.text()
        if (e.text) return f('span', { class: Pi('text') }, [e.text])
      },
      c = () => (t.default ? t.default() : [r(), s()])
    return () => {
      const {
          center: u,
          border: d,
          square: h,
          gutter: m,
          reverse: y,
          direction: p,
          clickable: b
        } = n.props,
        x = [
          Pi('content', [p, { center: u, square: h, reverse: y, clickable: b, surround: d && m }]),
          { [zn]: d }
        ]
      return f('div', { class: [Pi({ square: h })], style: i.value }, [
        f(
          'div',
          {
            role: b ? 'button' : void 0,
            class: x,
            style: l.value,
            tabindex: b ? 0 : void 0,
            onClick: a
          },
          [c()]
        )
      ])
    }
  }
})
const Kg = Z(X_),
  [Z_, sd] = K('highlight'),
  Yg = {
    autoEscape: j,
    caseSensitive: Boolean,
    highlightClass: String,
    highlightTag: J('span'),
    keywords: lt([String, Array]),
    sourceString: J(''),
    tag: J('div'),
    unhighlightClass: String,
    unhighlightTag: J('span')
  }
var J_ = U({
  name: Z_,
  props: Yg,
  setup(e) {
    const t = B(() => {
        const { autoEscape: o, caseSensitive: a, keywords: i, sourceString: l } = e,
          r = a ? 'g' : 'gi'
        let c = (Array.isArray(i) ? i : [i])
          .filter(d => d)
          .reduce((d, h) => {
            o && (h = h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            const m = new RegExp(h, r)
            let y
            for (; (y = m.exec(l));) {
              const p = y.index,
                b = m.lastIndex
              if (p >= b) {
                m.lastIndex++
                continue
              }
              d.push({ start: p, end: b, highlight: !0 })
            }
            return d
          }, [])
        c = c
          .sort((d, h) => d.start - h.start)
          .reduce((d, h) => {
            const m = d[d.length - 1]
            if (!m || h.start > m.end) {
              const y = m ? m.end : 0,
                p = h.start
              ;(y !== p && d.push({ start: y, end: p, highlight: !1 }), d.push(h))
            } else m.end = Math.max(m.end, h.end)
            return d
          }, [])
        const u = c[c.length - 1]
        return (
          u || c.push({ start: 0, end: l.length, highlight: !1 }),
          u && u.end < l.length && c.push({ start: u.end, end: l.length, highlight: !1 }),
          c
        )
      }),
      n = () => {
        const {
          sourceString: o,
          highlightClass: a,
          unhighlightClass: i,
          highlightTag: l,
          unhighlightTag: r
        } = e
        return t.value.map(s => {
          const { start: c, end: u, highlight: d } = s,
            h = o.slice(c, u)
          return d
            ? f(l, { class: [sd('tag'), a] }, { default: () => [h] })
            : f(r, { class: i }, { default: () => [h] })
        })
      }
    return () => {
      const { tag: o } = e
      return f(o, { class: sd() }, { default: () => [n()] })
    }
  }
})
const Gg = Z(J_),
  cd = e => Math.sqrt((e[0].clientX - e[1].clientX) ** 2 + (e[0].clientY - e[1].clientY) ** 2),
  Q_ = e => ({ x: (e[0].clientX + e[1].clientX) / 2, y: (e[0].clientY + e[1].clientY) / 2 }),
  Er = K('image-preview')[1],
  ud = 2.6,
  eT = {
    src: String,
    show: Boolean,
    active: Number,
    minZoom: lt(q),
    maxZoom: lt(q),
    rootWidth: lt(Number),
    rootHeight: lt(Number),
    disableZoom: Boolean,
    doubleScale: Boolean,
    closeOnClickImage: Boolean,
    closeOnClickOverlay: Boolean,
    vertical: Boolean
  }
var tT = U({
  props: eT,
  emits: ['scale', 'close', 'longPress'],
  setup(e, { emit: t, slots: n }) {
    const o = He({
        scale: 1,
        moveX: 0,
        moveY: 0,
        moving: !1,
        zooming: !1,
        initializing: !1,
        imageRatio: 0
      }),
      a = Ht(),
      i = M(),
      l = M(),
      r = M(!1),
      s = M(!1)
    let c = 0
    const u = B(() => {
        const { scale: L, moveX: ee, moveY: ae, moving: _e, zooming: ke, initializing: re } = o,
          H = { transitionDuration: ke || _e || re ? '0s' : '.3s' }
        return ((L !== 1 || s.value) && (H.transform = `matrix(${L}, 0, 0, ${L}, ${ee}, ${ae})`), H)
      }),
      d = B(() => {
        if (o.imageRatio) {
          const { rootWidth: L, rootHeight: ee } = e,
            ae = r.value ? ee / o.imageRatio : L
          return Math.max(0, (o.scale * ae - L) / 2)
        }
        return 0
      }),
      h = B(() => {
        if (o.imageRatio) {
          const { rootWidth: L, rootHeight: ee } = e,
            ae = r.value ? ee : L * o.imageRatio
          return Math.max(0, (o.scale * ae - ee) / 2)
        }
        return 0
      }),
      m = (L, ee) => {
        var ae
        if (((L = it(L, +e.minZoom, +e.maxZoom + 1)), L !== o.scale)) {
          const _e = L / o.scale
          if (((o.scale = L), ee)) {
            const ke = Oe((ae = i.value) == null ? void 0 : ae.$el),
              re = { x: ke.width * 0.5, y: ke.height * 0.5 },
              H = o.moveX - (ee.x - ke.left - re.x) * (_e - 1),
              ne = o.moveY - (ee.y - ke.top - re.y) * (_e - 1)
            ;((o.moveX = it(H, -d.value, d.value)), (o.moveY = it(ne, -h.value, h.value)))
          } else ((o.moveX = 0), (o.moveY = s.value ? c : 0))
          t('scale', { scale: L, index: e.active })
        }
      },
      y = () => {
        m(1)
      },
      p = () => {
        const L = o.scale > 1 ? 1 : 2
        m(L, L === 2 || s.value ? { x: a.startX.value, y: a.startY.value } : void 0)
      }
    let b,
      x,
      g,
      C,
      S,
      v,
      _,
      P,
      w = !1
    const A = L => {
        const { touches: ee } = L
        if (((b = ee.length), b === 2 && e.disableZoom)) return
        const { offsetX: ae } = a
        ;(a.start(L),
          (x = o.moveX),
          (g = o.moveY),
          (P = Date.now()),
          (w = !1),
          (o.moving = b === 1 && (o.scale !== 1 || s.value)),
          (o.zooming = b === 2 && !ae.value),
          o.zooming && ((C = o.scale), (S = cd(ee))))
      },
      O = L => {
        const { touches: ee } = L
        if ((a.move(L), o.moving)) {
          const { deltaX: ae, deltaY: _e } = a,
            ke = ae.value + x,
            re = _e.value + g
          if (
            (e.vertical
              ? a.isVertical() && Math.abs(re) > h.value
              : a.isHorizontal() && Math.abs(ke) > d.value) &&
            !w
          ) {
            o.moving = !1
            return
          }
          ;((w = !0),
            Fe(L, !0),
            (o.moveX = it(ke, -d.value, d.value)),
            (o.moveY = it(re, -h.value, h.value)))
        }
        if (o.zooming && (Fe(L, !0), ee.length === 2)) {
          const ae = cd(ee),
            _e = (C * ae) / S
          ;((v = Q_(ee)), m(_e, v))
        }
      },
      I = L => {
        var ee
        const ae = (ee = l.value) == null ? void 0 : ee.$el
        if (!ae) return
        const _e = ae.firstElementChild,
          ke = L.target === ae,
          re = _e == null ? void 0 : _e.contains(L.target)
        ;(!e.closeOnClickImage && re) || (!e.closeOnClickOverlay && ke) || t('close')
      },
      T = L => {
        if (b > 1) return
        const ee = Date.now() - P,
          ae = 250
        a.isTap.value &&
          (ee < ae
            ? e.doubleScale
              ? _
                ? (clearTimeout(_), (_ = null), p())
                : (_ = setTimeout(() => {
                    ;(I(L), (_ = null))
                  }, ae))
              : I(L)
            : ee > ph && t('longPress'))
      },
      D = L => {
        let ee = !1
        if (
          (o.moving || o.zooming) &&
          ((ee = !0), o.moving && x === o.moveX && g === o.moveY && (ee = !1), !L.touches.length)
        ) {
          ;(o.zooming &&
            ((o.moveX = it(o.moveX, -d.value, d.value)),
            (o.moveY = it(o.moveY, -h.value, h.value)),
            (o.zooming = !1)),
            (o.moving = !1),
            (x = 0),
            (g = 0),
            (C = 1),
            o.scale < 1 && y())
          const ae = +e.maxZoom
          o.scale > ae && m(ae, v)
        }
        ;(Fe(L, ee), T(L), a.reset())
      },
      z = () => {
        const { rootWidth: L, rootHeight: ee } = e,
          ae = ee / L,
          { imageRatio: _e } = o
        ;((r.value = o.imageRatio > ae && _e < ud),
          (s.value = o.imageRatio > ae && _e >= ud),
          s.value &&
            ((c = (_e * L - ee) / 2),
            (o.moveY = c),
            (o.initializing = !0),
            vt(() => {
              o.initializing = !1
            })),
          y())
      },
      oe = L => {
        const { naturalWidth: ee, naturalHeight: ae } = L.target
        ;((o.imageRatio = ae / ee), z())
      }
    return (
      te(() => e.active, y),
      te(
        () => e.show,
        L => {
          L || y()
        }
      ),
      te(() => [e.rootWidth, e.rootHeight], z),
      Xe('touchmove', O, {
        target: B(() => {
          var L
          return (L = l.value) == null ? void 0 : L.$el
        })
      }),
      Te({ resetScale: y }),
      () => {
        const L = { loading: () => f(Ft, { type: 'spinner' }, null) }
        return f(
          Nl,
          {
            ref: l,
            class: Er('swipe-item'),
            onTouchstartPassive: A,
            onTouchend: D,
            onTouchcancel: D
          },
          {
            default: () => [
              n.image
                ? f('div', { class: Er('image-wrap') }, [
                    n.image({ src: e.src, onLoad: oe, style: u.value })
                  ])
                : f(
                    si,
                    {
                      ref: i,
                      src: e.src,
                      fit: 'contain',
                      class: Er('image', { vertical: r.value }),
                      style: u.value,
                      onLoad: oe
                    },
                    L
                  )
            ]
          }
        )
      }
    )
  }
})
const [nT, Lo] = K('image-preview'),
  oT = ['show', 'teleport', 'transition', 'overlayStyle', 'closeOnPopstate'],
  qg = {
    show: Boolean,
    loop: j,
    images: ze(),
    minZoom: se(1 / 3),
    maxZoom: se(3),
    overlay: j,
    vertical: Boolean,
    closeable: Boolean,
    showIndex: j,
    className: je,
    closeIcon: J('clear'),
    transition: String,
    beforeClose: Function,
    doubleScale: j,
    overlayClass: je,
    overlayStyle: Object,
    swipeDuration: se(300),
    startPosition: se(0),
    showIndicators: Boolean,
    closeOnPopstate: j,
    closeOnClickImage: j,
    closeOnClickOverlay: j,
    closeIconPosition: J('top-right'),
    teleport: [String, Object]
  }
var Xg = U({
  name: nT,
  props: qg,
  emits: ['scale', 'close', 'closed', 'change', 'longPress', 'update:show'],
  setup(e, { emit: t, slots: n }) {
    const o = M(),
      a = M(),
      i = He({ active: 0, rootWidth: 0, rootHeight: 0, disableZoom: !1 }),
      l = () => {
        if (o.value) {
          const v = Oe(o.value.$el)
          ;((i.rootWidth = v.width), (i.rootHeight = v.height), o.value.resize())
        }
      },
      r = v => t('scale', v),
      s = v => t('update:show', v),
      c = () => {
        io(e.beforeClose, { args: [i.active], done: () => s(!1) })
      },
      u = v => {
        v !== i.active && ((i.active = v), t('change', v))
      },
      d = () => {
        if (e.showIndex)
          return f('div', { class: Lo('index') }, [
            n.index ? n.index({ index: i.active }) : `${i.active + 1} / ${e.images.length}`
          ])
      },
      h = () => {
        if (n.cover) return f('div', { class: Lo('cover') }, [n.cover()])
      },
      m = () => {
        i.disableZoom = !0
      },
      y = () => {
        i.disableZoom = !1
      },
      p = () =>
        f(
          Ll,
          {
            ref: o,
            lazyRender: !0,
            loop: e.loop,
            class: Lo('swipe'),
            vertical: e.vertical,
            duration: e.swipeDuration,
            initialSwipe: e.startPosition,
            showIndicators: e.showIndicators,
            indicatorColor: 'white',
            onChange: u,
            onDragEnd: y,
            onDragStart: m
          },
          {
            default: () => [
              e.images.map((v, _) =>
                f(
                  tT,
                  {
                    ref: P => {
                      _ === i.active && (a.value = P)
                    },
                    src: v,
                    show: e.show,
                    active: i.active,
                    maxZoom: e.maxZoom,
                    minZoom: e.minZoom,
                    rootWidth: i.rootWidth,
                    rootHeight: i.rootHeight,
                    disableZoom: i.disableZoom,
                    doubleScale: e.doubleScale,
                    closeOnClickImage: e.closeOnClickImage,
                    closeOnClickOverlay: e.closeOnClickOverlay,
                    vertical: e.vertical,
                    onScale: r,
                    onClose: c,
                    onLongPress: () => t('longPress', { index: _ })
                  },
                  { image: n.image }
                )
              )
            ]
          }
        ),
      b = () => {
        if (e.closeable)
          return f(
            we,
            {
              role: 'button',
              name: e.closeIcon,
              class: [Lo('close-icon', e.closeIconPosition), bt],
              onClick: c
            },
            null
          )
      },
      x = () => t('closed'),
      g = () => {
        var v
        return (v = o.value) == null ? void 0 : v.prev()
      },
      C = () => {
        var v
        return (v = o.value) == null ? void 0 : v.next()
      },
      S = (v, _) => {
        var P
        return (P = o.value) == null ? void 0 : P.swipeTo(v, _)
      }
    return (
      Te({
        resetScale: () => {
          var v
          ;(v = a.value) == null || v.resetScale()
        },
        swipeTo: S,
        prev: g,
        next: C
      }),
      We(l),
      te([qt, Lt], l),
      te(
        () => e.startPosition,
        v => u(+v)
      ),
      te(
        () => e.show,
        v => {
          const { images: _, startPosition: P } = e
          v
            ? (u(+P),
              Se(() => {
                ;(l(), S(+P, { immediate: !0 }))
              }))
            : t('close', { index: i.active, url: _[i.active] })
        }
      ),
      () =>
        f(
          zt,
          Ce(
            {
              class: [Lo(), e.className],
              overlayClass: [Lo('overlay'), e.overlayClass],
              onClosed: x,
              'onUpdate:show': s
            },
            Ie(e, oT)
          ),
          { default: () => [b(), p(), d(), h()] }
        )
    )
  }
})
let Li
const aT = {
  loop: !0,
  images: [],
  maxZoom: 3,
  minZoom: 1 / 3,
  onScale: void 0,
  onClose: void 0,
  onChange: void 0,
  vertical: !1,
  teleport: 'body',
  className: '',
  showIndex: !0,
  closeable: !1,
  closeIcon: 'clear',
  transition: void 0,
  beforeClose: void 0,
  doubleScale: !0,
  overlayStyle: void 0,
  overlayClass: void 0,
  startPosition: 0,
  swipeDuration: 300,
  showIndicators: !1,
  closeOnPopstate: !0,
  closeOnClickOverlay: !0,
  closeIconPosition: 'top-right'
}
function iT() {
  ;({ instance: Li } = ec({
    setup() {
      const { state: e, toggle: t } = Qs(),
        n = () => {
          e.images = []
        }
      return () => f(Xg, Ce(e, { onClosed: n, 'onUpdate:show': t }), null)
    }
  }))
}
const Zg = (e, t = 0) => {
    if (Ot)
      return (
        Li || iT(),
        (e = Array.isArray(e) ? { images: e, startPosition: t } : e),
        Li.open(he({}, aT, e)),
        Li
      )
  },
  Jg = Z(Xg)
function lT() {
  return Array(26)
    .fill('')
    .map((n, o) => String.fromCharCode(65 + o))
}
const [Qg, kr] = K('index-bar'),
  ev = {
    sticky: j,
    zIndex: q,
    teleport: [String, Object],
    highlightColor: String,
    stickyOffsetTop: Je(0),
    indexList: { type: Array, default: lT }
  },
  tv = Symbol(Qg)
var rT = U({
  name: Qg,
  props: ev,
  emits: ['select', 'change'],
  setup(e, { emit: t, slots: n }) {
    const o = M(),
      a = M(),
      i = M(''),
      l = Ht(),
      r = ua(o),
      { children: s, linkChildren: c } = yt(tv)
    let u
    c({ props: e })
    const d = B(() => {
        if (Ee(e.zIndex)) return { zIndex: +e.zIndex + 1 }
      }),
      h = B(() => {
        if (e.highlightColor) return { color: e.highlightColor }
      }),
      m = (w, A) => {
        for (let O = s.length - 1; O >= 0; O--) {
          const I = O > 0 ? A[O - 1].height : 0,
            T = e.sticky ? I + e.stickyOffsetTop : 0
          if (w + T >= A[O].top) return O
        }
        return -1
      },
      y = w => s.find(A => String(A.index) === w),
      p = () => {
        if (To(o)) return
        const { sticky: w, indexList: A } = e,
          O = Bn(r.value),
          I = Oe(r),
          T = s.map(z => z.getRect(r.value, I))
        let D = -1
        if (u) {
          const z = y(u)
          if (z) {
            const oe = z.getRect(r.value, I)
            e.sticky && e.stickyOffsetTop
              ? (D = m(oe.top - e.stickyOffsetTop, T))
              : (D = m(oe.top, T))
          }
        } else D = m(O, T)
        ;((i.value = A[D]),
          w &&
            s.forEach((z, oe) => {
              const { state: L, $el: ee } = z
              if (oe === D || oe === D - 1) {
                const ae = ee.getBoundingClientRect()
                ;((L.left = ae.left), (L.width = ae.width))
              } else ((L.left = null), (L.width = null))
              if (oe === D)
                ((L.active = !0), (L.top = Math.max(e.stickyOffsetTop, T[oe].top - O) + I.top))
              else if (oe === D - 1 && u === '') {
                const ae = T[D].top - O
                ;((L.active = ae > 0), (L.top = ae + I.top - T[oe].height))
              } else L.active = !1
            }),
          (u = ''))
      },
      b = () => {
        Se(p)
      }
    ;(Xe('scroll', p, { target: r, passive: !0 }),
      We(b),
      te(() => e.indexList, b),
      te(i, w => {
        w && t('change', w)
      }))
    const x = () =>
        e.indexList.map(w => {
          const A = w === i.value
          return f(
            'span',
            { class: kr('index', { active: A }), style: A ? h.value : void 0, 'data-index': w },
            [w]
          )
        }),
      g = w => {
        u = String(w)
        const A = y(u)
        if (A) {
          const O = Bn(r.value),
            I = Oe(r),
            { offsetHeight: T } = document.documentElement
          if ((A.$el.scrollIntoView(), O === T - I.height)) {
            p()
            return
          }
          ;(e.sticky &&
            e.stickyOffsetTop &&
            (So() === T - I.height ? Za(So()) : Za(So() - e.stickyOffsetTop)),
            t('select', A.index))
        }
      },
      C = w => {
        const { index: A } = w.dataset
        A && g(A)
      },
      S = w => {
        C(w.target)
      }
    let v
    const _ = w => {
        if ((l.move(w), l.isVertical())) {
          Fe(w)
          const { clientX: A, clientY: O } = w.touches[0],
            I = document.elementFromPoint(A, O)
          if (I) {
            const { index: T } = I.dataset
            T && v !== T && ((v = T), C(I))
          }
        }
      },
      P = () =>
        f(
          'div',
          {
            ref: a,
            class: kr('sidebar'),
            style: d.value,
            onClick: S,
            onTouchstartPassive: l.start
          },
          [x()]
        )
    return (
      Te({ scrollTo: g }),
      Xe('touchmove', _, { target: a }),
      () => {
        var w
        return f('div', { ref: o, class: kr() }, [
          e.teleport ? f(Eo, { to: e.teleport }, { default: () => [P()] }) : P(),
          (w = n.default) == null ? void 0 : w.call(n)
        ])
      }
    )
  }
})
const [sT, cT] = K('index-anchor'),
  nv = { index: q }
var uT = U({
  name: sT,
  props: nv,
  setup(e, { slots: t }) {
    const n = He({ top: 0, left: null, rect: { top: 0, height: 0 }, width: null, active: !1 }),
      o = M(),
      { parent: a } = ht(tv)
    if (!a) return
    const i = () => n.active && a.props.sticky,
      l = B(() => {
        const { zIndex: s, highlightColor: c } = a.props
        if (i())
          return he(Hn(s), {
            left: n.left ? `${n.left}px` : void 0,
            width: n.width ? `${n.width}px` : void 0,
            transform: n.top ? `translate3d(0, ${n.top}px, 0)` : void 0,
            color: c
          })
      })
    return (
      Te({
        state: n,
        getRect: (s, c) => {
          const u = Oe(o)
          return (
            (n.rect.height = u.height),
            s === window || s === document.body
              ? (n.rect.top = u.top + So())
              : (n.rect.top = u.top + Bn(s) - c.top),
            n.rect
          )
        }
      }),
      () => {
        const s = i()
        return f('div', { ref: o, style: { height: s ? `${n.rect.height}px` : void 0 } }, [
          f('div', { style: l.value, class: [cT({ sticky: s }), { [zs]: s }] }, [
            t.default ? t.default() : e.index
          ])
        ])
      }
    )
  }
})
const ov = Z(uT),
  av = Z(rT),
  [dT, No, fT] = K('list'),
  iv = {
    error: Boolean,
    offset: se(300),
    loading: Boolean,
    disabled: Boolean,
    finished: Boolean,
    scroller: Object,
    errorText: String,
    direction: J('down'),
    loadingText: { type: String, default: '' },
    finishedText: String,
    immediateCheck: j
  }
var hT = U({
  name: dT,
  props: iv,
  emits: ['load', 'update:error', 'update:loading'],
  setup(e, { emit: t, slots: n }) {
    const o = M(e.loading),
      a = M(),
      i = M(),
      l = Xs(),
      r = ua(a),
      s = B(() => e.scroller || r.value),
      c = () => {
        Se(() => {
          if (
            o.value ||
            e.finished ||
            e.disabled ||
            e.error ||
            (l == null ? void 0 : l.value) === !1
          )
            return
          const { direction: y } = e,
            p = +e.offset,
            b = Oe(s)
          if (!b.height || To(a)) return
          let x = !1
          const g = Oe(i)
          ;(y === 'up' ? (x = b.top - g.top <= p) : (x = g.bottom - b.bottom <= p),
            x && ((o.value = !0), t('update:loading', !0), t('load')))
        })
      },
      u = () => {
        if (e.finished) {
          const y = n.finished ? n.finished() : e.finishedText
          if (y) return f('div', { class: No('finished-text') }, [y])
        }
      },
      d = () => {
        ;(t('update:error', !1), c())
      },
      h = () => {
        if (e.error) {
          const y = n.error ? n.error() : e.errorText
          if (y)
            return f('div', { role: 'button', class: No('error-text'), tabindex: 0, onClick: d }, [
              y
            ])
        }
      },
      m = () => {
        if (o.value && !e.finished && !e.disabled)
          return f('div', { class: No('loading') }, [
            n.loading
              ? n.loading()
              : e.loadingText != null &&
                f(
                  Ft,
                  { class: No('loading-icon') },
                  { default: () => [e.loadingText || fT('loading')] }
                )
          ])
      }
    return (
      te(() => [e.loading, e.finished, e.error], c),
      l &&
        te(l, y => {
          y && c()
        }),
      As(() => {
        o.value = e.loading
      }),
      We(() => {
        e.immediateCheck && c()
      }),
      Te({ check: c }),
      Xe('scroll', c, { target: s, passive: !0 }),
      () => {
        var y
        const p = (y = n.default) == null ? void 0 : y.call(n),
          b = f('div', { ref: i, class: No('placeholder') }, null)
        return f('div', { ref: a, role: 'feed', class: No(), 'aria-busy': o.value }, [
          e.direction === 'down' ? p : b,
          m(),
          u(),
          h(),
          e.direction === 'up' ? p : b
        ])
      }
    )
  }
})
const lv = Z(hT),
  [mT, Tn] = K('nav-bar'),
  rv = {
    title: String,
    fixed: Boolean,
    zIndex: q,
    border: j,
    leftText: String,
    rightText: String,
    leftDisabled: Boolean,
    rightDisabled: Boolean,
    leftArrow: Boolean,
    placeholder: Boolean,
    safeAreaInsetTop: Boolean,
    clickable: j
  }
var gT = U({
  name: mT,
  props: rv,
  emits: ['clickLeft', 'clickRight'],
  setup(e, { emit: t, slots: n }) {
    const o = M(),
      a = Ml(o, Tn),
      i = u => {
        e.leftDisabled || t('clickLeft', u)
      },
      l = u => {
        e.rightDisabled || t('clickRight', u)
      },
      r = () =>
        n.left
          ? n.left()
          : [
              e.leftArrow && f(we, { class: Tn('arrow'), name: 'arrow-left' }, null),
              e.leftText && f('span', { class: Tn('text') }, [e.leftText])
            ],
      s = () => (n.right ? n.right() : f('span', { class: Tn('text') }, [e.rightText])),
      c = () => {
        const { title: u, fixed: d, border: h, zIndex: m } = e,
          y = Hn(m),
          p = e.leftArrow || e.leftText || n.left,
          b = e.rightText || n.right
        return f(
          'div',
          {
            ref: o,
            style: y,
            class: [Tn({ fixed: d }), { [zs]: h, 'van-safe-area-top': e.safeAreaInsetTop }]
          },
          [
            f('div', { class: Tn('content') }, [
              p &&
                f(
                  'div',
                  {
                    class: [
                      Tn('left', { disabled: e.leftDisabled }),
                      e.clickable && !e.leftDisabled ? bt : ''
                    ],
                    onClick: i
                  },
                  [r()]
                ),
              f('div', { class: [Tn('title'), 'van-ellipsis'] }, [n.title ? n.title() : u]),
              b &&
                f(
                  'div',
                  {
                    class: [
                      Tn('right', { disabled: e.rightDisabled }),
                      e.clickable && !e.rightDisabled ? bt : ''
                    ],
                    onClick: l
                  },
                  [s()]
                )
            ])
          ]
        )
      }
    return () => (e.fixed && e.placeholder ? a(c) : c())
  }
})
const sv = Z(gT),
  [vT, Sa] = K('notice-bar'),
  cv = {
    text: String,
    mode: String,
    color: String,
    delay: se(1),
    speed: se(60),
    leftIcon: String,
    wrapable: Boolean,
    background: String,
    scrollable: { type: Boolean, default: null }
  }
var bT = U({
  name: vT,
  props: cv,
  emits: ['close', 'replay'],
  setup(e, { emit: t, slots: n }) {
    let o = 0,
      a = 0,
      i
    const l = M(),
      r = M(),
      s = He({ show: !0, offset: 0, duration: 0 }),
      c = () => {
        if (n['left-icon']) return n['left-icon']()
        if (e.leftIcon) return f(we, { class: Sa('left-icon'), name: e.leftIcon }, null)
      },
      u = () => {
        if (e.mode === 'closeable') return 'cross'
        if (e.mode === 'link') return 'arrow'
      },
      d = b => {
        e.mode === 'closeable' && ((s.show = !1), t('close', b))
      },
      h = () => {
        if (n['right-icon']) return n['right-icon']()
        const b = u()
        if (b) return f(we, { name: b, class: Sa('right-icon'), onClick: d }, null)
      },
      m = () => {
        ;((s.offset = o),
          (s.duration = 0),
          vt(() => {
            to(() => {
              ;((s.offset = -a), (s.duration = (a + o) / +e.speed), t('replay'))
            })
          }))
      },
      y = () => {
        const b = e.scrollable === !1 && !e.wrapable,
          x = {
            transform: s.offset ? `translateX(${s.offset}px)` : '',
            transitionDuration: `${s.duration}s`
          }
        return f('div', { ref: l, role: 'marquee', class: Sa('wrap') }, [
          f(
            'div',
            { ref: r, style: x, class: [Sa('content'), { 'van-ellipsis': b }], onTransitionend: m },
            [n.default ? n.default() : e.text]
          )
        ])
      },
      p = () => {
        const { delay: b, speed: x, scrollable: g } = e,
          C = Ee(b) ? +b * 1e3 : 0
        ;((o = 0),
          (a = 0),
          (s.offset = 0),
          (s.duration = 0),
          clearTimeout(i),
          (i = setTimeout(() => {
            if (!l.value || !r.value || g === !1) return
            const S = Oe(l).width,
              v = Oe(r).width
            ;(g || v > S) &&
              to(() => {
                ;((o = S), (a = v), (s.offset = -a), (s.duration = a / +x))
              })
          }, C)))
      }
    return (
      Bl(p),
      ca(p),
      Xe('pageshow', p),
      Te({ reset: p }),
      te(() => [e.text, e.scrollable], p),
      () => {
        const { color: b, wrapable: x, background: g } = e
        return rt(
          f(
            'div',
            { role: 'alert', class: Sa({ wrapable: x }), style: { color: b, background: g } },
            [c(), y(), h()]
          ),
          [[ft, s.show]]
        )
      }
    )
  }
})
const uv = Z(bT),
  [yT, pT] = K('notify'),
  wT = ['lockScroll', 'position', 'show', 'teleport', 'zIndex'],
  dv = he({}, da, {
    type: J('danger'),
    color: String,
    message: q,
    position: J('top'),
    className: je,
    background: String,
    lockScroll: Boolean
  })
var xT = U({
  name: yT,
  props: dv,
  emits: ['update:show'],
  setup(e, { emit: t, slots: n }) {
    const o = a => t('update:show', a)
    return () =>
      f(
        zt,
        Ce(
          {
            class: [pT([e.type]), e.className],
            style: { color: e.color, background: e.background },
            overlay: !1,
            duration: 0.2,
            'onUpdate:show': o
          },
          Ie(e, wT)
        ),
        { default: () => [n.default ? n.default() : e.message] }
      )
  }
})
const fv = Z(xT),
  [ST, Ha] = K('key'),
  CT = f('svg', { class: Ha('collapse-icon'), viewBox: '0 0 30 24' }, [
    f(
      'path',
      {
        d: 'M26 13h-2v2h2v-2zm-8-3h2V8h-2v2zm2-4h2V4h-2v2zm2 4h4V4h-2v4h-2v2zm-7 14 3-3h-6l3 3zM6 13H4v2h2v-2zm16 0H8v2h14v-2zm-12-3h2V8h-2v2zM28 0l1 1 1 1v15l-1 2H1l-1-2V2l1-1 1-1zm0 2H2v15h26V2zM6 4v2H4V4zm10 2h2V4h-2v2zM8 9v1H4V8zm8 0v1h-2V8zm-6-5v2H8V4zm4 0v2h-2V4z',
        fill: 'currentColor'
      },
      null
    )
  ]),
  _T = f('svg', { class: Ha('delete-icon'), viewBox: '0 0 32 22' }, [
    f(
      'path',
      {
        d: 'M28 0a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H10.4a2 2 0 0 1-1.4-.6L1 13.1c-.6-.5-.9-1.3-.9-2 0-1 .3-1.7.9-2.2L9 .6a2 2 0 0 1 1.4-.6zm0 2H10.4l-8.2 8.3a1 1 0 0 0-.3.7c0 .3.1.5.3.7l8.2 8.4H28a2 2 0 0 0 2-2V4c0-1.1-.9-2-2-2zm-5 4a1 1 0 0 1 .7.3 1 1 0 0 1 0 1.4L20.4 11l3.3 3.3c.2.2.3.5.3.7 0 .3-.1.5-.3.7a1 1 0 0 1-.7.3 1 1 0 0 1-.7-.3L19 12.4l-3.4 3.3a1 1 0 0 1-.6.3 1 1 0 0 1-.7-.3 1 1 0 0 1-.3-.7c0-.2.1-.5.3-.7l3.3-3.3-3.3-3.3A1 1 0 0 1 14 7c0-.3.1-.5.3-.7A1 1 0 0 1 15 6a1 1 0 0 1 .6.3L19 9.6l3.3-3.3A1 1 0 0 1 23 6z',
        fill: 'currentColor'
      },
      null
    )
  ])
var Ar = U({
  name: ST,
  props: { type: String, text: q, color: String, wider: Boolean, large: Boolean, loading: Boolean },
  emits: ['press'],
  setup(e, { emit: t, slots: n }) {
    const o = M(!1),
      a = Ht(),
      i = c => {
        ;(a.start(c), (o.value = !0))
      },
      l = c => {
        ;(a.move(c), a.direction.value && (o.value = !1))
      },
      r = c => {
        o.value && (n.default || Fe(c), (o.value = !1), t('press', e.text, e.type))
      },
      s = () => {
        if (e.loading) return f(Ft, { class: Ha('loading-icon') }, null)
        const c = n.default ? n.default() : e.text
        switch (e.type) {
          case 'delete':
            return c || _T
          case 'extra':
            return c || CT
          default:
            return c
        }
      }
    return () =>
      f(
        'div',
        {
          class: Ha('wrapper', { wider: e.wider }),
          onTouchstartPassive: i,
          onTouchmovePassive: l,
          onTouchend: r,
          onTouchcancel: r
        },
        [
          f(
            'div',
            {
              role: 'button',
              tabindex: 0,
              class: Ha([e.color, { large: e.large, active: o.value, delete: e.type === 'delete' }])
            },
            [s()]
          )
        ]
      )
  }
})
const [TT, Yn] = K('number-keyboard'),
  hv = {
    show: Boolean,
    title: String,
    theme: J('default'),
    zIndex: q,
    teleport: [String, Object],
    maxlength: se(1 / 0),
    modelValue: J(''),
    transition: j,
    blurOnClose: j,
    showDeleteKey: j,
    randomKeyOrder: Boolean,
    closeButtonText: String,
    deleteButtonText: String,
    closeButtonLoading: Boolean,
    hideOnClickOutside: j,
    safeAreaInsetBottom: j,
    extraKey: { type: [String, Array], default: '' }
  }
function ET(e) {
  for (let t = e.length - 1; t > 0; t--) {
    const n = Math.floor(Math.random() * (t + 1)),
      o = e[t]
    ;((e[t] = e[n]), (e[n] = o))
  }
  return e
}
var kT = U({
  name: TT,
  inheritAttrs: !1,
  props: hv,
  emits: ['show', 'hide', 'blur', 'input', 'close', 'delete', 'update:modelValue'],
  setup(e, { emit: t, slots: n, attrs: o }) {
    const a = M(),
      i = () => {
        const b = Array(9)
          .fill('')
          .map((x, g) => ({ text: g + 1 }))
        return (e.randomKeyOrder && ET(b), b)
      },
      l = () => [
        ...i(),
        { text: e.extraKey, type: 'extra' },
        { text: 0 },
        { text: e.showDeleteKey ? e.deleteButtonText : '', type: e.showDeleteKey ? 'delete' : '' }
      ],
      r = () => {
        const b = i(),
          { extraKey: x } = e,
          g = Array.isArray(x) ? x : [x]
        return (
          g.length === 0
            ? b.push({ text: 0, wider: !0 })
            : g.length === 1
              ? b.push({ text: 0, wider: !0 }, { text: g[0], type: 'extra' })
              : g.length === 2 &&
                b.push({ text: g[0], type: 'extra' }, { text: 0 }, { text: g[1], type: 'extra' }),
          b
        )
      },
      s = B(() => (e.theme === 'custom' ? r() : l())),
      c = () => {
        e.show && t('blur')
      },
      u = () => {
        ;(t('close'), e.blurOnClose && c())
      },
      d = () => t(e.show ? 'show' : 'hide'),
      h = (b, x) => {
        if (b === '') {
          x === 'extra' && c()
          return
        }
        const g = e.modelValue
        x === 'delete'
          ? (t('delete'), t('update:modelValue', g.slice(0, g.length - 1)))
          : x === 'close'
            ? u()
            : g.length < +e.maxlength && (t('input', b), t('update:modelValue', g + b))
      },
      m = () => {
        const { title: b, theme: x, closeButtonText: g } = e,
          C = n['title-left'],
          S = g && x === 'default'
        if (b || S || C)
          return f('div', { class: Yn('header') }, [
            C && f('span', { class: Yn('title-left') }, [C()]),
            b && f('h2', { class: Yn('title') }, [b]),
            S && f('button', { type: 'button', class: [Yn('close'), bt], onClick: u }, [g])
          ])
      },
      y = () =>
        s.value.map(b => {
          const x = {}
          return (
            b.type === 'delete' && (x.default = n.delete),
            b.type === 'extra' && (x.default = n['extra-key']),
            f(
              Ar,
              {
                key: b.text,
                text: b.text,
                type: b.type,
                wider: b.wider,
                color: b.color,
                onPress: h
              },
              x
            )
          )
        }),
      p = () => {
        if (e.theme === 'custom')
          return f('div', { class: Yn('sidebar') }, [
            e.showDeleteKey &&
              f(
                Ar,
                { large: !0, text: e.deleteButtonText, type: 'delete', onPress: h },
                { default: n.delete }
              ),
            f(
              Ar,
              {
                large: !0,
                text: e.closeButtonText,
                type: 'close',
                color: 'blue',
                loading: e.closeButtonLoading,
                onPress: h
              },
              null
            )
          ])
      }
    return (
      te(
        () => e.show,
        b => {
          e.transition || t(b ? 'show' : 'hide')
        }
      ),
      e.hideOnClickOutside && Dl(a, c, { eventName: 'touchstart' }),
      () => {
        const b = m(),
          x = f(
            oi,
            { name: e.transition ? 'van-slide-up' : '' },
            {
              default: () => [
                rt(
                  f(
                    'div',
                    Ce(
                      {
                        ref: a,
                        style: Hn(e.zIndex),
                        class: Yn({ unfit: !e.safeAreaInsetBottom, 'with-title': !!b }),
                        onAnimationend: d,
                        onTouchstartPassive: Ns
                      },
                      o
                    ),
                    [
                      b,
                      f('div', { class: Yn('body') }, [f('div', { class: Yn('keys') }, [y()]), p()])
                    ]
                  ),
                  [[ft, e.show]]
                )
              ]
            }
          )
        return e.teleport ? f(Eo, { to: e.teleport }, { default: () => [x] }) : x
      }
    )
  }
})
const mv = Z(kT),
  [AT, Fo, dd] = K('pagination'),
  Pr = (e, t, n) => ({ number: e, text: t, active: n }),
  gv = {
    mode: J('multi'),
    prevText: String,
    nextText: String,
    pageCount: se(0),
    modelValue: Je(0),
    totalItems: se(0),
    showPageSize: se(5),
    itemsPerPage: se(10),
    forceEllipses: Boolean,
    showPrevButton: j,
    showNextButton: j
  }
var PT = U({
  name: AT,
  props: gv,
  emits: ['change', 'update:modelValue'],
  setup(e, { emit: t, slots: n }) {
    const o = B(() => {
        const { pageCount: u, totalItems: d, itemsPerPage: h } = e,
          m = +u || Math.ceil(+d / +h)
        return Math.max(1, m)
      }),
      a = B(() => {
        const u = [],
          d = o.value,
          h = +e.showPageSize,
          { modelValue: m, forceEllipses: y } = e
        let p = 1,
          b = d
        const x = h < d
        x &&
          ((p = Math.max(m - Math.floor(h / 2), 1)),
          (b = p + h - 1),
          b > d && ((b = d), (p = b - h + 1)))
        for (let g = p; g <= b; g++) {
          const C = Pr(g, g, g === m)
          u.push(C)
        }
        if (x && h > 0 && y) {
          if (p > 1) {
            const g = Pr(p - 1, '...')
            u.unshift(g)
          }
          if (b < d) {
            const g = Pr(b + 1, '...')
            u.push(g)
          }
        }
        return u
      }),
      i = (u, d) => {
        ;((u = it(u, 1, o.value)),
          e.modelValue !== u && (t('update:modelValue', u), d && t('change', u)))
      }
    ra(() => i(e.modelValue))
    const l = () =>
        f('li', { class: Fo('page-desc') }, [
          n.pageDesc ? n.pageDesc() : `${e.modelValue}/${o.value}`
        ]),
      r = () => {
        const { mode: u, modelValue: d, showPrevButton: h } = e
        if (!h) return
        const m = n['prev-text'],
          y = d === 1
        return f(
          'li',
          { class: [Fo('item', { disabled: y, border: u === 'simple', prev: !0 }), Na] },
          [
            f('button', { type: 'button', disabled: y, onClick: () => i(d - 1, !0) }, [
              m ? m() : e.prevText || dd('prev')
            ])
          ]
        )
      },
      s = () => {
        const { mode: u, modelValue: d, showNextButton: h } = e
        if (!h) return
        const m = n['next-text'],
          y = d === o.value
        return f(
          'li',
          { class: [Fo('item', { disabled: y, border: u === 'simple', next: !0 }), Na] },
          [
            f('button', { type: 'button', disabled: y, onClick: () => i(d + 1, !0) }, [
              m ? m() : e.nextText || dd('next')
            ])
          ]
        )
      },
      c = () =>
        a.value.map(u =>
          f('li', { class: [Fo('item', { active: u.active, page: !0 }), Na] }, [
            f(
              'button',
              {
                type: 'button',
                'aria-current': u.active || void 0,
                onClick: () => i(u.number, !0)
              },
              [n.page ? n.page(u) : u.text]
            )
          ])
        )
    return () =>
      f('nav', { role: 'navigation', class: Fo() }, [
        f('ul', { class: Fo('items') }, [r(), e.mode === 'simple' ? l() : c(), s()])
      ])
  }
})
const vv = Z(PT),
  [IT, Ca] = K('password-input'),
  bv = {
    info: String,
    mask: j,
    value: J(''),
    gutter: q,
    length: se(6),
    focused: Boolean,
    errorInfo: String
  }
var OT = U({
  name: IT,
  props: bv,
  emits: ['focus'],
  setup(e, { emit: t }) {
    const n = a => {
        ;(a.stopPropagation(), t('focus', a))
      },
      o = () => {
        const a = [],
          { mask: i, value: l, gutter: r, focused: s } = e,
          c = +e.length
        for (let u = 0; u < c; u++) {
          const d = l[u],
            h = u !== 0 && !r,
            m = s && u === l.length
          let y
          ;(u !== 0 && r && (y = { marginLeft: pe(r) }),
            a.push(
              f('li', { class: [{ [bh]: h }, Ca('item', { focus: m })], style: y }, [
                i ? f('i', { style: { visibility: d ? 'visible' : 'hidden' } }, null) : d,
                m && f('div', { class: Ca('cursor') }, null)
              ])
            ))
        }
        return a
      }
    return () => {
      const a = e.errorInfo || e.info
      return f('div', { class: Ca() }, [
        f('ul', { class: [Ca('security'), { [Na]: !e.gutter }], onTouchstartPassive: n }, [o()]),
        a && f('div', { class: Ca(e.errorInfo ? 'error-info' : 'info') }, [a])
      ])
    }
  }
})
const yv = Z(OT),
  pv = Z(SS)
function tn(e) {
  if (e == null) return window
  if (e.toString() !== '[object Window]') {
    var t = e.ownerDocument
    return (t && t.defaultView) || window
  }
  return e
}
function lc(e) {
  var t = tn(e).Element
  return e instanceof t || e instanceof Element
}
function Xt(e) {
  var t = tn(e).HTMLElement
  return e instanceof t || e instanceof HTMLElement
}
function wv(e) {
  if (typeof ShadowRoot > 'u') return !1
  var t = tn(e).ShadowRoot
  return e instanceof t || e instanceof ShadowRoot
}
var ia = Math.round
function gs() {
  var e = navigator.userAgentData
  return e != null && e.brands
    ? e.brands
        .map(function (t) {
          return t.brand + '/' + t.version
        })
        .join(' ')
    : navigator.userAgent
}
function RT() {
  return !/^((?!chrome|android).)*safari/i.test(gs())
}
function cl(e, t, n) {
  ;(t === void 0 && (t = !1), n === void 0 && (n = !1))
  var o = e.getBoundingClientRect(),
    a = 1,
    i = 1
  t &&
    Xt(e) &&
    ((a = (e.offsetWidth > 0 && ia(o.width) / e.offsetWidth) || 1),
    (i = (e.offsetHeight > 0 && ia(o.height) / e.offsetHeight) || 1))
  var l = lc(e) ? tn(e) : window,
    r = l.visualViewport,
    s = !RT() && n,
    c = (o.left + (s && r ? r.offsetLeft : 0)) / a,
    u = (o.top + (s && r ? r.offsetTop : 0)) / i,
    d = o.width / a,
    h = o.height / i
  return { width: d, height: h, top: u, right: c + d, bottom: u + h, left: c, x: c, y: u }
}
function xv(e) {
  var t = tn(e),
    n = t.pageXOffset,
    o = t.pageYOffset
  return { scrollLeft: n, scrollTop: o }
}
function DT(e) {
  return { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop }
}
function $T(e) {
  return e === tn(e) || !Xt(e) ? xv(e) : DT(e)
}
function Mn(e) {
  return e ? (e.nodeName || '').toLowerCase() : null
}
function Yl(e) {
  return ((lc(e) ? e.ownerDocument : e.document) || window.document).documentElement
}
function BT(e) {
  return cl(Yl(e)).left + xv(e).scrollLeft
}
function Vn(e) {
  return tn(e).getComputedStyle(e)
}
function rc(e) {
  var t = Vn(e),
    n = t.overflow,
    o = t.overflowX,
    a = t.overflowY
  return /auto|scroll|overlay|hidden/.test(n + a + o)
}
function MT(e) {
  var t = e.getBoundingClientRect(),
    n = ia(t.width) / e.offsetWidth || 1,
    o = ia(t.height) / e.offsetHeight || 1
  return n !== 1 || o !== 1
}
function VT(e, t, n) {
  n === void 0 && (n = !1)
  var o = Xt(t),
    a = Xt(t) && MT(t),
    i = Yl(t),
    l = cl(e, a, n),
    r = { scrollLeft: 0, scrollTop: 0 },
    s = { x: 0, y: 0 }
  return (
    (o || (!o && !n)) &&
      ((Mn(t) !== 'body' || rc(i)) && (r = $T(t)),
      Xt(t) ? ((s = cl(t, !0)), (s.x += t.clientLeft), (s.y += t.clientTop)) : i && (s.x = BT(i))),
    {
      x: l.left + r.scrollLeft - s.x,
      y: l.top + r.scrollTop - s.y,
      width: l.width,
      height: l.height
    }
  )
}
function LT(e) {
  var t = cl(e),
    n = e.offsetWidth,
    o = e.offsetHeight
  return (
    Math.abs(t.width - n) <= 1 && (n = t.width),
    Math.abs(t.height - o) <= 1 && (o = t.height),
    { x: e.offsetLeft, y: e.offsetTop, width: n, height: o }
  )
}
function sc(e) {
  return Mn(e) === 'html' ? e : e.assignedSlot || e.parentNode || (wv(e) ? e.host : null) || Yl(e)
}
function Sv(e) {
  return ['html', 'body', '#document'].indexOf(Mn(e)) >= 0
    ? e.ownerDocument.body
    : Xt(e) && rc(e)
      ? e
      : Sv(sc(e))
}
function Ni(e, t) {
  var n
  t === void 0 && (t = [])
  var o = Sv(e),
    a = o === ((n = e.ownerDocument) == null ? void 0 : n.body),
    i = tn(o),
    l = a ? [i].concat(i.visualViewport || [], rc(o) ? o : []) : o,
    r = t.concat(l)
  return a ? r : r.concat(Ni(sc(l)))
}
function NT(e) {
  return ['table', 'td', 'th'].indexOf(Mn(e)) >= 0
}
function fd(e) {
  return !Xt(e) || Vn(e).position === 'fixed' ? null : e.offsetParent
}
function FT(e) {
  var t = /firefox/i.test(gs()),
    n = /Trident/i.test(gs())
  if (n && Xt(e)) {
    var o = Vn(e)
    if (o.position === 'fixed') return null
  }
  var a = sc(e)
  for (wv(a) && (a = a.host); Xt(a) && ['html', 'body'].indexOf(Mn(a)) < 0;) {
    var i = Vn(a)
    if (
      i.transform !== 'none' ||
      i.perspective !== 'none' ||
      i.contain === 'paint' ||
      ['transform', 'perspective'].indexOf(i.willChange) !== -1 ||
      (t && i.willChange === 'filter') ||
      (t && i.filter && i.filter !== 'none')
    )
      return a
    a = a.parentNode
  }
  return null
}
function Cv(e) {
  for (var t = tn(e), n = fd(e); n && NT(n) && Vn(n).position === 'static';) n = fd(n)
  return n && (Mn(n) === 'html' || (Mn(n) === 'body' && Vn(n).position === 'static'))
    ? t
    : n || FT(e) || t
}
var Zo = 'top',
  ul = 'bottom',
  Ja = 'right',
  Co = 'left',
  _v = 'auto',
  HT = [Zo, ul, Ja, Co],
  Tv = 'start',
  dl = 'end',
  zT = [].concat(HT, [_v]).reduce(function (e, t) {
    return e.concat([t, t + '-' + Tv, t + '-' + dl])
  }, []),
  jT = 'beforeRead',
  WT = 'read',
  UT = 'afterRead',
  KT = 'beforeMain',
  YT = 'main',
  GT = 'afterMain',
  qT = 'beforeWrite',
  XT = 'write',
  ZT = 'afterWrite',
  vs = [jT, WT, UT, KT, YT, GT, qT, XT, ZT]
function JT(e) {
  var t = new Map(),
    n = new Set(),
    o = []
  e.forEach(function (i) {
    t.set(i.name, i)
  })
  function a(i) {
    n.add(i.name)
    var l = [].concat(i.requires || [], i.requiresIfExists || [])
    ;(l.forEach(function (r) {
      if (!n.has(r)) {
        var s = t.get(r)
        s && a(s)
      }
    }),
      o.push(i))
  }
  return (
    e.forEach(function (i) {
      n.has(i.name) || a(i)
    }),
    o
  )
}
function QT(e) {
  var t = JT(e)
  return vs.reduce(function (n, o) {
    return n.concat(
      t.filter(function (a) {
        return a.phase === o
      })
    )
  }, [])
}
function e1(e) {
  var t
  return function () {
    return (
      t ||
        (t = new Promise(function (n) {
          Promise.resolve().then(function () {
            ;((t = void 0), n(e()))
          })
        })),
      t
    )
  }
}
function Gn(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), o = 1; o < t; o++)
    n[o - 1] = arguments[o]
  return [].concat(n).reduce(function (a, i) {
    return a.replace(/%s/, i)
  }, e)
}
var ho = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s',
  t1 = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available',
  hd = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options']
function n1(e) {
  e.forEach(function (t) {
    ;[]
      .concat(Object.keys(t), hd)
      .filter(function (n, o, a) {
        return a.indexOf(n) === o
      })
      .forEach(function (n) {
        switch (n) {
          case 'name':
            typeof t.name != 'string' &&
              console.error(
                Gn(ho, String(t.name), '"name"', '"string"', '"' + String(t.name) + '"')
              )
            break
          case 'enabled':
            typeof t.enabled != 'boolean' &&
              console.error(Gn(ho, t.name, '"enabled"', '"boolean"', '"' + String(t.enabled) + '"'))
            break
          case 'phase':
            vs.indexOf(t.phase) < 0 &&
              console.error(
                Gn(ho, t.name, '"phase"', 'either ' + vs.join(', '), '"' + String(t.phase) + '"')
              )
            break
          case 'fn':
            typeof t.fn != 'function' &&
              console.error(Gn(ho, t.name, '"fn"', '"function"', '"' + String(t.fn) + '"'))
            break
          case 'effect':
            t.effect != null &&
              typeof t.effect != 'function' &&
              console.error(Gn(ho, t.name, '"effect"', '"function"', '"' + String(t.fn) + '"'))
            break
          case 'requires':
            t.requires != null &&
              !Array.isArray(t.requires) &&
              console.error(Gn(ho, t.name, '"requires"', '"array"', '"' + String(t.requires) + '"'))
            break
          case 'requiresIfExists':
            Array.isArray(t.requiresIfExists) ||
              console.error(
                Gn(
                  ho,
                  t.name,
                  '"requiresIfExists"',
                  '"array"',
                  '"' + String(t.requiresIfExists) + '"'
                )
              )
            break
          case 'options':
          case 'data':
            break
          default:
            console.error(
              'PopperJS: an invalid property has been provided to the "' +
                t.name +
                '" modifier, valid properties are ' +
                hd
                  .map(function (o) {
                    return '"' + o + '"'
                  })
                  .join(', ') +
                '; but "' +
                n +
                '" was provided.'
            )
        }
        t.requires &&
          t.requires.forEach(function (o) {
            e.find(function (a) {
              return a.name === o
            }) == null && console.error(Gn(t1, String(t.name), o, o))
          })
      })
  })
}
function o1(e, t) {
  var n = new Set()
  return e.filter(function (o) {
    var a = t(o)
    if (!n.has(a)) return (n.add(a), !0)
  })
}
function Gl(e) {
  return e.split('-')[0]
}
function a1(e) {
  var t = e.reduce(function (n, o) {
    var a = n[o.name]
    return (
      (n[o.name] = a
        ? Object.assign({}, a, o, {
            options: Object.assign({}, a.options, o.options),
            data: Object.assign({}, a.data, o.data)
          })
        : o),
      n
    )
  }, {})
  return Object.keys(t).map(function (n) {
    return t[n]
  })
}
function Ev(e) {
  return e.split('-')[1]
}
function i1(e) {
  return ['top', 'bottom'].indexOf(e) >= 0 ? 'x' : 'y'
}
function l1(e) {
  var t = e.reference,
    n = e.element,
    o = e.placement,
    a = o ? Gl(o) : null,
    i = o ? Ev(o) : null,
    l = t.x + t.width / 2 - n.width / 2,
    r = t.y + t.height / 2 - n.height / 2,
    s
  switch (a) {
    case Zo:
      s = { x: l, y: t.y - n.height }
      break
    case ul:
      s = { x: l, y: t.y + t.height }
      break
    case Ja:
      s = { x: t.x + t.width, y: r }
      break
    case Co:
      s = { x: t.x - n.width, y: r }
      break
    default:
      s = { x: t.x, y: t.y }
  }
  var c = a ? i1(a) : null
  if (c != null) {
    var u = c === 'y' ? 'height' : 'width'
    switch (i) {
      case Tv:
        s[c] = s[c] - (t[u] / 2 - n[u] / 2)
        break
      case dl:
        s[c] = s[c] + (t[u] / 2 - n[u] / 2)
        break
    }
  }
  return s
}
var md =
    'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.',
  r1 =
    'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.',
  gd = { placement: 'bottom', modifiers: [], strategy: 'absolute' }
function vd() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n]
  return !t.some(function (o) {
    return !(o && typeof o.getBoundingClientRect == 'function')
  })
}
function s1(e) {
  e === void 0 && (e = {})
  var t = e,
    n = t.defaultModifiers,
    o = n === void 0 ? [] : n,
    a = t.defaultOptions,
    i = a === void 0 ? gd : a
  return function (r, s, c) {
    c === void 0 && (c = i)
    var u = {
        placement: 'bottom',
        orderedModifiers: [],
        options: Object.assign({}, gd, i),
        modifiersData: {},
        elements: { reference: r, popper: s },
        attributes: {},
        styles: {}
      },
      d = [],
      h = !1,
      m = {
        state: u,
        setOptions: function (x) {
          var g = typeof x == 'function' ? x(u.options) : x
          ;(p(),
            (u.options = Object.assign({}, i, u.options, g)),
            (u.scrollParents = {
              reference: lc(r) ? Ni(r) : r.contextElement ? Ni(r.contextElement) : [],
              popper: Ni(s)
            }))
          var C = QT(a1([].concat(o, u.options.modifiers)))
          u.orderedModifiers = C.filter(function (I) {
            return I.enabled
          })
          {
            var S = o1([].concat(C, u.options.modifiers), function (I) {
              var T = I.name
              return T
            })
            if ((n1(S), Gl(u.options.placement) === _v)) {
              var v = u.orderedModifiers.find(function (I) {
                var T = I.name
                return T === 'flip'
              })
              v ||
                console.error(
                  [
                    'Popper: "auto" placements require the "flip" modifier be',
                    'present and enabled to work.'
                  ].join(' ')
                )
            }
            var _ = Vn(s),
              P = _.marginTop,
              w = _.marginRight,
              A = _.marginBottom,
              O = _.marginLeft
            ;[P, w, A, O].some(function (I) {
              return parseFloat(I)
            }) &&
              console.warn(
                [
                  'Popper: CSS "margin" styles cannot be used to apply padding',
                  'between the popper and its reference element or boundary.',
                  'To replicate margin, use the `offset` modifier, as well as',
                  'the `padding` option in the `preventOverflow` and `flip`',
                  'modifiers.'
                ].join(' ')
              )
          }
          return (y(), m.update())
        },
        forceUpdate: function () {
          if (!h) {
            var x = u.elements,
              g = x.reference,
              C = x.popper
            if (!vd(g, C)) {
              console.error(md)
              return
            }
            ;((u.rects = {
              reference: VT(g, Cv(C), u.options.strategy === 'fixed'),
              popper: LT(C)
            }),
              (u.reset = !1),
              (u.placement = u.options.placement),
              u.orderedModifiers.forEach(function (I) {
                return (u.modifiersData[I.name] = Object.assign({}, I.data))
              }))
            for (var S = 0, v = 0; v < u.orderedModifiers.length; v++) {
              if (((S += 1), S > 100)) {
                console.error(r1)
                break
              }
              if (u.reset === !0) {
                ;((u.reset = !1), (v = -1))
                continue
              }
              var _ = u.orderedModifiers[v],
                P = _.fn,
                w = _.options,
                A = w === void 0 ? {} : w,
                O = _.name
              typeof P == 'function' && (u = P({ state: u, options: A, name: O, instance: m }) || u)
            }
          }
        },
        update: e1(function () {
          return new Promise(function (b) {
            ;(m.forceUpdate(), b(u))
          })
        }),
        destroy: function () {
          ;(p(), (h = !0))
        }
      }
    if (!vd(r, s)) return (console.error(md), m)
    m.setOptions(c).then(function (b) {
      !h && c.onFirstUpdate && c.onFirstUpdate(b)
    })
    function y() {
      u.orderedModifiers.forEach(function (b) {
        var x = b.name,
          g = b.options,
          C = g === void 0 ? {} : g,
          S = b.effect
        if (typeof S == 'function') {
          var v = S({ state: u, name: x, instance: m, options: C }),
            _ = function () {}
          d.push(v || _)
        }
      })
    }
    function p() {
      ;(d.forEach(function (b) {
        return b()
      }),
        (d = []))
    }
    return m
  }
}
var Ii = { passive: !0 }
function c1(e) {
  var t = e.state,
    n = e.instance,
    o = e.options,
    a = o.scroll,
    i = a === void 0 ? !0 : a,
    l = o.resize,
    r = l === void 0 ? !0 : l,
    s = tn(t.elements.popper),
    c = [].concat(t.scrollParents.reference, t.scrollParents.popper)
  return (
    i &&
      c.forEach(function (u) {
        u.addEventListener('scroll', n.update, Ii)
      }),
    r && s.addEventListener('resize', n.update, Ii),
    function () {
      ;(i &&
        c.forEach(function (u) {
          u.removeEventListener('scroll', n.update, Ii)
        }),
        r && s.removeEventListener('resize', n.update, Ii))
    }
  )
}
var u1 = {
  name: 'eventListeners',
  enabled: !0,
  phase: 'write',
  fn: function () {},
  effect: c1,
  data: {}
}
function d1(e) {
  var t = e.state,
    n = e.name
  t.modifiersData[n] = l1({
    reference: t.rects.reference,
    element: t.rects.popper,
    placement: t.placement
  })
}
var f1 = { name: 'popperOffsets', enabled: !0, phase: 'read', fn: d1, data: {} },
  h1 = { top: 'auto', right: 'auto', bottom: 'auto', left: 'auto' }
function m1(e) {
  var t = e.x,
    n = e.y,
    o = window,
    a = o.devicePixelRatio || 1
  return { x: ia(t * a) / a || 0, y: ia(n * a) / a || 0 }
}
function bd(e) {
  var t,
    n = e.popper,
    o = e.popperRect,
    a = e.placement,
    i = e.variation,
    l = e.offsets,
    r = e.position,
    s = e.gpuAcceleration,
    c = e.adaptive,
    u = e.roundOffsets,
    d = e.isFixed,
    h = l.x,
    m = h === void 0 ? 0 : h,
    y = l.y,
    p = y === void 0 ? 0 : y,
    b = typeof u == 'function' ? u({ x: m, y: p }) : { x: m, y: p }
  ;((m = b.x), (p = b.y))
  var x = l.hasOwnProperty('x'),
    g = l.hasOwnProperty('y'),
    C = Co,
    S = Zo,
    v = window
  if (c) {
    var _ = Cv(n),
      P = 'clientHeight',
      w = 'clientWidth'
    if (
      (_ === tn(n) &&
        ((_ = Yl(n)),
        Vn(_).position !== 'static' &&
          r === 'absolute' &&
          ((P = 'scrollHeight'), (w = 'scrollWidth'))),
      (_ = _),
      a === Zo || ((a === Co || a === Ja) && i === dl))
    ) {
      S = ul
      var A = d && _ === v && v.visualViewport ? v.visualViewport.height : _[P]
      ;((p -= A - o.height), (p *= s ? 1 : -1))
    }
    if (a === Co || ((a === Zo || a === ul) && i === dl)) {
      C = Ja
      var O = d && _ === v && v.visualViewport ? v.visualViewport.width : _[w]
      ;((m -= O - o.width), (m *= s ? 1 : -1))
    }
  }
  var I = Object.assign({ position: r }, c && h1),
    T = u === !0 ? m1({ x: m, y: p }) : { x: m, y: p }
  if (((m = T.x), (p = T.y), s)) {
    var D
    return Object.assign(
      {},
      I,
      ((D = {}),
      (D[S] = g ? '0' : ''),
      (D[C] = x ? '0' : ''),
      (D.transform =
        (v.devicePixelRatio || 1) <= 1
          ? 'translate(' + m + 'px, ' + p + 'px)'
          : 'translate3d(' + m + 'px, ' + p + 'px, 0)'),
      D)
    )
  }
  return Object.assign(
    {},
    I,
    ((t = {}), (t[S] = g ? p + 'px' : ''), (t[C] = x ? m + 'px' : ''), (t.transform = ''), t)
  )
}
function g1(e) {
  var t = e.state,
    n = e.options,
    o = n.gpuAcceleration,
    a = o === void 0 ? !0 : o,
    i = n.adaptive,
    l = i === void 0 ? !0 : i,
    r = n.roundOffsets,
    s = r === void 0 ? !0 : r
  {
    var c = Vn(t.elements.popper).transitionProperty || ''
    l &&
      ['transform', 'top', 'right', 'bottom', 'left'].some(function (d) {
        return c.indexOf(d) >= 0
      }) &&
      console.warn(
        [
          'Popper: Detected CSS transitions on at least one of the following',
          'CSS properties: "transform", "top", "right", "bottom", "left".',
          `

`,
          'Disable the "computeStyles" modifier\'s `adaptive` option to allow',
          'for smooth transitions, or remove these properties from the CSS',
          'transition declaration on the popper element if only transitioning',
          'opacity or background-color for example.',
          `

`,
          'We recommend using the popper element as a wrapper around an inner',
          'element that can have any CSS property transitioned for animations.'
        ].join(' ')
      )
  }
  var u = {
    placement: Gl(t.placement),
    variation: Ev(t.placement),
    popper: t.elements.popper,
    popperRect: t.rects.popper,
    gpuAcceleration: a,
    isFixed: t.options.strategy === 'fixed'
  }
  ;(t.modifiersData.popperOffsets != null &&
    (t.styles.popper = Object.assign(
      {},
      t.styles.popper,
      bd(
        Object.assign({}, u, {
          offsets: t.modifiersData.popperOffsets,
          position: t.options.strategy,
          adaptive: l,
          roundOffsets: s
        })
      )
    )),
    t.modifiersData.arrow != null &&
      (t.styles.arrow = Object.assign(
        {},
        t.styles.arrow,
        bd(
          Object.assign({}, u, {
            offsets: t.modifiersData.arrow,
            position: 'absolute',
            adaptive: !1,
            roundOffsets: s
          })
        )
      )),
    (t.attributes.popper = Object.assign({}, t.attributes.popper, {
      'data-popper-placement': t.placement
    })))
}
var v1 = { name: 'computeStyles', enabled: !0, phase: 'beforeWrite', fn: g1, data: {} }
function b1(e) {
  var t = e.state
  Object.keys(t.elements).forEach(function (n) {
    var o = t.styles[n] || {},
      a = t.attributes[n] || {},
      i = t.elements[n]
    !Xt(i) ||
      !Mn(i) ||
      (Object.assign(i.style, o),
      Object.keys(a).forEach(function (l) {
        var r = a[l]
        r === !1 ? i.removeAttribute(l) : i.setAttribute(l, r === !0 ? '' : r)
      }))
  })
}
function y1(e) {
  var t = e.state,
    n = {
      popper: { position: t.options.strategy, left: '0', top: '0', margin: '0' },
      arrow: { position: 'absolute' },
      reference: {}
    }
  return (
    Object.assign(t.elements.popper.style, n.popper),
    (t.styles = n),
    t.elements.arrow && Object.assign(t.elements.arrow.style, n.arrow),
    function () {
      Object.keys(t.elements).forEach(function (o) {
        var a = t.elements[o],
          i = t.attributes[o] || {},
          l = Object.keys(t.styles.hasOwnProperty(o) ? t.styles[o] : n[o]),
          r = l.reduce(function (s, c) {
            return ((s[c] = ''), s)
          }, {})
        !Xt(a) ||
          !Mn(a) ||
          (Object.assign(a.style, r),
          Object.keys(i).forEach(function (s) {
            a.removeAttribute(s)
          }))
      })
    }
  )
}
var p1 = {
    name: 'applyStyles',
    enabled: !0,
    phase: 'write',
    fn: b1,
    effect: y1,
    requires: ['computeStyles']
  },
  w1 = [u1, f1, v1, p1],
  x1 = s1({ defaultModifiers: w1 })
function S1(e, t, n) {
  var o = Gl(e),
    a = [Co, Zo].indexOf(o) >= 0 ? -1 : 1,
    i = typeof n == 'function' ? n(Object.assign({}, t, { placement: e })) : n,
    l = i[0],
    r = i[1]
  return (
    (l = l || 0),
    (r = (r || 0) * a),
    [Co, Ja].indexOf(o) >= 0 ? { x: r, y: l } : { x: l, y: r }
  )
}
function C1(e) {
  var t = e.state,
    n = e.options,
    o = e.name,
    a = n.offset,
    i = a === void 0 ? [0, 0] : a,
    l = zT.reduce(function (u, d) {
      return ((u[d] = S1(d, t.rects, i)), u)
    }, {}),
    r = l[t.placement],
    s = r.x,
    c = r.y
  ;(t.modifiersData.popperOffsets != null &&
    ((t.modifiersData.popperOffsets.x += s), (t.modifiersData.popperOffsets.y += c)),
    (t.modifiersData[o] = l))
}
var _1 = { name: 'offset', enabled: !0, phase: 'main', requires: ['popperOffsets'], fn: C1 }
const [T1, mo] = K('popover'),
  E1 = ['overlay', 'duration', 'teleport', 'overlayStyle', 'overlayClass', 'closeOnClickOverlay'],
  kv = {
    show: Boolean,
    theme: J('light'),
    overlay: Boolean,
    actions: ze(),
    actionsDirection: J('vertical'),
    trigger: J('click'),
    duration: q,
    showArrow: j,
    placement: J('bottom'),
    iconPrefix: String,
    overlayClass: je,
    overlayStyle: Object,
    closeOnClickAction: j,
    closeOnClickOverlay: j,
    closeOnClickOutside: j,
    offset: { type: Array, default: () => [0, 8] },
    teleport: { type: [String, Object], default: 'body' }
  }
var k1 = U({
  name: T1,
  props: kv,
  emits: ['select', 'touchstart', 'update:show'],
  setup(e, { emit: t, slots: n, attrs: o }) {
    let a
    const i = M(),
      l = M(),
      r = M(),
      s = Gs(
        () => e.show,
        g => t('update:show', g)
      ),
      c = () => ({
        placement: e.placement,
        modifiers: [
          { name: 'computeStyles', options: { adaptive: !1, gpuAcceleration: !1 } },
          he({}, _1, { options: { offset: e.offset } })
        ]
      }),
      u = () => (l.value && r.value ? x1(l.value, r.value.popupRef.value, c()) : null),
      d = () => {
        Se(() => {
          s.value &&
            (a
              ? a.setOptions(c())
              : ((a = u()),
                Ot &&
                  (window.addEventListener('animationend', d),
                  window.addEventListener('transitionend', d))))
        })
      },
      h = g => {
        s.value = g
      },
      m = () => {
        e.trigger === 'click' && (s.value = !s.value)
      },
      y = (g, C) => {
        g.disabled || (t('select', g, C), e.closeOnClickAction && (s.value = !1))
      },
      p = () => {
        s.value && e.closeOnClickOutside && (!e.overlay || e.closeOnClickOverlay) && (s.value = !1)
      },
      b = (g, C) =>
        n.action
          ? n.action({ action: g, index: C })
          : [
              g.icon &&
                f(we, { name: g.icon, classPrefix: e.iconPrefix, class: mo('action-icon') }, null),
              f(
                'div',
                { class: [mo('action-text'), { [zs]: e.actionsDirection === 'vertical' }] },
                [g.text]
              )
            ],
      x = (g, C) => {
        const { icon: S, color: v, disabled: _, className: P } = g
        return f(
          'div',
          {
            role: 'menuitem',
            class: [
              mo('action', { disabled: _, 'with-icon': S }),
              { [gx]: e.actionsDirection === 'horizontal' },
              P
            ],
            style: { color: v },
            tabindex: _ ? void 0 : 0,
            'aria-disabled': _ || void 0,
            onClick: () => y(g, C)
          },
          [b(g, C)]
        )
      }
    return (
      We(() => {
        ;(d(),
          ra(() => {
            var g
            i.value = (g = r.value) == null ? void 0 : g.popupRef.value
          }))
      }),
      en(() => {
        a &&
          (Ot &&
            (window.removeEventListener('animationend', d),
            window.removeEventListener('transitionend', d)),
          a.destroy(),
          (a = null))
      }),
      te(() => [s.value, e.offset, e.placement], d),
      Dl([l, i], p, { eventName: 'touchstart' }),
      () => {
        var g
        return f(qe, null, [
          f('span', { ref: l, class: mo('wrapper'), onClick: m }, [
            (g = n.reference) == null ? void 0 : g.call(n)
          ]),
          f(
            zt,
            Ce(
              {
                ref: r,
                show: s.value,
                class: mo([e.theme]),
                position: '',
                transition: 'van-popover-zoom',
                lockScroll: !1,
                'onUpdate:show': h
              },
              o,
              ll(),
              Ie(e, E1)
            ),
            {
              default: () => [
                e.showArrow && f('div', { class: mo('arrow') }, null),
                f('div', { role: 'menu', class: mo('content', e.actionsDirection) }, [
                  n.default ? n.default() : e.actions.map(x)
                ])
              ]
            }
          )
        ])
      }
    )
  }
})
const Av = Z(k1),
  [A1, Ir] = K('progress'),
  Pv = {
    color: String,
    inactive: Boolean,
    pivotText: String,
    textColor: String,
    showPivot: j,
    pivotColor: String,
    trackColor: String,
    strokeWidth: q,
    percentage: { type: q, default: 0, validator: e => +e >= 0 && +e <= 100 }
  }
var P1 = U({
  name: A1,
  props: Pv,
  setup(e, { slots: t }) {
    const n = B(() => (e.inactive ? void 0 : e.color)),
      o = i => Math.min(Math.max(+i, 0), 100),
      a = () => {
        const { textColor: i, pivotText: l, pivotColor: r, percentage: s } = e,
          c = o(s),
          u = l ?? `${c}%`
        if (e.showPivot && (t.pivot || u)) {
          const d = {
            color: i,
            left: `${c}%`,
            transform: `translate(-${c}%,-50%)`,
            background: r || n.value
          }
          return f('span', { style: d, class: Ir('pivot', { inactive: e.inactive }) }, [
            t.pivot ? t.pivot({ percentage: c }) : u
          ])
        }
      }
    return () => {
      const { trackColor: i, percentage: l, strokeWidth: r } = e,
        s = o(l),
        c = { background: i, height: pe(r) },
        u = { width: `${s}%`, background: n.value }
      return f('div', { class: Ir(), style: c }, [
        f('span', { class: Ir('portion', { inactive: e.inactive }), style: u }, null),
        a()
      ])
    }
  }
})
const Iv = Z(P1),
  [I1, _a, O1] = K('pull-refresh'),
  Ov = 50,
  R1 = ['pulling', 'loosing', 'success'],
  Rv = {
    disabled: Boolean,
    modelValue: Boolean,
    headHeight: se(Ov),
    successText: String,
    pullingText: String,
    loosingText: String,
    loadingText: String,
    pullDistance: q,
    successDuration: se(500),
    animationDuration: se(300)
  }
var D1 = U({
  name: I1,
  props: Rv,
  emits: ['change', 'refresh', 'update:modelValue'],
  setup(e, { emit: t, slots: n }) {
    let o
    const a = M(),
      i = M(),
      l = ua(a),
      r = He({ status: 'normal', distance: 0, duration: 0 }),
      s = Ht(),
      c = () => {
        if (e.headHeight !== Ov) return { height: `${e.headHeight}px` }
      },
      u = () => r.status !== 'loading' && r.status !== 'success' && !e.disabled,
      d = S => {
        const v = +(e.pullDistance || e.headHeight)
        return (
          S > v && (S < v * 2 ? (S = v + (S - v) / 2) : (S = v * 1.5 + (S - v * 2) / 4)),
          Math.round(S)
        )
      },
      h = (S, v) => {
        const _ = +(e.pullDistance || e.headHeight)
        ;((r.distance = S),
          v
            ? (r.status = 'loading')
            : S === 0
              ? (r.status = 'normal')
              : S < _
                ? (r.status = 'pulling')
                : (r.status = 'loosing'),
          t('change', { status: r.status, distance: S }))
      },
      m = () => {
        const { status: S } = r
        return S === 'normal' ? '' : e[`${S}Text`] || O1(S)
      },
      y = () => {
        const { status: S, distance: v } = r
        if (n[S]) return n[S]({ distance: v })
        const _ = []
        return (
          R1.includes(S) && _.push(f('div', { class: _a('text') }, [m()])),
          S === 'loading' && _.push(f(Ft, { class: _a('loading') }, { default: m })),
          _
        )
      },
      p = () => {
        ;((r.status = 'success'),
          setTimeout(() => {
            h(0)
          }, +e.successDuration))
      },
      b = S => {
        ;((o = Bn(l.value) === 0), o && ((r.duration = 0), s.start(S)))
      },
      x = S => {
        u() && b(S)
      },
      g = S => {
        if (u()) {
          o || b(S)
          const { deltaY: v } = s
          ;(s.move(S), o && v.value >= 0 && s.isVertical() && (Fe(S), h(d(v.value))))
        }
      },
      C = () => {
        o &&
          s.deltaY.value &&
          u() &&
          ((r.duration = +e.animationDuration),
          r.status === 'loosing'
            ? (h(+e.headHeight, !0), t('update:modelValue', !0), Se(() => t('refresh')))
            : h(0))
      }
    return (
      te(
        () => e.modelValue,
        S => {
          ;((r.duration = +e.animationDuration),
            S ? h(+e.headHeight, !0) : n.success || e.successText ? p() : h(0, !1))
        }
      ),
      Xe('touchmove', g, { target: i }),
      () => {
        var S
        const v = {
          transitionDuration: `${r.duration}ms`,
          transform: r.distance ? `translate3d(0,${r.distance}px, 0)` : ''
        }
        return f('div', { ref: a, class: _a() }, [
          f(
            'div',
            {
              ref: i,
              class: _a('track'),
              style: v,
              onTouchstartPassive: x,
              onTouchend: C,
              onTouchcancel: C
            },
            [
              f('div', { class: _a('head'), style: c() }, [y()]),
              (S = n.default) == null ? void 0 : S.call(n)
            ]
          )
        ])
      }
    )
  }
})
const Dv = Z(D1),
  [$1, Oi] = K('rate')
function B1(e, t, n, o) {
  return e >= t
    ? { status: 'full', value: 1 }
    : e + 0.5 >= t && n && !o
      ? { status: 'half', value: 0.5 }
      : e + 1 >= t && n && o
        ? { status: 'half', value: Math.round((e - t + 1) * 1e10) / 1e10 }
        : { status: 'void', value: 0 }
}
const $v = {
  size: q,
  icon: J('star'),
  color: String,
  count: se(5),
  gutter: q,
  clearable: Boolean,
  readonly: Boolean,
  disabled: Boolean,
  voidIcon: J('star-o'),
  allowHalf: Boolean,
  voidColor: String,
  touchable: j,
  iconPrefix: String,
  modelValue: Je(0),
  disabledColor: String
}
var M1 = U({
  name: $1,
  props: $v,
  emits: ['change', 'update:modelValue'],
  setup(e, { emit: t }) {
    const n = Ht(),
      [o, a] = ai(),
      i = M(),
      l = B(() => e.readonly || e.disabled),
      r = B(() => l.value || !e.touchable),
      s = B(() =>
        Array(+e.count)
          .fill('')
          .map((C, S) => B1(e.modelValue, S + 1, e.allowHalf, e.readonly))
      )
    let c,
      u,
      d = Number.MAX_SAFE_INTEGER,
      h = Number.MIN_SAFE_INTEGER
    const m = () => {
        u = Oe(i)
        const C = o.value.map(Oe)
        ;((c = []),
          C.forEach((S, v) => {
            ;((d = Math.min(S.top, d)),
              (h = Math.max(S.top, h)),
              e.allowHalf
                ? c.push(
                    { score: v + 0.5, left: S.left, top: S.top, height: S.height },
                    { score: v + 1, left: S.left + S.width / 2, top: S.top, height: S.height }
                  )
                : c.push({ score: v + 1, left: S.left, top: S.top, height: S.height }))
          }))
      },
      y = (C, S) => {
        for (let v = c.length - 1; v > 0; v--)
          if (S >= u.top && S <= u.bottom) {
            if (C > c[v].left && S >= c[v].top && S <= c[v].top + c[v].height) return c[v].score
          } else {
            const _ = S < u.top ? d : h
            if (C > c[v].left && c[v].top === _) return c[v].score
          }
        return e.allowHalf ? 0.5 : 1
      },
      p = C => {
        l.value || C === e.modelValue || (t('update:modelValue', C), t('change', C))
      },
      b = C => {
        r.value || (n.start(C), m())
      },
      x = C => {
        if (!r.value && (n.move(C), n.isHorizontal() && !n.isTap.value)) {
          const { clientX: S, clientY: v } = C.touches[0]
          ;(Fe(C), p(y(S, v)))
        }
      },
      g = (C, S) => {
        const {
            icon: v,
            size: _,
            color: P,
            count: w,
            gutter: A,
            voidIcon: O,
            disabled: I,
            voidColor: T,
            allowHalf: D,
            iconPrefix: z,
            disabledColor: oe
          } = e,
          L = S + 1,
          ee = C.status === 'full',
          ae = C.status === 'void',
          _e = D && C.value > 0 && C.value < 1
        let ke
        A && L !== +w && (ke = { paddingRight: pe(A) })
        const re = H => {
          m()
          let ne = D ? y(H.clientX, H.clientY) : L
          ;(e.clearable && n.isTap.value && ne === e.modelValue && (ne = 0), p(ne))
        }
        return f(
          'div',
          {
            key: S,
            ref: a(S),
            role: 'radio',
            style: ke,
            class: Oi('item'),
            tabindex: I ? void 0 : 0,
            'aria-setsize': w,
            'aria-posinset': L,
            'aria-checked': !ae,
            onClick: re
          },
          [
            f(
              we,
              {
                size: _,
                name: ee ? v : O,
                class: Oi('icon', { disabled: I, full: ee }),
                color: I ? oe : ee ? P : T,
                classPrefix: z
              },
              null
            ),
            _e &&
              f(
                we,
                {
                  size: _,
                  style: { width: C.value + 'em' },
                  name: ae ? O : v,
                  class: Oi('icon', ['half', { disabled: I, full: !ae }]),
                  color: I ? oe : ae ? T : P,
                  classPrefix: z
                },
                null
              )
          ]
        )
      }
    return (
      ao(() => e.modelValue),
      Xe('touchmove', x, { target: i }),
      () =>
        f(
          'div',
          {
            ref: i,
            role: 'radiogroup',
            class: Oi({ readonly: e.readonly, disabled: e.disabled }),
            tabindex: e.disabled ? void 0 : 0,
            'aria-disabled': e.disabled,
            'aria-readonly': e.readonly,
            onTouchstartPassive: b
          },
          [s.value.map(g)]
        )
    )
  }
})
const Bv = Z(M1),
  V1 = {
    figureArr: ze(),
    delay: Number,
    duration: Je(2),
    isStart: Boolean,
    direction: J('down'),
    height: Je(40)
  },
  [L1, Or] = K('rolling-text-item')
var N1 = U({
  name: L1,
  props: V1,
  setup(e) {
    const t = B(() => (e.direction === 'down' ? e.figureArr.slice().reverse() : e.figureArr)),
      n = B(() => `-${e.height * (e.figureArr.length - 1)}px`),
      o = B(() => ({ lineHeight: pe(e.height) })),
      a = B(() => ({
        height: pe(e.height),
        '--van-translate': n.value,
        '--van-duration': e.duration + 's',
        '--van-delay': e.delay + 's'
      }))
    return () =>
      f('div', { class: Or([e.direction]), style: a.value }, [
        f('div', { class: Or('box', { animate: e.isStart }) }, [
          Array.isArray(t.value) &&
            t.value.map(i => f('div', { class: Or('item'), style: o.value }, [i]))
        ])
      ])
  }
})
const [F1, H1] = K('rolling-text'),
  Mv = {
    startNum: Je(0),
    targetNum: Number,
    textList: ze(),
    duration: Je(2),
    autoStart: j,
    direction: J('down'),
    stopOrder: J('ltr'),
    height: Je(40)
  },
  z1 = 2
var j1 = U({
  name: F1,
  props: Mv,
  setup(e) {
    const t = B(() => Array.isArray(e.textList) && e.textList.length),
      n = B(() => (t.value ? e.textList[0].length : `${Math.max(e.startNum, e.targetNum)}`.length)),
      o = d => {
        const h = []
        for (let m = 0; m < e.textList.length; m++) h.push(e.textList[m][d])
        return h
      },
      a = B(() => (t.value ? new Array(n.value).fill('') : Yt(e.targetNum, n.value).split(''))),
      i = B(() => Yt(e.startNum, n.value).split('')),
      l = d => {
        const h = +i.value[d],
          m = +a.value[d],
          y = []
        for (let p = h; p <= 9; p++) y.push(p)
        for (let p = 0; p <= z1; p++) for (let b = 0; b <= 9; b++) y.push(b)
        for (let p = 0; p <= m; p++) y.push(p)
        return y
      },
      r = (d, h) => (e.stopOrder === 'ltr' ? 0.2 * d : 0.2 * (h - 1 - d)),
      s = M(e.autoStart),
      c = () => {
        s.value = !0
      },
      u = () => {
        ;((s.value = !1), e.autoStart && vt(() => c()))
      }
    return (
      te(
        () => e.autoStart,
        d => {
          d && c()
        }
      ),
      Te({ start: c, reset: u }),
      () =>
        f('div', { class: H1() }, [
          a.value.map((d, h) =>
            f(
              N1,
              {
                figureArr: t.value ? o(h) : l(h),
                duration: e.duration,
                direction: e.direction,
                isStart: s.value,
                height: e.height,
                delay: r(h, n.value)
              },
              null
            )
          )
        ])
    )
  }
})
const Vv = Z(j1),
  Lv = Z(JC),
  [W1, Ta, U1] = K('search'),
  Nv = he({}, Js, {
    label: String,
    shape: J('square'),
    leftIcon: J('search'),
    clearable: j,
    actionText: String,
    background: String,
    showAction: Boolean
  })
var K1 = U({
  name: W1,
  props: Nv,
  emits: [
    'blur',
    'focus',
    'clear',
    'search',
    'cancel',
    'clickInput',
    'clickLeftIcon',
    'clickRightIcon',
    'update:modelValue'
  ],
  setup(e, { emit: t, slots: n, attrs: o }) {
    const a = fa(),
      i = M(),
      l = () => {
        n.action || (t('update:modelValue', ''), t('cancel'))
      },
      r = v => {
        v.keyCode === 13 && (Fe(v), t('search', e.modelValue))
      },
      s = () => e.id || `${a}-input`,
      c = () => {
        if (n.label || e.label)
          return f('label', { class: Ta('label'), for: s(), 'data-allow-mismatch': 'attribute' }, [
            n.label ? n.label() : e.label
          ])
      },
      u = () => {
        if (e.showAction) {
          const v = e.actionText || U1('cancel')
          return f('div', { class: Ta('action'), role: 'button', tabindex: 0, onClick: l }, [
            n.action ? n.action() : v
          ])
        }
      },
      d = () => {
        var v
        return (v = i.value) == null ? void 0 : v.blur()
      },
      h = () => {
        var v
        return (v = i.value) == null ? void 0 : v.focus()
      },
      m = v => t('blur', v),
      y = v => t('focus', v),
      p = v => t('clear', v),
      b = v => t('clickInput', v),
      x = v => t('clickLeftIcon', v),
      g = v => t('clickRightIcon', v),
      C = Object.keys(Js),
      S = () => {
        const v = he({}, o, Ie(e, C), { id: s() }),
          _ = P => t('update:modelValue', P)
        return f(
          gn,
          Ce(
            {
              ref: i,
              type: 'search',
              class: Ta('field', { 'with-message': v.errorMessage }),
              border: !1,
              labelAlign: 'left',
              onBlur: m,
              onFocus: y,
              onClear: p,
              onKeypress: r,
              onClickInput: b,
              onClickLeftIcon: x,
              onClickRightIcon: g,
              'onUpdate:modelValue': _
            },
            v
          ),
          Ie(n, ['left-icon', 'right-icon'])
        )
      }
    return (
      Te({ focus: h, blur: d }),
      () => {
        var v
        return f(
          'div',
          { class: Ta({ 'show-action': e.showAction }), style: { background: e.background } },
          [
            (v = n.left) == null ? void 0 : v.call(n),
            f('div', { class: Ta('content', e.shape) }, [c(), S()]),
            u()
          ]
        )
      }
    )
  }
})
const Fv = Z(K1),
  Y1 = e => (e == null ? void 0 : e.includes('/')),
  G1 = [...Us, 'round', 'closeOnPopstate', 'safeAreaInsetBottom'],
  q1 = {
    qq: 'qq',
    link: 'link-o',
    weibo: 'weibo',
    qrcode: 'qr',
    poster: 'photo-o',
    wechat: 'wechat',
    'weapp-qrcode': 'miniprogram-o',
    'wechat-moments': 'wechat-moments'
  },
  [X1, Ut, Z1] = K('share-sheet'),
  Hv = he({}, da, {
    title: String,
    round: j,
    options: ze(),
    cancelText: String,
    description: String,
    closeOnPopstate: j,
    safeAreaInsetBottom: j
  })
var J1 = U({
  name: X1,
  props: Hv,
  emits: ['cancel', 'select', 'update:show'],
  setup(e, { emit: t, slots: n }) {
    const o = h => t('update:show', h),
      a = () => {
        ;(o(!1), t('cancel'))
      },
      i = (h, m) => t('select', h, m),
      l = () => {
        const h = n.title ? n.title() : e.title,
          m = n.description ? n.description() : e.description
        if (h || m)
          return f('div', { class: Ut('header') }, [
            h && f('h2', { class: Ut('title') }, [h]),
            m && f('span', { class: Ut('description') }, [m])
          ])
      },
      r = h =>
        Y1(h)
          ? f('img', { src: h, class: Ut('image-icon') }, null)
          : f('div', { class: Ut('icon', [h]) }, [f(we, { name: q1[h] || h }, null)]),
      s = (h, m) => {
        const { name: y, icon: p, className: b, description: x } = h
        return f(
          'div',
          { role: 'button', tabindex: 0, class: [Ut('option'), b, bt], onClick: () => i(h, m) },
          [
            r(p),
            y && f('span', { class: Ut('name') }, [y]),
            x && f('span', { class: Ut('option-description') }, [x])
          ]
        )
      },
      c = (h, m) => f('div', { class: Ut('options', { border: m }) }, [h.map(s)]),
      u = () => {
        const { options: h } = e
        return Array.isArray(h[0]) ? h.map((m, y) => c(m, y !== 0)) : c(h)
      },
      d = () => {
        var h
        const m = (h = e.cancelText) != null ? h : Z1('cancel')
        if (n.cancel || m)
          return f('button', { type: 'button', class: Ut('cancel'), onClick: a }, [
            n.cancel ? n.cancel() : m
          ])
      }
    return () =>
      f(zt, Ce({ class: Ut(), position: 'bottom', 'onUpdate:show': o }, Ie(e, G1)), {
        default: () => [l(), u(), d()]
      })
  }
})
const zv = Z(J1),
  [jv, Q1] = K('sidebar'),
  Wv = Symbol(jv),
  Uv = { modelValue: se(0) }
var eE = U({
  name: jv,
  props: Uv,
  emits: ['change', 'update:modelValue'],
  setup(e, { emit: t, slots: n }) {
    const { linkChildren: o } = yt(Wv),
      a = () => +e.modelValue
    return (
      o({
        getActive: a,
        setActive: l => {
          l !== a() && (t('update:modelValue', l), t('change', l))
        }
      }),
      () => {
        var l
        return f('div', { role: 'tablist', class: Q1() }, [
          (l = n.default) == null ? void 0 : l.call(n)
        ])
      }
    )
  }
})
const cc = Z(eE),
  [tE, yd] = K('sidebar-item'),
  Kv = he({}, lo, { dot: Boolean, title: String, badge: q, disabled: Boolean, badgeProps: Object })
var nE = U({
  name: tE,
  props: Kv,
  emits: ['click'],
  setup(e, { emit: t, slots: n }) {
    const o = ko(),
      { parent: a, index: i } = ht(Wv)
    if (!a) return
    const l = () => {
      e.disabled || (t('click', i.value), a.setActive(i.value), o())
    }
    return () => {
      const { dot: r, badge: s, title: c, disabled: u } = e,
        d = i.value === a.getActive()
      return f(
        'div',
        {
          role: 'tab',
          class: yd({ select: d, disabled: u }),
          tabindex: u ? void 0 : 0,
          'aria-selected': d,
          onClick: l
        },
        [
          f(ro, Ce({ dot: r, class: yd('text'), content: s }, e.badgeProps), {
            default: () => [n.title ? n.title() : c]
          })
        ]
      )
    }
  }
})
const uc = Z(nE),
  [oE, Rr, Dr] = K('signature'),
  aE = {
    tips: String,
    type: J('png'),
    penColor: J('#000'),
    lineWidth: Je(3),
    historySize: Je(20),
    undoButtonText: String,
    clearButtonText: String,
    backgroundColor: J(''),
    confirmButtonText: String
  },
  iE = () => {
    var e
    const t = document.createElement('canvas')
    return !!((e = t.getContext) != null && e.call(t, '2d'))
  }
var lE = U({
  name: oE,
  props: aE,
  emits: ['submit', 'clear', 'start', 'end', 'signing'],
  setup(e, { emit: t, slots: n }) {
    const o = M(),
      a = M(),
      i = B(() => (o.value ? o.value.getContext('2d') : null)),
      l = Ot ? iE() : !0
    let r = 0,
      s = 0,
      c
    const u = M([]),
      d = () => {
        i.value &&
          r &&
          s &&
          (u.value.length >= e.historySize && u.value.shift(),
          u.value.push(i.value.getImageData(0, 0, r, s)))
      },
      h = () => {
        if (!i.value) return !1
        ;(i.value.beginPath(),
          (i.value.lineWidth = e.lineWidth),
          (i.value.strokeStyle = e.penColor),
          (c = Oe(o)),
          t('start'))
      },
      m = _ => {
        if (!i.value) return !1
        Fe(_)
        const P = _.touches[0],
          w = P.clientX - ((c == null ? void 0 : c.left) || 0),
          A = P.clientY - ((c == null ? void 0 : c.top) || 0)
        ;((i.value.lineCap = 'round'),
          (i.value.lineJoin = 'round'),
          i.value.lineTo(w, A),
          i.value.stroke(),
          t('signing', _))
      },
      y = _ => {
        ;(Fe(_), d(), t('end'))
      },
      p = _ => {
        const P = document.createElement('canvas')
        if (((P.width = _.width), (P.height = _.height), e.backgroundColor)) {
          const w = P.getContext('2d')
          b(w)
        }
        return _.toDataURL() === P.toDataURL()
      },
      b = _ => {
        _ && e.backgroundColor && ((_.fillStyle = e.backgroundColor), _.fillRect(0, 0, r, s))
      },
      x = () => {
        var _, P
        const w = o.value
        if (!w) return
        const O = p(w)
          ? ''
          : ((P = (_ = {
              jpg: () => w.toDataURL('image/jpeg', 0.8),
              jpeg: () => w.toDataURL('image/jpeg', 0.8)
            })[e.type]) == null
              ? void 0
              : P.call(_)) || w.toDataURL(`image/${e.type}`)
        t('submit', { image: O, canvas: w })
      },
      g = () => {
        ;(i.value && (i.value.clearRect(0, 0, r, s), i.value.closePath(), b(i.value)),
          (u.value = []),
          t('clear'))
      },
      C = () => {
        u.value.length &&
          (u.value.pop(),
          i.value &&
            (i.value.clearRect(0, 0, r, s),
            b(i.value),
            u.value.length && i.value.putImageData(u.value[u.value.length - 1], 0, 0)))
      },
      S = () => {
        var _, P, w
        if (l && o.value) {
          const A = o.value,
            O = Ot ? window.devicePixelRatio : 1
          ;((r = A.width = (((_ = a.value) == null ? void 0 : _.offsetWidth) || 0) * O),
            (s = A.height = (((P = a.value) == null ? void 0 : P.offsetHeight) || 0) * O),
            (w = i.value) == null || w.scale(O, O),
            b(i.value))
        }
      },
      v = () => {
        if (i.value) {
          const _ = i.value.getImageData(0, 0, r, s)
          ;(S(), i.value.putImageData(_, 0, 0))
        }
      }
    return (
      te(qt, v),
      We(S),
      Te({ resize: v, clear: g, submit: x, undo: C }),
      () =>
        f('div', { class: Rr() }, [
          f('div', { class: Rr('content'), ref: a }, [
            l
              ? f('canvas', { ref: o, onTouchstartPassive: h, onTouchmove: m, onTouchend: y }, null)
              : n.tips
                ? n.tips()
                : f('p', null, [e.tips])
          ]),
          f('div', { class: Rr('footer') }, [
            f(
              st,
              { size: 'small', onClick: g },
              { default: () => [e.clearButtonText || Dr('clear')] }
            ),
            f(
              st,
              { size: 'small', onClick: C },
              { default: () => [e.undoButtonText || Dr('undo')] }
            ),
            f(
              st,
              { type: 'primary', size: 'small', onClick: x },
              { default: () => [e.confirmButtonText || Dr('confirm')] }
            )
          ])
        ])
    )
  }
})
const Yv = Z(lE),
  [rE, sE] = K('skeleton-title'),
  Gv = { round: Boolean, titleWidth: q }
var cE = U({
  name: rE,
  props: Gv,
  setup(e) {
    return () =>
      f('h3', { class: sE([{ round: e.round }]), style: { width: pe(e.titleWidth) } }, null)
  }
})
const dc = Z(cE)
var uE = dc
const [dE, fE] = K('skeleton-avatar'),
  qv = { avatarSize: q, avatarShape: J('round') }
var hE = U({
  name: dE,
  props: qv,
  setup(e) {
    return () => f('div', { class: fE([e.avatarShape]), style: Fn(e.avatarSize) }, null)
  }
})
const fc = Z(hE)
var mE = fc
const ql = '100%',
  Xv = { round: Boolean, rowWidth: { type: q, default: ql } },
  [gE, vE] = K('skeleton-paragraph')
var bE = U({
  name: gE,
  props: Xv,
  setup(e) {
    return () => f('div', { class: vE([{ round: e.round }]), style: { width: e.rowWidth } }, null)
  }
})
const hc = Z(bE)
var yE = hc
const [pE, pd] = K('skeleton'),
  wE = '60%',
  Zv = {
    row: se(0),
    round: Boolean,
    title: Boolean,
    titleWidth: q,
    avatar: Boolean,
    avatarSize: q,
    avatarShape: J('round'),
    loading: j,
    animate: j,
    rowWidth: { type: [Number, String, Array], default: ql }
  }
var xE = U({
  name: pE,
  inheritAttrs: !1,
  props: Zv,
  setup(e, { slots: t, attrs: n }) {
    const o = () => {
        if (e.avatar) return f(mE, { avatarShape: e.avatarShape, avatarSize: e.avatarSize }, null)
      },
      a = () => {
        if (e.title) return f(uE, { round: e.round, titleWidth: e.titleWidth }, null)
      },
      i = s => {
        const { rowWidth: c } = e
        return c === ql && s === +e.row - 1 ? wE : Array.isArray(c) ? c[s] : c
      },
      l = () =>
        Array(+e.row)
          .fill('')
          .map((s, c) => f(yE, { key: c, round: e.round, rowWidth: pe(i(c)) }, null)),
      r = () =>
        t.template
          ? t.template()
          : f(qe, null, [o(), f('div', { class: pd('content') }, [a(), l()])])
    return () => {
      var s
      return e.loading
        ? f('div', Ce({ class: pd({ animate: e.animate, round: e.round }) }, n), [r()])
        : (s = t.default) == null
          ? void 0
          : s.call(t)
    }
  }
})
const Jv = Z(xE),
  [SE, wd] = K('skeleton-image'),
  Qv = { imageSize: q, imageShape: J('square') }
var CE = U({
  name: SE,
  props: Qv,
  setup(e) {
    return () =>
      f('div', { class: wd([e.imageShape]), style: Fn(e.imageSize) }, [
        f(we, { name: 'photo', class: wd('icon') }, null)
      ])
  }
})
const eb = Z(CE),
  [_E, Ea] = K('slider'),
  tb = {
    min: se(0),
    max: se(100),
    step: se(1),
    range: Boolean,
    reverse: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    vertical: Boolean,
    barHeight: q,
    buttonSize: q,
    activeColor: String,
    inactiveColor: String,
    modelValue: { type: [Number, Array], default: 0 }
  }
var TE = U({
  name: _E,
  props: tb,
  emits: ['change', 'dragEnd', 'dragStart', 'update:modelValue'],
  setup(e, { emit: t, slots: n }) {
    let o, a, i
    const l = M(),
      r = [M(), M()],
      s = M(),
      c = Ht(),
      u = B(() => Number(e.max) - Number(e.min)),
      d = B(() => {
        const I = e.vertical ? 'width' : 'height'
        return { background: e.inactiveColor, [I]: pe(e.barHeight) }
      }),
      h = I => e.range && Array.isArray(I),
      m = () => {
        const { modelValue: I, min: T } = e
        return h(I)
          ? `${((I[1] - I[0]) * 100) / u.value}%`
          : `${((I - Number(T)) * 100) / u.value}%`
      },
      y = () => {
        const { modelValue: I, min: T } = e
        return h(I) ? `${((I[0] - Number(T)) * 100) / u.value}%` : '0%'
      },
      p = B(() => {
        const T = { [e.vertical ? 'height' : 'width']: m(), background: e.activeColor }
        s.value && (T.transition = 'none')
        const D = () => (e.vertical ? (e.reverse ? 'bottom' : 'top') : e.reverse ? 'right' : 'left')
        return ((T[D()] = y()), T)
      }),
      b = I => {
        const T = +e.min,
          D = +e.max,
          z = +e.step
        I = it(I, T, D)
        const oe = Math.round((I - T) / z) * z
        return mh(T, oe)
      },
      x = () => {
        const I = e.modelValue
        h(I) ? (i = I.map(b)) : (i = b(I))
      },
      g = I => {
        var T, D
        const z = (T = I[0]) != null ? T : Number(e.min),
          oe = (D = I[1]) != null ? D : Number(e.max)
        return z > oe ? [oe, z] : [z, oe]
      },
      C = (I, T) => {
        ;(h(I) ? (I = g(I).map(b)) : (I = b(I)),
          mn(I, e.modelValue) || t('update:modelValue', I),
          T && !mn(I, i) && t('change', I))
      },
      S = I => {
        if ((I.stopPropagation(), e.disabled || e.readonly)) return
        x()
        const { min: T, reverse: D, vertical: z, modelValue: oe } = e,
          L = Oe(l),
          ee = () =>
            z
              ? D
                ? L.bottom - I.clientY
                : I.clientY - L.top
              : D
                ? L.right - I.clientX
                : I.clientX - L.left,
          ae = z ? L.height : L.width,
          _e = Number(T) + (ee() / ae) * u.value
        if (h(oe)) {
          const [ke, re] = oe,
            H = (ke + re) / 2
          _e <= H ? C([_e, re], !0) : C([ke, _e], !0)
        } else C(_e, !0)
      },
      v = I => {
        e.disabled || e.readonly || (c.start(I), (a = e.modelValue), x(), (s.value = 'start'))
      },
      _ = I => {
        if (e.disabled || e.readonly) return
        ;(s.value === 'start' && t('dragStart', I), Fe(I, !0), c.move(I), (s.value = 'dragging'))
        const T = Oe(l),
          D = e.vertical ? c.deltaY.value : c.deltaX.value,
          z = e.vertical ? T.height : T.width
        let oe = (D / z) * u.value
        if ((e.reverse && (oe = -oe), h(i))) {
          const L = e.reverse ? 1 - o : o
          a[L] = i[L] + oe
        } else a = i + oe
        C(a)
      },
      P = I => {
        e.disabled ||
          e.readonly ||
          (s.value === 'dragging' && (C(a, !0), t('dragEnd', I)), (s.value = ''))
      },
      w = I =>
        typeof I == 'number'
          ? Ea('button-wrapper', ['left', 'right'][I])
          : Ea('button-wrapper', e.reverse ? 'left' : 'right'),
      A = (I, T) => {
        const D = s.value === 'dragging'
        if (typeof T == 'number') {
          const z = n[T === 0 ? 'left-button' : 'right-button']
          let oe
          if ((D && Array.isArray(a) && (oe = a[0] > a[1] ? o ^ 1 : o), z))
            return z({ value: I, dragging: D, dragIndex: oe })
        }
        return n.button
          ? n.button({ value: I, dragging: D })
          : f('div', { class: Ea('button'), style: Fn(e.buttonSize) }, null)
      },
      O = I => {
        const T = typeof I == 'number' ? e.modelValue[I] : e.modelValue
        return f(
          'div',
          {
            ref: r[I ?? 0],
            role: 'slider',
            class: w(I),
            tabindex: e.disabled ? void 0 : 0,
            'aria-valuemin': e.min,
            'aria-valuenow': T,
            'aria-valuemax': e.max,
            'aria-disabled': e.disabled || void 0,
            'aria-readonly': e.readonly || void 0,
            'aria-orientation': e.vertical ? 'vertical' : 'horizontal',
            onTouchstartPassive: D => {
              ;(typeof I == 'number' && (o = I), v(D))
            },
            onTouchend: P,
            onTouchcancel: P,
            onClick: Ns
          },
          [A(T, I)]
        )
      }
    return (
      C(e.modelValue),
      ao(() => e.modelValue),
      r.forEach(I => {
        Xe('touchmove', _, { target: I })
      }),
      () =>
        f(
          'div',
          {
            ref: l,
            style: d.value,
            class: Ea({ vertical: e.vertical, disabled: e.disabled }),
            onClick: S
          },
          [f('div', { class: Ea('bar'), style: p.value }, [e.range ? [O(0), O(1)] : O()])]
        )
    )
  }
})
const nb = Z(TE),
  [xd, EE] = K('space'),
  ob = {
    align: String,
    direction: { type: String, default: 'horizontal' },
    size: { type: [Number, String, Array], default: 8 },
    wrap: Boolean,
    fill: Boolean
  }
function ab(e = []) {
  const t = []
  return (
    e.forEach(n => {
      Array.isArray(n) ? t.push(...n) : n.type === qe ? t.push(...ab(n.children)) : t.push(n)
    }),
    t.filter(n => {
      var o
      return !(
        n &&
        (n.type === ot ||
          (n.type === qe && ((o = n.children) == null ? void 0 : o.length) === 0) ||
          (n.type === ti && n.children.trim() === ''))
      )
    })
  )
}
var kE = U({
  name: xd,
  props: ob,
  setup(e, { slots: t }) {
    const n = B(() => {
        var i
        return (i = e.align) != null ? i : e.direction === 'horizontal' ? 'center' : ''
      }),
      o = i => (typeof i == 'number' ? i + 'px' : i),
      a = i => {
        const l = {},
          r = `${o(Array.isArray(e.size) ? e.size[0] : e.size)}`,
          s = `${o(Array.isArray(e.size) ? e.size[1] : e.size)}`
        return i
          ? e.wrap
            ? { marginBottom: s }
            : {}
          : (e.direction === 'horizontal' && (l.marginRight = r),
            (e.direction === 'vertical' || e.wrap) && (l.marginBottom = s),
            l)
      }
    return () => {
      var i
      const l = ab((i = t.default) == null ? void 0 : i.call(t))
      return f(
        'div',
        {
          class: [
            EE({
              [e.direction]: e.direction,
              [`align-${n.value}`]: n.value,
              wrap: e.wrap,
              fill: e.fill
            })
          ]
        },
        [
          l.map((r, s) =>
            f('div', { key: `item-${s}`, class: `${xd}-item`, style: a(s === l.length - 1) }, [r])
          )
        ]
      )
    }
  }
})
const ib = Z(kE),
  [lb, Sd] = K('steps'),
  rb = {
    active: se(0),
    direction: J('horizontal'),
    activeIcon: J('checked'),
    iconPrefix: String,
    finishIcon: String,
    activeColor: String,
    inactiveIcon: String,
    inactiveColor: String
  },
  sb = Symbol(lb)
var AE = U({
  name: lb,
  props: rb,
  emits: ['clickStep'],
  setup(e, { emit: t, slots: n }) {
    const { linkChildren: o } = yt(sb)
    return (
      o({ props: e, onClickStep: i => t('clickStep', i) }),
      () => {
        var i
        return f('div', { class: Sd([e.direction]) }, [
          f('div', { class: Sd('items') }, [(i = n.default) == null ? void 0 : i.call(n)])
        ])
      }
    )
  }
})
const [PE, qn] = K('step')
var IE = U({
  name: PE,
  setup(e, { slots: t }) {
    const { parent: n, index: o } = ht(sb)
    if (!n) return
    const a = n.props,
      i = () => {
        const d = +a.active
        return o.value < d ? 'finish' : o.value === d ? 'process' : 'waiting'
      },
      l = () => i() === 'process',
      r = B(() => ({ background: i() === 'finish' ? a.activeColor : a.inactiveColor })),
      s = B(() => {
        if (l()) return { color: a.activeColor }
        if (i() === 'waiting') return { color: a.inactiveColor }
      }),
      c = () => n.onClickStep(o.value),
      u = () => {
        const { iconPrefix: d, finishIcon: h, activeIcon: m, activeColor: y, inactiveIcon: p } = a
        return l()
          ? t['active-icon']
            ? t['active-icon']()
            : f(we, { class: qn('icon', 'active'), name: m, color: y, classPrefix: d }, null)
          : i() === 'finish' && (h || t['finish-icon'])
            ? t['finish-icon']
              ? t['finish-icon']()
              : f(we, { class: qn('icon', 'finish'), name: h, color: y, classPrefix: d }, null)
            : t['inactive-icon']
              ? t['inactive-icon']()
              : p
                ? f(we, { class: qn('icon'), name: p, classPrefix: d }, null)
                : f('i', { class: qn('circle'), style: r.value }, null)
      }
    return () => {
      var d
      const h = i()
      return f('div', { class: [zn, qn([a.direction, { [h]: h }])] }, [
        f('div', { class: qn('title', { active: l() }), style: s.value, onClick: c }, [
          (d = t.default) == null ? void 0 : d.call(t)
        ]),
        f('div', { class: qn('circle-container'), onClick: c }, [u()]),
        f('div', { class: qn('line'), style: r.value }, null)
      ])
    }
  }
})
const cb = Z(IE),
  [OE, Ri] = K('stepper'),
  RE = 200,
  Di = (e, t) => String(e) === String(t),
  ub = {
    min: se(1),
    max: se(1 / 0),
    name: se(''),
    step: se(1),
    theme: String,
    integer: Boolean,
    disabled: Boolean,
    showPlus: j,
    showMinus: j,
    showInput: j,
    longPress: j,
    autoFixed: j,
    allowEmpty: Boolean,
    modelValue: q,
    inputWidth: q,
    buttonSize: q,
    placeholder: String,
    disablePlus: Boolean,
    disableMinus: Boolean,
    disableInput: Boolean,
    beforeChange: Function,
    defaultValue: se(1),
    decimalLength: q
  }
var DE = U({
  name: OE,
  props: ub,
  emits: ['plus', 'blur', 'minus', 'focus', 'change', 'overlimit', 'update:modelValue'],
  setup(e, { emit: t }) {
    const n = (w, A = !0) => {
        const { min: O, max: I, allowEmpty: T, decimalLength: D } = e
        return (
          (T && w === '') ||
            (typeof w == 'number' && String(w).includes('e') && (w = w.toFixed(D ? +D : 17)),
            (w = rs(String(w), !e.integer)),
            (w = w === '' ? 0 : +w),
            (w = Number.isNaN(w) ? +O : w),
            (w = A ? Math.max(Math.min(+I, w), +O) : w),
            Ee(D) && (w = w.toFixed(+D))),
          w
        )
      },
      o = () => {
        var w
        const A = (w = e.modelValue) != null ? w : e.defaultValue,
          O = n(A)
        return (Di(O, e.modelValue) || t('update:modelValue', O), O)
      }
    let a
    const i = M(),
      l = M(o()),
      r = B(() => e.disabled || e.disableMinus || +l.value <= +e.min),
      s = B(() => e.disabled || e.disablePlus || +l.value >= +e.max),
      c = B(() => ({ width: pe(e.inputWidth), height: pe(e.buttonSize) })),
      u = B(() => Fn(e.buttonSize)),
      d = () => {
        const w = n(l.value)
        Di(w, l.value) || (l.value = w)
      },
      h = w => {
        e.beforeChange
          ? io(e.beforeChange, {
              args: [w],
              done() {
                l.value = w
              }
            })
          : (l.value = w)
      },
      m = () => {
        if ((a === 'plus' && s.value) || (a === 'minus' && r.value)) {
          t('overlimit', a)
          return
        }
        const w = a === 'minus' ? -e.step : +e.step,
          A = n(mh(+l.value, w))
        ;(h(A), t(a))
      },
      y = w => {
        const A = w.target,
          { value: O } = A,
          { decimalLength: I } = e
        let T = rs(String(O), !e.integer)
        if (Ee(I) && T.includes('.')) {
          const z = T.split('.')
          T = `${z[0]}.${z[1].slice(0, +I)}`
        }
        e.beforeChange ? (A.value = String(l.value)) : Di(O, T) || (A.value = T)
        const D = T === String(+T)
        h(D ? +T : T)
      },
      p = w => {
        var A
        e.disableInput ? (A = i.value) == null || A.blur() : t('focus', w)
      },
      b = w => {
        const A = w.target,
          O = n(A.value, e.autoFixed)
        ;((A.value = String(O)),
          (l.value = O),
          Se(() => {
            ;(t('blur', w), fh())
          }))
      }
    let x, g
    const C = () => {
        g = setTimeout(() => {
          ;(m(), C())
        }, RE)
      },
      S = () => {
        e.longPress &&
          ((x = !1),
          clearTimeout(g),
          (g = setTimeout(() => {
            ;((x = !0), m(), C())
          }, ph)))
      },
      v = w => {
        e.longPress && (clearTimeout(g), x && Fe(w))
      },
      _ = w => {
        e.disableInput && Fe(w)
      },
      P = w => ({
        onClick: A => {
          ;(Fe(A), (a = w), m())
        },
        onTouchstartPassive: () => {
          ;((a = w), S())
        },
        onTouchend: v,
        onTouchcancel: v
      })
    return (
      te(() => [e.max, e.min, e.integer, e.decimalLength], d),
      te(
        () => e.modelValue,
        w => {
          Di(w, l.value) || (l.value = n(w))
        }
      ),
      te(l, w => {
        ;(t('update:modelValue', w), t('change', w, { name: e.name }))
      }),
      ao(() => e.modelValue),
      () =>
        f('div', { role: 'group', class: Ri([e.theme]) }, [
          rt(
            f(
              'button',
              Ce(
                {
                  type: 'button',
                  style: u.value,
                  class: [Ri('minus', { disabled: r.value }), { [bt]: !r.value }],
                  'aria-disabled': r.value || void 0
                },
                P('minus')
              ),
              null
            ),
            [[ft, e.showMinus]]
          ),
          rt(
            f(
              'input',
              {
                ref: i,
                type: e.integer ? 'tel' : 'text',
                role: 'spinbutton',
                class: Ri('input'),
                value: l.value,
                style: c.value,
                disabled: e.disabled,
                readonly: e.disableInput,
                inputmode: e.integer ? 'numeric' : 'decimal',
                placeholder: e.placeholder,
                autocomplete: 'off',
                'aria-valuemax': e.max,
                'aria-valuemin': e.min,
                'aria-valuenow': l.value,
                onBlur: b,
                onInput: y,
                onFocus: p,
                onMousedown: _
              },
              null
            ),
            [[ft, e.showInput]]
          ),
          rt(
            f(
              'button',
              Ce(
                {
                  type: 'button',
                  style: u.value,
                  class: [Ri('plus', { disabled: s.value }), { [bt]: !s.value }],
                  'aria-disabled': s.value || void 0
                },
                P('plus')
              ),
              null
            ),
            [[ft, e.showPlus]]
          )
        ])
    )
  }
})
const db = Z(DE),
  fb = Z(AE),
  [$E, Kt, BE] = K('submit-bar'),
  hb = {
    tip: String,
    label: String,
    price: Number,
    tipIcon: String,
    loading: Boolean,
    currency: J('¥'),
    disabled: Boolean,
    textAlign: String,
    buttonText: String,
    buttonType: J('danger'),
    buttonColor: String,
    suffixLabel: String,
    placeholder: Boolean,
    decimalLength: se(2),
    safeAreaInsetBottom: j
  }
var ME = U({
  name: $E,
  props: hb,
  emits: ['submit'],
  setup(e, { emit: t, slots: n }) {
    const o = M(),
      a = Ml(o, Kt),
      i = () => {
        const {
          price: u,
          label: d,
          currency: h,
          textAlign: m,
          suffixLabel: y,
          decimalLength: p
        } = e
        if (typeof u == 'number') {
          const b = (u / 100).toFixed(+p).split('.'),
            x = p ? `.${b[1]}` : ''
          return f('div', { class: Kt('text'), style: { textAlign: m } }, [
            f('span', null, [d || BE('label')]),
            f('span', { class: Kt('price') }, [
              h,
              f('span', { class: Kt('price-integer') }, [b[0]]),
              x
            ]),
            y && f('span', { class: Kt('suffix-label') }, [y])
          ])
        }
      },
      l = () => {
        var u
        const { tip: d, tipIcon: h } = e
        if (n.tip || d)
          return f('div', { class: Kt('tip') }, [
            h && f(we, { class: Kt('tip-icon'), name: h }, null),
            d && f('span', { class: Kt('tip-text') }, [d]),
            (u = n.tip) == null ? void 0 : u.call(n)
          ])
      },
      r = () => t('submit'),
      s = () =>
        n.button
          ? n.button()
          : f(
              st,
              {
                round: !0,
                type: e.buttonType,
                text: e.buttonText,
                class: Kt('button', e.buttonType),
                color: e.buttonColor,
                loading: e.loading,
                disabled: e.disabled,
                onClick: r
              },
              null
            ),
      c = () => {
        var u, d
        return f(
          'div',
          { ref: o, class: [Kt(), { 'van-safe-area-bottom': e.safeAreaInsetBottom }] },
          [
            (u = n.top) == null ? void 0 : u.call(n),
            l(),
            f('div', { class: Kt('bar') }, [(d = n.default) == null ? void 0 : d.call(n), i(), s()])
          ]
        )
      }
    return () => (e.placeholder ? a(c) : c())
  }
})
const mb = Z(ME),
  [VE, $r] = K('swipe-cell'),
  gb = {
    name: se(''),
    disabled: Boolean,
    leftWidth: q,
    rightWidth: q,
    threshold: { type: q, default: 0.15, validator: e => +e >= 0 && +e <= 1 },
    beforeClose: Function,
    stopPropagation: Boolean
  }
var LE = U({
  name: VE,
  props: gb,
  emits: ['open', 'close', 'click'],
  setup(e, { emit: t, slots: n }) {
    let o, a, i, l
    const r = M(),
      s = M(),
      c = M(),
      u = He({ offset: 0, dragging: !1 }),
      d = Ht(),
      h = w => (w.value ? Oe(w).width : 0),
      m = B(() => (Ee(e.leftWidth) ? +e.leftWidth : h(s))),
      y = B(() => (Ee(e.rightWidth) ? +e.rightWidth : h(c))),
      p = w => {
        ;((u.offset = w === 'left' ? m.value : -y.value),
          o || ((o = !0), t('open', { name: e.name, position: w })))
      },
      b = w => {
        ;((u.offset = 0), o && ((o = !1), t('close', { name: e.name, position: w })))
      },
      x = w => {
        const A = Math.abs(u.offset),
          O = +e.threshold,
          I = o ? 1 - O : O,
          T = w === 'left' ? m.value : y.value
        T && A > T * I ? p(w) : b(w)
      },
      g = w => {
        e.disabled || ((i = u.offset), d.start(w))
      },
      C = w => {
        if (e.disabled) return
        const { deltaX: A } = d
        ;(d.move(w),
          d.isHorizontal() &&
            ((a = !0),
            (u.dragging = !0),
            (!o || A.value * i < 0) && Fe(w, e.stopPropagation),
            (u.offset = it(A.value + i, -y.value, m.value))))
      },
      S = () => {
        u.dragging &&
          ((u.dragging = !1),
          x(u.offset > 0 ? 'left' : 'right'),
          setTimeout(() => {
            a = !1
          }, 0))
      },
      v = (w = 'outside', A) => {
        l ||
          (t('click', w),
          o &&
            !a &&
            ((l = !0),
            io(e.beforeClose, {
              args: [{ event: A, name: e.name, position: w }],
              done: () => {
                ;((l = !1), b(w))
              },
              canceled: () => (l = !1),
              error: () => (l = !1)
            })))
      },
      _ = w => A => {
        ;((a || o) && A.stopPropagation(), !a && v(w, A))
      },
      P = (w, A) => {
        const O = n[w]
        if (O) return f('div', { ref: A, class: $r(w), onClick: _(w) }, [O()])
      }
    return (
      Te({ open: p, close: b }),
      Dl(r, w => v('outside', w), { eventName: 'touchstart' }),
      Xe('touchmove', C, { target: r }),
      () => {
        var w
        const A = {
          transform: `translate3d(${u.offset}px, 0, 0)`,
          transitionDuration: u.dragging ? '0s' : '.6s'
        }
        return f(
          'div',
          {
            ref: r,
            class: $r(),
            onClick: _('cell'),
            onTouchstartPassive: g,
            onTouchend: S,
            onTouchcancel: S
          },
          [
            f('div', { class: $r('wrapper'), style: A }, [
              P('left', s),
              (w = n.default) == null ? void 0 : w.call(n),
              P('right', c)
            ])
          ]
        )
      }
    )
  }
})
const vb = Z(LE),
  [bb, Cd] = K('tabbar'),
  yb = {
    route: Boolean,
    fixed: j,
    border: j,
    zIndex: q,
    placeholder: Boolean,
    activeColor: String,
    beforeChange: Function,
    inactiveColor: String,
    modelValue: se(0),
    safeAreaInsetBottom: { type: Boolean, default: null }
  },
  pb = Symbol(bb)
var NE = U({
  name: bb,
  props: yb,
  emits: ['change', 'update:modelValue'],
  setup(e, { emit: t, slots: n }) {
    const o = M(),
      { linkChildren: a } = yt(pb),
      i = Ml(o, Cd),
      l = () => {
        var c
        return (c = e.safeAreaInsetBottom) != null ? c : e.fixed
      },
      r = () => {
        var c
        const { fixed: u, zIndex: d, border: h } = e
        return f(
          'div',
          {
            ref: o,
            role: 'tablist',
            style: Hn(d),
            class: [Cd({ fixed: u }), { [$l]: h, 'van-safe-area-bottom': l() }]
          },
          [(c = n.default) == null ? void 0 : c.call(n)]
        )
      }
    return (
      a({
        props: e,
        setActive: (c, u) => {
          io(e.beforeChange, {
            args: [c],
            done() {
              ;(t('update:modelValue', c), t('change', c), u())
            }
          })
        }
      }),
      () => (e.fixed && e.placeholder ? i(r) : r())
    )
  }
})
const wb = Z(NE),
  [FE, Br] = K('tabbar-item'),
  xb = he({}, lo, {
    dot: Boolean,
    icon: String,
    name: q,
    badge: q,
    badgeProps: Object,
    iconPrefix: String
  })
var HE = U({
  name: FE,
  props: xb,
  emits: ['click'],
  setup(e, { emit: t, slots: n }) {
    const o = ko(),
      a = Et().proxy,
      { parent: i, index: l } = ht(pb)
    if (!i) return
    const r = B(() => {
        var u
        const { route: d, modelValue: h } = i.props
        if (d && '$route' in a) {
          const { $route: m } = a,
            { to: y } = e,
            p = Qt(y) ? y : { path: y }
          return m.matched.some(b => {
            const x = 'path' in p && p.path === b.path,
              g = 'name' in p && p.name === b.name
            return x || g
          })
        }
        return ((u = e.name) != null ? u : l.value) === h
      }),
      s = u => {
        var d
        ;(r.value || i.setActive((d = e.name) != null ? d : l.value, o), t('click', u))
      },
      c = () => {
        if (n.icon) return n.icon({ active: r.value })
        if (e.icon) return f(we, { name: e.icon, classPrefix: e.iconPrefix }, null)
      }
    return () => {
      var u
      const { dot: d, badge: h } = e,
        { activeColor: m, inactiveColor: y } = i.props,
        p = r.value ? m : y
      return f(
        'div',
        {
          role: 'tab',
          class: Br({ active: r.value }),
          style: { color: p },
          tabindex: 0,
          'aria-selected': r.value,
          onClick: s
        },
        [
          f(ro, Ce({ dot: d, class: Br('icon'), content: h }, e.badgeProps), { default: c }),
          f('div', { class: Br('text') }, [
            (u = n.default) == null ? void 0 : u.call(n, { active: r.value })
          ])
        ]
      )
    }
  }
})
const Sb = Z(HE),
  [zE, _d] = K('text-ellipsis'),
  Cb = {
    rows: se(1),
    dots: J('...'),
    content: J(''),
    expandText: J(''),
    collapseText: J(''),
    position: J('end')
  }
var jE = U({
  name: zE,
  props: Cb,
  emits: ['clickAction'],
  setup(e, { emit: t, slots: n }) {
    const o = M(e.content),
      a = M(!1),
      i = M(!1),
      l = M(),
      r = M()
    let s = !1
    const c = B(() => (a.value ? e.collapseText : e.expandText)),
      u = x => {
        if (!x) return 0
        const g = x.match(/^\d*(\.\d*)?/)
        return g ? Number(g[0]) : 0
      },
      d = () => {
        if (!l.value || !l.value.isConnected) return
        const x = window.getComputedStyle(l.value),
          g = document.createElement('div')
        return (
          Array.prototype.slice.apply(x).forEach(S => {
            g.style.setProperty(S, x.getPropertyValue(S))
          }),
          (g.style.position = 'fixed'),
          (g.style.zIndex = '-9999'),
          (g.style.top = '-9999px'),
          (g.style.height = 'auto'),
          (g.style.minHeight = 'auto'),
          (g.style.maxHeight = 'auto'),
          (g.innerText = e.content),
          document.body.appendChild(g),
          g
        )
      },
      h = (x, g) => {
        var C, S
        const { content: v, position: _, dots: P } = e,
          w = v.length,
          A = (0 + w) >> 1,
          O = n.action
            ? (S = (C = r.value) == null ? void 0 : C.outerHTML) != null
              ? S
              : ''
            : e.expandText,
          I = () => {
            const D = (z, oe) => {
              if (oe - z <= 1) return _ === 'end' ? v.slice(0, z) + P : P + v.slice(oe, w)
              const L = Math.round((z + oe) / 2)
              return (
                _ === 'end' ? (x.innerText = v.slice(0, L) + P) : (x.innerText = P + v.slice(L, w)),
                (x.innerHTML += O),
                x.offsetHeight > g
                  ? _ === 'end'
                    ? D(z, L)
                    : D(L, oe)
                  : _ === 'end'
                    ? D(L, oe)
                    : D(z, L)
              )
            }
            return D(0, w)
          },
          T = (D, z) => {
            if (D[1] - D[0] <= 1 && z[1] - z[0] <= 1) return v.slice(0, D[0]) + P + v.slice(z[1], w)
            const oe = Math.floor((D[0] + D[1]) / 2),
              L = Math.ceil((z[0] + z[1]) / 2)
            return (
              (x.innerText = e.content.slice(0, oe) + e.dots + e.content.slice(L, w)),
              (x.innerHTML += O),
              x.offsetHeight >= g ? T([D[0], oe], [L, z[1]]) : T([oe, D[1]], [z[0], L])
            )
          }
        return e.position === 'middle' ? T([0, A], [A, w]) : I()
      },
      m = () => {
        const x = d()
        if (!x) {
          s = !0
          return
        }
        const { paddingBottom: g, paddingTop: C, lineHeight: S } = x.style,
          v = Math.ceil((Number(e.rows) + 0.5) * u(S) + u(C) + u(g))
        ;(v < x.offsetHeight
          ? ((i.value = !0), (o.value = h(x, v)))
          : ((i.value = !1), (o.value = e.content)),
          document.body.removeChild(x))
      },
      y = (x = !a.value) => {
        a.value = x
      },
      p = x => {
        ;(y(), t('clickAction', x))
      },
      b = () => {
        const x = n.action ? n.action({ expanded: a.value }) : c.value
        return f('span', { ref: r, class: _d('action'), onClick: p }, [x])
      }
    return (
      We(() => {
        ;(m(), n.action && Se(m))
      }),
      yn(() => {
        s && ((s = !1), m())
      }),
      te([qt, () => [e.content, e.rows, e.position]], m),
      Te({ toggle: y }),
      () => f('div', { ref: l, class: _d() }, [a.value ? e.content : o.value, i.value ? b() : null])
    )
  }
})
const _b = Z(jE),
  [WE] = K('time-picker'),
  Td = e => /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(e),
  UE = ['hour', 'minute', 'second'],
  Tb = he({}, Lm, {
    minHour: se(0),
    maxHour: se(23),
    minMinute: se(0),
    maxMinute: se(59),
    minSecond: se(0),
    maxSecond: se(59),
    minTime: { type: String, validator: Td },
    maxTime: { type: String, validator: Td },
    columnsType: { type: Array, default: () => ['hour', 'minute'] }
  })
var KE = U({
  name: WE,
  props: Tb,
  emits: ['confirm', 'cancel', 'change', 'update:modelValue'],
  setup(e, { emit: t, slots: n }) {
    const o = M(e.modelValue),
      a = M(),
      i = h => {
        const m = h.split(':')
        return UE.map((y, p) => (e.columnsType.includes(y) ? m[p] : '00'))
      },
      l = () => {
        var h
        return (h = a.value) == null ? void 0 : h.confirm()
      },
      r = () => o.value,
      s = B(() => {
        let { minHour: h, maxHour: m, minMinute: y, maxMinute: p, minSecond: b, maxSecond: x } = e
        if (e.minTime || e.maxTime) {
          const g = { hour: 0, minute: 0, second: 0 }
          e.columnsType.forEach((v, _) => {
            var P
            g[v] = (P = o.value[_]) != null ? P : 0
          })
          const { hour: C, minute: S } = g
          if (e.minTime) {
            const [v, _, P] = i(e.minTime)
            ;((h = v), (y = +C <= +h ? _ : '00'), (b = +C <= +h && +S <= +y ? P : '00'))
          }
          if (e.maxTime) {
            const [v, _, P] = i(e.maxTime)
            ;((m = v), (p = +C >= +m ? _ : '59'), (x = +C >= +m && +S >= +p ? P : '59'))
          }
        }
        return e.columnsType.map(g => {
          const { filter: C, formatter: S } = e
          switch (g) {
            case 'hour':
              return Xo(+h, +m, g, S, C, o.value)
            case 'minute':
              return Xo(+y, +p, g, S, C, o.value)
            case 'second':
              return Xo(+b, +x, g, S, C, o.value)
            default:
              return []
          }
        })
      })
    ;(te(o, h => {
      mn(h, e.modelValue) || t('update:modelValue', h)
    }),
      te(
        () => e.modelValue,
        h => {
          ;((h = Hm(h, s.value)), mn(h, o.value) || (o.value = h))
        },
        { immediate: !0 }
      ))
    const c = (...h) => t('change', ...h),
      u = (...h) => t('cancel', ...h),
      d = (...h) => t('confirm', ...h)
    return (
      Te({ confirm: l, getSelectedTime: r }),
      () =>
        f(
          li,
          Ce(
            {
              ref: a,
              modelValue: o.value,
              'onUpdate:modelValue': h => (o.value = h),
              columns: s.value,
              onChange: c,
              onCancel: u,
              onConfirm: d
            },
            Ie(e, Nm)
          ),
          n
        )
    )
  }
})
const Eb = Z(KE),
  [YE, Ho] = K('tree-select'),
  kb = {
    max: se(1 / 0),
    items: ze(),
    height: se(300),
    selectedIcon: J('success'),
    mainActiveIndex: se(0),
    activeId: { type: [Number, String, Array], default: 0 }
  }
var GE = U({
  name: YE,
  props: kb,
  emits: ['clickNav', 'clickItem', 'update:activeId', 'update:mainActiveIndex'],
  setup(e, { emit: t, slots: n }) {
    const o = c => (Array.isArray(e.activeId) ? e.activeId.includes(c) : e.activeId === c),
      a = c => {
        const u = () => {
          if (c.disabled) return
          let d
          if (Array.isArray(e.activeId)) {
            d = e.activeId.slice()
            const h = d.indexOf(c.id)
            h !== -1 ? d.splice(h, 1) : d.length < +e.max && d.push(c.id)
          } else d = c.id
          ;(t('update:activeId', d), t('clickItem', c))
        }
        return f(
          'div',
          {
            key: c.id,
            class: ['van-ellipsis', Ho('item', { active: o(c.id), disabled: c.disabled })],
            onClick: u
          },
          [c.text, o(c.id) && f(we, { name: e.selectedIcon, class: Ho('selected') }, null)]
        )
      },
      i = c => {
        t('update:mainActiveIndex', c)
      },
      l = c => t('clickNav', c),
      r = () => {
        const c = e.items.map(u =>
          f(
            uc,
            {
              dot: u.dot,
              badge: u.badge,
              class: [Ho('nav-item'), u.className],
              disabled: u.disabled,
              onClick: l
            },
            { title: () => (n['nav-text'] ? n['nav-text'](u) : u.text) }
          )
        )
        return f(
          cc,
          { class: Ho('nav'), modelValue: e.mainActiveIndex, onChange: i },
          { default: () => [c] }
        )
      },
      s = () => {
        if (n.content) return n.content()
        const c = e.items[+e.mainActiveIndex] || {}
        if (c.children) return c.children.map(a)
      }
    return () =>
      f('div', { class: Ho(), style: { height: pe(e.height) } }, [
        r(),
        f('div', { class: Ho('content') }, [s()])
      ])
  }
})
const Ab = Z(GE),
  [qE, nt, XE] = K('uploader')
function Ed(e, t) {
  return new Promise(n => {
    if (t === 'file') {
      n()
      return
    }
    const o = new FileReader()
    ;((o.onload = a => {
      n(a.target.result)
    }),
      t === 'dataUrl' ? o.readAsDataURL(e) : t === 'text' && o.readAsText(e))
  })
}
function Pb(e, t) {
  return tl(e).some(n => (n.file ? (na(t) ? t(n.file) : n.file.size > +t) : !1))
}
function ZE(e, t) {
  const n = [],
    o = []
  return (
    e.forEach(a => {
      Pb(a, t) ? o.push(a) : n.push(a)
    }),
    { valid: n, invalid: o }
  )
}
const JE = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg|avif)/i,
  QE = e => JE.test(e)
function Ib(e) {
  return e.isImage
    ? !0
    : e.file && e.file.type
      ? e.file.type.indexOf('image') === 0
      : e.url
        ? QE(e.url)
        : typeof e.content == 'string'
          ? e.content.indexOf('data:image') === 0
          : !1
}
var ek = U({
  props: {
    name: q,
    item: lt(Object),
    index: Number,
    imageFit: String,
    lazyLoad: Boolean,
    deletable: Boolean,
    reupload: Boolean,
    previewSize: [Number, String, Array],
    beforeDelete: Function
  },
  emits: ['delete', 'preview', 'reupload'],
  setup(e, { emit: t, slots: n }) {
    const o = () => {
        const { status: u, message: d } = e.item
        if (u === 'uploading' || u === 'failed') {
          const h =
              u === 'failed'
                ? f(we, { name: 'close', class: nt('mask-icon') }, null)
                : f(Ft, { class: nt('loading') }, null),
            m = Ee(d) && d !== ''
          return f('div', { class: nt('mask') }, [
            h,
            m && f('div', { class: nt('mask-message') }, [d])
          ])
        }
      },
      a = u => {
        const { name: d, item: h, index: m, beforeDelete: y } = e
        ;(u.stopPropagation(), io(y, { args: [h, { name: d, index: m }], done: () => t('delete') }))
      },
      i = () => t('preview'),
      l = () => t('reupload'),
      r = () => {
        if (e.deletable && e.item.status !== 'uploading') {
          const u = n['preview-delete']
          return f(
            'div',
            {
              role: 'button',
              class: nt('preview-delete', { shadow: !u }),
              tabindex: 0,
              'aria-label': XE('delete'),
              onClick: a
            },
            [u ? u() : f(we, { name: 'cross', class: nt('preview-delete-icon') }, null)]
          )
        }
      },
      s = () => {
        if (n['preview-cover']) {
          const { index: u, item: d } = e
          return f('div', { class: nt('preview-cover') }, [n['preview-cover'](he({ index: u }, d))])
        }
      },
      c = () => {
        const { item: u, lazyLoad: d, imageFit: h, previewSize: m, reupload: y } = e
        return Ib(u)
          ? f(
              si,
              {
                fit: h,
                src: u.objectUrl || u.content || u.url,
                class: nt('preview-image'),
                width: Array.isArray(m) ? m[0] : m,
                height: Array.isArray(m) ? m[1] : m,
                lazyLoad: d,
                onClick: y ? l : i
              },
              { default: s }
            )
          : f('div', { class: nt('file'), style: Fn(e.previewSize) }, [
              f(we, { class: nt('file-icon'), name: 'description' }, null),
              f('div', { class: [nt('file-name'), 'van-ellipsis'] }, [
                u.file ? u.file.name : u.url
              ]),
              s()
            ])
      }
    return () => f('div', { class: nt('preview') }, [c(), o(), r()])
  }
})
const Ob = {
  name: se(''),
  accept: J('image/*'),
  capture: String,
  multiple: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  lazyLoad: Boolean,
  maxCount: se(1 / 0),
  imageFit: J('cover'),
  resultType: J('dataUrl'),
  uploadIcon: J('photograph'),
  uploadText: String,
  deletable: j,
  reupload: Boolean,
  afterRead: Function,
  showUpload: j,
  modelValue: ze(),
  beforeRead: Function,
  beforeDelete: Function,
  previewSize: [Number, String, Array],
  previewImage: j,
  previewOptions: Object,
  previewFullImage: j,
  maxSize: { type: [Number, String, Function], default: 1 / 0 }
}
var tk = U({
  name: qE,
  props: Ob,
  emits: [
    'delete',
    'oversize',
    'clickUpload',
    'closePreview',
    'clickPreview',
    'clickReupload',
    'update:modelValue'
  ],
  setup(e, { emit: t, slots: n }) {
    const o = M(),
      a = [],
      i = M(-1),
      l = M(!1),
      r = (w = e.modelValue.length) => ({ name: e.name, index: w }),
      s = () => {
        o.value && (o.value.value = '')
      },
      c = w => {
        if ((s(), Pb(w, e.maxSize)))
          if (Array.isArray(w)) {
            const A = ZE(w, e.maxSize)
            if (((w = A.valid), t('oversize', A.invalid, r()), !w.length)) return
          } else {
            t('oversize', w, r())
            return
          }
        if (((w = He(w)), i.value > -1)) {
          const A = [...e.modelValue]
          ;(A.splice(i.value, 1, w), t('update:modelValue', A), (i.value = -1))
        } else t('update:modelValue', [...e.modelValue, ...tl(w)])
        e.afterRead && e.afterRead(w, r())
      },
      u = w => {
        const { maxCount: A, modelValue: O, resultType: I } = e
        if (Array.isArray(w)) {
          const T = +A - O.length
          ;(w.length > T && (w = w.slice(0, T)),
            Promise.all(w.map(D => Ed(D, I))).then(D => {
              const z = w.map((oe, L) => {
                const ee = { file: oe, status: '', message: '', objectUrl: URL.createObjectURL(oe) }
                return (D[L] && (ee.content = D[L]), ee)
              })
              c(z)
            }))
        } else
          Ed(w, I).then(T => {
            const D = { file: w, status: '', message: '', objectUrl: URL.createObjectURL(w) }
            ;(T && (D.content = T), c(D))
          })
      },
      d = w => {
        const { files: A } = w.target
        if (e.disabled || !A || !A.length) return
        const O = A.length === 1 ? A[0] : [].slice.call(A)
        if (e.beforeRead) {
          const I = e.beforeRead(O, r())
          if (!I) {
            s()
            return
          }
          if (Ls(I)) {
            I.then(T => {
              u(T || O)
            }).catch(s)
            return
          }
        }
        u(O)
      }
    let h
    const m = () => t('closePreview'),
      y = w => {
        if (e.previewFullImage) {
          const A = e.modelValue.filter(Ib),
            O = A.map(
              I => (
                I.objectUrl &&
                  !I.url &&
                  I.status !== 'failed' &&
                  ((I.url = I.objectUrl), a.push(I.url)),
                I.url
              )
            ).filter(Boolean)
          h = Zg(he({ images: O, startPosition: A.indexOf(w), onClose: m }, e.previewOptions))
        }
      },
      p = () => {
        h && h.close()
      },
      b = (w, A) => {
        const O = e.modelValue.slice(0)
        ;(O.splice(A, 1), t('update:modelValue', O), t('delete', w, r(A)))
      },
      x = w => {
        ;((l.value = !0), (i.value = w), Se(() => P()))
      },
      g = () => {
        ;(l.value || (i.value = -1), (l.value = !1))
      },
      C = (w, A) => {
        const O = ['imageFit', 'deletable', 'reupload', 'previewSize', 'beforeDelete'],
          I = he(Ie(e, O), Ie(w, O, !0))
        return f(
          ek,
          Ce(
            {
              item: w,
              index: A,
              onClick: () => t(e.reupload ? 'clickReupload' : 'clickPreview', w, r(A)),
              onDelete: () => b(w, A),
              onPreview: () => y(w),
              onReupload: () => x(A)
            },
            Ie(e, ['name', 'lazyLoad']),
            I
          ),
          Ie(n, ['preview-cover', 'preview-delete'])
        )
      },
      S = () => {
        if (e.previewImage) return e.modelValue.map(C)
      },
      v = w => t('clickUpload', w),
      _ = () => {
        const w = e.modelValue.length < +e.maxCount,
          A = e.readonly
            ? null
            : f(
                'input',
                {
                  ref: o,
                  type: 'file',
                  class: nt('input'),
                  accept: e.accept,
                  capture: e.capture,
                  multiple: e.multiple && i.value === -1,
                  disabled: e.disabled,
                  onChange: d,
                  onClick: g
                },
                null
              )
        return n.default
          ? rt(f('div', { class: nt('input-wrapper'), onClick: v }, [n.default(), A]), [[ft, w]])
          : rt(
              f(
                'div',
                {
                  class: nt('upload', { readonly: e.readonly }),
                  style: Fn(e.previewSize),
                  onClick: v
                },
                [
                  f(we, { name: e.uploadIcon, class: nt('upload-icon') }, null),
                  e.uploadText && f('span', { class: nt('upload-text') }, [e.uploadText]),
                  A
                ]
              ),
              [[ft, e.showUpload && w]]
            )
      },
      P = () => {
        o.value && !e.disabled && o.value.click()
      }
    return (
      en(() => {
        a.forEach(w => URL.revokeObjectURL(w))
      }),
      Te({ chooseFile: P, reuploadFile: x, closeImagePreview: p }),
      ao(() => e.modelValue),
      () =>
        f('div', { class: nt() }, [
          f('div', { class: nt('wrapper', { disabled: e.disabled }) }, [S(), _()])
        ])
    )
  }
})
const Rb = Z(tk),
  [nk, kd] = K('watermark'),
  Db = {
    gapX: Je(0),
    gapY: Je(0),
    image: String,
    width: Je(100),
    height: Je(100),
    rotate: se(-22),
    zIndex: q,
    content: String,
    opacity: q,
    fullPage: j,
    textColor: J('#dcdee0')
  }
var ok = U({
  name: nk,
  props: Db,
  setup(e, { slots: t }) {
    const n = M(),
      o = M(''),
      a = M(''),
      i = () => {
        const u = { transformOrigin: 'center', transform: `rotate(${e.rotate}deg)` },
          d = () =>
            e.image && !t.content
              ? f(
                  'image',
                  {
                    href: a.value,
                    'xlink:href': a.value,
                    x: '0',
                    y: '0',
                    width: e.width,
                    height: e.height,
                    style: u
                  },
                  null
                )
              : f('foreignObject', { x: '0', y: '0', width: e.width, height: e.height }, [
                  f('div', { xmlns: 'http://www.w3.org/1999/xhtml', style: u }, [
                    t.content
                      ? t.content()
                      : f('span', { style: { color: e.textColor } }, [e.content])
                  ])
                ]),
          h = e.width + e.gapX,
          m = e.height + e.gapY
        return f(
          'svg',
          {
            viewBox: `0 0 ${h} ${m}`,
            width: h,
            height: m,
            xmlns: 'http://www.w3.org/2000/svg',
            'xmlns:xlink': 'http://www.w3.org/1999/xlink',
            style: { padding: `0 ${e.gapX}px ${e.gapY}px 0`, opacity: e.opacity }
          },
          [d()]
        )
      },
      l = u => {
        const d = document.createElement('canvas'),
          h = new Image()
        ;((h.crossOrigin = 'anonymous'),
          (h.referrerPolicy = 'no-referrer'),
          (h.onload = () => {
            ;((d.width = h.naturalWidth), (d.height = h.naturalHeight))
            const m = d.getContext('2d')
            ;(m == null || m.drawImage(h, 0, 0), (a.value = d.toDataURL()))
          }),
          (h.src = u))
      },
      r = u => {
        const d = new Blob([u], { type: 'image/svg+xml' })
        return URL.createObjectURL(d)
      },
      s = () => {
        o.value && URL.revokeObjectURL(o.value)
      },
      c = () => {
        n.value && (s(), (o.value = r(n.value.innerHTML)))
      }
    return (
      ra(() => {
        e.image && l(e.image)
      }),
      te(() => [e.content, e.textColor, e.height, e.width, e.rotate, e.gapX, e.gapY], c),
      te(a, () => {
        Se(c)
      }),
      We(c),
      sa(s),
      () => {
        const u = he({ backgroundImage: `url(${o.value})` }, Hn(e.zIndex))
        return f('div', { class: kd({ full: e.fullPage }), style: u }, [
          f('div', { class: kd('wrapper'), ref: n }, [i()])
        ])
      }
    )
  }
})
const $b = Z(ok),
  Bb = '4.10.0'
function Mb(e) {
  ;[
    Ws,
    il,
    Vh,
    zh,
    wm,
    Rm,
    Zs,
    $m,
    ro,
    Mm,
    st,
    jm,
    Km,
    Gm,
    jt,
    Xm,
    Kl,
    tc,
    Jm,
    og,
    rg,
    cg,
    ug,
    fg,
    mg,
    vg,
    yg,
    sl,
    wg,
    Cg,
    Tg,
    Ag,
    Ig,
    Bg,
    Mg,
    ic,
    gn,
    Lg,
    Fg,
    zl,
    Wg,
    Kg,
    Gg,
    we,
    si,
    Jg,
    ov,
    av,
    lv,
    Ft,
    Hs,
    sv,
    uv,
    fv,
    mv,
    Ys,
    vv,
    yv,
    li,
    pv,
    Av,
    zt,
    Iv,
    Dv,
    Ul,
    Wl,
    Bv,
    Vv,
    Lv,
    Fv,
    zv,
    cc,
    uc,
    Yv,
    Jv,
    fc,
    eb,
    hc,
    dc,
    nb,
    ib,
    cb,
    db,
    fb,
    qs,
    mb,
    Ll,
    vb,
    Nl,
    jl,
    oa,
    wb,
    Sb,
    ii,
    ri,
    _b,
    Eb,
    vm,
    Ab,
    Rb,
    $b
  ].forEach(n => {
    n.install ? e.use(n) : n.name && e.component(n.name, n)
  })
}
var Vb = { install: Mb, version: Bb }
const gk = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        ActionBar: Ws,
        ActionBarButton: il,
        ActionBarIcon: Vh,
        ActionSheet: zh,
        AddressEdit: wm,
        AddressList: Rm,
        Area: Zs,
        BackTop: $m,
        Badge: ro,
        Barrage: Mm,
        Button: st,
        Calendar: jm,
        Card: Km,
        Cascader: Gm,
        Cell: jt,
        CellGroup: Xm,
        Checkbox: Kl,
        CheckboxGroup: tc,
        Circle: Jm,
        Col: og,
        Collapse: rg,
        CollapseItem: cg,
        ConfigProvider: ug,
        ContactCard: fg,
        ContactEdit: mg,
        ContactList: vg,
        CountDown: yg,
        Coupon: sl,
        CouponCell: wg,
        CouponList: Cg,
        DEFAULT_ROW_WIDTH: ql,
        DatePicker: Tg,
        Dialog: Ag,
        Divider: Ig,
        DropdownItem: Bg,
        DropdownMenu: Mg,
        Empty: ic,
        Field: gn,
        FloatingBubble: Lg,
        FloatingPanel: Fg,
        Form: zl,
        Grid: Wg,
        GridItem: Kg,
        Highlight: Gg,
        Icon: we,
        Image: si,
        ImagePreview: Jg,
        IndexAnchor: ov,
        IndexBar: av,
        List: lv,
        Loading: Ft,
        Locale: Hs,
        NavBar: sv,
        NoticeBar: uv,
        Notify: fv,
        NumberKeyboard: mv,
        Overlay: Ys,
        Pagination: vv,
        PasswordInput: yv,
        Picker: li,
        PickerGroup: pv,
        Popover: Av,
        Popup: zt,
        Progress: Iv,
        PullRefresh: Dv,
        Radio: Ul,
        RadioGroup: Wl,
        Rate: Bv,
        RollingText: Vv,
        Row: Lv,
        Search: Fv,
        ShareSheet: zv,
        Sidebar: cc,
        SidebarItem: uc,
        Signature: Yv,
        Skeleton: Jv,
        SkeletonAvatar: fc,
        SkeletonImage: eb,
        SkeletonParagraph: hc,
        SkeletonTitle: dc,
        Slider: nb,
        Space: ib,
        Step: cb,
        Stepper: db,
        Steps: fb,
        Sticky: qs,
        SubmitBar: mb,
        Swipe: Ll,
        SwipeCell: vb,
        SwipeItem: Nl,
        Switch: jl,
        Tab: oa,
        Tabbar: wb,
        TabbarItem: Sb,
        Tabs: ii,
        Tag: ri,
        TextEllipsis: _b,
        TimePicker: Eb,
        Toast: vm,
        TreeSelect: Ab,
        Uploader: Rb,
        Watermark: $b,
        actionBarButtonProps: Bh,
        actionBarIconProps: Mh,
        actionBarProps: Ch,
        actionSheetProps: Hh,
        addressEditProps: pm,
        addressListProps: Om,
        areaProps: cm,
        backTopProps: Dm,
        badgeProps: Th,
        barrageProps: Bm,
        buttonProps: $h,
        calendarProps: zm,
        cardProps: Um,
        cascaderProps: Ym,
        cellGroupProps: qm,
        cellProps: um,
        checkboxGroupProps: Tm,
        checkboxProps: Im,
        circleProps: Zm,
        colProps: ng,
        collapseItemProps: sg,
        collapseProps: lg,
        configProviderProps: Oh,
        contactCardProps: dg,
        contactEditProps: hg,
        contactListProps: gg,
        countDownProps: bg,
        couponCellProps: pg,
        couponListProps: Sg,
        datePickerProps: _g,
        default: Vb,
        dialogProps: Eg,
        dividerProps: Pg,
        dropdownItemProps: $g,
        dropdownMenuProps: Rg,
        emptyProps: xg,
        fieldProps: hm,
        floatingBubbleProps: Vg,
        floatingPanelProps: Ng,
        formProps: dm,
        gridItemProps: Ug,
        gridProps: zg,
        highlightProps: Yg,
        iconProps: Rh,
        imagePreviewProps: qg,
        imageProps: Wm,
        indexAnchorProps: nv,
        indexBarProps: ev,
        install: Mb,
        listProps: iv,
        loadingProps: Dh,
        navBarProps: rv,
        noticeBarProps: cv,
        notifyProps: dv,
        numberKeyboardProps: hv,
        overlayProps: Nh,
        paginationProps: gv,
        passwordInputProps: bv,
        pickerGroupProps: lm,
        pickerProps: rm,
        popoverProps: kv,
        popupProps: Fh,
        progressProps: Pv,
        pullRefreshProps: Rv,
        radioGroupProps: Sm,
        radioProps: Pm,
        rateProps: $v,
        rollingTextProps: Mv,
        rowProps: tg,
        searchProps: Nv,
        setGlobalZIndex: Ah,
        shareSheetProps: Hv,
        showDialog: M_,
        showImagePreview: Zg,
        showToast: rl,
        sidebarItemProps: Kv,
        sidebarProps: Uv,
        skeletonAvatarProps: qv,
        skeletonImageProps: Qv,
        skeletonParagraphProps: Xv,
        skeletonProps: Zv,
        skeletonTitleProps: Gv,
        sliderProps: tb,
        spaceProps: ob,
        stepperProps: ub,
        stepsProps: rb,
        stickyProps: qh,
        submitBarProps: hb,
        swipeCellProps: gb,
        swipeProps: Zh,
        switchProps: bm,
        tabProps: om,
        tabbarItemProps: xb,
        tabbarProps: yb,
        tabsProps: em,
        tagProps: km,
        textEllipsisProps: Cb,
        timePickerProps: Tb,
        toastProps: mm,
        treeSelectProps: kb,
        uploaderProps: Ob,
        useAllTabStatus: Xs,
        useGlobalZIndex: kh,
        version: Bb,
        watermarkProps: Db
      },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  Xl = Wf(_p),
  ak = Dw()
Xl.use(ak)
Xl.use(oh)
Xl.use(Vb)
const ik = Fw()
ik.init()
Xl.mount('#app')
export {
  B as A,
  We as B,
  Ke as C,
  gp as D,
  Nw as E,
  qe as F,
  Zy as G,
  mk as H,
  M_ as I,
  Vt as J,
  lk as K,
  dk as L,
  Mi as M,
  gk as N,
  oi as T,
  wp as _,
  ck as a,
  f as b,
  E0 as c,
  U as d,
  Lf as e,
  $s as f,
  M as g,
  He as h,
  xl as i,
  sk as j,
  rt as k,
  P0 as l,
  te as m,
  wl as n,
  Ua as o,
  en as p,
  qi as q,
  Xy as r,
  rl as s,
  Qb as t,
  hk as u,
  uk as v,
  Fr as w,
  rk as x,
  Se as y,
  fk as z
}
