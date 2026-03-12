(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const l of document.querySelectorAll('link[rel="modulepreload"]')) n(l);
  new MutationObserver((l) => {
    for (const r of l)
      if (r.type === "childList")
        for (const a of r.addedNodes)
          a.tagName === "LINK" && a.rel === "modulepreload" && n(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function o(l) {
    const r = {};
    return (
      l.integrity && (r.integrity = l.integrity),
      l.referrerPolicy && (r.referrerPolicy = l.referrerPolicy),
      l.crossOrigin === "use-credentials"
        ? (r.credentials = "include")
        : l.crossOrigin === "anonymous"
          ? (r.credentials = "omit")
          : (r.credentials = "same-origin"),
      r
    );
  }
  function n(l) {
    if (l.ep) return;
    l.ep = !0;
    const r = o(l);
    fetch(l.href, r);
  }
})();
/**
 * @vue/shared v3.5.21
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function pn(e) {
  const t = Object.create(null);
  for (const o of e.split(",")) t[o] = 1;
  return (o) => o in t;
}
const Me = {},
  us = [],
  bt = () => {},
  Fl = () => !1,
  _o = (e) =>
    e.charCodeAt(0) === 111 &&
    e.charCodeAt(1) === 110 &&
    (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97),
  mn = (e) => e.startsWith("onUpdate:"),
  Ue = Object.assign,
  gn = (e, t) => {
    const o = e.indexOf(t);
    o > -1 && e.splice(o, 1);
  },
  xa = Object.prototype.hasOwnProperty,
  Ce = (e, t) => xa.call(e, t),
  ce = Array.isArray,
  cs = (e) => Ks(e) === "[object Map]",
  _s = (e) => Ks(e) === "[object Set]",
  Ln = (e) => Ks(e) === "[object Date]",
  ve = (e) => typeof e == "function",
  je = (e) => typeof e == "string",
  yt = (e) => typeof e == "symbol",
  Ee = (e) => e !== null && typeof e == "object",
  Hl = (e) => (Ee(e) || ve(e)) && ve(e.then) && ve(e.catch),
  zl = Object.prototype.toString,
  Ks = (e) => zl.call(e),
  _a = (e) => Ks(e).slice(8, -1),
  Ql = (e) => Ks(e) === "[object Object]",
  vn = (e) =>
    je(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e,
  Ms = pn(
    ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted",
  ),
  wo = (e) => {
    const t = Object.create(null);
    return (o) => t[o] || (t[o] = e(o));
  },
  wa = /-\w/g,
  at = wo((e) => e.replace(wa, (t) => t.slice(1).toUpperCase())),
  ka = /\B([A-Z])/g,
  os = wo((e) => e.replace(ka, "-$1").toLowerCase()),
  ko = wo((e) => e.charAt(0).toUpperCase() + e.slice(1)),
  Vo = wo((e) => (e ? `on${ko(e)}` : "")),
  Dt = (e, t) => !Object.is(e, t),
  so = (e, ...t) => {
    for (let o = 0; o < e.length; o++) e[o](...t);
  },
  Kl = (e, t, o, n = !1) => {
    Object.defineProperty(e, t, {
      configurable: !0,
      enumerable: !1,
      writable: n,
      value: o,
    });
  },
  io = (e) => {
    const t = parseFloat(e);
    return isNaN(t) ? e : t;
  },
  Aa = (e) => {
    const t = je(e) ? Number(e) : NaN;
    return isNaN(t) ? e : t;
  };
let On;
const Ao = () =>
  On ||
  (On =
    typeof globalThis < "u"
      ? globalThis
      : typeof self < "u"
        ? self
        : typeof window < "u"
          ? window
          : typeof global < "u"
            ? global
            : {});
function vs(e) {
  if (ce(e)) {
    const t = {};
    for (let o = 0; o < e.length; o++) {
      const n = e[o],
        l = je(n) ? Ma(n) : vs(n);
      if (l) for (const r in l) t[r] = l[r];
    }
    return t;
  } else if (je(e) || Ee(e)) return e;
}
const Ca = /;(?![^(]*\))/g,
  $a = /:([^]+)/,
  Sa = /\/\*[^]*?\*\//g;
function Ma(e) {
  const t = {};
  return (
    e
      .replace(Sa, "")
      .split(Ca)
      .forEach((o) => {
        if (o) {
          const n = o.split($a);
          n.length > 1 && (t[n[0].trim()] = n[1].trim());
        }
      }),
    t
  );
}
function Z(e) {
  let t = "";
  if (je(e)) t = e;
  else if (ce(e))
    for (let o = 0; o < e.length; o++) {
      const n = Z(e[o]);
      n && (t += n + " ");
    }
  else if (Ee(e)) for (const o in e) e[o] && (t += o + " ");
  return t.trim();
}
const Ra =
    "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",
  Ea = pn(Ra);
function Yl(e) {
  return !!e || e === "";
}
function Ta(e, t) {
  if (e.length !== t.length) return !1;
  let o = !0;
  for (let n = 0; o && n < e.length; n++) o = ss(e[n], t[n]);
  return o;
}
function ss(e, t) {
  if (e === t) return !0;
  let o = Ln(e),
    n = Ln(t);
  if (o || n) return o && n ? e.getTime() === t.getTime() : !1;
  if (((o = yt(e)), (n = yt(t)), o || n)) return e === t;
  if (((o = ce(e)), (n = ce(t)), o || n)) return o && n ? Ta(e, t) : !1;
  if (((o = Ee(e)), (n = Ee(t)), o || n)) {
    if (!o || !n) return !1;
    const l = Object.keys(e).length,
      r = Object.keys(t).length;
    if (l !== r) return !1;
    for (const a in e) {
      const u = e.hasOwnProperty(a),
        i = t.hasOwnProperty(a);
      if ((u && !i) || (!u && i) || !ss(e[a], t[a])) return !1;
    }
  }
  return String(e) === String(t);
}
function hn(e, t) {
  return e.findIndex((o) => ss(o, t));
}
const Jl = (e) => !!(e && e.__v_isRef === !0),
  w = (e) =>
    je(e)
      ? e
      : e == null
        ? ""
        : ce(e) || (Ee(e) && (e.toString === zl || !ve(e.toString)))
          ? Jl(e)
            ? w(e.value)
            : JSON.stringify(e, ql, 2)
          : String(e),
  ql = (e, t) =>
    Jl(t)
      ? ql(e, t.value)
      : cs(t)
        ? {
            [`Map(${t.size})`]: [...t.entries()].reduce(
              (o, [n, l], r) => ((o[No(n, r) + " =>"] = l), o),
              {},
            ),
          }
        : _s(t)
          ? { [`Set(${t.size})`]: [...t.values()].map((o) => No(o)) }
          : yt(t)
            ? No(t)
            : Ee(t) && !ce(t) && !Ql(t)
              ? String(t)
              : t,
  No = (e, t = "") => {
    var o;
    return yt(e) ? `Symbol(${(o = e.description) != null ? o : t})` : e;
  };
/**
 * @vue/reactivity v3.5.21
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ let Ze;
class Ba {
  constructor(t = !1) {
    ((this.detached = t),
      (this._active = !0),
      (this._on = 0),
      (this.effects = []),
      (this.cleanups = []),
      (this._isPaused = !1),
      (this.parent = Ze),
      !t &&
        Ze &&
        (this.index = (Ze.scopes || (Ze.scopes = [])).push(this) - 1));
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, o;
      if (this.scopes)
        for (t = 0, o = this.scopes.length; t < o; t++) this.scopes[t].pause();
      for (t = 0, o = this.effects.length; t < o; t++) this.effects[t].pause();
    }
  }
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, o;
      if (this.scopes)
        for (t = 0, o = this.scopes.length; t < o; t++) this.scopes[t].resume();
      for (t = 0, o = this.effects.length; t < o; t++) this.effects[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const o = Ze;
      try {
        return ((Ze = this), t());
      } finally {
        Ze = o;
      }
    }
  }
  on() {
    ++this._on === 1 && ((this.prevScope = Ze), (Ze = this));
  }
  off() {
    this._on > 0 &&
      --this._on === 0 &&
      ((Ze = this.prevScope), (this.prevScope = void 0));
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let o, n;
      for (o = 0, n = this.effects.length; o < n; o++) this.effects[o].stop();
      for (this.effects.length = 0, o = 0, n = this.cleanups.length; o < n; o++)
        this.cleanups[o]();
      if (((this.cleanups.length = 0), this.scopes)) {
        for (o = 0, n = this.scopes.length; o < n; o++) this.scopes[o].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const l = this.parent.scopes.pop();
        l &&
          l !== this &&
          ((this.parent.scopes[this.index] = l), (l.index = this.index));
      }
      this.parent = void 0;
    }
  }
}
function Pa() {
  return Ze;
}
let Te;
const Uo = new WeakSet();
class Gl {
  constructor(t) {
    ((this.fn = t),
      (this.deps = void 0),
      (this.depsTail = void 0),
      (this.flags = 5),
      (this.next = void 0),
      (this.cleanup = void 0),
      (this.scheduler = void 0),
      Ze && Ze.active && Ze.effects.push(this));
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 &&
      ((this.flags &= -65), Uo.has(this) && (Uo.delete(this), this.trigger()));
  }
  notify() {
    (this.flags & 2 && !(this.flags & 32)) || this.flags & 8 || Wl(this);
  }
  run() {
    if (!(this.flags & 1)) return this.fn();
    ((this.flags |= 2), Vn(this), Xl(this));
    const t = Te,
      o = dt;
    ((Te = this), (dt = !0));
    try {
      return this.fn();
    } finally {
      (er(this), (Te = t), (dt = o), (this.flags &= -3));
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep) xn(t);
      ((this.deps = this.depsTail = void 0),
        Vn(this),
        this.onStop && this.onStop(),
        (this.flags &= -2));
    }
  }
  trigger() {
    this.flags & 64
      ? Uo.add(this)
      : this.scheduler
        ? this.scheduler()
        : this.runIfDirty();
  }
  runIfDirty() {
    Wo(this) && this.run();
  }
  get dirty() {
    return Wo(this);
  }
}
let Zl = 0,
  Rs,
  Es;
function Wl(e, t = !1) {
  if (((e.flags |= 8), t)) {
    ((e.next = Es), (Es = e));
    return;
  }
  ((e.next = Rs), (Rs = e));
}
function bn() {
  Zl++;
}
function yn() {
  if (--Zl > 0) return;
  if (Es) {
    let t = Es;
    for (Es = void 0; t; ) {
      const o = t.next;
      ((t.next = void 0), (t.flags &= -9), (t = o));
    }
  }
  let e;
  for (; Rs; ) {
    let t = Rs;
    for (Rs = void 0; t; ) {
      const o = t.next;
      if (((t.next = void 0), (t.flags &= -9), t.flags & 1))
        try {
          t.trigger();
        } catch (n) {
          e || (e = n);
        }
      t = o;
    }
  }
  if (e) throw e;
}
function Xl(e) {
  for (let t = e.deps; t; t = t.nextDep)
    ((t.version = -1),
      (t.prevActiveLink = t.dep.activeLink),
      (t.dep.activeLink = t));
}
function er(e) {
  let t,
    o = e.depsTail,
    n = o;
  for (; n; ) {
    const l = n.prevDep;
    (n.version === -1 ? (n === o && (o = l), xn(n), Ia(n)) : (t = n),
      (n.dep.activeLink = n.prevActiveLink),
      (n.prevActiveLink = void 0),
      (n = l));
  }
  ((e.deps = t), (e.depsTail = o));
}
function Wo(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (
      t.dep.version !== t.version ||
      (t.dep.computed && (tr(t.dep.computed) || t.dep.version !== t.version))
    )
      return !0;
  return !!e._dirty;
}
function tr(e) {
  if (
    (e.flags & 4 && !(e.flags & 16)) ||
    ((e.flags &= -17), e.globalVersion === Os) ||
    ((e.globalVersion = Os),
    !e.isSSR && e.flags & 128 && ((!e.deps && !e._dirty) || !Wo(e)))
  )
    return;
  e.flags |= 2;
  const t = e.dep,
    o = Te,
    n = dt;
  ((Te = e), (dt = !0));
  try {
    Xl(e);
    const l = e.fn(e._value);
    (t.version === 0 || Dt(l, e._value)) &&
      ((e.flags |= 128), (e._value = l), t.version++);
  } catch (l) {
    throw (t.version++, l);
  } finally {
    ((Te = o), (dt = n), er(e), (e.flags &= -3));
  }
}
function xn(e, t = !1) {
  const { dep: o, prevSub: n, nextSub: l } = e;
  if (
    (n && ((n.nextSub = l), (e.prevSub = void 0)),
    l && ((l.prevSub = n), (e.nextSub = void 0)),
    o.subs === e && ((o.subs = n), !n && o.computed))
  ) {
    o.computed.flags &= -5;
    for (let r = o.computed.deps; r; r = r.nextDep) xn(r, !0);
  }
  !t && !--o.sc && o.map && o.map.delete(o.key);
}
function Ia(e) {
  const { prevDep: t, nextDep: o } = e;
  (t && ((t.nextDep = o), (e.prevDep = void 0)),
    o && ((o.prevDep = t), (e.nextDep = void 0)));
}
let dt = !0;
const sr = [];
function Rt() {
  (sr.push(dt), (dt = !1));
}
function Et() {
  const e = sr.pop();
  dt = e === void 0 ? !0 : e;
}
function Vn(e) {
  const { cleanup: t } = e;
  if (((e.cleanup = void 0), t)) {
    const o = Te;
    Te = void 0;
    try {
      t();
    } finally {
      Te = o;
    }
  }
}
let Os = 0;
class ja {
  constructor(t, o) {
    ((this.sub = t),
      (this.dep = o),
      (this.version = o.version),
      (this.nextDep =
        this.prevDep =
        this.nextSub =
        this.prevSub =
        this.prevActiveLink =
          void 0));
  }
}
class _n {
  constructor(t) {
    ((this.computed = t),
      (this.version = 0),
      (this.activeLink = void 0),
      (this.subs = void 0),
      (this.map = void 0),
      (this.key = void 0),
      (this.sc = 0),
      (this.__v_skip = !0));
  }
  track(t) {
    if (!Te || !dt || Te === this.computed) return;
    let o = this.activeLink;
    if (o === void 0 || o.sub !== Te)
      ((o = this.activeLink = new ja(Te, this)),
        Te.deps
          ? ((o.prevDep = Te.depsTail),
            (Te.depsTail.nextDep = o),
            (Te.depsTail = o))
          : (Te.deps = Te.depsTail = o),
        or(o));
    else if (o.version === -1 && ((o.version = this.version), o.nextDep)) {
      const n = o.nextDep;
      ((n.prevDep = o.prevDep),
        o.prevDep && (o.prevDep.nextDep = n),
        (o.prevDep = Te.depsTail),
        (o.nextDep = void 0),
        (Te.depsTail.nextDep = o),
        (Te.depsTail = o),
        Te.deps === o && (Te.deps = n));
    }
    return o;
  }
  trigger(t) {
    (this.version++, Os++, this.notify(t));
  }
  notify(t) {
    bn();
    try {
      for (let o = this.subs; o; o = o.prevSub)
        o.sub.notify() && o.sub.dep.notify();
    } finally {
      yn();
    }
  }
}
function or(e) {
  if ((e.dep.sc++, e.sub.flags & 4)) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let n = t.deps; n; n = n.nextDep) or(n);
    }
    const o = e.dep.subs;
    (o !== e && ((e.prevSub = o), o && (o.nextSub = e)), (e.dep.subs = e));
  }
}
const Xo = new WeakMap(),
  ts = Symbol(""),
  en = Symbol(""),
  Vs = Symbol("");
function ze(e, t, o) {
  if (dt && Te) {
    let n = Xo.get(e);
    n || Xo.set(e, (n = new Map()));
    let l = n.get(o);
    (l || (n.set(o, (l = new _n())), (l.map = n), (l.key = o)), l.track());
  }
}
function $t(e, t, o, n, l, r) {
  const a = Xo.get(e);
  if (!a) {
    Os++;
    return;
  }
  const u = (i) => {
    i && i.trigger();
  };
  if ((bn(), t === "clear")) a.forEach(u);
  else {
    const i = ce(e),
      f = i && vn(o);
    if (i && o === "length") {
      const c = Number(n);
      a.forEach((d, p) => {
        (p === "length" || p === Vs || (!yt(p) && p >= c)) && u(d);
      });
    } else
      switch (
        ((o !== void 0 || a.has(void 0)) && u(a.get(o)), f && u(a.get(Vs)), t)
      ) {
        case "add":
          i ? f && u(a.get("length")) : (u(a.get(ts)), cs(e) && u(a.get(en)));
          break;
        case "delete":
          i || (u(a.get(ts)), cs(e) && u(a.get(en)));
          break;
        case "set":
          cs(e) && u(a.get(ts));
          break;
      }
  }
  yn();
}
function as(e) {
  const t = we(e);
  return t === e ? t : (ze(t, "iterate", Vs), lt(e) ? t : t.map(Fe));
}
function Co(e) {
  return (ze((e = we(e)), "iterate", Vs), e);
}
const La = {
  __proto__: null,
  [Symbol.iterator]() {
    return Do(this, Symbol.iterator, Fe);
  },
  concat(...e) {
    return as(this).concat(...e.map((t) => (ce(t) ? as(t) : t)));
  },
  entries() {
    return Do(this, "entries", (e) => ((e[1] = Fe(e[1])), e));
  },
  every(e, t) {
    return _t(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return _t(this, "filter", e, t, (o) => o.map(Fe), arguments);
  },
  find(e, t) {
    return _t(this, "find", e, t, Fe, arguments);
  },
  findIndex(e, t) {
    return _t(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return _t(this, "findLast", e, t, Fe, arguments);
  },
  findLastIndex(e, t) {
    return _t(this, "findLastIndex", e, t, void 0, arguments);
  },
  forEach(e, t) {
    return _t(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Fo(this, "includes", e);
  },
  indexOf(...e) {
    return Fo(this, "indexOf", e);
  },
  join(e) {
    return as(this).join(e);
  },
  lastIndexOf(...e) {
    return Fo(this, "lastIndexOf", e);
  },
  map(e, t) {
    return _t(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return ws(this, "pop");
  },
  push(...e) {
    return ws(this, "push", e);
  },
  reduce(e, ...t) {
    return Nn(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Nn(this, "reduceRight", e, t);
  },
  shift() {
    return ws(this, "shift");
  },
  some(e, t) {
    return _t(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return ws(this, "splice", e);
  },
  toReversed() {
    return as(this).toReversed();
  },
  toSorted(e) {
    return as(this).toSorted(e);
  },
  toSpliced(...e) {
    return as(this).toSpliced(...e);
  },
  unshift(...e) {
    return ws(this, "unshift", e);
  },
  values() {
    return Do(this, "values", Fe);
  },
};
function Do(e, t, o) {
  const n = Co(e),
    l = n[t]();
  return (
    n !== e &&
      !lt(e) &&
      ((l._next = l.next),
      (l.next = () => {
        const r = l._next();
        return (r.value && (r.value = o(r.value)), r);
      })),
    l
  );
}
const Oa = Array.prototype;
function _t(e, t, o, n, l, r) {
  const a = Co(e),
    u = a !== e && !lt(e),
    i = a[t];
  if (i !== Oa[t]) {
    const d = i.apply(e, r);
    return u ? Fe(d) : d;
  }
  let f = o;
  a !== e &&
    (u
      ? (f = function (d, p) {
          return o.call(this, Fe(d), p, e);
        })
      : o.length > 2 &&
        (f = function (d, p) {
          return o.call(this, d, p, e);
        }));
  const c = i.call(a, f, n);
  return u && l ? l(c) : c;
}
function Nn(e, t, o, n) {
  const l = Co(e);
  let r = o;
  return (
    l !== e &&
      (lt(e)
        ? o.length > 3 &&
          (r = function (a, u, i) {
            return o.call(this, a, u, i, e);
          })
        : (r = function (a, u, i) {
            return o.call(this, a, Fe(u), i, e);
          })),
    l[t](r, ...n)
  );
}
function Fo(e, t, o) {
  const n = we(e);
  ze(n, "iterate", Vs);
  const l = n[t](...o);
  return (l === -1 || l === !1) && An(o[0])
    ? ((o[0] = we(o[0])), n[t](...o))
    : l;
}
function ws(e, t, o = []) {
  (Rt(), bn());
  const n = we(e)[t].apply(e, o);
  return (yn(), Et(), n);
}
const Va = pn("__proto__,__v_isRef,__isVue"),
  nr = new Set(
    Object.getOwnPropertyNames(Symbol)
      .filter((e) => e !== "arguments" && e !== "caller")
      .map((e) => Symbol[e])
      .filter(yt),
  );
function Na(e) {
  yt(e) || (e = String(e));
  const t = we(this);
  return (ze(t, "has", e), t.hasOwnProperty(e));
}
class lr {
  constructor(t = !1, o = !1) {
    ((this._isReadonly = t), (this._isShallow = o));
  }
  get(t, o, n) {
    if (o === "__v_skip") return t.__v_skip;
    const l = this._isReadonly,
      r = this._isShallow;
    if (o === "__v_isReactive") return !l;
    if (o === "__v_isReadonly") return l;
    if (o === "__v_isShallow") return r;
    if (o === "__v_raw")
      return n === (l ? (r ? qa : dr) : r ? ir : ar).get(t) ||
        Object.getPrototypeOf(t) === Object.getPrototypeOf(n)
        ? t
        : void 0;
    const a = ce(t);
    if (!l) {
      let i;
      if (a && (i = La[o])) return i;
      if (o === "hasOwnProperty") return Na;
    }
    const u = Reflect.get(t, o, Ke(t) ? t : n);
    return (yt(o) ? nr.has(o) : Va(o)) || (l || ze(t, "get", o), r)
      ? u
      : Ke(u)
        ? a && vn(o)
          ? u
          : u.value
        : Ee(u)
          ? l
            ? cr(u)
            : Kt(u)
          : u;
  }
}
class rr extends lr {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, o, n, l) {
    let r = t[o];
    if (!this._isShallow) {
      const i = Ft(r);
      if (
        (!lt(n) && !Ft(n) && ((r = we(r)), (n = we(n))),
        !ce(t) && Ke(r) && !Ke(n))
      )
        return (i || (r.value = n), !0);
    }
    const a = ce(t) && vn(o) ? Number(o) < t.length : Ce(t, o),
      u = Reflect.set(t, o, n, Ke(t) ? t : l);
    return (
      t === we(l) && (a ? Dt(n, r) && $t(t, "set", o, n) : $t(t, "add", o, n)),
      u
    );
  }
  deleteProperty(t, o) {
    const n = Ce(t, o);
    t[o];
    const l = Reflect.deleteProperty(t, o);
    return (l && n && $t(t, "delete", o, void 0), l);
  }
  has(t, o) {
    const n = Reflect.has(t, o);
    return ((!yt(o) || !nr.has(o)) && ze(t, "has", o), n);
  }
  ownKeys(t) {
    return (ze(t, "iterate", ce(t) ? "length" : ts), Reflect.ownKeys(t));
  }
}
class Ua extends lr {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, o) {
    return !0;
  }
  deleteProperty(t, o) {
    return !0;
  }
}
const Da = new rr(),
  Fa = new Ua(),
  Ha = new rr(!0);
const tn = (e) => e,
  Gs = (e) => Reflect.getPrototypeOf(e);
function za(e, t, o) {
  return function (...n) {
    const l = this.__v_raw,
      r = we(l),
      a = cs(r),
      u = e === "entries" || (e === Symbol.iterator && a),
      i = e === "keys" && a,
      f = l[e](...n),
      c = o ? tn : t ? uo : Fe;
    return (
      !t && ze(r, "iterate", i ? en : ts),
      {
        next() {
          const { value: d, done: p } = f.next();
          return p
            ? { value: d, done: p }
            : { value: u ? [c(d[0]), c(d[1])] : c(d), done: p };
        },
        [Symbol.iterator]() {
          return this;
        },
      }
    );
  };
}
function Zs(e) {
  return function (...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Qa(e, t) {
  const o = {
    get(l) {
      const r = this.__v_raw,
        a = we(r),
        u = we(l);
      e || (Dt(l, u) && ze(a, "get", l), ze(a, "get", u));
      const { has: i } = Gs(a),
        f = t ? tn : e ? uo : Fe;
      if (i.call(a, l)) return f(r.get(l));
      if (i.call(a, u)) return f(r.get(u));
      r !== a && r.get(l);
    },
    get size() {
      const l = this.__v_raw;
      return (!e && ze(we(l), "iterate", ts), l.size);
    },
    has(l) {
      const r = this.__v_raw,
        a = we(r),
        u = we(l);
      return (
        e || (Dt(l, u) && ze(a, "has", l), ze(a, "has", u)),
        l === u ? r.has(l) : r.has(l) || r.has(u)
      );
    },
    forEach(l, r) {
      const a = this,
        u = a.__v_raw,
        i = we(u),
        f = t ? tn : e ? uo : Fe;
      return (
        !e && ze(i, "iterate", ts),
        u.forEach((c, d) => l.call(r, f(c), f(d), a))
      );
    },
  };
  return (
    Ue(
      o,
      e
        ? {
            add: Zs("add"),
            set: Zs("set"),
            delete: Zs("delete"),
            clear: Zs("clear"),
          }
        : {
            add(l) {
              !t && !lt(l) && !Ft(l) && (l = we(l));
              const r = we(this);
              return (
                Gs(r).has.call(r, l) || (r.add(l), $t(r, "add", l, l)),
                this
              );
            },
            set(l, r) {
              !t && !lt(r) && !Ft(r) && (r = we(r));
              const a = we(this),
                { has: u, get: i } = Gs(a);
              let f = u.call(a, l);
              f || ((l = we(l)), (f = u.call(a, l)));
              const c = i.call(a, l);
              return (
                a.set(l, r),
                f ? Dt(r, c) && $t(a, "set", l, r) : $t(a, "add", l, r),
                this
              );
            },
            delete(l) {
              const r = we(this),
                { has: a, get: u } = Gs(r);
              let i = a.call(r, l);
              (i || ((l = we(l)), (i = a.call(r, l))), u && u.call(r, l));
              const f = r.delete(l);
              return (i && $t(r, "delete", l, void 0), f);
            },
            clear() {
              const l = we(this),
                r = l.size !== 0,
                a = l.clear();
              return (r && $t(l, "clear", void 0, void 0), a);
            },
          },
    ),
    ["keys", "values", "entries", Symbol.iterator].forEach((l) => {
      o[l] = za(l, e, t);
    }),
    o
  );
}
function wn(e, t) {
  const o = Qa(e, t);
  return (n, l, r) =>
    l === "__v_isReactive"
      ? !e
      : l === "__v_isReadonly"
        ? e
        : l === "__v_raw"
          ? n
          : Reflect.get(Ce(o, l) && l in n ? o : n, l, r);
}
const Ka = { get: wn(!1, !1) },
  Ya = { get: wn(!1, !0) },
  Ja = { get: wn(!0, !1) };
const ar = new WeakMap(),
  ir = new WeakMap(),
  dr = new WeakMap(),
  qa = new WeakMap();
function Ga(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function Za(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Ga(_a(e));
}
function Kt(e) {
  return Ft(e) ? e : kn(e, !1, Da, Ka, ar);
}
function ur(e) {
  return kn(e, !1, Ha, Ya, ir);
}
function cr(e) {
  return kn(e, !0, Fa, Ja, dr);
}
function kn(e, t, o, n, l) {
  if (!Ee(e) || (e.__v_raw && !(t && e.__v_isReactive))) return e;
  const r = Za(e);
  if (r === 0) return e;
  const a = l.get(e);
  if (a) return a;
  const u = new Proxy(e, r === 2 ? n : o);
  return (l.set(e, u), u);
}
function fs(e) {
  return Ft(e) ? fs(e.__v_raw) : !!(e && e.__v_isReactive);
}
function Ft(e) {
  return !!(e && e.__v_isReadonly);
}
function lt(e) {
  return !!(e && e.__v_isShallow);
}
function An(e) {
  return e ? !!e.__v_raw : !1;
}
function we(e) {
  const t = e && e.__v_raw;
  return t ? we(t) : e;
}
function Wa(e) {
  return (
    !Ce(e, "__v_skip") && Object.isExtensible(e) && Kl(e, "__v_skip", !0),
    e
  );
}
const Fe = (e) => (Ee(e) ? Kt(e) : e),
  uo = (e) => (Ee(e) ? cr(e) : e);
function Ke(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function $(e) {
  return fr(e, !1);
}
function Xa(e) {
  return fr(e, !0);
}
function fr(e, t) {
  return Ke(e) ? e : new ei(e, t);
}
class ei {
  constructor(t, o) {
    ((this.dep = new _n()),
      (this.__v_isRef = !0),
      (this.__v_isShallow = !1),
      (this._rawValue = o ? t : we(t)),
      (this._value = o ? t : Fe(t)),
      (this.__v_isShallow = o));
  }
  get value() {
    return (this.dep.track(), this._value);
  }
  set value(t) {
    const o = this._rawValue,
      n = this.__v_isShallow || lt(t) || Ft(t);
    ((t = n ? t : we(t)),
      Dt(t, o) &&
        ((this._rawValue = t),
        (this._value = n ? t : Fe(t)),
        this.dep.trigger()));
  }
}
function ie(e) {
  return Ke(e) ? e.value : e;
}
const ti = {
  get: (e, t, o) => (t === "__v_raw" ? e : ie(Reflect.get(e, t, o))),
  set: (e, t, o, n) => {
    const l = e[t];
    return Ke(l) && !Ke(o) ? ((l.value = o), !0) : Reflect.set(e, t, o, n);
  },
};
function pr(e) {
  return fs(e) ? e : new Proxy(e, ti);
}
class si {
  constructor(t, o, n) {
    ((this.fn = t),
      (this.setter = o),
      (this._value = void 0),
      (this.dep = new _n(this)),
      (this.__v_isRef = !0),
      (this.deps = void 0),
      (this.depsTail = void 0),
      (this.flags = 16),
      (this.globalVersion = Os - 1),
      (this.next = void 0),
      (this.effect = this),
      (this.__v_isReadonly = !o),
      (this.isSSR = n));
  }
  notify() {
    if (((this.flags |= 16), !(this.flags & 8) && Te !== this))
      return (Wl(this, !0), !0);
  }
  get value() {
    const t = this.dep.track();
    return (tr(this), t && (t.version = this.dep.version), this._value);
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
function oi(e, t, o = !1) {
  let n, l;
  return (ve(e) ? (n = e) : ((n = e.get), (l = e.set)), new si(n, l, o));
}
const Ws = {},
  co = new WeakMap();
let Xt;
function ni(e, t = !1, o = Xt) {
  if (o) {
    let n = co.get(o);
    (n || co.set(o, (n = [])), n.push(e));
  }
}
function li(e, t, o = Me) {
  const {
      immediate: n,
      deep: l,
      once: r,
      scheduler: a,
      augmentJob: u,
      call: i,
    } = o,
    f = (k) => (l ? k : lt(k) || l === !1 || l === 0 ? St(k, 1) : St(k));
  let c,
    d,
    p,
    b,
    x = !1,
    A = !1;
  if (
    (Ke(e)
      ? ((d = () => e.value), (x = lt(e)))
      : fs(e)
        ? ((d = () => f(e)), (x = !0))
        : ce(e)
          ? ((A = !0),
            (x = e.some((k) => fs(k) || lt(k))),
            (d = () =>
              e.map((k) => {
                if (Ke(k)) return k.value;
                if (fs(k)) return f(k);
                if (ve(k)) return i ? i(k, 2) : k();
              })))
          : ve(e)
            ? t
              ? (d = i ? () => i(e, 2) : e)
              : (d = () => {
                  if (p) {
                    Rt();
                    try {
                      p();
                    } finally {
                      Et();
                    }
                  }
                  const k = Xt;
                  Xt = c;
                  try {
                    return i ? i(e, 3, [b]) : e(b);
                  } finally {
                    Xt = k;
                  }
                })
            : (d = bt),
    t && l)
  ) {
    const k = d,
      T = l === !0 ? 1 / 0 : l;
    d = () => St(k(), T);
  }
  const v = Pa(),
    S = () => {
      (c.stop(), v && v.active && gn(v.effects, c));
    };
  if (r && t) {
    const k = t;
    t = (...T) => {
      (k(...T), S());
    };
  }
  let _ = A ? new Array(e.length).fill(Ws) : Ws;
  const C = (k) => {
    if (!(!(c.flags & 1) || (!c.dirty && !k)))
      if (t) {
        const T = c.run();
        if (l || x || (A ? T.some((B, F) => Dt(B, _[F])) : Dt(T, _))) {
          p && p();
          const B = Xt;
          Xt = c;
          try {
            const F = [T, _ === Ws ? void 0 : A && _[0] === Ws ? [] : _, b];
            ((_ = T), i ? i(t, 3, F) : t(...F));
          } finally {
            Xt = B;
          }
        }
      } else c.run();
  };
  return (
    u && u(C),
    (c = new Gl(d)),
    (c.scheduler = a ? () => a(C, !1) : C),
    (b = (k) => ni(k, !1, c)),
    (p = c.onStop =
      () => {
        const k = co.get(c);
        if (k) {
          if (i) i(k, 4);
          else for (const T of k) T();
          co.delete(c);
        }
      }),
    t ? (n ? C(!0) : (_ = c.run())) : a ? a(C.bind(null, !0), !0) : c.run(),
    (S.pause = c.pause.bind(c)),
    (S.resume = c.resume.bind(c)),
    (S.stop = S),
    S
  );
}
function St(e, t = 1 / 0, o) {
  if (
    t <= 0 ||
    !Ee(e) ||
    e.__v_skip ||
    ((o = o || new Map()), (o.get(e) || 0) >= t)
  )
    return e;
  if ((o.set(e, t), t--, Ke(e))) St(e.value, t, o);
  else if (ce(e)) for (let n = 0; n < e.length; n++) St(e[n], t, o);
  else if (_s(e) || cs(e))
    e.forEach((n) => {
      St(n, t, o);
    });
  else if (Ql(e)) {
    for (const n in e) St(e[n], t, o);
    for (const n of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, n) && St(e[n], t, o);
  }
  return e;
}
/**
 * @vue/runtime-core v3.5.21
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function Ys(e, t, o, n) {
  try {
    return n ? e(...n) : e();
  } catch (l) {
    $o(l, t, o);
  }
}
function ct(e, t, o, n) {
  if (ve(e)) {
    const l = Ys(e, t, o, n);
    return (
      l &&
        Hl(l) &&
        l.catch((r) => {
          $o(r, t, o);
        }),
      l
    );
  }
  if (ce(e)) {
    const l = [];
    for (let r = 0; r < e.length; r++) l.push(ct(e[r], t, o, n));
    return l;
  }
}
function $o(e, t, o, n = !0) {
  const l = t ? t.vnode : null,
    { errorHandler: r, throwUnhandledErrorInProduction: a } =
      (t && t.appContext.config) || Me;
  if (t) {
    let u = t.parent;
    const i = t.proxy,
      f = `https://vuejs.org/error-reference/#runtime-${o}`;
    for (; u; ) {
      const c = u.ec;
      if (c) {
        for (let d = 0; d < c.length; d++) if (c[d](e, i, f) === !1) return;
      }
      u = u.parent;
    }
    if (r) {
      (Rt(), Ys(r, null, 10, [e, i, f]), Et());
      return;
    }
  }
  ri(e, o, l, n, a);
}
function ri(e, t, o, n = !0, l = !1) {
  if (l) throw e;
  console.error(e);
}
const qe = [];
let vt = -1;
const ps = [];
let Vt = null,
  is = 0;
const mr = Promise.resolve();
let fo = null;
function So(e) {
  const t = fo || mr;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function ai(e) {
  let t = vt + 1,
    o = qe.length;
  for (; t < o; ) {
    const n = (t + o) >>> 1,
      l = qe[n],
      r = Ns(l);
    r < e || (r === e && l.flags & 2) ? (t = n + 1) : (o = n);
  }
  return t;
}
function Cn(e) {
  if (!(e.flags & 1)) {
    const t = Ns(e),
      o = qe[qe.length - 1];
    (!o || (!(e.flags & 2) && t >= Ns(o)) ? qe.push(e) : qe.splice(ai(t), 0, e),
      (e.flags |= 1),
      gr());
  }
}
function gr() {
  fo || (fo = mr.then(hr));
}
function ii(e) {
  (ce(e)
    ? ps.push(...e)
    : Vt && e.id === -1
      ? Vt.splice(is + 1, 0, e)
      : e.flags & 1 || (ps.push(e), (e.flags |= 1)),
    gr());
}
function Un(e, t, o = vt + 1) {
  for (; o < qe.length; o++) {
    const n = qe[o];
    if (n && n.flags & 2) {
      if (e && n.id !== e.uid) continue;
      (qe.splice(o, 1),
        o--,
        n.flags & 4 && (n.flags &= -2),
        n(),
        n.flags & 4 || (n.flags &= -2));
    }
  }
}
function vr(e) {
  if (ps.length) {
    const t = [...new Set(ps)].sort((o, n) => Ns(o) - Ns(n));
    if (((ps.length = 0), Vt)) {
      Vt.push(...t);
      return;
    }
    for (Vt = t, is = 0; is < Vt.length; is++) {
      const o = Vt[is];
      (o.flags & 4 && (o.flags &= -2), o.flags & 8 || o(), (o.flags &= -2));
    }
    ((Vt = null), (is = 0));
  }
}
const Ns = (e) => (e.id == null ? (e.flags & 2 ? -1 : 1 / 0) : e.id);
function hr(e) {
  try {
    for (vt = 0; vt < qe.length; vt++) {
      const t = qe[vt];
      t &&
        !(t.flags & 8) &&
        (t.flags & 4 && (t.flags &= -2),
        Ys(t, t.i, t.i ? 15 : 14),
        t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; vt < qe.length; vt++) {
      const t = qe[vt];
      t && (t.flags &= -2);
    }
    ((vt = -1),
      (qe.length = 0),
      vr(),
      (fo = null),
      (qe.length || ps.length) && hr());
  }
}
let tt = null,
  br = null;
function po(e) {
  const t = tt;
  return ((tt = e), (br = (e && e.type.__scopeId) || null), t);
}
function $e(e, t = tt, o) {
  if (!t || e._n) return e;
  const n = (...l) => {
    n._d && ho(-1);
    const r = po(t);
    let a;
    try {
      a = e(...l);
    } finally {
      (po(r), n._d && ho(1));
    }
    return a;
  };
  return ((n._n = !0), (n._c = !0), (n._d = !0), n);
}
function oe(e, t) {
  if (tt === null) return e;
  const o = Po(tt),
    n = e.dirs || (e.dirs = []);
  for (let l = 0; l < t.length; l++) {
    let [r, a, u, i = Me] = t[l];
    r &&
      (ve(r) && (r = { mounted: r, updated: r }),
      r.deep && St(a),
      n.push({
        dir: r,
        instance: o,
        value: a,
        oldValue: void 0,
        arg: u,
        modifiers: i,
      }));
  }
  return e;
}
function Jt(e, t, o, n) {
  const l = e.dirs,
    r = t && t.dirs;
  for (let a = 0; a < l.length; a++) {
    const u = l[a];
    r && (u.oldValue = r[a].value);
    let i = u.dir[n];
    i && (Rt(), ct(i, o, 8, [e.el, u, e, t]), Et());
  }
}
const di = Symbol("_vte"),
  yr = (e) => e.__isTeleport,
  Ct = Symbol("_leaveCb"),
  Xs = Symbol("_enterCb");
function ui() {
  const e = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: new Map(),
  };
  return (
    De(() => {
      e.isMounted = !0;
    }),
    Mr(() => {
      e.isUnmounting = !0;
    }),
    e
  );
}
const nt = [Function, Array],
  xr = {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    onBeforeEnter: nt,
    onEnter: nt,
    onAfterEnter: nt,
    onEnterCancelled: nt,
    onBeforeLeave: nt,
    onLeave: nt,
    onAfterLeave: nt,
    onLeaveCancelled: nt,
    onBeforeAppear: nt,
    onAppear: nt,
    onAfterAppear: nt,
    onAppearCancelled: nt,
  },
  _r = (e) => {
    const t = e.subTree;
    return t.component ? _r(t.component) : t;
  },
  ci = {
    name: "BaseTransition",
    props: xr,
    setup(e, { slots: t }) {
      const o = Zr(),
        n = ui();
      return () => {
        const l = t.default && Ar(t.default(), !0);
        if (!l || !l.length) return;
        const r = wr(l),
          a = we(e),
          { mode: u } = a;
        if (n.isLeaving) return Ho(r);
        const i = Dn(r);
        if (!i) return Ho(r);
        let f = sn(i, a, n, o, (d) => (f = d));
        i.type !== Ge && Us(i, f);
        let c = o.subTree && Dn(o.subTree);
        if (c && c.type !== Ge && !es(c, i) && _r(o).type !== Ge) {
          let d = sn(c, a, n, o);
          if ((Us(c, d), u === "out-in" && i.type !== Ge))
            return (
              (n.isLeaving = !0),
              (d.afterLeave = () => {
                ((n.isLeaving = !1),
                  o.job.flags & 8 || o.update(),
                  delete d.afterLeave,
                  (c = void 0));
              }),
              Ho(r)
            );
          u === "in-out" && i.type !== Ge
            ? (d.delayLeave = (p, b, x) => {
                const A = kr(n, c);
                ((A[String(c.key)] = c),
                  (p[Ct] = () => {
                    (b(),
                      (p[Ct] = void 0),
                      delete f.delayedLeave,
                      (c = void 0));
                  }),
                  (f.delayedLeave = () => {
                    (x(), delete f.delayedLeave, (c = void 0));
                  }));
              })
            : (c = void 0);
        } else c && (c = void 0);
        return r;
      };
    },
  };
function wr(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const o of e)
      if (o.type !== Ge) {
        t = o;
        break;
      }
  }
  return t;
}
const fi = ci;
function kr(e, t) {
  const { leavingVNodes: o } = e;
  let n = o.get(t.type);
  return (n || ((n = Object.create(null)), o.set(t.type, n)), n);
}
function sn(e, t, o, n, l) {
  const {
      appear: r,
      mode: a,
      persisted: u = !1,
      onBeforeEnter: i,
      onEnter: f,
      onAfterEnter: c,
      onEnterCancelled: d,
      onBeforeLeave: p,
      onLeave: b,
      onAfterLeave: x,
      onLeaveCancelled: A,
      onBeforeAppear: v,
      onAppear: S,
      onAfterAppear: _,
      onAppearCancelled: C,
    } = t,
    k = String(e.key),
    T = kr(o, e),
    B = (re, ge) => {
      re && ct(re, n, 9, ge);
    },
    F = (re, ge) => {
      const he = ge[1];
      (B(re, ge),
        ce(re)
          ? re.every((X) => X.length <= 1) && he()
          : re.length <= 1 && he());
    },
    de = {
      mode: a,
      persisted: u,
      beforeEnter(re) {
        let ge = i;
        if (!o.isMounted)
          if (r) ge = v || i;
          else return;
        re[Ct] && re[Ct](!0);
        const he = T[k];
        (he && es(e, he) && he.el[Ct] && he.el[Ct](), B(ge, [re]));
      },
      enter(re) {
        let ge = f,
          he = c,
          X = d;
        if (!o.isMounted)
          if (r) ((ge = S || f), (he = _ || c), (X = C || d));
          else return;
        let xe = !1;
        const Q = (re[Xs] = (U) => {
          xe ||
            ((xe = !0),
            U ? B(X, [re]) : B(he, [re]),
            de.delayedLeave && de.delayedLeave(),
            (re[Xs] = void 0));
        });
        ge ? F(ge, [re, Q]) : Q();
      },
      leave(re, ge) {
        const he = String(e.key);
        if ((re[Xs] && re[Xs](!0), o.isUnmounting)) return ge();
        B(p, [re]);
        let X = !1;
        const xe = (re[Ct] = (Q) => {
          X ||
            ((X = !0),
            ge(),
            Q ? B(A, [re]) : B(x, [re]),
            (re[Ct] = void 0),
            T[he] === e && delete T[he]);
        });
        ((T[he] = e), b ? F(b, [re, xe]) : xe());
      },
      clone(re) {
        const ge = sn(re, t, o, n, l);
        return (l && l(ge), ge);
      },
    };
  return de;
}
function Ho(e) {
  if (Mo(e)) return ((e = Ht(e)), (e.children = null), e);
}
function Dn(e) {
  if (!Mo(e)) return yr(e.type) && e.children ? wr(e.children) : e;
  if (e.component) return e.component.subTree;
  const { shapeFlag: t, children: o } = e;
  if (o) {
    if (t & 16) return o[0];
    if (t & 32 && ve(o.default)) return o.default();
  }
}
function Us(e, t) {
  e.shapeFlag & 6 && e.component
    ? ((e.transition = t), Us(e.component.subTree, t))
    : e.shapeFlag & 128
      ? ((e.ssContent.transition = t.clone(e.ssContent)),
        (e.ssFallback.transition = t.clone(e.ssFallback)))
      : (e.transition = t);
}
function Ar(e, t = !1, o) {
  let n = [],
    l = 0;
  for (let r = 0; r < e.length; r++) {
    let a = e[r];
    const u = o == null ? a.key : String(o) + String(a.key != null ? a.key : r);
    a.type === q
      ? (a.patchFlag & 128 && l++, (n = n.concat(Ar(a.children, t, u))))
      : (t || a.type !== Ge) && n.push(u != null ? Ht(a, { key: u }) : a);
  }
  if (l > 1) for (let r = 0; r < n.length; r++) n[r].patchFlag = -2;
  return n;
}
function Cr(e, t) {
  return ve(e) ? Ue({ name: e.name }, t, { setup: e }) : e;
}
function $r(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
const mo = new WeakMap();
function Ts(e, t, o, n, l = !1) {
  if (ce(e)) {
    e.forEach((x, A) => Ts(x, t && (ce(t) ? t[A] : t), o, n, l));
    return;
  }
  if (Bs(n) && !l) {
    n.shapeFlag & 512 &&
      n.type.__asyncResolved &&
      n.component.subTree.component &&
      Ts(e, t, o, n.component.subTree);
    return;
  }
  const r = n.shapeFlag & 4 ? Po(n.component) : n.el,
    a = l ? null : r,
    { i: u, r: i } = e,
    f = t && t.r,
    c = u.refs === Me ? (u.refs = {}) : u.refs,
    d = u.setupState,
    p = we(d),
    b = d === Me ? Fl : (x) => Ce(p, x);
  if (f != null && f !== i) {
    if ((Fn(t), je(f))) ((c[f] = null), b(f) && (d[f] = null));
    else if (Ke(f)) {
      f.value = null;
      const x = t;
      x.k && (c[x.k] = null);
    }
  }
  if (ve(i)) Ys(i, u, 12, [a, c]);
  else {
    const x = je(i),
      A = Ke(i);
    if (x || A) {
      const v = () => {
        if (e.f) {
          const S = x ? (b(i) ? d[i] : c[i]) : i.value;
          if (l) ce(S) && gn(S, r);
          else if (ce(S)) S.includes(r) || S.push(r);
          else if (x) ((c[i] = [r]), b(i) && (d[i] = c[i]));
          else {
            const _ = [r];
            ((i.value = _), e.k && (c[e.k] = _));
          }
        } else
          x
            ? ((c[i] = a), b(i) && (d[i] = a))
            : A && ((i.value = a), e.k && (c[e.k] = a));
      };
      if (a) {
        const S = () => {
          (v(), mo.delete(e));
        };
        ((S.id = -1), mo.set(e, S), et(S, o));
      } else (Fn(e), v());
    }
  }
}
function Fn(e) {
  const t = mo.get(e);
  t && ((t.flags |= 8), mo.delete(e));
}
Ao().requestIdleCallback;
Ao().cancelIdleCallback;
const Bs = (e) => !!e.type.__asyncLoader,
  Mo = (e) => e.type.__isKeepAlive;
function pi(e, t) {
  Sr(e, "a", t);
}
function mi(e, t) {
  Sr(e, "da", t);
}
function Sr(e, t, o = Qe) {
  const n =
    e.__wdc ||
    (e.__wdc = () => {
      let l = o;
      for (; l; ) {
        if (l.isDeactivated) return;
        l = l.parent;
      }
      return e();
    });
  if ((Ro(t, n, o), o)) {
    let l = o.parent;
    for (; l && l.parent; )
      (Mo(l.parent.vnode) && gi(n, t, o, l), (l = l.parent));
  }
}
function gi(e, t, o, n) {
  const l = Ro(t, e, n, !0);
  $n(() => {
    gn(n[t], l);
  }, o);
}
function Ro(e, t, o = Qe, n = !1) {
  if (o) {
    const l = o[e] || (o[e] = []),
      r =
        t.__weh ||
        (t.__weh = (...a) => {
          Rt();
          const u = Js(o),
            i = ct(t, o, e, a);
          return (u(), Et(), i);
        });
    return (n ? l.unshift(r) : l.push(r), r);
  }
}
const Tt =
    (e) =>
    (t, o = Qe) => {
      (!Fs || e === "sp") && Ro(e, (...n) => t(...n), o);
    },
  vi = Tt("bm"),
  De = Tt("m"),
  hi = Tt("bu"),
  bi = Tt("u"),
  Mr = Tt("bum"),
  $n = Tt("um"),
  yi = Tt("sp"),
  xi = Tt("rtg"),
  _i = Tt("rtc");
function wi(e, t = Qe) {
  Ro("ec", e, t);
}
const Rr = "components";
function ms(e, t) {
  return Tr(Rr, e, !0, t) || e;
}
const Er = Symbol.for("v-ndc");
function go(e) {
  return je(e) ? Tr(Rr, e, !1) || e : e || Er;
}
function Tr(e, t, o = !0, n = !1) {
  const l = tt || Qe;
  if (l) {
    const r = l.type;
    {
      const u = dd(r, !1);
      if (u && (u === t || u === at(t) || u === ko(at(t)))) return r;
    }
    const a = Hn(l[e] || r[e], t) || Hn(l.appContext[e], t);
    return !a && n ? r : a;
  }
}
function Hn(e, t) {
  return e && (e[t] || e[at(t)] || e[ko(at(t))]);
}
function le(e, t, o, n) {
  let l;
  const r = o,
    a = ce(e);
  if (a || je(e)) {
    const u = a && fs(e);
    let i = !1,
      f = !1;
    (u && ((i = !lt(e)), (f = Ft(e)), (e = Co(e))), (l = new Array(e.length)));
    for (let c = 0, d = e.length; c < d; c++)
      l[c] = t(i ? (f ? uo(Fe(e[c])) : Fe(e[c])) : e[c], c, void 0, r);
  } else if (typeof e == "number") {
    l = new Array(e);
    for (let u = 0; u < e; u++) l[u] = t(u + 1, u, void 0, r);
  } else if (Ee(e))
    if (e[Symbol.iterator]) l = Array.from(e, (u, i) => t(u, i, void 0, r));
    else {
      const u = Object.keys(e);
      l = new Array(u.length);
      for (let i = 0, f = u.length; i < f; i++) {
        const c = u[i];
        l[i] = t(e[c], c, i, r);
      }
    }
  else l = [];
  return l;
}
const on = (e) => (e ? (Wr(e) ? Po(e) : on(e.parent)) : null),
  Ps = Ue(Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => on(e.parent),
    $root: (e) => on(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => Pr(e),
    $forceUpdate: (e) =>
      e.f ||
      (e.f = () => {
        Cn(e.update);
      }),
    $nextTick: (e) => e.n || (e.n = So.bind(e.proxy)),
    $watch: (e) => Hi.bind(e),
  }),
  zo = (e, t) => e !== Me && !e.__isScriptSetup && Ce(e, t),
  ki = {
    get({ _: e }, t) {
      if (t === "__v_skip") return !0;
      const {
        ctx: o,
        setupState: n,
        data: l,
        props: r,
        accessCache: a,
        type: u,
        appContext: i,
      } = e;
      let f;
      if (t[0] !== "$") {
        const b = a[t];
        if (b !== void 0)
          switch (b) {
            case 1:
              return n[t];
            case 2:
              return l[t];
            case 4:
              return o[t];
            case 3:
              return r[t];
          }
        else {
          if (zo(n, t)) return ((a[t] = 1), n[t]);
          if (l !== Me && Ce(l, t)) return ((a[t] = 2), l[t]);
          if ((f = e.propsOptions[0]) && Ce(f, t)) return ((a[t] = 3), r[t]);
          if (o !== Me && Ce(o, t)) return ((a[t] = 4), o[t]);
          nn && (a[t] = 0);
        }
      }
      const c = Ps[t];
      let d, p;
      if (c) return (t === "$attrs" && ze(e.attrs, "get", ""), c(e));
      if ((d = u.__cssModules) && (d = d[t])) return d;
      if (o !== Me && Ce(o, t)) return ((a[t] = 4), o[t]);
      if (((p = i.config.globalProperties), Ce(p, t))) return p[t];
    },
    set({ _: e }, t, o) {
      const { data: n, setupState: l, ctx: r } = e;
      return zo(l, t)
        ? ((l[t] = o), !0)
        : n !== Me && Ce(n, t)
          ? ((n[t] = o), !0)
          : Ce(e.props, t) || (t[0] === "$" && t.slice(1) in e)
            ? !1
            : ((r[t] = o), !0);
    },
    has(
      {
        _: {
          data: e,
          setupState: t,
          accessCache: o,
          ctx: n,
          appContext: l,
          propsOptions: r,
          type: a,
        },
      },
      u,
    ) {
      let i, f;
      return !!(
        o[u] ||
        (e !== Me && u[0] !== "$" && Ce(e, u)) ||
        zo(t, u) ||
        ((i = r[0]) && Ce(i, u)) ||
        Ce(n, u) ||
        Ce(Ps, u) ||
        Ce(l.config.globalProperties, u) ||
        ((f = a.__cssModules) && f[u])
      );
    },
    defineProperty(e, t, o) {
      return (
        o.get != null
          ? (e._.accessCache[t] = 0)
          : Ce(o, "value") && this.set(e, t, o.value, null),
        Reflect.defineProperty(e, t, o)
      );
    },
  };
function zn(e) {
  return ce(e) ? e.reduce((t, o) => ((t[o] = null), t), {}) : e;
}
let nn = !0;
function Ai(e) {
  const t = Pr(e),
    o = e.proxy,
    n = e.ctx;
  ((nn = !1), t.beforeCreate && Qn(t.beforeCreate, e, "bc"));
  const {
    data: l,
    computed: r,
    methods: a,
    watch: u,
    provide: i,
    inject: f,
    created: c,
    beforeMount: d,
    mounted: p,
    beforeUpdate: b,
    updated: x,
    activated: A,
    deactivated: v,
    beforeDestroy: S,
    beforeUnmount: _,
    destroyed: C,
    unmounted: k,
    render: T,
    renderTracked: B,
    renderTriggered: F,
    errorCaptured: de,
    serverPrefetch: re,
    expose: ge,
    inheritAttrs: he,
    components: X,
    directives: xe,
    filters: Q,
  } = t;
  if ((f && Ci(f, n, null), a))
    for (const ee in a) {
      const me = a[ee];
      ve(me) && (n[ee] = me.bind(o));
    }
  if (l) {
    const ee = l.call(o, o);
    Ee(ee) && (e.data = Kt(ee));
  }
  if (((nn = !0), r))
    for (const ee in r) {
      const me = r[ee],
        Le = ve(me) ? me.bind(o, o) : ve(me.get) ? me.get.bind(o, o) : bt,
        Oe = !ve(me) && ve(me.set) ? me.set.bind(o) : bt,
        Ve = pe({ get: Le, set: Oe });
      Object.defineProperty(n, ee, {
        enumerable: !0,
        configurable: !0,
        get: () => Ve.value,
        set: (Ne) => (Ve.value = Ne),
      });
    }
  if (u) for (const ee in u) Br(u[ee], n, o, ee);
  if (i) {
    const ee = ve(i) ? i.call(o) : i;
    Reflect.ownKeys(ee).forEach((me) => {
      oo(me, ee[me]);
    });
  }
  c && Qn(c, e, "c");
  function H(ee, me) {
    ce(me) ? me.forEach((Le) => ee(Le.bind(o))) : me && ee(me.bind(o));
  }
  if (
    (H(vi, d),
    H(De, p),
    H(hi, b),
    H(bi, x),
    H(pi, A),
    H(mi, v),
    H(wi, de),
    H(_i, B),
    H(xi, F),
    H(Mr, _),
    H($n, k),
    H(yi, re),
    ce(ge))
  )
    if (ge.length) {
      const ee = e.exposed || (e.exposed = {});
      ge.forEach((me) => {
        Object.defineProperty(ee, me, {
          get: () => o[me],
          set: (Le) => (o[me] = Le),
          enumerable: !0,
        });
      });
    } else e.exposed || (e.exposed = {});
  (T && e.render === bt && (e.render = T),
    he != null && (e.inheritAttrs = he),
    X && (e.components = X),
    xe && (e.directives = xe),
    re && $r(e));
}
function Ci(e, t, o = bt) {
  ce(e) && (e = ln(e));
  for (const n in e) {
    const l = e[n];
    let r;
    (Ee(l)
      ? "default" in l
        ? (r = ut(l.from || n, l.default, !0))
        : (r = ut(l.from || n))
      : (r = ut(l)),
      Ke(r)
        ? Object.defineProperty(t, n, {
            enumerable: !0,
            configurable: !0,
            get: () => r.value,
            set: (a) => (r.value = a),
          })
        : (t[n] = r));
  }
}
function Qn(e, t, o) {
  ct(ce(e) ? e.map((n) => n.bind(t.proxy)) : e.bind(t.proxy), t, o);
}
function Br(e, t, o, n) {
  let l = n.includes(".") ? Kr(o, n) : () => o[n];
  if (je(e)) {
    const r = t[e];
    ve(r) && Re(l, r);
  } else if (ve(e)) Re(l, e.bind(o));
  else if (Ee(e))
    if (ce(e)) e.forEach((r) => Br(r, t, o, n));
    else {
      const r = ve(e.handler) ? e.handler.bind(o) : t[e.handler];
      ve(r) && Re(l, r, e);
    }
}
function Pr(e) {
  const t = e.type,
    { mixins: o, extends: n } = t,
    {
      mixins: l,
      optionsCache: r,
      config: { optionMergeStrategies: a },
    } = e.appContext,
    u = r.get(t);
  let i;
  return (
    u
      ? (i = u)
      : !l.length && !o && !n
        ? (i = t)
        : ((i = {}),
          l.length && l.forEach((f) => vo(i, f, a, !0)),
          vo(i, t, a)),
    Ee(t) && r.set(t, i),
    i
  );
}
function vo(e, t, o, n = !1) {
  const { mixins: l, extends: r } = t;
  (r && vo(e, r, o, !0), l && l.forEach((a) => vo(e, a, o, !0)));
  for (const a in t)
    if (!(n && a === "expose")) {
      const u = $i[a] || (o && o[a]);
      e[a] = u ? u(e[a], t[a]) : t[a];
    }
  return e;
}
const $i = {
  data: Kn,
  props: Yn,
  emits: Yn,
  methods: Ss,
  computed: Ss,
  beforeCreate: Je,
  created: Je,
  beforeMount: Je,
  mounted: Je,
  beforeUpdate: Je,
  updated: Je,
  beforeDestroy: Je,
  beforeUnmount: Je,
  destroyed: Je,
  unmounted: Je,
  activated: Je,
  deactivated: Je,
  errorCaptured: Je,
  serverPrefetch: Je,
  components: Ss,
  directives: Ss,
  watch: Mi,
  provide: Kn,
  inject: Si,
};
function Kn(e, t) {
  return t
    ? e
      ? function () {
          return Ue(
            ve(e) ? e.call(this, this) : e,
            ve(t) ? t.call(this, this) : t,
          );
        }
      : t
    : e;
}
function Si(e, t) {
  return Ss(ln(e), ln(t));
}
function ln(e) {
  if (ce(e)) {
    const t = {};
    for (let o = 0; o < e.length; o++) t[e[o]] = e[o];
    return t;
  }
  return e;
}
function Je(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Ss(e, t) {
  return e ? Ue(Object.create(null), e, t) : t;
}
function Yn(e, t) {
  return e
    ? ce(e) && ce(t)
      ? [...new Set([...e, ...t])]
      : Ue(Object.create(null), zn(e), zn(t ?? {}))
    : t;
}
function Mi(e, t) {
  if (!e) return t;
  if (!t) return e;
  const o = Ue(Object.create(null), e);
  for (const n in t) o[n] = Je(e[n], t[n]);
  return o;
}
function Ir() {
  return {
    app: null,
    config: {
      isNativeTag: Fl,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {},
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null),
    optionsCache: new WeakMap(),
    propsCache: new WeakMap(),
    emitsCache: new WeakMap(),
  };
}
let Ri = 0;
function Ei(e, t) {
  return function (n, l = null) {
    (ve(n) || (n = Ue({}, n)), l != null && !Ee(l) && (l = null));
    const r = Ir(),
      a = new WeakSet(),
      u = [];
    let i = !1;
    const f = (r.app = {
      _uid: Ri++,
      _component: n,
      _props: l,
      _container: null,
      _context: r,
      _instance: null,
      version: cd,
      get config() {
        return r.config;
      },
      set config(c) {},
      use(c, ...d) {
        return (
          a.has(c) ||
            (c && ve(c.install)
              ? (a.add(c), c.install(f, ...d))
              : ve(c) && (a.add(c), c(f, ...d))),
          f
        );
      },
      mixin(c) {
        return (r.mixins.includes(c) || r.mixins.push(c), f);
      },
      component(c, d) {
        return d ? ((r.components[c] = d), f) : r.components[c];
      },
      directive(c, d) {
        return d ? ((r.directives[c] = d), f) : r.directives[c];
      },
      mount(c, d, p) {
        if (!i) {
          const b = f._ceVNode || Y(n, l);
          return (
            (b.appContext = r),
            p === !0 ? (p = "svg") : p === !1 && (p = void 0),
            e(b, c, p),
            (i = !0),
            (f._container = c),
            (c.__vue_app__ = f),
            Po(b.component)
          );
        }
      },
      onUnmount(c) {
        u.push(c);
      },
      unmount() {
        i &&
          (ct(u, f._instance, 16),
          e(null, f._container),
          delete f._container.__vue_app__);
      },
      provide(c, d) {
        return ((r.provides[c] = d), f);
      },
      runWithContext(c) {
        const d = gs;
        gs = f;
        try {
          return c();
        } finally {
          gs = d;
        }
      },
    });
    return f;
  };
}
let gs = null;
function oo(e, t) {
  if (Qe) {
    let o = Qe.provides;
    const n = Qe.parent && Qe.parent.provides;
    (n === o && (o = Qe.provides = Object.create(n)), (o[e] = t));
  }
}
function ut(e, t, o = !1) {
  const n = Zr();
  if (n || gs) {
    let l = gs
      ? gs._context.provides
      : n
        ? n.parent == null || n.ce
          ? n.vnode.appContext && n.vnode.appContext.provides
          : n.parent.provides
        : void 0;
    if (l && e in l) return l[e];
    if (arguments.length > 1) return o && ve(t) ? t.call(n && n.proxy) : t;
  }
}
const jr = {},
  Lr = () => Object.create(jr),
  Or = (e) => Object.getPrototypeOf(e) === jr;
function Ti(e, t, o, n = !1) {
  const l = {},
    r = Lr();
  ((e.propsDefaults = Object.create(null)), Vr(e, t, l, r));
  for (const a in e.propsOptions[0]) a in l || (l[a] = void 0);
  (o ? (e.props = n ? l : ur(l)) : e.type.props ? (e.props = l) : (e.props = r),
    (e.attrs = r));
}
function Bi(e, t, o, n) {
  const {
      props: l,
      attrs: r,
      vnode: { patchFlag: a },
    } = e,
    u = we(l),
    [i] = e.propsOptions;
  let f = !1;
  if ((n || a > 0) && !(a & 16)) {
    if (a & 8) {
      const c = e.vnode.dynamicProps;
      for (let d = 0; d < c.length; d++) {
        let p = c[d];
        if (Eo(e.emitsOptions, p)) continue;
        const b = t[p];
        if (i)
          if (Ce(r, p)) b !== r[p] && ((r[p] = b), (f = !0));
          else {
            const x = at(p);
            l[x] = rn(i, u, x, b, e, !1);
          }
        else b !== r[p] && ((r[p] = b), (f = !0));
      }
    }
  } else {
    Vr(e, t, l, r) && (f = !0);
    let c;
    for (const d in u)
      (!t || (!Ce(t, d) && ((c = os(d)) === d || !Ce(t, c)))) &&
        (i
          ? o &&
            (o[d] !== void 0 || o[c] !== void 0) &&
            (l[d] = rn(i, u, d, void 0, e, !0))
          : delete l[d]);
    if (r !== u)
      for (const d in r) (!t || !Ce(t, d)) && (delete r[d], (f = !0));
  }
  f && $t(e.attrs, "set", "");
}
function Vr(e, t, o, n) {
  const [l, r] = e.propsOptions;
  let a = !1,
    u;
  if (t)
    for (let i in t) {
      if (Ms(i)) continue;
      const f = t[i];
      let c;
      l && Ce(l, (c = at(i)))
        ? !r || !r.includes(c)
          ? (o[c] = f)
          : ((u || (u = {}))[c] = f)
        : Eo(e.emitsOptions, i) ||
          ((!(i in n) || f !== n[i]) && ((n[i] = f), (a = !0)));
    }
  if (r) {
    const i = we(o),
      f = u || Me;
    for (let c = 0; c < r.length; c++) {
      const d = r[c];
      o[d] = rn(l, i, d, f[d], e, !Ce(f, d));
    }
  }
  return a;
}
function rn(e, t, o, n, l, r) {
  const a = e[o];
  if (a != null) {
    const u = Ce(a, "default");
    if (u && n === void 0) {
      const i = a.default;
      if (a.type !== Function && !a.skipFactory && ve(i)) {
        const { propsDefaults: f } = l;
        if (o in f) n = f[o];
        else {
          const c = Js(l);
          ((n = f[o] = i.call(null, t)), c());
        }
      } else n = i;
      l.ce && l.ce._setProp(o, n);
    }
    a[0] &&
      (r && !u ? (n = !1) : a[1] && (n === "" || n === os(o)) && (n = !0));
  }
  return n;
}
const Pi = new WeakMap();
function Nr(e, t, o = !1) {
  const n = o ? Pi : t.propsCache,
    l = n.get(e);
  if (l) return l;
  const r = e.props,
    a = {},
    u = [];
  let i = !1;
  if (!ve(e)) {
    const c = (d) => {
      i = !0;
      const [p, b] = Nr(d, t, !0);
      (Ue(a, p), b && u.push(...b));
    };
    (!o && t.mixins.length && t.mixins.forEach(c),
      e.extends && c(e.extends),
      e.mixins && e.mixins.forEach(c));
  }
  if (!r && !i) return (Ee(e) && n.set(e, us), us);
  if (ce(r))
    for (let c = 0; c < r.length; c++) {
      const d = at(r[c]);
      Jn(d) && (a[d] = Me);
    }
  else if (r)
    for (const c in r) {
      const d = at(c);
      if (Jn(d)) {
        const p = r[c],
          b = (a[d] = ce(p) || ve(p) ? { type: p } : Ue({}, p)),
          x = b.type;
        let A = !1,
          v = !0;
        if (ce(x))
          for (let S = 0; S < x.length; ++S) {
            const _ = x[S],
              C = ve(_) && _.name;
            if (C === "Boolean") {
              A = !0;
              break;
            } else C === "String" && (v = !1);
          }
        else A = ve(x) && x.name === "Boolean";
        ((b[0] = A), (b[1] = v), (A || Ce(b, "default")) && u.push(d));
      }
    }
  const f = [a, u];
  return (Ee(e) && n.set(e, f), f);
}
function Jn(e) {
  return e[0] !== "$" && !Ms(e);
}
const Sn = (e) => e === "_" || e === "_ctx" || e === "$stable",
  Mn = (e) => (ce(e) ? e.map(ht) : [ht(e)]),
  Ii = (e, t, o) => {
    if (t._n) return t;
    const n = $e((...l) => Mn(t(...l)), o);
    return ((n._c = !1), n);
  },
  Ur = (e, t, o) => {
    const n = e._ctx;
    for (const l in e) {
      if (Sn(l)) continue;
      const r = e[l];
      if (ve(r)) t[l] = Ii(l, r, n);
      else if (r != null) {
        const a = Mn(r);
        t[l] = () => a;
      }
    }
  },
  Dr = (e, t) => {
    const o = Mn(t);
    e.slots.default = () => o;
  },
  Fr = (e, t, o) => {
    for (const n in t) (o || !Sn(n)) && (e[n] = t[n]);
  },
  ji = (e, t, o) => {
    const n = (e.slots = Lr());
    if (e.vnode.shapeFlag & 32) {
      const l = t._;
      l ? (Fr(n, t, o), o && Kl(n, "_", l, !0)) : Ur(t, n);
    } else t && Dr(e, t);
  },
  Li = (e, t, o) => {
    const { vnode: n, slots: l } = e;
    let r = !0,
      a = Me;
    if (n.shapeFlag & 32) {
      const u = t._;
      (u
        ? o && u === 1
          ? (r = !1)
          : Fr(l, t, o)
        : ((r = !t.$stable), Ur(t, l)),
        (a = t));
    } else t && (Dr(e, t), (a = { default: 1 }));
    if (r) for (const u in l) !Sn(u) && a[u] == null && delete l[u];
  },
  et = Zi;
function Oi(e) {
  return Vi(e);
}
function Vi(e, t) {
  const o = Ao();
  o.__VUE__ = !0;
  const {
      insert: n,
      remove: l,
      patchProp: r,
      createElement: a,
      createText: u,
      createComment: i,
      setText: f,
      setElementText: c,
      parentNode: d,
      nextSibling: p,
      setScopeId: b = bt,
      insertStaticContent: x,
    } = e,
    A = (
      h,
      y,
      E,
      P = null,
      V = null,
      N = null,
      W = void 0,
      G = null,
      J = !!y.dynamicChildren,
    ) => {
      if (h === y) return;
      (h && !es(h, y) && ((P = O(h)), Ne(h, V, N, !0), (h = null)),
        y.patchFlag === -2 && ((J = !1), (y.dynamicChildren = null)));
      const { type: z, ref: ae, shapeFlag: te } = y;
      switch (z) {
        case To:
          v(h, y, E, P);
          break;
        case Ge:
          S(h, y, E, P);
          break;
        case no:
          h == null && _(y, E, P, W);
          break;
        case q:
          X(h, y, E, P, V, N, W, G, J);
          break;
        default:
          te & 1
            ? T(h, y, E, P, V, N, W, G, J)
            : te & 6
              ? xe(h, y, E, P, V, N, W, G, J)
              : (te & 64 || te & 128) &&
                z.process(h, y, E, P, V, N, W, G, J, L);
      }
      ae != null && V
        ? Ts(ae, h && h.ref, N, y || h, !y)
        : ae == null && h && h.ref != null && Ts(h.ref, null, N, h, !0);
    },
    v = (h, y, E, P) => {
      if (h == null) n((y.el = u(y.children)), E, P);
      else {
        const V = (y.el = h.el);
        y.children !== h.children && f(V, y.children);
      }
    },
    S = (h, y, E, P) => {
      h == null ? n((y.el = i(y.children || "")), E, P) : (y.el = h.el);
    },
    _ = (h, y, E, P) => {
      [h.el, h.anchor] = x(h.children, y, E, P, h.el, h.anchor);
    },
    C = ({ el: h, anchor: y }, E, P) => {
      let V;
      for (; h && h !== y; ) ((V = p(h)), n(h, E, P), (h = V));
      n(y, E, P);
    },
    k = ({ el: h, anchor: y }) => {
      let E;
      for (; h && h !== y; ) ((E = p(h)), l(h), (h = E));
      l(y);
    },
    T = (h, y, E, P, V, N, W, G, J) => {
      (y.type === "svg" ? (W = "svg") : y.type === "math" && (W = "mathml"),
        h == null ? B(y, E, P, V, N, W, G, J) : re(h, y, V, N, W, G, J));
    },
    B = (h, y, E, P, V, N, W, G) => {
      let J, z;
      const { props: ae, shapeFlag: te, transition: j, dirs: R } = h;
      if (
        ((J = h.el = a(h.type, N, ae && ae.is, ae)),
        te & 8
          ? c(J, h.children)
          : te & 16 && de(h.children, J, null, P, V, Qo(h, N), W, G),
        R && Jt(h, null, P, "created"),
        F(J, h, h.scopeId, W, P),
        ae)
      ) {
        for (const ne in ae)
          ne !== "value" && !Ms(ne) && r(J, ne, null, ae[ne], N, P);
        ("value" in ae && r(J, "value", null, ae.value, N),
          (z = ae.onVnodeBeforeMount) && gt(z, P, h));
      }
      R && Jt(h, null, P, "beforeMount");
      const I = Ni(V, j);
      (I && j.beforeEnter(J),
        n(J, y, E),
        ((z = ae && ae.onVnodeMounted) || I || R) &&
          et(() => {
            (z && gt(z, P, h), I && j.enter(J), R && Jt(h, null, P, "mounted"));
          }, V));
    },
    F = (h, y, E, P, V) => {
      if ((E && b(h, E), P)) for (let N = 0; N < P.length; N++) b(h, P[N]);
      if (V) {
        let N = V.subTree;
        if (
          y === N ||
          (Jr(N.type) && (N.ssContent === y || N.ssFallback === y))
        ) {
          const W = V.vnode;
          F(h, W, W.scopeId, W.slotScopeIds, V.parent);
        }
      }
    },
    de = (h, y, E, P, V, N, W, G, J = 0) => {
      for (let z = J; z < h.length; z++) {
        const ae = (h[z] = G ? Nt(h[z]) : ht(h[z]));
        A(null, ae, y, E, P, V, N, W, G);
      }
    },
    re = (h, y, E, P, V, N, W) => {
      const G = (y.el = h.el);
      let { patchFlag: J, dynamicChildren: z, dirs: ae } = y;
      J |= h.patchFlag & 16;
      const te = h.props || Me,
        j = y.props || Me;
      let R;
      if (
        (E && qt(E, !1),
        (R = j.onVnodeBeforeUpdate) && gt(R, E, y, h),
        ae && Jt(y, h, E, "beforeUpdate"),
        E && qt(E, !0),
        ((te.innerHTML && j.innerHTML == null) ||
          (te.textContent && j.textContent == null)) &&
          c(G, ""),
        z
          ? ge(h.dynamicChildren, z, G, E, P, Qo(y, V), N)
          : W || me(h, y, G, null, E, P, Qo(y, V), N, !1),
        J > 0)
      ) {
        if (J & 16) he(G, te, j, E, V);
        else if (
          (J & 2 && te.class !== j.class && r(G, "class", null, j.class, V),
          J & 4 && r(G, "style", te.style, j.style, V),
          J & 8)
        ) {
          const I = y.dynamicProps;
          for (let ne = 0; ne < I.length; ne++) {
            const ue = I[ne],
              _e = te[ue],
              Be = j[ue];
            (Be !== _e || ue === "value") && r(G, ue, _e, Be, V, E);
          }
        }
        J & 1 && h.children !== y.children && c(G, y.children);
      } else !W && z == null && he(G, te, j, E, V);
      ((R = j.onVnodeUpdated) || ae) &&
        et(() => {
          (R && gt(R, E, y, h), ae && Jt(y, h, E, "updated"));
        }, P);
    },
    ge = (h, y, E, P, V, N, W) => {
      for (let G = 0; G < y.length; G++) {
        const J = h[G],
          z = y[G],
          ae =
            J.el && (J.type === q || !es(J, z) || J.shapeFlag & 198)
              ? d(J.el)
              : E;
        A(J, z, ae, null, P, V, N, W, !0);
      }
    },
    he = (h, y, E, P, V) => {
      if (y !== E) {
        if (y !== Me)
          for (const N in y) !Ms(N) && !(N in E) && r(h, N, y[N], null, V, P);
        for (const N in E) {
          if (Ms(N)) continue;
          const W = E[N],
            G = y[N];
          W !== G && N !== "value" && r(h, N, G, W, V, P);
        }
        "value" in E && r(h, "value", y.value, E.value, V);
      }
    },
    X = (h, y, E, P, V, N, W, G, J) => {
      const z = (y.el = h ? h.el : u("")),
        ae = (y.anchor = h ? h.anchor : u(""));
      let { patchFlag: te, dynamicChildren: j, slotScopeIds: R } = y;
      (R && (G = G ? G.concat(R) : R),
        h == null
          ? (n(z, E, P),
            n(ae, E, P),
            de(y.children || [], E, ae, V, N, W, G, J))
          : te > 0 && te & 64 && j && h.dynamicChildren
            ? (ge(h.dynamicChildren, j, E, V, N, W, G),
              (y.key != null || (V && y === V.subTree)) && Hr(h, y, !0))
            : me(h, y, E, ae, V, N, W, G, J));
    },
    xe = (h, y, E, P, V, N, W, G, J) => {
      ((y.slotScopeIds = G),
        h == null
          ? y.shapeFlag & 512
            ? V.ctx.activate(y, E, P, W, J)
            : Q(y, E, P, V, N, W, J)
          : U(h, y, J));
    },
    Q = (h, y, E, P, V, N, W) => {
      const G = (h.component = nd(h, P, V));
      if ((Mo(h) && (G.ctx.renderer = L), ld(G, !1, W), G.asyncDep)) {
        if ((V && V.registerDep(G, H, W), !h.el)) {
          const J = (G.subTree = Y(Ge));
          (S(null, J, y, E), (h.placeholder = J.el));
        }
      } else H(G, h, y, E, V, N, W);
    },
    U = (h, y, E) => {
      const P = (y.component = h.component);
      if (qi(h, y, E))
        if (P.asyncDep && !P.asyncResolved) {
          ee(P, y, E);
          return;
        } else ((P.next = y), P.update());
      else ((y.el = h.el), (P.vnode = y));
    },
    H = (h, y, E, P, V, N, W) => {
      const G = () => {
        if (h.isMounted) {
          let { next: te, bu: j, u: R, parent: I, vnode: ne } = h;
          {
            const fe = zr(h);
            if (fe) {
              (te && ((te.el = ne.el), ee(h, te, W)),
                fe.asyncDep.then(() => {
                  h.isUnmounted || G();
                }));
              return;
            }
          }
          let ue = te,
            _e;
          (qt(h, !1),
            te ? ((te.el = ne.el), ee(h, te, W)) : (te = ne),
            j && so(j),
            (_e = te.props && te.props.onVnodeBeforeUpdate) &&
              gt(_e, I, te, ne),
            qt(h, !0));
          const Be = Gn(h),
            Pe = h.subTree;
          ((h.subTree = Be),
            A(Pe, Be, d(Pe.el), O(Pe), h, V, N),
            (te.el = Be.el),
            ue === null && Gi(h, Be.el),
            R && et(R, V),
            (_e = te.props && te.props.onVnodeUpdated) &&
              et(() => gt(_e, I, te, ne), V));
        } else {
          let te;
          const { el: j, props: R } = y,
            { bm: I, m: ne, parent: ue, root: _e, type: Be } = h,
            Pe = Bs(y);
          (qt(h, !1),
            I && so(I),
            !Pe && (te = R && R.onVnodeBeforeMount) && gt(te, ue, y),
            qt(h, !0));
          {
            _e.ce &&
              _e.ce._def.shadowRoot !== !1 &&
              _e.ce._injectChildStyle(Be);
            const fe = (h.subTree = Gn(h));
            (A(null, fe, E, P, h, V, N), (y.el = fe.el));
          }
          if ((ne && et(ne, V), !Pe && (te = R && R.onVnodeMounted))) {
            const fe = y;
            et(() => gt(te, ue, fe), V);
          }
          ((y.shapeFlag & 256 ||
            (ue && Bs(ue.vnode) && ue.vnode.shapeFlag & 256)) &&
            h.a &&
            et(h.a, V),
            (h.isMounted = !0),
            (y = E = P = null));
        }
      };
      h.scope.on();
      const J = (h.effect = new Gl(G));
      h.scope.off();
      const z = (h.update = J.run.bind(J)),
        ae = (h.job = J.runIfDirty.bind(J));
      ((ae.i = h),
        (ae.id = h.uid),
        (J.scheduler = () => Cn(ae)),
        qt(h, !0),
        z());
    },
    ee = (h, y, E) => {
      y.component = h;
      const P = h.vnode.props;
      ((h.vnode = y),
        (h.next = null),
        Bi(h, y.props, P, E),
        Li(h, y.children, E),
        Rt(),
        Un(h),
        Et());
    },
    me = (h, y, E, P, V, N, W, G, J = !1) => {
      const z = h && h.children,
        ae = h ? h.shapeFlag : 0,
        te = y.children,
        { patchFlag: j, shapeFlag: R } = y;
      if (j > 0) {
        if (j & 128) {
          Oe(z, te, E, P, V, N, W, G, J);
          return;
        } else if (j & 256) {
          Le(z, te, E, P, V, N, W, G, J);
          return;
        }
      }
      R & 8
        ? (ae & 16 && He(z, V, N), te !== z && c(E, te))
        : ae & 16
          ? R & 16
            ? Oe(z, te, E, P, V, N, W, G, J)
            : He(z, V, N, !0)
          : (ae & 8 && c(E, ""), R & 16 && de(te, E, P, V, N, W, G, J));
    },
    Le = (h, y, E, P, V, N, W, G, J) => {
      ((h = h || us), (y = y || us));
      const z = h.length,
        ae = y.length,
        te = Math.min(z, ae);
      let j;
      for (j = 0; j < te; j++) {
        const R = (y[j] = J ? Nt(y[j]) : ht(y[j]));
        A(h[j], R, E, null, V, N, W, G, J);
      }
      z > ae ? He(h, V, N, !0, !1, te) : de(y, E, P, V, N, W, G, J, te);
    },
    Oe = (h, y, E, P, V, N, W, G, J) => {
      let z = 0;
      const ae = y.length;
      let te = h.length - 1,
        j = ae - 1;
      for (; z <= te && z <= j; ) {
        const R = h[z],
          I = (y[z] = J ? Nt(y[z]) : ht(y[z]));
        if (es(R, I)) A(R, I, E, null, V, N, W, G, J);
        else break;
        z++;
      }
      for (; z <= te && z <= j; ) {
        const R = h[te],
          I = (y[j] = J ? Nt(y[j]) : ht(y[j]));
        if (es(R, I)) A(R, I, E, null, V, N, W, G, J);
        else break;
        (te--, j--);
      }
      if (z > te) {
        if (z <= j) {
          const R = j + 1,
            I = R < ae ? y[R].el : P;
          for (; z <= j; )
            (A(null, (y[z] = J ? Nt(y[z]) : ht(y[z])), E, I, V, N, W, G, J),
              z++);
        }
      } else if (z > j) for (; z <= te; ) (Ne(h[z], V, N, !0), z++);
      else {
        const R = z,
          I = z,
          ne = new Map();
        for (z = I; z <= j; z++) {
          const Xe = (y[z] = J ? Nt(y[z]) : ht(y[z]));
          Xe.key != null && ne.set(Xe.key, z);
        }
        let ue,
          _e = 0;
        const Be = j - I + 1;
        let Pe = !1,
          fe = 0;
        const Ye = new Array(Be);
        for (z = 0; z < Be; z++) Ye[z] = 0;
        for (z = R; z <= te; z++) {
          const Xe = h[z];
          if (_e >= Be) {
            Ne(Xe, V, N, !0);
            continue;
          }
          let mt;
          if (Xe.key != null) mt = ne.get(Xe.key);
          else
            for (ue = I; ue <= j; ue++)
              if (Ye[ue - I] === 0 && es(Xe, y[ue])) {
                mt = ue;
                break;
              }
          mt === void 0
            ? Ne(Xe, V, N, !0)
            : ((Ye[mt - I] = z + 1),
              mt >= fe ? (fe = mt) : (Pe = !0),
              A(Xe, y[mt], E, null, V, N, W, G, J),
              _e++);
        }
        const rs = Pe ? Ui(Ye) : us;
        for (ue = rs.length - 1, z = Be - 1; z >= 0; z--) {
          const Xe = I + z,
            mt = y[Xe],
            In = y[Xe + 1],
            jn = Xe + 1 < ae ? In.el || In.placeholder : P;
          Ye[z] === 0
            ? A(null, mt, E, jn, V, N, W, G, J)
            : Pe && (ue < 0 || z !== rs[ue] ? Ve(mt, E, jn, 2) : ue--);
        }
      }
    },
    Ve = (h, y, E, P, V = null) => {
      const { el: N, type: W, transition: G, children: J, shapeFlag: z } = h;
      if (z & 6) {
        Ve(h.component.subTree, y, E, P);
        return;
      }
      if (z & 128) {
        h.suspense.move(y, E, P);
        return;
      }
      if (z & 64) {
        W.move(h, y, E, L);
        return;
      }
      if (W === q) {
        n(N, y, E);
        for (let te = 0; te < J.length; te++) Ve(J[te], y, E, P);
        n(h.anchor, y, E);
        return;
      }
      if (W === no) {
        C(h, y, E);
        return;
      }
      if (P !== 2 && z & 1 && G)
        if (P === 0) (G.beforeEnter(N), n(N, y, E), et(() => G.enter(N), V));
        else {
          const { leave: te, delayLeave: j, afterLeave: R } = G,
            I = () => {
              h.ctx.isUnmounted ? l(N) : n(N, y, E);
            },
            ne = () => {
              (N._isLeaving && N[Ct](!0),
                te(N, () => {
                  (I(), R && R());
                }));
            };
          j ? j(N, I, ne) : ne();
        }
      else n(N, y, E);
    },
    Ne = (h, y, E, P = !1, V = !1) => {
      const {
        type: N,
        props: W,
        ref: G,
        children: J,
        dynamicChildren: z,
        shapeFlag: ae,
        patchFlag: te,
        dirs: j,
        cacheIndex: R,
      } = h;
      if (
        (te === -2 && (V = !1),
        G != null && (Rt(), Ts(G, null, E, h, !0), Et()),
        R != null && (y.renderCache[R] = void 0),
        ae & 256)
      ) {
        y.ctx.deactivate(h);
        return;
      }
      const I = ae & 1 && j,
        ne = !Bs(h);
      let ue;
      if ((ne && (ue = W && W.onVnodeBeforeUnmount) && gt(ue, y, h), ae & 6))
        Pt(h.component, E, P);
      else {
        if (ae & 128) {
          h.suspense.unmount(E, P);
          return;
        }
        (I && Jt(h, null, y, "beforeUnmount"),
          ae & 64
            ? h.type.remove(h, y, E, L, P)
            : z && !z.hasOnce && (N !== q || (te > 0 && te & 64))
              ? He(z, y, E, !1, !0)
              : ((N === q && te & 384) || (!V && ae & 16)) && He(J, y, E),
          P && it(h));
      }
      ((ne && (ue = W && W.onVnodeUnmounted)) || I) &&
        et(() => {
          (ue && gt(ue, y, h), I && Jt(h, null, y, "unmounted"));
        }, E);
    },
    it = (h) => {
      const { type: y, el: E, anchor: P, transition: V } = h;
      if (y === q) {
        pt(E, P);
        return;
      }
      if (y === no) {
        k(h);
        return;
      }
      const N = () => {
        (l(E), V && !V.persisted && V.afterLeave && V.afterLeave());
      };
      if (h.shapeFlag & 1 && V && !V.persisted) {
        const { leave: W, delayLeave: G } = V,
          J = () => W(E, N);
        G ? G(h.el, N, J) : J();
      } else N();
    },
    pt = (h, y) => {
      let E;
      for (; h !== y; ) ((E = p(h)), l(h), (h = E));
      l(y);
    },
    Pt = (h, y, E) => {
      const { bum: P, scope: V, job: N, subTree: W, um: G, m: J, a: z } = h;
      (qn(J),
        qn(z),
        P && so(P),
        V.stop(),
        N && ((N.flags |= 8), Ne(W, h, y, E)),
        G && et(G, y),
        et(() => {
          h.isUnmounted = !0;
        }, y));
    },
    He = (h, y, E, P = !1, V = !1, N = 0) => {
      for (let W = N; W < h.length; W++) Ne(h[W], y, E, P, V);
    },
    O = (h) => {
      if (h.shapeFlag & 6) return O(h.component.subTree);
      if (h.shapeFlag & 128) return h.suspense.next();
      const y = p(h.anchor || h.el),
        E = y && y[di];
      return E ? p(E) : y;
    };
  let se = !1;
  const M = (h, y, E) => {
      (h == null
        ? y._vnode && Ne(y._vnode, null, null, !0)
        : A(y._vnode || null, h, y, null, null, null, E),
        (y._vnode = h),
        se || ((se = !0), Un(), vr(), (se = !1)));
    },
    L = {
      p: A,
      um: Ne,
      m: Ve,
      r: it,
      mt: Q,
      mc: de,
      pc: me,
      pbc: ge,
      n: O,
      o: e,
    };
  return { render: M, hydrate: void 0, createApp: Ei(M) };
}
function Qo({ type: e, props: t }, o) {
  return (o === "svg" && e === "foreignObject") ||
    (o === "mathml" &&
      e === "annotation-xml" &&
      t &&
      t.encoding &&
      t.encoding.includes("html"))
    ? void 0
    : o;
}
function qt({ effect: e, job: t }, o) {
  o ? ((e.flags |= 32), (t.flags |= 4)) : ((e.flags &= -33), (t.flags &= -5));
}
function Ni(e, t) {
  return (!e || (e && !e.pendingBranch)) && t && !t.persisted;
}
function Hr(e, t, o = !1) {
  const n = e.children,
    l = t.children;
  if (ce(n) && ce(l))
    for (let r = 0; r < n.length; r++) {
      const a = n[r];
      let u = l[r];
      (u.shapeFlag & 1 &&
        !u.dynamicChildren &&
        ((u.patchFlag <= 0 || u.patchFlag === 32) &&
          ((u = l[r] = Nt(l[r])), (u.el = a.el)),
        !o && u.patchFlag !== -2 && Hr(a, u)),
        u.type === To && u.patchFlag !== -1 && (u.el = a.el),
        u.type === Ge && !u.el && (u.el = a.el));
    }
}
function Ui(e) {
  const t = e.slice(),
    o = [0];
  let n, l, r, a, u;
  const i = e.length;
  for (n = 0; n < i; n++) {
    const f = e[n];
    if (f !== 0) {
      if (((l = o[o.length - 1]), e[l] < f)) {
        ((t[n] = l), o.push(n));
        continue;
      }
      for (r = 0, a = o.length - 1; r < a; )
        ((u = (r + a) >> 1), e[o[u]] < f ? (r = u + 1) : (a = u));
      f < e[o[r]] && (r > 0 && (t[n] = o[r - 1]), (o[r] = n));
    }
  }
  for (r = o.length, a = o[r - 1]; r-- > 0; ) ((o[r] = a), (a = t[a]));
  return o;
}
function zr(e) {
  const t = e.subTree.component;
  if (t) return t.asyncDep && !t.asyncResolved ? t : zr(t);
}
function qn(e) {
  if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
const Di = Symbol.for("v-scx"),
  Fi = () => ut(Di);
function Re(e, t, o) {
  return Qr(e, t, o);
}
function Qr(e, t, o = Me) {
  const { immediate: n, deep: l, flush: r, once: a } = o,
    u = Ue({}, o),
    i = (t && n) || (!t && r !== "post");
  let f;
  if (Fs) {
    if (r === "sync") {
      const b = Fi();
      f = b.__watcherHandles || (b.__watcherHandles = []);
    } else if (!i) {
      const b = () => {};
      return ((b.stop = bt), (b.resume = bt), (b.pause = bt), b);
    }
  }
  const c = Qe;
  u.call = (b, x, A) => ct(b, c, x, A);
  let d = !1;
  (r === "post"
    ? (u.scheduler = (b) => {
        et(b, c && c.suspense);
      })
    : r !== "sync" &&
      ((d = !0),
      (u.scheduler = (b, x) => {
        x ? b() : Cn(b);
      })),
    (u.augmentJob = (b) => {
      (t && (b.flags |= 4),
        d && ((b.flags |= 2), c && ((b.id = c.uid), (b.i = c))));
    }));
  const p = li(e, t, u);
  return (Fs && (f ? f.push(p) : i && p()), p);
}
function Hi(e, t, o) {
  const n = this.proxy,
    l = je(e) ? (e.includes(".") ? Kr(n, e) : () => n[e]) : e.bind(n, n);
  let r;
  ve(t) ? (r = t) : ((r = t.handler), (o = t));
  const a = Js(this),
    u = Qr(l, r.bind(n), o);
  return (a(), u);
}
function Kr(e, t) {
  const o = t.split(".");
  return () => {
    let n = e;
    for (let l = 0; l < o.length && n; l++) n = n[o[l]];
    return n;
  };
}
const zi = (e, t) =>
  t === "modelValue" || t === "model-value"
    ? e.modelModifiers
    : e[`${t}Modifiers`] || e[`${at(t)}Modifiers`] || e[`${os(t)}Modifiers`];
function Qi(e, t, ...o) {
  if (e.isUnmounted) return;
  const n = e.vnode.props || Me;
  let l = o;
  const r = t.startsWith("update:"),
    a = r && zi(n, t.slice(7));
  a &&
    (a.trim && (l = o.map((c) => (je(c) ? c.trim() : c))),
    a.number && (l = o.map(io)));
  let u,
    i = n[(u = Vo(t))] || n[(u = Vo(at(t)))];
  (!i && r && (i = n[(u = Vo(os(t)))]), i && ct(i, e, 6, l));
  const f = n[u + "Once"];
  if (f) {
    if (!e.emitted) e.emitted = {};
    else if (e.emitted[u]) return;
    ((e.emitted[u] = !0), ct(f, e, 6, l));
  }
}
const Ki = new WeakMap();
function Yr(e, t, o = !1) {
  const n = o ? Ki : t.emitsCache,
    l = n.get(e);
  if (l !== void 0) return l;
  const r = e.emits;
  let a = {},
    u = !1;
  if (!ve(e)) {
    const i = (f) => {
      const c = Yr(f, t, !0);
      c && ((u = !0), Ue(a, c));
    };
    (!o && t.mixins.length && t.mixins.forEach(i),
      e.extends && i(e.extends),
      e.mixins && e.mixins.forEach(i));
  }
  return !r && !u
    ? (Ee(e) && n.set(e, null), null)
    : (ce(r) ? r.forEach((i) => (a[i] = null)) : Ue(a, r),
      Ee(e) && n.set(e, a),
      a);
}
function Eo(e, t) {
  return !e || !_o(t)
    ? !1
    : ((t = t.slice(2).replace(/Once$/, "")),
      Ce(e, t[0].toLowerCase() + t.slice(1)) || Ce(e, os(t)) || Ce(e, t));
}
function Gn(e) {
  const {
      type: t,
      vnode: o,
      proxy: n,
      withProxy: l,
      propsOptions: [r],
      slots: a,
      attrs: u,
      emit: i,
      render: f,
      renderCache: c,
      props: d,
      data: p,
      setupState: b,
      ctx: x,
      inheritAttrs: A,
    } = e,
    v = po(e);
  let S, _;
  try {
    if (o.shapeFlag & 4) {
      const k = l || n,
        T = k;
      ((S = ht(f.call(T, k, c, d, b, p, x))), (_ = u));
    } else {
      const k = t;
      ((S = ht(
        k.length > 1 ? k(d, { attrs: u, slots: a, emit: i }) : k(d, null),
      )),
        (_ = t.props ? u : Yi(u)));
    }
  } catch (k) {
    ((Is.length = 0), $o(k, e, 1), (S = Y(Ge)));
  }
  let C = S;
  if (_ && A !== !1) {
    const k = Object.keys(_),
      { shapeFlag: T } = C;
    k.length &&
      T & 7 &&
      (r && k.some(mn) && (_ = Ji(_, r)), (C = Ht(C, _, !1, !0)));
  }
  return (
    o.dirs &&
      ((C = Ht(C, null, !1, !0)),
      (C.dirs = C.dirs ? C.dirs.concat(o.dirs) : o.dirs)),
    o.transition && Us(C, o.transition),
    (S = C),
    po(v),
    S
  );
}
const Yi = (e) => {
    let t;
    for (const o in e)
      (o === "class" || o === "style" || _o(o)) && ((t || (t = {}))[o] = e[o]);
    return t;
  },
  Ji = (e, t) => {
    const o = {};
    for (const n in e) (!mn(n) || !(n.slice(9) in t)) && (o[n] = e[n]);
    return o;
  };
function qi(e, t, o) {
  const { props: n, children: l, component: r } = e,
    { props: a, children: u, patchFlag: i } = t,
    f = r.emitsOptions;
  if (t.dirs || t.transition) return !0;
  if (o && i >= 0) {
    if (i & 1024) return !0;
    if (i & 16) return n ? Zn(n, a, f) : !!a;
    if (i & 8) {
      const c = t.dynamicProps;
      for (let d = 0; d < c.length; d++) {
        const p = c[d];
        if (a[p] !== n[p] && !Eo(f, p)) return !0;
      }
    }
  } else
    return (l || u) && (!u || !u.$stable)
      ? !0
      : n === a
        ? !1
        : n
          ? a
            ? Zn(n, a, f)
            : !0
          : !!a;
  return !1;
}
function Zn(e, t, o) {
  const n = Object.keys(t);
  if (n.length !== Object.keys(e).length) return !0;
  for (let l = 0; l < n.length; l++) {
    const r = n[l];
    if (t[r] !== e[r] && !Eo(o, r)) return !0;
  }
  return !1;
}
function Gi({ vnode: e, parent: t }, o) {
  for (; t; ) {
    const n = t.subTree;
    if ((n.suspense && n.suspense.activeBranch === e && (n.el = e.el), n === e))
      (((e = t.vnode).el = o), (t = t.parent));
    else break;
  }
}
const Jr = (e) => e.__isSuspense;
function Zi(e, t) {
  t && t.pendingBranch
    ? ce(e)
      ? t.effects.push(...e)
      : t.effects.push(e)
    : ii(e);
}
const q = Symbol.for("v-fgt"),
  To = Symbol.for("v-txt"),
  Ge = Symbol.for("v-cmt"),
  no = Symbol.for("v-stc"),
  Is = [];
let st = null;
function m(e = !1) {
  Is.push((st = e ? null : []));
}
function Wi() {
  (Is.pop(), (st = Is[Is.length - 1] || null));
}
let Ds = 1;
function ho(e, t = !1) {
  ((Ds += e), e < 0 && st && t && (st.hasOnce = !0));
}
function qr(e) {
  return (
    (e.dynamicChildren = Ds > 0 ? st || us : null),
    Wi(),
    Ds > 0 && st && st.push(e),
    e
  );
}
function g(e, t, o, n, l, r) {
  return qr(s(e, t, o, n, l, r, !0));
}
function ke(e, t, o, n, l) {
  return qr(Y(e, t, o, n, l, !0));
}
function bo(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function es(e, t) {
  return e.type === t.type && e.key === t.key;
}
const Gr = ({ key: e }) => e ?? null,
  lo = ({ ref: e, ref_key: t, ref_for: o }) => (
    typeof e == "number" && (e = "" + e),
    e != null
      ? je(e) || Ke(e) || ve(e)
        ? { i: tt, r: e, k: t, f: !!o }
        : e
      : null
  );
function s(
  e,
  t = null,
  o = null,
  n = 0,
  l = null,
  r = e === q ? 0 : 1,
  a = !1,
  u = !1,
) {
  const i = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Gr(t),
    ref: t && lo(t),
    scopeId: br,
    slotScopeIds: null,
    children: o,
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
    shapeFlag: r,
    patchFlag: n,
    dynamicProps: l,
    dynamicChildren: null,
    appContext: null,
    ctx: tt,
  };
  return (
    u
      ? (Rn(i, o), r & 128 && e.normalize(i))
      : o && (i.shapeFlag |= je(o) ? 8 : 16),
    Ds > 0 &&
      !a &&
      st &&
      (i.patchFlag > 0 || r & 6) &&
      i.patchFlag !== 32 &&
      st.push(i),
    i
  );
}
const Y = Xi;
function Xi(e, t = null, o = null, n = 0, l = null, r = !1) {
  if (((!e || e === Er) && (e = Ge), bo(e))) {
    const u = Ht(e, t, !0);
    return (
      o && Rn(u, o),
      Ds > 0 &&
        !r &&
        st &&
        (u.shapeFlag & 6 ? (st[st.indexOf(e)] = u) : st.push(u)),
      (u.patchFlag = -2),
      u
    );
  }
  if ((ud(e) && (e = e.__vccOpts), t)) {
    t = ed(t);
    let { class: u, style: i } = t;
    (u && !je(u) && (t.class = Z(u)),
      Ee(i) && (An(i) && !ce(i) && (i = Ue({}, i)), (t.style = vs(i))));
  }
  const a = je(e) ? 1 : Jr(e) ? 128 : yr(e) ? 64 : Ee(e) ? 4 : ve(e) ? 2 : 0;
  return s(e, t, o, n, l, a, r, !0);
}
function ed(e) {
  return e ? (An(e) || Or(e) ? Ue({}, e) : e) : null;
}
function Ht(e, t, o = !1, n = !1) {
  const { props: l, ref: r, patchFlag: a, children: u, transition: i } = e,
    f = t ? td(l || {}, t) : l,
    c = {
      __v_isVNode: !0,
      __v_skip: !0,
      type: e.type,
      props: f,
      key: f && Gr(f),
      ref:
        t && t.ref
          ? o && r
            ? ce(r)
              ? r.concat(lo(t))
              : [r, lo(t)]
            : lo(t)
          : r,
      scopeId: e.scopeId,
      slotScopeIds: e.slotScopeIds,
      children: u,
      target: e.target,
      targetStart: e.targetStart,
      targetAnchor: e.targetAnchor,
      staticCount: e.staticCount,
      shapeFlag: e.shapeFlag,
      patchFlag: t && e.type !== q ? (a === -1 ? 16 : a | 16) : a,
      dynamicProps: e.dynamicProps,
      dynamicChildren: e.dynamicChildren,
      appContext: e.appContext,
      dirs: e.dirs,
      transition: i,
      component: e.component,
      suspense: e.suspense,
      ssContent: e.ssContent && Ht(e.ssContent),
      ssFallback: e.ssFallback && Ht(e.ssFallback),
      placeholder: e.placeholder,
      el: e.el,
      anchor: e.anchor,
      ctx: e.ctx,
      ce: e.ce,
    };
  return (i && n && Us(c, i.clone(c)), c);
}
function ye(e = " ", t = 0) {
  return Y(To, null, e, t);
}
function Bo(e, t) {
  const o = Y(no, null, e);
  return ((o.staticCount = t), o);
}
function K(e = "", t = !1) {
  return t ? (m(), ke(Ge, null, e)) : Y(Ge, null, e);
}
function ht(e) {
  return e == null || typeof e == "boolean"
    ? Y(Ge)
    : ce(e)
      ? Y(q, null, e.slice())
      : bo(e)
        ? Nt(e)
        : Y(To, null, String(e));
}
function Nt(e) {
  return (e.el === null && e.patchFlag !== -1) || e.memo ? e : Ht(e);
}
function Rn(e, t) {
  let o = 0;
  const { shapeFlag: n } = e;
  if (t == null) t = null;
  else if (ce(t)) o = 16;
  else if (typeof t == "object")
    if (n & 65) {
      const l = t.default;
      l && (l._c && (l._d = !1), Rn(e, l()), l._c && (l._d = !0));
      return;
    } else {
      o = 32;
      const l = t._;
      !l && !Or(t)
        ? (t._ctx = tt)
        : l === 3 &&
          tt &&
          (tt.slots._ === 1 ? (t._ = 1) : ((t._ = 2), (e.patchFlag |= 1024)));
    }
  else
    ve(t)
      ? ((t = { default: t, _ctx: tt }), (o = 32))
      : ((t = String(t)), n & 64 ? ((o = 16), (t = [ye(t)])) : (o = 8));
  ((e.children = t), (e.shapeFlag |= o));
}
function td(...e) {
  const t = {};
  for (let o = 0; o < e.length; o++) {
    const n = e[o];
    for (const l in n)
      if (l === "class")
        t.class !== n.class && (t.class = Z([t.class, n.class]));
      else if (l === "style") t.style = vs([t.style, n.style]);
      else if (_o(l)) {
        const r = t[l],
          a = n[l];
        a &&
          r !== a &&
          !(ce(r) && r.includes(a)) &&
          (t[l] = r ? [].concat(r, a) : a);
      } else l !== "" && (t[l] = n[l]);
  }
  return t;
}
function gt(e, t, o, n = null) {
  ct(e, t, 7, [o, n]);
}
const sd = Ir();
let od = 0;
function nd(e, t, o) {
  const n = e.type,
    l = (t ? t.appContext : e.appContext) || sd,
    r = {
      uid: od++,
      vnode: e,
      type: n,
      parent: t,
      appContext: l,
      root: null,
      next: null,
      subTree: null,
      effect: null,
      update: null,
      job: null,
      scope: new Ba(!0),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: t ? t.provides : Object.create(l.provides),
      ids: t ? t.ids : ["", 0, 0],
      accessCache: null,
      renderCache: [],
      components: null,
      directives: null,
      propsOptions: Nr(n, l),
      emitsOptions: Yr(n, l),
      emit: null,
      emitted: null,
      propsDefaults: Me,
      inheritAttrs: n.inheritAttrs,
      ctx: Me,
      data: Me,
      props: Me,
      attrs: Me,
      slots: Me,
      refs: Me,
      setupState: Me,
      setupContext: null,
      suspense: o,
      suspenseId: o ? o.pendingId : 0,
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
      sp: null,
    };
  return (
    (r.ctx = { _: r }),
    (r.root = t ? t.root : r),
    (r.emit = Qi.bind(null, r)),
    e.ce && e.ce(r),
    r
  );
}
let Qe = null;
const Zr = () => Qe || tt;
let yo, an;
{
  const e = Ao(),
    t = (o, n) => {
      let l;
      return (
        (l = e[o]) || (l = e[o] = []),
        l.push(n),
        (r) => {
          l.length > 1 ? l.forEach((a) => a(r)) : l[0](r);
        }
      );
    };
  ((yo = t("__VUE_INSTANCE_SETTERS__", (o) => (Qe = o))),
    (an = t("__VUE_SSR_SETTERS__", (o) => (Fs = o))));
}
const Js = (e) => {
    const t = Qe;
    return (
      yo(e),
      e.scope.on(),
      () => {
        (e.scope.off(), yo(t));
      }
    );
  },
  Wn = () => {
    (Qe && Qe.scope.off(), yo(null));
  };
function Wr(e) {
  return e.vnode.shapeFlag & 4;
}
let Fs = !1;
function ld(e, t = !1, o = !1) {
  t && an(t);
  const { props: n, children: l } = e.vnode,
    r = Wr(e);
  (Ti(e, n, r, t), ji(e, l, o || t));
  const a = r ? rd(e, t) : void 0;
  return (t && an(!1), a);
}
function rd(e, t) {
  const o = e.type;
  ((e.accessCache = Object.create(null)), (e.proxy = new Proxy(e.ctx, ki)));
  const { setup: n } = o;
  if (n) {
    Rt();
    const l = (e.setupContext = n.length > 1 ? id(e) : null),
      r = Js(e),
      a = Ys(n, e, 0, [e.props, l]),
      u = Hl(a);
    if ((Et(), r(), (u || e.sp) && !Bs(e) && $r(e), u)) {
      if ((a.then(Wn, Wn), t))
        return a
          .then((i) => {
            Xn(e, i);
          })
          .catch((i) => {
            $o(i, e, 0);
          });
      e.asyncDep = a;
    } else Xn(e, a);
  } else Xr(e);
}
function Xn(e, t, o) {
  (ve(t)
    ? e.type.__ssrInlineRender
      ? (e.ssrRender = t)
      : (e.render = t)
    : Ee(t) && (e.setupState = pr(t)),
    Xr(e));
}
function Xr(e, t, o) {
  const n = e.type;
  e.render || (e.render = n.render || bt);
  {
    const l = Js(e);
    Rt();
    try {
      Ai(e);
    } finally {
      (Et(), l());
    }
  }
}
const ad = {
  get(e, t) {
    return (ze(e, "get", ""), e[t]);
  },
};
function id(e) {
  const t = (o) => {
    e.exposed = o || {};
  };
  return {
    attrs: new Proxy(e.attrs, ad),
    slots: e.slots,
    emit: e.emit,
    expose: t,
  };
}
function Po(e) {
  return e.exposed
    ? e.exposeProxy ||
        (e.exposeProxy = new Proxy(pr(Wa(e.exposed)), {
          get(t, o) {
            if (o in t) return t[o];
            if (o in Ps) return Ps[o](e);
          },
          has(t, o) {
            return o in t || o in Ps;
          },
        }))
    : e.proxy;
}
function dd(e, t = !0) {
  return ve(e) ? e.displayName || e.name : e.name || (t && e.__name);
}
function ud(e) {
  return ve(e) && "__vccOpts" in e;
}
const pe = (e, t) => oi(e, t, Fs);
function hs(e, t, o) {
  const n = (r, a, u) => {
      ho(-1);
      try {
        return Y(r, a, u);
      } finally {
        ho(1);
      }
    },
    l = arguments.length;
  return l === 2
    ? Ee(t) && !ce(t)
      ? bo(t)
        ? n(e, null, [t])
        : n(e, t)
      : n(e, null, t)
    : (l > 3
        ? (o = Array.prototype.slice.call(arguments, 2))
        : l === 3 && bo(o) && (o = [o]),
      n(e, t, o));
}
const cd = "3.5.21";
/**
 * @vue/runtime-dom v3.5.21
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ let dn;
const el = typeof window < "u" && window.trustedTypes;
if (el)
  try {
    dn = el.createPolicy("vue", { createHTML: (e) => e });
  } catch {}
const ea = dn ? (e) => dn.createHTML(e) : (e) => e,
  fd = "http://www.w3.org/2000/svg",
  pd = "http://www.w3.org/1998/Math/MathML",
  At = typeof document < "u" ? document : null,
  tl = At && At.createElement("template"),
  md = {
    insert: (e, t, o) => {
      t.insertBefore(e, o || null);
    },
    remove: (e) => {
      const t = e.parentNode;
      t && t.removeChild(e);
    },
    createElement: (e, t, o, n) => {
      const l =
        t === "svg"
          ? At.createElementNS(fd, e)
          : t === "mathml"
            ? At.createElementNS(pd, e)
            : o
              ? At.createElement(e, { is: o })
              : At.createElement(e);
      return (
        e === "select" &&
          n &&
          n.multiple != null &&
          l.setAttribute("multiple", n.multiple),
        l
      );
    },
    createText: (e) => At.createTextNode(e),
    createComment: (e) => At.createComment(e),
    setText: (e, t) => {
      e.nodeValue = t;
    },
    setElementText: (e, t) => {
      e.textContent = t;
    },
    parentNode: (e) => e.parentNode,
    nextSibling: (e) => e.nextSibling,
    querySelector: (e) => At.querySelector(e),
    setScopeId(e, t) {
      e.setAttribute(t, "");
    },
    insertStaticContent(e, t, o, n, l, r) {
      const a = o ? o.previousSibling : t.lastChild;
      if (l && (l === r || l.nextSibling))
        for (
          ;
          t.insertBefore(l.cloneNode(!0), o),
            !(l === r || !(l = l.nextSibling));
        );
      else {
        tl.innerHTML = ea(
          n === "svg"
            ? `<svg>${e}</svg>`
            : n === "mathml"
              ? `<math>${e}</math>`
              : e,
        );
        const u = tl.content;
        if (n === "svg" || n === "mathml") {
          const i = u.firstChild;
          for (; i.firstChild; ) u.appendChild(i.firstChild);
          u.removeChild(i);
        }
        t.insertBefore(u, o);
      }
      return [
        a ? a.nextSibling : t.firstChild,
        o ? o.previousSibling : t.lastChild,
      ];
    },
  },
  It = "transition",
  ks = "animation",
  Hs = Symbol("_vtc"),
  ta = {
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
    leaveToClass: String,
  },
  gd = Ue({}, xr, ta),
  vd = (e) => ((e.displayName = "Transition"), (e.props = gd), e),
  Ie = vd((e, { slots: t }) => hs(fi, hd(e), t)),
  Gt = (e, t = []) => {
    ce(e) ? e.forEach((o) => o(...t)) : e && e(...t);
  },
  sl = (e) => (e ? (ce(e) ? e.some((t) => t.length > 1) : e.length > 1) : !1);
function hd(e) {
  const t = {};
  for (const X in e) X in ta || (t[X] = e[X]);
  if (e.css === !1) return t;
  const {
      name: o = "v",
      type: n,
      duration: l,
      enterFromClass: r = `${o}-enter-from`,
      enterActiveClass: a = `${o}-enter-active`,
      enterToClass: u = `${o}-enter-to`,
      appearFromClass: i = r,
      appearActiveClass: f = a,
      appearToClass: c = u,
      leaveFromClass: d = `${o}-leave-from`,
      leaveActiveClass: p = `${o}-leave-active`,
      leaveToClass: b = `${o}-leave-to`,
    } = e,
    x = bd(l),
    A = x && x[0],
    v = x && x[1],
    {
      onBeforeEnter: S,
      onEnter: _,
      onEnterCancelled: C,
      onLeave: k,
      onLeaveCancelled: T,
      onBeforeAppear: B = S,
      onAppear: F = _,
      onAppearCancelled: de = C,
    } = t,
    re = (X, xe, Q, U) => {
      ((X._enterCancelled = U), Zt(X, xe ? c : u), Zt(X, xe ? f : a), Q && Q());
    },
    ge = (X, xe) => {
      ((X._isLeaving = !1), Zt(X, d), Zt(X, b), Zt(X, p), xe && xe());
    },
    he = (X) => (xe, Q) => {
      const U = X ? F : _,
        H = () => re(xe, X, Q);
      (Gt(U, [xe, H]),
        ol(() => {
          (Zt(xe, X ? i : r), wt(xe, X ? c : u), sl(U) || nl(xe, n, A, H));
        }));
    };
  return Ue(t, {
    onBeforeEnter(X) {
      (Gt(S, [X]), wt(X, r), wt(X, a));
    },
    onBeforeAppear(X) {
      (Gt(B, [X]), wt(X, i), wt(X, f));
    },
    onEnter: he(!1),
    onAppear: he(!0),
    onLeave(X, xe) {
      X._isLeaving = !0;
      const Q = () => ge(X, xe);
      (wt(X, d),
        X._enterCancelled ? (wt(X, p), al()) : (al(), wt(X, p)),
        ol(() => {
          X._isLeaving && (Zt(X, d), wt(X, b), sl(k) || nl(X, n, v, Q));
        }),
        Gt(k, [X, Q]));
    },
    onEnterCancelled(X) {
      (re(X, !1, void 0, !0), Gt(C, [X]));
    },
    onAppearCancelled(X) {
      (re(X, !0, void 0, !0), Gt(de, [X]));
    },
    onLeaveCancelled(X) {
      (ge(X), Gt(T, [X]));
    },
  });
}
function bd(e) {
  if (e == null) return null;
  if (Ee(e)) return [Ko(e.enter), Ko(e.leave)];
  {
    const t = Ko(e);
    return [t, t];
  }
}
function Ko(e) {
  return Aa(e);
}
function wt(e, t) {
  (t.split(/\s+/).forEach((o) => o && e.classList.add(o)),
    (e[Hs] || (e[Hs] = new Set())).add(t));
}
function Zt(e, t) {
  t.split(/\s+/).forEach((n) => n && e.classList.remove(n));
  const o = e[Hs];
  o && (o.delete(t), o.size || (e[Hs] = void 0));
}
function ol(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
let yd = 0;
function nl(e, t, o, n) {
  const l = (e._endId = ++yd),
    r = () => {
      l === e._endId && n();
    };
  if (o != null) return setTimeout(r, o);
  const { type: a, timeout: u, propCount: i } = xd(e, t);
  if (!a) return n();
  const f = a + "end";
  let c = 0;
  const d = () => {
      (e.removeEventListener(f, p), r());
    },
    p = (b) => {
      b.target === e && ++c >= i && d();
    };
  (setTimeout(() => {
    c < i && d();
  }, u + 1),
    e.addEventListener(f, p));
}
function xd(e, t) {
  const o = window.getComputedStyle(e),
    n = (x) => (o[x] || "").split(", "),
    l = n(`${It}Delay`),
    r = n(`${It}Duration`),
    a = ll(l, r),
    u = n(`${ks}Delay`),
    i = n(`${ks}Duration`),
    f = ll(u, i);
  let c = null,
    d = 0,
    p = 0;
  t === It
    ? a > 0 && ((c = It), (d = a), (p = r.length))
    : t === ks
      ? f > 0 && ((c = ks), (d = f), (p = i.length))
      : ((d = Math.max(a, f)),
        (c = d > 0 ? (a > f ? It : ks) : null),
        (p = c ? (c === It ? r.length : i.length) : 0));
  const b =
    c === It &&
    /\b(?:transform|all)(?:,|$)/.test(n(`${It}Property`).toString());
  return { type: c, timeout: d, propCount: p, hasTransform: b };
}
function ll(e, t) {
  for (; e.length < t.length; ) e = e.concat(e);
  return Math.max(...t.map((o, n) => rl(o) + rl(e[n])));
}
function rl(e) {
  return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function al() {
  return document.body.offsetHeight;
}
function _d(e, t, o) {
  const n = e[Hs];
  (n && (t = (t ? [t, ...n] : [...n]).join(" ")),
    t == null
      ? e.removeAttribute("class")
      : o
        ? e.setAttribute("class", t)
        : (e.className = t));
}
const xo = Symbol("_vod"),
  sa = Symbol("_vsh"),
  eo = {
    name: "show",
    beforeMount(e, { value: t }, { transition: o }) {
      ((e[xo] = e.style.display === "none" ? "" : e.style.display),
        o && t ? o.beforeEnter(e) : As(e, t));
    },
    mounted(e, { value: t }, { transition: o }) {
      o && t && o.enter(e);
    },
    updated(e, { value: t, oldValue: o }, { transition: n }) {
      !t != !o &&
        (n
          ? t
            ? (n.beforeEnter(e), As(e, !0), n.enter(e))
            : n.leave(e, () => {
                As(e, !1);
              })
          : As(e, t));
    },
    beforeUnmount(e, { value: t }) {
      As(e, t);
    },
  };
function As(e, t) {
  ((e.style.display = t ? e[xo] : "none"), (e[sa] = !t));
}
const wd = Symbol(""),
  kd = /(?:^|;)\s*display\s*:/;
function Ad(e, t, o) {
  const n = e.style,
    l = je(o);
  let r = !1;
  if (o && !l) {
    if (t)
      if (je(t))
        for (const a of t.split(";")) {
          const u = a.slice(0, a.indexOf(":")).trim();
          o[u] == null && ro(n, u, "");
        }
      else for (const a in t) o[a] == null && ro(n, a, "");
    for (const a in o) (a === "display" && (r = !0), ro(n, a, o[a]));
  } else if (l) {
    if (t !== o) {
      const a = n[wd];
      (a && (o += ";" + a), (n.cssText = o), (r = kd.test(o)));
    }
  } else t && e.removeAttribute("style");
  xo in e && ((e[xo] = r ? n.display : ""), e[sa] && (n.display = "none"));
}
const il = /\s*!important$/;
function ro(e, t, o) {
  if (ce(o)) o.forEach((n) => ro(e, t, n));
  else if ((o == null && (o = ""), t.startsWith("--"))) e.setProperty(t, o);
  else {
    const n = Cd(e, t);
    il.test(o)
      ? e.setProperty(os(n), o.replace(il, ""), "important")
      : (e[n] = o);
  }
}
const dl = ["Webkit", "Moz", "ms"],
  Yo = {};
function Cd(e, t) {
  const o = Yo[t];
  if (o) return o;
  let n = at(t);
  if (n !== "filter" && n in e) return (Yo[t] = n);
  n = ko(n);
  for (let l = 0; l < dl.length; l++) {
    const r = dl[l] + n;
    if (r in e) return (Yo[t] = r);
  }
  return t;
}
const ul = "http://www.w3.org/1999/xlink";
function cl(e, t, o, n, l, r = Ea(t)) {
  n && t.startsWith("xlink:")
    ? o == null
      ? e.removeAttributeNS(ul, t.slice(6, t.length))
      : e.setAttributeNS(ul, t, o)
    : o == null || (r && !Yl(o))
      ? e.removeAttribute(t)
      : e.setAttribute(t, r ? "" : yt(o) ? String(o) : o);
}
function fl(e, t, o, n, l) {
  if (t === "innerHTML" || t === "textContent") {
    o != null && (e[t] = t === "innerHTML" ? ea(o) : o);
    return;
  }
  const r = e.tagName;
  if (t === "value" && r !== "PROGRESS" && !r.includes("-")) {
    const u = r === "OPTION" ? e.getAttribute("value") || "" : e.value,
      i = o == null ? (e.type === "checkbox" ? "on" : "") : String(o);
    ((u !== i || !("_value" in e)) && (e.value = i),
      o == null && e.removeAttribute(t),
      (e._value = o));
    return;
  }
  let a = !1;
  if (o === "" || o == null) {
    const u = typeof e[t];
    u === "boolean"
      ? (o = Yl(o))
      : o == null && u === "string"
        ? ((o = ""), (a = !0))
        : u === "number" && ((o = 0), (a = !0));
  }
  try {
    e[t] = o;
  } catch {}
  a && e.removeAttribute(l || t);
}
function Mt(e, t, o, n) {
  e.addEventListener(t, o, n);
}
function $d(e, t, o, n) {
  e.removeEventListener(t, o, n);
}
const pl = Symbol("_vei");
function Sd(e, t, o, n, l = null) {
  const r = e[pl] || (e[pl] = {}),
    a = r[t];
  if (n && a) a.value = n;
  else {
    const [u, i] = Md(t);
    if (n) {
      const f = (r[t] = Td(n, l));
      Mt(e, u, f, i);
    } else a && ($d(e, u, a, i), (r[t] = void 0));
  }
}
const ml = /(?:Once|Passive|Capture)$/;
function Md(e) {
  let t;
  if (ml.test(e)) {
    t = {};
    let n;
    for (; (n = e.match(ml)); )
      ((e = e.slice(0, e.length - n[0].length)), (t[n[0].toLowerCase()] = !0));
  }
  return [e[2] === ":" ? e.slice(3) : os(e.slice(2)), t];
}
let Jo = 0;
const Rd = Promise.resolve(),
  Ed = () => Jo || (Rd.then(() => (Jo = 0)), (Jo = Date.now()));
function Td(e, t) {
  const o = (n) => {
    if (!n._vts) n._vts = Date.now();
    else if (n._vts <= o.attached) return;
    ct(Bd(n, o.value), t, 5, [n]);
  };
  return ((o.value = e), (o.attached = Ed()), o);
}
function Bd(e, t) {
  if (ce(t)) {
    const o = e.stopImmediatePropagation;
    return (
      (e.stopImmediatePropagation = () => {
        (o.call(e), (e._stopped = !0));
      }),
      t.map((n) => (l) => !l._stopped && n && n(l))
    );
  } else return t;
}
const gl = (e) =>
    e.charCodeAt(0) === 111 &&
    e.charCodeAt(1) === 110 &&
    e.charCodeAt(2) > 96 &&
    e.charCodeAt(2) < 123,
  Pd = (e, t, o, n, l, r) => {
    const a = l === "svg";
    t === "class"
      ? _d(e, n, a)
      : t === "style"
        ? Ad(e, o, n)
        : _o(t)
          ? mn(t) || Sd(e, t, o, n, r)
          : (
                t[0] === "."
                  ? ((t = t.slice(1)), !0)
                  : t[0] === "^"
                    ? ((t = t.slice(1)), !1)
                    : Id(e, t, n, a)
              )
            ? (fl(e, t, n),
              !e.tagName.includes("-") &&
                (t === "value" || t === "checked" || t === "selected") &&
                cl(e, t, n, a, r, t !== "value"))
            : e._isVueCE && (/[A-Z]/.test(t) || !je(n))
              ? fl(e, at(t), n, r, t)
              : (t === "true-value"
                  ? (e._trueValue = n)
                  : t === "false-value" && (e._falseValue = n),
                cl(e, t, n, a));
  };
function Id(e, t, o, n) {
  if (n)
    return !!(
      t === "innerHTML" ||
      t === "textContent" ||
      (t in e && gl(t) && ve(o))
    );
  if (
    t === "spellcheck" ||
    t === "draggable" ||
    t === "translate" ||
    t === "autocorrect" ||
    t === "form" ||
    (t === "list" && e.tagName === "INPUT") ||
    (t === "type" && e.tagName === "TEXTAREA")
  )
    return !1;
  if (t === "width" || t === "height") {
    const l = e.tagName;
    if (l === "IMG" || l === "VIDEO" || l === "CANVAS" || l === "SOURCE")
      return !1;
  }
  return gl(t) && je(o) ? !1 : t in e;
}
const zt = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return ce(t) ? (o) => so(t, o) : t;
};
function jd(e) {
  e.target.composing = !0;
}
function vl(e) {
  const t = e.target;
  t.composing && ((t.composing = !1), t.dispatchEvent(new Event("input")));
}
const rt = Symbol("_assign"),
  be = {
    created(e, { modifiers: { lazy: t, trim: o, number: n } }, l) {
      e[rt] = zt(l);
      const r = n || (l.props && l.props.type === "number");
      (Mt(e, t ? "change" : "input", (a) => {
        if (a.target.composing) return;
        let u = e.value;
        (o && (u = u.trim()), r && (u = io(u)), e[rt](u));
      }),
        o &&
          Mt(e, "change", () => {
            e.value = e.value.trim();
          }),
        t ||
          (Mt(e, "compositionstart", jd),
          Mt(e, "compositionend", vl),
          Mt(e, "change", vl)));
    },
    mounted(e, { value: t }) {
      e.value = t ?? "";
    },
    beforeUpdate(
      e,
      { value: t, oldValue: o, modifiers: { lazy: n, trim: l, number: r } },
      a,
    ) {
      if (((e[rt] = zt(a)), e.composing)) return;
      const u =
          (r || e.type === "number") && !/^0\d/.test(e.value)
            ? io(e.value)
            : e.value,
        i = t ?? "";
      u !== i &&
        ((document.activeElement === e &&
          e.type !== "range" &&
          ((n && t === o) || (l && e.value.trim() === i))) ||
          (e.value = i));
    },
  },
  We = {
    deep: !0,
    created(e, t, o) {
      ((e[rt] = zt(o)),
        Mt(e, "change", () => {
          const n = e._modelValue,
            l = bs(e),
            r = e.checked,
            a = e[rt];
          if (ce(n)) {
            const u = hn(n, l),
              i = u !== -1;
            if (r && !i) a(n.concat(l));
            else if (!r && i) {
              const f = [...n];
              (f.splice(u, 1), a(f));
            }
          } else if (_s(n)) {
            const u = new Set(n);
            (r ? u.add(l) : u.delete(l), a(u));
          } else a(oa(e, r));
        }));
    },
    mounted: hl,
    beforeUpdate(e, t, o) {
      ((e[rt] = zt(o)), hl(e, t, o));
    },
  };
function hl(e, { value: t, oldValue: o }, n) {
  e._modelValue = t;
  let l;
  if (ce(t)) l = hn(t, n.props.value) > -1;
  else if (_s(t)) l = t.has(n.props.value);
  else {
    if (t === o) return;
    l = ss(t, oa(e, !0));
  }
  e.checked !== l && (e.checked = l);
}
const ao = {
    created(e, { value: t }, o) {
      ((e.checked = ss(t, o.props.value)),
        (e[rt] = zt(o)),
        Mt(e, "change", () => {
          e[rt](bs(e));
        }));
    },
    beforeUpdate(e, { value: t, oldValue: o }, n) {
      ((e[rt] = zt(n)), t !== o && (e.checked = ss(t, n.props.value)));
    },
  },
  Qt = {
    deep: !0,
    created(e, { value: t, modifiers: { number: o } }, n) {
      const l = _s(t);
      (Mt(e, "change", () => {
        const r = Array.prototype.filter
          .call(e.options, (a) => a.selected)
          .map((a) => (o ? io(bs(a)) : bs(a)));
        (e[rt](e.multiple ? (l ? new Set(r) : r) : r[0]),
          (e._assigning = !0),
          So(() => {
            e._assigning = !1;
          }));
      }),
        (e[rt] = zt(n)));
    },
    mounted(e, { value: t }) {
      bl(e, t);
    },
    beforeUpdate(e, t, o) {
      e[rt] = zt(o);
    },
    updated(e, { value: t }) {
      e._assigning || bl(e, t);
    },
  };
function bl(e, t) {
  const o = e.multiple,
    n = ce(t);
  if (!(o && !n && !_s(t))) {
    for (let l = 0, r = e.options.length; l < r; l++) {
      const a = e.options[l],
        u = bs(a);
      if (o)
        if (n) {
          const i = typeof u;
          i === "string" || i === "number"
            ? (a.selected = t.some((f) => String(f) === String(u)))
            : (a.selected = hn(t, u) > -1);
        } else a.selected = t.has(u);
      else if (ss(bs(a), t)) {
        e.selectedIndex !== l && (e.selectedIndex = l);
        return;
      }
    }
    !o && e.selectedIndex !== -1 && (e.selectedIndex = -1);
  }
}
function bs(e) {
  return "_value" in e ? e._value : e.value;
}
function oa(e, t) {
  const o = t ? "_trueValue" : "_falseValue";
  return o in e ? e[o] : t;
}
const Ld = {
  created(e, t, o) {
    to(e, t, o, null, "created");
  },
  mounted(e, t, o) {
    to(e, t, o, null, "mounted");
  },
  beforeUpdate(e, t, o, n) {
    to(e, t, o, n, "beforeUpdate");
  },
  updated(e, t, o, n) {
    to(e, t, o, n, "updated");
  },
};
function Od(e, t) {
  switch (e) {
    case "SELECT":
      return Qt;
    case "TEXTAREA":
      return be;
    default:
      switch (t) {
        case "checkbox":
          return We;
        case "radio":
          return ao;
        default:
          return be;
      }
  }
}
function to(e, t, o, n, l) {
  const a = Od(e.tagName, o.props && o.props.type)[l];
  a && a(e, t, o, n);
}
const Vd = ["ctrl", "shift", "alt", "meta"],
  Nd = {
    stop: (e) => e.stopPropagation(),
    prevent: (e) => e.preventDefault(),
    self: (e) => e.target !== e.currentTarget,
    ctrl: (e) => !e.ctrlKey,
    shift: (e) => !e.shiftKey,
    alt: (e) => !e.altKey,
    meta: (e) => !e.metaKey,
    left: (e) => "button" in e && e.button !== 0,
    middle: (e) => "button" in e && e.button !== 1,
    right: (e) => "button" in e && e.button !== 2,
    exact: (e, t) => Vd.some((o) => e[`${o}Key`] && !t.includes(o)),
  },
  Se = (e, t) => {
    const o = e._withMods || (e._withMods = {}),
      n = t.join(".");
    return (
      o[n] ||
      (o[n] = (l, ...r) => {
        for (let a = 0; a < t.length; a++) {
          const u = Nd[t[a]];
          if (u && u(l, t)) return;
        }
        return e(l, ...r);
      })
    );
  },
  Ud = Ue({ patchProp: Pd }, md);
let yl;
function Dd() {
  return yl || (yl = Oi(Ud));
}
const Fd = (...e) => {
  const t = Dd().createApp(...e),
    { mount: o } = t;
  return (
    (t.mount = (n) => {
      const l = zd(n);
      if (!l) return;
      const r = t._component;
      (!ve(r) && !r.render && !r.template && (r.template = l.innerHTML),
        l.nodeType === 1 && (l.textContent = ""));
      const a = o(l, !1, Hd(l));
      return (
        l instanceof Element &&
          (l.removeAttribute("v-cloak"), l.setAttribute("data-v-app", "")),
        a
      );
    }),
    t
  );
};
function Hd(e) {
  if (e instanceof SVGElement) return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function zd(e) {
  return je(e) ? document.querySelector(e) : e;
}
const ns = (e, t) => {
  const o = e.__vccOpts || e;
  for (const [n, l] of t) o[n] = l;
  return o;
};
/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const xl = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  Qd = (e) =>
    e.replace(/^([A-Z])|[\s-_]+(\w)/g, (t, o, n) =>
      n ? n.toUpperCase() : o.toLowerCase(),
    ),
  Kd = (e) => {
    const t = Qd(e);
    return t.charAt(0).toUpperCase() + t.slice(1);
  },
  Yd = (...e) =>
    e
      .filter((t, o, n) => !!t && t.trim() !== "" && n.indexOf(t) === o)
      .join(" ")
      .trim(),
  _l = (e) => e === "";
/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var Cs = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
};
/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Jd = (
  {
    name: e,
    iconNode: t,
    absoluteStrokeWidth: o,
    "absolute-stroke-width": n,
    strokeWidth: l,
    "stroke-width": r,
    size: a = Cs.width,
    color: u = Cs.stroke,
    ...i
  },
  { slots: f },
) =>
  hs(
    "svg",
    {
      ...Cs,
      ...i,
      width: a,
      height: a,
      stroke: u,
      "stroke-width":
        _l(o) || _l(n) || o === !0 || n === !0
          ? (Number(l || r || Cs["stroke-width"]) * 24) / Number(a)
          : l || r || Cs["stroke-width"],
      class: Yd(
        "lucide",
        i.class,
        ...(e
          ? [`lucide-${xl(Kd(e))}-icon`, `lucide-${xl(e)}`]
          : ["lucide-icon"]),
      ),
    },
    [...t.map((c) => hs(...c)), ...(f.default ? [f.default()] : [])],
  );
/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ot =
  (e, t) =>
  (o, { slots: n, attrs: l }) =>
    hs(Jd, { ...l, ...o, iconNode: t, name: e }, n);
/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Io = ot("chart-column", [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }],
]);
/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const qs = ot("circle-alert", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }],
]);
/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const qd = ot("eye-off", [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f",
    },
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a",
    },
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
]);
/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const En = ot("eye", [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0",
    },
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
]);
/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Gd = ot("list", [
  ["path", { d: "M3 5h.01", key: "18ugdj" }],
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M3 19h.01", key: "noohij" }],
  ["path", { d: "M8 5h13", key: "1pao27" }],
  ["path", { d: "M8 12h13", key: "1za7za" }],
  ["path", { d: "M8 19h13", key: "m83p4d" }],
]);
/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Zd = ot("map", [
  [
    "path",
    {
      d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",
      key: "169xi5",
    },
  ],
  ["path", { d: "M15 5.764v15", key: "1pn4in" }],
  ["path", { d: "M9 3.236v15", key: "1uimfh" }],
]);
/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Yt = ot("plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }],
]);
/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Bt = ot("search", [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
]);
/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const na = ot("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw",
    },
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
]);
/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ls = ot("square-pen", [
  [
    "path",
    {
      d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",
      key: "1m0v6g",
    },
  ],
  [
    "path",
    {
      d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
      key: "ohrbg2",
    },
  ],
]);
/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const la = ot("trash-2", [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }],
]);
/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Wd = ot("user", [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }],
]);
/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Xd = ot("x", [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
  ]),
  eu =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIESURBVHgB3VVLUttAEH09ElQl2egIzg3EAsguMicQcWUd3cBwgsAN7BMQ70MQF0hmG8hCN4huEK0dNE2PZBshJDym2EBX6Tc9r9/0zOsW8NKNXCd+iOLIKG9s342h6R/9XbvgnAjCKB5sk/eXgUIAhQwNDNPQhUTBwbahEvv0uNyZy1UDTeSCpb4Vb5F3Js4IblHSuSmPM53mbZffNd8GtzzEZsqgAusZxgvM0ImgWjnz6W99cQIH240OAyI17vI5ncFdoDi0Fx4sqD9LH2uslqf6yExHkllgx/aGo5xhLiXLb9c6zR7Ddx6yBBBFsgDJBhzYMWZouc9qFH1pCCCXccmAwqtf57SWYP9gdCbBkrugSN+hnGmdFq3MBiVU1CRj4sn1zx/HvQS70aeEiKw8p2+4PGkH7TNLZuAnIP4KWdyVPp91ThQ1TGR7/uGJZrH7w8NJc0zd/6BcHoEUWoANbYEJZJ/yXgLZ00oRPvwQG5rIMWzG6CS4wU3l9GA2JvCgwmaMToKsPlTROG18DqbqspxljsJ4NlvJNIw+S4r/i2VHtIe2BRVTVWgmm0uCS9+yBrp87Tgrgr2D0YVoOJYS1gQObGW2V8P1zwbLltHyLvZecIxLqYXYfq3OQEk/t+25nitSYzpVXL635c+sdqSqjxSbmWKk9ft9X9XWF7i3KBO8GrsF2RToiD397nYAAAAASUVORK5CYII=",
  tu =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIESURBVHgB3VVLUttAEH09ElQl2egIzg3EAsguMicQcWUd3cBwgsAN7BMQ70MQF0hmG8hCN4huEK0dNE2PZBshJDym2EBX6Tc9r9/0zOsW8NKNXCd+iOLIKG9s342h6R/9XbvgnAjCKB5sk/eXgUIAhQwNDNPQhUTBwbahEvv0uNyZy1UDTeSCpb4Vb5F3Js4IblHSuSmPM53mbZffNd8GtzzEZsqgAusZxgvM0ImgWjnz6W99cQIH240OAyI17vI5ncFdoDi0Fx4sqD9LH2uslqf6yExHkllgx/aGo5xhLiXLb9c6zR7Ddx6yBBBFsgDJBhzYMWZouc9qFH1pCCCXccmAwqtf57SWYP9gdCbBkrugSN+hnGmdFq3MBiVU1CRj4sn1zx/HvQS70aeEiKw8p2+4PGkH7TNLZuAnIP4KWdyVPp91ThQ1TGR7/uGJZrH7w8NJc0zd/6BcHoEUWoANbYEJZJ/yXgLZ00oRPvwQG5rIMWzG6CS4wU3l9GA2JvCgwmaMToKsPlTROG18DqbqspxljsJ4NlvJNIw+S4r/i2VHtIe2BRVTVWgmm0uCS9+yBrp87Tgrgr2D0YVoOJYS1gQObGW2V8P1zwbLltHyLvZecIxLqYXYfq3OQEk/t+25nitSYzpVXL635c+sdqSqjxSbmWKk9ft9X9XWF7i3KBO8GrsF2RToiD397nYAAAAASUVORK5CYII=",
  su =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFfSURBVHgB7VKxTgJBEJ3ZDT3WNsTODiMc7cAXAKc1+AXyB8gXCF9grM3F+4M7OsUGK0ts7K+WcOvsXY7oheP2MMZoeMlsdnfe27e7MwD/FhZ1h1arO/wuT2aJAPEKAOnw6BjeFi/TXXkyW5Rgs9iUJ7eLNotNeRriK0FgNCp1keyo9TzOFeOxJaRQp/Pqk383t5r2Qq/f1eqkBKWK3kvzJCyDEKXmBTPPOUi0YAKidjmPU6M28UVUvWl7WRyRlQgAyvVmZ9xoda+zOIiyHx8SPhc20B4IoqcUDmp0RumkRXab/7cXGSk1Lmww992AKzeJSALoc67Kf60QbiB+xujBd1+zzkHIgb7pzHfcBtmXIYjpkvdKGHosLHNMHj1nsE2fa6BxyiYS4R6i0kRR4bjlzunnaY0MNHSnMJmihQKXX9Ux0QkwBBd7tJ7DagQ/Ad3zOopojF+wK/YGv2/w9/EBq0OOQqCbTJcAAAAASUVORK5CYII=",
  ou =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIUSURBVHgB3VRdchJBEO6egfiaG4gncK0SysfhBFkTfU64gZwAOAHLCcRng+IJMo8mWOV6AtcTyKuRnbbbhThslnFJ+WK+qqn56Zmvu6d/AP534C5B2xyfIeLgmvInqZ0vq+5EJm41UX9GgldXdvamtoJn/DBXesAPWQn1c+fS6sf6MSIkhDD96fIRG5IFFbBFh2zRez40cBcgzK9d3vM9bvhyJk+EnAisqJY1ezEloG9VfITY4junBHxf+AniptJC3qtUwJePeMoWdtZtm5cRgBsg5KPLCtc3Hj8AzfaoycK+TTvdk6+iZKcCxiFb8/u/5QFPz9dERTBZfmM9B39h56lPxm+z8vc2oB6WSDT5Q4Tf1+R/xVaQ2UWCf4Cri9kNb4UHlDpSfbgDEN0YASP/TN2iB1x+sudWxgpWmQJnZJY9gmspoIdVMhms4lZBBmPAgX3NkzkgHT01ccKVLXuu8vgLoB5vZDzHuzhUSIEi/FAsMF0V2ZXJ0Bx0XxbiCHpwac8TnhLv6JG3Lsv2V9AxxwOO3JBTtP8D3PwA9YWchxpgGSosLTLCIR41oSlF1pLRgEYENRGOgcv7XLIjTXlPKpuIepxmZ0XG1EPwiz4WPWi42S/suynsibIH0ksi6T2wJ+QNFl+Y+efb3ZRwQkhjaWzt7kmtXuPrAGmGiKMtzvKtjnkxZE2nUFizDzIxcJ3a9wi/ALsc5NuFk+UjAAAAAElFTkSuQmCC",
  nu =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHESURBVHgBvVU7TsNAEJ1ZIgqq1NBYdOkcKZB0OCeIUdJDSwU3gBsQjpCe/E6QLYFQuAI6nAJEmRKJ2MMsdqQ4sXetSOZJ1nrn6ze7MwYoGJilsB3X2hXiDEO0QgQr1RlhThTOfoi6nhz5uRMcO22XNcN46xM/aXZAVEZEO3qH0yfZH62blCA97a0KvEdBVcrRHDRoMNMAxZB9rnm7kUCkOfBiIdGdKbjCA5dGEPQQ0I599QkWENU7AOFBTiwA/cgHysYE2wAh+GNKUComgQ7/nwCFaEVr2IKc0PnsrG7qTueKlxsi8vhWuAeHFfx4f5W64CafBIMQqcVNJadyUCUgjwhPwACTj+YM0NgDeXxKWnMeSUfN9gT0UKMis2e0t4jADDToSwa9N530mzoDE8MEAzV+MaK8FRA2x3qCYc3pOAJJfZEa0WWlJE19Y9ixnQpW5pdzHtu9pTLRB5/+i79vVWZMxeLtV/TwzAds8Oyfs/w7skzIfGWHBG8h4MVU9seZDNJQc1xmtTMJCZvP8l5mybJQ+CzKZFB32pf8L3aRy8FmturSZSOtywTR+FEOumlxNNeU7xSfGEVB5eq3bMoKL0Q2fgFPm73H0jq9SwAAAABJRU5ErkJggg==",
  lu =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJySURBVHgB7VNBctpQDJW+SafTbjiCe4I4M4V2l08ugCnpGnqCtCfAnKDhBJR1A/EJwmeXQmfqnqDODVgn/K9KYDMOQwJdNYtohvnWR9LT13sCeLb/bVh0Ah2WD8BroQINBAFf+ffDKQHEFBzEt2AniYlT2BfgnW6eOYSICyfsxg7g5gBsUgxeQMlHoEPOCjlRA1I0vRp1dwJUTj58RcLQEX76aS4M7GHvdeg79MaEFM+uRl8eilNLFMLPRLaxb3Gxax4PkWpI7mNxKv8gKJXhHw3hzpezqsOwosNge4wE1Jq08ii6dW6wizwRwwulzoi75wJlTjZyzd9zQjB3znbzGmsAnn8NkTpCniQg0YTP+0BI3KU6lGIrMdAAEfvT8XBZ560+1QqozVWPZXwz8z1Zj2gBi2Q2HtYU2TfZ2+osyVbxh6DqSDD3yB7NzLDmgTNFfOFwaoZtIGRgdyl3pey/VJ7MZ1fIq+rGDSNMuEhULMD33/g+vc6e70C1YPOVIHxizHLurAGWagB3WTlp+uTsAHYYS1Rb9KSAL7mwwY9SjvnJplpI8h14kcwPVhuc8jhMMdmtFkxInbM8e69gcW5MPJeiL7m2U+pYiOeOU+YmEG5wW4cV/ZHJtIEQyMHZpqLPCqkLwJax+AKqCGILOCjBIuUl/PMgQG6iLh7Bkahh6TMHIkULXlyMY+Uwf/R7akZR3iCT/EsASo8B8Bx7ogYeQS3XNRM439x4Bm7n0xZ+HLo+e73lu2GHVfUp80Kd1TJRmeWaeLxIxRgmvF9wA0XY/WEuzvcCyLryLSiNgHUC8oXAjZBUFk+aeA12IMTDsz0Z+wvkWCf2+2Vy4QAAAABJRU5ErkJggg==",
  wl =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEjSURBVHgB7ZPNVcJAEMf/s0a8YgeWwMVcDTYgTwpAO7ADkw4sQe/iwwYkV3ke6EBLyFkfGXckxl1kYZPAhcfvMrs73/N2gD07Dy17DKPLWxDFqBSJ48nLU7I2QSfqnbTo4B01+OTZ8TQdZeZbsGh0CBXNC8L9azq8hgen3f5YVxodQV3p652pU/+siQYiZqARfGF+EJETXSyqrAQyHqlEH7O39PEZnnwhl2Iy8dUx2qbOGpFuscfzYzvs9hk1aCl1o0X8e7c6yAkDNISZzsy71QGBOiIn4yGhBtJ1MeIS5TTWuyAO4bneiQY2zgTlovGKhfOwcSdgSoogSSMbk592a/4el3/gMsSGUNgygUtR9au6urY6YPC0OH6gIn++ZYw9fnwDzU5XOMiT2iIAAAAASUVORK5CYII=",
  ru =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALDSURBVHgBvVVdUhpBEO6ewehDqoI34AZiJWDeHHIBVzHPwAk0J1BOYHIC8DmhxBMwviWaVNYbrCcIzxGm883y47IsP0lV7CqYnd5v+u/rniX6z8JZyqIJChvMp0RqB4jo0Q2boe1Gacwm6TPHVFiE8aKyjeufJGpHibtnIfOC9EUap0kXhSg/xeBMybwvrsygVKn2lFD0zXYaSf1bExghXYsjJnf/KPIxGbE/59e7XqeyNAN4LDiSm6SubI5QCt1zeIdo+0zqABH3fLZTkMglzs5lMOcAaUfQ7kz2sRHmc/yad7ZTubWdw98y3BWSPkrZeoqMkaFEGQHPymtTDTTTlTC1QdyHTVJ1YT677XW2s3Bwtr1BKmDmFqKrI4DLpRn8sJ2uiDTISXELJI7V/fnIhgkdv4Lxw7TxOQeeyJKpnrDiA0ZuA8oVhqRCvCqUTbU244B1HUsEovvA7iLjE3B1XjLBDA85/1dEe22wuwCJxkfLjrrg4lqR5BFVt2yOm8TSLr2rGnbygJLt+2MiatQxIhH7LJhrjNkoV45CEd24s5/DmIOyOWwTq30n3Phuv1jKkJI5qo8MoE2FQiHV9AbSuDfm2DCCVcKhb/XcNGUhu8g4SodSxZFeCi0XbwMB30/6J7cI6PkYMgegqYbS5T1cfPlGhGMeXBtrY4W/kQPU+nwr0RV75vjUsfjroc/Cn+DAvqRBaEFo2oCfYGTfTnZQ0l7mZRdzQsoTHEx0GLi87/c5MLoHpEcg/zqpfiRn/VWysETw/Cu5x+UG8qiViRVcEXE5n2RTdBtLY6GDtPiW9W4x0TNZj7PtJUs01sXPuQXGZjhZJrf2qr7sfaaDrxkfjrT4ycb01if7NNFLHawjioY3A8k9TPaaBlEW7p8djLOMVuH+2sGeqbZWYVC6fUyl9c+K1hSNvvZ1Xgfrrx1MvaXnkD+Mijs4MBhmtQAAAABJRU5ErkJggg==",
  au = {
    class:
      "w-80 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-y-auto",
  },
  iu = { class: "flex-1 px-4 py-5 space-y-3" },
  du = { class: "pt-1" },
  uu = { class: "ml-2 mt-2 space-y-1 border-l border-gray-100 pl-2" },
  cu = ["src", "alt"],
  fu = { class: "font-medium" },
  pu = { class: "pt-1" },
  mu = { class: "ml-2 mt-2 space-y-1 border-l border-gray-100 pl-2" },
  gu = ["src", "alt"],
  vu = { class: "font-medium" },
  hu = { class: "pt-1" },
  bu = { class: "ml-2 mt-2 space-y-1 border-l border-gray-100 pl-2" },
  yu = { class: "font-medium" },
  xu = { class: "pt-1" },
  _u = { class: "ml-2 mt-2 space-y-1 border-l border-gray-100 pl-2" },
  wu = { class: "font-medium" },
  ku = {
    __name: "SideBar",
    setup(e) {
      const t = $(!0),
        o = $(!0),
        n = $(!0),
        l = $(!0),
        r = () => (t.value = !t.value),
        a = () => (o.value = !o.value),
        u = () => (n.value = !n.value),
        i = () => (l.value = !l.value),
        f = [
          { name: "Ports", route: "/create-port", icon: eu },
          { name: "Vessels", route: "/vessels", icon: tu },
          { name: "Routes", route: "/routes", icon: su },
          { name: "Schedule", route: "/schedule", icon: ou },
          {
            name: "Accommodation",
            route: "/passenger-accommodation",
            icon: nu,
          },
          { name: "Rates", route: "/rates-discounts", icon: lu },
          { name: "Vehicles", route: "/vehicles", icon: wl },
          {
            name: "Passenger Monitoring",
            route: "/passenger-monitoring",
            icon: wl,
          },
        ],
        c = [{ name: "Teller Booking", route: "/teller-booking", icon: ru }],
        d = [],
        p = [
          { name: "Settings", route: "/settings", icon: na },
          { name: "Profile", route: "/profile", icon: Wd },
        ];
      return (b, x) => {
        const A = ms("router-link");
        return (
          m(),
          g("div", au, [
            s("nav", iu, [
              Y(
                A,
                {
                  to: "/",
                  class:
                    "flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 whitespace-nowrap",
                  "active-class": "bg-blue-50 text-blue-600",
                  "exact-active-class": "bg-blue-50 text-blue-600",
                },
                {
                  default: $e(() => [
                    ...(x[0] ||
                      (x[0] = [
                        s(
                          "svg",
                          {
                            class: "w-5 h-5 flex-shrink-0",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                          },
                          [
                            s("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
                            }),
                          ],
                          -1,
                        ),
                        s("span", { class: "font-medium" }, "Dashboard", -1),
                      ])),
                  ]),
                  _: 1,
                },
              ),
              s("div", du, [
                s(
                  "button",
                  {
                    onClick: r,
                    class:
                      "flex items-center justify-between w-full px-3 py-2 text-left text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors",
                  },
                  [
                    x[2] ||
                      (x[2] = s(
                        "span",
                        { class: "font-medium" },
                        "Modules",
                        -1,
                      )),
                    (m(),
                    g(
                      "svg",
                      {
                        class: Z([
                          "w-4 h-4 transition-transform duration-200",
                          { "rotate-180": t.value },
                        ]),
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                      },
                      [
                        ...(x[1] ||
                          (x[1] = [
                            s(
                              "path",
                              {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M19 9l-7 7-7-7",
                              },
                              null,
                              -1,
                            ),
                          ])),
                      ],
                      2,
                    )),
                  ],
                ),
                oe(
                  s(
                    "div",
                    uu,
                    [
                      (m(),
                      g(
                        q,
                        null,
                        le(f, (v) =>
                          Y(
                            A,
                            {
                              key: v.name,
                              to: v.route,
                              class:
                                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 whitespace-nowrap",
                              "active-class": "bg-blue-50 text-blue-600",
                              "exact-active-class": "bg-blue-50 text-blue-600",
                            },
                            {
                              default: $e(() => [
                                s(
                                  "img",
                                  {
                                    src: v.icon,
                                    alt: v.name,
                                    class: "w-5 h-5 flex-shrink-0",
                                  },
                                  null,
                                  8,
                                  cu,
                                ),
                                s("span", fu, w(v.name), 1),
                              ]),
                              _: 2,
                            },
                            1032,
                            ["to"],
                          ),
                        ),
                        64,
                      )),
                    ],
                    512,
                  ),
                  [[eo, t.value]],
                ),
              ]),
              s("div", pu, [
                s(
                  "button",
                  {
                    onClick: a,
                    class:
                      "flex items-center justify-between w-full px-3 py-2 text-left text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors",
                  },
                  [
                    x[4] ||
                      (x[4] = s(
                        "span",
                        { class: "font-medium" },
                        "Booking Modules",
                        -1,
                      )),
                    (m(),
                    g(
                      "svg",
                      {
                        class: Z([
                          "w-4 h-4 transition-transform duration-200",
                          { "rotate-180": o.value },
                        ]),
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                      },
                      [
                        ...(x[3] ||
                          (x[3] = [
                            s(
                              "path",
                              {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M19 9l-7 7-7-7",
                              },
                              null,
                              -1,
                            ),
                          ])),
                      ],
                      2,
                    )),
                  ],
                ),
                oe(
                  s(
                    "div",
                    mu,
                    [
                      (m(),
                      g(
                        q,
                        null,
                        le(c, (v) =>
                          Y(
                            A,
                            {
                              key: v.name,
                              to: v.route,
                              class:
                                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 whitespace-nowrap",
                              "active-class": "bg-blue-50 text-blue-600",
                              "exact-active-class": "bg-blue-50 text-blue-600",
                            },
                            {
                              default: $e(() => [
                                s(
                                  "img",
                                  {
                                    src: v.icon,
                                    alt: v.name,
                                    class: "w-5 h-5 flex-shrink-0",
                                  },
                                  null,
                                  8,
                                  gu,
                                ),
                                s("span", vu, w(v.name), 1),
                              ]),
                              _: 2,
                            },
                            1032,
                            ["to"],
                          ),
                        ),
                        64,
                      )),
                    ],
                    512,
                  ),
                  [[eo, o.value]],
                ),
              ]),
              s("div", hu, [
                s(
                  "button",
                  {
                    onClick: u,
                    class:
                      "flex items-center justify-between w-full px-3 py-2 text-left text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors",
                  },
                  [
                    x[6] ||
                      (x[6] = s(
                        "span",
                        { class: "font-medium" },
                        "Logs and Reports",
                        -1,
                      )),
                    (m(),
                    g(
                      "svg",
                      {
                        class: Z([
                          "w-4 h-4 transition-transform duration-200",
                          { "rotate-180": n.value },
                        ]),
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                      },
                      [
                        ...(x[5] ||
                          (x[5] = [
                            s(
                              "path",
                              {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M19 9l-7 7-7-7",
                              },
                              null,
                              -1,
                            ),
                          ])),
                      ],
                      2,
                    )),
                  ],
                ),
                oe(
                  s(
                    "div",
                    bu,
                    [
                      (m(),
                      g(
                        q,
                        null,
                        le(d, (v) =>
                          Y(
                            A,
                            {
                              key: v.name,
                              to: v.route,
                              class:
                                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100",
                              "active-class": "bg-blue-50 text-blue-600",
                              "exact-active-class": "bg-blue-50 text-blue-600",
                            },
                            {
                              default: $e(() => [
                                (m(), ke(go(v.icon), { class: "w-5 h-5" })),
                                s("span", yu, w(v.name), 1),
                              ]),
                              _: 2,
                            },
                            1032,
                            ["to"],
                          ),
                        ),
                        64,
                      )),
                    ],
                    512,
                  ),
                  [[eo, n.value]],
                ),
              ]),
              s("div", xu, [
                s(
                  "button",
                  {
                    onClick: i,
                    class:
                      "flex items-center justify-between w-full px-3 py-2 text-left text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors",
                  },
                  [
                    x[8] ||
                      (x[8] = s(
                        "span",
                        { class: "font-medium" },
                        "System",
                        -1,
                      )),
                    (m(),
                    g(
                      "svg",
                      {
                        class: Z([
                          "w-4 h-4 transition-transform duration-200",
                          { "rotate-180": l.value },
                        ]),
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                      },
                      [
                        ...(x[7] ||
                          (x[7] = [
                            s(
                              "path",
                              {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M19 9l-7 7-7-7",
                              },
                              null,
                              -1,
                            ),
                          ])),
                      ],
                      2,
                    )),
                  ],
                ),
                oe(
                  s(
                    "div",
                    _u,
                    [
                      (m(),
                      g(
                        q,
                        null,
                        le(p, (v) =>
                          Y(
                            A,
                            {
                              key: v.name,
                              to: v.route,
                              class:
                                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100",
                              "active-class": "bg-blue-50 text-blue-600",
                              "exact-active-class": "bg-blue-50 text-blue-600",
                            },
                            {
                              default: $e(() => [
                                (m(), ke(go(v.icon), { class: "w-5 h-5" })),
                                s("span", wu, w(v.name), 1),
                              ]),
                              _: 2,
                            },
                            1032,
                            ["to"],
                          ),
                        ),
                        64,
                      )),
                    ],
                    512,
                  ),
                  [[eo, l.value]],
                ),
              ]),
            ]),
          ])
        );
      };
    },
  },
  ra = "/fcbook-dev/assets/fastcat-logo.png";
/*!
 * vue-router v4.5.1
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */ const ds = typeof document < "u";
function aa(e) {
  return (
    typeof e == "object" ||
    "displayName" in e ||
    "props" in e ||
    "__vccOpts" in e
  );
}
function Au(e) {
  return (
    e.__esModule ||
    e[Symbol.toStringTag] === "Module" ||
    (e.default && aa(e.default))
  );
}
const Ae = Object.assign;
function qo(e, t) {
  const o = {};
  for (const n in t) {
    const l = t[n];
    o[n] = ft(l) ? l.map(e) : e(l);
  }
  return o;
}
const js = () => {},
  ft = Array.isArray,
  ia = /#/g,
  Cu = /&/g,
  $u = /\//g,
  Su = /=/g,
  Mu = /\?/g,
  da = /\+/g,
  Ru = /%5B/g,
  Eu = /%5D/g,
  ua = /%5E/g,
  Tu = /%60/g,
  ca = /%7B/g,
  Bu = /%7C/g,
  fa = /%7D/g,
  Pu = /%20/g;
function Tn(e) {
  return encodeURI("" + e)
    .replace(Bu, "|")
    .replace(Ru, "[")
    .replace(Eu, "]");
}
function Iu(e) {
  return Tn(e).replace(ca, "{").replace(fa, "}").replace(ua, "^");
}
function un(e) {
  return Tn(e)
    .replace(da, "%2B")
    .replace(Pu, "+")
    .replace(ia, "%23")
    .replace(Cu, "%26")
    .replace(Tu, "`")
    .replace(ca, "{")
    .replace(fa, "}")
    .replace(ua, "^");
}
function ju(e) {
  return un(e).replace(Su, "%3D");
}
function Lu(e) {
  return Tn(e).replace(ia, "%23").replace(Mu, "%3F");
}
function Ou(e) {
  return e == null ? "" : Lu(e).replace($u, "%2F");
}
function zs(e) {
  try {
    return decodeURIComponent("" + e);
  } catch {}
  return "" + e;
}
const Vu = /\/$/,
  Nu = (e) => e.replace(Vu, "");
function Go(e, t, o = "/") {
  let n,
    l = {},
    r = "",
    a = "";
  const u = t.indexOf("#");
  let i = t.indexOf("?");
  return (
    u < i && u >= 0 && (i = -1),
    i > -1 &&
      ((n = t.slice(0, i)),
      (r = t.slice(i + 1, u > -1 ? u : t.length)),
      (l = e(r))),
    u > -1 && ((n = n || t.slice(0, u)), (a = t.slice(u, t.length))),
    (n = Hu(n ?? t, o)),
    { fullPath: n + (r && "?") + r + a, path: n, query: l, hash: zs(a) }
  );
}
function Uu(e, t) {
  const o = t.query ? e(t.query) : "";
  return t.path + (o && "?") + o + (t.hash || "");
}
function kl(e, t) {
  return !t || !e.toLowerCase().startsWith(t.toLowerCase())
    ? e
    : e.slice(t.length) || "/";
}
function Du(e, t, o) {
  const n = t.matched.length - 1,
    l = o.matched.length - 1;
  return (
    n > -1 &&
    n === l &&
    ys(t.matched[n], o.matched[l]) &&
    pa(t.params, o.params) &&
    e(t.query) === e(o.query) &&
    t.hash === o.hash
  );
}
function ys(e, t) {
  return (e.aliasOf || e) === (t.aliasOf || t);
}
function pa(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length) return !1;
  for (const o in e) if (!Fu(e[o], t[o])) return !1;
  return !0;
}
function Fu(e, t) {
  return ft(e) ? Al(e, t) : ft(t) ? Al(t, e) : e === t;
}
function Al(e, t) {
  return ft(t)
    ? e.length === t.length && e.every((o, n) => o === t[n])
    : e.length === 1 && e[0] === t;
}
function Hu(e, t) {
  if (e.startsWith("/")) return e;
  if (!e) return t;
  const o = t.split("/"),
    n = e.split("/"),
    l = n[n.length - 1];
  (l === ".." || l === ".") && n.push("");
  let r = o.length - 1,
    a,
    u;
  for (a = 0; a < n.length; a++)
    if (((u = n[a]), u !== "."))
      if (u === "..") r > 1 && r--;
      else break;
  return o.slice(0, r).join("/") + "/" + n.slice(a).join("/");
}
const jt = {
  path: "/",
  name: void 0,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: void 0,
};
var Qs;
(function (e) {
  ((e.pop = "pop"), (e.push = "push"));
})(Qs || (Qs = {}));
var Ls;
(function (e) {
  ((e.back = "back"), (e.forward = "forward"), (e.unknown = ""));
})(Ls || (Ls = {}));
function zu(e) {
  if (!e)
    if (ds) {
      const t = document.querySelector("base");
      ((e = (t && t.getAttribute("href")) || "/"),
        (e = e.replace(/^\w+:\/\/[^\/]+/, "")));
    } else e = "/";
  return (e[0] !== "/" && e[0] !== "#" && (e = "/" + e), Nu(e));
}
const Qu = /^[^#]+#/;
function Ku(e, t) {
  return e.replace(Qu, "#") + t;
}
function Yu(e, t) {
  const o = document.documentElement.getBoundingClientRect(),
    n = e.getBoundingClientRect();
  return {
    behavior: t.behavior,
    left: n.left - o.left - (t.left || 0),
    top: n.top - o.top - (t.top || 0),
  };
}
const jo = () => ({ left: window.scrollX, top: window.scrollY });
function Ju(e) {
  let t;
  if ("el" in e) {
    const o = e.el,
      n = typeof o == "string" && o.startsWith("#"),
      l =
        typeof o == "string"
          ? n
            ? document.getElementById(o.slice(1))
            : document.querySelector(o)
          : o;
    if (!l) return;
    t = Yu(l, e);
  } else t = e;
  "scrollBehavior" in document.documentElement.style
    ? window.scrollTo(t)
    : window.scrollTo(
        t.left != null ? t.left : window.scrollX,
        t.top != null ? t.top : window.scrollY,
      );
}
function Cl(e, t) {
  return (history.state ? history.state.position - t : -1) + e;
}
const cn = new Map();
function qu(e, t) {
  cn.set(e, t);
}
function Gu(e) {
  const t = cn.get(e);
  return (cn.delete(e), t);
}
let Zu = () => location.protocol + "//" + location.host;
function ma(e, t) {
  const { pathname: o, search: n, hash: l } = t,
    r = e.indexOf("#");
  if (r > -1) {
    let u = l.includes(e.slice(r)) ? e.slice(r).length : 1,
      i = l.slice(u);
    return (i[0] !== "/" && (i = "/" + i), kl(i, ""));
  }
  return kl(o, e) + n + l;
}
function Wu(e, t, o, n) {
  let l = [],
    r = [],
    a = null;
  const u = ({ state: p }) => {
    const b = ma(e, location),
      x = o.value,
      A = t.value;
    let v = 0;
    if (p) {
      if (((o.value = b), (t.value = p), a && a === x)) {
        a = null;
        return;
      }
      v = A ? p.position - A.position : 0;
    } else n(b);
    l.forEach((S) => {
      S(o.value, x, {
        delta: v,
        type: Qs.pop,
        direction: v ? (v > 0 ? Ls.forward : Ls.back) : Ls.unknown,
      });
    });
  };
  function i() {
    a = o.value;
  }
  function f(p) {
    l.push(p);
    const b = () => {
      const x = l.indexOf(p);
      x > -1 && l.splice(x, 1);
    };
    return (r.push(b), b);
  }
  function c() {
    const { history: p } = window;
    p.state && p.replaceState(Ae({}, p.state, { scroll: jo() }), "");
  }
  function d() {
    for (const p of r) p();
    ((r = []),
      window.removeEventListener("popstate", u),
      window.removeEventListener("beforeunload", c));
  }
  return (
    window.addEventListener("popstate", u),
    window.addEventListener("beforeunload", c, { passive: !0 }),
    { pauseListeners: i, listen: f, destroy: d }
  );
}
function $l(e, t, o, n = !1, l = !1) {
  return {
    back: e,
    current: t,
    forward: o,
    replaced: n,
    position: window.history.length,
    scroll: l ? jo() : null,
  };
}
function Xu(e) {
  const { history: t, location: o } = window,
    n = { value: ma(e, o) },
    l = { value: t.state };
  l.value ||
    r(
      n.value,
      {
        back: null,
        current: n.value,
        forward: null,
        position: t.length - 1,
        replaced: !0,
        scroll: null,
      },
      !0,
    );
  function r(i, f, c) {
    const d = e.indexOf("#"),
      p =
        d > -1
          ? (o.host && document.querySelector("base") ? e : e.slice(d)) + i
          : Zu() + e + i;
    try {
      (t[c ? "replaceState" : "pushState"](f, "", p), (l.value = f));
    } catch (b) {
      (console.error(b), o[c ? "replace" : "assign"](p));
    }
  }
  function a(i, f) {
    const c = Ae({}, t.state, $l(l.value.back, i, l.value.forward, !0), f, {
      position: l.value.position,
    });
    (r(i, c, !0), (n.value = i));
  }
  function u(i, f) {
    const c = Ae({}, l.value, t.state, { forward: i, scroll: jo() });
    r(c.current, c, !0);
    const d = Ae({}, $l(n.value, i, null), { position: c.position + 1 }, f);
    (r(i, d, !1), (n.value = i));
  }
  return { location: n, state: l, push: u, replace: a };
}
function ec(e) {
  e = zu(e);
  const t = Xu(e),
    o = Wu(e, t.state, t.location, t.replace);
  function n(r, a = !0) {
    (a || o.pauseListeners(), history.go(r));
  }
  const l = Ae(
    { location: "", base: e, go: n, createHref: Ku.bind(null, e) },
    t,
    o,
  );
  return (
    Object.defineProperty(l, "location", {
      enumerable: !0,
      get: () => t.location.value,
    }),
    Object.defineProperty(l, "state", {
      enumerable: !0,
      get: () => t.state.value,
    }),
    l
  );
}
function tc(e) {
  return typeof e == "string" || (e && typeof e == "object");
}
function ga(e) {
  return typeof e == "string" || typeof e == "symbol";
}
const va = Symbol("");
var Sl;
(function (e) {
  ((e[(e.aborted = 4)] = "aborted"),
    (e[(e.cancelled = 8)] = "cancelled"),
    (e[(e.duplicated = 16)] = "duplicated"));
})(Sl || (Sl = {}));
function xs(e, t) {
  return Ae(new Error(), { type: e, [va]: !0 }, t);
}
function kt(e, t) {
  return e instanceof Error && va in e && (t == null || !!(e.type & t));
}
const Ml = "[^/]+?",
  sc = { sensitive: !1, strict: !1, start: !0, end: !0 },
  oc = /[.+*?^${}()[\]/\\]/g;
function nc(e, t) {
  const o = Ae({}, sc, t),
    n = [];
  let l = o.start ? "^" : "";
  const r = [];
  for (const f of e) {
    const c = f.length ? [] : [90];
    o.strict && !f.length && (l += "/");
    for (let d = 0; d < f.length; d++) {
      const p = f[d];
      let b = 40 + (o.sensitive ? 0.25 : 0);
      if (p.type === 0)
        (d || (l += "/"), (l += p.value.replace(oc, "\\$&")), (b += 40));
      else if (p.type === 1) {
        const { value: x, repeatable: A, optional: v, regexp: S } = p;
        r.push({ name: x, repeatable: A, optional: v });
        const _ = S || Ml;
        if (_ !== Ml) {
          b += 10;
          try {
            new RegExp(`(${_})`);
          } catch (k) {
            throw new Error(
              `Invalid custom RegExp for param "${x}" (${_}): ` + k.message,
            );
          }
        }
        let C = A ? `((?:${_})(?:/(?:${_}))*)` : `(${_})`;
        (d || (C = v && f.length < 2 ? `(?:/${C})` : "/" + C),
          v && (C += "?"),
          (l += C),
          (b += 20),
          v && (b += -8),
          A && (b += -20),
          _ === ".*" && (b += -50));
      }
      c.push(b);
    }
    n.push(c);
  }
  if (o.strict && o.end) {
    const f = n.length - 1;
    n[f][n[f].length - 1] += 0.7000000000000001;
  }
  (o.strict || (l += "/?"),
    o.end ? (l += "$") : o.strict && !l.endsWith("/") && (l += "(?:/|$)"));
  const a = new RegExp(l, o.sensitive ? "" : "i");
  function u(f) {
    const c = f.match(a),
      d = {};
    if (!c) return null;
    for (let p = 1; p < c.length; p++) {
      const b = c[p] || "",
        x = r[p - 1];
      d[x.name] = b && x.repeatable ? b.split("/") : b;
    }
    return d;
  }
  function i(f) {
    let c = "",
      d = !1;
    for (const p of e) {
      ((!d || !c.endsWith("/")) && (c += "/"), (d = !1));
      for (const b of p)
        if (b.type === 0) c += b.value;
        else if (b.type === 1) {
          const { value: x, repeatable: A, optional: v } = b,
            S = x in f ? f[x] : "";
          if (ft(S) && !A)
            throw new Error(
              `Provided param "${x}" is an array but it is not repeatable (* or + modifiers)`,
            );
          const _ = ft(S) ? S.join("/") : S;
          if (!_)
            if (v)
              p.length < 2 &&
                (c.endsWith("/") ? (c = c.slice(0, -1)) : (d = !0));
            else throw new Error(`Missing required param "${x}"`);
          c += _;
        }
    }
    return c || "/";
  }
  return { re: a, score: n, keys: r, parse: u, stringify: i };
}
function lc(e, t) {
  let o = 0;
  for (; o < e.length && o < t.length; ) {
    const n = t[o] - e[o];
    if (n) return n;
    o++;
  }
  return e.length < t.length
    ? e.length === 1 && e[0] === 80
      ? -1
      : 1
    : e.length > t.length
      ? t.length === 1 && t[0] === 80
        ? 1
        : -1
      : 0;
}
function ha(e, t) {
  let o = 0;
  const n = e.score,
    l = t.score;
  for (; o < n.length && o < l.length; ) {
    const r = lc(n[o], l[o]);
    if (r) return r;
    o++;
  }
  if (Math.abs(l.length - n.length) === 1) {
    if (Rl(n)) return 1;
    if (Rl(l)) return -1;
  }
  return l.length - n.length;
}
function Rl(e) {
  const t = e[e.length - 1];
  return e.length > 0 && t[t.length - 1] < 0;
}
const rc = { type: 0, value: "" },
  ac = /[a-zA-Z0-9_]/;
function ic(e) {
  if (!e) return [[]];
  if (e === "/") return [[rc]];
  if (!e.startsWith("/")) throw new Error(`Invalid path "${e}"`);
  function t(b) {
    throw new Error(`ERR (${o})/"${f}": ${b}`);
  }
  let o = 0,
    n = o;
  const l = [];
  let r;
  function a() {
    (r && l.push(r), (r = []));
  }
  let u = 0,
    i,
    f = "",
    c = "";
  function d() {
    f &&
      (o === 0
        ? r.push({ type: 0, value: f })
        : o === 1 || o === 2 || o === 3
          ? (r.length > 1 &&
              (i === "*" || i === "+") &&
              t(
                `A repeatable param (${f}) must be alone in its segment. eg: '/:ids+.`,
              ),
            r.push({
              type: 1,
              value: f,
              regexp: c,
              repeatable: i === "*" || i === "+",
              optional: i === "*" || i === "?",
            }))
          : t("Invalid state to consume buffer"),
      (f = ""));
  }
  function p() {
    f += i;
  }
  for (; u < e.length; ) {
    if (((i = e[u++]), i === "\\" && o !== 2)) {
      ((n = o), (o = 4));
      continue;
    }
    switch (o) {
      case 0:
        i === "/" ? (f && d(), a()) : i === ":" ? (d(), (o = 1)) : p();
        break;
      case 4:
        (p(), (o = n));
        break;
      case 1:
        i === "("
          ? (o = 2)
          : ac.test(i)
            ? p()
            : (d(), (o = 0), i !== "*" && i !== "?" && i !== "+" && u--);
        break;
      case 2:
        i === ")"
          ? c[c.length - 1] == "\\"
            ? (c = c.slice(0, -1) + i)
            : (o = 3)
          : (c += i);
        break;
      case 3:
        (d(), (o = 0), i !== "*" && i !== "?" && i !== "+" && u--, (c = ""));
        break;
      default:
        t("Unknown state");
        break;
    }
  }
  return (
    o === 2 && t(`Unfinished custom RegExp for param "${f}"`),
    d(),
    a(),
    l
  );
}
function dc(e, t, o) {
  const n = nc(ic(e.path), o),
    l = Ae(n, { record: e, parent: t, children: [], alias: [] });
  return (t && !l.record.aliasOf == !t.record.aliasOf && t.children.push(l), l);
}
function uc(e, t) {
  const o = [],
    n = new Map();
  t = Pl({ strict: !1, end: !0, sensitive: !1 }, t);
  function l(d) {
    return n.get(d);
  }
  function r(d, p, b) {
    const x = !b,
      A = Tl(d);
    A.aliasOf = b && b.record;
    const v = Pl(t, d),
      S = [A];
    if ("alias" in d) {
      const k = typeof d.alias == "string" ? [d.alias] : d.alias;
      for (const T of k)
        S.push(
          Tl(
            Ae({}, A, {
              components: b ? b.record.components : A.components,
              path: T,
              aliasOf: b ? b.record : A,
            }),
          ),
        );
    }
    let _, C;
    for (const k of S) {
      const { path: T } = k;
      if (p && T[0] !== "/") {
        const B = p.record.path,
          F = B[B.length - 1] === "/" ? "" : "/";
        k.path = p.record.path + (T && F + T);
      }
      if (
        ((_ = dc(k, p, v)),
        b
          ? b.alias.push(_)
          : ((C = C || _),
            C !== _ && C.alias.push(_),
            x && d.name && !Bl(_) && a(d.name)),
        ba(_) && i(_),
        A.children)
      ) {
        const B = A.children;
        for (let F = 0; F < B.length; F++) r(B[F], _, b && b.children[F]);
      }
      b = b || _;
    }
    return C
      ? () => {
          a(C);
        }
      : js;
  }
  function a(d) {
    if (ga(d)) {
      const p = n.get(d);
      p &&
        (n.delete(d),
        o.splice(o.indexOf(p), 1),
        p.children.forEach(a),
        p.alias.forEach(a));
    } else {
      const p = o.indexOf(d);
      p > -1 &&
        (o.splice(p, 1),
        d.record.name && n.delete(d.record.name),
        d.children.forEach(a),
        d.alias.forEach(a));
    }
  }
  function u() {
    return o;
  }
  function i(d) {
    const p = pc(d, o);
    (o.splice(p, 0, d), d.record.name && !Bl(d) && n.set(d.record.name, d));
  }
  function f(d, p) {
    let b,
      x = {},
      A,
      v;
    if ("name" in d && d.name) {
      if (((b = n.get(d.name)), !b)) throw xs(1, { location: d });
      ((v = b.record.name),
        (x = Ae(
          El(
            p.params,
            b.keys
              .filter((C) => !C.optional)
              .concat(b.parent ? b.parent.keys.filter((C) => C.optional) : [])
              .map((C) => C.name),
          ),
          d.params &&
            El(
              d.params,
              b.keys.map((C) => C.name),
            ),
        )),
        (A = b.stringify(x)));
    } else if (d.path != null)
      ((A = d.path),
        (b = o.find((C) => C.re.test(A))),
        b && ((x = b.parse(A)), (v = b.record.name)));
    else {
      if (((b = p.name ? n.get(p.name) : o.find((C) => C.re.test(p.path))), !b))
        throw xs(1, { location: d, currentLocation: p });
      ((v = b.record.name),
        (x = Ae({}, p.params, d.params)),
        (A = b.stringify(x)));
    }
    const S = [];
    let _ = b;
    for (; _; ) (S.unshift(_.record), (_ = _.parent));
    return { name: v, path: A, params: x, matched: S, meta: fc(S) };
  }
  e.forEach((d) => r(d));
  function c() {
    ((o.length = 0), n.clear());
  }
  return {
    addRoute: r,
    resolve: f,
    removeRoute: a,
    clearRoutes: c,
    getRoutes: u,
    getRecordMatcher: l,
  };
}
function El(e, t) {
  const o = {};
  for (const n of t) n in e && (o[n] = e[n]);
  return o;
}
function Tl(e) {
  const t = {
    path: e.path,
    redirect: e.redirect,
    name: e.name,
    meta: e.meta || {},
    aliasOf: e.aliasOf,
    beforeEnter: e.beforeEnter,
    props: cc(e),
    children: e.children || [],
    instances: {},
    leaveGuards: new Set(),
    updateGuards: new Set(),
    enterCallbacks: {},
    components:
      "components" in e
        ? e.components || null
        : e.component && { default: e.component },
  };
  return (Object.defineProperty(t, "mods", { value: {} }), t);
}
function cc(e) {
  const t = {},
    o = e.props || !1;
  if ("component" in e) t.default = o;
  else for (const n in e.components) t[n] = typeof o == "object" ? o[n] : o;
  return t;
}
function Bl(e) {
  for (; e; ) {
    if (e.record.aliasOf) return !0;
    e = e.parent;
  }
  return !1;
}
function fc(e) {
  return e.reduce((t, o) => Ae(t, o.meta), {});
}
function Pl(e, t) {
  const o = {};
  for (const n in e) o[n] = n in t ? t[n] : e[n];
  return o;
}
function pc(e, t) {
  let o = 0,
    n = t.length;
  for (; o !== n; ) {
    const r = (o + n) >> 1;
    ha(e, t[r]) < 0 ? (n = r) : (o = r + 1);
  }
  const l = mc(e);
  return (l && (n = t.lastIndexOf(l, n - 1)), n);
}
function mc(e) {
  let t = e;
  for (; (t = t.parent); ) if (ba(t) && ha(e, t) === 0) return t;
}
function ba({ record: e }) {
  return !!(
    e.name ||
    (e.components && Object.keys(e.components).length) ||
    e.redirect
  );
}
function gc(e) {
  const t = {};
  if (e === "" || e === "?") return t;
  const n = (e[0] === "?" ? e.slice(1) : e).split("&");
  for (let l = 0; l < n.length; ++l) {
    const r = n[l].replace(da, " "),
      a = r.indexOf("="),
      u = zs(a < 0 ? r : r.slice(0, a)),
      i = a < 0 ? null : zs(r.slice(a + 1));
    if (u in t) {
      let f = t[u];
      (ft(f) || (f = t[u] = [f]), f.push(i));
    } else t[u] = i;
  }
  return t;
}
function Il(e) {
  let t = "";
  for (let o in e) {
    const n = e[o];
    if (((o = ju(o)), n == null)) {
      n !== void 0 && (t += (t.length ? "&" : "") + o);
      continue;
    }
    (ft(n) ? n.map((r) => r && un(r)) : [n && un(n)]).forEach((r) => {
      r !== void 0 &&
        ((t += (t.length ? "&" : "") + o), r != null && (t += "=" + r));
    });
  }
  return t;
}
function vc(e) {
  const t = {};
  for (const o in e) {
    const n = e[o];
    n !== void 0 &&
      (t[o] = ft(n)
        ? n.map((l) => (l == null ? null : "" + l))
        : n == null
          ? n
          : "" + n);
  }
  return t;
}
const hc = Symbol(""),
  jl = Symbol(""),
  Lo = Symbol(""),
  Bn = Symbol(""),
  fn = Symbol("");
function $s() {
  let e = [];
  function t(n) {
    return (
      e.push(n),
      () => {
        const l = e.indexOf(n);
        l > -1 && e.splice(l, 1);
      }
    );
  }
  function o() {
    e = [];
  }
  return { add: t, list: () => e.slice(), reset: o };
}
function Ut(e, t, o, n, l, r = (a) => a()) {
  const a = n && (n.enterCallbacks[l] = n.enterCallbacks[l] || []);
  return () =>
    new Promise((u, i) => {
      const f = (p) => {
          p === !1
            ? i(xs(4, { from: o, to: t }))
            : p instanceof Error
              ? i(p)
              : tc(p)
                ? i(xs(2, { from: t, to: p }))
                : (a &&
                    n.enterCallbacks[l] === a &&
                    typeof p == "function" &&
                    a.push(p),
                  u());
        },
        c = r(() => e.call(n && n.instances[l], t, o, f));
      let d = Promise.resolve(c);
      (e.length < 3 && (d = d.then(f)), d.catch((p) => i(p)));
    });
}
function Zo(e, t, o, n, l = (r) => r()) {
  const r = [];
  for (const a of e)
    for (const u in a.components) {
      let i = a.components[u];
      if (!(t !== "beforeRouteEnter" && !a.instances[u]))
        if (aa(i)) {
          const c = (i.__vccOpts || i)[t];
          c && r.push(Ut(c, o, n, a, u, l));
        } else {
          let f = i();
          r.push(() =>
            f.then((c) => {
              if (!c)
                throw new Error(
                  `Couldn't resolve component "${u}" at "${a.path}"`,
                );
              const d = Au(c) ? c.default : c;
              ((a.mods[u] = c), (a.components[u] = d));
              const b = (d.__vccOpts || d)[t];
              return b && Ut(b, o, n, a, u, l)();
            }),
          );
        }
    }
  return r;
}
function Ll(e) {
  const t = ut(Lo),
    o = ut(Bn),
    n = pe(() => {
      const i = ie(e.to);
      return t.resolve(i);
    }),
    l = pe(() => {
      const { matched: i } = n.value,
        { length: f } = i,
        c = i[f - 1],
        d = o.matched;
      if (!c || !d.length) return -1;
      const p = d.findIndex(ys.bind(null, c));
      if (p > -1) return p;
      const b = Ol(i[f - 2]);
      return f > 1 && Ol(c) === b && d[d.length - 1].path !== b
        ? d.findIndex(ys.bind(null, i[f - 2]))
        : p;
    }),
    r = pe(() => l.value > -1 && wc(o.params, n.value.params)),
    a = pe(
      () =>
        l.value > -1 &&
        l.value === o.matched.length - 1 &&
        pa(o.params, n.value.params),
    );
  function u(i = {}) {
    if (_c(i)) {
      const f = t[ie(e.replace) ? "replace" : "push"](ie(e.to)).catch(js);
      return (
        e.viewTransition &&
          typeof document < "u" &&
          "startViewTransition" in document &&
          document.startViewTransition(() => f),
        f
      );
    }
    return Promise.resolve();
  }
  return {
    route: n,
    href: pe(() => n.value.href),
    isActive: r,
    isExactActive: a,
    navigate: u,
  };
}
function bc(e) {
  return e.length === 1 ? e[0] : e;
}
const yc = Cr({
    name: "RouterLink",
    compatConfig: { MODE: 3 },
    props: {
      to: { type: [String, Object], required: !0 },
      replace: Boolean,
      activeClass: String,
      exactActiveClass: String,
      custom: Boolean,
      ariaCurrentValue: { type: String, default: "page" },
      viewTransition: Boolean,
    },
    useLink: Ll,
    setup(e, { slots: t }) {
      const o = Kt(Ll(e)),
        { options: n } = ut(Lo),
        l = pe(() => ({
          [Vl(e.activeClass, n.linkActiveClass, "router-link-active")]:
            o.isActive,
          [Vl(
            e.exactActiveClass,
            n.linkExactActiveClass,
            "router-link-exact-active",
          )]: o.isExactActive,
        }));
      return () => {
        const r = t.default && bc(t.default(o));
        return e.custom
          ? r
          : hs(
              "a",
              {
                "aria-current": o.isExactActive ? e.ariaCurrentValue : null,
                href: o.href,
                onClick: o.navigate,
                class: l.value,
              },
              r,
            );
      };
    },
  }),
  xc = yc;
function _c(e) {
  if (
    !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) &&
    !e.defaultPrevented &&
    !(e.button !== void 0 && e.button !== 0)
  ) {
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const t = e.currentTarget.getAttribute("target");
      if (/\b_blank\b/i.test(t)) return;
    }
    return (e.preventDefault && e.preventDefault(), !0);
  }
}
function wc(e, t) {
  for (const o in t) {
    const n = t[o],
      l = e[o];
    if (typeof n == "string") {
      if (n !== l) return !1;
    } else if (!ft(l) || l.length !== n.length || n.some((r, a) => r !== l[a]))
      return !1;
  }
  return !0;
}
function Ol(e) {
  return e ? (e.aliasOf ? e.aliasOf.path : e.path) : "";
}
const Vl = (e, t, o) => e ?? t ?? o,
  kc = Cr({
    name: "RouterView",
    inheritAttrs: !1,
    props: { name: { type: String, default: "default" }, route: Object },
    compatConfig: { MODE: 3 },
    setup(e, { attrs: t, slots: o }) {
      const n = ut(fn),
        l = pe(() => e.route || n.value),
        r = ut(jl, 0),
        a = pe(() => {
          let f = ie(r);
          const { matched: c } = l.value;
          let d;
          for (; (d = c[f]) && !d.components; ) f++;
          return f;
        }),
        u = pe(() => l.value.matched[a.value]);
      (oo(
        jl,
        pe(() => a.value + 1),
      ),
        oo(hc, u),
        oo(fn, l));
      const i = $();
      return (
        Re(
          () => [i.value, u.value, e.name],
          ([f, c, d], [p, b, x]) => {
            (c &&
              ((c.instances[d] = f),
              b &&
                b !== c &&
                f &&
                f === p &&
                (c.leaveGuards.size || (c.leaveGuards = b.leaveGuards),
                c.updateGuards.size || (c.updateGuards = b.updateGuards))),
              f &&
                c &&
                (!b || !ys(c, b) || !p) &&
                (c.enterCallbacks[d] || []).forEach((A) => A(f)));
          },
          { flush: "post" },
        ),
        () => {
          const f = l.value,
            c = e.name,
            d = u.value,
            p = d && d.components[c];
          if (!p) return Nl(o.default, { Component: p, route: f });
          const b = d.props[c],
            x = b
              ? b === !0
                ? f.params
                : typeof b == "function"
                  ? b(f)
                  : b
              : null,
            v = hs(
              p,
              Ae({}, x, t, {
                onVnodeUnmounted: (S) => {
                  S.component.isUnmounted && (d.instances[c] = null);
                },
                ref: i,
              }),
            );
          return Nl(o.default, { Component: v, route: f }) || v;
        }
      );
    },
  });
function Nl(e, t) {
  if (!e) return null;
  const o = e(t);
  return o.length === 1 ? o[0] : o;
}
const Ac = kc;
function Cc(e) {
  const t = uc(e.routes, e),
    o = e.parseQuery || gc,
    n = e.stringifyQuery || Il,
    l = e.history,
    r = $s(),
    a = $s(),
    u = $s(),
    i = Xa(jt);
  let f = jt;
  ds &&
    e.scrollBehavior &&
    "scrollRestoration" in history &&
    (history.scrollRestoration = "manual");
  const c = qo.bind(null, (O) => "" + O),
    d = qo.bind(null, Ou),
    p = qo.bind(null, zs);
  function b(O, se) {
    let M, L;
    return (
      ga(O) ? ((M = t.getRecordMatcher(O)), (L = se)) : (L = O),
      t.addRoute(L, M)
    );
  }
  function x(O) {
    const se = t.getRecordMatcher(O);
    se && t.removeRoute(se);
  }
  function A() {
    return t.getRoutes().map((O) => O.record);
  }
  function v(O) {
    return !!t.getRecordMatcher(O);
  }
  function S(O, se) {
    if (((se = Ae({}, se || i.value)), typeof O == "string")) {
      const E = Go(o, O, se.path),
        P = t.resolve({ path: E.path }, se),
        V = l.createHref(E.fullPath);
      return Ae(E, P, {
        params: p(P.params),
        hash: zs(E.hash),
        redirectedFrom: void 0,
        href: V,
      });
    }
    let M;
    if (O.path != null) M = Ae({}, O, { path: Go(o, O.path, se.path).path });
    else {
      const E = Ae({}, O.params);
      for (const P in E) E[P] == null && delete E[P];
      ((M = Ae({}, O, { params: d(E) })), (se.params = d(se.params)));
    }
    const L = t.resolve(M, se),
      D = O.hash || "";
    L.params = c(p(L.params));
    const h = Uu(n, Ae({}, O, { hash: Iu(D), path: L.path })),
      y = l.createHref(h);
    return Ae(
      { fullPath: h, hash: D, query: n === Il ? vc(O.query) : O.query || {} },
      L,
      { redirectedFrom: void 0, href: y },
    );
  }
  function _(O) {
    return typeof O == "string" ? Go(o, O, i.value.path) : Ae({}, O);
  }
  function C(O, se) {
    if (f !== O) return xs(8, { from: se, to: O });
  }
  function k(O) {
    return F(O);
  }
  function T(O) {
    return k(Ae(_(O), { replace: !0 }));
  }
  function B(O) {
    const se = O.matched[O.matched.length - 1];
    if (se && se.redirect) {
      const { redirect: M } = se;
      let L = typeof M == "function" ? M(O) : M;
      return (
        typeof L == "string" &&
          ((L = L.includes("?") || L.includes("#") ? (L = _(L)) : { path: L }),
          (L.params = {})),
        Ae(
          {
            query: O.query,
            hash: O.hash,
            params: L.path != null ? {} : O.params,
          },
          L,
        )
      );
    }
  }
  function F(O, se) {
    const M = (f = S(O)),
      L = i.value,
      D = O.state,
      h = O.force,
      y = O.replace === !0,
      E = B(M);
    if (E)
      return F(
        Ae(_(E), {
          state: typeof E == "object" ? Ae({}, D, E.state) : D,
          force: h,
          replace: y,
        }),
        se || M,
      );
    const P = M;
    P.redirectedFrom = se;
    let V;
    return (
      !h && Du(n, L, M) && ((V = xs(16, { to: P, from: L })), Ve(L, L, !0, !1)),
      (V ? Promise.resolve(V) : ge(P, L))
        .catch((N) => (kt(N) ? (kt(N, 2) ? N : Oe(N)) : me(N, P, L)))
        .then((N) => {
          if (N) {
            if (kt(N, 2))
              return F(
                Ae({ replace: y }, _(N.to), {
                  state: typeof N.to == "object" ? Ae({}, D, N.to.state) : D,
                  force: h,
                }),
                se || P,
              );
          } else N = X(P, L, !0, y, D);
          return (he(P, L, N), N);
        })
    );
  }
  function de(O, se) {
    const M = C(O, se);
    return M ? Promise.reject(M) : Promise.resolve();
  }
  function re(O) {
    const se = pt.values().next().value;
    return se && typeof se.runWithContext == "function"
      ? se.runWithContext(O)
      : O();
  }
  function ge(O, se) {
    let M;
    const [L, D, h] = $c(O, se);
    M = Zo(L.reverse(), "beforeRouteLeave", O, se);
    for (const E of L)
      E.leaveGuards.forEach((P) => {
        M.push(Ut(P, O, se));
      });
    const y = de.bind(null, O, se);
    return (
      M.push(y),
      He(M)
        .then(() => {
          M = [];
          for (const E of r.list()) M.push(Ut(E, O, se));
          return (M.push(y), He(M));
        })
        .then(() => {
          M = Zo(D, "beforeRouteUpdate", O, se);
          for (const E of D)
            E.updateGuards.forEach((P) => {
              M.push(Ut(P, O, se));
            });
          return (M.push(y), He(M));
        })
        .then(() => {
          M = [];
          for (const E of h)
            if (E.beforeEnter)
              if (ft(E.beforeEnter))
                for (const P of E.beforeEnter) M.push(Ut(P, O, se));
              else M.push(Ut(E.beforeEnter, O, se));
          return (M.push(y), He(M));
        })
        .then(
          () => (
            O.matched.forEach((E) => (E.enterCallbacks = {})),
            (M = Zo(h, "beforeRouteEnter", O, se, re)),
            M.push(y),
            He(M)
          ),
        )
        .then(() => {
          M = [];
          for (const E of a.list()) M.push(Ut(E, O, se));
          return (M.push(y), He(M));
        })
        .catch((E) => (kt(E, 8) ? E : Promise.reject(E)))
    );
  }
  function he(O, se, M) {
    u.list().forEach((L) => re(() => L(O, se, M)));
  }
  function X(O, se, M, L, D) {
    const h = C(O, se);
    if (h) return h;
    const y = se === jt,
      E = ds ? history.state : {};
    (M &&
      (L || y
        ? l.replace(O.fullPath, Ae({ scroll: y && E && E.scroll }, D))
        : l.push(O.fullPath, D)),
      (i.value = O),
      Ve(O, se, M, y),
      Oe());
  }
  let xe;
  function Q() {
    xe ||
      (xe = l.listen((O, se, M) => {
        if (!Pt.listening) return;
        const L = S(O),
          D = B(L);
        if (D) {
          F(Ae(D, { replace: !0, force: !0 }), L).catch(js);
          return;
        }
        f = L;
        const h = i.value;
        (ds && qu(Cl(h.fullPath, M.delta), jo()),
          ge(L, h)
            .catch((y) =>
              kt(y, 12)
                ? y
                : kt(y, 2)
                  ? (F(Ae(_(y.to), { force: !0 }), L)
                      .then((E) => {
                        kt(E, 20) &&
                          !M.delta &&
                          M.type === Qs.pop &&
                          l.go(-1, !1);
                      })
                      .catch(js),
                    Promise.reject())
                  : (M.delta && l.go(-M.delta, !1), me(y, L, h)),
            )
            .then((y) => {
              ((y = y || X(L, h, !1)),
                y &&
                  (M.delta && !kt(y, 8)
                    ? l.go(-M.delta, !1)
                    : M.type === Qs.pop && kt(y, 20) && l.go(-1, !1)),
                he(L, h, y));
            })
            .catch(js));
      }));
  }
  let U = $s(),
    H = $s(),
    ee;
  function me(O, se, M) {
    Oe(O);
    const L = H.list();
    return (
      L.length ? L.forEach((D) => D(O, se, M)) : console.error(O),
      Promise.reject(O)
    );
  }
  function Le() {
    return ee && i.value !== jt
      ? Promise.resolve()
      : new Promise((O, se) => {
          U.add([O, se]);
        });
  }
  function Oe(O) {
    return (
      ee ||
        ((ee = !O),
        Q(),
        U.list().forEach(([se, M]) => (O ? M(O) : se())),
        U.reset()),
      O
    );
  }
  function Ve(O, se, M, L) {
    const { scrollBehavior: D } = e;
    if (!ds || !D) return Promise.resolve();
    const h =
      (!M && Gu(Cl(O.fullPath, 0))) ||
      ((L || !M) && history.state && history.state.scroll) ||
      null;
    return So()
      .then(() => D(O, se, h))
      .then((y) => y && Ju(y))
      .catch((y) => me(y, O, se));
  }
  const Ne = (O) => l.go(O);
  let it;
  const pt = new Set(),
    Pt = {
      currentRoute: i,
      listening: !0,
      addRoute: b,
      removeRoute: x,
      clearRoutes: t.clearRoutes,
      hasRoute: v,
      getRoutes: A,
      resolve: S,
      options: e,
      push: k,
      replace: T,
      go: Ne,
      back: () => Ne(-1),
      forward: () => Ne(1),
      beforeEach: r.add,
      beforeResolve: a.add,
      afterEach: u.add,
      onError: H.add,
      isReady: Le,
      install(O) {
        const se = this;
        (O.component("RouterLink", xc),
          O.component("RouterView", Ac),
          (O.config.globalProperties.$router = se),
          Object.defineProperty(O.config.globalProperties, "$route", {
            enumerable: !0,
            get: () => ie(i),
          }),
          ds &&
            !it &&
            i.value === jt &&
            ((it = !0), k(l.location).catch((D) => {})));
        const M = {};
        for (const D in jt)
          Object.defineProperty(M, D, {
            get: () => i.value[D],
            enumerable: !0,
          });
        (O.provide(Lo, se), O.provide(Bn, ur(M)), O.provide(fn, i));
        const L = O.unmount;
        (pt.add(O),
          (O.unmount = function () {
            (pt.delete(O),
              pt.size < 1 &&
                ((f = jt),
                xe && xe(),
                (xe = null),
                (i.value = jt),
                (it = !1),
                (ee = !1)),
              L());
          }));
      },
    };
  function He(O) {
    return O.reduce((se, M) => se.then(() => re(M)), Promise.resolve());
  }
  return Pt;
}
function $c(e, t) {
  const o = [],
    n = [],
    l = [],
    r = Math.max(t.matched.length, e.matched.length);
  for (let a = 0; a < r; a++) {
    const u = t.matched[a];
    u && (e.matched.find((f) => ys(f, u)) ? n.push(u) : o.push(u));
    const i = e.matched[a];
    i && (t.matched.find((f) => ys(f, i)) || l.push(i));
  }
  return [o, n, l];
}
function Oo() {
  return ut(Lo);
}
function Pn(e) {
  return ut(Bn);
}
const Sc = { class: "header" },
  Mc = { class: "header-container" },
  Rc = { class: "header-right" },
  Ec = { class: "notification-icon" },
  Tc = { key: 0, class: "notification-badge" },
  Bc = { class: "user-avatar" },
  Pc = {
    __name: "Header",
    setup(e) {
      const t = $(!1),
        o = $("User"),
        n = $(1),
        l = Oo(),
        r = "https://fastcat-book.dev/api",
        a = pe(() => {
          if (o.value && o.value !== "User") {
            const d = o.value.split(" ");
            return d.length >= 2
              ? d[0][0] + d[1][0]
              : o.value.substring(0, 2).toUpperCase();
          }
          return "ID";
        });
      De(() => {
        const d = JSON.parse(localStorage.getItem("user"));
        d && (o.value = d.name ? d.name : d.email);
      });
      const u = () => {
          t.value = !t.value;
        },
        i = () => {
          ((t.value = !1), console.log("Navigate to My Account"));
        },
        f = () => {
          ((t.value = !1), console.log("Navigate to Settings"));
        },
        c = async () => {
          const d = localStorage.getItem("token");
          try {
            await fetch(`${r}/api/logout`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: d },
            });
          } catch (p) {
            console.error("Logout API error:", p);
          }
          (localStorage.removeItem("token"),
            localStorage.removeItem("user"),
            (t.value = !1),
            l.push({ path: "/", query: { loggedOut: "1" } }));
        };
      return (d, p) => (
        m(),
        g("header", Sc, [
          s("div", Mc, [
            p[6] ||
              (p[6] = s(
                "div",
                { class: "header-left" },
                [s("img", { src: ra, alt: "FastCat", class: "logo" })],
                -1,
              )),
            s("div", Rc, [
              s("div", Ec, [
                p[1] ||
                  (p[1] = s(
                    "svg",
                    {
                      width: "24",
                      height: "24",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      xmlns: "http://www.w3.org/2000/svg",
                    },
                    [
                      s("path", {
                        d: "M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                      }),
                      s("path", {
                        d: "M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                      }),
                    ],
                    -1,
                  )),
                n.value > 0 ? (m(), g("span", Tc, w(n.value), 1)) : K("", !0),
              ]),
              s("div", { class: "user-dropdown", onClick: u }, [
                s("div", Bc, [s("span", null, w(a.value), 1)]),
                Y(
                  Ie,
                  { name: "dropdown" },
                  {
                    default: $e(() => [
                      t.value
                        ? (m(),
                          g(
                            "div",
                            {
                              key: 0,
                              class: "dropdown-menu",
                              onClick: p[0] || (p[0] = Se(() => {}, ["stop"])),
                            },
                            [
                              s(
                                "button",
                                { class: "dropdown-item", onClick: i },
                                [
                                  ...(p[2] ||
                                    (p[2] = [
                                      s(
                                        "svg",
                                        {
                                          width: "16",
                                          height: "16",
                                          viewBox: "0 0 24 24",
                                          fill: "none",
                                          xmlns: "http://www.w3.org/2000/svg",
                                        },
                                        [
                                          s("path", {
                                            d: "M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21",
                                            stroke: "currentColor",
                                            "stroke-width": "2",
                                            "stroke-linecap": "round",
                                            "stroke-linejoin": "round",
                                          }),
                                          s("path", {
                                            d: "M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z",
                                            stroke: "currentColor",
                                            "stroke-width": "2",
                                            "stroke-linecap": "round",
                                            "stroke-linejoin": "round",
                                          }),
                                        ],
                                        -1,
                                      ),
                                      ye(" My Account ", -1),
                                    ])),
                                ],
                              ),
                              s(
                                "button",
                                { class: "dropdown-item", onClick: f },
                                [
                                  ...(p[3] ||
                                    (p[3] = [
                                      s(
                                        "svg",
                                        {
                                          width: "16",
                                          height: "16",
                                          viewBox: "0 0 24 24",
                                          fill: "none",
                                          xmlns: "http://www.w3.org/2000/svg",
                                        },
                                        [
                                          s("path", {
                                            d: "M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z",
                                            stroke: "currentColor",
                                            "stroke-width": "2",
                                            "stroke-linecap": "round",
                                            "stroke-linejoin": "round",
                                          }),
                                          s("path", {
                                            d: "M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z",
                                            stroke: "currentColor",
                                            "stroke-width": "2",
                                            "stroke-linecap": "round",
                                            "stroke-linejoin": "round",
                                          }),
                                        ],
                                        -1,
                                      ),
                                      ye(" Settings ", -1),
                                    ])),
                                ],
                              ),
                              p[5] ||
                                (p[5] = s(
                                  "div",
                                  { class: "dropdown-divider" },
                                  null,
                                  -1,
                                )),
                              s(
                                "button",
                                { class: "dropdown-item logout", onClick: c },
                                [
                                  ...(p[4] ||
                                    (p[4] = [
                                      s(
                                        "svg",
                                        {
                                          width: "16",
                                          height: "16",
                                          viewBox: "0 0 24 24",
                                          fill: "none",
                                          xmlns: "http://www.w3.org/2000/svg",
                                        },
                                        [
                                          s("path", {
                                            d: "M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9",
                                            stroke: "currentColor",
                                            "stroke-width": "2",
                                            "stroke-linecap": "round",
                                            "stroke-linejoin": "round",
                                          }),
                                          s("path", {
                                            d: "M16 17L21 12L16 7",
                                            stroke: "currentColor",
                                            "stroke-width": "2",
                                            "stroke-linecap": "round",
                                            "stroke-linejoin": "round",
                                          }),
                                          s("path", {
                                            d: "M21 12H9",
                                            stroke: "currentColor",
                                            "stroke-width": "2",
                                            "stroke-linecap": "round",
                                            "stroke-linejoin": "round",
                                          }),
                                        ],
                                        -1,
                                      ),
                                      ye(" Logout ", -1),
                                    ])),
                                ],
                              ),
                            ],
                          ))
                        : K("", !0),
                    ]),
                    _: 1,
                  },
                ),
              ]),
            ]),
          ]),
        ])
      );
    },
  },
  Ic = ns(Pc, [["__scopeId", "data-v-3d05626f"]]),
  jc = { class: "flex flex-col min-h-screen" },
  Lc = { class: "flex flex-1" },
  Oc = { class: "flex-1 bg-gray-50 min-h-0" },
  Vc = {
    __name: "App",
    setup(e) {
      const t = Pn();
      return (o, n) => {
        const l = ms("router-view");
        return (
          m(),
          g("div", jc, [
            ie(t).path !== "/" && ie(t).path !== "/teller-booking"
              ? (m(), ke(Ic, { key: 0 }))
              : K("", !0),
            s("div", Lc, [
              ie(t).path !== "/" && ie(t).path !== "/teller-booking"
                ? (m(),
                  ke(ku, { key: 0, class: "w-80 bg-gray-100 min-h-screen" }))
                : K("", !0),
              s("div", Oc, [Y(l)]),
            ]),
          ])
        );
      };
    },
  },
  Nc = ns(Vc, [["__scopeId", "data-v-b1aff1a8"]]),
  Uc = { class: "min-h-full flex items-center justify-center bg-gray-50" },
  Dc = {
    class:
      "welcome-card bg-white rounded-xl shadow-lg p-8 w-full max-w-lg text-center",
  },
  Fc = { class: "flex gap-2 items-center" },
  Hc = {
    key: 0,
    class:
      "fixed top-6 right-6 z-50 flex items-start gap-3 rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 text-gray-900 shadow-md shadow-gray-200/60 backdrop-blur",
  },
  zc = { class: "text-left" },
  Qc = { class: "font-semibold leading-5 text-green-700" },
  Kc = { class: "text-xs text-gray-600" },
  Yc = {
    __name: "home",
    setup(e) {
      const t = Pn(),
        o = Oo(),
        n = $(null),
        l = (r, a) => {
          ((n.value = { title: r, description: a }),
            setTimeout(() => {
              n.value = null;
            }, 2200));
        };
      return (
        Re(
          () => t.query.loggedIn,
          (r) => {
            r &&
              (l(
                "Welcome back!",
                "You’re signed in. Redirecting to your dashboard.",
              ),
              o.replace({ path: t.path, query: {} }));
          },
          { immediate: !0 },
        ),
        (r, a) => {
          const u = ms("router-link");
          return (
            m(),
            g("div", Uc, [
              s("div", Dc, [
                a[1] ||
                  (a[1] = s(
                    "h1",
                    { class: "text-3xl font-bold text-blue-700 mb-4" },
                    " Welcome to Fastcat Book ",
                    -1,
                  )),
                a[2] ||
                  (a[2] = s(
                    "p",
                    { class: "text-gray-600 mb-6" },
                    " Your dashboard is under construction. Please use the sidebar to navigate to other sections. ",
                    -1,
                  )),
                Y(
                  u,
                  {
                    to: "/",
                    class:
                      "inline-block px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition flex items-center justify-center gap-2",
                  },
                  {
                    default: $e(() => [
                      s("div", Fc, [
                        Y(ie(na), { class: "w-5 h-5 animate-spin" }),
                        a[0] || (a[0] = ye(" In Progress ", -1)),
                      ]),
                    ]),
                    _: 1,
                  },
                ),
              ]),
              Y(
                Ie,
                {
                  name: "slide-down",
                  "enter-active-class": "transition-all duration-300",
                  "leave-active-class": "transition-all duration-200",
                  "enter-from-class": "opacity-0 -translate-y-6",
                  "enter-to-class": "opacity-100 translate-y-0",
                  "leave-from-class": "opacity-100 translate-y-0",
                  "leave-to-class": "opacity-0 -translate-y-6",
                },
                {
                  default: $e(() => [
                    n.value
                      ? (m(),
                        g("div", Hc, [
                          a[3] ||
                            (a[3] = s(
                              "div",
                              {
                                class:
                                  "flex h-8 w-8 items-center justify-center rounded-full bg-green-100",
                              },
                              [
                                s(
                                  "svg",
                                  {
                                    class: "h-5 w-5 text-green-600",
                                    fill: "none",
                                    stroke: "currentColor",
                                    "stroke-width": "2",
                                    viewBox: "0 0 24 24",
                                  },
                                  [
                                    s("path", {
                                      "stroke-linecap": "round",
                                      "stroke-linejoin": "round",
                                      d: "M5 13l4 4L19 7",
                                    }),
                                  ],
                                ),
                              ],
                              -1,
                            )),
                          s("div", zc, [
                            s("div", Qc, w(n.value.title), 1),
                            s("div", Kc, w(n.value.description), 1),
                          ]),
                        ]))
                      : K("", !0),
                  ]),
                  _: 1,
                },
              ),
            ])
          );
        }
      );
    },
  },
  Jc = ns(Yc, [["__scopeId", "data-v-a34aee90"]]),
  qc = { class: "min-h-screen flex items-center justify-center bg-gray-50" },
  Gc = {
    class: "login-card bg-white rounded-xl shadow-lg p-8 w-full max-w-md",
  },
  Zc = { key: 0 },
  Wc = { class: "flex items-center gap-2 text-sm text-gray-600" },
  Xc = ["disabled"],
  ef = { key: 1 },
  tf = { class: "mb-6 text-center flex flex-col items-center" },
  sf = {
    class:
      "inline-flex items-center justify-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium ml-2 border border-blue-600 max-w-xs truncate",
  },
  of = ["type"],
  nf = ["disabled"],
  lf = ["disabled"],
  rf = { key: 2, class: "mt-4 flex flex-col items-center" },
  af = {
    key: 0,
    class:
      "flex items-center gap-2 text-red-500 absolute top-[50px] left-1/2 -translate-x-1/2 p-3 bg-red-100 rounded-xl shadow-lg",
  },
  df = {
    key: 0,
    class:
      "fixed top-6 right-6 z-50 flex items-start gap-3 rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 text-gray-900 shadow-md shadow-gray-200/60 backdrop-blur",
  },
  uf = { class: "text-left" },
  cf = { class: "font-semibold leading-5 text-green-700" },
  ff = { class: "text-xs text-gray-600" },
  pf = {
    __name: "Login",
    setup(e) {
      const t = $(1),
        o = $(""),
        n = $(""),
        l = $(!1),
        r = $(!1),
        a = Oo(),
        u = Pn(),
        i = $(""),
        f = $(null),
        c = $(!1),
        d = "https://fastcat-book.dev/api",
        p = () => {
          o.value && (t.value = 2);
        },
        b = async () => {
          ((i.value = ""), (c.value = !0));
          try {
            const A = await fetch(`${d}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: o.value, password: n.value }),
              }),
              v = await A.json();
            (console.log("Login response:", v),
              console.log("apiBase:", d),
              A.ok && v.success
                ? (localStorage.setItem("token", v.data.token),
                  localStorage.setItem("user", JSON.stringify(v.data.user)),
                  a.push({ path: "/dashboard", query: { loggedIn: "1" } }))
                : v.errors
                  ? v.errors.email && v.errors.email.length > 0
                    ? (i.value = v.errors.email[0])
                    : v.errors.password && v.errors.password.length > 0
                      ? (i.value = v.errors.password[0])
                      : (i.value = v.message || "Login failed")
                  : v.message === "Unauthenticated" ||
                      v.error_code === "UNAUTHENTICATED"
                    ? (i.value = "Incorrect username or password.")
                    : (i.value = v.message || "Login failed"));
          } catch {
            i.value = "Network error";
          } finally {
            c.value = !1;
          }
        },
        x = (A, v) => {
          ((f.value = { title: A, description: v }),
            setTimeout(() => {
              f.value = null;
            }, 2200));
        };
      return (
        Re(
          () => u.query.loggedOut,
          (A) => {
            A &&
              (x(
                "Signed out",
                "You’ve been logged out safely. See you next time.",
              ),
              a.replace({ path: u.path, query: {} }));
          },
          { immediate: !0 },
        ),
        (A, v) => {
          const S = ms("Eye"),
            _ = ms("EyeOff"),
            C = ms("AlertCircle");
          return (
            m(),
            g("div", qc, [
              s("div", Gc, [
                v[14] ||
                  (v[14] = s(
                    "div",
                    { class: "flex flex-col items-center" },
                    [s("img", { src: ra, alt: "FastCat", class: "h-12 mb-8" })],
                    -1,
                  )),
                s(
                  "form",
                  {
                    onSubmit:
                      v[5] ||
                      (v[5] = Se(
                        (k) => (t.value === 1 ? p() : b()),
                        ["prevent"],
                      )),
                  },
                  [
                    t.value === 1
                      ? (m(),
                        g("div", Zc, [
                          v[8] ||
                            (v[8] = s(
                              "h2",
                              {
                                class:
                                  "text-xl font-bold text-gray-700 text-center",
                              },
                              "Sign in",
                              -1,
                            )),
                          v[9] ||
                            (v[9] = s(
                              "p",
                              {
                                class: "text-gray-600 text-sm mb-6 text-center",
                              },
                              " Enter your username to continue ",
                              -1,
                            )),
                          v[10] ||
                            (v[10] = s(
                              "label",
                              {
                                class:
                                  "block text-sm font-medium text-gray-700 mb-1",
                              },
                              " Username ",
                              -1,
                            )),
                          oe(
                            s(
                              "input",
                              {
                                "onUpdate:modelValue":
                                  v[0] || (v[0] = (k) => (o.value = k)),
                                type: "text",
                                class: Z([
                                  "w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500",
                                  { invisible: c.value },
                                ]),
                                placeholder: "Enter your username",
                                required: "",
                              },
                              null,
                              2,
                            ),
                            [[be, o.value]],
                          ),
                          s(
                            "div",
                            {
                              class: Z([
                                "flex items-center justify-between mb-8",
                                { invisible: c.value },
                              ]),
                            },
                            [
                              s("label", Wc, [
                                oe(
                                  s(
                                    "input",
                                    {
                                      type: "checkbox",
                                      "onUpdate:modelValue":
                                        v[1] || (v[1] = (k) => (l.value = k)),
                                      class: "rounded",
                                    },
                                    null,
                                    512,
                                  ),
                                  [[We, l.value]],
                                ),
                                v[6] || (v[6] = ye(" Stay signed in ", -1)),
                              ]),
                              v[7] ||
                                (v[7] = s(
                                  "a",
                                  {
                                    href: "#",
                                    class:
                                      "text-blue-600 text-sm hover:underline",
                                  },
                                  " Forgot email? ",
                                  -1,
                                )),
                            ],
                            2,
                          ),
                          s(
                            "button",
                            {
                              type: "submit",
                              class: Z([
                                "w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98]",
                                { invisible: c.value },
                              ]),
                              disabled: c.value,
                            },
                            " Next ",
                            10,
                            Xc,
                          ),
                          s(
                            "div",
                            {
                              class: Z([
                                "mt-6 text-center text-gray-500 text-sm",
                                { invisible: c.value },
                              ]),
                            },
                            null,
                            2,
                          ),
                          s(
                            "div",
                            {
                              class: Z([
                                "mt-2 flex justify-center",
                                { invisible: c.value },
                              ]),
                            },
                            null,
                            2,
                          ),
                        ]))
                      : (m(),
                        g("div", ef, [
                          s("div", tf, [
                            v[11] ||
                              (v[11] = s(
                                "span",
                                { class: "text-gray-700 mb-2" },
                                "Signing in as",
                                -1,
                              )),
                            s("span", sf, w(o.value), 1),
                          ]),
                          s(
                            "label",
                            {
                              class: Z([
                                "block text-sm font-medium text-gray-700 mb-1",
                                { invisible: c.value },
                              ]),
                            },
                            " Password ",
                            2,
                          ),
                          s(
                            "div",
                            {
                              class: Z([
                                "relative mb-3",
                                { invisible: c.value },
                              ]),
                            },
                            [
                              oe(
                                s(
                                  "input",
                                  {
                                    "onUpdate:modelValue":
                                      v[2] || (v[2] = (k) => (n.value = k)),
                                    type: r.value ? "text" : "password",
                                    class:
                                      "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",
                                    placeholder: "Enter your password",
                                    required: "",
                                  },
                                  null,
                                  8,
                                  of,
                                ),
                                [[Ld, n.value]],
                              ),
                              s(
                                "button",
                                {
                                  type: "button",
                                  class:
                                    "absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-transform duration-150 hover:scale-110",
                                  onClick:
                                    v[3] ||
                                    (v[3] = (k) => (r.value = !r.value)),
                                  tabindex: "-1",
                                },
                                [
                                  r.value
                                    ? (m(), ke(_, { key: 1, class: "w-5 h-5" }))
                                    : (m(),
                                      ke(S, { key: 0, class: "w-5 h-5" })),
                                ],
                              ),
                            ],
                            2,
                          ),
                          s(
                            "div",
                            {
                              class: Z([
                                "flex items-center justify-between mb-6",
                                { invisible: c.value },
                              ]),
                            },
                            [
                              ...(v[12] ||
                                (v[12] = [
                                  s(
                                    "a",
                                    {
                                      href: "#",
                                      class:
                                        "text-blue-600 text-sm hover:underline",
                                    },
                                    " Forgot password? ",
                                    -1,
                                  ),
                                ])),
                            ],
                            2,
                          ),
                          s(
                            "button",
                            {
                              type: "button",
                              class: Z([
                                "w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98]",
                                { invisible: c.value },
                              ]),
                              onClick: b,
                              disabled: c.value,
                            },
                            " Proceed ",
                            10,
                            nf,
                          ),
                          s(
                            "div",
                            {
                              class: Z([
                                "mt-6 text-center",
                                { invisible: c.value },
                              ]),
                            },
                            [
                              s(
                                "button",
                                {
                                  type: "button",
                                  class:
                                    "text-gray-600 text-sm hover:underline transition-colors hover:text-blue-600",
                                  onClick:
                                    v[4] || (v[4] = (k) => (t.value = 1)),
                                  disabled: c.value,
                                },
                                " Sign in with a different account ",
                                8,
                                lf,
                              ),
                            ],
                            2,
                          ),
                        ])),
                    c.value
                      ? (m(),
                        g("div", rf, [
                          ...(v[13] ||
                            (v[13] = [
                              s(
                                "div",
                                {
                                  class:
                                    "flex justify-center items-center w-full",
                                },
                                [
                                  s("span", {
                                    class:
                                      "inline-block w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                                  }),
                                ],
                                -1,
                              ),
                              s(
                                "span",
                                {
                                  class:
                                    "text-blue-600 text-sm font-medium mt-3",
                                },
                                "Logging in...",
                                -1,
                              ),
                            ])),
                        ]))
                      : K("", !0),
                  ],
                  32,
                ),
              ]),
              Y(
                Ie,
                {
                  name: "slide-down",
                  "enter-active-class": "transition-all duration-300",
                  "leave-active-class": "transition-all duration-200",
                  "enter-from-class": "opacity-0 -translate-y-6",
                  "enter-to-class": "opacity-100 translate-y-0",
                  "leave-from-class": "opacity-100 translate-y-0",
                  "leave-to-class": "opacity-0 -translate-y-6",
                },
                {
                  default: $e(() => [
                    i.value
                      ? (m(),
                        g("div", af, [
                          Y(C, { class: "w-5 h-5 flex-shrink-0" }),
                          s("span", null, w(i.value), 1),
                        ]))
                      : K("", !0),
                  ]),
                  _: 1,
                },
              ),
              Y(
                Ie,
                {
                  name: "slide-down",
                  "enter-active-class": "transition-all duration-300",
                  "leave-active-class": "transition-all duration-200",
                  "enter-from-class": "opacity-0 -translate-y-6",
                  "enter-to-class": "opacity-100 translate-y-0",
                  "leave-from-class": "opacity-100 translate-y-0",
                  "leave-to-class": "opacity-0 -translate-y-6",
                },
                {
                  default: $e(() => [
                    f.value
                      ? (m(),
                        g("div", df, [
                          v[15] ||
                            (v[15] = s(
                              "div",
                              {
                                class:
                                  "flex h-8 w-8 items-center justify-center rounded-full bg-green-100",
                              },
                              [
                                s(
                                  "svg",
                                  {
                                    class: "h-5 w-5 text-green-600",
                                    fill: "none",
                                    stroke: "currentColor",
                                    "stroke-width": "2",
                                    viewBox: "0 0 24 24",
                                  },
                                  [
                                    s("path", {
                                      "stroke-linecap": "round",
                                      "stroke-linejoin": "round",
                                      d: "M5 13l4 4L19 7",
                                    }),
                                  ],
                                ),
                              ],
                              -1,
                            )),
                          s("div", uf, [
                            s("div", cf, w(f.value.title), 1),
                            s("div", ff, w(f.value.description), 1),
                          ]),
                        ]))
                      : K("", !0),
                  ]),
                  _: 1,
                },
              ),
            ])
          );
        }
      );
    },
  },
  mf = ns(pf, [["__scopeId", "data-v-7e5fe804"]]),
  gf = {
    class: "flex items-center justify-between p-6 border-b border-gray-200",
  },
  vf = ["disabled"],
  hf = { class: "space-y-3" },
  bf = { class: "flex items-center" },
  yf = ["disabled"],
  xf = { class: "flex items-center" },
  _f = ["disabled"],
  wf = { class: "flex items-center" },
  kf = ["disabled"],
  Af = ["disabled"],
  Cf = {
    class: "flex items-center justify-end gap-3 pt-6 border-t border-gray-200",
  },
  $f = ["disabled"],
  Sf = ["disabled"],
  Mf = { key: 0, class: "flex items-center gap-2" },
  Rf = { key: 1 },
  Ef = { key: 0, class: "text-red-500 text-sm mt-2 text-center" },
  Tf = {
    __name: "ModalCreatePort",
    emits: ["save", "close"],
    setup(e, { emit: t }) {
      const o = t,
        n = $(!1),
        l = $(""),
        r = JSON.parse(localStorage.getItem("user")),
        a = r?.name || r?.email || "Unknown",
        u = "https://fastcat-book.dev/api",
        i = $({
          port_name: "",
          corridor: "",
          facilities: "",
          last_update_by: a,
          is_active: 1,
        }),
        f = async () => {
          (console.log("Saving port...", i.value),
            (l.value = ""),
            (n.value = !0));
          try {
            const c = localStorage.getItem("token"),
              d = await fetch(`${u}/ports`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: c,
                },
                body: JSON.stringify(i.value),
              }),
              p = await d.json();
            d.ok && p.success
              ? (o("save", { ...i.value }),
                (i.value = {
                  port_name: "",
                  corridor: "",
                  facilities: "",
                  last_update_by: a,
                  is_active: 1,
                }),
                o("close"))
              : (l.value = p.message || "Failed to save port.");
          } catch {
            l.value = "Network error. Please try again.";
          } finally {
            n.value = !1;
          }
        };
      return (c, d) => (
        m(),
        g(
          "div",
          {
            class:
              "fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50",
            onClick: d[8] || (d[8] = (p) => c.$emit("close")),
          },
          [
            s(
              "div",
              {
                class:
                  "modal-card bg-white rounded-lg shadow-xl w-full max-w-md mx-4",
                onClick: d[7] || (d[7] = Se(() => {}, ["stop"])),
              },
              [
                s("div", gf, [
                  d[10] ||
                    (d[10] = s(
                      "div",
                      null,
                      [
                        s(
                          "h2",
                          { class: "text-lg font-semibold text-gray-900" },
                          "Create a Port",
                        ),
                        s(
                          "p",
                          { class: "text-sm text-gray-500 mt-1" },
                          " Provide basic information about the port ",
                        ),
                      ],
                      -1,
                    )),
                  s(
                    "button",
                    {
                      onClick: d[0] || (d[0] = (p) => c.$emit("close")),
                      class:
                        "text-gray-400 hover:text-gray-600 transition-colors",
                    },
                    [
                      ...(d[9] ||
                        (d[9] = [
                          s(
                            "svg",
                            {
                              class: "w-6 h-6",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24",
                            },
                            [
                              s("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M6 18L18 6M6 6l12 12",
                              }),
                            ],
                            -1,
                          ),
                        ])),
                    ],
                  ),
                ]),
                s(
                  "form",
                  { onSubmit: Se(f, ["prevent"]), class: "p-6 space-y-6" },
                  [
                    s("div", null, [
                      d[11] ||
                        (d[11] = s(
                          "label",
                          {
                            class:
                              "block text-sm font-medium text-gray-700 mb-2",
                          },
                          " Port Name ",
                          -1,
                        )),
                      oe(
                        s(
                          "input",
                          {
                            "onUpdate:modelValue":
                              d[1] || (d[1] = (p) => (i.value.port_name = p)),
                            type: "text",
                            placeholder:
                              "Enter port name (e.g. Batangas, etc.)",
                            required: "",
                            class:
                              "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                            disabled: n.value,
                          },
                          null,
                          8,
                          vf,
                        ),
                        [[be, i.value.port_name]],
                      ),
                    ]),
                    s("div", null, [
                      d[15] ||
                        (d[15] = s(
                          "label",
                          {
                            class:
                              "block text-sm font-medium text-gray-700 mb-3",
                          },
                          " Select a corridor ",
                          -1,
                        )),
                      s("div", hf, [
                        s("label", bf, [
                          oe(
                            s(
                              "input",
                              {
                                "onUpdate:modelValue":
                                  d[2] ||
                                  (d[2] = (p) => (i.value.corridor = p)),
                                type: "radio",
                                value: "Western",
                                class:
                                  "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300",
                                disabled: n.value,
                              },
                              null,
                              8,
                              yf,
                            ),
                            [[ao, i.value.corridor]],
                          ),
                          d[12] ||
                            (d[12] = s(
                              "span",
                              { class: "ml-3 text-sm text-gray-700" },
                              "Western Corridor",
                              -1,
                            )),
                        ]),
                        s("label", xf, [
                          oe(
                            s(
                              "input",
                              {
                                "onUpdate:modelValue":
                                  d[3] ||
                                  (d[3] = (p) => (i.value.corridor = p)),
                                type: "radio",
                                value: "Central",
                                class:
                                  "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300",
                                disabled: n.value,
                              },
                              null,
                              8,
                              _f,
                            ),
                            [[ao, i.value.corridor]],
                          ),
                          d[13] ||
                            (d[13] = s(
                              "span",
                              { class: "ml-3 text-sm text-gray-700" },
                              "Central Corridor",
                              -1,
                            )),
                        ]),
                        s("label", wf, [
                          oe(
                            s(
                              "input",
                              {
                                "onUpdate:modelValue":
                                  d[4] ||
                                  (d[4] = (p) => (i.value.corridor = p)),
                                type: "radio",
                                value: "Eastern",
                                class:
                                  "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300",
                                disabled: n.value,
                              },
                              null,
                              8,
                              kf,
                            ),
                            [[ao, i.value.corridor]],
                          ),
                          d[14] ||
                            (d[14] = s(
                              "span",
                              { class: "ml-3 text-sm text-gray-700" },
                              "Eastern Corridor",
                              -1,
                            )),
                        ]),
                      ]),
                    ]),
                    s("div", null, [
                      d[16] ||
                        (d[16] = s(
                          "label",
                          {
                            class:
                              "block text-sm font-medium text-gray-700 mb-2",
                          },
                          " Facilities ",
                          -1,
                        )),
                      oe(
                        s(
                          "input",
                          {
                            "onUpdate:modelValue":
                              d[5] || (d[5] = (p) => (i.value.facilities = p)),
                            type: "text",
                            placeholder: "Enter facilities",
                            required: "",
                            class:
                              "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                            disabled: n.value,
                          },
                          null,
                          8,
                          Af,
                        ),
                        [[be, i.value.facilities]],
                      ),
                    ]),
                    s("div", Cf, [
                      s(
                        "button",
                        {
                          type: "button",
                          onClick: d[6] || (d[6] = (p) => c.$emit("close")),
                          class:
                            "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
                          disabled: n.value,
                        },
                        " Cancel ",
                        8,
                        $f,
                      ),
                      s(
                        "button",
                        {
                          type: "submit",
                          class:
                            "px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
                          disabled: n.value,
                        },
                        [
                          n.value
                            ? (m(),
                              g("span", Mf, [
                                ...(d[17] ||
                                  (d[17] = [
                                    s(
                                      "span",
                                      {
                                        class:
                                          "inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                                      },
                                      null,
                                      -1,
                                    ),
                                    ye(" Saving... ", -1),
                                  ])),
                              ]))
                            : (m(), g("span", Rf, " Save Port ")),
                        ],
                        8,
                        Sf,
                      ),
                    ]),
                    l.value ? (m(), g("div", Ef, w(l.value), 1)) : K("", !0),
                  ],
                  32,
                ),
              ],
            ),
          ],
        )
      );
    },
  },
  Bf = {
    class: "fixed inset-0 z-50 flex items-center justify-center bg-black/30",
  },
  Pf = {
    class:
      "modal-card bg-white rounded-2xl shadow-2xl w-full max-w-7xl p-10 relative",
  },
  If = { class: "mb-2 flex items-center justify-between" },
  jf = { class: "text-xl font-bold text-gray-900 flex items-center gap-2" },
  Lf = { class: "text-gray-500 text-sm" },
  Of = { class: "mb-6 flex items-center gap-4" },
  Vf = {
    class:
      "flex flex-wrap items-center gap-2 p-2 bg-gray-100 rounded-lg border-1 border-gray-300",
  },
  Nf = { class: "border-1 p-2 border-gray-300 bg-white rounded-lg" },
  Uf = { class: "flex gap-8" },
  Df = { class: "flex-1 min-w-0 border-gray-200 border rounded-lg" },
  Ff = {
    class:
      "mb-6 pb-4 flex items-center justify-between border-b border-gray-200 p-4",
  },
  Hf = { class: "flex items-center gap-2" },
  zf = { class: "overflow-x-auto p-4" },
  Qf = { class: "min-w-full text-sm" },
  Kf = { class: "px-4 py-4" },
  Yf = { class: "px-4 py-4" },
  Jf = { class: "px-4 py-4" },
  qf = { class: "px-4 py-4" },
  Gf = { class: "px-4 py-4" },
  Zf = { class: "px-4 py-4" },
  Wf = {
    key: 0,
    class:
      "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold",
  },
  Xf = {
    key: 1,
    class:
      "bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold",
  },
  e0 = {
    key: 2,
    class:
      "bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold",
  },
  t0 = { class: "w-96 flex flex-col gap-4" },
  s0 = { class: "border rounded-lg flex flex-col gap-3 border-gray-300" },
  o0 = { class: "flex gap-2 pb-4 px-4 items-center" },
  n0 = { class: "relative inline-block w-11 h-5" },
  l0 = ["disabled"],
  r0 = { class: "text-sm" },
  a0 = { class: "border rounded-lg flex gap-3 flex-col border-gray-300" },
  i0 = { class: "flex gap-2 pb-4 px-4 items-center" },
  d0 = { class: "relative inline-block w-11 h-5" },
  u0 = ["disabled"],
  c0 = { class: "text-sm" },
  f0 = {
    __name: "ModalViewPort",
    props: { port: Object, passengers: Array },
    setup(e) {
      const t = e,
        o = $("selfbook"),
        n = $(""),
        l = $(""),
        r = $(""),
        a = $(!1),
        u = $(!0),
        i = $(!1),
        f = pe(() => {
          let c = t.passengers || [];
          if (
            (o.value === "selfbook"
              ? (c = c.filter((d) => !d.type || d.type === "selfbook"))
              : o.value === "teller"
                ? (c = c.filter((d) => d.type === "teller"))
                : o.value === "institutional" &&
                  (c = c.filter((d) => d.type === "institutional")),
            n.value)
          ) {
            const d = n.value.toLowerCase();
            c = c.filter(
              (p) =>
                p.fullname.toLowerCase().includes(d) ||
                p.bookingNo.toLowerCase().includes(d),
            );
          }
          return (
            l.value && (c = c.filter((d) => d.departureDate >= l.value)),
            r.value && (c = c.filter((d) => d.departureDate <= r.value)),
            c
          );
        });
      return (c, d) => (
        m(),
        g("div", Bf, [
          s("div", Pf, [
            s(
              "button",
              {
                onClick: d[0] || (d[0] = (p) => c.$emit("close")),
                class:
                  "absolute top-4 right-4 text-gray-400 hover:text-gray-700",
              },
              [
                ...(d[9] ||
                  (d[9] = [
                    s("span", { class: "sr-only" }, "Close", -1),
                    s(
                      "svg",
                      {
                        class: "w-6 h-6",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                      },
                      [
                        s("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          d: "M6 18L18 6M6 6l12 12",
                        }),
                      ],
                      -1,
                    ),
                  ])),
              ],
            ),
            s("div", If, [
              s("div", null, [
                s("h2", jf, [
                  ye(w(e.port.name) + " ", 1),
                  d[10] ||
                    (d[10] = s(
                      "a",
                      {
                        href: "#",
                        class:
                          "text-blue-600 text-sm font-medium hover:underline ml-2",
                      },
                      "Edit Port",
                      -1,
                    )),
                ]),
                s("div", Lf, w(e.port.corridor), 1),
              ]),
            ]),
            s("div", Of, [
              s("div", Vf, [
                s(
                  "button",
                  {
                    class: Z([
                      "px-3 py-1 rounded text-sm font-medium",
                      o.value === "selfbook"
                        ? "bg-white text-gray-900"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                    ]),
                    onClick: d[1] || (d[1] = (p) => (o.value = "selfbook")),
                  },
                  " Self book ",
                  2,
                ),
                s(
                  "button",
                  {
                    class: Z([
                      "px-3 py-1 rounded text-sm font-medium",
                      o.value === "teller"
                        ? "bg-white text-gray-900"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                    ]),
                    onClick: d[2] || (d[2] = (p) => (o.value = "teller")),
                  },
                  " Teller ",
                  2,
                ),
                s(
                  "button",
                  {
                    class: Z([
                      "px-3 py-1 rounded text-sm font-medium",
                      o.value === "institutional"
                        ? "bg-white text-gray-900"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                    ]),
                    onClick:
                      d[3] || (d[3] = (p) => (o.value = "institutional")),
                  },
                  " Institutional Accounts ",
                  2,
                ),
              ]),
              s("div", Nf, [
                oe(
                  s(
                    "input",
                    {
                      type: "date",
                      "onUpdate:modelValue":
                        d[4] || (d[4] = (p) => (l.value = p)),
                      class: "border-0 rounded px-2 py-1 text-sm",
                    },
                    null,
                    512,
                  ),
                  [[be, l.value]],
                ),
                d[11] ||
                  (d[11] = s("span", { class: "text-gray-400" }, "-", -1)),
                oe(
                  s(
                    "input",
                    {
                      type: "date",
                      "onUpdate:modelValue":
                        d[5] || (d[5] = (p) => (r.value = p)),
                      class: "border-0 rounded px-2 py-1 text-sm",
                    },
                    null,
                    512,
                  ),
                  [[be, r.value]],
                ),
              ]),
              d[12] ||
                (d[12] = s(
                  "button",
                  { class: "ml-2 text-gray-500 hover:text-blue-600" },
                  [
                    s(
                      "svg",
                      {
                        class: "w-5 h-5",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                      },
                      [
                        s("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          d: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V10z",
                        }),
                      ],
                    ),
                  ],
                  -1,
                )),
            ]),
            s("div", Uf, [
              s("div", Df, [
                s("div", Ff, [
                  d[15] ||
                    (d[15] = s(
                      "div",
                      { class: "font-semibold text-gray-900" },
                      "List of Passengers",
                      -1,
                    )),
                  s("div", Hf, [
                    d[13] ||
                      (d[13] = s(
                        "select",
                        { class: "border rounded px-2 py-1 text-sm" },
                        [
                          s("option", null, "10"),
                          s("option", null, "25"),
                          s("option", null, "50"),
                        ],
                        -1,
                      )),
                    d[14] ||
                      (d[14] = s(
                        "span",
                        { class: "text-gray-500 text-sm" },
                        "entries per page",
                        -1,
                      )),
                    oe(
                      s(
                        "input",
                        {
                          "onUpdate:modelValue":
                            d[6] || (d[6] = (p) => (n.value = p)),
                          type: "text",
                          placeholder: "Search",
                          class: "ml-2 px-3 py-1 border rounded text-sm",
                        },
                        null,
                        512,
                      ),
                      [[be, n.value]],
                    ),
                  ]),
                ]),
                s("div", zf, [
                  s("table", Qf, [
                    d[17] ||
                      (d[17] = s(
                        "thead",
                        { class: "" },
                        [
                          s("tr", { class: "bg-gray-50" }, [
                            s(
                              "th",
                              {
                                class:
                                  "px-4 py-4 text-left font-medium text-gray-500 rounded-tl-lg rounded-bl-lg",
                              },
                              " # ",
                            ),
                            s(
                              "th",
                              {
                                class:
                                  "px-4 py-4 text-left font-medium text-gray-500",
                              },
                              " Fullname ",
                            ),
                            s(
                              "th",
                              {
                                class:
                                  "px-4 py-4 text-left font-medium text-gray-500",
                              },
                              " Booking No. ",
                            ),
                            s(
                              "th",
                              {
                                class:
                                  "px-4 py-4 text-left font-medium text-gray-500",
                              },
                              " Departure Date ",
                            ),
                            s(
                              "th",
                              {
                                class:
                                  "px-4 py-4 text-left font-medium text-gray-500",
                              },
                              " Transaction Date ",
                            ),
                            s(
                              "th",
                              {
                                class:
                                  "px-4 py-4 text-left font-medium text-gray-500",
                              },
                              " Status ",
                            ),
                            s(
                              "th",
                              {
                                class:
                                  "px-4 py-4 text-left font-medium text-gray-500 rounded-tr-lg rounded-br-lg",
                              },
                              " Action ",
                            ),
                          ]),
                        ],
                        -1,
                      )),
                    s("tbody", null, [
                      (m(!0),
                      g(
                        q,
                        null,
                        le(
                          f.value,
                          (p, b) => (
                            m(),
                            g("tr", { key: p.id }, [
                              s("td", Kf, w(b + 1), 1),
                              s("td", Yf, w(p.fullname), 1),
                              s("td", Jf, w(p.bookingNo), 1),
                              s("td", qf, w(p.departureDate), 1),
                              s("td", Gf, w(p.transactionDate), 1),
                              s("td", Zf, [
                                p.status === "Paid"
                                  ? (m(), g("span", Wf, "Paid"))
                                  : p.status === "Cancelled"
                                    ? (m(), g("span", Xf, "Cancelled"))
                                    : (m(), g("span", e0, "Open")),
                              ]),
                              d[16] ||
                                (d[16] = s(
                                  "td",
                                  { class: "px-4 py-2" },
                                  [
                                    s(
                                      "a",
                                      {
                                        href: "#",
                                        class:
                                          "text-blue-600 font-medium hover:underline",
                                      },
                                      "Open",
                                    ),
                                  ],
                                  -1,
                                )),
                            ])
                          ),
                        ),
                        128,
                      )),
                    ]),
                  ]),
                ]),
              ]),
              s("div", t0, [
                d[22] ||
                  (d[22] = s(
                    "div",
                    { class: "border rounded-lg p-4 border-gray-300" },
                    [
                      s(
                        "div",
                        { class: "font-semibold text-gray-900 mb-1" },
                        " Port Availability ",
                      ),
                      s("div", { class: "text-sm" }, [
                        ye(" Booking is "),
                        s(
                          "span",
                          { class: "text-red-600 font-semibold" },
                          "currently unavailable",
                        ),
                        ye(
                          " because one or more required statuses are not activated. ",
                        ),
                      ]),
                    ],
                    -1,
                  )),
                s("div", s0, [
                  d[19] ||
                    (d[19] = s(
                      "div",
                      null,
                      [
                        s(
                          "div",
                          {
                            class:
                              "font-semibold text-gray-900 mb-1 border-b border-gray-300 p-4",
                          },
                          " Ramp Status ",
                        ),
                        s("div", { class: "text-sm pt-4 text-gray-600 px-4" }, [
                          s("p", null, "This port has a working ramp"),
                        ]),
                      ],
                      -1,
                    )),
                  s("div", o0, [
                    s("div", n0, [
                      oe(
                        s(
                          "input",
                          {
                            id: "switch-ramp-status",
                            type: "checkbox",
                            class:
                              "peer appearance-none w-11 h-5 bg-slate-300 rounded-full checked:bg-green-600 cursor-pointer transition-colors duration-300",
                            "onUpdate:modelValue":
                              d[7] || (d[7] = (p) => (u.value = p)),
                            disabled: a.value,
                          },
                          null,
                          8,
                          l0,
                        ),
                        [[We, u.value]],
                      ),
                      d[18] ||
                        (d[18] = s(
                          "label",
                          {
                            for: "switch-ramp-status",
                            class:
                              "absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-green-600 cursor-pointer",
                          },
                          null,
                          -1,
                        )),
                    ]),
                    s("span", r0, w(u.value ? "Activated" : "Deactivated"), 1),
                  ]),
                ]),
                s("div", a0, [
                  d[21] ||
                    (d[21] = s(
                      "div",
                      null,
                      [
                        s(
                          "div",
                          {
                            class:
                              "font-semibold text-gray-900 mb-1 border-b border-gray-300 p-4",
                          },
                          " Port Status ",
                        ),
                        s(
                          "div",
                          { class: "text-sm pt-4 text-gray-600 px-4" },
                          " This port will be unavailable for booking ",
                        ),
                      ],
                      -1,
                    )),
                  s("div", i0, [
                    s("div", d0, [
                      oe(
                        s(
                          "input",
                          {
                            id: "switch-port-status",
                            type: "checkbox",
                            class:
                              "peer appearance-none w-11 h-5 bg-slate-300 rounded-full checked:bg-green-600 cursor-pointer transition-colors duration-300",
                            "onUpdate:modelValue":
                              d[8] || (d[8] = (p) => (i.value = p)),
                            disabled: a.value,
                          },
                          null,
                          8,
                          u0,
                        ),
                        [[We, i.value]],
                      ),
                      d[20] ||
                        (d[20] = s(
                          "label",
                          {
                            for: "switch-port-status",
                            class:
                              "absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-green-600 cursor-pointer",
                          },
                          null,
                          -1,
                        )),
                    ]),
                    s("span", c0, w(i.value ? "Activated" : "Deactivated"), 1),
                  ]),
                ]),
              ]),
            ]),
          ]),
        ])
      );
    },
  },
  p0 = { class: "min-h-full bg-gray-50 p-6" },
  m0 = { class: "mb-6" },
  g0 = { class: "flex justify-between items-center" },
  v0 = ["disabled"],
  h0 = { class: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" },
  b0 = { class: "bg-white rounded-lg p-6 shadow-sm" },
  y0 = { class: "text-3xl font-bold text-gray-900 mb-1" },
  x0 = { class: "text-sm text-gray-500" },
  _0 = { class: "bg-white rounded-lg p-6 shadow-sm" },
  w0 = { class: "flex items-center justify-between mb-4" },
  k0 = { class: "text-3xl font-bold text-gray-900 mb-1" },
  A0 = { class: "bg-white rounded-lg p-6 shadow-sm" },
  C0 = { class: "flex items-center justify-between mb-4" },
  $0 = { class: "text-3xl font-bold text-gray-900 mb-1" },
  S0 = { class: "bg-white rounded-lg shadow-sm" },
  M0 = { class: "border-b border-gray-200" },
  R0 = { class: "flex space-x-8 px-6" },
  E0 = ["onClick"],
  T0 = { class: "p-6" },
  B0 = { class: "flex items-center justify-between mb-6" },
  P0 = { class: "relative" },
  I0 = { class: "relative" },
  j0 = { class: "overflow-x-auto" },
  L0 = { class: "max-h-[245px] overflow-y-auto" },
  O0 = { class: "min-w-full divide-y divide-gray-200" },
  V0 = { class: "bg-white divide-y divide-gray-200" },
  N0 = { key: 0 },
  U0 = { class: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" },
  D0 = { class: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" },
  F0 = { class: "px-6 py-4 whitespace-nowrap text-sm text-gray-500" },
  H0 = { class: "px-6 py-4 whitespace-nowrap text-sm text-gray-500" },
  z0 = { class: "px-6 py-4 whitespace-nowrap text-sm text-gray-500" },
  Q0 = { class: "px-6 py-4 whitespace-nowrap" },
  K0 = { class: "px-6 py-4 whitespace-nowrap text-sm text-gray-500" },
  Y0 = { class: "px-6 py-4 whitespace-nowrap text-sm text-gray-500" },
  J0 = { class: "px-6 py-4 whitespace-nowrap text-sm" },
  q0 = ["onClick"],
  G0 = {
    __name: "createPort",
    setup(e) {
      const t = $(!1),
        o = $(!1),
        n = $("all"),
        l = $(""),
        r = "https://fastcat-book.dev/api",
        a = [
          { id: "all", name: "All Ports" },
          { id: "active", name: "Active Ports" },
          { id: "closed", name: "Closed Ports" },
        ],
        u = $([]),
        i = pe(() => u.value.length),
        f = pe(() => u.value.filter((_) => _.status === "Offline").length),
        c = $(0),
        d = $(null),
        p = $([]),
        b = pe(() => {
          let _ = u.value;
          if (
            (n.value === "active"
              ? (_ = _.filter(
                  (C) => C.status === "Online" || C.status === "Available",
                ))
              : n.value === "closed" &&
                (_ = _.filter((C) => C.status === "Offline")),
            l.value)
          ) {
            const C = l.value.toLowerCase();
            _ = _.filter(
              (k) =>
                k.name.toLowerCase().includes(C) ||
                k.corridor.toLowerCase().includes(C) ||
                k.updatedBy.toLowerCase().includes(C),
            );
          }
          return _;
        }),
        x = (_) =>
          _ === "Available" || _ === "Online"
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800",
        A = (_) => {
          ((d.value = _),
            (p.value = [
              {
                id: 1,
                fullname: "Towy B. Dumaplin",
                bookingNo: "BF09KLDXZ",
                departureDate: "2025-08-02",
                transactionDate: "2025-08-02",
                status: "Paid",
              },
              {
                id: 2,
                fullname: "Johnny D. Doe",
                bookingNo: "BF09KLDXZ",
                departureDate: "2025-08-02",
                transactionDate: "2025-08-02",
                status: "Cancelled",
              },
              {
                id: 3,
                fullname: "Jade L. Smith",
                bookingNo: "BF09KLDXZ",
                departureDate: "2025-08-02",
                transactionDate: "2025-08-02",
                status: "Paid",
              },
              {
                id: 4,
                fullname: "Carlsen Y. Not",
                bookingNo: "BF09KLDXZ",
                departureDate: "2025-08-02",
                transactionDate: "2025-08-02",
                status: "Open",
              },
              {
                id: 5,
                fullname: "Earl G. Barkawi",
                bookingNo: "BF09KLDXZ",
                departureDate: "2025-08-02",
                transactionDate: "2025-08-02",
                status: "Paid",
              },
              {
                id: 6,
                fullname: "Jess L. Smith",
                bookingNo: "BF09KLDXZ",
                departureDate: "2025-08-02",
                transactionDate: "2025-08-02",
                status: "Open",
              },
            ]));
        },
        v = async () => {
          o.value = !0;
          try {
            const _ = localStorage.getItem("token"),
              C = await fetch(`${r}/ports`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: _,
                },
              }),
              k = await C.json();
            C.ok && k.success && k.data?.ports
              ? (u.value = k.data.ports.map((T, B) => ({
                  id: T.id || B + 1,
                  name: T.port_name,
                  corridor: T.corridor,
                  facilities: T.facilities,
                  updatedBy: T.last_update_by,
                  status: T.is_active === 1 ? "Available" : "Offline",
                  createdAt: T.created_at
                    ? T.created_at.slice(0, 16).replace("T", " ")
                    : "",
                  lastUpdated: T.updated_at
                    ? T.updated_at.slice(0, 16).replace("T", " ")
                    : "",
                })))
              : console.error("Failed to fetch ports:", k.message || k);
          } catch (_) {
            console.error("Network error fetching ports:", _);
          } finally {
            o.value = !1;
          }
        };
      De(v);
      const S = () => {
        ((t.value = !1), v());
      };
      return (_, C) => (
        m(),
        g("div", p0, [
          s("div", m0, [
            C[5] ||
              (C[5] = s(
                "nav",
                { class: "text-sm text-gray-500 mb-2" },
                [
                  s("span", null, "Dashboard"),
                  s("span", { class: "mx-2" }, ">"),
                  s("span", { class: "text-gray-900" }, "Ports"),
                ],
                -1,
              )),
            s("div", g0, [
              C[4] ||
                (C[4] = s(
                  "h1",
                  { class: "text-2xl font-semibold text-gray-900" },
                  "Port Management",
                  -1,
                )),
              s(
                "button",
                {
                  onClick: C[0] || (C[0] = (k) => (t.value = !0)),
                  type: "button",
                  class:
                    "bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
                  disabled: o.value,
                },
                [
                  Y(ie(Yt), { class: "w-4 h-4" }),
                  ye(" " + w(o.value ? "Loading..." : "Create"), 1),
                ],
                8,
                v0,
              ),
            ]),
          ]),
          s("div", h0, [
            s("div", b0, [
              C[6] ||
                (C[6] = s(
                  "div",
                  { class: "flex items-center justify-between mb-4" },
                  [
                    s(
                      "h3",
                      { class: "text-sm font-medium text-gray-600" },
                      "Total Ports",
                    ),
                  ],
                  -1,
                )),
              s("div", y0, w(o.value ? "—" : i.value), 1),
              s(
                "p",
                x0,
                w(
                  o.value
                    ? "Loading data..."
                    : `${f.value} closed ports as of today`,
                ),
                1,
              ),
            ]),
            s("div", _0, [
              s("div", w0, [
                C[7] ||
                  (C[7] = s(
                    "h3",
                    { class: "text-sm font-medium text-gray-600" },
                    "Closed Ports",
                    -1,
                  )),
                Y(ie(Io), { class: "w-5 h-5 text-blue-600" }),
              ]),
              s("div", k0, w(o.value ? "—" : f.value), 1),
              C[8] ||
                (C[8] = s(
                  "p",
                  { class: "text-sm text-gray-500" },
                  "Across all available ports",
                  -1,
                )),
            ]),
            s("div", A0, [
              s("div", C0, [
                C[9] ||
                  (C[9] = s(
                    "h3",
                    { class: "text-sm font-medium text-gray-600" },
                    " Zero-Transaction Ports ",
                    -1,
                  )),
                Y(ie(qs), { class: "w-5 h-5 text-blue-600" }),
              ]),
              s("div", $0, w(o.value ? "—" : c.value), 1),
              C[10] ||
                (C[10] = s(
                  "p",
                  { class: "text-sm text-gray-500" },
                  " Total of active ports without transaction ",
                  -1,
                )),
            ]),
          ]),
          s("div", S0, [
            s("div", M0, [
              s("nav", R0, [
                (m(),
                g(
                  q,
                  null,
                  le(a, (k) =>
                    s(
                      "button",
                      {
                        key: k.id,
                        onClick: (T) => (n.value = k.id),
                        class: Z([
                          "py-4 px-1 border-b-2 font-medium text-sm",
                          n.value === k.id
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                        ]),
                      },
                      w(k.name),
                      11,
                      E0,
                    ),
                  ),
                  64,
                )),
              ]),
            ]),
            s("div", T0, [
              s("div", B0, [
                C[11] ||
                  (C[11] = s(
                    "h2",
                    { class: "text-lg font-medium text-gray-900" },
                    "List of Ports",
                    -1,
                  )),
                s("div", P0, [
                  Y(ie(Bt), {
                    class:
                      "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4",
                  }),
                  oe(
                    s(
                      "input",
                      {
                        "onUpdate:modelValue":
                          C[1] || (C[1] = (k) => (l.value = k)),
                        type: "text",
                        placeholder: "Search",
                        class:
                          "pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      },
                      null,
                      512,
                    ),
                    [[be, l.value]],
                  ),
                ]),
              ]),
              s("div", I0, [
                s("div", j0, [
                  s("div", L0, [
                    s("table", O0, [
                      C[13] ||
                        (C[13] = s(
                          "thead",
                          { class: "bg-gray-50" },
                          [
                            s("tr", null, [
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                },
                                " # ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                },
                                " Port Name ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                },
                                " Corridor ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                },
                                " Facilities ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                },
                                " Updated by ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                },
                                " Status ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                },
                                " Created at ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                },
                                " Last updated ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                },
                                " Action ",
                              ),
                            ]),
                          ],
                          -1,
                        )),
                      s("tbody", V0, [
                        o.value
                          ? (m(),
                            g("tr", N0, [
                              ...(C[12] ||
                                (C[12] = [
                                  s(
                                    "td",
                                    {
                                      colspan: "9",
                                      class:
                                        "px-6 py-8 text-center text-sm text-gray-500",
                                    },
                                    " Loading ports... ",
                                    -1,
                                  ),
                                ])),
                            ]))
                          : (m(!0),
                            g(
                              q,
                              { key: 1 },
                              le(
                                b.value,
                                (k) => (
                                  m(),
                                  g(
                                    "tr",
                                    { key: k.id, class: "hover:bg-gray-50" },
                                    [
                                      s("td", U0, w(k.id), 1),
                                      s("td", D0, w(k.name), 1),
                                      s("td", F0, w(k.corridor), 1),
                                      s("td", H0, w(k.facilities), 1),
                                      s("td", z0, w(k.updatedBy), 1),
                                      s("td", Q0, [
                                        s(
                                          "span",
                                          {
                                            class: Z([
                                              x(k.status),
                                              "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                            ]),
                                          },
                                          w(k.status),
                                          3,
                                        ),
                                      ]),
                                      s("td", K0, w(k.createdAt), 1),
                                      s("td", Y0, w(k.lastUpdated), 1),
                                      s("td", J0, [
                                        s(
                                          "button",
                                          {
                                            onClick: (T) => A(k),
                                            class:
                                              "font-medium text-blue-600 hover:text-blue-900",
                                          },
                                          " View ",
                                          8,
                                          q0,
                                        ),
                                      ]),
                                    ],
                                  )
                                ),
                              ),
                              128,
                            )),
                      ]),
                    ]),
                  ]),
                ]),
              ]),
            ]),
          ]),
          Y(
            Ie,
            { name: "modal-fade" },
            {
              default: $e(() => [
                t.value
                  ? (m(),
                    ke(Tf, {
                      key: 0,
                      onClose: C[2] || (C[2] = (k) => (t.value = !1)),
                      onSave: S,
                    }))
                  : K("", !0),
              ]),
              _: 1,
            },
          ),
          Y(
            Ie,
            { name: "modal-fade" },
            {
              default: $e(() => [
                d.value
                  ? (m(),
                    ke(
                      f0,
                      {
                        key: 0,
                        port: d.value,
                        passengers: p.value,
                        onClose: C[3] || (C[3] = (k) => (d.value = null)),
                      },
                      null,
                      8,
                      ["port", "passengers"],
                    ))
                  : K("", !0),
              ]),
              _: 1,
            },
          ),
        ])
      );
    },
  },
  Z0 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAUCAYAAAB1aeb6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGfSURBVHgB5VZBSsNQEJ35TRHRRZZCK+QGxkWhXdmeoL2BuYFGD2C6LdT0BtYTqCewriy4sEfowoLLgLjQNhnnlyA2/oRfggTp24Qw78+b+Zn3f7DauCQoCAIKRKHiRkYsICIXcgIRfX6YsI44Id7OHs+GkBP7jX6bADugK44A00UEXVVsr+5bBoan/MWO+dXkaZ0KpNE8Et3XsTtN8uck3DKSzTwrGRMJ1QkQdd+28FCVqFLzbQPpmZedQLyVXKhFhE4J6b5S69nJNTLPnLAl8y7z/5RbsRoTXsbnHqR0LAVQ0cH3ct6Fdy48GLmBKl6t9z0eggtQdp6BEkTNLGEJGd/5iBzQxBpWw6YOS6A4AE38k0OGaKJDi3jyQRPa4uVtMZQWzOLIeBjiA2hiddqlFSK6W4AYqq3Ws4Vh3JB68AJaYGv25P7aIbPpm7ufJO3ZYUvYavEY0jIhe1NVwNJyQJ5AOIqLCPh5zfxBKj/FomknnGUADZaVJhALOKCJMoQegbBUsfSLhTur1H0HcoKQ2mmxrFvNRKQr+ENs7s/EF+53mRwCvviZAAAAAElFTkSuQmCC",
  W0 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAcCAYAAAAEN20fAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAhNSURBVHgBpVcJcFXVGf7u8tYsJA/JDgnlxbIpsUxAoMxEqYAgJrYCUhBKR8Upw1Ro3agUJBYGpiSMAh1wWpXSlEBZaol2EikRSNOaQIMkJJA9hCy8vOx56136n3tfyCJixH/eeefe/5z//N/5t3Muh3sTT01F5HwrkpenYezM1QiNmwLjqHDiClB9bnjbGtBclofqT/6I/+wtp/mcJvMtibsnf/47cZi74TwsoQnoVFWoHBv5qoxKYyZih9LYtYpf49CkPcQVqMn4DkBEahK2tuTBHDEPvZxCs4Qho2JAjT/QFDIA17+UoiCS53H67e/j7LYaba37ACJquzigetGocOB5ESppMbLdqh5UXz2Bivwj6G68gbZ6GeOm2BD1g8cweeaLCI6YBCeB4AiESv0Y6nN2xyLv9SaMgMSvWGI/mfmWLIEXRCiSjEjRgzOZKcjbVDwwdboB6OJRc7yBXkqoZYLF0xs1JxGWkIoeeutQZNi+N42emoZtXF14uCjD60PpuReSP0AgnoZa5ADt+pZMRicQRlkB7/gLtkSv1sZiXp0D25IDMIZPJVn+zrqK24G+/72HynXpGuOH2xKx5I3zcLUX4u2YZ4bvfFlBwz99vugnRCs4x5clKz9/MTmb2Eo/EAHbG47AE70MvMiD98tQe7ch3fY7RE+3IOZIA/zNNsheFgvD3alqP4udQ/PxR9G4+RIG4oIbmKNT2rnbFziMnk1u50LscB2O5YIBPT05JKSEwDL2OQ2EQpYwO3IIxA7Y1sYhLrsPntowKD5OC0jWBJIVwkja2K+Pg7uK4mLxWQwNTv5Hfy19YdV1b/fCo5VLmfsrPshMM43hNL3uZliT1qUn9gMBVn54Ep0UYAx3pMBjc2wqMxcmvNUAVyULQKoZ5HNTvBd9pRtRn5GAqs1RcPxtLnmpAIYIWimIg9+Zg8HuttvFmDlTDvW1GIMjZ9mPJSSkiBWHd7bznLuVWcnfB8SlrtwxYLpMClCnZkEVjuIVODjjGJK+KIHUNpk0iAREBm84iiuPrcLQgsVpzTonCqGJsWj5sHi4K9bUq2p3HePIakdZ4eb89XN3z9515uWo2Yv3qbTF4Fi55892MZTHrC2PoDsgOJpMfHBGNkY/HkPLP6yBUMlVnJBLIJ4friTwrMBV0EQgigLvg8e520XlH7FSSGtxMSnTX2Hz28sKsg2huhEUWQjB0qXkhnHJafCpumU8HeVaH77iTfic+oLm8Ty+nLdo8OIYOalVn2btMlhVLb4EqyWSMck9TlOoPoG5Z5xhQqiIsPiZd6ri9Rv/0nqrfSEUr85037yAAXfo/ZSci+DNNmaMu5PBAHfjflSterfy80s1M1/nILmhJd2YySnBjmv5vbJfIQ5vUagy28bGjxIRFDFak2Vh21lXoT2L4VHwteh6XUWfYMDcBOLT87TkLAo1Hl9LdMSEJGYgev0pVO2v5wJlU/YAwfZpQQyIv8dNsIIsio+Ktn2GhdcCFAFV1iD9TGFlvZ8U0ThUCSHkBHwjyZTucvuowSzKPfT11uoq+r3AOp+Pynp3Swus0ToQS8TD2qDf2Uz/iZrpQ6ez6piOfteUpS6D/VAGWSQK3CDAKluS9mV9cAUFONUZK+C9eZNS1szMrwEx0XBNdxd7NoZYLVKPlg7obihxi3BWFyDqkac0JYlTF2gSfaUfIWjidmLxVCOSqCCQVaq0c1Ybr3pp011swJHbTtP5pGrVl7eo6LrYEbZyb7K3Q98Dc1FdXb4nYB0T60ULUFtwgQ4ux+VTMASWMlljgRQRtUcyYYrTY8B3S0bS0bIAiK/LGAGx78yEOOppDQS7n7DNEMU9k5oueTiWwKq/ves640Ut/FmCr1sXpDOH8GZ18Li48wZsAQVtsor1Ga8Cl9zwOI+TbkmrqpIjHtMKyzCQOQNWYDTh90sQuaQQUpdeR9i5U7FsLRuy2RMWcOwyxatozP/3TiYz6dlfrPZ2BkJTkpz9C3HYVHGEhJ+jIOQxhji/DERScq0P7nIuUNhkmOMFuOpz0Zl3ELy7C0b7bIQ9+Qqk1nCwQOCoXohhKjqLn0Tdhjwq8Ya1Fys9nRWqEj6R4/8Upa+7slLtcDUhjBnO1Vz9fu6KxJf0O+nHG3+OCEF3RQsp3N17TQNYNN4I8yQ6ZyRWXQV4G8kJwhN4YMkJ2JZ/hqCHtsPfSPdXP6dlHztz/M3rCMRZzZVVVVLJ/qzZitxUVrhr/1TmicTnX5sk9ShhTJWFKlH10R3pGGRmHr+qfAvmhN9SRFGSSRJMjjPYEvNjDejU3BwYIxbB1zz4ThggAsBR3JniXGj5QxIaM2swUOl4DCv7y79wXvH1hU1leWCJlduyEsXI/onQBPckbscDciO5gI5xUYQ34ins6SvRRkvnL8bln4bA07AXQuhN2rkEY4wCMaqX6sV5OI/NRfGDwQSiGi9fS8V7dJxl9FQGAA250Xt6uv7LmznFHKly9dkf/6Qfw+Dd8ZrguyrtTDJQWIiQ6YIUbRBw9coGvJ+0D/eix38Tj/lv5sNliodMeUp3blw9vAp/X5s1fOqju04/7evqqru8Yw0LAWk4EEb6J0CGpxqdhnFQWJCyUqXqJ3NncylqKv6B3vpi+Hq8MNvGIjZpEeInzoNLsMCDwI2fsi2OZLcuCEZrbh9GQHerC7plNrVuxbiIbbhNFyae113IQPEsFQMz9UvAALE0MBIzyNOKfYvHoy5fwn1+Tgwm3TqvVZ1CzIQ07c7iu9vHFZtJfyEMlOs2LpxIw5k1hXc2NELiRjhHxayNDyFh3rMYM3EuBGO09snJi110YpejueQkis99BsfxXtznJ+f/AULaVvPvXuk2AAAAAElFTkSuQmCC",
  X0 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAeCAYAAABJ/8wUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMtSURBVHgBvVdNVhNBEK6qmbjzvdzAQdmLJzBZAxpOIJ4A2KrAxDzXwgkCJwiPn3XCCYC9wngCxnUyXVY3Sd6EdM0kkOe34Ke7p+vr+umvGmEOLJ/FNQODBhK+YoMrgBCNJxkSRE6Y+QaRrrI+XSYbcTLr3li2IOrEVXphtsTQtvxb9SxJlXHL7og4OP61HvfgqURmICB2zKEZhDEEWYMIf0IBIdMPmkUeQoVEhKHpYt71k0jR8M7vD62jOb6xhHZu11oHMxFxeYCmA+rpIDVI9WQ1vgbfASqmI5uugAaE+Hb1e3N6OL/RRbxCbK5AR2r69K7IxTakQqY7LxnMbVAaDs0TXjKhuZonTDT6I6hk7ZIPm7OQsBCPpTygOktJ66tw3x5+gkh0urvJgDX1G+amlmQFZBKG7HPBEglh1p4ggoj76nI51e16K4YnIFn/0ZPvD7V5lMNHUhyOyPLZ11pRSAxQ0alKYQYUF4WI5KZ2vw0EDX0bPEpmuBWL4PJFQquvoI/up+jDW22JYTyGRSALTuBBCqYh0bBJS5Kk/noXdz7XGyNYr8h++qFCiGyy+m9QxB4sEAayE20u4CwibRKNuYRFYlBR76AswHvSMjrDIIEFwoVHyxNDfwmkmYH/B38aDNJrQsYb35yNGywQVn+8E7YoNg5SUpOI6D08x8AjBMGg5p0YFgXZa5iBezBFlBtRZ7vcSFgg93kQbvmGTR/dZeeqho23xqtUealr0AgSwryK+qCLqtzcw97GEUmk5fN5RRZuvznf+wQloDDb1OZcn+MX1XTkjTERC+4HVtymyosBDqKLL6r7A+BU4rzv80pxs8UTzfSYiB20HZjHVpU47Ean37ziKFrlyJMYzJMpJOHpb6aa50jaAsLA3zx7ek0nWBVz92AAEpH9eijakYFpqyQ8/c38zwlrjGgj3za+Pt+7zxHXHlxTT5BSImMDZ7sxKN0bSnJnklc2pEvnu10saDVtIfBwrbZGFT0L60J5PizZ8n6sSQ/lmLr8QAafQFrpPzSc1e/WWvWyd3Dp2zcPlz/S0fGwmbIGRuMIQVsurWtx/x93W4vaDoVuJvwDVguazUEoRg8AAAAASUVORK5CYII=",
  ep =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAASCAYAAACnxdXaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADSSURBVHgBzZXBDYJAEEX/oAV4FxPKEC9iB3QgloB6twNswRKwA07C0RIwwXilAMM4hCicCBHX5SU7O9lk8rN/Mrtk2gHjzxjQgBbRcSPPxecciiBggmrVokQUZhd/A0VM58GJCOsy127vB3MRHAhstRU+mc+PeB/iV6JgdhjktNRhxLjJ9pXocOzN4t0KChnOTWf20S24mqk+yGymWeJHnUQLZlcqlugNXyVEnUTvydaDQrT0lN5fm4TUII6giILJkR5bZV6/vXLATB4UQY1ci70vTOM1lRhj6/AAAAAASUVORK5CYII=",
  Ul =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAVCAYAAABYHP4bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADQSURBVHgB7ZW9DcIwEIXfsxiAEgkKj5AydNmAFcgKmYAJwgiwAhu4QpQZIVLWiHLYsQKkP6dA+YrTyYU/6XQ/3OVXu+FwA1ggCeJ6MaVJKwmwCI7NJCHQguKgibAQwI6yr5iue1YlFNnn9Z0MIsBgIXg41hISH1pCWqjCzIdtyD6lY6ylRSIWK93/iX7aGw0GeUATw5PvsmwmIth0r+oCRfwcWT9Ho2hthlW0vGi2VI3yPRr8PYo7dJyj8Hl8EOEZinBKRJwJ9zzKEuElPUz5BsogPH0tThlpAAAAAElFTkSuQmCC",
  tp = {
    key: 0,
    class: "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
  },
  sp = {
    class: "modal-card bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh]",
  },
  op = { class: "p-4 space-y-6 max-h-[70vh] overflow-y-scroll" },
  np = { class: "relative" },
  lp = { class: "grid grid-cols-3 gap-3" },
  rp = ["onClick"],
  ap = { class: "w-8 h-8 mb-2 flex items-center justify-center" },
  ip = ["src", "alt"],
  dp = { class: "text-xs font-medium text-gray-700" },
  up = { class: "space-y-3" },
  cp = { key: 0 },
  fp = { class: "flex gap-2" },
  pp = { class: "flex items-center gap-2" },
  mp = { class: "px-2 py-1 bg-gray-100 rounded text-sm font-medium" },
  gp = { class: "grid grid-cols-2 gap-2" },
  vp = ["onClick"],
  hp = {
    __name: "ModalPaymentSelection",
    props: { isOpen: { type: Boolean, default: !1 } },
    emits: ["close", "paymentSelected", "printingSelected"],
    setup(e, { emit: t }) {
      const o = {
          template:
            '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M22 10V6c0-1.11-.89-2-2-2H4c-1.11 0-2 .89-2 2v4c1.11 0 2 .89 2 2s-.89 2-2 2v4c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2v-4c-1.11 0-2-.89-2-2s.89-2 2-2z"/></svg>',
        },
        n = {
          template:
            '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM19 13h2v2h-2zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM15 19h2v2h-2zM17 17h2v2h-2zM17 19h2v2h-2zM19 17h2v2h-2z"/></svg>',
        },
        l = {
          template:
            '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>',
        },
        r = {
          template:
            '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>',
        },
        a = t,
        u = $(""),
        i = $(null),
        f = $(""),
        c = $(0),
        d = $([
          { id: "cash", name: "Cash", logo: Z0, iconColor: "text-green-600" },
          { id: "gcash", name: "Gcash", logo: W0, iconColor: "text-blue-600" },
          {
            id: "paymongo",
            name: "Paymongo",
            logo: X0,
            iconColor: "text-purple-600",
          },
          { id: "check", name: "Check", logo: ep, iconColor: "text-gray-600" },
          {
            id: "prepaid",
            name: "Prepaid",
            logo: Ul,
            iconColor: "text-blue-600",
          },
          { id: "credit", name: "Credit", logo: Ul, iconColor: "text-red-600" },
        ]),
        p = $([
          {
            id: "eticket",
            name: "E-ticket",
            icon: o,
            bgColor: "bg-orange-500",
          },
          { id: "qrcode", name: "QR Code", icon: n, bgColor: "bg-blue-500" },
          {
            id: "both",
            name: "E-ticket & QR Code",
            icon: l,
            bgColor: "bg-green-500",
          },
          {
            id: "bill",
            name: "Bill of Lading",
            icon: r,
            bgColor: "bg-teal-500",
          },
        ]),
        b = pe(() =>
          u.value
            ? d.value.filter((_) =>
                _.name.toLowerCase().includes(u.value.toLowerCase()),
              )
            : d.value,
        ),
        x = pe(() => Math.max(0, c.value - 5148)),
        A = () => {
          a("close");
        },
        v = (_) => {
          ((i.value = _), a("paymentSelected", _));
        },
        S = (_) => {
          a("printingSelected", _);
        };
      return (_, C) => (
        m(),
        ke(
          Ie,
          { name: "modal-fade" },
          {
            default: $e(() => [
              e.isOpen
                ? (m(),
                  g("div", tp, [
                    s("div", sp, [
                      s(
                        "div",
                        {
                          class:
                            "flex items-center justify-between p-4 border-b",
                        },
                        [
                          C[4] ||
                            (C[4] = s(
                              "h2",
                              { class: "text-lg font-semibold text-gray-900" },
                              " Select Payment Method ",
                              -1,
                            )),
                          s(
                            "button",
                            {
                              onClick: A,
                              class: "text-gray-400 hover:text-gray-600",
                            },
                            [
                              ...(C[3] ||
                                (C[3] = [
                                  s(
                                    "svg",
                                    {
                                      class: "w-6 h-6",
                                      fill: "none",
                                      stroke: "currentColor",
                                      viewBox: "0 0 24 24",
                                    },
                                    [
                                      s("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        "stroke-width": "2",
                                        d: "M6 18L18 6M6 6l12 12",
                                      }),
                                    ],
                                    -1,
                                  ),
                                ])),
                            ],
                          ),
                        ],
                      ),
                      s("div", op, [
                        s("div", np, [
                          C[5] ||
                            (C[5] = s(
                              "svg",
                              {
                                class:
                                  "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                              },
                              [
                                s("path", {
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round",
                                  "stroke-width": "2",
                                  d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
                                }),
                              ],
                              -1,
                            )),
                          oe(
                            s(
                              "input",
                              {
                                "onUpdate:modelValue":
                                  C[0] || (C[0] = (k) => (u.value = k)),
                                type: "text",
                                placeholder: "Search payment method...",
                                class:
                                  "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                              },
                              null,
                              512,
                            ),
                            [[be, u.value]],
                          ),
                        ]),
                        s("div", null, [
                          C[6] ||
                            (C[6] = s(
                              "h3",
                              {
                                class: "text-sm font-medium text-gray-700 mb-3",
                              },
                              " Payment Methods ",
                              -1,
                            )),
                          s("div", lp, [
                            (m(!0),
                            g(
                              q,
                              null,
                              le(
                                b.value,
                                (k) => (
                                  m(),
                                  g(
                                    "button",
                                    {
                                      key: k.id,
                                      type: "button",
                                      onClick: (T) => v(k),
                                      class: Z([
                                        "flex flex-col items-center p-3 border rounded-lg transition-colors",
                                        i.value?.id === k.id
                                          ? "border-blue-500 bg-blue-50"
                                          : "border-gray-200 hover:border-gray-300",
                                      ]),
                                    },
                                    [
                                      s("div", ap, [
                                        k.logo
                                          ? (m(),
                                            g(
                                              "img",
                                              {
                                                key: 0,
                                                src: k.logo,
                                                alt: k.name + " logo",
                                                class: "w-6 h-6 object-contain",
                                              },
                                              null,
                                              8,
                                              ip,
                                            ))
                                          : (m(),
                                            ke(
                                              go(k.icon),
                                              {
                                                key: 1,
                                                class: Z([
                                                  "w-6 h-6",
                                                  k.iconColor,
                                                ]),
                                              },
                                              null,
                                              8,
                                              ["class"],
                                            )),
                                      ]),
                                      s("span", dp, w(k.name), 1),
                                    ],
                                    10,
                                    rp,
                                  )
                                ),
                              ),
                              128,
                            )),
                          ]),
                        ]),
                        C[12] ||
                          (C[12] = s(
                            "div",
                            null,
                            [
                              s(
                                "h3",
                                {
                                  class:
                                    "text-sm font-medium text-gray-700 mb-3",
                                },
                                " Payment Breakdown ",
                              ),
                              s("div", { class: "space-y-2 text-sm" }, [
                                s("div", { class: "flex justify-between" }, [
                                  s("span", { class: "text-gray-600" }, "Fare"),
                                  s(
                                    "span",
                                    { class: "font-medium" },
                                    "3,786.00",
                                  ),
                                ]),
                                s("div", { class: "flex justify-between" }, [
                                  s(
                                    "span",
                                    { class: "text-gray-600" },
                                    "Cargo Rate",
                                  ),
                                  s(
                                    "span",
                                    { class: "font-medium" },
                                    "1,350.00",
                                  ),
                                ]),
                                s("div", { class: "flex justify-between" }, [
                                  s(
                                    "span",
                                    { class: "text-gray-600" },
                                    "Admin Fee",
                                  ),
                                  s("span", { class: "font-medium" }, "2.00"),
                                ]),
                                s("div", { class: "flex justify-between" }, [
                                  s(
                                    "span",
                                    { class: "text-gray-600" },
                                    "Discount",
                                  ),
                                  s(
                                    "span",
                                    { class: "text-blue-600" },
                                    "Student Discount (5%)",
                                  ),
                                  s("span", { class: "text-red-600" }, "-20%"),
                                ]),
                                s(
                                  "div",
                                  {
                                    class:
                                      "flex justify-between pt-2 border-t font-semibold",
                                  },
                                  [
                                    s(
                                      "span",
                                      { class: "text-gray-900" },
                                      "Amount To Be Paid",
                                    ),
                                    s(
                                      "span",
                                      { class: "text-gray-900" },
                                      "PHP 5,148.00",
                                    ),
                                  ],
                                ),
                              ]),
                            ],
                            -1,
                          )),
                        s("div", null, [
                          C[10] ||
                            (C[10] = s(
                              "h3",
                              {
                                class: "text-sm font-medium text-gray-700 mb-3",
                              },
                              "Payment",
                              -1,
                            )),
                          s("div", up, [
                            i.value && i.value.id !== "cash"
                              ? (m(),
                                g("div", cp, [
                                  C[7] ||
                                    (C[7] = s(
                                      "label",
                                      {
                                        class:
                                          "block text-xs text-gray-600 mb-1",
                                      },
                                      "Reference Number",
                                      -1,
                                    )),
                                  oe(
                                    s(
                                      "input",
                                      {
                                        "onUpdate:modelValue":
                                          C[1] || (C[1] = (k) => (f.value = k)),
                                        type: "text",
                                        placeholder: "00.00",
                                        class:
                                          "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm",
                                      },
                                      null,
                                      512,
                                    ),
                                    [[be, f.value]],
                                  ),
                                ]))
                              : K("", !0),
                            s("div", null, [
                              C[9] ||
                                (C[9] = s(
                                  "label",
                                  { class: "block text-xs text-gray-600 mb-1" },
                                  "Cash Rendered",
                                  -1,
                                )),
                              s("div", fp, [
                                oe(
                                  s(
                                    "input",
                                    {
                                      "onUpdate:modelValue":
                                        C[2] || (C[2] = (k) => (c.value = k)),
                                      type: "number",
                                      placeholder: "00.00",
                                      class:
                                        "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm",
                                    },
                                    null,
                                    512,
                                  ),
                                  [[be, c.value]],
                                ),
                                s("div", pp, [
                                  C[8] ||
                                    (C[8] = s(
                                      "span",
                                      { class: "text-xs text-gray-600" },
                                      "Change",
                                      -1,
                                    )),
                                  s("span", mp, w(x.value.toFixed(2)), 1),
                                ]),
                              ]),
                            ]),
                          ]),
                        ]),
                        s("div", null, [
                          C[11] ||
                            (C[11] = s(
                              "h3",
                              {
                                class: "text-sm font-medium text-gray-700 mb-3",
                              },
                              " Printing Options ",
                              -1,
                            )),
                          s("div", gp, [
                            (m(!0),
                            g(
                              q,
                              null,
                              le(
                                p.value,
                                (k) => (
                                  m(),
                                  g(
                                    "button",
                                    {
                                      key: k.id,
                                      onClick: (T) => S(k),
                                      class: Z([
                                        "flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium transition-colors",
                                        k.bgColor,
                                        "hover:opacity-90",
                                      ]),
                                    },
                                    [
                                      (m(),
                                      ke(go(k.icon), { class: "w-4 h-4" })),
                                      ye(" " + w(k.name), 1),
                                    ],
                                    10,
                                    vp,
                                  )
                                ),
                              ),
                              128,
                            )),
                          ]),
                        ]),
                      ]),
                    ]),
                  ]))
                : K("", !0),
            ]),
            _: 1,
          },
        )
      );
    },
  },
  bp = {
    key: 0,
    class:
      "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
  },
  yp = {
    class:
      "modal-card bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden",
  },
  xp = { class: "flex items-center justify-between p-6 border-b" },
  _p = { class: "p-6 space-y-6 overflow-y-scroll max-h-[80vh]" },
  wp = { class: "relative mb-4" },
  kp = { key: 0 },
  Ap = { class: "font-semibold text-gray-700 mb-3" },
  Cp = { class: "grid grid-cols-3 gap-3 mb-6" },
  $p = ["onClick"],
  Sp = { class: "absolute top-2 right-2 w-4.5 h-4.5" },
  Mp = {
    key: 0,
    xmlns: "http://www.w3.org/2000/svg",
    class: "w-3 h-3",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "stroke-width": "3",
  },
  Rp = { key: 1 },
  Ep = { class: "font-semibold text-gray-700 mb-3" },
  Tp = { class: "grid grid-cols-3 gap-3" },
  Bp = ["onClick"],
  Pp = { class: "absolute top-2 right-2" },
  Ip = {
    key: 0,
    xmlns: "http://www.w3.org/2000/svg",
    class: "w-3 h-3",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "white",
    "stroke-width": "3",
  },
  jp = {
    key: 1,
    xmlns: "http://www.w3.org/2000/svg",
    class: "w-3 h-3",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "stroke-width": "3",
  },
  Lp = { key: 0, class: "space-y-2" },
  Op = { class: "grid grid-cols-4 gap-2" },
  Vp = ["onClick"],
  Np = {
    key: 0,
    xmlns: "http://www.w3.org/2000/svg",
    class: "w-3 h-3",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "stroke-width": "3",
  },
  Up = { key: 0, class: "mt-4" },
  Dp = ["disabled"],
  Fp = {
    __name: "VehicleSelection",
    props: { isOpen: { type: Boolean, default: !1 } },
    emits: ["close", "select", "save"],
    setup(e, { emit: t }) {
      const o = t,
        n = [
          {
            label: "Two-Wheeled Vehicles",
            types: [
              {
                id: "motorcycle",
                label: "Motorcycle",
                brands: [
                  "Yamaha",
                  "Honda",
                  "Suzuki",
                  "Kawasaki",
                  "Motorstar",
                  "Rusi",
                  "KTM",
                  "Others",
                ],
              },
              {
                id: "mc400",
                label: "MC > 400 CC",
                brands: ["BMW", "Ducati", "Harley-Davidson", "KTM", "Others"],
              },
              {
                id: "bicycle",
                label: "Bicycle",
                brands: ["Giant", "Trek", "Specialized", "Others"],
              },
            ],
          },
          {
            label: "Light Vehicles",
            types: [
              {
                id: "tricycle",
                label: "Tricycle",
                brands: ["Honda", "Yamaha", "Suzuki", "Others"],
              },
              {
                id: "lightcar",
                label: "Light Car",
                brands: [
                  "Toyota",
                  "Honda",
                  "Hyundai",
                  "Ford",
                  "Mazda",
                  "Nissan",
                  "Chevrolet",
                  "Others",
                ],
              },
            ],
          },
          {
            label: "Medium Sized Vehicles",
            types: [
              {
                id: "van",
                label: "Van",
                brands: ["Toyota", "Nissan", "Hyundai", "Ford", "Others"],
              },
              {
                id: "pickup",
                label: "Pickup",
                brands: ["Toyota", "Ford", "Isuzu", "Nissan", "Others"],
              },
            ],
          },
        ],
        l = $(""),
        r = $(""),
        a = $(""),
        u = $(""),
        i = pe(() => {
          for (const b of n) {
            const x = b.types.find((A) => A.id === l.value);
            if (x) return x.brands;
          }
          return [];
        }),
        f = pe(() =>
          i.value.length
            ? i.value.filter((b) =>
                b.toLowerCase().includes(a.value.toLowerCase()),
              )
            : [],
        ),
        c = (b) => {
          l.value === b
            ? ((l.value = ""), (r.value = ""), (u.value = ""))
            : ((l.value = b), (r.value = ""), (u.value = ""));
        },
        d = (b) => {
          r.value === b ? (r.value = "") : (r.value = b);
        },
        p = () => {
          const b = {
            type: l.value,
            brand: r.value,
            plate: l.value === "bicycle" ? null : u.value,
          };
          (console.log("Selected Vehicle:", b),
            o("save", b),
            o("close"),
            (l.value = ""),
            (r.value = ""),
            (u.value = ""),
            (a.value = ""));
        };
      return (b, x) => (
        m(),
        ke(
          Ie,
          { name: "modal-fade" },
          {
            default: $e(() => [
              e.isOpen
                ? (m(),
                  g("div", bp, [
                    s("div", yp, [
                      s("div", xp, [
                        x[4] ||
                          (x[4] = s(
                            "h2",
                            { class: "text-lg font-semibold text-gray-900" },
                            " Select Vehicle Details ",
                            -1,
                          )),
                        s(
                          "button",
                          {
                            class:
                              "h-8 w-8 p-0 hover:bg-gray-100 rounded-md flex items-center justify-center transition-colors",
                            onClick: x[0] || (x[0] = (A) => o("close")),
                          },
                          [Y(ie(Xd), { class: "w-5 h-5" })],
                        ),
                      ]),
                      s("div", _p, [
                        s("div", wp, [
                          Y(ie(Bt), {
                            class:
                              "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5",
                          }),
                          oe(
                            s(
                              "input",
                              {
                                "onUpdate:modelValue":
                                  x[1] || (x[1] = (A) => (a.value = A)),
                                type: "text",
                                placeholder: "Search vehicle requirements..",
                                class:
                                  "w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent",
                              },
                              null,
                              512,
                            ),
                            [[be, a.value]],
                          ),
                        ]),
                        s("div", null, [
                          l.value
                            ? (m(),
                              g("div", kp, [
                                (m(),
                                g(
                                  q,
                                  null,
                                  le(n, (A) =>
                                    s("div", { key: A.label }, [
                                      A.types.some((v) => v.id === l.value)
                                        ? (m(),
                                          g(
                                            q,
                                            { key: 0 },
                                            [
                                              s("div", Ap, w(A.label), 1),
                                              s("div", Cp, [
                                                (m(!0),
                                                g(
                                                  q,
                                                  null,
                                                  le(
                                                    A.types,
                                                    (v) => (
                                                      m(),
                                                      g(
                                                        "button",
                                                        {
                                                          key: v.id,
                                                          onClick: (S) =>
                                                            c(v.id),
                                                          class: Z([
                                                            "relative border rounded-lg px-4 py-6 flex flex-col items-center justify-center font-medium transition",
                                                            l.value === v.id
                                                              ? "btn-active"
                                                              : "bg-white border-gray-200 text-gray-700 hover:border-brand-color",
                                                          ]),
                                                        },
                                                        [
                                                          s(
                                                            "span",
                                                            null,
                                                            w(v.label),
                                                            1,
                                                          ),
                                                          s("span", Sp, [
                                                            s(
                                                              "span",
                                                              {
                                                                class: Z([
                                                                  "w-full h-full border rounded-full flex items-center justify-center",
                                                                  l.value ===
                                                                  v.id
                                                                    ? "border-brand-color bg-brand-color"
                                                                    : "border-gray-300 bg-white",
                                                                ]),
                                                              },
                                                              [
                                                                l.value === v.id
                                                                  ? (m(),
                                                                    g(
                                                                      "svg",
                                                                      Mp,
                                                                      [
                                                                        ...(x[5] ||
                                                                          (x[5] =
                                                                            [
                                                                              s(
                                                                                "path",
                                                                                {
                                                                                  "stroke-linecap":
                                                                                    "round",
                                                                                  "stroke-linejoin":
                                                                                    "round",
                                                                                  d: "M5 13l4 4L19 7",
                                                                                },
                                                                                null,
                                                                                -1,
                                                                              ),
                                                                            ])),
                                                                      ],
                                                                    ))
                                                                  : K("", !0),
                                                              ],
                                                              2,
                                                            ),
                                                          ]),
                                                        ],
                                                        10,
                                                        $p,
                                                      )
                                                    ),
                                                  ),
                                                  128,
                                                )),
                                              ]),
                                            ],
                                            64,
                                          ))
                                        : K("", !0),
                                    ]),
                                  ),
                                  64,
                                )),
                              ]))
                            : (m(),
                              g("div", Rp, [
                                (m(),
                                g(
                                  q,
                                  null,
                                  le(n, (A) =>
                                    s("div", { key: A.label, class: "mb-6" }, [
                                      s("div", Ep, w(A.label), 1),
                                      s("div", Tp, [
                                        (m(!0),
                                        g(
                                          q,
                                          null,
                                          le(
                                            A.types,
                                            (v) => (
                                              m(),
                                              g(
                                                "button",
                                                {
                                                  key: v.id,
                                                  onClick: (S) => c(v.id),
                                                  class: Z([
                                                    "relative border rounded-lg px-4 py-6 flex flex-col items-center justify-center font-medium transition",
                                                    l.value === v.id
                                                      ? "btn-active"
                                                      : "bg-white border-gray-200 text-gray-700 hover:border-brand-color",
                                                  ]),
                                                },
                                                [
                                                  s(
                                                    "span",
                                                    null,
                                                    w(v.label),
                                                    1,
                                                  ),
                                                  s("span", Pp, [
                                                    s(
                                                      "span",
                                                      {
                                                        class: Z([
                                                          "inline-block w-4 h-4 border rounded-full",
                                                          l.value === v.id
                                                            ? "border-brand-color bg-brand-color"
                                                            : "border-gray-300 bg-white",
                                                        ]),
                                                      },
                                                      [
                                                        l.value === v.id
                                                          ? (m(),
                                                            g("svg", Ip, [
                                                              ...(x[6] ||
                                                                (x[6] = [
                                                                  s(
                                                                    "path",
                                                                    {
                                                                      "stroke-linecap":
                                                                        "round",
                                                                      "stroke-linejoin":
                                                                        "round",
                                                                      d: "M5 13l4 4L19 7",
                                                                    },
                                                                    null,
                                                                    -1,
                                                                  ),
                                                                ])),
                                                            ]))
                                                          : K("", !0),
                                                        l.value === v.id
                                                          ? (m(),
                                                            g("svg", jp, [
                                                              ...(x[7] ||
                                                                (x[7] = [
                                                                  s(
                                                                    "path",
                                                                    {
                                                                      "stroke-linecap":
                                                                        "round",
                                                                      "stroke-linejoin":
                                                                        "round",
                                                                      d: "M5 13l4 4L19 7",
                                                                    },
                                                                    null,
                                                                    -1,
                                                                  ),
                                                                ])),
                                                            ]))
                                                          : K("", !0),
                                                      ],
                                                      2,
                                                    ),
                                                  ]),
                                                ],
                                                10,
                                                Bp,
                                              )
                                            ),
                                          ),
                                          128,
                                        )),
                                      ]),
                                    ]),
                                  ),
                                  64,
                                )),
                              ])),
                        ]),
                        i.value.length
                          ? (m(),
                            g("div", Lp, [
                              x[10] ||
                                (x[10] = s(
                                  "div",
                                  { class: "font-semibold text-gray-700 mb-3" },
                                  "Brand of Vehicle",
                                  -1,
                                )),
                              s("div", Op, [
                                (m(!0),
                                g(
                                  q,
                                  null,
                                  le(
                                    f.value,
                                    (A) => (
                                      m(),
                                      g(
                                        "button",
                                        {
                                          key: A,
                                          onClick: (v) => d(A),
                                          class: Z([
                                            "px-4 py-6 rounded-lg font-medium transition flex items-center justify-center relative",
                                            r.value === A
                                              ? "btn-active"
                                              : " text-gray-700 border border-gray-200 hover:border-brand-color",
                                          ]),
                                        },
                                        [
                                          s("span", null, w(A), 1),
                                          s(
                                            "span",
                                            {
                                              class: Z([
                                                "flex items-center justify-center w-4 h-4 border rounded-full ml-2 transition-colors absolute top-2 right-2",
                                                r.value === A
                                                  ? "border-brand-color bg-brand-color"
                                                  : "border-gray-300 bg-white",
                                              ]),
                                            },
                                            [
                                              r.value === A
                                                ? (m(),
                                                  g("svg", Np, [
                                                    ...(x[8] ||
                                                      (x[8] = [
                                                        s(
                                                          "path",
                                                          {
                                                            "stroke-linecap":
                                                              "round",
                                                            "stroke-linejoin":
                                                              "round",
                                                            d: "M5 13l4 4L19 7",
                                                          },
                                                          null,
                                                          -1,
                                                        ),
                                                      ])),
                                                  ]))
                                                : K("", !0),
                                            ],
                                            2,
                                          ),
                                        ],
                                        10,
                                        Vp,
                                      )
                                    ),
                                  ),
                                  128,
                                )),
                              ]),
                              l.value !== "bicycle"
                                ? (m(),
                                  g("div", Up, [
                                    x[9] ||
                                      (x[9] = s(
                                        "label",
                                        {
                                          class:
                                            "block text-sm font-medium text-gray-700 mb-3",
                                        },
                                        "Plate Number",
                                        -1,
                                      )),
                                    oe(
                                      s(
                                        "input",
                                        {
                                          "onUpdate:modelValue":
                                            x[2] ||
                                            (x[2] = (A) => (u.value = A)),
                                          type: "text",
                                          placeholder: "Enter plate number",
                                          class:
                                            "w-full px-4 py-4 border border-gray-300 rounded-lg",
                                        },
                                        null,
                                        512,
                                      ),
                                      [[be, u.value]],
                                    ),
                                  ]))
                                : K("", !0),
                              s(
                                "button",
                                {
                                  class:
                                    "mt-4 px-6 py-3 rounded-lg bg__brand__color text-white font-semibold w-full transition hover:bg-brand-color-blue cursor-pointer",
                                  disabled:
                                    !r.value ||
                                    (l.value !== "bicycle" && !u.value),
                                  onClick: p,
                                },
                                " Confirm & Save ",
                                8,
                                Dp,
                              ),
                              s(
                                "button",
                                {
                                  class:
                                    "mt-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium w-full",
                                  onClick: x[3] || (x[3] = (A) => c(l.value)),
                                },
                                " Back to Vehicle Type ",
                              ),
                            ]))
                          : K("", !0),
                      ]),
                    ]),
                  ]))
                : K("", !0),
            ]),
            _: 1,
          },
        )
      );
    },
  },
  Hp = {
    key: 0,
    class:
      "fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4",
  },
  zp = {
    class:
      "modal-card bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden",
  },
  Qp = { class: "flex items-center justify-between p-6 border-b" },
  Kp = { class: "p-6 space-y-4" },
  Yp = { class: "grid grid-cols-2 gap-4" },
  Jp = { class: "text-gray-900" },
  qp = { class: "text-gray-900" },
  Gp = { class: "text-gray-900" },
  Zp = { class: "text-gray-900" },
  Wp = { class: "text-gray-900" },
  Xp = { class: "text-gray-900" },
  em = { class: "text-gray-900" },
  tm = { class: "text-gray-900" },
  sm = { class: "text-gray-900" },
  om = { class: "text-gray-900" },
  nm = { class: "text-gray-900" },
  lm = { class: "text-gray-900" },
  rm = { class: "text-gray-900" },
  am = { key: 0, class: "mt-4" },
  im = { class: "bg-gray-100 rounded p-2 text-xs text-gray-700" },
  dm = { class: "flex justify-end mt-6 gap-2" },
  um = {
    __name: "ViewTellerPassenger",
    props: { isOpen: Boolean, passenger: { type: Object, required: !0 } },
    emits: ["close"],
    setup(e, { emit: t }) {
      const o = t;
      return (n, l) => (
        m(),
        ke(
          Ie,
          { name: "modal-fade" },
          {
            default: $e(() => [
              e.isOpen
                ? (m(),
                  g("div", Hp, [
                    s("div", zp, [
                      s("div", Qp, [
                        l[4] ||
                          (l[4] = s(
                            "h2",
                            { class: "text-lg font-semibold text-gray-900" },
                            "Passenger Details",
                            -1,
                          )),
                        s(
                          "button",
                          {
                            class:
                              "h-8 w-8 p-0 hover:bg-gray-100 rounded-md flex items-center justify-center transition-colors",
                            onClick: l[0] || (l[0] = (r) => o("close")),
                          },
                          [
                            ...(l[3] ||
                              (l[3] = [
                                s(
                                  "svg",
                                  {
                                    class: "w-5 h-5",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                  },
                                  [
                                    s("path", {
                                      "stroke-linecap": "round",
                                      "stroke-linejoin": "round",
                                      "stroke-width": "2",
                                      d: "M6 18L18 6M6 6l12 12",
                                    }),
                                  ],
                                  -1,
                                ),
                              ])),
                          ],
                        ),
                      ]),
                      s("div", Kp, [
                        s("div", Yp, [
                          l[5] ||
                            (l[5] = s(
                              "div",
                              { class: "font-medium text-gray-600" },
                              "Fullname:",
                              -1,
                            )),
                          s("div", Jp, w(e.passenger.fullname), 1),
                          l[6] ||
                            (l[6] = s(
                              "div",
                              { class: "font-medium text-gray-600" },
                              "Seat:",
                              -1,
                            )),
                          s("div", qp, w(e.passenger.seat), 1),
                          l[7] ||
                            (l[7] = s(
                              "div",
                              { class: "font-medium text-gray-600" },
                              "Type:",
                              -1,
                            )),
                          s("div", Gp, w(e.passenger.type), 1),
                          l[8] ||
                            (l[8] = s(
                              "div",
                              { class: "font-medium text-gray-600" },
                              "Category:",
                              -1,
                            )),
                          s("div", Zp, w(e.passenger.category), 1),
                          l[9] ||
                            (l[9] = s(
                              "div",
                              { class: "font-medium text-gray-600" },
                              "Accommodation:",
                              -1,
                            )),
                          s("div", Wp, w(e.passenger.accommodation), 1),
                          l[10] ||
                            (l[10] = s(
                              "div",
                              { class: "font-medium text-gray-600" },
                              "Gender:",
                              -1,
                            )),
                          s("div", Xp, w(e.passenger.gender), 1),
                          l[11] ||
                            (l[11] = s(
                              "div",
                              { class: "font-medium text-gray-600" },
                              "Fare:",
                              -1,
                            )),
                          s("div", em, "₱" + w(e.passenger.fare), 1),
                          l[12] ||
                            (l[12] = s(
                              "div",
                              { class: "font-medium text-gray-600" },
                              "Discount:",
                              -1,
                            )),
                          s("div", tm, w(e.passenger.discount), 1),
                          l[13] ||
                            (l[13] = s(
                              "div",
                              { class: "font-medium text-gray-600" },
                              "Admin Fee:",
                              -1,
                            )),
                          s("div", sm, "₱" + w(e.passenger.adminFee), 1),
                          l[14] ||
                            (l[14] = s(
                              "div",
                              { class: "font-medium text-gray-600" },
                              "Cargo Fare:",
                              -1,
                            )),
                          s("div", om, "₱" + w(e.passenger.cargoFare), 1),
                          l[15] ||
                            (l[15] = s(
                              "div",
                              { class: "font-medium text-gray-600" },
                              "Route:",
                              -1,
                            )),
                          s("div", nm, w(e.passenger.route), 1),
                          l[16] ||
                            (l[16] = s(
                              "div",
                              { class: "font-medium text-gray-600" },
                              "Schedule:",
                              -1,
                            )),
                          s("div", lm, w(e.passenger.schedule), 1),
                          l[17] ||
                            (l[17] = s(
                              "div",
                              { class: "font-medium text-gray-600" },
                              "Date:",
                              -1,
                            )),
                          s("div", rm, w(e.passenger.date), 1),
                        ]),
                        e.passenger.vehicle
                          ? (m(),
                            g("div", am, [
                              l[18] ||
                                (l[18] = s(
                                  "div",
                                  { class: "font-medium text-gray-600 mb-1" },
                                  "Vehicle Details:",
                                  -1,
                                )),
                              s("pre", im, w(e.passenger.vehicle), 1),
                            ]))
                          : K("", !0),
                      ]),
                    ]),
                    s("div", dm, [
                      s(
                        "button",
                        {
                          class:
                            "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium",
                          onClick:
                            l[1] || (l[1] = (r) => o("edit", e.passenger)),
                        },
                        " Edit ",
                      ),
                      s(
                        "button",
                        {
                          class:
                            "px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium",
                          onClick: l[2] || (l[2] = (r) => o("close")),
                        },
                        " Close ",
                      ),
                    ]),
                  ]))
                : K("", !0),
            ]),
            _: 1,
          },
        )
      );
    },
  },
  cm = { class: "bg-blue-800 text-white flex items-center px-6 py-2" },
  fm = { class: "flex items-center gap-2 flex-1" },
  pm = ["onClick"],
  mm = { class: "relative ml-6" },
  gm = {
    key: 0,
    class: "absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-10",
  },
  vm = {
    __name: "TellerHeader",
    setup(e) {
      const t = ["WLK-0317089-1", "WLK-0317089-1"],
        o = $(t[0]),
        n = $(!1),
        l = $("User"),
        r = Oo();
      De(() => {
        const u = JSON.parse(localStorage.getItem("user"));
        u && (l.value = u.name ? u.name : u.email);
      });
      const a = async () => {
        const u = localStorage.getItem("token");
        try {
          await fetch("http://127.0.0.1:8000/api/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: u },
          });
        } catch (i) {
          console.error("Logout API error:", i);
        }
        (localStorage.removeItem("token"),
          localStorage.removeItem("user"),
          r.push({ path: "/", query: { loggedOut: "1" } }));
      };
      return (u, i) => (
        m(),
        g("header", cm, [
          s("nav", fm, [
            (m(),
            g(
              q,
              null,
              le(t, (f) =>
                s(
                  "button",
                  {
                    key: f,
                    class: Z([
                      "px-3 py-1 rounded bg-white text-blue-800 font-medium text-xs mr-2",
                      {
                        "bg-white text-blue-800": o.value === f,
                        "bg-blue-800 text-white": o.value !== f,
                      },
                    ]),
                    onClick: (c) => (o.value = f),
                  },
                  w(f),
                  11,
                  pm,
                ),
              ),
              64,
            )),
            i[1] ||
              (i[1] = s(
                "button",
                { class: "ml-4 text-xs text-white hover:underline" },
                " + New Transaction ",
                -1,
              )),
          ]),
          s("div", mm, [
            s(
              "button",
              {
                class:
                  "flex items-center gap-2 text-sm font-medium focus:outline-none cursor-pointer transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]",
                onClick: i[0] || (i[0] = (f) => (n.value = !n.value)),
              },
              [
                ye(w(l.value) + " ", 1),
                i[2] ||
                  (i[2] = s(
                    "svg",
                    {
                      class: "w-4 h-4",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                    },
                    [
                      s("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M19 9l-7 7-7-7",
                      }),
                    ],
                    -1,
                  )),
              ],
            ),
            Y(
              Ie,
              { name: "teller-dropdown" },
              {
                default: $e(() => [
                  n.value
                    ? (m(),
                      g("div", gm, [
                        s(
                          "button",
                          {
                            class:
                              "w-full text-left px-4 py-2 text-gray-700 rounded cursor-pointer hover:bg-gray-100 transition-transform duration-150 hover:translate-x-0.5 active:scale-[0.98]",
                            onClick: a,
                          },
                          " Logout ",
                        ),
                      ]))
                    : K("", !0),
                ]),
                _: 1,
              },
            ),
          ]),
        ])
      );
    },
  },
  hm = ns(vm, [["__scopeId", "data-v-a19f2772"]]);
function bm(e, t) {
  return (
    m(),
    g(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
      },
      [
        s("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5",
        }),
      ],
    )
  );
}
function ym(e, t) {
  return (
    m(),
    g(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
      },
      [
        s("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z",
        }),
      ],
    )
  );
}
function xm(e, t) {
  return (
    m(),
    g(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
      },
      [
        s("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
        }),
      ],
    )
  );
}
function _m(e, t) {
  return (
    m(),
    g(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
      },
      [
        s("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
        }),
      ],
    )
  );
}
const wm = {
    key: 0,
    class:
      "fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold text-base transition-all duration-300",
  },
  km = { class: "w-full grid grid-cols-[0.75fr_1.25fr]" },
  Am = {
    class: "left-panel h-screen overflow-y-auto scrollbar-hidden bg-white",
  },
  Cm = { class: "top-header border-b border-gray-300 pt-8 pb-8 pl-10 pr-10" },
  $m = { class: "text-header mb-6" },
  Sm = { class: "text-neutral-700 text-3xl font-bold" },
  Mm = { class: "booking__box grid grid-cols-3 gap-6" },
  Rm = { class: "booking__container" },
  Em = { class: "booking__item flex items-center gap-4" },
  Tm = { class: "icon__box" },
  Bm = { class: "description__box" },
  Pm = { class: "text-neutral-700 text-base font-semibold" },
  Im = { class: "booking__container" },
  jm = { class: "booking__item flex items-center gap-4" },
  Lm = { class: "icon__box" },
  Om = { class: "description__box" },
  Vm = { class: "text-neutral-700 text-base font-semibold" },
  Nm = { class: "booking__container" },
  Um = { class: "booking__item flex items-center gap-4" },
  Dm = { class: "icon__box" },
  Fm = { class: "description__box" },
  Hm = { class: "text-neutral-700 text-base font-semibold" },
  zm = { class: "main-body pt-8 pb-8 pl-10 pr-10" },
  Qm = {
    class: "payment-breakdown border border-gray-300 py-8 px-7 rounded-lg mb-6",
  },
  Km = {
    class: "fares flex justify-between mb-2 border-b border-gray-300 pt-7 pb-4",
  },
  Ym = { class: "fare__amount" },
  Jm = {
    class: "fares flex justify-between mb-2 border-b border-gray-300 pb-4",
  },
  qm = { class: "fare__amount" },
  Gm = {
    class: "fares flex justify-between mb-2 border-b border-gray-300 pb-4",
  },
  Zm = { class: "fare__amount" },
  Wm = {
    class: "fares flex justify-between mb-2 border-b border-gray-300 pb-4",
  },
  Xm = { class: "fare__amount" },
  eg = {
    class: "fares flex justify-between mb-2 border-b border-gray-300 pb-4",
  },
  tg = { class: "fare__amount font-bold" },
  sg = { class: "max-w-6xl mx-auto rounded-lg" },
  og = { class: "rounded-lg overflow-hidden" },
  ng = { class: "overflow-x-auto" },
  lg = { class: "w-full" },
  rg = { key: 0 },
  ag = { class: "px-2 py-2 font-medium text-gray-900 text-sm" },
  ig = { class: "px-2 py-2 text-gray-700 text-sm" },
  dg = { class: "px-2 py-2 text-gray-700 text-sm" },
  ug = { class: "px-2 py-2 text-gray-700 text-sm" },
  cg = { class: "px-2 py-2" },
  fg = ["onClick"],
  pg = ["onClick"],
  mg = { class: "flex items-center justify-between py-6 border-t" },
  gg = { class: "flex gap-3" },
  vg = {
    class: "flex flex-col gap-8 border-b border-gray-300 pt-8 pb-8 pl-10 pr-10",
  },
  hg = { class: "top__part flex gap-5" },
  bg = { class: "flex items-center gap-5" },
  yg = {
    class:
      "bg-white flex gap-2 items-center p-3 rounded-lg border border-gray-300",
  },
  xg = { class: "flex items-center" },
  _g = ["value"],
  wg = { class: "flex items-center gap-2" },
  kg = { class: "flex gap-4 items-center mb-3 justify-between" },
  Ag = { key: 0, class: "mb-8" },
  Cg = { class: "text-sm font-semibold text-gray-600 mb-3" },
  $g = { class: "grid grid-cols-4 gap-5" },
  Sg = ["onClick"],
  Mg = { class: "font-medium" },
  Rg = { class: "text-xs opacity-75" },
  Eg = { key: 1, class: "mb-8" },
  Tg = { class: "text-sm font-semibold text-gray-600 mb-3" },
  Bg = { class: "grid grid-cols-4 gap-5" },
  Pg = ["onClick"],
  Ig = { class: "font-medium" },
  jg = { class: "text-xs opacity-75" },
  Lg = { key: 2, class: "text-center py-8 text-gray-500" },
  Og = { key: 0 },
  Vg = { key: 1 },
  Ng = { key: 0 },
  Ug = { class: "grid grid-cols-3 gap-5" },
  Dg = ["onClick"],
  Fg = { key: 1 },
  Hg = { class: "grid grid-cols-2 gap-5" },
  zg = ["onClick"],
  Qg = { key: 2 },
  Kg = { class: "grid grid-cols-2 gap-5" },
  Yg = ["onClick"],
  Jg = { key: 3 },
  qg = { key: 0, class: "text-center py-8" },
  Gg = { key: 1, class: "bg-white p-4 rounded-lg border border-gray-300" },
  Zg = { class: "flex items-center justify-center gap-3 mb-3" },
  Wg = {
    class:
      "px-3 py-1 bg-blue-900 text-white text-xs font-semibold rounded-full",
  },
  Xg = {
    class: "relative h-[350px] overflow-auto border rounded-lg p-2 bg-gray-50",
  },
  ev = { class: "relative w-full h-full" },
  tv = ["data-row", "data-col", "onClick"],
  sv = { key: 0 },
  ov = {
    key: 1,
    class: "pointer-events-none font-bold text-white",
    style: { opacity: 0.7 },
  },
  nv = { key: 2, class: "pointer-events-none text-white text-xl font-bold" },
  lv = {
    key: 0,
    class: "mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200",
  },
  rv = { class: "text-sm font-medium text-blue-900" },
  av = { class: "font-bold" },
  iv = {
    key: 2,
    class: "bg-gray-50 p-6 rounded-lg border border-gray-300 text-center",
  },
  dv = { key: 4 },
  uv = { class: "space-y-2" },
  cv = { key: 5, class: "grid grid-cols-2 gap-5" },
  fv = ["onClick"],
  pv = { key: 6 },
  mv = { class: "grid grid-cols-3 gap-5" },
  gv = ["onClick"],
  vv = { class: "mt-8 mb-8" },
  hv = {
    class: "step__instruction text-base font-medium text-gray-700 text-center",
  },
  bv = {
    __name: "tellerBooking",
    setup(e) {
      const t = "https://fastcat-book.dev/api",
        o = $(!1),
        n = $(!1),
        l = $(!1),
        r = $(!1),
        a = $(null),
        u = (j) => {
          ((a.value = j), (r.value = !1));
        },
        i = [{ route: "Batangas Port - Calapan Port", fee: 2 }],
        f = $([]),
        c = $(!1),
        d = async (j) => {
          if (!j) {
            f.value = [];
            return;
          }
          c.value = !0;
          try {
            const R = localStorage.getItem("token"),
              I = R?.startsWith("Bearer ") ? R : `Bearer ${R}`,
              ne = await fetch(`${t}/accommodation-rates/route/${j}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: I,
                },
              });
            if (ne.ok) {
              const ue = await ne.json();
              (console.log("Rate API Response:", ue),
                ue.data?.accRates
                  ? ((f.value = ue.data.accRates),
                    console.log("Fetched rates:", f.value))
                  : (console.error("No accRates found in response"),
                    (f.value = [])));
            } else
              (console.error("Failed to fetch rates, status:", ne.status),
                (f.value = []));
          } catch (R) {
            (console.error("Error fetching rates:", R), (f.value = []));
          } finally {
            c.value = !1;
          }
        },
        p = () => {
          if (f.value && f.value.length > 0) {
            const j = f.value.find(
              (R) => R.accommodation?.accommodation_name === re.value,
            );
            if (j) {
              const R = parseFloat(j.base_rate || 0);
              return (console.log(`Rate for ${re.value}: ${R}`), R);
            }
            console.log(`No rate found for ${re.value}`);
          } else console.log("No dynamic rates available");
          return 0;
        },
        b = () => {
          const j = `${_.value} - ${C.value}`,
            R = i.find((I) => I.route === j);
          return R ? R.fee : 0;
        },
        x = (j) => {
          if (he.value.endsWith("%")) {
            const R = parseFloat(he.value) / 100;
            return j * R;
          }
          return he.value === "100%" ? j : 0;
        },
        A = $([]),
        v = $(null),
        S = $(!1),
        _ = $("Batangas Port"),
        C = $("Calapan Port"),
        k = $(""),
        T = $([]),
        B = $(null),
        F = $(""),
        de = $(""),
        re = $(""),
        ge = $(""),
        he = $(""),
        X = $(""),
        xe = $(null),
        Q = $([]),
        U = $(null),
        H = $(!1);
      (Re(v, (j) => {
        if (((B.value = null), j)) {
          S.value
            ? ((_.value = j.portB?.port_name || j.portB?.name || ""),
              (C.value = j.portA?.port_name || j.portA?.name || ""))
            : ((_.value = j.portA?.port_name || j.portA?.name || ""),
              (C.value = j.portB?.port_name || j.portB?.name || ""));
          const R = j.route_id || j.id;
          R && d(R);
        }
      }),
        Re(S, () => {
          ((B.value = null),
            v.value &&
              (S.value
                ? ((_.value =
                    v.value.portB?.port_name || v.value.portB?.name || ""),
                  (C.value =
                    v.value.portA?.port_name || v.value.portA?.name || ""))
                : ((_.value =
                    v.value.portA?.port_name || v.value.portA?.name || ""),
                  (C.value =
                    v.value.portB?.port_name || v.value.portB?.name || ""))));
        }),
        Re(B, (j) => {
          (j &&
            (console.log("Schedule selected:", j),
            (_.value = j.departurePort || _.value),
            (C.value = j.arrivalPort || C.value)),
            (xe.value = null),
            (Q.value = []),
            (U.value = null));
        }),
        Re(re, async (j) => {
          if (
            (console.log(
              "Watch triggered - selectedAccommodation changed to:",
              j,
            ),
            console.log("Current schedule:", B.value),
            console.log("Vessel ID:", B.value?.vesselId),
            !j || !B.value?.vesselId)
          ) {
            ((xe.value = null),
              (Q.value = []),
              (U.value = null),
              j
                ? B.value?.vesselId ||
                  console.log("No vessel ID found in schedule:", B.value)
                : console.log("No accommodation selected"));
            return;
          }
          (console.log(
            `Fetching seatmap for vessel ${B.value.vesselId}, accommodation: ${j}`,
          ),
            (H.value = !0));
          try {
            const R = localStorage.getItem("token"),
              I = R?.startsWith("Bearer ") ? R : `Bearer ${R}`,
              ne = await fetch(`${t}/vessels/${B.value.vesselId}/layout`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: I,
                },
              });
            if (
              (console.log("Seatmap fetch response status:", ne.status), ne.ok)
            ) {
              const ue = await ne.json();
              console.log("Seatmap API Response:", ue);
              const _e = ue.classes || [];
              xe.value = ue;
              const Be = _e.find((Pe) => {
                const fe = Pe.name === j;
                return (
                  console.log(`Checking class: ${Pe.name} - Match: ${fe}`),
                  fe
                );
              });
              Be
                ? ((Q.value = Be.seats || []),
                  console.log(`✓ Found ${Q.value.length} seats for ${j}`),
                  console.log("First few seats:", Q.value.slice(0, 5)),
                  T.value.forEach((Pe) => {
                    if (Pe.accommodation === j && Pe.seat) {
                      const fe = Q.value.find((Ye) => Ye.seat_no === Pe.seat);
                      fe && (fe.blocked = !0);
                    }
                  }))
                : ((Q.value = []),
                  console.log(`✗ No class found matching ${j}`),
                  console.log(
                    "Available classes:",
                    _e.map((Pe) => Pe.name),
                  ));
            } else {
              console.error("Failed to fetch seatmap, status:", ne.status);
              const ue = await ne.text();
              (console.error("Error response:", ue),
                (xe.value = null),
                (Q.value = []));
            }
          } catch (R) {
            (console.error("Error fetching seatmap:", R),
              (xe.value = null),
              (Q.value = []));
          } finally {
            ((H.value = !1), (U.value = null));
          }
        }));
      const ee = $([]),
        me = $([]);
      De(async () => {
        try {
          const j = localStorage.getItem("token");
          if ((console.log("stored token:", j), !j))
            return (
              localStorage.removeItem("token"),
              localStorage.removeItem("user"),
              (window.location.href = "/")
            );
          const R = j.startsWith("Bearer ") ? j : `Bearer ${j}`,
            I = await fetch(`${t}/routes/with-schedules`, {
              method: "GET",
              headers: { "Content-Type": "application/json", Authorization: R },
            });
          if (
            (console.log("routes response status:", I.status),
            I.status === 401 || I.status === 403)
          )
            return (
              localStorage.removeItem("token"),
              localStorage.removeItem("user"),
              (window.location.href = "/")
            );
          const ne = await I.json();
          if (I.ok && ne.success && ne.data?.routes) {
            A.value = ne.data.routes;
            const ue = [];
            (ne.data.routes.forEach((_e) => {
              const Be = _e.portA?.schedules || [],
                Pe = _e.portB?.schedules || [];
              (Be.forEach((fe) => {
                const Ye =
                    fe.vessel?.vessel_name ??
                    fe.vessel?.name ??
                    fe.vessel_name ??
                    (typeof fe.vessel == "string" ? fe.vessel : ""),
                  rs =
                    fe.vessel?.vessel_id ??
                    fe.vessel?.id ??
                    fe.vessel_id ??
                    null;
                ue.push({
                  id: fe.sched_id ?? fe.id ?? null,
                  time: fe.departure_time,
                  code: Ye || "No vessel",
                  value: fe.departure_time,
                  port: fe.port,
                  routeId: _e.route_id,
                  departurePort: _e.portA?.port_name || _e.portA?.name,
                  arrivalPort: _e.portB?.port_name || _e.portB?.name,
                  vesselId: rs,
                  vessel: fe.vessel,
                });
              }),
                Pe.forEach((fe) => {
                  const Ye =
                      fe.vessel?.vessel_name ??
                      fe.vessel?.name ??
                      fe.vessel_name ??
                      (typeof fe.vessel == "string" ? fe.vessel : ""),
                    rs =
                      fe.vessel?.vessel_id ??
                      fe.vessel?.id ??
                      fe.vessel_id ??
                      null;
                  ue.push({
                    id: fe.sched_id ?? fe.id ?? null,
                    time: fe.departure_time,
                    code: Ye || "No vessel",
                    value: fe.departure_time,
                    port: fe.port,
                    routeId: _e.route_id,
                    departurePort: _e.portB?.port_name || _e.portB?.name,
                    arrivalPort: _e.portA?.port_name || _e.portA?.name,
                    vesselId: rs,
                    vessel: fe.vessel,
                  });
                }));
            }),
              (ee.value = ue),
              (me.value = ue),
              A.value.length > 0 && (v.value = A.value[0]));
          } else console.error("Failed to fetch routes:", ne.message || ne);
        } catch (j) {
          console.error("Failed to fetch routes:", j);
        }
      });
      const Le = ["Passenger", "Driver", "Helper"],
        Oe = ["Regular Passenger", "Institutional Account"],
        Ve = ["Business Class", "Premium Economy", "Economy", "Senior/PWD"],
        Ne = ["Male", "Female"],
        it = [
          { label: "No Discount", value: "0", percent: "0%" },
          { label: "Special Discount", value: "25%", percent: "25%" },
          { label: "FOC", value: "100%", percent: "100%" },
        ],
        pt = (j) => {
          (console.log("Accommodation clicked:", j), (re.value = j));
          const R = p();
          console.log(`Selected: ${j}, Rate: ₱${R.toFixed(2)}`);
        },
        Pt = () => {
          const j = p(),
            R = b(),
            I = x(j),
            ne = j - I,
            ue = {
              date: k.value,
              route: `${_.value} - ${C.value}`,
              schedule: B.value?.time || B.value,
              category: F.value,
              type: de.value,
              accommodation: re.value,
              gender: ge.value,
              discount: he.value,
              fullname: X.value,
              seat:
                U.value?.seat_no ||
                (ae.value !== null
                  ? T.value[ae.value].seat
                  : `00${T.value.length + 1}A`),
              fare: ne.toFixed(2),
              cargoFare: "0.00",
              adminFee: R.toFixed(2),
              discountAmount: I.toFixed(2),
              vehicle: a.value,
            };
          if (ae.value !== null) {
            const _e = T.value[ae.value].seat,
              Be = ue.seat;
            if (_e !== Be) {
              const Pe = Q.value.find((Ye) => Ye.seat_no === _e);
              Pe && (Pe.blocked = !1);
              const fe = Q.value.find((Ye) => Ye.seat_no === Be);
              fe && (fe.blocked = !0);
            }
            ((T.value[ae.value] = ue), (ae.value = null));
          } else {
            const _e = Q.value.find((Be) => Be.seat_no === ue.seat);
            (_e && (_e.blocked = !0), T.value.push(ue));
          }
          ((o.value = !0),
            setTimeout(() => (o.value = !1), 2e3),
            (X.value = ""),
            (he.value = ""),
            (F.value = "Passenger"),
            (re.value = "Business Class"),
            (ge.value = "Male"),
            (de.value = "Regular Passenger"),
            (a.value = null),
            (k.value = ""),
            (U.value = null));
        },
        He = () => {
          ((X.value = ""),
            (he.value = "No Discount"),
            (F.value = "Passenger"),
            (re.value = "Business Class"),
            (ge.value = "Male"),
            (de.value = "Regular Passenger"),
            (T.value = []),
            (a.value = null),
            (k.value = ""),
            (o.value = !0),
            setTimeout(() => (o.value = !1), 2e3));
        };
      Re(F, (j) => {
        j === "Driver" && (r.value = !0);
      });
      const O = (j) => {},
        se = (j) => {
          ((l.value = !1),
            (j === "e-ticket" || j.id === "eticket") &&
              console.log("Passenger Array:", T.value));
        },
        M = pe(() => {
          if (!v.value || ee.value.length === 0)
            return { portA: [], portB: [] };
          const j = ee.value.filter((ne) => ne.routeId === v.value.route_id),
            R = v.value.portA?.port_name || v.value.portA?.name,
            I = v.value.portB?.port_name || v.value.portB?.name;
          return {
            portA: j.filter((ne) => ne.departurePort === R),
            portB: j.filter((ne) => ne.departurePort === I),
          };
        }),
        L = pe(() =>
          T.value.reduce(
            (j, R) => j + Number(R.fare) + Number(R.discountAmount),
            0,
          ),
        );
      pe(() => T.value.reduce((j, R) => j + parseFloat(R.fare), 0));
      const D = pe(() =>
          T.value.reduce((j, R) => j + parseFloat(R.cargoFare), 0),
        ),
        h = pe(() =>
          T.value.reduce((j, R) => j + parseFloat(R.adminFee || 0), 0),
        ),
        y = pe(() =>
          T.value.reduce((j, R) => j + parseFloat(R.discountAmount || 0), 0),
        ),
        E = pe(() => L.value + D.value + h.value - y.value),
        P = pe(() =>
          B.value
            ? F.value
              ? de.value
                ? re.value
                  ? X.value
                    ? ge.value
                      ? he.value
                        ? ""
                        : "Select Discount to proceed"
                      : "Select Gender to proceed"
                    : "Enter Passenger Fullname to proceed"
                  : "Select a Passenger Accommodation to proceed"
                : "Select a Passenger Type to proceed"
              : "Select a Passenger Category to proceed"
            : "Select a Schedule to proceed",
        ),
        V = $(null);
      Re(P, async () => {
        (await So(),
          V.value &&
            V.value.scrollTo({
              top: V.value.scrollHeight,
              behavior: "smooth",
            }));
      });
      const N = (j) => {
          const R = T.value[j];
          if (R && R.seat) {
            const I = Q.value.find((ne) => ne.seat_no === R.seat);
            I && (I.blocked = !1);
          }
          T.value.splice(j, 1);
        },
        W = $(!1),
        G = $(null),
        J = (j) => {
          ((G.value = j), (W.value = !0));
        },
        z = () => {
          ((W.value = !1), (G.value = null));
        },
        ae = $(null),
        te = (j) => {
          const R = T.value.findIndex(
            (I) => I.seat === j.seat && I.fullname === j.fullname,
          );
          if (R !== -1) {
            ((k.value = j.date),
              (_.value = j.route.split(" - ")[0]),
              (C.value = j.route.split(" - ")[1]),
              (B.value = j.schedule),
              (F.value = j.category),
              (de.value = j.type),
              (re.value = j.accommodation),
              (ge.value = j.gender),
              (he.value = j.discount),
              (X.value = j.fullname),
              (a.value = j.vehicle));
            const I = Q.value.find((ne) => ne.seat_no === j.seat);
            (I && (U.value = I), (ae.value = R), (W.value = !1));
          }
        };
      return (j, R) => (
        m(),
        g(
          q,
          null,
          [
            Y(hm),
            Y(
              um,
              { isOpen: W.value, passenger: G.value, onClose: z, onEdit: te },
              null,
              8,
              ["isOpen", "passenger"],
            ),
            Y(
              hp,
              {
                isOpen: l.value,
                onClose: R[0] || (R[0] = (I) => (l.value = !1)),
                onPaymentSelected: O,
                onPrintingSelected: se,
              },
              null,
              8,
              ["isOpen"],
            ),
            o.value ? (m(), g("div", wm, " Passenger Added! ")) : K("", !0),
            Y(
              Fp,
              {
                isOpen: r.value,
                onClose: R[1] || (R[1] = (I) => (r.value = !1)),
                onSave: u,
              },
              null,
              8,
              ["isOpen"],
            ),
            s("main", null, [
              s("div", km, [
                s("div", Am, [
                  s("div", Cm, [
                    s("div", $m, [
                      s("p", Sm, w(_.value) + " - " + w(C.value), 1),
                      R[8] ||
                        (R[8] = s(
                          "p",
                          { class: "text-neutral-600 font-medium text-base" },
                          "FCM 19",
                          -1,
                        )),
                    ]),
                    s("div", Mm, [
                      s("div", Rm, [
                        s("div", Em, [
                          s("div", Tm, [
                            Y(ie(ym), { class: "text-blue-900 w-6 h-6" }),
                          ]),
                          s("div", Bm, [
                            R[9] ||
                              (R[9] = s(
                                "p",
                                { class: "text-gray-400 text-sm" },
                                "Date",
                                -1,
                              )),
                            s("p", Pm, w(k.value || "Select a date"), 1),
                          ]),
                        ]),
                      ]),
                      s("div", Im, [
                        s("div", jm, [
                          s("div", Lm, [
                            Y(ie(xm), { class: "text-blue-900 w-6 h-6" }),
                          ]),
                          s("div", Om, [
                            R[10] ||
                              (R[10] = s(
                                "p",
                                { class: "text-gray-400 text-sm" },
                                "Schedule",
                                -1,
                              )),
                            s("p", Vm, w(B.value?.time || "00:00 AM"), 1),
                          ]),
                        ]),
                      ]),
                      s("div", Nm, [
                        s("div", Um, [
                          s("div", Dm, [
                            Y(ie(_m), { class: "text-blue-900 w-6 h-6" }),
                          ]),
                          s("div", Fm, [
                            R[11] ||
                              (R[11] = s(
                                "p",
                                { class: "text-gray-400 text-sm" },
                                "Passengers",
                                -1,
                              )),
                            s("p", Hm, w(T.value.length), 1),
                          ]),
                        ]),
                      ]),
                    ]),
                  ]),
                  s("div", zm, [
                    s("div", Qm, [
                      R[17] ||
                        (R[17] = s(
                          "p",
                          { class: "text-neutral-700 text-2xl font-bold" },
                          "Payment Breakdown",
                          -1,
                        )),
                      s("div", Km, [
                        R[12] ||
                          (R[12] = s(
                            "p",
                            { class: "fare__text" },
                            "Fare:",
                            -1,
                          )),
                        s("p", Ym, w(L.value.toFixed(2)), 1),
                      ]),
                      s("div", Jm, [
                        R[13] ||
                          (R[13] = s(
                            "p",
                            { class: "fare__text" },
                            "Cargo Rate:",
                            -1,
                          )),
                        s("p", qm, w(D.value.toFixed(2)), 1),
                      ]),
                      s("div", Gm, [
                        R[14] ||
                          (R[14] = s(
                            "p",
                            { class: "fare__text" },
                            "Admin Fee:",
                            -1,
                          )),
                        s("p", Zm, w(h.value.toFixed(2)), 1),
                      ]),
                      s("div", Wm, [
                        R[15] ||
                          (R[15] = s(
                            "p",
                            { class: "fare__text" },
                            "Discount:",
                            -1,
                          )),
                        s("p", Xm, "-" + w(y.value.toFixed(2)), 1),
                      ]),
                      s("div", eg, [
                        R[16] ||
                          (R[16] = s(
                            "p",
                            { class: "fare__text font-bold" },
                            "Amount to be paid:",
                            -1,
                          )),
                        s("p", tg, w(E.value.toFixed(2)), 1),
                      ]),
                    ]),
                    s("div", sg, [
                      R[23] ||
                        (R[23] = s(
                          "div",
                          { class: "mb-6" },
                          [
                            s(
                              "h1",
                              {
                                class:
                                  "text-2xl font-semibold text-gray-800 mb-4",
                              },
                              " Passenger List ",
                            ),
                          ],
                          -1,
                        )),
                      s("div", og, [
                        s("div", ng, [
                          s("table", lg, [
                            R[21] ||
                              (R[21] = s(
                                "thead",
                                null,
                                [
                                  s("tr", { class: "bg-blue-900 text-white" }, [
                                    s(
                                      "th",
                                      {
                                        class:
                                          "px-3 py-3 text-left font-semibold text-sm",
                                      },
                                      " Fullname ",
                                    ),
                                    s(
                                      "th",
                                      {
                                        class:
                                          "px-3 py-3 text-left font-semibold text-sm",
                                      },
                                      " Seat ",
                                    ),
                                    s(
                                      "th",
                                      {
                                        class:
                                          "px-3 py-3 text-left font-semibold text-sm",
                                      },
                                      " Fare ",
                                    ),
                                    s(
                                      "th",
                                      {
                                        class:
                                          "px-3 py-3 text-left font-semibold text-sm",
                                      },
                                      " Category ",
                                    ),
                                    s(
                                      "th",
                                      {
                                        class:
                                          "px-3 py-3 text-left font-semibold text-sm",
                                      },
                                      " Class ",
                                    ),
                                  ]),
                                ],
                                -1,
                              )),
                            s("tbody", null, [
                              T.value.length === 0
                                ? (m(),
                                  g("tr", rg, [
                                    ...(R[18] ||
                                      (R[18] = [
                                        s(
                                          "td",
                                          {
                                            colspan: "5",
                                            class:
                                              "px-2 py-4 text-center text-gray-500 text-sm italic",
                                          },
                                          " No passengers ",
                                          -1,
                                        ),
                                      ])),
                                  ]))
                                : (m(!0),
                                  g(
                                    q,
                                    { key: 1 },
                                    le(
                                      T.value,
                                      (I, ne) => (
                                        m(),
                                        g(
                                          "tr",
                                          {
                                            key: ne,
                                            class: "bg-white hover:bg-gray-50",
                                          },
                                          [
                                            s("td", ag, w(I.fullname), 1),
                                            s("td", ig, w(I.seat), 1),
                                            s("td", dg, w(I.fare), 1),
                                            s(
                                              "td",
                                              ug,
                                              w(I.category) +
                                                " (" +
                                                w(
                                                  it.find(
                                                    (ue) =>
                                                      ue.value === I.discount,
                                                  )?.percent || "0%",
                                                ) +
                                                ") ",
                                              1,
                                            ),
                                            s("td", cg, [
                                              s(
                                                "button",
                                                {
                                                  class:
                                                    "p-2 text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer",
                                                  onClick: (ue) => J(I),
                                                  title: "View Passenger",
                                                },
                                                [
                                                  ...(R[19] ||
                                                    (R[19] = [
                                                      s(
                                                        "svg",
                                                        {
                                                          class: "w-4 h-4",
                                                          fill: "none",
                                                          stroke:
                                                            "currentColor",
                                                          viewBox: "0 0 24 24",
                                                        },
                                                        [
                                                          s("path", {
                                                            "stroke-linecap":
                                                              "round",
                                                            "stroke-linejoin":
                                                              "round",
                                                            "stroke-width": "2",
                                                            d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
                                                          }),
                                                        ],
                                                        -1,
                                                      ),
                                                    ])),
                                                ],
                                                8,
                                                fg,
                                              ),
                                              s(
                                                "button",
                                                {
                                                  class:
                                                    "p-2 text-red-600 hover:bg-red-50 rounded-md cursor-pointer",
                                                  onClick: (ue) => N(ne),
                                                  title: "Remove Passenger",
                                                },
                                                [
                                                  ...(R[20] ||
                                                    (R[20] = [
                                                      s(
                                                        "svg",
                                                        {
                                                          class: "w-4 h-4",
                                                          fill: "none",
                                                          stroke:
                                                            "currentColor",
                                                          viewBox: "0 0 24 24",
                                                        },
                                                        [
                                                          s("path", {
                                                            "stroke-linecap":
                                                              "round",
                                                            "stroke-linejoin":
                                                              "round",
                                                            "stroke-width": "2",
                                                            d: "M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6m5 10v-6",
                                                          }),
                                                        ],
                                                        -1,
                                                      ),
                                                    ])),
                                                ],
                                                8,
                                                pg,
                                              ),
                                            ]),
                                          ],
                                        )
                                      ),
                                    ),
                                    128,
                                  )),
                            ]),
                          ]),
                        ]),
                        s("div", mg, [
                          R[22] ||
                            (R[22] = s(
                              "button",
                              {
                                class:
                                  "flex items-center gap-2 text-gray-600 hover:text-gray-800 text-base",
                              },
                              [
                                s(
                                  "svg",
                                  {
                                    class: "w-4 h-4",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                  },
                                  [
                                    s("path", {
                                      "stroke-linecap": "round",
                                      "stroke-linejoin": "round",
                                      "stroke-width": "2",
                                      d: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z",
                                    }),
                                  ],
                                ),
                                ye(" Save for later "),
                              ],
                              -1,
                            )),
                          s("div", gg, [
                            s(
                              "button",
                              {
                                class:
                                  "px-6 py-2 text-gray-600 hover:text-gray-800 font-medium text-base",
                                onClick: He,
                              },
                              " Cancel ",
                            ),
                            s(
                              "button",
                              {
                                class:
                                  "px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-base",
                                onClick: R[2] || (R[2] = (I) => (l.value = !0)),
                              },
                              " Proceed To Payment ",
                            ),
                          ]),
                        ]),
                      ]),
                    ]),
                  ]),
                ]),
                s(
                  "div",
                  {
                    ref_key: "rightPanel",
                    ref: V,
                    class:
                      "right-panel bg-gray-100 h-screen overflow-y-auto scrollbar-hidden",
                  },
                  [
                    s("div", vg, [
                      s("div", hg, [
                        s("div", null, [
                          R[24] ||
                            (R[24] = s(
                              "h3",
                              {
                                class:
                                  "text-base font-medium text-gray-700 mb-3",
                              },
                              " Select Date ",
                              -1,
                            )),
                          oe(
                            s(
                              "input",
                              {
                                type: "date",
                                "onUpdate:modelValue":
                                  R[3] || (R[3] = (I) => (k.value = I)),
                                class:
                                  "text-base text-gray-900 p-3 bg-white rounded-lg border border-gray-300",
                              },
                              null,
                              512,
                            ),
                            [[be, k.value]],
                          ),
                        ]),
                        s("div", null, [
                          R[26] ||
                            (R[26] = s(
                              "h3",
                              {
                                class:
                                  "text-base font-medium text-gray-700 mb-3",
                              },
                              " Select Route ",
                              -1,
                            )),
                          s("div", bg, [
                            s("div", yg, [
                              s("div", xg, [
                                oe(
                                  s(
                                    "select",
                                    {
                                      "onUpdate:modelValue":
                                        R[4] || (R[4] = (I) => (v.value = I)),
                                      class:
                                        "hide-select-icon text-center text-base min-w-[280px]",
                                    },
                                    [
                                      (m(!0),
                                      g(
                                        q,
                                        null,
                                        le(
                                          A.value,
                                          (I) => (
                                            m(),
                                            g(
                                              "option",
                                              { key: I.route_id, value: I },
                                              w(
                                                I.portA?.port_name ||
                                                  I.portA?.name ||
                                                  "Port A",
                                              ) +
                                                " → " +
                                                w(
                                                  I.portB?.port_name ||
                                                    I.portB?.name ||
                                                    "Port B",
                                                ),
                                              9,
                                              _g,
                                            )
                                          ),
                                        ),
                                        128,
                                      )),
                                    ],
                                    512,
                                  ),
                                  [[Qt, v.value]],
                                ),
                              ]),
                            ]),
                            s("label", wg, [
                              oe(
                                s(
                                  "input",
                                  {
                                    type: "checkbox",
                                    "onUpdate:modelValue":
                                      R[5] || (R[5] = (I) => (S.value = I)),
                                    class: "theme-checkbox",
                                  },
                                  null,
                                  512,
                                ),
                                [[We, S.value]],
                              ),
                              R[25] ||
                                (R[25] = s(
                                  "span",
                                  { class: "text-sm" },
                                  "Return Trip",
                                  -1,
                                )),
                            ]),
                          ]),
                        ]),
                      ]),
                      s("div", null, [
                        s("div", kg, [
                          R[28] ||
                            (R[28] = s(
                              "h3",
                              { class: "text-base font-medium text-gray-700" },
                              " Select Schedule ",
                              -1,
                            )),
                          B.value
                            ? (m(),
                              g(
                                "span",
                                {
                                  key: 0,
                                  class:
                                    "text-sm flex gap-2 items-center justify-center cursor-pointer font-medium text-blue-900",
                                  onClick:
                                    R[6] || (R[6] = (I) => (B.value = null)),
                                },
                                [
                                  Y(ie(bm), { class: "w-4 h-4" }),
                                  R[27] ||
                                    (R[27] = ye(" Change Schedule ", -1)),
                                ],
                              ))
                            : K("", !0),
                        ]),
                        M.value.portA.length > 0
                          ? (m(),
                            g("div", Ag, [
                              s(
                                "h4",
                                Cg,
                                w(
                                  v.value.portA?.port_name ||
                                    v.value.portA?.name,
                                ) +
                                  " → " +
                                  w(
                                    v.value.portB?.port_name ||
                                      v.value.portB?.name,
                                  ),
                                1,
                              ),
                              s("div", $g, [
                                (m(!0),
                                g(
                                  q,
                                  null,
                                  le(
                                    M.value.portA,
                                    (I) => (
                                      m(),
                                      g(
                                        "button",
                                        {
                                          key: I.id,
                                          onClick: (ne) => (B.value = I),
                                          class: Z([
                                            "p-3 text-center rounded-lg text-base border-2 transition-all duration-300",
                                            B.value?.id === I.id
                                              ? "border-2 bg-blue-900 text-white"
                                              : "bg-white text-gray-700 border-gray-300 hover:shadow-[0_0_0_2px_#3b3b3b]",
                                          ]),
                                        },
                                        [
                                          s("div", Mg, w(I.time), 1),
                                          s("div", Rg, w(I.code), 1),
                                        ],
                                        10,
                                        Sg,
                                      )
                                    ),
                                  ),
                                  128,
                                )),
                              ]),
                            ]))
                          : K("", !0),
                        M.value.portB.length > 0
                          ? (m(),
                            g("div", Eg, [
                              s(
                                "h4",
                                Tg,
                                w(
                                  v.value.portB?.port_name ||
                                    v.value.portB?.name,
                                ) +
                                  " → " +
                                  w(
                                    v.value.portA?.port_name ||
                                      v.value.portA?.name,
                                  ),
                                1,
                              ),
                              s("div", Bg, [
                                (m(!0),
                                g(
                                  q,
                                  null,
                                  le(
                                    M.value.portB,
                                    (I) => (
                                      m(),
                                      g(
                                        "button",
                                        {
                                          key: I.id,
                                          onClick: (ne) => (B.value = I),
                                          class: Z([
                                            "p-3 text-center rounded-lg text-base border-2 transition-all duration-300",
                                            B.value?.id === I.id
                                              ? "border-2 bg-blue-900 text-white"
                                              : "bg-white text-gray-700 border-gray-300 hover:shadow-[0_0_0_2px_#3b3b3b]",
                                          ]),
                                        },
                                        [
                                          s("div", Ig, w(I.time), 1),
                                          s("div", jg, w(I.code), 1),
                                        ],
                                        10,
                                        Pg,
                                      )
                                    ),
                                  ),
                                  128,
                                )),
                              ]),
                            ]))
                          : K("", !0),
                        M.value.portA.length === 0 && M.value.portB.length === 0
                          ? (m(),
                            g("div", Lg, [
                              v.value
                                ? (m(),
                                  g(
                                    "span",
                                    Og,
                                    " No schedules available for this route ",
                                  ))
                                : (m(),
                                  g(
                                    "span",
                                    Vg,
                                    " Please select a route to view schedules ",
                                  )),
                            ]))
                          : K("", !0),
                      ]),
                      B.value
                        ? (m(),
                          g("div", Ng, [
                            R[29] ||
                              (R[29] = s(
                                "h3",
                                {
                                  class:
                                    "text-base font-medium text-gray-700 mb-3",
                                },
                                " Choose Passenger Category ",
                                -1,
                              )),
                            s("div", Ug, [
                              (m(),
                              g(
                                q,
                                null,
                                le(Le, (I) =>
                                  s(
                                    "button",
                                    {
                                      key: I,
                                      onClick: (ne) => (F.value = I),
                                      class: Z([
                                        "p-3 text-center rounded-lg text-base border border-gray-300 transition-all duration-300",
                                        F.value === I
                                          ? "bg-blue-900 text-white font-medium"
                                          : "bg-white hover:shadow-[0_0_0_2px_#3b3b3b]",
                                      ]),
                                    },
                                    w(I),
                                    11,
                                    Dg,
                                  ),
                                ),
                                64,
                              )),
                            ]),
                          ]))
                        : K("", !0),
                      F.value
                        ? (m(),
                          g("div", Fg, [
                            R[30] ||
                              (R[30] = s(
                                "h3",
                                {
                                  class:
                                    "text-base font-medium text-gray-700 mb-3",
                                },
                                " Choose Passenger Type ",
                                -1,
                              )),
                            s("div", Hg, [
                              (m(),
                              g(
                                q,
                                null,
                                le(Oe, (I) =>
                                  s(
                                    "button",
                                    {
                                      key: I,
                                      onClick: (ne) => (de.value = I),
                                      class: Z([
                                        "p-3 text-center rounded-lg text-base border border-gray-300 transition-all duration-300",
                                        de.value === I
                                          ? "bg-blue-900 text-white font-medium"
                                          : "bg-white hover:shadow-[0_0_0_2px_#3b3b3b]",
                                      ]),
                                    },
                                    w(I),
                                    11,
                                    zg,
                                  ),
                                ),
                                64,
                              )),
                            ]),
                          ]))
                        : K("", !0),
                      de.value
                        ? (m(),
                          g("div", Qg, [
                            R[31] ||
                              (R[31] = s(
                                "h3",
                                {
                                  class:
                                    "text-base font-medium text-gray-700 mb-3",
                                },
                                " Choose Passenger Accommodation ",
                                -1,
                              )),
                            s("div", Kg, [
                              (m(),
                              g(
                                q,
                                null,
                                le(Ve, (I) =>
                                  s(
                                    "button",
                                    {
                                      key: I,
                                      onClick: (ne) => pt(I),
                                      class: Z([
                                        "p-3 text-center rounded-lg text-base border border-gray-300 transition-all duration-300",
                                        re.value === I
                                          ? "bg-blue-900 text-white font-medium"
                                          : "bg-white hover:shadow-[0_0_0_2px_#3b3b3b]",
                                      ]),
                                    },
                                    w(I),
                                    11,
                                    Yg,
                                  ),
                                ),
                                64,
                              )),
                            ]),
                          ]))
                        : K("", !0),
                      re.value
                        ? (m(),
                          g("div", Jg, [
                            R[37] ||
                              (R[37] = s(
                                "h3",
                                {
                                  class:
                                    "text-base font-medium text-gray-700 mb-3",
                                },
                                " Select Your Seat ",
                                -1,
                              )),
                            H.value
                              ? (m(),
                                g("div", qg, [
                                  ...(R[32] ||
                                    (R[32] = [
                                      s(
                                        "div",
                                        {
                                          class:
                                            "inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900",
                                        },
                                        null,
                                        -1,
                                      ),
                                      s(
                                        "p",
                                        { class: "text-gray-600 mt-2" },
                                        "Loading seatmap...",
                                        -1,
                                      ),
                                    ])),
                                ]))
                              : Q.value.length > 0
                                ? (m(),
                                  g("div", Gg, [
                                    s("div", Zg, [
                                      R[33] ||
                                        (R[33] = s(
                                          "p",
                                          {
                                            class:
                                              "text-sm font-medium text-gray-700",
                                          },
                                          "Seatmap Preview",
                                          -1,
                                        )),
                                      s("span", Wg, w(re.value), 1),
                                    ]),
                                    s("div", Xg, [
                                      s("div", ev, [
                                        (m(!0),
                                        g(
                                          q,
                                          null,
                                          le(
                                            Q.value,
                                            (I) => (
                                              m(),
                                              g(
                                                "div",
                                                {
                                                  key: I.seat_no,
                                                  "data-row": I.row,
                                                  "data-col": I.col,
                                                  class: Z([
                                                    "absolute flex items-center justify-center border rounded-md text-xs font-medium cursor-pointer select-none transition-all duration-200",
                                                    {
                                                      "bg-gray-300 cursor-not-allowed":
                                                        I.path,
                                                      "bg-red-700 text-white cursor-not-allowed":
                                                        I.blocked,
                                                      "bg-gray-100 hover:bg-green-100":
                                                        !I.path &&
                                                        !I.blocked &&
                                                        !I.facility &&
                                                        U.value?.seat_no !==
                                                          I.seat_no,
                                                      "bg-orange-400 text-white cursor-not-allowed":
                                                        I.facility,
                                                      "bg-blue-600 text-white shadow-lg ring-2 ring-blue-400":
                                                        U.value?.seat_no ===
                                                        I.seat_no,
                                                    },
                                                  ]),
                                                  style: vs({
                                                    width: "40px",
                                                    height: "40px",
                                                    top: I.row * 40 + "px",
                                                    left: I.col * 40 + "px",
                                                  }),
                                                  onClick: (ne) =>
                                                    !I.blocked &&
                                                    !I.path &&
                                                    !I.facility
                                                      ? (U.value = I)
                                                      : null,
                                                },
                                                [
                                                  !I.blocked &&
                                                  !I.path &&
                                                  !I.facility
                                                    ? (m(),
                                                      g(
                                                        "span",
                                                        sv,
                                                        w(I.seat_no),
                                                        1,
                                                      ))
                                                    : K("", !0),
                                                  I.facility
                                                    ? (m(),
                                                      g(
                                                        "span",
                                                        ov,
                                                        w(I.facility),
                                                        1,
                                                      ))
                                                    : K("", !0),
                                                  I.blocked
                                                    ? (m(),
                                                      g("span", nv, " ✕ "))
                                                    : K("", !0),
                                                ],
                                                14,
                                                tv,
                                              )
                                            ),
                                          ),
                                          128,
                                        )),
                                      ]),
                                    ]),
                                    R[35] ||
                                      (R[35] = Bo(
                                        '<div class="flex gap-4 mt-4 text-xs justify-center" data-v-4070d0d6><div class="flex items-center gap-1" data-v-4070d0d6><div class="w-6 h-6 bg-gray-100 border rounded" data-v-4070d0d6></div><span data-v-4070d0d6>Available</span></div><div class="flex items-center gap-1" data-v-4070d0d6><div class="w-6 h-6 bg-blue-600 rounded" data-v-4070d0d6></div><span data-v-4070d0d6>Selected</span></div><div class="flex items-center gap-1" data-v-4070d0d6><div class="w-6 h-6 bg-gray-300 rounded" data-v-4070d0d6></div><span data-v-4070d0d6>Path</span></div><div class="flex items-center gap-1" data-v-4070d0d6><div class="w-6 h-6 bg-red-700 rounded" data-v-4070d0d6></div><span data-v-4070d0d6>Blocked</span></div></div>',
                                        1,
                                      )),
                                    U.value
                                      ? (m(),
                                        g("div", lv, [
                                          s("p", rv, [
                                            R[34] ||
                                              (R[34] = ye(
                                                " Selected Seat: ",
                                                -1,
                                              )),
                                            s(
                                              "span",
                                              av,
                                              w(U.value.seat_no),
                                              1,
                                            ),
                                          ]),
                                        ]))
                                      : K("", !0),
                                  ]))
                                : (m(),
                                  g("div", iv, [
                                    ...(R[36] ||
                                      (R[36] = [
                                        s(
                                          "p",
                                          { class: "text-gray-600" },
                                          " No seatmap available for this accommodation class. ",
                                          -1,
                                        ),
                                        s(
                                          "p",
                                          {
                                            class: "text-sm text-gray-500 mt-1",
                                          },
                                          " Seat will be assigned automatically. ",
                                          -1,
                                        ),
                                      ])),
                                  ])),
                          ]))
                        : K("", !0),
                      re.value
                        ? (m(),
                          g("div", dv, [
                            R[39] ||
                              (R[39] = s(
                                "h3",
                                {
                                  class:
                                    "text-base font-medium text-gray-700 mb-3",
                                },
                                " Passenger Information ",
                                -1,
                              )),
                            s("div", uv, [
                              R[38] ||
                                (R[38] = s(
                                  "label",
                                  { class: "block text-sm text-gray-600" },
                                  "Fullname",
                                  -1,
                                )),
                              oe(
                                s(
                                  "input",
                                  {
                                    type: "text",
                                    "onUpdate:modelValue":
                                      R[7] || (R[7] = (I) => (X.value = I)),
                                    placeholder: "Enter Passenger Fullname",
                                    class:
                                      "w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:shadow-[0_0_0_2px_#155dfc]",
                                  },
                                  null,
                                  512,
                                ),
                                [[be, X.value]],
                              ),
                            ]),
                          ]))
                        : K("", !0),
                      X.value
                        ? (m(),
                          g("div", cv, [
                            (m(),
                            g(
                              q,
                              null,
                              le(Ne, (I) =>
                                s(
                                  "button",
                                  {
                                    key: I,
                                    onClick: (ne) => (ge.value = I),
                                    class: Z([
                                      "p-3 text-center rounded-lg text-base border border-gray-300 transition-all duration-300",
                                      ge.value === I
                                        ? "bg-blue-900 text-white font-medium"
                                        : "bg-white hover:shadow-[0_0_0_2px_#3b3b3b]",
                                    ]),
                                  },
                                  w(I),
                                  11,
                                  fv,
                                ),
                              ),
                              64,
                            )),
                          ]))
                        : K("", !0),
                      ge.value
                        ? (m(),
                          g("div", pv, [
                            R[40] ||
                              (R[40] = s(
                                "h3",
                                {
                                  class:
                                    "text-base font-medium text-gray-700 mb-3",
                                },
                                " Choose Discount ",
                                -1,
                              )),
                            s("div", mv, [
                              (m(),
                              g(
                                q,
                                null,
                                le(it, (I) =>
                                  s(
                                    "button",
                                    {
                                      key: I.value,
                                      onClick: (ne) => (he.value = I.value),
                                      class: Z([
                                        "p-3 text-center rounded-lg text-base border border-gray-300 transition-all duration-300",
                                        he.value === I.value
                                          ? "bg-blue-900 text-white font-medium"
                                          : "bg-white hover:shadow-[0_0_0_2px_#3b3b3b]",
                                      ]),
                                    },
                                    w(I.label),
                                    11,
                                    gv,
                                  ),
                                ),
                                64,
                              )),
                            ]),
                            R[41] ||
                              (R[41] = s(
                                "p",
                                { class: "text-xs text-gray-500 mt-1" },
                                " *req. valid/soft ID for new entry ",
                                -1,
                              )),
                          ]))
                        : K("", !0),
                      he.value
                        ? (m(),
                          g(
                            "button",
                            {
                              key: 7,
                              onClick: Pt,
                              class: Z([
                                "w-full p-4 rounded-lg text-base font-medium transition-all duration-300",
                                n.value
                                  ? "bg-white shadow-border-brand-color font-medium"
                                  : "bg-orange-500 text-white hover:bg-orange-600",
                              ]),
                            },
                            " Book Entry ",
                            2,
                          ))
                        : K("", !0),
                    ]),
                    s("div", vv, [s("h4", hv, w(P.value), 1)]),
                  ],
                  512,
                ),
              ]),
            ]),
          ],
          64,
        )
      );
    },
  },
  yv = ns(bv, [["__scopeId", "data-v-4070d0d6"]]),
  xv = {
    class:
      "modal-card bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 p-8 relative",
  },
  _v = { class: "text-xl font-semibold text-gray-900 mb-1" },
  wv = { class: "text-sm text-gray-500 mb-6" },
  kv = { class: "flex items-center gap-2 mb-6" },
  Av = ["value"],
  Cv = { key: 0, class: "grid grid-cols-2 gap-6 mb-6" },
  $v = {
    class:
      "bg-gray-100 rounded-t-lg px-4 py-2 font-semibold text-gray-700 text-center",
  },
  Sv = { class: "min-w-full bg-white rounded-b-lg" },
  Mv = { class: "px-4 py-2" },
  Rv = ["onUpdate:modelValue", "disabled"],
  Ev = { class: "px-4 py-2" },
  Tv = ["onUpdate:modelValue", "disabled"],
  Bv = {
    class:
      "bg-gray-100 rounded-t-lg px-4 py-2 font-semibold text-gray-700 text-center",
  },
  Pv = { class: "min-w-full bg-white rounded-b-lg" },
  Iv = { class: "px-4 py-2" },
  jv = ["onUpdate:modelValue", "disabled"],
  Lv = { class: "px-4 py-2" },
  Ov = ["onUpdate:modelValue", "disabled"],
  Vv = { class: "flex items-center justify-end gap-3 mt-8" },
  Nv = {
    __name: "ModalCreateSchedule",
    props: {
      routes: { type: Array, default: () => [] },
      selectedRouteId: { type: [String, Number], default: "" },
      portASchedules: { type: Array, default: () => [] },
      portBSchedules: { type: Array, default: () => [] },
      mode: { type: String, default: "create" },
    },
    emits: ["close", "save", "update:selectedRouteId"],
    setup(e, { emit: t }) {
      const o = e,
        n = t,
        l = "https://fastcat-book.dev/api",
        r = $(o.routes || []);
      Re(
        () => o.routes,
        (v) => (r.value = v || []),
      );
      const a = o.mode || "create",
        u = $(o.selectedRouteId || "");
      (Re(
        () => o.selectedRouteId,
        (v) => (u.value = v || ""),
      ),
        Re(u, (v) => n("update:selectedRouteId", v)));
      const i = pe(() => r.value.find((v) => v.route_id == u.value)),
        f = (v) =>
          (v || []).map((S) => ({
            sched_id: S.sched_id,
            departure: S.departure_time || "",
            arrival: S.arrival_time || "",
            existing: !0,
          })),
        c = $(
          o.portASchedules && o.portASchedules.length
            ? JSON.parse(JSON.stringify(o.portASchedules))
            : [{ departure: "", arrival: "", vessel: "" }],
        ),
        d = $(
          o.portBSchedules && o.portBSchedules.length
            ? JSON.parse(JSON.stringify(o.portBSchedules))
            : [{ departure: "", arrival: "", vessel: "" }],
        ),
        p = $(!1);
      (Re(
        () => o.portASchedules,
        (v) => (c.value = JSON.parse(JSON.stringify(v || []))),
      ),
        Re(
          () => o.portBSchedules,
          (v) => (d.value = JSON.parse(JSON.stringify(v || []))),
        ),
        Re(
          i,
          (v) => {
            if (!v || a !== "create") return;
            const S = f(v.portA?.schedules),
              _ = f(v.portB?.schedules);
            ((p.value = !0),
              (c.value = S.length
                ? [...S, { departure: "", arrival: "", vessel: "" }]
                : [{ departure: "", arrival: "", vessel: "" }]),
              (d.value = _.length
                ? [..._, { departure: "", arrival: "", vessel: "" }]
                : [{ departure: "", arrival: "", vessel: "" }]),
              (p.value = !1));
          },
          { immediate: !0 },
        ));
      const b = (v) => {
        v === "a"
          ? c.value.push({ departure: "", arrival: "", vessel: "" })
          : d.value.push({ departure: "", arrival: "", vessel: "" });
      };
      De(async () => {
        if (!(r.value && r.value.length))
          try {
            const v = localStorage.getItem("token"),
              S = await fetch(`${l}/routes/with-schedules`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: v,
                },
              }),
              _ = await S.json();
            S.ok && _.success && _.data?.routes
              ? (r.value = _.data.routes.map((C) => ({
                  route_id: C.route_id,
                  portA: C.portA,
                  portB: C.portB,
                })))
              : (r.value = []);
          } catch {
            r.value = [];
          }
      });
      const A = async () => {
        const v = localStorage.getItem("token");
        if (!i.value) {
          alert("Select a route before saving");
          return;
        }
        const S = async (C) => {
            await fetch(`${l}/schedules`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: v },
              body: JSON.stringify(C),
            });
          },
          _ = async (C, k) => {
            await fetch(`${l}/schedules/${C}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json", Authorization: v },
              body: JSON.stringify(k),
            });
          };
        for (const C of c.value) {
          if (C.existing || !C.departure) continue;
          const k = {
            departure_time: C.departure,
            arrival_time: C.arrival || null,
            port_id: i.value.portA.port_id,
          };
          a === "edit" && C.sched_id ? await _(C.sched_id, k) : await S(k);
        }
        for (const C of d.value) {
          if (C.existing || !C.departure) continue;
          const k = {
            departure_time: C.departure,
            arrival_time: C.arrival || null,
            port_id: i.value.portB.port_id,
          };
          a === "edit" && C.sched_id ? await _(C.sched_id, k) : await S(k);
        }
        (n("save"), n("close"));
      };
      return (v, S) => (
        m(),
        g(
          "div",
          {
            class:
              "fixed inset-0 bg-black/30 flex items-center justify-center z-50",
            onClick: S[5] || (S[5] = Se((_) => v.$emit("close"), ["self"])),
          },
          [
            s("div", xv, [
              s(
                "button",
                {
                  onClick: S[0] || (S[0] = (_) => v.$emit("close")),
                  class:
                    "absolute top-4 right-4 text-gray-400 hover:text-gray-600",
                },
                [
                  ...(S[6] ||
                    (S[6] = [
                      s(
                        "svg",
                        {
                          class: "w-6 h-6",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24",
                        },
                        [
                          s("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M6 18L18 6M6 6l12 12",
                          }),
                        ],
                        -1,
                      ),
                    ])),
                ],
              ),
              s(
                "h2",
                _v,
                w(ie(a) === "edit" ? "Edit Schedule" : "Create Schedule"),
                1,
              ),
              s(
                "p",
                wv,
                w(
                  ie(a) === "edit"
                    ? "Modify the schedule below and save changes"
                    : "Provide basic information about the schedule",
                ),
                1,
              ),
              s("div", kv, [
                oe(
                  s(
                    "select",
                    {
                      "onUpdate:modelValue":
                        S[1] || (S[1] = (_) => (u.value = _)),
                      class:
                        "border border-gray-300 rounded-md px-3 py-2 w-full max-w-xs",
                    },
                    [
                      S[7] ||
                        (S[7] = s(
                          "option",
                          { value: "", disabled: "" },
                          "Select Route",
                          -1,
                        )),
                      (m(!0),
                      g(
                        q,
                        null,
                        le(
                          r.value,
                          (_) => (
                            m(),
                            g(
                              "option",
                              { key: _.route_id, value: _.route_id },
                              w(_.portA?.port_name) +
                                " - " +
                                w(_.portB?.port_name),
                              9,
                              Av,
                            )
                          ),
                        ),
                        128,
                      )),
                    ],
                    512,
                  ),
                  [[Qt, u.value]],
                ),
                S[8] ||
                  (S[8] = s(
                    "button",
                    {
                      type: "button",
                      class:
                        "flex items-center gap-1 px-3 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50",
                    },
                    [
                      s(
                        "svg",
                        {
                          class: "w-4 h-4",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24",
                        },
                        [
                          s("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
                          }),
                        ],
                      ),
                      ye(" View "),
                    ],
                    -1,
                  )),
              ]),
              i.value
                ? (m(),
                  g("div", Cv, [
                    s("div", null, [
                      s("div", $v, w(i.value.portA?.port_name || "Port A"), 1),
                      s("table", Sv, [
                        S[9] ||
                          (S[9] = s(
                            "thead",
                            null,
                            [
                              s("tr", null, [
                                s(
                                  "th",
                                  {
                                    class:
                                      "px-4 py-2 text-xs text-gray-500 text-left",
                                  },
                                  " Departure ",
                                ),
                                s(
                                  "th",
                                  {
                                    class:
                                      "px-4 py-2 text-xs text-gray-500 text-left",
                                  },
                                  " Arrival ",
                                ),
                              ]),
                            ],
                            -1,
                          )),
                        s("tbody", null, [
                          (m(!0),
                          g(
                            q,
                            null,
                            le(
                              c.value,
                              (_, C) => (
                                m(),
                                g("tr", { key: C }, [
                                  s("td", Mv, [
                                    oe(
                                      s(
                                        "input",
                                        {
                                          "onUpdate:modelValue": (k) =>
                                            (_.departure = k),
                                          type: "text",
                                          placeholder: "Departure",
                                          disabled: _.existing,
                                          class:
                                            "border border-gray-300 rounded px-2 py-1 w-full disabled:bg-gray-100",
                                        },
                                        null,
                                        8,
                                        Rv,
                                      ),
                                      [[be, _.departure]],
                                    ),
                                  ]),
                                  s("td", Ev, [
                                    oe(
                                      s(
                                        "input",
                                        {
                                          "onUpdate:modelValue": (k) =>
                                            (_.arrival = k),
                                          type: "text",
                                          placeholder: "Arrival",
                                          disabled: _.existing,
                                          class:
                                            "border border-gray-300 rounded px-2 py-1 w-full disabled:bg-gray-100",
                                        },
                                        null,
                                        8,
                                        Tv,
                                      ),
                                      [[be, _.arrival]],
                                    ),
                                  ]),
                                ])
                              ),
                            ),
                            128,
                          )),
                        ]),
                      ]),
                      s(
                        "button",
                        {
                          type: "button",
                          onClick: S[2] || (S[2] = (_) => b("a")),
                          class:
                            "mt-2 text-blue-600 flex items-center gap-1 text-sm hover:underline",
                        },
                        [
                          ...(S[10] ||
                            (S[10] = [
                              s(
                                "span",
                                { class: "font-bold text-lg" },
                                "+",
                                -1,
                              ),
                              ye(" Add row ", -1),
                            ])),
                        ],
                      ),
                    ]),
                    s("div", null, [
                      s("div", Bv, w(i.value.portB?.port_name || "Port B"), 1),
                      s("table", Pv, [
                        S[11] ||
                          (S[11] = s(
                            "thead",
                            null,
                            [
                              s("tr", null, [
                                s(
                                  "th",
                                  {
                                    class:
                                      "px-4 py-2 text-xs text-gray-500 text-left",
                                  },
                                  " Departure ",
                                ),
                                s(
                                  "th",
                                  {
                                    class:
                                      "px-4 py-2 text-xs text-gray-500 text-left",
                                  },
                                  " Arrival ",
                                ),
                              ]),
                            ],
                            -1,
                          )),
                        s("tbody", null, [
                          (m(!0),
                          g(
                            q,
                            null,
                            le(
                              d.value,
                              (_, C) => (
                                m(),
                                g("tr", { key: C }, [
                                  s("td", Iv, [
                                    oe(
                                      s(
                                        "input",
                                        {
                                          "onUpdate:modelValue": (k) =>
                                            (_.departure = k),
                                          type: "text",
                                          placeholder: "Departure",
                                          disabled: _.existing,
                                          class:
                                            "border border-gray-300 rounded px-2 py-1 w-full disabled:bg-gray-100",
                                        },
                                        null,
                                        8,
                                        jv,
                                      ),
                                      [[be, _.departure]],
                                    ),
                                  ]),
                                  s("td", Lv, [
                                    oe(
                                      s(
                                        "input",
                                        {
                                          "onUpdate:modelValue": (k) =>
                                            (_.arrival = k),
                                          type: "text",
                                          placeholder: "Arrival",
                                          disabled: _.existing,
                                          class:
                                            "border border-gray-300 rounded px-2 py-1 w-full disabled:bg-gray-100",
                                        },
                                        null,
                                        8,
                                        Ov,
                                      ),
                                      [[be, _.arrival]],
                                    ),
                                  ]),
                                ])
                              ),
                            ),
                            128,
                          )),
                        ]),
                      ]),
                      s(
                        "button",
                        {
                          type: "button",
                          onClick: S[3] || (S[3] = (_) => b("b")),
                          class:
                            "mt-2 text-blue-600 flex items-center gap-1 text-sm hover:underline",
                        },
                        [
                          ...(S[12] ||
                            (S[12] = [
                              s(
                                "span",
                                { class: "font-bold text-lg" },
                                "+",
                                -1,
                              ),
                              ye(" Add row ", -1),
                            ])),
                        ],
                      ),
                    ]),
                  ]))
                : K("", !0),
              s("div", Vv, [
                s(
                  "button",
                  {
                    type: "button",
                    onClick: S[4] || (S[4] = (_) => v.$emit("close")),
                    class:
                      "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50",
                  },
                  " Cancel ",
                ),
                s(
                  "button",
                  {
                    type: "button",
                    onClick: A,
                    class:
                      "px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700",
                  },
                  w(ie(a) === "edit" ? "Save Changes" : "Save Schedule"),
                  1,
                ),
              ]),
            ]),
          ],
        )
      );
    },
  },
  Uv = {
    class:
      "modal-card bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 p-6 relative max-h-[85vh] overflow-hidden flex flex-col",
  },
  Dv = { class: "text-xl font-semibold text-gray-900 mb-6" },
  Fv = { class: "space-y-6 mb-6 overflow-auto flex-1 pr-1" },
  Hv = { class: "grid grid-cols-2 gap-4" },
  zv = {
    class: "bg-gray-50 rounded-lg overflow-hidden border border-gray-200",
  },
  Qv = {
    class: "bg-gray-200 px-4 py-3 font-semibold text-gray-700 text-center",
  },
  Kv = { class: "min-w-full bg-white" },
  Yv = { class: "px-6 py-4 text-sm text-gray-900" },
  Jv = { class: "px-6 py-4 text-sm text-gray-900" },
  qv = {
    class: "bg-gray-50 rounded-lg overflow-hidden border border-gray-200",
  },
  Gv = { class: "min-w-full bg-white" },
  Zv = { class: "px-6 py-4 text-center" },
  Wv = ["onUpdate:modelValue", "onChange"],
  Xv = { class: "px-6 py-4 text-center" },
  e1 = ["onUpdate:modelValue", "onChange"],
  t1 = { class: "px-6 py-4 text-center" },
  s1 = ["onUpdate:modelValue", "onChange"],
  o1 = { class: "px-6 py-4 text-center" },
  n1 = ["onUpdate:modelValue", "onChange"],
  l1 = { class: "grid grid-cols-2 gap-4" },
  r1 = {
    class: "bg-gray-50 rounded-lg overflow-hidden border border-gray-200",
  },
  a1 = {
    class: "bg-gray-200 px-4 py-3 font-semibold text-gray-700 text-center",
  },
  i1 = { class: "min-w-full bg-white" },
  d1 = { class: "px-6 py-4 text-sm text-gray-900" },
  u1 = { class: "px-6 py-4 text-sm text-gray-900" },
  c1 = {
    class: "bg-gray-50 rounded-lg overflow-hidden border border-gray-200",
  },
  f1 = { class: "min-w-full bg-white" },
  p1 = { class: "px-6 py-4 text-center" },
  m1 = ["onUpdate:modelValue", "onChange"],
  g1 = { class: "px-6 py-4 text-center" },
  v1 = ["onUpdate:modelValue", "onChange"],
  h1 = { class: "px-6 py-4 text-center" },
  b1 = ["onUpdate:modelValue", "onChange"],
  y1 = { class: "px-6 py-4 text-center" },
  x1 = ["onUpdate:modelValue", "onChange"],
  _1 = { class: "flex justify-end gap-3" },
  w1 = {
    __name: "ModalScheduleOptions",
    props: { selectedRoute: { type: Object, required: !0 } },
    emits: ["close", "save"],
    setup(e, { emit: t }) {
      const o = e,
        n = t,
        l = pe(() =>
          o.selectedRoute
            ? `${o.selectedRoute.portA?.port_name || ""} - ${o.selectedRoute.portB?.port_name || ""}`
            : "",
        ),
        r = pe(() => o.selectedRoute.portA?.port_name || "Port A"),
        a = pe(() => o.selectedRoute.portB?.port_name || "Port B"),
        u = (x) => {
          const A = x ?? 7;
          return {
            online: [1, 3, 5, 7].includes(A),
            teller: [2, 3, 6, 7].includes(A),
            merchant: [4, 5, 6, 7].includes(A),
            all: A === 7,
          };
        },
        i = (x, A, v) =>
          x && A && v
            ? 7
            : A && v
              ? 6
              : x && v
                ? 5
                : v
                  ? 4
                  : x && A
                    ? 3
                    : A
                      ? 2
                      : x
                        ? 1
                        : 0,
        f = $([]),
        c = $([]);
      Re(
        () => o.selectedRoute,
        (x) => {
          x &&
            ((f.value = (x.portA?.schedules || []).map((A) => {
              const v = u(A.visibility);
              return {
                sched_id: A.sched_id,
                departure_time: A.departure_time,
                arrival_time: A.arrival_time,
                visibility: A.visibility ?? 7,
                ...v,
              };
            })),
            (c.value = (x.portB?.schedules || []).map((A) => {
              const v = u(A.visibility);
              return {
                sched_id: A.sched_id,
                departure_time: A.departure_time,
                arrival_time: A.arrival_time,
                visibility: A.visibility ?? 7,
                ...v,
              };
            })));
        },
        { immediate: !0 },
      );
      const d = (x) => {
          x.all
            ? ((x.online = !0),
              (x.teller = !0),
              (x.merchant = !0),
              (x.visibility = 7))
            : ((x.online = !1),
              (x.teller = !1),
              (x.merchant = !1),
              (x.visibility = 0));
        },
        p = (x) => {
          ((x.visibility = i(x.online, x.teller, x.merchant)),
            (x.all = x.online && x.teller && x.merchant));
        },
        b = () => {
          const x = {
            route_id: o.selectedRoute.route_id,
            portA: f.value.map((A) => ({
              sched_id: A.sched_id,
              visibility: A.visibility,
            })),
            portB: c.value.map((A) => ({
              sched_id: A.sched_id,
              visibility: A.visibility,
            })),
          };
          n("save", x);
        };
      return (x, A) => (
        m(),
        g(
          "div",
          {
            class:
              "fixed inset-0 bg-black/30 flex items-center justify-center z-50",
            onClick: A[2] || (A[2] = Se((v) => x.$emit("close"), ["self"])),
          },
          [
            s("div", Uv, [
              s(
                "button",
                {
                  onClick: A[0] || (A[0] = (v) => x.$emit("close")),
                  class:
                    "absolute top-4 right-4 text-gray-400 hover:text-gray-600",
                },
                [
                  ...(A[3] ||
                    (A[3] = [
                      s(
                        "svg",
                        {
                          class: "w-6 h-6",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24",
                        },
                        [
                          s("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M6 18L18 6M6 6l12 12",
                          }),
                        ],
                        -1,
                      ),
                    ])),
                ],
              ),
              s("h2", Dv, w(l.value), 1),
              s("div", Fv, [
                s("div", Hv, [
                  s("div", zv, [
                    s("div", Qv, w(r.value), 1),
                    s("table", Kv, [
                      A[4] ||
                        (A[4] = s(
                          "thead",
                          null,
                          [
                            s("tr", { class: "border-b border-gray-200" }, [
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-sm font-medium text-gray-700",
                                },
                                " Departure ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-sm font-medium text-gray-700",
                                },
                                " Arrival ",
                              ),
                            ]),
                          ],
                          -1,
                        )),
                      s("tbody", null, [
                        (m(!0),
                        g(
                          q,
                          null,
                          le(
                            f.value,
                            (v, S) => (
                              m(),
                              g(
                                "tr",
                                {
                                  key: `portA-time-${S}`,
                                  class: "border-b border-gray-200",
                                },
                                [
                                  s("td", Yv, w(v.departure_time), 1),
                                  s("td", Jv, w(v.arrival_time || "N/A"), 1),
                                ],
                              )
                            ),
                          ),
                          128,
                        )),
                      ]),
                    ]),
                  ]),
                  s("div", qv, [
                    A[6] ||
                      (A[6] = s(
                        "div",
                        {
                          class:
                            "bg-gray-200 px-4 py-3 font-semibold text-gray-700 text-center",
                        },
                        " Options ",
                        -1,
                      )),
                    s("table", Gv, [
                      A[5] ||
                        (A[5] = s(
                          "thead",
                          null,
                          [
                            s("tr", { class: "border-b border-gray-200" }, [
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-center text-sm font-medium text-gray-700",
                                },
                                " Online ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-center text-sm font-medium text-gray-700",
                                },
                                " Teller ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-center text-sm font-medium text-gray-700",
                                },
                                " Merchant ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-center text-sm font-medium text-gray-700",
                                },
                                " All ",
                              ),
                            ]),
                          ],
                          -1,
                        )),
                      s("tbody", null, [
                        (m(!0),
                        g(
                          q,
                          null,
                          le(
                            f.value,
                            (v, S) => (
                              m(),
                              g(
                                "tr",
                                {
                                  key: `portA-opts-${S}`,
                                  class: "border-b border-gray-200",
                                },
                                [
                                  s("td", Zv, [
                                    oe(
                                      s(
                                        "input",
                                        {
                                          "onUpdate:modelValue": (_) =>
                                            (v.online = _),
                                          onChange: (_) => p(v),
                                          type: "checkbox",
                                          class:
                                            "w-4 h-4 text-blue-600 border-gray-300 rounded-md focus:ring-blue-500",
                                        },
                                        null,
                                        40,
                                        Wv,
                                      ),
                                      [[We, v.online]],
                                    ),
                                  ]),
                                  s("td", Xv, [
                                    oe(
                                      s(
                                        "input",
                                        {
                                          "onUpdate:modelValue": (_) =>
                                            (v.teller = _),
                                          onChange: (_) => p(v),
                                          type: "checkbox",
                                          class:
                                            "w-4 h-4 text-blue-600 border-gray-300 rounded-md focus:ring-blue-500",
                                        },
                                        null,
                                        40,
                                        e1,
                                      ),
                                      [[We, v.teller]],
                                    ),
                                  ]),
                                  s("td", t1, [
                                    oe(
                                      s(
                                        "input",
                                        {
                                          "onUpdate:modelValue": (_) =>
                                            (v.merchant = _),
                                          onChange: (_) => p(v),
                                          type: "checkbox",
                                          class:
                                            "w-4 h-4 text-blue-600 border-gray-300 rounded-md focus:ring-blue-500",
                                        },
                                        null,
                                        40,
                                        s1,
                                      ),
                                      [[We, v.merchant]],
                                    ),
                                  ]),
                                  s("td", o1, [
                                    oe(
                                      s(
                                        "input",
                                        {
                                          "onUpdate:modelValue": (_) =>
                                            (v.all = _),
                                          onChange: (_) => d(v),
                                          type: "checkbox",
                                          class:
                                            "w-4 h-4 text-blue-600 border-gray-300 rounded-md focus:ring-blue-500",
                                        },
                                        null,
                                        40,
                                        n1,
                                      ),
                                      [[We, v.all]],
                                    ),
                                  ]),
                                ],
                              )
                            ),
                          ),
                          128,
                        )),
                      ]),
                    ]),
                  ]),
                ]),
                s("div", l1, [
                  s("div", r1, [
                    s("div", a1, w(a.value), 1),
                    s("table", i1, [
                      A[7] ||
                        (A[7] = s(
                          "thead",
                          null,
                          [
                            s("tr", { class: "border-b border-gray-200" }, [
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-sm font-medium text-gray-700",
                                },
                                " Departure ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-sm font-medium text-gray-700",
                                },
                                " Arrival ",
                              ),
                            ]),
                          ],
                          -1,
                        )),
                      s("tbody", null, [
                        (m(!0),
                        g(
                          q,
                          null,
                          le(
                            c.value,
                            (v, S) => (
                              m(),
                              g(
                                "tr",
                                {
                                  key: `portB-time-${S}`,
                                  class: "border-b border-gray-200",
                                },
                                [
                                  s("td", d1, w(v.departure_time), 1),
                                  s("td", u1, w(v.arrival_time || "N/A"), 1),
                                ],
                              )
                            ),
                          ),
                          128,
                        )),
                      ]),
                    ]),
                  ]),
                  s("div", c1, [
                    A[9] ||
                      (A[9] = s(
                        "div",
                        {
                          class:
                            "bg-gray-200 px-4 py-3 font-semibold text-gray-700 text-center",
                        },
                        " Options ",
                        -1,
                      )),
                    s("table", f1, [
                      A[8] ||
                        (A[8] = s(
                          "thead",
                          null,
                          [
                            s("tr", { class: "border-b border-gray-200" }, [
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-center text-sm font-medium text-gray-700",
                                },
                                " Online ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-center text-sm font-medium text-gray-700",
                                },
                                " Teller ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-center text-sm font-medium text-gray-700",
                                },
                                " Merchant ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-center text-sm font-medium text-gray-700",
                                },
                                " All ",
                              ),
                            ]),
                          ],
                          -1,
                        )),
                      s("tbody", null, [
                        (m(!0),
                        g(
                          q,
                          null,
                          le(
                            c.value,
                            (v, S) => (
                              m(),
                              g(
                                "tr",
                                {
                                  key: `portB-opts-${S}`,
                                  class: "border-b border-gray-200",
                                },
                                [
                                  s("td", p1, [
                                    oe(
                                      s(
                                        "input",
                                        {
                                          "onUpdate:modelValue": (_) =>
                                            (v.online = _),
                                          onChange: (_) => p(v),
                                          type: "checkbox",
                                          class:
                                            "w-4 h-4 text-blue-600 border-gray-300 rounded-md focus:ring-blue-500",
                                        },
                                        null,
                                        40,
                                        m1,
                                      ),
                                      [[We, v.online]],
                                    ),
                                  ]),
                                  s("td", g1, [
                                    oe(
                                      s(
                                        "input",
                                        {
                                          "onUpdate:modelValue": (_) =>
                                            (v.teller = _),
                                          onChange: (_) => p(v),
                                          type: "checkbox",
                                          class:
                                            "w-4 h-4 text-blue-600 border-gray-300 rounded-md focus:ring-blue-500",
                                        },
                                        null,
                                        40,
                                        v1,
                                      ),
                                      [[We, v.teller]],
                                    ),
                                  ]),
                                  s("td", h1, [
                                    oe(
                                      s(
                                        "input",
                                        {
                                          "onUpdate:modelValue": (_) =>
                                            (v.merchant = _),
                                          onChange: (_) => p(v),
                                          type: "checkbox",
                                          class:
                                            "w-4 h-4 text-blue-600 border-gray-300 rounded-md focus:ring-blue-500",
                                        },
                                        null,
                                        40,
                                        b1,
                                      ),
                                      [[We, v.merchant]],
                                    ),
                                  ]),
                                  s("td", y1, [
                                    oe(
                                      s(
                                        "input",
                                        {
                                          "onUpdate:modelValue": (_) =>
                                            (v.all = _),
                                          onChange: (_) => d(v),
                                          type: "checkbox",
                                          class:
                                            "w-4 h-4 text-blue-600 border-gray-300 rounded-md focus:ring-blue-500",
                                        },
                                        null,
                                        40,
                                        x1,
                                      ),
                                      [[We, v.all]],
                                    ),
                                  ]),
                                ],
                              )
                            ),
                          ),
                          128,
                        )),
                      ]),
                    ]),
                  ]),
                ]),
              ]),
              s("div", _1, [
                s(
                  "button",
                  {
                    onClick: A[1] || (A[1] = (v) => x.$emit("close")),
                    type: "button",
                    class:
                      "px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium",
                  },
                  " Cancel ",
                ),
                s(
                  "button",
                  {
                    onClick: b,
                    type: "button",
                    class:
                      "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2",
                  },
                  [
                    ...(A[10] ||
                      (A[10] = [
                        s(
                          "svg",
                          {
                            class: "w-3 h-3",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                          },
                          [
                            s("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M5 13l4 4L19 7",
                            }),
                          ],
                          -1,
                        ),
                        ye(" Save Changes ", -1),
                      ])),
                  ],
                ),
              ]),
            ]),
          ],
        )
      );
    },
  },
  k1 = { class: "min-h-full bg-gray-50 p-6" },
  A1 = { class: "mb-6" },
  C1 = { class: "flex justify-between items-center" },
  $1 = { class: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" },
  S1 = { class: "bg-white rounded-lg p-6 shadow-sm" },
  M1 = { class: "text-3xl font-bold text-gray-900 mb-1" },
  R1 = { class: "text-sm text-gray-500" },
  E1 = { class: "bg-white rounded-lg p-6 shadow-sm" },
  T1 = { class: "flex items-center justify-between mb-4" },
  B1 = { class: "text-3xl font-bold text-gray-900 mb-1" },
  P1 = { class: "bg-white rounded-lg p-6 shadow-sm" },
  I1 = { class: "flex items-center justify-between mb-4" },
  j1 = { class: "text-3xl font-bold text-gray-900 mb-1" },
  L1 = {
    class:
      "border border-gray-300 mb-2 rounded-lg bg-gray-200 inline-block mb-8",
  },
  O1 = { class: "flex space-x-4 px-2 py-2" },
  V1 = ["onClick"],
  N1 = { class: "" },
  U1 = { class: "grid grid-cols-3 gap-6" },
  D1 = { class: "col-span-1 border border-gray-300 bg-white rounded-lg" },
  F1 = { class: "flex items-center mb-4 py-2 px-4" },
  H1 = { class: "relative w-full" },
  z1 = { key: 0, class: "flex justify-center items-center py-8" },
  Q1 = { key: 1, class: "overflow-auto max-h-[400px] px-4 py-2" },
  K1 = { class: "min-w-full" },
  Y1 = { class: "bg-white divide-y divide-gray-200" },
  J1 = ["onClick"],
  q1 = { class: "px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-bold" },
  G1 = { class: "px-4 py-4 whitespace-nowrap text-sm" },
  Z1 = { class: "px-4 py-4 whitespace-nowrap text-sm text-gray-900" },
  W1 = { class: "col-span-2 bg-white rounded-lg border border-gray-200" },
  X1 = {
    class:
      "flex justify-between items-center mb-2 px-4 py-3 border-b border-gray-200 mb-4",
  },
  eh = { class: "text-lg font-medium text-gray-900" },
  th = { key: 0, class: "flex gap-2" },
  sh = { class: "rounded-lg p-6 min-h-[200px]" },
  oh = { key: 0, class: "w-full grid grid-cols-2 gap-4" },
  nh = { class: "min-w-full bg-white rounded-b-lg" },
  lh = {
    class:
      "text-sm text-center py-2 border-gray-400 bg-gray-200 rounded-tl-lg rounded-tr-lg",
    colspan: 3,
  },
  rh = {
    class:
      "px-4 py-2 text-sm border-l border-r border-t border-b border-gray-200",
  },
  ah = {
    class:
      "px-4 py-2 text-sm border-l border-r border-t border-b border-gray-200",
  },
  ih = ["value", "onChange"],
  dh = ["value"],
  uh = ["onClick"],
  ch = { key: 0 },
  fh = { class: "min-w-full bg-white rounded-b-lg" },
  ph = {
    class:
      "text-sm text-center py-2 border-gray-400 bg-gray-200 rounded-tl-lg rounded-tr-lg",
    colspan: 3,
  },
  mh = {
    class:
      "px-4 py-2 text-sm border-l border-r border-t border-b border-gray-200",
  },
  gh = {
    class:
      "px-4 py-2 text-sm border-l border-r border-t border-b border-gray-200",
  },
  vh = ["value", "onChange"],
  hh = ["value"],
  bh = ["onClick"],
  yh = { key: 0 },
  xh = {
    key: 1,
    class: "flex items-center justify-center h-full text-gray-500",
  },
  _h = {
    __name: "ScheduleModule",
    setup(e) {
      const t = "https://fastcat-book.dev/api",
        o = $("all"),
        n = $(""),
        l = $(!1),
        r = $(null),
        a = $([]),
        u = [
          { id: "all", name: "All Routes" },
          { id: "active", name: "Active Schedules" },
          { id: "closed", name: "Closed Route" },
        ],
        i = $([]),
        f = (Q) =>
          Q && String(Q).toLowerCase() === "active" ? "active" : "inactive",
        c = (Q) =>
          Q?.status
            ? f(Q.status)
            : [
                  ...(Q?.portA?.schedules || []),
                  ...(Q?.portB?.schedules || []),
                ].some((H) => String(H?.status).toLowerCase() === "active")
              ? "active"
              : "inactive",
        d = pe(() =>
          i.value.reduce(
            (Q, U) =>
              Q +
              (U.portA?.schedules?.length || 0) +
              (U.portB?.schedules?.length || 0),
            0,
          ),
        ),
        p = pe(() => i.value.filter((Q) => Q.status === "active").length),
        b = pe(() => i.value.filter((Q) => Q.status !== "active").length),
        x = pe(() => {
          let Q = i.value;
          if (
            (o.value === "active"
              ? (Q = Q.filter((U) => U.status === "active"))
              : o.value === "closed" &&
                (Q = Q.filter((U) => U.status !== "active")),
            n.value)
          ) {
            const U = n.value.toLowerCase();
            Q = Q.filter(
              (H) =>
                H.portA?.port_name?.toLowerCase().includes(U) ||
                H.portB?.port_name?.toLowerCase().includes(U) ||
                H.route_id?.toString().includes(U),
            );
          }
          return Q;
        }),
        A = async () => {
          l.value = !0;
          try {
            const Q = localStorage.getItem("token"),
              U = await fetch(`${t}/routes/with-schedules`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: Q,
                },
              }),
              H = await U.json();
            if (U.ok && H.success && H.data?.routes) {
              if (
                ((i.value = H.data.routes.map((ee) => ({
                  route_id: ee.route_id,
                  portA: ee.portA,
                  portB: ee.portB,
                  status: c(ee),
                }))),
                r.value)
              ) {
                const ee = String(r.value.route_id ?? ""),
                  me = i.value.find((Le) => String(Le.route_id ?? "") === ee);
                r.value = me || null;
              }
            } else
              ((i.value = []),
                console.error("Failed to fetch routes:", H.message || H));
          } catch (Q) {
            ((i.value = []),
              console.error("Network error fetching routes:", Q));
          } finally {
            l.value = !1;
          }
        },
        v = async () => {
          try {
            const Q = localStorage.getItem("token"),
              U = await fetch(`${t}/vessels`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: Q,
                },
              }),
              H = await U.json();
            U.ok && H.success && H.data?.vessels
              ? (a.value = H.data.vessels.map((ee) => ({
                  id: ee.id,
                  name: ee.vessel_name,
                  status: ee.status,
                })))
              : ((a.value = []),
                console.error("Failed to fetch vessels:", H.message || H));
          } catch (Q) {
            ((a.value = []),
              console.error("Network error fetching vessels:", Q));
          }
        };
      De(() => {
        (A(), v());
      });
      const S = async (Q) => {
          r.value = Q;
        },
        _ = async (Q, U) => {
          console.log("handleVesselChange called with:", {
            scheduleId: Q,
            vesselId: U,
            vesselIdType: typeof U,
          });
          const H = U === "" || U === null ? null : Number(U);
          if (H !== null && Number.isNaN(H)) {
            console.error("Invalid vessel id:", U);
            return;
          }
          try {
            const ee = localStorage.getItem("token"),
              me = { vessel_id: H };
            (console.log("Request payload:", me),
              console.log("API endpoint:", `${t}/schedules/${Q}`));
            const Le = await fetch(`${t}/schedules/${Q}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: ee,
                },
                body: JSON.stringify(me),
              }),
              Oe = await Le.json();
            (console.log("Response data:", Oe),
              Le.ok && Oe.success
                ? await A()
                : (console.error("Failed to update vessel:", Oe.message || Oe),
                  alert("Failed to update vessel assignment")));
          } catch (ee) {
            (console.error("Network error updating vessel:", ee),
              alert("Network error updating vessel assignment"));
          }
        },
        C = async (Q, U) => {
          try {
            const H = localStorage.getItem("token"),
              me = String(U).toLowerCase() === "active" ? "inactive" : "active",
              Le = { status: me };
            console.log("Toggling status:", {
              scheduleId: Q,
              currentStatus: U,
              newStatus: me,
            });
            const Oe = await fetch(`${t}/schedules/${Q}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: H,
                },
                body: JSON.stringify(Le),
              }),
              Ve = await Oe.json();
            (console.log("Response data:", Ve),
              Oe.ok && Ve.success
                ? await A()
                : (console.error("Failed to update status:", Ve.message || Ve),
                  alert("Failed to update schedule status")));
          } catch (H) {
            (console.error("Network error updating status:", H),
              alert("Network error updating schedule status"));
          }
        },
        k = $(!1),
        T = $(!1),
        B = $("create"),
        F = $(""),
        de = $([{ departure: "", arrival: "" }]),
        re = $([{ departure: "", arrival: "" }]),
        ge = () => {
          ((B.value = "create"),
            (F.value = ""),
            (de.value = [{ departure: "", arrival: "" }]),
            (re.value = [{ departure: "", arrival: "" }]),
            (k.value = !0));
        },
        he = () => {
          r.value &&
            ((B.value = "edit"),
            (F.value = r.value.route_id),
            (de.value = (r.value.portA?.schedules || []).map((Q) => ({
              sched_id: Q.sched_id,
              departure: Q.departure_time || "",
              arrival: Q.arrival_time || "",
              vessel: Q.vessel?.id || Q.vessel || "",
            }))),
            (re.value = (r.value.portB?.schedules || []).map((Q) => ({
              sched_id: Q.sched_id,
              departure: Q.departure_time || "",
              arrival: Q.arrival_time || "",
              vessel: Q.vessel?.id || Q.vessel || "",
            }))),
            (k.value = !0));
        },
        X = (Q) => {
          r.value && A();
        },
        xe = async (Q) => {
          try {
            const U = localStorage.getItem("token");
            for (const H of Q.portA) {
              const ee = await fetch(`${t}/schedules/${H.sched_id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: U,
                  },
                  body: JSON.stringify({ visibility: H.visibility }),
                }),
                me = await ee.json();
              ee.ok || console.error("Failed to update schedule:", me);
            }
            for (const H of Q.portB) {
              const ee = await fetch(`${t}/schedules/${H.sched_id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: U,
                  },
                  body: JSON.stringify({ visibility: H.visibility }),
                }),
                me = await ee.json();
              ee.ok || console.error("Failed to update schedule:", me);
            }
            ((T.value = !1), await A());
          } catch (U) {
            (console.error("Error saving schedule options:", U),
              alert("Failed to save schedule options"));
          }
        };
      return (Q, U) => (
        m(),
        g(
          q,
          null,
          [
            Y(
              Ie,
              { name: "modal-fade" },
              {
                default: $e(() => [
                  k.value
                    ? (m(),
                      ke(
                        Nv,
                        {
                          key: 0,
                          routes: i.value,
                          selectedRouteId: F.value,
                          portASchedules: de.value,
                          portBSchedules: re.value,
                          mode: B.value,
                          "onUpdate:selectedRouteId":
                            U[0] || (U[0] = (H) => (F.value = H)),
                          onClose: U[1] || (U[1] = (H) => (k.value = !1)),
                          onSave: X,
                        },
                        null,
                        8,
                        [
                          "routes",
                          "selectedRouteId",
                          "portASchedules",
                          "portBSchedules",
                          "mode",
                        ],
                      ))
                    : K("", !0),
                ]),
                _: 1,
              },
            ),
            Y(
              Ie,
              { name: "modal-fade" },
              {
                default: $e(() => [
                  T.value && r.value
                    ? (m(),
                      ke(
                        w1,
                        {
                          key: 0,
                          selectedRoute: r.value,
                          onClose: U[2] || (U[2] = (H) => (T.value = !1)),
                          onSave: xe,
                        },
                        null,
                        8,
                        ["selectedRoute"],
                      ))
                    : K("", !0),
                ]),
                _: 1,
              },
            ),
            s("div", k1, [
              s("div", A1, [
                U[7] ||
                  (U[7] = s(
                    "nav",
                    { class: "text-sm text-gray-500 mb-2" },
                    [
                      s("span", null, "Dashboard"),
                      s("span", { class: "mx-2" }, ">"),
                      s(
                        "span",
                        { class: "text-gray-900" },
                        "Schedule Management",
                      ),
                    ],
                    -1,
                  )),
                s("div", C1, [
                  U[6] ||
                    (U[6] = s(
                      "h1",
                      { class: "text-2xl font-semibold text-gray-900" },
                      " Schedule Management ",
                      -1,
                    )),
                  s(
                    "button",
                    {
                      onClick: ge,
                      type: "button",
                      class:
                        "bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2 cursor-pointer",
                    },
                    [
                      Y(ie(Yt), { class: "w-4 h-4" }),
                      U[5] || (U[5] = ye(" Create ", -1)),
                    ],
                  ),
                ]),
              ]),
              s("div", $1, [
                s("div", S1, [
                  U[8] ||
                    (U[8] = s(
                      "div",
                      { class: "flex items-center justify-between mb-4" },
                      [
                        s(
                          "h3",
                          { class: "text-sm font-medium text-gray-600" },
                          "Total Schedules",
                        ),
                      ],
                      -1,
                    )),
                  s("div", M1, w(d.value), 1),
                  s("p", R1, w(b.value) + " closed routes as of today ", 1),
                ]),
                s("div", E1, [
                  s("div", T1, [
                    U[9] ||
                      (U[9] = s(
                        "h3",
                        { class: "text-sm font-medium text-gray-600" },
                        "Active Schedules",
                        -1,
                      )),
                    Y(ie(Io), { class: "w-5 h-5 text-blue-600" }),
                  ]),
                  s("div", B1, w(p.value), 1),
                  U[10] ||
                    (U[10] = s(
                      "p",
                      { class: "text-sm text-gray-500" },
                      "Across all available routes",
                      -1,
                    )),
                ]),
                s("div", P1, [
                  s("div", I1, [
                    U[11] ||
                      (U[11] = s(
                        "h3",
                        { class: "text-sm font-medium text-gray-600" },
                        "Inactive Routes",
                        -1,
                      )),
                    Y(ie(qs), { class: "w-5 h-5 text-blue-600" }),
                  ]),
                  s("div", j1, w(b.value), 1),
                  U[12] ||
                    (U[12] = s(
                      "p",
                      { class: "text-sm text-gray-500" },
                      "Total of inactive routes",
                      -1,
                    )),
                ]),
              ]),
              s("div", L1, [
                s("nav", O1, [
                  (m(),
                  g(
                    q,
                    null,
                    le(u, (H) =>
                      s(
                        "button",
                        {
                          key: H.id,
                          onClick: (ee) => (o.value = H.id),
                          class: Z([
                            "py-2 px-2  font-medium text-sm rounded-md",
                            o.value === H.id
                              ? "bg-white"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-bold",
                          ]),
                        },
                        w(H.name),
                        11,
                        V1,
                      ),
                    ),
                    64,
                  )),
                ]),
              ]),
              s("div", N1, [
                s("div", U1, [
                  s("div", D1, [
                    U[15] ||
                      (U[15] = s(
                        "div",
                        { class: "px-4 py-3 border-b border-gray-200 mb-4" },
                        [
                          s(
                            "h2",
                            { class: "text-lg font-medium text-gray-900" },
                            "List of Route",
                          ),
                        ],
                        -1,
                      )),
                    s("div", F1, [
                      s("div", H1, [
                        Y(ie(Bt), {
                          class:
                            "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4",
                        }),
                        oe(
                          s(
                            "input",
                            {
                              "onUpdate:modelValue":
                                U[3] || (U[3] = (H) => (n.value = H)),
                              type: "text",
                              placeholder: "Search",
                              class:
                                "pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full",
                            },
                            null,
                            512,
                          ),
                          [[be, n.value]],
                        ),
                      ]),
                    ]),
                    s("div", null, [
                      l.value
                        ? (m(),
                          g("div", z1, [
                            ...(U[13] ||
                              (U[13] = [
                                s(
                                  "div",
                                  {
                                    class:
                                      "flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg",
                                  },
                                  [
                                    s("span", {
                                      class:
                                        "inline-block w-6 h-6 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                                    }),
                                    s(
                                      "span",
                                      {
                                        class:
                                          "font-semibold text-blue-700 text-base",
                                      },
                                      "Loading routes...",
                                    ),
                                  ],
                                  -1,
                                ),
                              ])),
                          ]))
                        : (m(),
                          g("div", Q1, [
                            s("table", K1, [
                              U[14] ||
                                (U[14] = s(
                                  "thead",
                                  { class: "bg-gray-50" },
                                  [
                                    s("tr", null, [
                                      s(
                                        "th",
                                        {
                                          class:
                                            "px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-l-lg rounded-bl-lg",
                                        },
                                        " # ",
                                      ),
                                      s(
                                        "th",
                                        {
                                          class:
                                            "px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                        },
                                        " Route ",
                                      ),
                                      s(
                                        "th",
                                        {
                                          class:
                                            "px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-br-lg rounded-tr-lg",
                                        },
                                        " Schedules ",
                                      ),
                                    ]),
                                  ],
                                  -1,
                                )),
                              s("tbody", Y1, [
                                (m(!0),
                                g(
                                  q,
                                  null,
                                  le(
                                    x.value,
                                    (H, ee) => (
                                      m(),
                                      g(
                                        "tr",
                                        {
                                          key: H.route_id,
                                          class: Z([
                                            "hover:bg-gray-50 cursor-pointer",
                                            {
                                              "bg-blue-50":
                                                r.value &&
                                                r.value.route_id === H.route_id,
                                            },
                                          ]),
                                          onClick: (me) => S(H),
                                        },
                                        [
                                          s("td", q1, w(ee + 1), 1),
                                          s("td", G1, [
                                            s(
                                              "span",
                                              {
                                                class: Z(
                                                  r.value &&
                                                    r.value.route_id ===
                                                      H.route_id
                                                    ? "text-blue-600 font-bold underline"
                                                    : "text-gray-900",
                                                ),
                                              },
                                              w(H.portA?.port_name) +
                                                " - " +
                                                w(H.portB?.port_name),
                                              3,
                                            ),
                                          ]),
                                          s(
                                            "td",
                                            Z1,
                                            w(
                                              (H.portA?.schedules?.length ||
                                                0) +
                                                (H.portB?.schedules?.length ||
                                                  0),
                                            ),
                                            1,
                                          ),
                                        ],
                                        10,
                                        J1,
                                      )
                                    ),
                                  ),
                                  128,
                                )),
                              ]),
                            ]),
                          ])),
                    ]),
                  ]),
                  s("div", W1, [
                    s("div", X1, [
                      s(
                        "h2",
                        eh,
                        w(
                          r.value
                            ? (r.value.portA?.port_name || "") +
                                " - " +
                                (r.value.portB?.port_name || "")
                            : "No route selected",
                        ),
                        1,
                      ),
                      r.value
                        ? (m(),
                          g("div", th, [
                            s(
                              "button",
                              {
                                onClick: he,
                                class:
                                  "flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium",
                              },
                              [
                                Y(ie(ls), { class: "w-4 h-4" }),
                                U[16] || (U[16] = ye(" Edit ", -1)),
                              ],
                            ),
                            s(
                              "button",
                              {
                                onClick: U[4] || (U[4] = (H) => (T.value = !0)),
                                class:
                                  "flex items-center gap-1 text-gray-600 hover:underline text-sm font-medium",
                              },
                              [
                                Y(ie(Gd), { class: "w-4 h-4" }),
                                U[17] || (U[17] = ye(" Options ", -1)),
                              ],
                            ),
                          ]))
                        : K("", !0),
                    ]),
                    s("div", sh, [
                      r.value
                        ? (m(),
                          g("div", oh, [
                            s("table", nh, [
                              s("thead", null, [
                                s("tr", null, [
                                  s(
                                    "th",
                                    lh,
                                    w(r.value.portA?.port_name || "Port A"),
                                    1,
                                  ),
                                ]),
                                U[18] ||
                                  (U[18] = s(
                                    "tr",
                                    null,
                                    [
                                      s(
                                        "th",
                                        {
                                          class:
                                            "px-4 py-2 text-xs text-gray-500 text-left border-l border-r border-t border-b border-gray-200",
                                        },
                                        " Departure ",
                                      ),
                                      s(
                                        "th",
                                        {
                                          class:
                                            "px-4 py-2 text-xs text-gray-500 text-left border-l border-r border-t border-b border-gray-200",
                                        },
                                        " Vessel ",
                                      ),
                                      s(
                                        "th",
                                        {
                                          class:
                                            "px-4 py-2 text-xs text-gray-500 text-left border-l border-r border-t border-b border-gray-200",
                                        },
                                        " Status ",
                                      ),
                                    ],
                                    -1,
                                  )),
                              ]),
                              s("tbody", null, [
                                (m(!0),
                                g(
                                  q,
                                  null,
                                  le(
                                    r.value.portA?.schedules || [],
                                    (H) => (
                                      m(),
                                      g("tr", { key: H.sched_id }, [
                                        s("td", rh, w(H.departure_time), 1),
                                        s("td", ah, [
                                          s(
                                            "select",
                                            {
                                              value: H.vessel?.id ?? "",
                                              onChange: (ee) =>
                                                _(H.sched_id, ee.target.value),
                                              class:
                                                "w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                                            },
                                            [
                                              U[19] ||
                                                (U[19] = s(
                                                  "option",
                                                  { value: "" },
                                                  "Select Vessel",
                                                  -1,
                                                )),
                                              (m(!0),
                                              g(
                                                q,
                                                null,
                                                le(
                                                  a.value,
                                                  (ee) => (
                                                    m(),
                                                    g(
                                                      "option",
                                                      {
                                                        key: ee.id,
                                                        value: ee.id,
                                                      },
                                                      w(ee.name),
                                                      9,
                                                      dh,
                                                    )
                                                  ),
                                                ),
                                                128,
                                              )),
                                            ],
                                            40,
                                            ih,
                                          ),
                                        ]),
                                        s(
                                          "td",
                                          {
                                            onClick: (ee) =>
                                              C(H.sched_id, H.status),
                                            class:
                                              "px-4 py-2 text-sm capitalize border-l border-r border-t border-b border-gray-200 cursor-pointer hover:bg-gray-100",
                                          },
                                          [
                                            s(
                                              "span",
                                              {
                                                class: Z([
                                                  "px-2 py-1 rounded-full text-xs font-medium",
                                                  String(
                                                    H.status,
                                                  ).toLowerCase() === "active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800",
                                                ]),
                                              },
                                              w(H.status),
                                              3,
                                            ),
                                          ],
                                          8,
                                          uh,
                                        ),
                                      ])
                                    ),
                                  ),
                                  128,
                                )),
                                r.value.portA?.schedules?.length
                                  ? K("", !0)
                                  : (m(),
                                    g("tr", ch, [
                                      ...(U[20] ||
                                        (U[20] = [
                                          s(
                                            "td",
                                            {
                                              colspan: "3",
                                              class:
                                                "text-gray-400 text-center py-2",
                                            },
                                            " No schedules ",
                                            -1,
                                          ),
                                        ])),
                                    ])),
                              ]),
                            ]),
                            s("table", fh, [
                              s("thead", null, [
                                s("tr", null, [
                                  s(
                                    "th",
                                    ph,
                                    w(r.value.portB?.port_name || "Port B"),
                                    1,
                                  ),
                                ]),
                                U[21] ||
                                  (U[21] = s(
                                    "tr",
                                    null,
                                    [
                                      s(
                                        "th",
                                        {
                                          class:
                                            "px-4 py-2 text-xs text-gray-500 text-left border-l border-r border-t border-b border-gray-200",
                                        },
                                        " Departure ",
                                      ),
                                      s(
                                        "th",
                                        {
                                          class:
                                            "px-4 py-2 text-xs text-gray-500 text-left border-l border-r border-t border-b border-gray-200",
                                        },
                                        " Vessel ",
                                      ),
                                      s(
                                        "th",
                                        {
                                          class:
                                            "px-4 py-2 text-xs text-gray-500 text-left border-l border-r border-t border-b border-gray-200",
                                        },
                                        " Status ",
                                      ),
                                    ],
                                    -1,
                                  )),
                              ]),
                              s("tbody", null, [
                                (m(!0),
                                g(
                                  q,
                                  null,
                                  le(
                                    r.value.portB?.schedules || [],
                                    (H) => (
                                      m(),
                                      g("tr", { key: H.sched_id }, [
                                        s("td", mh, w(H.departure_time), 1),
                                        s("td", gh, [
                                          s(
                                            "select",
                                            {
                                              value: H.vessel?.id ?? "",
                                              onChange: (ee) =>
                                                _(H.sched_id, ee.target.value),
                                              class:
                                                "w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                                            },
                                            [
                                              U[22] ||
                                                (U[22] = s(
                                                  "option",
                                                  { value: "" },
                                                  "Select Vessel",
                                                  -1,
                                                )),
                                              (m(!0),
                                              g(
                                                q,
                                                null,
                                                le(
                                                  a.value,
                                                  (ee) => (
                                                    m(),
                                                    g(
                                                      "option",
                                                      {
                                                        key: ee.id,
                                                        value: ee.id,
                                                      },
                                                      w(ee.name),
                                                      9,
                                                      hh,
                                                    )
                                                  ),
                                                ),
                                                128,
                                              )),
                                            ],
                                            40,
                                            vh,
                                          ),
                                        ]),
                                        s(
                                          "td",
                                          {
                                            onClick: (ee) =>
                                              C(H.sched_id, H.status),
                                            class:
                                              "px-4 py-2 text-sm capitalize border-l border-r border-t border-b border-gray-200 cursor-pointer hover:bg-gray-100",
                                          },
                                          [
                                            s(
                                              "span",
                                              {
                                                class: Z([
                                                  "px-2 py-1 rounded-full text-xs font-medium",
                                                  String(
                                                    H.status,
                                                  ).toLowerCase() === "active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800",
                                                ]),
                                              },
                                              w(H.status),
                                              3,
                                            ),
                                          ],
                                          8,
                                          bh,
                                        ),
                                      ])
                                    ),
                                  ),
                                  128,
                                )),
                                r.value.portB?.schedules?.length
                                  ? K("", !0)
                                  : (m(),
                                    g("tr", yh, [
                                      ...(U[23] ||
                                        (U[23] = [
                                          s(
                                            "td",
                                            {
                                              colspan: "3",
                                              class:
                                                "text-gray-400 text-center py-2",
                                            },
                                            " No schedules ",
                                            -1,
                                          ),
                                        ])),
                                    ])),
                              ]),
                            ]),
                          ]))
                        : (m(),
                          g("div", xh, [
                            ...(U[24] ||
                              (U[24] = [
                                s("span", null, "No route selected.", -1),
                              ])),
                          ])),
                    ]),
                  ]),
                ]),
              ]),
            ]),
          ],
          64,
        )
      );
    },
  },
  wh = {
    key: 0,
    class:
      "fixed top-6 right-6 z-[100] flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg",
  },
  kh = {
    class: "flex items-center justify-between p-6 border-b border-gray-200",
  },
  Ah = ["value"],
  Ch = ["value"],
  $h = {
    class: "flex items-center justify-end gap-3 pt-6 border-t border-gray-200",
  },
  Sh = ["disabled"],
  Mh = { key: 0, class: "flex items-center gap-2" },
  Rh = { key: 1 },
  Eh = { key: 0, class: "text-red-500 text-sm mt-2 text-center" },
  Th = {
    __name: "ModalCreateRoute",
    emits: ["save", "close"],
    setup(e, { emit: t }) {
      const o = t,
        n = "https://fastcat-book.dev/api",
        l = $(!1),
        r = $(""),
        a = $([]),
        u = $({ port_a_id: "", port_b_id: "" });
      De(async () => {
        try {
          const f = localStorage.getItem("token"),
            c = await fetch(`${n}/ports`, {
              headers: { "Content-Type": "application/json", Authorization: f },
            }),
            d = await c.json();
          c.ok && d.success && d.data?.ports
            ? (a.value = d.data.ports)
            : ((a.value = []),
              console.error("Failed to fetch ports:", d.message || d));
        } catch (f) {
          ((a.value = []), console.error("Network error fetching ports:", f));
        }
      });
      const i = async () => {
        ((r.value = ""), (l.value = !0));
        try {
          const f = localStorage.getItem("token"),
            c = { port_a_id: u.value.port_a_id, port_b_id: u.value.port_b_id };
          console.log("Sending route payload:", JSON.stringify(c));
          const d = await fetch(`${n}/routes`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: f },
              body: JSON.stringify(c),
            }),
            p = await d.json();
          d.ok && p.success
            ? (o("save", { ...c }),
              (u.value = { port_a_id: "", port_b_id: "" }),
              o("close"))
            : p.error
              ? (r.value = p.error)
              : (r.value = p.message || "Failed to save route.");
        } catch {
          r.value = "Network error. Please try again.";
        } finally {
          l.value = !1;
        }
      };
      return (f, c) => (
        m(),
        g(
          "div",
          {
            class:
              "fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50",
            onClick: c[5] || (c[5] = (d) => f.$emit("close")),
          },
          [
            l.value
              ? (m(),
                g("div", wh, [
                  ...(c[6] ||
                    (c[6] = [
                      s(
                        "span",
                        {
                          class:
                            "inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                        },
                        null,
                        -1,
                      ),
                      s(
                        "span",
                        { class: "font-semibold text-blue-700 text-base" },
                        "Saving data...",
                        -1,
                      ),
                    ])),
                ]))
              : K("", !0),
            s(
              "div",
              {
                class:
                  "modal-card bg-white rounded-lg shadow-xl w-full max-w-md mx-4",
                onClick: c[4] || (c[4] = Se(() => {}, ["stop"])),
              },
              [
                s("div", kh, [
                  c[8] ||
                    (c[8] = s(
                      "div",
                      null,
                      [
                        s(
                          "h2",
                          { class: "text-lg font-semibold text-gray-900" },
                          "Create a Route",
                        ),
                        s(
                          "p",
                          { class: "text-sm text-gray-500 mt-1" },
                          " Select origin and destination ports ",
                        ),
                      ],
                      -1,
                    )),
                  s(
                    "button",
                    {
                      onClick: c[0] || (c[0] = (d) => f.$emit("close")),
                      class:
                        "text-gray-400 hover:text-gray-600 transition-colors",
                    },
                    [
                      ...(c[7] ||
                        (c[7] = [
                          s(
                            "svg",
                            {
                              class: "w-6 h-6",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24",
                            },
                            [
                              s("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M6 18L18 6M6 6l12 12",
                              }),
                            ],
                            -1,
                          ),
                        ])),
                    ],
                  ),
                ]),
                s(
                  "form",
                  { onSubmit: Se(i, ["prevent"]), class: "p-6 space-y-6" },
                  [
                    s("div", null, [
                      c[10] ||
                        (c[10] = s(
                          "label",
                          {
                            class:
                              "block text-sm font-medium text-gray-700 mb-2",
                          },
                          " Origin Port ",
                          -1,
                        )),
                      oe(
                        s(
                          "select",
                          {
                            "onUpdate:modelValue":
                              c[1] || (c[1] = (d) => (u.value.port_a_id = d)),
                            required: "",
                            class:
                              "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                          },
                          [
                            c[9] ||
                              (c[9] = s(
                                "option",
                                { value: "", disabled: "" },
                                "Select origin port",
                                -1,
                              )),
                            (m(!0),
                            g(
                              q,
                              null,
                              le(
                                a.value,
                                (d) => (
                                  m(),
                                  g(
                                    "option",
                                    { key: d.port_id, value: d.port_id },
                                    w(d.port_name),
                                    9,
                                    Ah,
                                  )
                                ),
                              ),
                              128,
                            )),
                          ],
                          512,
                        ),
                        [[Qt, u.value.port_a_id]],
                      ),
                    ]),
                    s("div", null, [
                      c[12] ||
                        (c[12] = s(
                          "label",
                          {
                            class:
                              "block text-sm font-medium text-gray-700 mb-2",
                          },
                          " Destination Port ",
                          -1,
                        )),
                      oe(
                        s(
                          "select",
                          {
                            "onUpdate:modelValue":
                              c[2] || (c[2] = (d) => (u.value.port_b_id = d)),
                            required: "",
                            class:
                              "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                          },
                          [
                            c[11] ||
                              (c[11] = s(
                                "option",
                                { value: "", disabled: "" },
                                "Select destination port",
                                -1,
                              )),
                            (m(!0),
                            g(
                              q,
                              null,
                              le(
                                a.value,
                                (d) => (
                                  m(),
                                  g(
                                    "option",
                                    {
                                      key: d.port_id + "-dest",
                                      value: d.port_id,
                                    },
                                    w(d.port_name),
                                    9,
                                    Ch,
                                  )
                                ),
                              ),
                              128,
                            )),
                          ],
                          512,
                        ),
                        [[Qt, u.value.port_b_id]],
                      ),
                    ]),
                    s("div", $h, [
                      s(
                        "button",
                        {
                          type: "button",
                          onClick: c[3] || (c[3] = (d) => f.$emit("close")),
                          class:
                            "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
                        },
                        " Cancel ",
                      ),
                      s(
                        "button",
                        {
                          type: "submit",
                          class:
                            "px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
                          disabled: l.value,
                        },
                        [
                          l.value
                            ? (m(),
                              g("span", Mh, [
                                ...(c[13] ||
                                  (c[13] = [
                                    s(
                                      "span",
                                      {
                                        class:
                                          "inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                                      },
                                      null,
                                      -1,
                                    ),
                                    ye(" Saving... ", -1),
                                  ])),
                              ]))
                            : (m(), g("span", Rh, " Save Route ")),
                        ],
                        8,
                        Sh,
                      ),
                    ]),
                    r.value ? (m(), g("div", Eh, w(r.value), 1)) : K("", !0),
                  ],
                  32,
                ),
              ],
            ),
          ],
        )
      );
    },
  },
  Bh = { class: "min-h-full bg-gray-50 p-6" },
  Ph = { class: "mb-6" },
  Ih = { class: "flex justify-between items-center" },
  jh = { class: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" },
  Lh = { class: "bg-white rounded-lg p-6 shadow-sm" },
  Oh = { class: "text-3xl font-bold text-gray-900 mb-1" },
  Vh = { class: "text-sm text-gray-500" },
  Nh = { class: "bg-white rounded-lg p-6 shadow-sm" },
  Uh = { class: "flex items-center justify-between mb-4" },
  Dh = { class: "text-3xl font-bold text-gray-900 mb-1" },
  Fh = { class: "bg-white rounded-lg p-6 shadow-sm" },
  Hh = { class: "flex items-center justify-between mb-4" },
  zh = { class: "text-3xl font-bold text-gray-900 mb-1" },
  Qh = { class: "bg-white rounded-lg shadow-sm" },
  Kh = { class: "border-b border-gray-200" },
  Yh = { class: "flex space-x-8 px-6" },
  Jh = ["onClick"],
  qh = { class: "p-6" },
  Gh = { class: "flex items-center justify-between mb-6" },
  Zh = { class: "relative" },
  Wh = { key: 0, class: "flex justify-center items-center py-8" },
  Xh = { key: 1, class: "overflow-auto max-h-[400px]" },
  eb = { class: "min-w-full divide-y divide-gray-200" },
  tb = { class: "bg-white divide-y divide-gray-200" },
  sb = { class: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" },
  ob = { class: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" },
  nb = { class: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" },
  lb = { class: "px-6 py-4 whitespace-nowrap" },
  rb = { class: "px-6 py-4 whitespace-nowrap text-sm text-gray-500" },
  ab = { class: "px-6 py-4 whitespace-nowrap text-sm text-gray-500" },
  ib = { class: "px-6 py-4 whitespace-nowrap text-sm" },
  db = ["onClick"],
  ub = {
    __name: "RoutesModule",
    setup(e) {
      const t = "https://fastcat-book.dev/api",
        o = $(!1),
        n = $("all"),
        l = $(""),
        r = $(!1),
        a = [
          { id: "all", name: "All Routes" },
          { id: "active", name: "Active Route" },
          { id: "closed", name: "Closed Route" },
        ],
        u = $([]),
        i = pe(() => u.value.length),
        f = pe(() => u.value.filter((v) => v.status === "Active").length),
        c = pe(() => u.value.filter((v) => v.status !== "Active").length),
        d = pe(() => {
          let v = u.value;
          if (
            (n.value === "active"
              ? (v = v.filter((S) => S.status === "Active"))
              : n.value === "closed" &&
                (v = v.filter((S) => S.status !== "Active")),
            l.value)
          ) {
            const S = l.value.toLowerCase();
            v = v.filter(
              (_) =>
                _.port_a_name.toLowerCase().includes(S) ||
                _.port_b_name.toLowerCase().includes(S) ||
                _.updated_by.toLowerCase().includes(S),
            );
          }
          return v;
        }),
        p = (v) =>
          v === "Active"
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800",
        b = async () => {
          r.value = !0;
          try {
            const v = localStorage.getItem("token"),
              S = await fetch(`${t}/routes`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: v,
                },
              }),
              _ = await S.json();
            S.ok && _.success && _.data?.routes
              ? (u.value = _.data.routes.map((C, k) => ({
                  id: C.route_id || k + 1,
                  port_a_id: C.port_a_id,
                  port_b_id: C.port_b_id,
                  port_a_name: C.port_a?.port_name || "",
                  port_b_name: C.port_b?.port_name || "",
                  status: C.status || "Active",
                  updated_by: C.port_a?.last_update_by || "Unknown",
                  updated_at: C.updated_at ? C.updated_at.slice(0, 10) : "",
                })))
              : ((u.value = []),
                console.error("Failed to fetch routes:", _.message || _));
          } catch (v) {
            ((u.value = []),
              console.error("Network error fetching routes:", v));
          } finally {
            r.value = !1;
          }
        };
      De(b);
      const x = () => {
          ((o.value = !1), b());
        },
        A = (v) => {
          console.log("View route:", v);
        };
      return (v, S) => (
        m(),
        g("div", Bh, [
          s("div", Ph, [
            S[5] ||
              (S[5] = s(
                "nav",
                { class: "text-sm text-gray-500 mb-2" },
                [
                  s("span", null, "Dashboard"),
                  s("span", { class: "mx-2" }, ">"),
                  s("span", { class: "text-gray-900" }, "Routes"),
                ],
                -1,
              )),
            s("div", Ih, [
              S[4] ||
                (S[4] = s(
                  "h1",
                  { class: "text-2xl font-semibold text-gray-900" },
                  "Route Management",
                  -1,
                )),
              s(
                "button",
                {
                  onClick: S[0] || (S[0] = (_) => (o.value = !0)),
                  type: "button",
                  class:
                    "bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2 cursor-pointer",
                },
                [
                  Y(ie(Yt), { class: "w-4 h-4" }),
                  S[3] || (S[3] = ye(" Create ", -1)),
                ],
              ),
            ]),
          ]),
          s("div", jh, [
            s("div", Lh, [
              S[6] ||
                (S[6] = s(
                  "div",
                  { class: "flex items-center justify-between mb-4" },
                  [
                    s(
                      "h3",
                      { class: "text-sm font-medium text-gray-600" },
                      "Total Routes",
                    ),
                  ],
                  -1,
                )),
              s("div", Oh, w(i.value), 1),
              s("p", Vh, w(c.value) + " closed routes as of today ", 1),
            ]),
            s("div", Nh, [
              s("div", Uh, [
                S[7] ||
                  (S[7] = s(
                    "h3",
                    { class: "text-sm font-medium text-gray-600" },
                    "Active Route",
                    -1,
                  )),
                Y(ie(Io), { class: "w-5 h-5 text-blue-600" }),
              ]),
              s("div", Dh, w(f.value), 1),
              S[8] ||
                (S[8] = s(
                  "p",
                  { class: "text-sm text-gray-500" },
                  "Across all available routes",
                  -1,
                )),
            ]),
            s("div", Fh, [
              s("div", Hh, [
                S[9] ||
                  (S[9] = s(
                    "h3",
                    { class: "text-sm font-medium text-gray-600" },
                    "Inactive Route",
                    -1,
                  )),
                Y(ie(qs), { class: "w-5 h-5 text-blue-600" }),
              ]),
              s("div", zh, w(c.value), 1),
              S[10] ||
                (S[10] = s(
                  "p",
                  { class: "text-sm text-gray-500" },
                  "Total of inactive routes",
                  -1,
                )),
            ]),
          ]),
          s("div", Qh, [
            s("div", Kh, [
              s("nav", Yh, [
                (m(),
                g(
                  q,
                  null,
                  le(a, (_) =>
                    s(
                      "button",
                      {
                        key: _.id,
                        onClick: (C) => (n.value = _.id),
                        class: Z([
                          "py-4 px-1 border-b-2 font-medium text-sm",
                          n.value === _.id
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                        ]),
                      },
                      w(_.name),
                      11,
                      Jh,
                    ),
                  ),
                  64,
                )),
              ]),
            ]),
            s("div", qh, [
              s("div", Gh, [
                S[11] ||
                  (S[11] = s(
                    "h2",
                    { class: "text-lg font-medium text-gray-900" },
                    "List of Route",
                    -1,
                  )),
                s("div", Zh, [
                  Y(ie(Bt), {
                    class:
                      "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4",
                  }),
                  oe(
                    s(
                      "input",
                      {
                        "onUpdate:modelValue":
                          S[1] || (S[1] = (_) => (l.value = _)),
                        type: "text",
                        placeholder: "Search",
                        class:
                          "pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      },
                      null,
                      512,
                    ),
                    [[be, l.value]],
                  ),
                ]),
              ]),
              r.value
                ? (m(),
                  g("div", Wh, [
                    ...(S[12] ||
                      (S[12] = [
                        s(
                          "div",
                          {
                            class:
                              "flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg",
                          },
                          [
                            s("span", {
                              class:
                                "inline-block w-6 h-6 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                            }),
                            s(
                              "span",
                              {
                                class: "font-semibold text-blue-700 text-base",
                              },
                              "Loading routes...",
                            ),
                          ],
                          -1,
                        ),
                      ])),
                  ]))
                : (m(),
                  g("div", Xh, [
                    s("table", eb, [
                      S[14] ||
                        (S[14] = s(
                          "thead",
                          { class: "bg-gray-50" },
                          [
                            s("tr", null, [
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                },
                                " # ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                },
                                " Port A ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                },
                                " Port B ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                },
                                " Status ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                },
                                " Updated by ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                },
                                " Updated at ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                },
                                " Action ",
                              ),
                            ]),
                          ],
                          -1,
                        )),
                      s("tbody", tb, [
                        (m(!0),
                        g(
                          q,
                          null,
                          le(
                            d.value,
                            (_) => (
                              m(),
                              g(
                                "tr",
                                { key: _.id, class: "hover:bg-gray-50" },
                                [
                                  s("td", sb, w(_.id), 1),
                                  s("td", ob, w(_.port_a_name), 1),
                                  s("td", nb, w(_.port_b_name), 1),
                                  s("td", lb, [
                                    s(
                                      "span",
                                      {
                                        class: Z([
                                          p(_.status),
                                          "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                        ]),
                                      },
                                      w(_.status),
                                      3,
                                    ),
                                  ]),
                                  s("td", rb, w(_.updated_by), 1),
                                  s("td", ab, w(_.updated_at), 1),
                                  s("td", ib, [
                                    s(
                                      "button",
                                      {
                                        onClick: (C) => A(_),
                                        class:
                                          "font-medium text-blue-600 hover:text-blue-900 flex items-center",
                                      },
                                      [
                                        Y(ie(En), { class: "w-4 h-4 mr-1" }),
                                        S[13] || (S[13] = ye(" View ", -1)),
                                      ],
                                      8,
                                      db,
                                    ),
                                  ]),
                                ],
                              )
                            ),
                          ),
                          128,
                        )),
                      ]),
                    ]),
                  ])),
            ]),
          ]),
          Y(
            Ie,
            { name: "modal-fade" },
            {
              default: $e(() => [
                o.value
                  ? (m(),
                    ke(Th, {
                      key: 0,
                      onClose: S[2] || (S[2] = (_) => (o.value = !1)),
                      onSave: x,
                    }))
                  : K("", !0),
              ]),
              _: 1,
            },
          ),
        ])
      );
    },
  },
  cb = {
    class: "flex items-center justify-between p-6 border-b border-gray-200",
  },
  fb = { class: "flex gap-5" },
  pb = { class: "w-full" },
  mb = ["disabled"],
  gb = { class: "w-full" },
  vb = ["disabled"],
  hb = {
    class: "flex items-center justify-end gap-3 pt-6 border-t border-gray-200",
  },
  bb = ["disabled"],
  yb = { key: 0, class: "flex items-center gap-2" },
  xb = { key: 1 },
  _b = {
    __name: "ModalCreateVessel",
    emits: ["save", "close"],
    setup(e, { emit: t }) {
      const o = "https://fastcat-book.dev/api",
        n = t,
        l = $(!1),
        r = $(""),
        a = Kt({ name: "", details: "", status: "Available" }),
        u = async () => {
          if (!a.name) return alert("Enter vessel code!");
          const f = {
            vessel_name: r.value ? `${r.value}${a.name}` : a.name,
            description: a.details,
            status: "Available",
            capacity: 0,
          };
          try {
            l.value = !0;
            const c = localStorage.getItem("token"),
              d = await fetch(`${o}/vessels`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: c,
                },
                body: JSON.stringify(f),
              }),
              p = await d.json();
            d.ok && p.success
              ? (alert("Vessel created successfully!"),
                n("save", p.data),
                n("close"),
                (a.name = ""),
                (a.details = ""),
                (r.value = ""))
              : alert(p.message || "Failed to create vessel.");
          } catch (c) {
            (console.error(c), alert("Server error while creating vessel."));
          } finally {
            l.value = !1;
          }
        };
      return (i, f) => (
        m(),
        g(
          "div",
          {
            class:
              "fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50",
            onClick: f[6] || (f[6] = (c) => i.$emit("close")),
          },
          [
            s(
              "div",
              {
                class:
                  "modal-card bg-white rounded-lg shadow-xl w-full max-w-md mx-4",
                onClick: f[5] || (f[5] = Se(() => {}, ["stop"])),
              },
              [
                s("div", cb, [
                  f[7] ||
                    (f[7] = s(
                      "div",
                      null,
                      [
                        s(
                          "h2",
                          { class: "text-lg font-semibold text-gray-900" },
                          "Create Vessel",
                        ),
                        s(
                          "p",
                          { class: "text-sm text-gray-500 mt-1" },
                          " Provide basic information about the vessel ",
                        ),
                      ],
                      -1,
                    )),
                  s(
                    "button",
                    {
                      onClick: f[0] || (f[0] = (c) => i.$emit("close")),
                      class:
                        "text-gray-400 hover:text-gray-600 transition-colors",
                    },
                    " ✕ ",
                  ),
                ]),
                s(
                  "form",
                  { onSubmit: Se(u, ["prevent"]), class: "p-6 space-y-6" },
                  [
                    s("div", fb, [
                      s("div", null, [
                        f[9] ||
                          (f[9] = s(
                            "label",
                            {
                              class:
                                "block text-sm font-medium text-gray-700 mb-2",
                            },
                            " Prefix ",
                            -1,
                          )),
                        oe(
                          s(
                            "select",
                            {
                              "onUpdate:modelValue":
                                f[1] || (f[1] = (c) => (r.value = c)),
                              class:
                                "px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                            },
                            [
                              ...(f[8] ||
                                (f[8] = [
                                  s(
                                    "option",
                                    { value: "" },
                                    "Select Prefix",
                                    -1,
                                  ),
                                  s("option", { value: "FCM" }, "FCM", -1),
                                  s("option", { value: "TCM" }, "TCM", -1),
                                  s("option", { value: "AUS" }, "AUS", -1),
                                ])),
                            ],
                            512,
                          ),
                          [[Qt, r.value]],
                        ),
                      ]),
                      s("div", pb, [
                        f[10] ||
                          (f[10] = s(
                            "label",
                            {
                              class:
                                "block text-sm font-medium text-gray-700 mb-2",
                            },
                            " Vessel Code ",
                            -1,
                          )),
                        oe(
                          s(
                            "input",
                            {
                              "onUpdate:modelValue":
                                f[2] || (f[2] = (c) => (a.name = c)),
                              type: "text",
                              placeholder: "Input vessel code",
                              required: "",
                              class:
                                "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                              disabled: l.value,
                            },
                            null,
                            8,
                            mb,
                          ),
                          [[be, a.name]],
                        ),
                      ]),
                    ]),
                    s("div", gb, [
                      f[11] ||
                        (f[11] = s(
                          "label",
                          {
                            class:
                              "block text-sm font-medium text-gray-700 mb-2",
                          },
                          " Vessel Details ",
                          -1,
                        )),
                      oe(
                        s(
                          "textarea",
                          {
                            "onUpdate:modelValue":
                              f[3] || (f[3] = (c) => (a.details = c)),
                            placeholder: "Input vessel details",
                            required: "",
                            class:
                              "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                            disabled: l.value,
                          },
                          null,
                          8,
                          vb,
                        ),
                        [[be, a.details]],
                      ),
                    ]),
                    f[13] ||
                      (f[13] = Bo(
                        '<div class="w-full"><table><thead><tr><th class="w-full text-left py-2 text-sm text-gray-600"> Seat Class </th><th class="text-left px-2 text-sm text-gray-600">Aircon</th><th class="text-left px-2 text-sm text-gray-600">Wifi</th></tr></thead><tbody><tr><td colspan="3" class="py-4 text-center text-gray-500"> Seatmap will be configured after vessel creation. </td></tr></tbody></table></div>',
                        1,
                      )),
                    s("div", hb, [
                      s(
                        "button",
                        {
                          type: "button",
                          onClick: f[4] || (f[4] = (c) => i.$emit("close")),
                          class:
                            "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors",
                        },
                        " Cancel ",
                      ),
                      s(
                        "button",
                        {
                          type: "submit",
                          class:
                            "px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors",
                          disabled: l.value,
                        },
                        [
                          l.value
                            ? (m(),
                              g("span", yb, [
                                ...(f[12] ||
                                  (f[12] = [
                                    s(
                                      "span",
                                      {
                                        class:
                                          "inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                                      },
                                      null,
                                      -1,
                                    ),
                                    ye(" Saving... ", -1),
                                  ])),
                              ]))
                            : (m(), g("span", xb, "Save Vessel")),
                        ],
                        8,
                        bb,
                      ),
                    ]),
                  ],
                  32,
                ),
              ],
            ),
          ],
        )
      );
    },
  },
  wb = {
    class: "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
  },
  kb = { class: "flex items-center justify-between p-6 border-b" },
  Ab = { class: "p-6 space-y-6" },
  Cb = { key: 0 },
  $b = { key: 1 },
  Sb = { class: "grid grid-cols-[0.9fr_1.1fr] gap-6" },
  Mb = { class: "seatmap_tools h-[410px] overflow-y-auto" },
  Rb = { class: "mb-4" },
  Eb = { class: "mb-2 space-y-2" },
  Tb = ["onClick"],
  Bb = { class: "text-sm font-medium" },
  Pb = ["onClick"],
  Ib = { class: "w-full mt-4" },
  jb = ["value"],
  Lb = { key: 2, class: "grid grid-cols-2 gap-4 w-full" },
  Ob = ["disabled"],
  Vb = { key: 0 },
  Nb = { class: "flex gap-4 w-80 mb-4" },
  Ub = { class: "grid grid-cols-2 gap-4" },
  Db = ["disabled"],
  Fb = ["disabled"],
  Hb = ["disabled"],
  zb = ["disabled"],
  Qb = ["disabled"],
  Kb = ["disabled"],
  Yb = { class: "seatmap_preview border p-3 rounded-lg w-full" },
  Jb = { class: "relative h-[410px] overflow-auto" },
  qb = { key: 0, class: "text-center text-gray-500" },
  Gb = { key: 1, class: "text-center text-gray-500" },
  Zb = { key: 2, class: "relative w-full h-full" },
  Wb = ["data-row", "data-col", "onMousedown", "onMouseover", "onClick"],
  Xb = { key: 0 },
  ey = {
    key: 1,
    class: "pointer-events-none font-bold text-white",
    style: { opacity: 0.7 },
  },
  ty = { key: 2, class: "pointer-events-none text-white text-xl font-bold" },
  sy = { class: "flex justify-end gap-3 pt-6 border-t" },
  oy = ["disabled"],
  ny = { key: 0, class: "flex items-center gap-2" },
  ly = { key: 1 },
  Lt = 40,
  ry = {
    __name: "ModalCreateSeatmap",
    props: { seatmap: Object },
    emits: ["save", "close"],
    setup(e, { emit: t }) {
      const o = e,
        n = t,
        l = "https://fastcat-book.dev/api",
        r = $(null),
        a = $([]),
        u = $(!1),
        i = $(null),
        f = $(!1),
        c = $(null),
        d = $(null),
        p = $(!1),
        b = $(!1),
        x = $(!1),
        A = $(!1),
        v = $(!1),
        S = $(!1),
        _ = $([]),
        C = $(!1),
        k = $(null),
        T = $(null),
        B = $(null),
        F = pe(() =>
          _.value.filter((M) => !a.value.some((L) => L.name === M.name)),
        );
      o.seatmap?.length &&
        ((a.value = o.seatmap.map((M) => ({
          name: M.name || M.accommodation_name,
          rows: M.rows || null,
          columns: M.columns || null,
          seats: M.seats || [],
          facilityLabels: M.facilityLabels || [],
        }))),
        (r.value = a.value[0]));
      const de = (M) => {
          const L = r.value;
          if (!L || !M.facility) return;
          const D = M.facility;
          confirm(`Remove facility "${D}"?`) &&
            (L.seats.forEach((h) => {
              h.facility === D && (h.facility = null);
            }),
            (L.facilityLabels = L.facilityLabels.filter((h) => h.name !== D)),
            (S.value = !1));
        },
        re = (M) => {
          ((r.value = M),
            (c.value = M.rows || null),
            (d.value = M.columns || null));
        },
        ge = async () => {
          ((u.value = !0), await O());
        },
        he = () => {
          if (!i.value) {
            alert("Please select accommodation first");
            return;
          }
          const M = _.value.find((L) => L.id === i.value);
          if (!M) {
            alert("Invalid accommodation selected");
            return;
          }
          (a.value.push({
            id: M.id,
            name: M.name,
            rows: null,
            columns: null,
            seats: [],
            facilityLabels: [],
          }),
            (i.value = null),
            (u.value = !1));
        },
        X = () => (u.value = !1),
        xe = () => he(),
        Q = () => {
          const M = r.value;
          if (!M || !c.value || !d.value)
            return alert("Enter rows and columns first.");
          ((M.rows = Number(c.value)),
            (M.columns = Number(d.value)),
            (M.seats = []),
            (M.facilityLabels = []));
          for (let L = 0; L < M.rows; L++)
            for (let D = 0; D < M.columns; D++)
              M.seats.push({
                seat_no: `${L + 1}${String.fromCharCode(65 + D)}`,
                row: L,
                col: D,
                blocked: !1,
                path: !1,
                pwd: !1,
                facility: null,
                renaming: !1,
              });
        },
        U = () => (x.value = !x.value),
        H = () => {
          ((b.value = !b.value),
            (x.value = !1),
            (A.value = !1),
            (v.value = !1),
            (S.value = !1));
        },
        ee = () => {
          ((A.value = !A.value),
            (x.value = !1),
            (v.value = !1),
            (S.value = !1));
        },
        me = () => {
          ((v.value = !v.value),
            (x.value = !1),
            (A.value = !1),
            (S.value = !1));
        },
        Le = () => {
          ((S.value = !S.value),
            (x.value = !1),
            (A.value = !1),
            (v.value = !1),
            (k.value = null));
        },
        Oe = (M, L) => {
          if (L.button === 0) {
            if (
              (L.preventDefault(),
              (k.value = M),
              (p.value = !1),
              (B.value = M),
              x.value)
            )
              T.value = "rename";
            else if (S.value) T.value = "facility";
            else if (A.value) T.value = "block";
            else if (v.value) T.value = "path";
            else if (b.value) T.value = "pwd";
            else return;
            switch (T.value) {
              case "rename":
                M.renaming = !0;
                break;
              case "facility":
                if (M.facility && M.facility !== "…") {
                  (de(M), (k.value = null), (T.value = null));
                  return;
                }
                M.facility = "…";
                break;
              case "block":
                ((M.initialBlocked = M.blocked),
                  (M.blocked = !M.blocked),
                  (M.path = !1));
                break;
              case "path":
                ((M.initialPath = M.path),
                  (M.path = !M.path),
                  (M.blocked = !1));
                break;
              case "pwd":
                ((M.initialPwd = M.pwd),
                  (M.pwd = !M.pwd),
                  (M.blocked = !1),
                  (M.path = !1),
                  (M.facility = null));
                break;
            }
          }
        },
        Ve = (M) => {
          if (!k.value || !T.value) return;
          ((p.value = !0), (B.value = M));
          const L = k.value,
            D = Math.min(L.row, M.row),
            h = Math.max(L.row, M.row),
            y = Math.min(L.col, M.col),
            E = Math.max(L.col, M.col);
          r.value.seats.forEach((P) => {
            P.row >= D && P.row <= h && P.col >= y && P.col <= E
              ? (T.value === "rename" && (P.renaming = !0),
                T.value === "facility" && (P.facility = "…"),
                T.value === "block" && (P.blocked = !L.initialBlocked),
                T.value === "path" && (P.path = !L.initialPath),
                T.value === "pwd" &&
                  ((P.pwd = !L.initialPwd),
                  (P.blocked = !1),
                  (P.path = !1),
                  (P.facility = null)))
              : (T.value === "rename" && (P.renaming = !1),
                T.value === "facility" &&
                  P.facility === "…" &&
                  (P.facility = null));
          });
        },
        Ne = () => {
          k.value && it();
        },
        it = () => {
          if (k.value) {
            if (T.value === "rename" && p.value) {
              const M = prompt("Enter starting seat number:", "001A");
              if (!M) r.value.seats.forEach((L) => (L.renaming = !1));
              else {
                const L = M.match(/^(\d+)([A-Z])$/);
                if (!L) return alert("Format should be like 001A");
                let [D, h, y] = L;
                ((h = parseInt(h, 10)),
                  r.value.seats
                    .filter((P) => P.renaming)
                    .sort((P, V) => P.row - V.row || P.col - V.col)
                    .forEach((P, V) => {
                      ((P.seat_no = String(h + V).padStart(3, "0") + y),
                        (P.renaming = !1));
                    }));
              }
            }
            if (T.value === "facility" && p.value) {
              const M = r.value.seats.filter((L) => L.facility === "…");
              if (M.length) {
                const L = Math.min(...M.map((P) => P.row)),
                  D = Math.max(...M.map((P) => P.row)),
                  h = Math.min(...M.map((P) => P.col)),
                  y = Math.max(...M.map((P) => P.col)),
                  E = prompt("Enter facility name:", "Facility");
                E
                  ? (M.forEach((P) => {
                      ((P.facility = E), (P.blocked = !1), (P.path = !1));
                    }),
                    r.value.facilityLabels.push({
                      name: E,
                      left: h * Lt,
                      top: L * Lt,
                      width: (y - h + 1) * Lt,
                      height: (D - L + 1) * Lt,
                    }))
                  : M.forEach((P) => (P.facility = null));
              }
            }
            ((k.value = null),
              (T.value = null),
              (S.value = !1),
              (A.value = !1),
              (v.value = !1),
              (b.value = !1),
              (p.value = !1),
              (B.value = null));
          }
        },
        pt = (M) => {
          if (!(k.value && p.value)) {
            if (S.value) {
              if (M.facility) de(M);
              else {
                M.facility = "…";
                const L = prompt("Enter facility name:", "Facility");
                L
                  ? ((M.facility = L), (M.blocked = !1), (M.path = !1))
                  : (M.facility = null);
              }
              return;
            }
            if (b.value) {
              ((M.pwd = !M.pwd),
                (M.blocked = !1),
                (M.path = !1),
                (M.facility = null));
              return;
            }
            if (x.value) {
              const L = prompt("Rename seat:", M.seat_no);
              (L?.trim() && ((M.seat_no = L.trim()), (x.value = !1)),
                r.value.seats.forEach((D) => (D.renaming = !1)));
              return;
            }
            if (A.value) {
              ((M.blocked = !M.blocked), (M.path = !1), (M.pwd = !1));
              return;
            }
            if (v.value) {
              ((M.path = !M.path), (M.blocked = !1), (M.pwd = !1));
              return;
            }
          }
        },
        Pt = () => {
          r.value &&
            (r.value.seats.forEach((M) => {
              ((M.blocked = !1),
                (M.path = !1),
                (M.facility = null),
                (M.renaming = !1),
                (M.pwd = !1));
            }),
            (r.value.facilityLabels = []));
        },
        He = (M) => {
          (a.value[M] === r.value && (r.value = null), a.value.splice(M, 1));
        },
        O = async () => {
          try {
            const M = localStorage.getItem("token"),
              L = await fetch(`${l}/passenger-accommodations`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: M,
                },
              }),
              D = await L.json();
            L.ok && D.data
              ? (_.value = D.data.map((h) => ({
                  id: h.accommodation_id,
                  name: h.accommodation_name,
                })))
              : (_.value = []);
          } catch (M) {
            (console.error("Failed to fetch accommodations", M),
              (_.value = []));
          }
        },
        se = () => {
          if (!a.value.length)
            return alert("Add at least one class before saving!");
          const M = a.value.find((L) => !L.seats || !L.seats.length);
          if (M)
            return alert(
              `Class "${M.name}" has no seats. Please add seats before saving.`,
            );
          f.value = !0;
          try {
            const L = a.value.map((D) => {
              const h = _.value.find((y) => y.name === D.name) || {};
              return {
                name: D.name,
                rows: D.rows ?? 0,
                columns: D.columns ?? 0,
                seats: D.seats ?? [],
                aircon: h.aircon ?? !0,
                wifi: h.wifi ?? !1,
                facilityLabels: D.facilityLabels ?? [],
              };
            });
            n("save", L);
          } catch (L) {
            (console.error("Failed to build seatmap payload", L),
              alert("Failed to save seatmap. Check console for details."));
          } finally {
            f.value = !1;
          }
        };
      return (
        De(() => window.addEventListener("mouseup", Ne)),
        $n(() => window.removeEventListener("mouseup", Ne)),
        (M, L) => (
          m(),
          g("div", wb, [
            s(
              "div",
              {
                class:
                  "modal-card bg-white rounded-lg shadow-xl w-[900px] mx-4",
                onClick: L[5] || (L[5] = Se(() => {}, ["stop"])),
              },
              [
                s("div", kb, [
                  L[7] ||
                    (L[7] = s(
                      "h2",
                      { class: "text-lg font-semibold text-gray-900" },
                      "Create Seatmap",
                      -1,
                    )),
                  s(
                    "button",
                    {
                      onClick: L[0] || (L[0] = (D) => n("close")),
                      class: "text-gray-400 hover:text-gray-600",
                    },
                    [
                      ...(L[6] ||
                        (L[6] = [
                          s(
                            "svg",
                            {
                              class: "w-6 h-6",
                              fill: "none",
                              stroke: "currentColor",
                            },
                            [
                              s("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M6 18L18 6M6 6l12 12",
                              }),
                            ],
                            -1,
                          ),
                        ])),
                    ],
                  ),
                ]),
                s("form", Ab, [
                  C.value
                    ? (m(), g("div", Cb, "Loading seatmap..."))
                    : (m(),
                      g("div", $b, [
                        s("div", Sb, [
                          s("div", Mb, [
                            s("div", Rb, [
                              L[9] ||
                                (L[9] = s(
                                  "p",
                                  {
                                    class:
                                      "text-sm font-medium text-gray-700 mb-3",
                                  },
                                  " List of Class ",
                                  -1,
                                )),
                              s("div", Eb, [
                                (m(!0),
                                g(
                                  q,
                                  null,
                                  le(
                                    a.value,
                                    (D, h) => (
                                      m(),
                                      g(
                                        "div",
                                        {
                                          key: h,
                                          onClick: (y) => re(D),
                                          class: Z([
                                            "flex justify-between p-1 rounded cursor-pointer",
                                            r.value?.name === D.name
                                              ? "bg-blue-200"
                                              : "hover:bg-gray-200",
                                          ]),
                                        },
                                        [
                                          s("span", Bb, w(D.name), 1),
                                          s(
                                            "span",
                                            {
                                              class:
                                                "text-sm font-medium text-red-500 cursor-pointer",
                                              onClick: Se(
                                                (y) => He(h),
                                                ["stop"],
                                              ),
                                            },
                                            "DEL",
                                            8,
                                            Pb,
                                          ),
                                        ],
                                        10,
                                        Tb,
                                      )
                                    ),
                                  ),
                                  128,
                                )),
                              ]),
                              s("div", Ib, [
                                u.value
                                  ? oe(
                                      (m(),
                                      g(
                                        "select",
                                        {
                                          key: 0,
                                          "onUpdate:modelValue":
                                            L[1] ||
                                            (L[1] = (D) => (i.value = D)),
                                          class:
                                            "mb-4 w-full px-3 py-2 border rounded-md",
                                        },
                                        [
                                          L[8] ||
                                            (L[8] = s(
                                              "option",
                                              { value: "", disabled: "" },
                                              "Select accommodation",
                                              -1,
                                            )),
                                          (m(!0),
                                          g(
                                            q,
                                            null,
                                            le(
                                              F.value,
                                              (D) => (
                                                m(),
                                                g(
                                                  "option",
                                                  { key: D.id, value: D.id },
                                                  w(D.name),
                                                  9,
                                                  jb,
                                                )
                                              ),
                                            ),
                                            128,
                                          )),
                                        ],
                                        512,
                                      )),
                                      [[Qt, i.value]],
                                    )
                                  : K("", !0),
                                u.value
                                  ? K("", !0)
                                  : (m(),
                                    g(
                                      "button",
                                      {
                                        key: 1,
                                        onClick: ge,
                                        type: "button",
                                        class:
                                          "w-full px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-400",
                                      },
                                      " + Add Class ",
                                    )),
                                u.value
                                  ? (m(),
                                    g("div", Lb, [
                                      s(
                                        "button",
                                        {
                                          onClick: X,
                                          type: "button",
                                          class:
                                            "px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-400",
                                        },
                                        " Cancel ",
                                      ),
                                      s(
                                        "button",
                                        {
                                          onClick: xe,
                                          type: "button",
                                          disabled: !i.value,
                                          class:
                                            "px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-400",
                                        },
                                        " Save ",
                                        8,
                                        Ob,
                                      ),
                                    ]))
                                  : K("", !0),
                              ]),
                            ]),
                            r.value
                              ? (m(),
                                g("div", Vb, [
                                  s("div", Nb, [
                                    s("div", null, [
                                      L[10] ||
                                        (L[10] = s(
                                          "label",
                                          {
                                            class:
                                              "block text-sm mb-2 text-gray-700",
                                          },
                                          "Row Seats",
                                          -1,
                                        )),
                                      oe(
                                        s(
                                          "input",
                                          {
                                            type: "number",
                                            "onUpdate:modelValue":
                                              L[2] ||
                                              (L[2] = (D) => (c.value = D)),
                                            class:
                                              "w-full px-3 py-2 border rounded-md",
                                          },
                                          null,
                                          512,
                                        ),
                                        [[be, c.value, void 0, { number: !0 }]],
                                      ),
                                    ]),
                                    s("div", null, [
                                      L[11] ||
                                        (L[11] = s(
                                          "label",
                                          {
                                            class:
                                              "block text-sm mb-2 text-gray-700",
                                          },
                                          "Column Seats",
                                          -1,
                                        )),
                                      oe(
                                        s(
                                          "input",
                                          {
                                            type: "number",
                                            "onUpdate:modelValue":
                                              L[3] ||
                                              (L[3] = (D) => (d.value = D)),
                                            class:
                                              "w-full px-3 py-2 border rounded-md",
                                          },
                                          null,
                                          512,
                                        ),
                                        [[be, d.value, void 0, { number: !0 }]],
                                      ),
                                    ]),
                                  ]),
                                  s(
                                    "button",
                                    {
                                      type: "button",
                                      onClick: Q,
                                      class: Z([
                                        "w-full px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-400 mb-4",
                                        r.value
                                          ? ""
                                          : "opacity-50 cursor-not-allowed",
                                      ]),
                                    },
                                    " Generate Seats ",
                                    2,
                                  ),
                                ]))
                              : K("", !0),
                            s("div", Ub, [
                              s(
                                "button",
                                {
                                  type: "button",
                                  onClick: U,
                                  disabled: !r.value,
                                  class: Z([
                                    "px-4 py-2 rounded-md",
                                    r.value
                                      ? x.value
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200"
                                      : "opacity-40 cursor-not-allowed",
                                  ]),
                                },
                                " Rename Seat ",
                                10,
                                Db,
                              ),
                              s(
                                "button",
                                {
                                  type: "button",
                                  onClick: ee,
                                  disabled: !r.value,
                                  class: Z([
                                    "px-4 py-2 rounded-md",
                                    r.value
                                      ? A.value
                                        ? "bg-red-500 text-white"
                                        : "bg-gray-200"
                                      : "opacity-40 cursor-not-allowed",
                                  ]),
                                },
                                " Block/Unblock ",
                                10,
                                Fb,
                              ),
                              s(
                                "button",
                                {
                                  type: "button",
                                  onClick: me,
                                  disabled: !r.value,
                                  class: Z([
                                    "px-4 py-2 rounded-md",
                                    r.value
                                      ? v.value
                                        ? "bg-yellow-400 text-white"
                                        : "bg-gray-200"
                                      : "opacity-40 cursor-not-allowed",
                                  ]),
                                },
                                " Walk Path ",
                                10,
                                Hb,
                              ),
                              s(
                                "button",
                                {
                                  type: "button",
                                  onClick: Le,
                                  disabled: !r.value,
                                  class: Z([
                                    "px-4 py-2 rounded-md",
                                    r.value
                                      ? S.value
                                        ? "bg-orange-500 text-white"
                                        : "bg-gray-200"
                                      : "opacity-40 cursor-not-allowed",
                                  ]),
                                },
                                " Add Facility ",
                                10,
                                zb,
                              ),
                              s(
                                "button",
                                {
                                  type: "button",
                                  onClick: H,
                                  disabled: !r.value,
                                  class: Z([
                                    "px-4 py-2 rounded-md",
                                    r.value
                                      ? b.value
                                        ? "bg-[#016AB3] text-white"
                                        : "bg-gray-200"
                                      : "opacity-40 cursor-not-allowed",
                                  ]),
                                },
                                " PWD ",
                                10,
                                Qb,
                              ),
                              s(
                                "button",
                                {
                                  type: "button",
                                  onClick: Pt,
                                  disabled: !r.value,
                                  class: Z([
                                    "px-4 py-2 rounded-md",
                                    r.value
                                      ? "bg-gray-200"
                                      : "opacity-40 cursor-not-allowed",
                                  ]),
                                },
                                " Reset Changes ",
                                10,
                                Kb,
                              ),
                            ]),
                          ]),
                          s("div", Yb, [
                            L[12] ||
                              (L[12] = s(
                                "p",
                                {
                                  class:
                                    "text-sm text-center font-medium text-gray-700 mb-3",
                                },
                                " Seatmap Preview ",
                                -1,
                              )),
                            s("div", Jb, [
                              r.value
                                ? r.value.seats?.length
                                  ? (m(),
                                    g("div", Zb, [
                                      (m(!0),
                                      g(
                                        q,
                                        null,
                                        le(
                                          r.value.seats,
                                          (D) => (
                                            m(),
                                            g(
                                              "div",
                                              {
                                                key: D.seat_no,
                                                "data-row": D.row,
                                                "data-col": D.col,
                                                class: Z([
                                                  "absolute flex items-center justify-center border rounded-md text-xs font-medium cursor-pointer select-none",
                                                  {
                                                    "bg-gray-300": D.path,
                                                    "bg-red-700 text-white":
                                                      D.blocked,
                                                    "bg-gray-100":
                                                      !D.path &&
                                                      !D.blocked &&
                                                      !D.facility &&
                                                      !D.renaming,
                                                    "bg-orange-400 text-white":
                                                      D.facility,
                                                    "bg-green-400 text-black":
                                                      D.pwd,
                                                    "ring-2 ring-blue-400 bg-blue-200":
                                                      D.renaming,
                                                  },
                                                ]),
                                                style: vs({
                                                  width: Lt + "px",
                                                  height: Lt + "px",
                                                  top: D.row * Lt + "px",
                                                  left: D.col * Lt + "px",
                                                }),
                                                onMousedown: (h) => Oe(D, h),
                                                onMouseover: (h) => Ve(D),
                                                onClick: (h) => pt(D),
                                              },
                                              [
                                                !D.blocked &&
                                                !D.path &&
                                                !D.facility
                                                  ? (m(),
                                                    g(
                                                      "span",
                                                      Xb,
                                                      w(D.seat_no),
                                                      1,
                                                    ))
                                                  : K("", !0),
                                                D.facility
                                                  ? (m(),
                                                    g(
                                                      "span",
                                                      ey,
                                                      w(D.facility),
                                                      1,
                                                    ))
                                                  : K("", !0),
                                                D.blocked
                                                  ? (m(), g("span", ty, "✕"))
                                                  : K("", !0),
                                              ],
                                              46,
                                              Wb,
                                            )
                                          ),
                                        ),
                                        128,
                                      )),
                                      (m(!0),
                                      g(
                                        q,
                                        null,
                                        le(
                                          r.value.facilityLabels || [],
                                          (D, h) => (
                                            m(),
                                            g(
                                              "div",
                                              {
                                                key: h,
                                                class:
                                                  "facility-label absolute flex items-center justify-center text-white font-bold pointer-events-none bg-orange-500 rounded-md",
                                                style: vs({
                                                  top: D.top + "px",
                                                  left: D.left + "px",
                                                  width: D.width + "px",
                                                  height: D.height + "px",
                                                }),
                                              },
                                              w(D.name),
                                              5,
                                            )
                                          ),
                                        ),
                                        128,
                                      )),
                                    ]))
                                  : (m(),
                                    g("div", Gb, " No seats generated yet. "))
                                : (m(),
                                  g("div", qb, " Select a class to preview ")),
                            ]),
                          ]),
                        ]),
                      ])),
                  s("div", sy, [
                    s(
                      "button",
                      {
                        type: "button",
                        onClick: L[4] || (L[4] = (D) => M.$emit("close")),
                      },
                      "Cancel",
                    ),
                    s(
                      "button",
                      {
                        type: "button",
                        class:
                          "px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700",
                        disabled: f.value,
                        onClick: se,
                      },
                      [
                        f.value
                          ? (m(),
                            g("span", ny, [
                              ...(L[13] ||
                                (L[13] = [
                                  s(
                                    "span",
                                    {
                                      class:
                                        "inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                                    },
                                    null,
                                    -1,
                                  ),
                                  ye(" Saving... ", -1),
                                ])),
                            ]))
                          : (m(), g("span", ly, "Save Seatmap")),
                      ],
                      8,
                      oy,
                    ),
                  ]),
                ]),
              ],
            ),
          ])
        )
      );
    },
  },
  ay = ns(ry, [["__scopeId", "data-v-f6b3536b"]]),
  iy = { class: "min-h-full bg-gray-50 p-6" },
  dy = { class: "mb-6" },
  uy = { class: "flex justify-between items-center" },
  cy = { class: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" },
  fy = { class: "bg-white rounded-lg p-6 shadow-sm" },
  py = { class: "text-3xl font-bold text-gray-900 mb-1" },
  my = { class: "bg-white rounded-lg p-6 shadow-sm" },
  gy = { class: "flex items-center justify-between mb-4" },
  vy = { class: "text-3xl font-bold text-gray-900 mb-1" },
  hy = { class: "bg-white rounded-lg p-6 shadow-sm" },
  by = { class: "flex items-center justify-between mb-4" },
  yy = { class: "text-3xl font-bold text-gray-900 mb-1" },
  xy = { class: "bg-white rounded-lg shadow-sm" },
  _y = { class: "border-b border-gray-200" },
  wy = { class: "flex space-x-8 px-6" },
  ky = ["onClick"],
  Ay = { class: "p-6" },
  Cy = { class: "flex items-center justify-between mb-6" },
  $y = { class: "relative" },
  Sy = { key: 0, class: "flex justify-center items-center py-8" },
  My = { key: 1, class: "overflow-auto max-h-[400px]" },
  Ry = { class: "min-w-full divide-y divide-gray-200" },
  Ey = { class: "bg-white divide-y divide-gray-200" },
  Ty = { key: 0 },
  By = { key: 1 },
  Py = { class: "px-6 py-4 whitespace-nowrap" },
  Iy = { key: 1 },
  jy = { class: "flex gap-3 items-center" },
  Ly = {
    disabled: "",
    title: "not working yet",
    class:
      "font-medium text-gray-400 flex items-center cursor-not-allowed opacity-60",
  },
  Oy = ["disabled", "onClick"],
  Wt = "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
  Ot =
    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
  Vy = {
    __name: "VesselsModule",
    setup(e) {
      const t = "https://fastcat-book.dev/api",
        o = $("all"),
        n = $(""),
        l = $(!1),
        r = $(!1),
        a = $([]),
        u = $(!1),
        i = $({
          createEdit: { open: !1 },
          seatmap: { open: !1, vessel: null, data: null },
        }),
        f = [
          { id: "all", name: "All Vessels" },
          { id: "available", name: "Available Vessels" },
          { id: "drydock", name: "Drydock" },
          { id: "grounded", name: "Grounded" },
        ],
        c = (k, T) =>
          !k.classes || k.classes.length === 0
            ? ["-"]
            : k.classes.map((B) => {
                switch (T) {
                  case "aircon":
                    return B.aircon === !0
                      ? "✅"
                      : B.aircon === !1
                        ? "❌"
                        : "-";
                  case "wifi":
                    return B.wifi === !0 ? "✅" : B.wifi === !1 ? "❌" : "-";
                  case "seats":
                    return B.seats || 0;
                  case "name":
                    return B.name || "-";
                }
              }),
        d = (k) =>
          k === "Available"
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800",
        p = async () => {
          l.value = !0;
          try {
            const k = localStorage.getItem("token"),
              T = await fetch(`${t}/vessels`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: k,
                },
              }),
              B = await T.json();
            (console.log("Vessels API Response:", B),
              T.ok && B.success && B.data?.vessels
                ? ((a.value = B.data.vessels.map((F) => ({
                    id: F.id,
                    name: F.vessel_name || F.name,
                    status: F.status,
                    capacity: F.capacity,
                    description: F.description,
                    classes: (F.accommodations || []).map((de) => ({
                      name: de.name || de.accommodation_name || "Unknown",
                      rows: de.rows || 0,
                      columns: de.columns || 0,
                      seats: de.seats || 0,
                      facilityLabels: de.facilityLabels || [],
                      aircon: !!de.aircon,
                      wifi: !!de.wifi,
                    })),
                  }))),
                  console.log("Parsed vessels:", a.value))
                : ((a.value = []),
                  console.error("Failed to parse vessels data:", B)));
          } catch (k) {
            ((a.value = []), console.error("Failed to fetch vessels", k));
          } finally {
            l.value = !1;
          }
        };
      De(() => {
        p();
      });
      const b = () => {
          ((i.value.createEdit.vessel = null), (i.value.createEdit.open = !0));
        },
        x = async (k) => {
          try {
            u.value = !0;
            const T = localStorage.getItem("token"),
              F = await (
                await fetch(`${t}/vessels/${k.id}/layout`, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: T,
                  },
                })
              ).json();
            ((i.value.seatmap.vessel = k),
              (i.value.seatmap.data = F.classes || []),
              (i.value.seatmap.open = !0));
          } catch (T) {
            (console.error("Failed to load seatmap:", T),
              alert("Failed to load seatmap. Please try again."));
          } finally {
            u.value = !1;
          }
        },
        A = {
          available: "Available",
          drydock: "Drydock",
          grounded: "Grounded",
        },
        v = pe(() =>
          o.value === "all"
            ? a.value
            : a.value.filter((k) => k.status === A[o.value]),
        ),
        S = pe(() => a.value.filter((k) => k.status === "Available").length),
        _ = pe(() => a.value.filter((k) => k.status === "Drydock").length),
        C = async (k) => {
          const T = i.value.seatmap.vessel;
          if (T)
            try {
              const B = localStorage.getItem("token");
              (await fetch(`${t}/vessels/${T.id}/layout`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: B,
                },
                body: JSON.stringify(k),
              }),
                (i.value.seatmap.open = !1),
                p());
            } catch (B) {
              (console.error("Failed saving seatmap:", B),
                alert("Failed to save seatmap"));
            }
        };
      return (k, T) => (
        m(),
        g("div", iy, [
          s("div", dy, [
            T[5] ||
              (T[5] = s(
                "nav",
                { class: "text-sm text-gray-500 mb-2" },
                [
                  s("span", null, "Dashboard"),
                  s("span", { class: "mx-2" }, ">"),
                  s("span", { class: "text-gray-900" }, "Vessels"),
                ],
                -1,
              )),
            s("div", uy, [
              T[4] ||
                (T[4] = s(
                  "h1",
                  { class: "text-2xl font-semibold text-gray-900" },
                  "Vessels Management",
                  -1,
                )),
              s(
                "button",
                {
                  onClick: b,
                  type: "button",
                  class:
                    "bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2 cursor-pointer",
                },
                [
                  Y(ie(Yt), { class: "w-4 h-4" }),
                  T[3] || (T[3] = ye(" Create ", -1)),
                ],
              ),
            ]),
          ]),
          s("div", cy, [
            s("div", fy, [
              T[6] ||
                (T[6] = s(
                  "div",
                  { class: "flex items-center justify-between mb-4" },
                  [
                    s(
                      "h3",
                      { class: "text-sm font-medium text-gray-600" },
                      "Total Vessels",
                    ),
                  ],
                  -1,
                )),
              s("div", py, w(a.value.length), 1),
            ]),
            s("div", my, [
              s("div", gy, [
                T[7] ||
                  (T[7] = s(
                    "h3",
                    { class: "text-sm font-medium text-gray-600" },
                    "Active Vessels",
                    -1,
                  )),
                Y(ie(Io), { class: "w-5 h-5 text-blue-600" }),
              ]),
              s("div", vy, w(S.value), 1),
            ]),
            s("div", hy, [
              s("div", by, [
                T[8] ||
                  (T[8] = s(
                    "h3",
                    { class: "text-sm font-medium text-gray-600" },
                    "Drydock",
                    -1,
                  )),
                Y(ie(qs), { class: "w-5 h-5 text-blue-600" }),
              ]),
              s("div", yy, w(_.value), 1),
            ]),
          ]),
          s("div", xy, [
            s("div", _y, [
              s("nav", wy, [
                (m(),
                g(
                  q,
                  null,
                  le(f, (B) =>
                    s(
                      "button",
                      {
                        key: B.id,
                        onClick: (F) => (o.value = B.id),
                        class: Z([
                          "py-4 px-1 border-b-2 font-medium text-sm",
                          o.value === B.id
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                        ]),
                      },
                      w(B.name),
                      11,
                      ky,
                    ),
                  ),
                  64,
                )),
              ]),
            ]),
            s("div", Ay, [
              s("div", Cy, [
                T[9] ||
                  (T[9] = s(
                    "h2",
                    { class: "text-lg font-medium text-gray-900" },
                    "List of Vessels",
                    -1,
                  )),
                s("div", $y, [
                  Y(ie(Bt), {
                    class:
                      "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4",
                  }),
                  oe(
                    s(
                      "input",
                      {
                        "onUpdate:modelValue":
                          T[0] || (T[0] = (B) => (n.value = B)),
                        type: "text",
                        placeholder: "Search",
                        class:
                          "pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      },
                      null,
                      512,
                    ),
                    [[be, n.value]],
                  ),
                ]),
              ]),
              l.value
                ? (m(),
                  g("div", Sy, [
                    ...(T[10] ||
                      (T[10] = [
                        s(
                          "div",
                          {
                            class:
                              "flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg",
                          },
                          [
                            s("span", {
                              class:
                                "inline-block w-6 h-6 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                            }),
                            s(
                              "span",
                              {
                                class: "font-semibold text-blue-700 text-base",
                              },
                              "Loading vessels...",
                            ),
                          ],
                          -1,
                        ),
                      ])),
                  ]))
                : (m(),
                  g("div", My, [
                    s("table", Ry, [
                      s("thead", { class: "bg-gray-50" }, [
                        s("tr", null, [
                          s("th", { class: Z(Ot) }, "#"),
                          s("th", { class: Z(Ot) }, "Vessel Name"),
                          s("th", { class: Z(Ot) }, "Class"),
                          s("th", { class: Z(Ot) }, "Seats"),
                          s("th", { class: Z(Ot) }, "Aircon"),
                          s("th", { class: Z(Ot) }, "WiFi"),
                          s("th", { class: Z(Ot) }, "Vessel Status"),
                          s("th", { class: Z(Ot) }, "Action"),
                        ]),
                      ]),
                      s("tbody", Ey, [
                        l.value
                          ? (m(),
                            g("tr", Ty, [
                              ...(T[11] ||
                                (T[11] = [
                                  s(
                                    "td",
                                    {
                                      colspan: "8",
                                      class:
                                        "px-6 py-6 text-center text-sm text-gray-500",
                                    },
                                    " Loading vessels... ",
                                    -1,
                                  ),
                                ])),
                            ]))
                          : v.value.length === 0
                            ? (m(),
                              g("tr", By, [
                                ...(T[12] ||
                                  (T[12] = [
                                    s(
                                      "td",
                                      {
                                        colspan: "8",
                                        class:
                                          "px-6 py-6 text-center text-sm text-gray-500",
                                      },
                                      " No vessels found. ",
                                      -1,
                                    ),
                                  ])),
                              ]))
                            : (m(!0),
                              g(
                                q,
                                { key: 2 },
                                le(
                                  v.value,
                                  (B) => (
                                    m(),
                                    g(
                                      "tr",
                                      {
                                        key: B.id,
                                        class: "hover:bg-gray-50 align-top",
                                      },
                                      [
                                        s(
                                          "td",
                                          { class: Z(Wt) },
                                          w(B.id || "-"),
                                          1,
                                        ),
                                        s(
                                          "td",
                                          { class: Z(Wt) },
                                          w(B.name || "-"),
                                          1,
                                        ),
                                        s("td", { class: Z(Wt) }, [
                                          s("ul", null, [
                                            (m(!0),
                                            g(
                                              q,
                                              null,
                                              le(
                                                c(B, "name"),
                                                (F, de) => (
                                                  m(),
                                                  g("li", { key: de }, w(F), 1)
                                                ),
                                              ),
                                              128,
                                            )),
                                          ]),
                                        ]),
                                        s("td", { class: Z(Wt) }, [
                                          s("ul", null, [
                                            (m(!0),
                                            g(
                                              q,
                                              null,
                                              le(
                                                c(B, "seats"),
                                                (F, de) => (
                                                  m(),
                                                  g("li", { key: de }, w(F), 1)
                                                ),
                                              ),
                                              128,
                                            )),
                                          ]),
                                        ]),
                                        s("td", { class: Z(Wt) }, [
                                          s("ul", null, [
                                            (m(!0),
                                            g(
                                              q,
                                              null,
                                              le(
                                                c(B, "aircon"),
                                                (F, de) => (
                                                  m(),
                                                  g("li", { key: de }, w(F), 1)
                                                ),
                                              ),
                                              128,
                                            )),
                                          ]),
                                        ]),
                                        s("td", { class: Z(Wt) }, [
                                          s("ul", null, [
                                            (m(!0),
                                            g(
                                              q,
                                              null,
                                              le(
                                                c(B, "wifi"),
                                                (F, de) => (
                                                  m(),
                                                  g("li", { key: de }, w(F), 1)
                                                ),
                                              ),
                                              128,
                                            )),
                                          ]),
                                        ]),
                                        s("td", Py, [
                                          B.status
                                            ? (m(),
                                              g(
                                                "span",
                                                {
                                                  key: 0,
                                                  class: Z([
                                                    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                                    d(B.status),
                                                  ]),
                                                },
                                                w(B.status),
                                                3,
                                              ))
                                            : (m(), g("span", Iy, "-")),
                                        ]),
                                        s("td", { class: Z(Wt) }, [
                                          s("div", jy, [
                                            s("button", Ly, [
                                              Y(ie(En), {
                                                class: "w-4 h-4 mr-1",
                                              }),
                                            ]),
                                            s(
                                              "button",
                                              {
                                                type: "button",
                                                class:
                                                  "font-medium text-blue-600 hover:text-blue-900 flex items-center cursor-pointer",
                                                disabled: r.value,
                                                onClick: (F) => x(B),
                                              },
                                              [
                                                Y(ie(Zd), {
                                                  class: "w-4 h-4 mr-1",
                                                }),
                                              ],
                                              8,
                                              Oy,
                                            ),
                                          ]),
                                        ]),
                                      ],
                                    )
                                  ),
                                ),
                                128,
                              )),
                      ]),
                    ]),
                  ])),
            ]),
          ]),
          Y(
            Ie,
            { name: "modal-fade" },
            {
              default: $e(() => [
                i.value.createEdit.open
                  ? (m(),
                    ke(_b, {
                      key: 0,
                      onClose:
                        T[1] || (T[1] = (B) => (i.value.createEdit.open = !1)),
                      onSave: p,
                    }))
                  : K("", !0),
              ]),
              _: 1,
            },
          ),
          Y(
            Ie,
            { name: "modal-fade" },
            {
              default: $e(() => [
                i.value.seatmap.open
                  ? (m(),
                    ke(
                      ay,
                      {
                        key: 0,
                        seatmap: i.value.seatmap.data,
                        onSave: C,
                        onClose:
                          T[2] || (T[2] = (B) => (i.value.seatmap.open = !1)),
                      },
                      null,
                      8,
                      ["seatmap"],
                    ))
                  : K("", !0),
              ]),
              _: 1,
            },
          ),
        ])
      );
    },
  },
  Ny = { class: "grid grid-cols-[35%_65%] justify border-gray-200" },
  Uy = { class: "flex flex-col items-start gap-6 p-6" },
  Dy = { class: "text-lg font-semibold text-gray-900" },
  Fy = { class: "flex justify-between gap-5" },
  Hy = { class: "flex flex-col gap-1" },
  zy = { class: "relative w-full" },
  Qy = ["disabled"],
  Ky = { class: "flex flex-col gap-1" },
  Yy = { class: "relative w-full" },
  Jy = ["disabled"],
  qy = {
    class: "flex items-center justify-end gap-3 pt-6 border-t border-gray-200",
  },
  Gy = ["disabled"],
  Zy = ["disabled"],
  Wy = { key: 1 },
  Xy = { key: 0, class: "text-red-500 text-sm mt-2 text-center" },
  ex = { class: "flex flex-col p-6 border-l border-gray-200" },
  tx = { class: "flex flex-col items-center gap-6" },
  sx = { class: "flex justify-between w-full" },
  ox = { key: 0, class: "flex justify-center items-center py-8 min-h-[40vh]" },
  nx = { key: 1, class: "w-full overflow-auto min-h-[40vh] max-h-[40vh]" },
  lx = { class: "min-w-full border-separate border-spacing-0" },
  rx = { class: "text-gray-900" },
  ax = { class: "px-6 py-4 border-gray-200" },
  ix = { class: "px-6 py-4 font-medium border-gray-200" },
  dx = { class: "px-6 py-4 border-gray-200" },
  ux = { class: "px-6 py-4 text-sm flex items-start gap-1" },
  cx = ["onClick"],
  fx = ["onClick"],
  px = {
    __name: "ModalCreateAddOn",
    emits: "close",
    setup(e, { emit: t }) {
      const o = $(!1),
        n = $(""),
        l = $(!1),
        r = pe(() => c.value === 1),
        a = pe(() => c.value === 0),
        u = "https://fastcat-book.dev/api",
        i = $(""),
        f = $(""),
        c = $(null),
        d = $(""),
        p = $(!1),
        b = $(null),
        x = $([]),
        A = (T, B) => {
          if (B === "" || B === null) {
            ((c.value = null), (i.value = ""), (f.value = ""));
            return;
          }
          ((c.value = T),
            T === 0
              ? ((i.value = B), (f.value = ""))
              : ((f.value = B), (i.value = "")));
        },
        v = (T) => {
          ((p.value = !0),
            (b.value = T.id),
            (d.value = T.add_on_name),
            (c.value = Number(T.value_type)),
            c.value === 0
              ? ((i.value = T.value), (f.value = ""))
              : ((f.value = T.value), (i.value = "")));
        },
        S = (T) => {
          x.value = x.value.filter((B) => B.id !== T.id);
        },
        _ = () => {
          ((d.value = ""),
            (i.value = ""),
            (f.value = ""),
            (c.value = null),
            (n.value = ""));
        },
        C = async () => {
          if (!d.value.trim()) {
            n.value = "Add name is required";
            return;
          }
          ((n.value = ""), (o.value = !0));
          try {
            const T = c.value === 0 ? i.value : f.value,
              B = Number(T);
            let F = null;
            isNaN(B) || (B < 0 && (F = 0), B > 0 && (F = 1));
            const de = {
                add_on_name: d.value,
                value: Math.abs(B),
                value_type: c.value,
                operator: F,
              },
              re = p.value ? `${u}/add-ons/${b.value}` : `${u}/add-ons`,
              ge = p.value ? "PUT" : "POST";
            if (
              !(
                await fetch(re, {
                  method: ge,
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: JSON.stringify(de),
                })
              ).ok
            )
              throw new Error("Failed to save add on");
            (_(), (p.value = !1), (b.value = null), await k());
          } catch (T) {
            (console.error(T), (n.value = "Failed to save add on."));
          } finally {
            o.value = !1;
          }
        },
        k = async () => {
          try {
            l.value = !0;
            const T = await fetch(`${u}/add-ons`, {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            if (!T.ok) throw new Error("Failed to fetch add ons");
            const B = await T.json();
            x.value = B.data.addOns.map((F) => ({
              id: F.add_on_id,
              add_on_name: F.add_on_name,
              value: F.value,
              operator: F.operator,
              value_type: F.value_type,
            }));
          } catch (T) {
            console.error("Fetch error:", T);
          } finally {
            l.value = !1;
          }
        };
      return (
        De(async () => {
          await k();
        }),
        (T, B) => (
          m(),
          g(
            "div",
            {
              class:
                "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
              onClick: B[8] || (B[8] = (F) => T.$emit("close")),
            },
            [
              s(
                "div",
                {
                  class:
                    "modal-card bg-white rounded-lg shadow-xl w-full max-w-7xl min-h-[40vh]",
                  onClick: B[7] || (B[7] = Se(() => {}, ["stop"])),
                },
                [
                  s("div", Ny, [
                    s("div", Uy, [
                      s(
                        "h2",
                        Dy,
                        w(p.value ? "Edit Add On" : "Create Add On"),
                        1,
                      ),
                      s(
                        "form",
                        {
                          onSubmit: Se(C, ["prevent"]),
                          class: "flex flex-col gap-6 w-full",
                        },
                        [
                          s("div", null, [
                            B[9] ||
                              (B[9] = s(
                                "label",
                                {
                                  class:
                                    "block text-sm font-medium text-gray-700 mb-2",
                                },
                                " Add On Name ",
                                -1,
                              )),
                            oe(
                              s(
                                "input",
                                {
                                  "onUpdate:modelValue":
                                    B[0] || (B[0] = (F) => (d.value = F)),
                                  type: "text",
                                  required: "",
                                  placeholder: "Input Name",
                                  class:
                                    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                                },
                                null,
                                512,
                              ),
                              [[be, d.value]],
                            ),
                          ]),
                          s("div", null, [
                            B[14] ||
                              (B[14] = s(
                                "label",
                                {
                                  class:
                                    "block text-sm font-medium text-gray-700 mb-2",
                                },
                                "Value",
                                -1,
                              )),
                            s("div", Fy, [
                              s("div", Hy, [
                                B[11] ||
                                  (B[11] = s(
                                    "label",
                                    { class: "text-xs text-gray-700" },
                                    " Percentage Amount ",
                                    -1,
                                  )),
                                s("div", zy, [
                                  oe(
                                    s(
                                      "input",
                                      {
                                        "onUpdate:modelValue":
                                          B[1] || (B[1] = (F) => (i.value = F)),
                                        onInput:
                                          B[2] ||
                                          (B[2] = (F) => A(0, F.target.value)),
                                        disabled: r.value,
                                        type: "number",
                                        placeholder: "00.00",
                                        required: "",
                                        class:
                                          "w-full px-3 py-2 pr-10 text-right border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed",
                                      },
                                      null,
                                      40,
                                      Qy,
                                    ),
                                    [[be, i.value]],
                                  ),
                                  B[10] ||
                                    (B[10] = s(
                                      "span",
                                      {
                                        class:
                                          "absolute inset-y-0 right-0 p-3 border-l border-gray-300 flex items-center text-gray-500 text-sm",
                                      },
                                      " % ",
                                      -1,
                                    )),
                                ]),
                              ]),
                              s("div", Ky, [
                                B[13] ||
                                  (B[13] = s(
                                    "label",
                                    { class: "text-xs text-gray-700" },
                                    " Fixed Amount ",
                                    -1,
                                  )),
                                s("div", Yy, [
                                  oe(
                                    s(
                                      "input",
                                      {
                                        "onUpdate:modelValue":
                                          B[3] || (B[3] = (F) => (f.value = F)),
                                        onInput:
                                          B[4] ||
                                          (B[4] = (F) => A(1, F.target.value)),
                                        disabled: a.value,
                                        type: "number",
                                        required: "",
                                        placeholder: "00.00",
                                        class:
                                          "w-full px-3 py-2 pr-14 text-right border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed",
                                      },
                                      null,
                                      40,
                                      Jy,
                                    ),
                                    [[be, f.value]],
                                  ),
                                  B[12] ||
                                    (B[12] = s(
                                      "span",
                                      {
                                        class:
                                          "border-l border-gray-300 p-3 absolute inset-y-0 right-0 flex items-center text-gray-500 text-sm",
                                      },
                                      " PHP ",
                                      -1,
                                    )),
                                ]),
                              ]),
                            ]),
                          ]),
                          s("div", qy, [
                            p.value
                              ? (m(),
                                g(
                                  "button",
                                  {
                                    key: 0,
                                    type: "button",
                                    onClick:
                                      B[5] ||
                                      (B[5] = (F) => {
                                        (_(), (p.value = !1));
                                      }),
                                    class:
                                      "px-4 py-2 text-sm bg-gray-200 rounded-md",
                                  },
                                  " Cancel Edit ",
                                ))
                              : K("", !0),
                            s(
                              "button",
                              {
                                type: "submit",
                                class:
                                  "px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
                                disabled: o.value,
                              },
                              [
                                o.value
                                  ? (m(),
                                    g(
                                      "span",
                                      {
                                        key: 0,
                                        class: "flex items-center gap-2",
                                        disabled: o.value,
                                      },
                                      [
                                        ...(B[15] ||
                                          (B[15] = [
                                            s(
                                              "span",
                                              {
                                                class:
                                                  "inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                                              },
                                              null,
                                              -1,
                                            ),
                                            ye(" Creating Add On ... ", -1),
                                          ])),
                                      ],
                                      8,
                                      Zy,
                                    ))
                                  : (m(),
                                    g(
                                      "span",
                                      Wy,
                                      w(
                                        p.value
                                          ? "Edit Add On"
                                          : "Create Add On",
                                      ),
                                      1,
                                    )),
                              ],
                              8,
                              Gy,
                            ),
                          ]),
                          n.value
                            ? (m(), g("div", Xy, w(n.value), 1))
                            : K("", !0),
                        ],
                        32,
                      ),
                    ]),
                    s("div", ex, [
                      s("div", tx, [
                        s("div", sx, [
                          B[17] ||
                            (B[17] = s(
                              "h2",
                              { class: "text-lg font-semibold text-gray-900" },
                              "Add Ons List",
                              -1,
                            )),
                          s(
                            "button",
                            {
                              onClick: B[6] || (B[6] = (F) => T.$emit("close")),
                              class: "text-gray-400 hover:text-gray-600",
                            },
                            [
                              ...(B[16] ||
                                (B[16] = [
                                  s(
                                    "svg",
                                    {
                                      class: "w-6 h-6",
                                      fill: "none",
                                      stroke: "currentColor",
                                      viewBox: "0 0 24 24",
                                    },
                                    [
                                      s("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        "stroke-width": "2",
                                        d: "M6 18L18 6M6 6l12 12",
                                      }),
                                    ],
                                    -1,
                                  ),
                                ])),
                            ],
                          ),
                        ]),
                        l.value
                          ? (m(),
                            g("div", ox, [
                              ...(B[18] ||
                                (B[18] = [
                                  s(
                                    "div",
                                    {
                                      class:
                                        "flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg",
                                    },
                                    [
                                      s("span", {
                                        class:
                                          "inline-block w-6 h-6 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                                      }),
                                      s(
                                        "span",
                                        {
                                          class:
                                            "font-semibold text-blue-700 text-base",
                                        },
                                        "Loading Add Ons...",
                                      ),
                                    ],
                                    -1,
                                  ),
                                ])),
                            ]))
                          : (m(),
                            g("div", nx, [
                              s("table", lx, [
                                B[19] ||
                                  (B[19] = s(
                                    "thead",
                                    {
                                      class:
                                        "sticky top-0 bg-gray-100 text-sm text-gray-600",
                                    },
                                    [
                                      s("tr", null, [
                                        s(
                                          "th",
                                          {
                                            class:
                                              "px-6 py-4 text-left border-l border-t border-b border-gray-300 rounded-tl-md rounded-bl-md",
                                          },
                                          " # ",
                                        ),
                                        s(
                                          "th",
                                          {
                                            class:
                                              "px-6 py-4 text-left border-t border-b border-gray-300",
                                          },
                                          " Add On Name ",
                                        ),
                                        s(
                                          "th",
                                          {
                                            class:
                                              "px-6 py-4 text-left border-t border-b border-gray-300",
                                          },
                                          " Value ",
                                        ),
                                        s(
                                          "th",
                                          {
                                            class:
                                              "px-6 py-4 text-left border-t border-b border-r border-gray-300 rounded-tr-md rounded-br-md",
                                          },
                                          " Action ",
                                        ),
                                      ]),
                                    ],
                                    -1,
                                  )),
                                s("tbody", rx, [
                                  (m(!0),
                                  g(
                                    q,
                                    null,
                                    le(
                                      x.value,
                                      (F) => (
                                        m(),
                                        g("tr", { key: F.id }, [
                                          s("td", ax, w(F.id), 1),
                                          s("td", ix, w(F.add_on_name), 1),
                                          s(
                                            "td",
                                            dx,
                                            w(F.operator === "0" ? "-" : "") +
                                              " " +
                                              w(
                                                F.value_type === "0"
                                                  ? F.value + " %"
                                                  : F.value + " ₱",
                                              ),
                                            1,
                                          ),
                                          s("td", ux, [
                                            s(
                                              "button",
                                              {
                                                onClick: (de) => v(F),
                                                class:
                                                  "font-medium text-blue-600 hover:text-blue-900 flex items-center",
                                              },
                                              [
                                                Y(ie(ls), {
                                                  class: "w-4 h-4 mr-1",
                                                }),
                                              ],
                                              8,
                                              cx,
                                            ),
                                            s(
                                              "button",
                                              {
                                                onClick: (de) => S(F),
                                                class:
                                                  "font-medium text-red-600 hover:text-red-900 flex items-center",
                                              },
                                              [
                                                Y(ie(la), {
                                                  class: "w-4 h-4 mr-1",
                                                }),
                                              ],
                                              8,
                                              fx,
                                            ),
                                          ]),
                                        ])
                                      ),
                                    ),
                                    128,
                                  )),
                                ]),
                              ]),
                            ])),
                      ]),
                    ]),
                  ]),
                ],
              ),
            ],
          )
        )
      );
    },
  },
  mx = {
    class: "flex items-center justify-between border-b p-6 border-gray-200",
  },
  gx = { class: "text-lg font-semibold text-gray-900" },
  vx = {
    class: "flex items-center justify-end gap-3 pt-6 border-t border-gray-200",
  },
  hx = {
    __name: "ModalAddEditRate",
    props: { accommodationRate: Object, route: Object },
    emits: ["close", "save"],
    setup(e, { emit: t }) {
      const o = e,
        n = t,
        l = Kt({ baseRate: o.accommodationRate?.baseRate ?? 0 });
      Re(
        () => o.accommodationRate,
        (a) => {
          a && (l.baseRate = a.baseRate ?? 0);
        },
      );
      const r = async () => {
        try {
          const a = {
              base_rate: l.baseRate,
              status: o.accommodationRate?.status ?? "active",
            },
            u = await fetch(
              `https://fastcat-book.dev/api/accommodation-rates/${o.accommodationRate.accommodationRateId}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(a),
              },
            ),
            i = await u.json();
          u.ok
            ? (n("save", i), n("close"))
            : console.error("Error saving accommodation rate:", i);
        } catch (a) {
          console.error("Network error:", a);
        }
      };
      return (a, u) => (
        m(),
        g(
          "div",
          {
            class:
              "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
            onClick: u[4] || (u[4] = (i) => a.$emit("close")),
          },
          [
            s(
              "div",
              {
                class:
                  "modal-card bg-white rounded-lg shadow-xl w-full max-w-md mx-4",
                onClick: u[3] || (u[3] = Se(() => {}, ["stop"])),
              },
              [
                s("div", mx, [
                  s(
                    "h2",
                    gx,
                    " Edit Rate: " + w(e.accommodationRate.accommodationName),
                    1,
                  ),
                  s(
                    "button",
                    {
                      onClick: u[0] || (u[0] = (i) => a.$emit("close")),
                      class:
                        "text-gray-400 hover:text-gray-600 transition-colors",
                    },
                    [
                      ...(u[5] ||
                        (u[5] = [
                          s(
                            "svg",
                            {
                              class: "w-6 h-6",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24",
                            },
                            [
                              s("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M6 18L18 6M6 6l12 12",
                              }),
                            ],
                            -1,
                          ),
                        ])),
                    ],
                  ),
                ]),
                s(
                  "form",
                  { onSubmit: Se(r, ["prevent"]), class: "space-y-6 p-6" },
                  [
                    s("div", null, [
                      u[6] ||
                        (u[6] = s(
                          "label",
                          {
                            class:
                              "block text-sm font-medium text-gray-700 mb-2",
                          },
                          " Base Rate ",
                          -1,
                        )),
                      oe(
                        s(
                          "input",
                          {
                            type: "number",
                            "onUpdate:modelValue":
                              u[1] || (u[1] = (i) => (l.baseRate = i)),
                            class:
                              "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                          },
                          null,
                          512,
                        ),
                        [[be, l.baseRate]],
                      ),
                    ]),
                    s("div", vx, [
                      s(
                        "button",
                        {
                          type: "button",
                          onClick: u[2] || (u[2] = (i) => a.$emit("close")),
                          class:
                            "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
                        },
                        " Cancel ",
                      ),
                      u[7] ||
                        (u[7] = s(
                          "button",
                          {
                            type: "submit",
                            class:
                              "px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
                          },
                          " Save ",
                          -1,
                        )),
                    ]),
                  ],
                  32,
                ),
              ],
            ),
          ],
        )
      );
    },
  },
  bx = { key: 0, class: "flex justify-center items-center py-10" },
  yx = { key: 1, class: "text-gray-500 text-center py-10" },
  xx = { key: 2, class: "overflow-auto max-h-[400px]" },
  _x = { class: "min-w-full divide-y divide-gray-200" },
  wx = { class: "bg-white divide-y divide-gray-200" },
  kx = { class: "px-6 py-4 text-sm" },
  Ax = { class: "px-6 py-4 text-sm" },
  Cx = { class: "px-6 py-4 text-sm" },
  $x = { key: 0 },
  Sx = { key: 1 },
  Mx = { class: "px-6 py-4 text-sm text-gray-500" },
  Rx = { key: 0 },
  Ex = { key: 1 },
  Tx = { class: "px-6 py-4 text-sm text-gray-500" },
  Bx = { key: 0 },
  Px = { key: 1 },
  Ix = { class: "px-6 py-4 text-sm text-gray-500" },
  jx = { key: 0 },
  Lx = { key: 1 },
  Ox = { class: "px-6 py-4 text-sm" },
  Vx = ["onClick"],
  Nx = {
    __name: "AccommodationRatesComponent",
    props: { selectedRoute: Object, isRateLoading: Boolean },
    emits: ["edit", "saved"],
    setup(e, { emit: t }) {
      const o = "https://fastcat-book.dev/api",
        n = $(null),
        l = $([]),
        r = $(!1),
        a = $(!1),
        u = e,
        i = (d) => {
          ((n.value = d), (a.value = !0));
        },
        f = async () => {
          console.log("saved");
        },
        c = async (d) => {
          try {
            r.value = !0;
            const p = await fetch(`${o}/accommodation-rates/route/${d}`, {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            if (!p.ok) throw new Error("Failed to fetch accommodation rates");
            const b = await p.json();
            l.value = b.data.accRates.map((x) => ({
              accommodationRateId: x.acc_rate_id,
              accommodationName: x.accommodation?.accommodation_name,
              baseRate: x.base_rate,
              withoutAC: x.without_ac,
              status: x.status,
              updatedAt: x.updated_at
                ? new Date(x.updated_at).toLocaleDateString()
                : null,
            }));
          } catch (p) {
            console.error(p);
          } finally {
            r.value = !1;
          }
        };
      return (
        Re(
          () => u.selectedRoute,
          (d) => {
            d ? c(d.id) : (l.value = []);
          },
          { immediate: !0 },
        ),
        (d, p) => (
          m(),
          g(
            q,
            null,
            [
              r.value
                ? (m(),
                  g("div", bx, [
                    ...(p[1] ||
                      (p[1] = [
                        s(
                          "div",
                          {
                            class:
                              "flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg",
                          },
                          [
                            s("span", {
                              class:
                                "w-6 h-6 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                            }),
                            s(
                              "span",
                              {
                                class: "font-semibold text-blue-700 text-base",
                              },
                              "Loading Accommodation Rates...",
                            ),
                          ],
                          -1,
                        ),
                      ])),
                  ]))
                : e.selectedRoute
                  ? (m(),
                    g("div", xx, [
                      s("table", _x, [
                        p[3] ||
                          (p[3] = s(
                            "thead",
                            { class: "bg-gray-50" },
                            [
                              s("tr", null, [
                                s(
                                  "th",
                                  {
                                    class:
                                      "px-6 py-3 text-left text-xs font-medium text-gray-500",
                                  },
                                  " # ",
                                ),
                                s(
                                  "th",
                                  {
                                    class:
                                      "px-6 py-3 text-left text-xs font-medium text-gray-500",
                                  },
                                  " Type name ",
                                ),
                                s(
                                  "th",
                                  {
                                    class:
                                      "px-6 py-3 text-left text-xs font-medium text-gray-500",
                                  },
                                  " Base Rate ",
                                ),
                                s(
                                  "th",
                                  {
                                    class:
                                      "px-6 py-3 text-left text-xs font-medium text-gray-500",
                                  },
                                  " W/O AC ",
                                ),
                                s(
                                  "th",
                                  {
                                    class:
                                      "px-6 py-3 text-left text-xs font-medium text-gray-500",
                                  },
                                  " Updated ",
                                ),
                                s(
                                  "th",
                                  {
                                    class:
                                      "px-6 py-3 text-left text-xs font-medium text-gray-500",
                                  },
                                  " User ",
                                ),
                                s(
                                  "th",
                                  {
                                    class:
                                      "px-6 py-3 text-left text-xs font-medium text-gray-500",
                                  },
                                  " Status ",
                                ),
                                s(
                                  "th",
                                  {
                                    class:
                                      "px-6 py-3 text-left text-xs font-medium text-gray-500",
                                  },
                                  " Actions ",
                                ),
                              ]),
                            ],
                            -1,
                          )),
                        s("tbody", wx, [
                          (m(!0),
                          g(
                            q,
                            null,
                            le(
                              l.value,
                              (b, x) => (
                                m(),
                                g(
                                  "tr",
                                  {
                                    key: b.accommodationRateId,
                                    class: "hover:bg-gray-50",
                                  },
                                  [
                                    s("td", kx, w(x + 1), 1),
                                    s("td", Ax, w(b.accommodationName), 1),
                                    s("td", Cx, [
                                      b.baseRate === null
                                        ? (m(), g("span", $x, "—"))
                                        : (m(),
                                          g(
                                            "span",
                                            Sx,
                                            "₱" + w(b.baseRate),
                                            1,
                                          )),
                                    ]),
                                    s("td", Mx, [
                                      b.withoutAC === null
                                        ? (m(), g("span", Rx, "—"))
                                        : (m(),
                                          g(
                                            "span",
                                            Ex,
                                            "₱" + w(b.withoutAC),
                                            1,
                                          )),
                                    ]),
                                    s("td", Tx, [
                                      b.updatedAt === null
                                        ? (m(), g("span", Bx, "—"))
                                        : (m(),
                                          g("span", Px, w(b.updatedAt), 1)),
                                    ]),
                                    p[2] ||
                                      (p[2] = s(
                                        "td",
                                        {
                                          class:
                                            "px-6 py-4 text-sm text-gray-500",
                                        },
                                        "—",
                                        -1,
                                      )),
                                    s("td", Ix, [
                                      b.status === null
                                        ? (m(), g("span", jx, "—"))
                                        : (m(), g("span", Lx, w(b.status), 1)),
                                    ]),
                                    s("td", Ox, [
                                      s(
                                        "button",
                                        {
                                          onClick: (A) => i(b),
                                          class:
                                            "font-medium text-blue-600 hover:text-blue-900 flex items-center",
                                        },
                                        [Y(ie(ls), { class: "w-4 h-4 mr-1" })],
                                        8,
                                        Vx,
                                      ),
                                    ]),
                                  ],
                                )
                              ),
                            ),
                            128,
                          )),
                        ]),
                      ]),
                    ]))
                  : (m(), g("div", yx, " Select a route to view details. ")),
              Y(
                Ie,
                { name: "modal-fade" },
                {
                  default: $e(() => [
                    a.value
                      ? (m(),
                        ke(
                          hx,
                          {
                            key: 0,
                            accommodationRate: n.value,
                            route: e.selectedRoute,
                            onClose: p[0] || (p[0] = (b) => (a.value = !1)),
                            onSaved: f,
                          },
                          null,
                          8,
                          ["accommodationRate", "route"],
                        ))
                      : K("", !0),
                  ]),
                  _: 1,
                },
              ),
            ],
            64,
          )
        )
      );
    },
  },
  Ux = {
    key: 0,
    class:
      "fixed top-6 right-6 z-[100] flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg",
  },
  Dx = {
    class: "flex items-center justify-between p-6 border-b border-gray-200",
  },
  Fx = { class: "flex flex-col" },
  Hx = { class: "text-lg font-semibold text-gray-900" },
  zx = {
    class: "flex items-center justify-end gap-3 pt-6 border-t border-gray-200",
  },
  Qx = ["disabled"],
  Kx = { key: 0, class: "flex items-center gap-2" },
  Yx = { key: 1 },
  Jx = { key: 0, class: "text-red-500 text-sm mt-2 text-center" },
  qx = {
    __name: "ModalEditVehicleRate",
    props: { vehicle: { type: Object, default: () => ({}) } },
    emits: ["close", "save"],
    setup(e, { emit: t }) {
      const o = t,
        n = e;
      console.log(n.vehicle);
      const l = Kt({
          vehicleType: n.vehicle?.vehicleType || "",
          vehicleClass: n.vehicle?.vehicleClass || "",
          vehicleRate: n.vehicle?.vehicleRate || "",
          status: n.vehicle?.status || "active",
          vehicleRateId: n.vehicle?.vehicleRateId || "",
        }),
        r = $(!1),
        a = $(""),
        u = async () => {
          if (!l.vehicleRate) {
            a.value = "Vehicle rate is required";
            return;
          }
          ((r.value = !0), (a.value = ""));
          try {
            const i = { vehicle_rate: l.vehicleRate },
              f = await fetch(
                `https://fastcat-book.dev/api/vehicle-rates/${l.vehicleRateId}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: JSON.stringify(i),
                },
              ),
              c = await f.json();
            if (!f.ok) throw new Error(c.message || "Failed to save");
            (o("save"), o("close"));
          } catch (i) {
            (console.error("Error saving vehicle:", i),
              (a.value = i.message || "Something went wrong"));
          } finally {
            r.value = !1;
          }
        };
      return (i, f) => (
        m(),
        g(
          "div",
          {
            class:
              "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
            onClick: f[4] || (f[4] = (c) => i.$emit("close")),
          },
          [
            r.value
              ? (m(),
                g("div", Ux, [
                  ...(f[5] ||
                    (f[5] = [
                      s(
                        "span",
                        {
                          class:
                            "inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                        },
                        null,
                        -1,
                      ),
                      s(
                        "span",
                        { class: "font-semibold text-blue-700 text-base" },
                        "Saving data...",
                        -1,
                      ),
                    ])),
                ]))
              : K("", !0),
            s(
              "div",
              {
                class:
                  "modal-card bg-white rounded-lg shadow-xl w-full max-w-md mx-4",
                onClick: f[3] || (f[3] = Se(() => {}, ["stop"])),
              },
              [
                s("div", Dx, [
                  s("div", Fx, [
                    f[6] ||
                      (f[6] = s(
                        "h2",
                        { class: "text-lg font-semibold text-gray-900" },
                        "Edit Vehicle Rate",
                        -1,
                      )),
                    s(
                      "h2",
                      Hx,
                      " Type " + w(l.vehicleType) + ": " + w(l.vehicleClass),
                      1,
                    ),
                  ]),
                  s(
                    "button",
                    {
                      onClick: f[0] || (f[0] = (c) => i.$emit("close")),
                      class: "text-gray-400 hover:text-gray-600",
                    },
                    [
                      ...(f[7] ||
                        (f[7] = [
                          s(
                            "svg",
                            {
                              class: "w-6 h-6",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24",
                            },
                            [
                              s("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M6 18L18 6M6 6l12 12",
                              }),
                            ],
                            -1,
                          ),
                        ])),
                    ],
                  ),
                ]),
                s(
                  "form",
                  { onSubmit: Se(u, ["prevent"]), class: "p-6 space-y-6" },
                  [
                    s("div", null, [
                      f[8] ||
                        (f[8] = s(
                          "label",
                          {
                            class:
                              "block text-sm font-medium text-gray-700 mb-2",
                          },
                          " Vehicle Rate ",
                          -1,
                        )),
                      oe(
                        s(
                          "input",
                          {
                            type: "number",
                            "onUpdate:modelValue":
                              f[1] || (f[1] = (c) => (l.vehicleRate = c)),
                            class:
                              "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                          },
                          null,
                          512,
                        ),
                        [[be, l.vehicleRate]],
                      ),
                    ]),
                    s("div", zx, [
                      s(
                        "button",
                        {
                          type: "button",
                          onClick: f[2] || (f[2] = (c) => i.$emit("close")),
                          class:
                            "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
                        },
                        " Cancel ",
                      ),
                      s(
                        "button",
                        {
                          type: "submit",
                          class:
                            "px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
                          disabled: r.value,
                        },
                        [
                          r.value
                            ? (m(),
                              g("span", Kx, [
                                ...(f[9] ||
                                  (f[9] = [
                                    s(
                                      "span",
                                      {
                                        class:
                                          "inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                                      },
                                      null,
                                      -1,
                                    ),
                                    ye(" Saving... ", -1),
                                  ])),
                              ]))
                            : (m(), g("span", Yx, "Save")),
                        ],
                        8,
                        Qx,
                      ),
                    ]),
                    a.value ? (m(), g("div", Jx, w(a.value), 1)) : K("", !0),
                  ],
                  32,
                ),
              ],
            ),
          ],
        )
      );
    },
  },
  Gx = { key: 0, class: "flex justify-center items-center py-10" },
  Zx = { key: 1, class: "text-gray-500 text-center py-10" },
  Wx = { key: 2, class: "overflow-auto max-h-[400px]" },
  Xx = { class: "min-w-full divide-y divide-gray-200" },
  e2 = { class: "bg-white divide-y divide-gray-200" },
  t2 = { class: "px-6 py-4 text-sm" },
  s2 = { class: "px-6 py-4 text-sm" },
  o2 = { class: "px-6 py-4 text-sm" },
  n2 = { class: "px-6 py-4 text-sm" },
  l2 = { key: 0 },
  r2 = { key: 1 },
  a2 = { class: "px-6 py-4 text-sm text-gray-500" },
  i2 = { key: 0 },
  d2 = { key: 1 },
  u2 = { class: "px-6 py-4 text-sm text-gray-500" },
  c2 = { key: 0 },
  f2 = { key: 1 },
  p2 = { class: "px-6 py-4 text-sm" },
  m2 = ["onClick"],
  g2 = {
    __name: "VehicleRatesComponent",
    props: { selectedRoute: Object, isRateLoading: Boolean },
    emits: ["edit", "saved"],
    setup(e, { emit: t }) {
      const o = "https://fastcat-book.dev/api",
        n = $(!1),
        l = $(null),
        r = $([]),
        a = $(!1),
        u = e,
        i = (d) => {
          ((l.value = d), (n.value = !0));
        },
        f = async () => {
          ((n.value = !1), await c());
        },
        c = async (d) => {
          try {
            a.value = !0;
            const p = await fetch(`${o}/vehicle-rates/route/${d}`, {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            if (!p.ok) throw new Error("Failed to fetch vehicle rates");
            const b = await p.json();
            r.value = b.data.vehicleRates.map((x) => ({
              vehicleRateId: x.vehicle_rate_id,
              vehicleType: x.vehicle?.vehicle_type,
              vehicleClass: x.vehicle?.vehicle_class,
              vehicleRate: x.vehicle_rate,
              status: x.status,
              updatedAt: x.updated_at
                ? new Date(x.updated_at).toLocaleDateString()
                : null,
            }));
          } catch (p) {
            console.error(p);
          } finally {
            a.value = !1;
          }
        };
      return (
        Re(
          () => u.selectedRoute,
          (d) => {
            d ? c(d.id) : (accommodations.value = []);
          },
          { immediate: !0 },
        ),
        (d, p) => (
          m(),
          g(
            q,
            null,
            [
              a.value
                ? (m(),
                  g("div", Gx, [
                    ...(p[1] ||
                      (p[1] = [
                        s(
                          "div",
                          {
                            class:
                              "flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg",
                          },
                          [
                            s("span", {
                              class:
                                "w-6 h-6 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                            }),
                            s(
                              "span",
                              {
                                class: "font-semibold text-blue-700 text-base",
                              },
                              "Loading Vehicles Rates...",
                            ),
                          ],
                          -1,
                        ),
                      ])),
                  ]))
                : e.selectedRoute
                  ? (m(),
                    g("div", Wx, [
                      s("table", Xx, [
                        p[3] ||
                          (p[3] = s(
                            "thead",
                            { class: "bg-gray-50" },
                            [
                              s("tr", null, [
                                s(
                                  "th",
                                  {
                                    class:
                                      "px-6 py-3 text-left text-xs font-medium text-gray-500",
                                  },
                                  " # ",
                                ),
                                s(
                                  "th",
                                  {
                                    class:
                                      "px-6 py-3 text-left text-xs font-medium text-gray-500",
                                  },
                                  " Type Number ",
                                ),
                                s(
                                  "th",
                                  {
                                    class:
                                      "px-6 py-3 text-left text-xs font-medium text-gray-500",
                                  },
                                  " Type Class ",
                                ),
                                s(
                                  "th",
                                  {
                                    class:
                                      "px-6 py-3 text-left text-xs font-medium text-gray-500",
                                  },
                                  " Vehicle Rate ",
                                ),
                                s(
                                  "th",
                                  {
                                    class:
                                      "px-6 py-3 text-left text-xs font-medium text-gray-500",
                                  },
                                  " Updated ",
                                ),
                                s(
                                  "th",
                                  {
                                    class:
                                      "px-6 py-3 text-left text-xs font-medium text-gray-500",
                                  },
                                  " User ",
                                ),
                                s(
                                  "th",
                                  {
                                    class:
                                      "px-6 py-3 text-left text-xs font-medium text-gray-500",
                                  },
                                  " Status ",
                                ),
                                s(
                                  "th",
                                  {
                                    class:
                                      "px-6 py-3 text-left text-xs font-medium text-gray-500",
                                  },
                                  " Actions ",
                                ),
                              ]),
                            ],
                            -1,
                          )),
                        s("tbody", e2, [
                          (m(!0),
                          g(
                            q,
                            null,
                            le(
                              r.value,
                              (b, x) => (
                                m(),
                                g(
                                  "tr",
                                  {
                                    key: b.vehicleRateId,
                                    class: "hover:bg-gray-50",
                                  },
                                  [
                                    s("td", t2, w(x + 1), 1),
                                    s("td", s2, w(b.vehicleType), 1),
                                    s("td", o2, w(b.vehicleClass), 1),
                                    s("td", n2, [
                                      b.vehicleRate === null
                                        ? (m(), g("span", l2, "—"))
                                        : (m(),
                                          g(
                                            "span",
                                            r2,
                                            "₱" + w(b.vehicleRate),
                                            1,
                                          )),
                                    ]),
                                    s("td", a2, [
                                      b.updatedAt === null
                                        ? (m(), g("span", i2, "—"))
                                        : (m(),
                                          g("span", d2, w(b.updatedAt), 1)),
                                    ]),
                                    p[2] ||
                                      (p[2] = s(
                                        "td",
                                        {
                                          class:
                                            "px-6 py-4 text-sm text-gray-500",
                                        },
                                        "—",
                                        -1,
                                      )),
                                    s("td", u2, [
                                      b.status === null
                                        ? (m(), g("span", c2, "—"))
                                        : (m(), g("span", f2, w(b.status), 1)),
                                    ]),
                                    s("td", p2, [
                                      s(
                                        "button",
                                        {
                                          onClick: (A) => i(b),
                                          class:
                                            "font-medium text-blue-600 hover:text-blue-900 flex items-center",
                                        },
                                        [Y(ie(ls), { class: "w-4 h-4 mr-1" })],
                                        8,
                                        m2,
                                      ),
                                    ]),
                                  ],
                                )
                              ),
                            ),
                            128,
                          )),
                        ]),
                      ]),
                    ]))
                  : (m(), g("div", Zx, " Select a route to view details. ")),
              Y(
                Ie,
                { name: "modal-fade" },
                {
                  default: $e(() => [
                    n.value
                      ? (m(),
                        ke(
                          qx,
                          {
                            key: 0,
                            vehicle: l.value,
                            onClose: p[0] || (p[0] = (b) => (n.value = !1)),
                            onSave: f,
                          },
                          null,
                          8,
                          ["vehicle"],
                        ))
                      : K("", !0),
                  ]),
                  _: 1,
                },
              ),
            ],
            64,
          )
        )
      );
    },
  },
  v2 = { class: "grid md:grid-cols-[380px_1fr] gap-6" },
  h2 = { class: "bg-white rounded-lg shadow-sm" },
  b2 = { class: "p-6" },
  y2 = { class: "flex items-center mb-4" },
  x2 = { class: "relative w-full" },
  _2 = { key: 0, class: "flex justify-center items-center py-8" },
  w2 = { key: 1, class: "overflow-auto max-h-[400px]" },
  k2 = { class: "min-w-full divide-y divide-gray-200" },
  A2 = { class: "bg-white divide-y divide-gray-200" },
  C2 = ["onClick"],
  $2 = { class: "px-6 py-4 text-sm text-blue-600 font-bold" },
  S2 = { class: "px-6 py-4 text-sm" },
  M2 = { class: "bg-white rounded-lg shadow-sm" },
  R2 = { class: "p-6" },
  E2 = { class: "flex justify-between items-center mb-2" },
  T2 = { class: "text-lg font-medium text-gray-900" },
  B2 = {
    class: "border border-gray-300 mb-2 rounded-lg bg-gray-200 inline-block",
  },
  P2 = { class: "flex space-x-4 p-1" },
  I2 = ["onClick"],
  j2 = {
    __name: "RatesModule",
    emits: ["edit", "saved"],
    setup(e, { emit: t }) {
      const o = "https://fastcat-book.dev/api",
        n = [
          { id: "accommodation", name: "Accommodations" },
          { id: "vehicle", name: "Vehicles" },
        ],
        l = $("accommodation"),
        r = $(!1),
        a = $([]),
        u = $(null),
        i = $(""),
        f = $(!1),
        c = $(!1),
        d = pe(() => {
          if (!i.value) return a.value;
          const A = i.value.toLowerCase();
          return a.value.filter((v) => v.route_name.toLowerCase().includes(A));
        }),
        p = async () => {
          f.value = !0;
          const A = localStorage.getItem("token"),
            S = await (
              await fetch(`${o}/routes`, { headers: { Authorization: A } })
            ).json();
          ((a.value = S.data.routes.map((_) => ({
            id: _.route_id,
            route_name: `${_.port_a.port_name} - ${_.port_b.port_name}`,
          }))),
            (f.value = !1));
        },
        b = async () => {
          (x(), u.value && (await fetchRouteAccRates(u.value)));
        },
        x = () => {
          r.value = !1;
        };
      return (
        De(async () => {
          await p();
        }),
        (A, v) => (
          m(),
          g(
            q,
            null,
            [
              s("div", v2, [
                s("div", h2, [
                  s("div", b2, [
                    v[3] ||
                      (v[3] = s(
                        "h2",
                        { class: "text-lg font-medium text-gray-900 mb-4" },
                        "List of Route",
                        -1,
                      )),
                    s("div", y2, [
                      s("div", x2, [
                        Y(ie(Bt), {
                          class:
                            "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4",
                        }),
                        oe(
                          s(
                            "input",
                            {
                              "onUpdate:modelValue":
                                v[0] || (v[0] = (S) => (i.value = S)),
                              type: "text",
                              placeholder: "Search",
                              class:
                                "pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full",
                            },
                            null,
                            512,
                          ),
                          [[be, i.value]],
                        ),
                      ]),
                    ]),
                    s("div", null, [
                      f.value
                        ? (m(),
                          g("div", _2, [
                            ...(v[1] ||
                              (v[1] = [
                                s(
                                  "div",
                                  {
                                    class:
                                      "flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg",
                                  },
                                  [
                                    s("span", {
                                      class:
                                        "inline-block w-6 h-6 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                                    }),
                                    s(
                                      "span",
                                      {
                                        class:
                                          "font-semibold text-blue-700 text-base",
                                      },
                                      "Loading routes...",
                                    ),
                                  ],
                                  -1,
                                ),
                              ])),
                          ]))
                        : (m(),
                          g("div", w2, [
                            s("table", k2, [
                              v[2] ||
                                (v[2] = s(
                                  "thead",
                                  { class: "bg-gray-50" },
                                  [
                                    s("tr", null, [
                                      s(
                                        "th",
                                        {
                                          class:
                                            "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                        },
                                        " # ",
                                      ),
                                      s(
                                        "th",
                                        {
                                          class:
                                            "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                        },
                                        " Route ",
                                      ),
                                    ]),
                                  ],
                                  -1,
                                )),
                              s("tbody", A2, [
                                (m(!0),
                                g(
                                  q,
                                  null,
                                  le(
                                    d.value,
                                    (S) => (
                                      m(),
                                      g(
                                        "tr",
                                        {
                                          key: S.id,
                                          onClick: (_) => (u.value = S),
                                          class: Z([
                                            "hover:bg-gray-50 cursor-pointer",
                                            {
                                              "bg-blue-50":
                                                u.value && u.value.id === S.id,
                                            },
                                          ]),
                                        },
                                        [
                                          s("td", $2, w(S.id), 1),
                                          s("td", S2, [
                                            s(
                                              "span",
                                              {
                                                class: Z(
                                                  u.value && u.value.id === S.id
                                                    ? "text-blue-600 font-bold underline"
                                                    : "text-gray-900",
                                                ),
                                              },
                                              w(S.route_name),
                                              3,
                                            ),
                                          ]),
                                        ],
                                        10,
                                        C2,
                                      )
                                    ),
                                  ),
                                  128,
                                )),
                              ]),
                            ]),
                          ])),
                    ]),
                  ]),
                ]),
                s("div", M2, [
                  s("div", R2, [
                    s("div", E2, [
                      s(
                        "h2",
                        T2,
                        w(
                          u.value
                            ? u.value.route_name + " Rate"
                            : "No Route Selected",
                        ),
                        1,
                      ),
                    ]),
                    s("div", B2, [
                      s("nav", P2, [
                        (m(),
                        g(
                          q,
                          null,
                          le(n, (S) =>
                            s(
                              "button",
                              {
                                key: S.id,
                                onClick: (_) => (l.value = S.id),
                                class: Z([
                                  "p-2 font-medium text-sm rounded-md",
                                  l.value === S.id
                                    ? "bg-white"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-bold",
                                ]),
                              },
                              w(S.name),
                              11,
                              I2,
                            ),
                          ),
                          64,
                        )),
                      ]),
                    ]),
                    l.value === "accommodation"
                      ? (m(),
                        ke(
                          Nx,
                          {
                            key: 0,
                            selectedRoute: u.value,
                            isRateLoading: c.value,
                          },
                          null,
                          8,
                          ["selectedRoute", "isRateLoading"],
                        ))
                      : K("", !0),
                    l.value === "vehicle"
                      ? (m(),
                        ke(
                          g2,
                          {
                            key: 1,
                            selectedRoute: u.value,
                            isRateLoading: c.value,
                          },
                          null,
                          8,
                          ["selectedRoute", "isRateLoading"],
                        ))
                      : K("", !0),
                  ]),
                ]),
              ]),
              Y(
                Ie,
                { name: "modal-fade" },
                {
                  default: $e(() => [
                    r.value
                      ? (m(), ke(px, { key: 0, onClose: x, onSaved: b }))
                      : K("", !0),
                  ]),
                  _: 1,
                },
              ),
            ],
            64,
          )
        )
      );
    },
  },
  L2 = {
    key: 0,
    class:
      "fixed top-6 right-6 z-[100] flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg",
  },
  O2 = { class: "flex items-center justify-between p-6 border-b" },
  V2 = { class: "text-lg font-semibold text-gray-900" },
  N2 = { class: "text-sm text-gray-500 mt-1" },
  U2 = { class: "relative" },
  D2 = { class: "flex items-center gap-3" },
  F2 = ["disabled"],
  H2 = { class: "text-sm text-gray-700" },
  z2 = { class: "flex justify-end gap-3 pt-4 border-t" },
  Q2 = ["disabled"],
  K2 = { key: 0, class: "text-red-500 text-sm text-center" },
  Y2 = {
    __name: "ModalCreatePassengerType",
    props: { editData: { type: Object, default: null } },
    emits: ["saved", "close"],
    setup(e, { emit: t }) {
      const o = t,
        n = e,
        l = "https://fastcat-book.dev/api",
        r = $(!1),
        a = $(!1),
        u = $(""),
        i = $({ passengerTypeName: "", selectedDiscount: "" });
      Re(
        () => n.editData,
        (c) => {
          c
            ? ((i.value.passengerTypeName = c.type || ""),
              (i.value.selectedDiscount =
                c.discount != null ? Number(c.discount) * 100 : ""),
              (r.value = c.waived ?? !1))
            : ((i.value.passengerTypeName = ""),
              (i.value.selectedDiscount = ""),
              (r.value = !1));
        },
        { immediate: !0 },
      );
      const f = async () => {
        if (!i.value.passengerTypeName) {
          u.value = "Passenger type name is required.";
          return;
        }
        ((a.value = !0), (u.value = ""));
        try {
          const c = localStorage.getItem("token"),
            d = {
              type: i.value.passengerTypeName.trim(),
              discount: Number(i.value.selectedDiscount) / 100,
              waived: r.value,
            },
            p = !!n.editData,
            b = p
              ? `${l}/passenger-types/${n.editData.p_id}`
              : `${l}/passenger-types`,
            A = await fetch(b, {
              method: p ? "PUT" : "POST",
              headers: { "Content-Type": "application/json", Authorization: c },
              body: JSON.stringify(d),
            }),
            v = await A.json();
          A.ok && v.success
            ? (o("saved", v.data), o("close"))
            : (u.value = v?.error?.includes("Duplicate entry")
                ? "This passenger type already exists."
                : v.message || "Failed to save passenger type.");
        } catch (c) {
          (console.error(c), (u.value = "Network error. Please try again."));
        } finally {
          a.value = !1;
        }
      };
      return (c, d) => (
        m(),
        g(
          "div",
          {
            class:
              "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
            onClick: d[6] || (d[6] = (p) => c.$emit("close")),
          },
          [
            a.value
              ? (m(),
                g("div", L2, [
                  ...(d[7] ||
                    (d[7] = [
                      s(
                        "span",
                        {
                          class:
                            "inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                        },
                        null,
                        -1,
                      ),
                      s(
                        "span",
                        { class: "font-semibold text-blue-700 text-base" },
                        "Saving data...",
                        -1,
                      ),
                    ])),
                ]))
              : K("", !0),
            s(
              "div",
              {
                class: "bg-white rounded-lg shadow-xl w-full max-w-md mx-4",
                onClick: d[5] || (d[5] = Se(() => {}, ["stop"])),
              },
              [
                s("div", O2, [
                  s("div", null, [
                    s(
                      "h2",
                      V2,
                      w(
                        n.editData
                          ? "Edit Passenger Type"
                          : "Create Passenger Type",
                      ),
                      1,
                    ),
                    s(
                      "p",
                      N2,
                      w(
                        n.editData
                          ? "Edit passenger type and discount percentage."
                          : "Create passenger type and input discount percentage.",
                      ),
                      1,
                    ),
                  ]),
                  s(
                    "button",
                    {
                      onClick: d[0] || (d[0] = (p) => c.$emit("close")),
                      class: "text-gray-400 hover:text-gray-600",
                    },
                    " ✕ ",
                  ),
                ]),
                s(
                  "form",
                  { onSubmit: Se(f, ["prevent"]), class: "p-6 space-y-6" },
                  [
                    s("div", null, [
                      d[8] ||
                        (d[8] = s(
                          "label",
                          {
                            class:
                              "block text-sm font-medium text-gray-700 mb-2",
                          },
                          " Passenger Type Name ",
                          -1,
                        )),
                      oe(
                        s(
                          "input",
                          {
                            type: "text",
                            placeholder: "Input Passenger Type name",
                            "onUpdate:modelValue":
                              d[1] ||
                              (d[1] = (p) => (i.value.passengerTypeName = p)),
                            class:
                              "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500",
                            required: "",
                          },
                          null,
                          512,
                        ),
                        [[be, i.value.passengerTypeName]],
                      ),
                    ]),
                    s("div", null, [
                      d[10] ||
                        (d[10] = s(
                          "label",
                          {
                            class:
                              "block text-sm font-medium text-gray-700 mb-2",
                          },
                          " Discount Percentage ",
                          -1,
                        )),
                      s("div", U2, [
                        oe(
                          s(
                            "input",
                            {
                              type: "number",
                              step: "0.01",
                              min: "0",
                              max: "100",
                              placeholder: "Enter discount (ex: 20)",
                              "onUpdate:modelValue":
                                d[2] ||
                                (d[2] = (p) => (i.value.selectedDiscount = p)),
                              class:
                                "w-full px-3 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-blue-500",
                              required: "",
                            },
                            null,
                            512,
                          ),
                          [[be, i.value.selectedDiscount]],
                        ),
                        d[9] ||
                          (d[9] = s(
                            "span",
                            {
                              class:
                                "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500",
                            },
                            " % ",
                            -1,
                          )),
                      ]),
                    ]),
                    s("div", D2, [
                      oe(
                        s(
                          "input",
                          {
                            type: "checkbox",
                            "onUpdate:modelValue":
                              d[3] || (d[3] = (p) => (r.value = p)),
                            class: "w-5 h-5 accent-green-600",
                            disabled: a.value,
                          },
                          null,
                          8,
                          F2,
                        ),
                        [[We, r.value]],
                      ),
                      s("span", H2, w(r.value ? "Waived" : "Not Waived"), 1),
                    ]),
                    s("div", z2, [
                      s(
                        "button",
                        {
                          type: "button",
                          onClick: d[4] || (d[4] = (p) => c.$emit("close")),
                          class:
                            "px-4 py-2 border rounded-md hover:bg-gray-100",
                        },
                        " Cancel ",
                      ),
                      s(
                        "button",
                        {
                          type: "submit",
                          class:
                            "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50",
                          disabled: a.value,
                        },
                        w(
                          a.value
                            ? "Saving..."
                            : n.editData
                              ? "Save changes"
                              : "Save",
                        ),
                        9,
                        Q2,
                      ),
                    ]),
                    u.value ? (m(), g("div", K2, w(u.value), 1)) : K("", !0),
                  ],
                  32,
                ),
              ],
            ),
          ],
        )
      );
    },
  },
  J2 = { class: "bg-white rounded-lg shadow-sm" },
  q2 = { class: "p-6" },
  G2 = { class: "flex justify-between items-center mb-4" },
  Z2 = { class: "min-w-full divide-y divide-gray-200" },
  W2 = { class: "bg-white divide-y divide-gray-200" },
  X2 = { class: "px-6 py-4 text-sm" },
  e_ = { class: "px-6 py-4 text-sm" },
  t_ = { class: "px-6 py-4 text-sm" },
  s_ = { class: "px-6 py-4 text-sm" },
  o_ = { class: "px-6 py-4 text-sm" },
  n_ = { class: "px-6 py-4 text-sm" },
  l_ = ["onClick"],
  r_ = {
    __name: "PassengerTypesModule",
    setup(e) {
      const t = "https://fastcat-book.dev/api",
        o = $([]),
        n = $(!1),
        l = $(null),
        r = async () => {
          const c = localStorage.getItem("token");
          try {
            const d = await fetch(`${t}/passenger-types`, {
                headers: { Authorization: c },
              }),
              p = await d.json();
            d.ok && p.success && (o.value = p.data.types);
          } catch (d) {
            console.error("Failed to fetch passenger types:", d);
          }
        },
        a = () => {
          (r(), f());
        },
        u = () => {
          ((l.value = null), (n.value = !0));
        },
        i = (c) => {
          ((l.value = c), (n.value = !0));
        },
        f = () => {
          ((n.value = !1), (l.value = null));
        };
      return (
        De(r),
        (c, d) => (
          m(),
          g("div", J2, [
            s("div", q2, [
              s("div", G2, [
                d[1] ||
                  (d[1] = s(
                    "h2",
                    { class: "text-lg font-medium text-gray-900" },
                    "Passenger Type Lists",
                    -1,
                  )),
                s(
                  "button",
                  {
                    onClick: u,
                    class:
                      "bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2",
                  },
                  [
                    Y(ie(Yt), { class: "w-4 h-4" }),
                    d[0] || (d[0] = ye(" Create ", -1)),
                  ],
                ),
              ]),
              s("table", Z2, [
                d[2] ||
                  (d[2] = s(
                    "thead",
                    { class: "bg-gray-50" },
                    [
                      s("tr", null, [
                        s(
                          "th",
                          {
                            class: "px-6 py-3 text-left text-xs text-gray-500",
                          },
                          "#",
                        ),
                        s(
                          "th",
                          {
                            class: "px-6 py-3 text-left text-xs text-gray-500",
                          },
                          "Type",
                        ),
                        s(
                          "th",
                          {
                            class: "px-6 py-3 text-left text-xs text-gray-500",
                          },
                          "Discount",
                        ),
                        s(
                          "th",
                          {
                            class: "px-6 py-3 text-left text-xs text-gray-500",
                          },
                          "Waived",
                        ),
                        s(
                          "th",
                          {
                            class: "px-6 py-3 text-left text-xs text-gray-500",
                          },
                          "Status",
                        ),
                        s(
                          "th",
                          {
                            class: "px-6 py-3 text-left text-xs text-gray-500",
                          },
                          "Action",
                        ),
                      ]),
                    ],
                    -1,
                  )),
                s("tbody", W2, [
                  (m(!0),
                  g(
                    q,
                    null,
                    le(
                      o.value,
                      (p) => (
                        m(),
                        g("tr", { key: p.p_id, class: "hover:bg-gray-50" }, [
                          s("td", X2, w(p.p_id), 1),
                          s("td", e_, w(p.type), 1),
                          s("td", t_, w(Number(p.discount) * 100) + "%", 1),
                          s("td", s_, w(p.waived ? "✅" : "❌"), 1),
                          s("td", o_, w(p.status), 1),
                          s("td", n_, [
                            s(
                              "button",
                              {
                                onClick: (b) => i(p),
                                class:
                                  "text-blue-600 hover:text-blue-900 flex items-center",
                              },
                              [Y(ie(ls), { class: "w-4 h-4 mr-1" })],
                              8,
                              l_,
                            ),
                          ]),
                        ])
                      ),
                    ),
                    128,
                  )),
                ]),
              ]),
            ]),
            Y(
              Ie,
              { name: "modal-fade" },
              {
                default: $e(() => [
                  n.value
                    ? (m(),
                      ke(
                        Y2,
                        { key: 0, editData: l.value, onClose: f, onSaved: a },
                        null,
                        8,
                        ["editData"],
                      ))
                    : K("", !0),
                ]),
                _: 1,
              },
            ),
          ])
        )
      );
    },
  },
  a_ = { class: "min-h-full bg-gray-50 p-6" },
  i_ = {
    class: "border border-gray-300 mb-2 rounded-lg bg-gray-200 inline-block",
  },
  d_ = { class: "flex space-x-4 p-1" },
  u_ = ["onClick"],
  c_ = { class: "mt-6" },
  f_ = {
    __name: "RatePassengerLayout",
    setup(e) {
      const t = $("rate"),
        o = [
          { id: "rate", name: "Rates" },
          { id: "discount", name: "Passenger Type" },
        ];
      return (n, l) => (
        m(),
        g("div", a_, [
          l[0] ||
            (l[0] = Bo(
              '<div class="mb-6"><nav class="text-sm text-gray-500 mb-2"><span>Dashboard</span> <span class="mx-2">&gt;</span><span class="text-gray-900">Rates/Passenger Types</span></nav><div class="flex justify-between items-center"><h1 class="text-2xl font-semibold text-gray-900"> Rates/Passenger Types </h1></div></div>',
              1,
            )),
          s("div", i_, [
            s("nav", d_, [
              (m(),
              g(
                q,
                null,
                le(o, (r) =>
                  s(
                    "button",
                    {
                      key: r.id,
                      onClick: (a) => (t.value = r.id),
                      class: Z([
                        "py-2 px-2 font-medium text-sm rounded-md",
                        t.value === r.id
                          ? "bg-white"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-bold",
                      ]),
                    },
                    w(r.name),
                    11,
                    u_,
                  ),
                ),
                64,
              )),
            ]),
          ]),
          s("div", c_, [
            t.value === "rate"
              ? (m(), ke(j2, { key: 0 }))
              : t.value === "discount"
                ? (m(), ke(r_, { key: 1 }))
                : K("", !0),
          ]),
        ])
      );
    },
  },
  p_ = { class: "min-h-full bg-gray-50 p-6" },
  m_ = {
    class: "border border-gray-300 mb-4 rounded-lg bg-gray-200 inline-block",
  },
  g_ = { class: "flex space-x-4 px-2 py-2" },
  v_ = ["onClick"],
  h_ = { class: "border border-gray-300 bg-white rounded-lg" },
  b_ = {
    class:
      "px-4 py-3 border-b border-gray-200 flex justify-between items-center",
  },
  y_ = { class: "relative" },
  x_ = { class: "p-4" },
  __ = { class: "min-w-full divide-y divide-gray-200" },
  w_ = { class: "bg-white divide-y divide-gray-200" },
  k_ = { key: 0 },
  A_ = { class: "px-6 py-4 text-sm" },
  C_ = { class: "px-6 py-4 text-sm" },
  $_ = { class: "px-6 py-4 text-sm" },
  S_ = { class: "px-6 py-4 text-sm" },
  M_ = { class: "px-6 py-4 text-sm" },
  R_ = { class: "px-6 py-4 text-sm" },
  E_ = { class: "px-6 py-4 text-sm" },
  T_ = { class: "px-6 py-4 text-sm" },
  B_ = { class: "px-6 py-4 text-sm" },
  P_ = { key: 1 },
  I_ = { class: "flex justify-between items-center mt-4 text-sm" },
  j_ = { class: "flex gap-2" },
  L_ = ["disabled"],
  O_ = ["disabled"],
  V_ = {
    __name: "PassengerMonitoringModule",
    setup(e) {
      const t = [
          { id: "walkin", name: "Walk-in" },
          { id: "selfbook", name: "Selfbook" },
        ],
        o = $([]),
        n = $(""),
        l = $(1),
        r = $(8),
        a = $(1),
        u = $(!1),
        i = {
          data: [
            {
              id: 1,
              booking_no: "BK-001",
              fullname: "Juan Dela Cruz",
              gender: "M",
              passenger_type: "Adult",
              route: "BAT-CAL",
              accommodation: "Economy",
              seat_no: "A12",
              payment_method: "GCash",
              status: "PAID",
            },
            {
              id: 2,
              booking_no: "BK-002",
              fullname: "Maria Santos",
              gender: "F",
              passenger_type: "Senior",
              route: "BAT-CAL",
              accommodation: "Economy",
              seat_no: null,
              payment_method: "Cash",
              status: "PENDING",
            },
            {
              id: 3,
              booking_no: "BK-003",
              fullname: "Pedro Ramirez",
              gender: "M",
              passenger_type: "Adult",
              route: "CEB-BOH",
              accommodation: "Tourist",
              seat_no: "B05",
              payment_method: "Credit Card",
              status: "PAID",
            },
            {
              id: 4,
              booking_no: "BK-004",
              fullname: "Ana Lopez",
              gender: "F",
              passenger_type: "Student",
              route: "CEB-BOH",
              accommodation: "Economy",
              seat_no: "C18",
              payment_method: "GCash",
              status: "PAID",
            },
            {
              id: 5,
              booking_no: "BK-005",
              fullname: "Roberto Cruz",
              gender: "M",
              passenger_type: "PWD",
              route: "ILO-BAC",
              accommodation: "Tourist",
              seat_no: null,
              payment_method: "Cash",
              status: "CANCELLED",
            },
            {
              id: 6,
              booking_no: "BK-006",
              fullname: "Liza Mendoza",
              gender: "F",
              passenger_type: "Adult",
              route: "ILO-BAC",
              accommodation: "Business",
              seat_no: "D02",
              payment_method: "Credit Card",
              status: "PAID",
            },
            {
              id: 7,
              booking_no: "BK-007",
              fullname: "Mark Villanueva",
              gender: "M",
              passenger_type: "Adult",
              route: "MNL-COR",
              accommodation: "Economy",
              seat_no: "E21",
              payment_method: "GCash",
              status: "PAID",
            },
            {
              id: 8,
              booking_no: "BK-008",
              fullname: "Sofia Reyes",
              gender: "F",
              passenger_type: "Senior",
              route: "MNL-COR",
              accommodation: "Tourist",
              seat_no: "F09",
              payment_method: "Cash",
              status: "PENDING",
            },
            {
              id: 9,
              booking_no: "BK-009",
              fullname: "Daniel Flores",
              gender: "M",
              passenger_type: "Student",
              route: "DGT-SIQ",
              accommodation: "Economy",
              seat_no: "A03",
              payment_method: "GCash",
              status: "PAID",
            },
            {
              id: 10,
              booking_no: "BK-010",
              fullname: "Christine Navarro",
              gender: "F",
              passenger_type: "Adult",
              route: "DGT-SIQ",
              accommodation: "Business",
              seat_no: null,
              payment_method: "Credit Card",
              status: "PENDING",
            },
          ],
          meta: { current_page: 1, last_page: 5, total: 100 },
        },
        f = async () => {
          ((u.value = !0), (o.value = []));
          try {
            await new Promise((b) => setTimeout(b, 400));
            const c = i.data.filter((b) => {
                const x = n.value.toLowerCase();
                return (
                  b.booking_no.toLowerCase().includes(x) ||
                  b.fullname.toLowerCase().includes(x)
                );
              }),
              d = (l.value - 1) * r.value,
              p = d + r.value;
            ((o.value = c.slice(d, p)),
              (a.value = Math.ceil(c.length / r.value)));
          } finally {
            u.value = !1;
          }
        };
      return (
        Re([l, n], f),
        De(f),
        (c, d) => (
          m(),
          g("div", p_, [
            d[9] ||
              (d[9] = Bo(
                '<div class="mb-6"><nav class="text-sm text-gray-500 mb-2"><span>Dashboard</span> <span class="mx-2">&gt;</span><span class="text-gray-900">Passenger Monitoring</span></nav><div class="flex justify-between items-center"><h1 class="text-2xl font-semibold text-gray-900"> Passenger Monitoring </h1></div></div>',
                1,
              )),
            s("div", m_, [
              s("nav", g_, [
                (m(),
                g(
                  q,
                  null,
                  le(t, (p) =>
                    s(
                      "button",
                      {
                        key: p.id,
                        onClick: (b) => (c.activeTab = p.id),
                        class: Z([
                          "py-2 px-2 font-medium text-sm rounded-md",
                          c.activeTab === p.id
                            ? "bg-white"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-bold",
                        ]),
                      },
                      w(p.name),
                      11,
                      v_,
                    ),
                  ),
                  64,
                )),
              ]),
            ]),
            s("div", h_, [
              s("div", b_, [
                d[4] ||
                  (d[4] = s(
                    "h2",
                    { class: "text-lg font-medium text-gray-900" },
                    "List of Passengers",
                    -1,
                  )),
                s("div", y_, [
                  Y(ie(Bt), {
                    class:
                      "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4",
                  }),
                  oe(
                    s(
                      "input",
                      {
                        "onUpdate:modelValue":
                          d[0] || (d[0] = (p) => (n.value = p)),
                        onInput: d[1] || (d[1] = (p) => (l.value = 1)),
                        type: "text",
                        placeholder: "Search",
                        class:
                          "pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      },
                      null,
                      544,
                    ),
                    [[be, n.value]],
                  ),
                ]),
              ]),
              s("div", x_, [
                s("table", __, [
                  d[8] ||
                    (d[8] = s(
                      "thead",
                      { class: "bg-gray-50" },
                      [
                        s("tr", null, [
                          s(
                            "th",
                            {
                              class:
                                "px-6 py-3 text-left text-xs text-gray-500",
                            },
                            " Booking No. ",
                          ),
                          s(
                            "th",
                            {
                              class:
                                "px-6 py-3 text-left text-xs text-gray-500",
                            },
                            " Fullname ",
                          ),
                          s(
                            "th",
                            {
                              class:
                                "px-6 py-3 text-left text-xs text-gray-500",
                            },
                            "Gender",
                          ),
                          s(
                            "th",
                            {
                              class:
                                "px-6 py-3 text-left text-xs text-gray-500",
                            },
                            " Psgr. Type ",
                          ),
                          s(
                            "th",
                            {
                              class:
                                "px-6 py-3 text-left text-xs text-gray-500",
                            },
                            "Route",
                          ),
                          s(
                            "th",
                            {
                              class:
                                "px-6 py-3 text-left text-xs text-gray-500",
                            },
                            " Accommodation ",
                          ),
                          s(
                            "th",
                            {
                              class:
                                "px-6 py-3 text-left text-xs text-gray-500",
                            },
                            " Seat No. ",
                          ),
                          s(
                            "th",
                            {
                              class:
                                "px-6 py-3 text-left text-xs text-gray-500",
                            },
                            " Payment Method ",
                          ),
                          s(
                            "th",
                            {
                              class:
                                "px-6 py-3 text-left text-xs text-gray-500",
                            },
                            "Status",
                          ),
                          s(
                            "th",
                            {
                              class:
                                "px-6 py-3 text-left text-xs text-gray-500",
                            },
                            "Action",
                          ),
                        ]),
                      ],
                      -1,
                    )),
                  s("tbody", w_, [
                    u.value
                      ? (m(),
                        g("tr", k_, [
                          ...(d[5] ||
                            (d[5] = [
                              s(
                                "td",
                                {
                                  colspan: "10",
                                  class: "text-center py-6 text-gray-500",
                                },
                                " Loading passengers... ",
                                -1,
                              ),
                            ])),
                        ]))
                      : K("", !0),
                    (m(!0),
                    g(
                      q,
                      null,
                      le(
                        o.value,
                        (p) => (
                          m(),
                          g("tr", { key: p.id, class: "hover:bg-gray-50" }, [
                            s("td", A_, w(p.booking_no), 1),
                            s("td", C_, w(p.fullname), 1),
                            s("td", $_, w(p.gender), 1),
                            s("td", S_, w(p.passenger_type), 1),
                            s("td", M_, w(p.route), 1),
                            s("td", R_, w(p.accommodation), 1),
                            s("td", E_, w(p.seat_no || "-"), 1),
                            s("td", T_, w(p.payment_method), 1),
                            s("td", B_, w(p.status), 1),
                            d[6] ||
                              (d[6] = s(
                                "td",
                                { class: "px-6 py-4 text-sm" },
                                [
                                  s(
                                    "button",
                                    { class: "text-blue-600 hover:underline" },
                                    "View",
                                  ),
                                ],
                                -1,
                              )),
                          ])
                        ),
                      ),
                      128,
                    )),
                    !u.value && o.value.length === 0
                      ? (m(),
                        g("tr", P_, [
                          ...(d[7] ||
                            (d[7] = [
                              s(
                                "td",
                                {
                                  colspan: "10",
                                  class: "text-center py-6 text-gray-500",
                                },
                                " No passengers found. ",
                                -1,
                              ),
                            ])),
                        ]))
                      : K("", !0),
                  ]),
                ]),
                s("div", I_, [
                  s(
                    "span",
                    null,
                    " Page " + w(l.value) + " of " + w(a.value),
                    1,
                  ),
                  s("div", j_, [
                    s(
                      "button",
                      {
                        onClick: d[2] || (d[2] = (p) => l.value--),
                        disabled: l.value === 1,
                        class: "px-3 py-1 border rounded disabled:opacity-50",
                      },
                      " Prev ",
                      8,
                      L_,
                    ),
                    s(
                      "button",
                      {
                        onClick: d[3] || (d[3] = (p) => l.value++),
                        disabled: l.value === a.value,
                        class: "px-3 py-1 border rounded disabled:opacity-50",
                      },
                      " Next ",
                      8,
                      O_,
                    ),
                  ]),
                ]),
              ]),
            ]),
          ])
        )
      );
    },
  },
  N_ = {
    key: 0,
    class:
      "fixed top-6 right-6 z-[100] flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg",
  },
  U_ = {
    class: "flex items-center justify-between p-6 border-b border-gray-200",
  },
  D_ = {
    class: "flex items-center justify-end gap-3 pt-6 border-t border-gray-200",
  },
  F_ = ["disabled"],
  H_ = { key: 0, class: "flex items-center gap-2" },
  z_ = { key: 1 },
  Q_ = { key: 0, class: "text-red-500 text-sm mt-2 text-center" },
  K_ = {
    __name: "ModalCreateAccommodation",
    emits: ["save", "close"],
    setup(e, { emit: t }) {
      const o = t,
        n = "https://fastcat-book.dev/api",
        l = $(""),
        r = $(!1),
        a = $(""),
        u = async () => {
          if (!l.value.trim()) {
            a.value = "Accommodation name is required";
            return;
          }
          ((r.value = !0), (a.value = ""));
          try {
            if (
              !(
                await fetch(`${n}/passenger-accommodations`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: JSON.stringify({ accommodation_name: l.value }),
                })
              ).ok
            )
              throw new Error("Failed to save accommodation");
            (o("save"), o("close"));
          } catch (i) {
            (console.error(i),
              (a.value = "Something went wrong while saving."));
          } finally {
            r.value = !1;
          }
        };
      return (i, f) => (
        m(),
        g(
          "div",
          {
            class:
              "fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50",
            onClick: f[4] || (f[4] = (c) => i.$emit("close")),
          },
          [
            r.value
              ? (m(),
                g("div", N_, [
                  ...(f[5] ||
                    (f[5] = [
                      s(
                        "span",
                        {
                          class:
                            "inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                        },
                        null,
                        -1,
                      ),
                      s(
                        "span",
                        { class: "font-semibold text-blue-700 text-base" },
                        "Saving data...",
                        -1,
                      ),
                    ])),
                ]))
              : K("", !0),
            s(
              "div",
              {
                class:
                  "modal-card bg-white rounded-lg shadow-xl w-full max-w-md mx-4",
                onClick: f[3] || (f[3] = Se(() => {}, ["stop"])),
              },
              [
                s("div", U_, [
                  f[7] ||
                    (f[7] = s(
                      "div",
                      null,
                      [
                        s(
                          "h2",
                          { class: "text-lg font-semibold text-gray-900" },
                          " Create Accommodation ",
                        ),
                      ],
                      -1,
                    )),
                  s(
                    "button",
                    {
                      onClick: f[0] || (f[0] = (c) => i.$emit("close")),
                      class:
                        "text-gray-400 hover:text-gray-600 transition-colors",
                    },
                    [
                      ...(f[6] ||
                        (f[6] = [
                          s(
                            "svg",
                            {
                              class: "w-6 h-6",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24",
                            },
                            [
                              s("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M6 18L18 6M6 6l12 12",
                              }),
                            ],
                            -1,
                          ),
                        ])),
                    ],
                  ),
                ]),
                s(
                  "form",
                  { onSubmit: Se(u, ["prevent"]), class: "p-6 space-y-6" },
                  [
                    s("div", null, [
                      f[8] ||
                        (f[8] = s(
                          "label",
                          {
                            class:
                              "block text-sm font-medium text-gray-700 mb-2",
                          },
                          " Accommodation ",
                          -1,
                        )),
                      oe(
                        s(
                          "input",
                          {
                            placeholder: "Input Accommodation",
                            type: "text",
                            "onUpdate:modelValue":
                              f[1] || (f[1] = (c) => (l.value = c)),
                            class:
                              "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                          },
                          null,
                          512,
                        ),
                        [[be, l.value]],
                      ),
                    ]),
                    s("div", D_, [
                      s(
                        "button",
                        {
                          type: "button",
                          onClick: f[2] || (f[2] = (c) => i.$emit("close")),
                          class:
                            "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
                        },
                        " Cancel ",
                      ),
                      s(
                        "button",
                        {
                          type: "submit",
                          class:
                            "px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
                          disabled: r.value,
                        },
                        [
                          r.value
                            ? (m(),
                              g("span", H_, [
                                ...(f[9] ||
                                  (f[9] = [
                                    s(
                                      "span",
                                      {
                                        class:
                                          "inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                                      },
                                      null,
                                      -1,
                                    ),
                                    ye(" Saving... ", -1),
                                  ])),
                              ]))
                            : (m(), g("span", z_, " Save ")),
                        ],
                        8,
                        F_,
                      ),
                    ]),
                    a.value ? (m(), g("div", Q_, w(a.value), 1)) : K("", !0),
                  ],
                  32,
                ),
              ],
            ),
          ],
        )
      );
    },
  },
  Y_ = {
    key: 0,
    class:
      "fixed top-6 right-6 z-[100] flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg",
  },
  J_ = {
    class: "flex items-center justify-between p-6 border-b border-gray-200",
  },
  q_ = {
    class: "flex items-center justify-end gap-3 pt-6 border-t border-gray-200",
  },
  G_ = ["disabled"],
  Z_ = { key: 0, class: "flex items-center gap-2" },
  W_ = { key: 1 },
  X_ = { key: 0, class: "text-red-500 text-sm mt-2 text-center" },
  ew = {
    __name: "ModalEditAccommodation",
    props: { accommodation: Object },
    emits: ["save", "close"],
    setup(e, { emit: t }) {
      const o = t,
        n = e,
        l = $(!1),
        r = $(""),
        a = $("");
      Re(
        () => n.accommodation,
        (i) => {
          i && (a.value = i.accommodation_name);
        },
        { immediate: !0 },
      );
      const u = async () => {
        if (!a.value.trim()) {
          r.value = "Accommodation name is required";
          return;
        }
        ((l.value = !0), (r.value = ""));
        try {
          const i = { accommodation_name: a.value },
            f = await fetch(
              `https://fastcat-book.dev/api/passenger-accommodations/${n.accommodation.accommodation_id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(i),
              },
            ),
            c = await f.json();
          f.ok
            ? (o("save", c), o("close"))
            : console.error("Error saving accommodation:", c);
        } catch (i) {
          console.error("Network error:", i);
        }
      };
      return (i, f) => (
        m(),
        g(
          "div",
          {
            class:
              "fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50",
            onClick: f[5] || (f[5] = (c) => i.$emit("close")),
          },
          [
            l.value
              ? (m(),
                g("div", Y_, [
                  ...(f[6] ||
                    (f[6] = [
                      s(
                        "span",
                        {
                          class:
                            "inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                        },
                        null,
                        -1,
                      ),
                      s(
                        "span",
                        { class: "font-semibold text-blue-700 text-base" },
                        "Saving data...",
                        -1,
                      ),
                    ])),
                ]))
              : K("", !0),
            s(
              "div",
              {
                class:
                  "modal-card bg-white rounded-lg shadow-xl w-full max-w-md mx-4",
                onClick: f[4] || (f[4] = Se(() => {}, ["stop"])),
              },
              [
                s("div", J_, [
                  f[8] ||
                    (f[8] = s(
                      "div",
                      null,
                      [
                        s(
                          "h2",
                          { class: "text-lg font-semibold text-gray-900" },
                          " Edit Accommodation ",
                        ),
                      ],
                      -1,
                    )),
                  s(
                    "button",
                    {
                      onClick: f[0] || (f[0] = (c) => i.$emit("close")),
                      class:
                        "text-gray-400 hover:text-gray-600 transition-colors",
                    },
                    [
                      ...(f[7] ||
                        (f[7] = [
                          s(
                            "svg",
                            {
                              class: "w-6 h-6",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24",
                            },
                            [
                              s("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M6 18L18 6M6 6l12 12",
                              }),
                            ],
                            -1,
                          ),
                        ])),
                    ],
                  ),
                ]),
                s(
                  "form",
                  {
                    onSubmit:
                      f[3] ||
                      (f[3] = Se(
                        (...c) =>
                          i.saveAccommodation && i.saveAccommodation(...c),
                        ["prevent"],
                      )),
                    class: "p-6 space-y-6",
                  },
                  [
                    s("div", null, [
                      f[9] ||
                        (f[9] = s(
                          "label",
                          {
                            class:
                              "block text-sm font-medium text-gray-700 mb-2",
                          },
                          " Accommodation ",
                          -1,
                        )),
                      oe(
                        s(
                          "input",
                          {
                            "onUpdate:modelValue":
                              f[1] || (f[1] = (c) => (a.value = c)),
                            placeholder: "Input Accommodation",
                            type: "text",
                            required: "",
                            class:
                              "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                          },
                          null,
                          512,
                        ),
                        [[be, a.value]],
                      ),
                    ]),
                    s("div", q_, [
                      s(
                        "button",
                        {
                          type: "button",
                          onClick: f[2] || (f[2] = (c) => i.$emit("close")),
                          class:
                            "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
                        },
                        " Cancel ",
                      ),
                      s(
                        "button",
                        {
                          onClick: u,
                          type: "submit",
                          class:
                            "px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
                          disabled: l.value,
                        },
                        [
                          l.value
                            ? (m(),
                              g("span", Z_, [
                                ...(f[10] ||
                                  (f[10] = [
                                    s(
                                      "span",
                                      {
                                        class:
                                          "inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                                      },
                                      null,
                                      -1,
                                    ),
                                    ye(" Saving... ", -1),
                                  ])),
                              ]))
                            : (m(), g("span", W_, " Save ")),
                        ],
                        8,
                        G_,
                      ),
                    ]),
                    r.value ? (m(), g("div", X_, w(r.value), 1)) : K("", !0),
                  ],
                  32,
                ),
              ],
            ),
          ],
        )
      );
    },
  },
  tw = { class: "min-h-full bg-gray-50 p-6" },
  sw = { class: "mb-6" },
  ow = { class: "flex justify-between items-center" },
  nw = { class: "border border-gray-300 bg-white rounded-lg" },
  lw = {
    class:
      "px-4 py-3 border-b border-gray-200 flex justify-between items-center",
  },
  rw = { class: "relative" },
  aw = { class: "p-4" },
  iw = { class: "min-w-full divide-y divide-gray-200" },
  dw = { class: "bg-white divide-y divide-gray-200" },
  uw = { key: 0 },
  cw = { class: "px-6 py-4 text-sm" },
  fw = { class: "px-6 py-4 text-sm font-medium text-gray-900" },
  pw = { class: "px-6 py-4 text-sm text-gray-500" },
  mw = { class: "px-6 py-4 text-sm" },
  gw = ["onClick"],
  vw = { key: 1 },
  hw = {
    __name: "PassengerAccommodation",
    setup(e) {
      const t = $(!1),
        o = $(!1),
        n = "https://fastcat-book.dev/api",
        l = $([]),
        r = $(null),
        a = $(""),
        u = $(!1),
        i = async () => {
          u.value = !0;
          try {
            const d = await fetch(
              `${n}/passenger-accommodations?search=${a.value}`,
              {
                headers: {
                  Accept: "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              },
            );
            if (!d.ok) throw new Error("Failed to fetch accommodations");
            const p = await d.json();
            l.value = p.data ?? [];
          } catch (d) {
            (console.error(d), (l.value = []));
          } finally {
            u.value = !1;
          }
        },
        f = (d) => {
          ((r.value = d), (o.value = !0));
        },
        c = () => {
          i();
        };
      return (
        Re(a, i),
        De(i),
        (d, p) => (
          m(),
          g(
            q,
            null,
            [
              s("div", tw, [
                s("div", sw, [
                  p[6] ||
                    (p[6] = s(
                      "nav",
                      { class: "text-sm text-gray-500 mb-2" },
                      [
                        s("span", null, "Dashboard"),
                        ye(),
                        s("span", { class: "mx-2" }, ">"),
                        s(
                          "span",
                          { class: "text-gray-900" },
                          "Passenger Accommodation",
                        ),
                      ],
                      -1,
                    )),
                  s("div", ow, [
                    p[5] ||
                      (p[5] = s(
                        "h1",
                        { class: "text-2xl font-semibold text-gray-900" },
                        " Passenger Accommodation ",
                        -1,
                      )),
                    s(
                      "button",
                      {
                        onClick: p[0] || (p[0] = (b) => (t.value = !0)),
                        type: "button",
                        class:
                          "bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2 cursor-pointer",
                      },
                      [
                        Y(ie(Yt), { class: "w-4 h-4" }),
                        p[4] || (p[4] = ye(" Create ", -1)),
                      ],
                    ),
                  ]),
                ]),
                s("div", nw, [
                  s("div", lw, [
                    p[7] ||
                      (p[7] = s(
                        "h2",
                        { class: "text-lg font-medium text-gray-900" },
                        " List of Accommodations ",
                        -1,
                      )),
                    s("div", rw, [
                      Y(ie(Bt), {
                        class:
                          "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4",
                      }),
                      oe(
                        s(
                          "input",
                          {
                            "onUpdate:modelValue":
                              p[1] || (p[1] = (b) => (a.value = b)),
                            type: "text",
                            placeholder: "Search",
                            class:
                              "pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                          },
                          null,
                          512,
                        ),
                        [[be, a.value]],
                      ),
                    ]),
                  ]),
                  s("div", aw, [
                    s("table", iw, [
                      p[12] ||
                        (p[12] = s(
                          "thead",
                          { class: "bg-gray-50" },
                          [
                            s("tr", null, [
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs text-gray-500",
                                },
                                "#",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs text-gray-500",
                                },
                                " Accommodation Name ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs text-gray-500",
                                },
                                "Status",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs text-gray-500",
                                },
                                " Last Updated ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs text-gray-500",
                                },
                                " Updated By ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs text-gray-500",
                                },
                                "Actions",
                              ),
                            ]),
                          ],
                          -1,
                        )),
                      s("tbody", dw, [
                        u.value
                          ? (m(),
                            g("tr", uw, [
                              ...(p[8] ||
                                (p[8] = [
                                  s(
                                    "td",
                                    {
                                      colspan: "10",
                                      class: "text-center py-6 text-gray-500",
                                    },
                                    " Loading accommodations... ",
                                    -1,
                                  ),
                                ])),
                            ]))
                          : K("", !0),
                        (m(!0),
                        g(
                          q,
                          null,
                          le(
                            l.value,
                            (b, x) => (
                              m(),
                              g(
                                "tr",
                                {
                                  key: b.accommodation_id,
                                  class: "hover:bg-gray-50",
                                },
                                [
                                  s("td", cw, w(x + 1), 1),
                                  s("td", fw, w(b.accommodation_name), 1),
                                  p[9] ||
                                    (p[9] = s(
                                      "td",
                                      {
                                        class:
                                          "px-6 py-4 text-sm text-gray-500",
                                      },
                                      "Active",
                                      -1,
                                    )),
                                  s(
                                    "td",
                                    pw,
                                    w(
                                      new Date(
                                        b.updated_at,
                                      ).toLocaleDateString(),
                                    ),
                                    1,
                                  ),
                                  p[10] ||
                                    (p[10] = s(
                                      "td",
                                      {
                                        class:
                                          "px-6 py-4 text-sm text-gray-500",
                                      },
                                      "Yoshinoya",
                                      -1,
                                    )),
                                  s("td", mw, [
                                    s(
                                      "button",
                                      {
                                        onClick: (A) => f(b),
                                        type: "button",
                                        class:
                                          "font-medium text-blue-600 hover:text-blue-900 flex items-center cursor-pointer",
                                      },
                                      [Y(ie(ls), { class: "w-4 h-4" })],
                                      8,
                                      gw,
                                    ),
                                  ]),
                                ],
                              )
                            ),
                          ),
                          128,
                        )),
                        !u.value && l.value.length === 0
                          ? (m(),
                            g("tr", vw, [
                              ...(p[11] ||
                                (p[11] = [
                                  s(
                                    "td",
                                    {
                                      colspan: "10",
                                      class: "text-center py-6 text-gray-500",
                                    },
                                    " No accommodations found. ",
                                    -1,
                                  ),
                                ])),
                            ]))
                          : K("", !0),
                      ]),
                    ]),
                  ]),
                ]),
              ]),
              Y(
                Ie,
                { name: "modal-fade" },
                {
                  default: $e(() => [
                    t.value
                      ? (m(),
                        ke(K_, {
                          key: 0,
                          onClose: p[2] || (p[2] = (b) => (t.value = !1)),
                          onSave: c,
                        }))
                      : K("", !0),
                  ]),
                  _: 1,
                },
              ),
              Y(
                Ie,
                { name: "modal-fade" },
                {
                  default: $e(() => [
                    o.value
                      ? (m(),
                        ke(
                          ew,
                          {
                            key: 0,
                            accommodation: r.value,
                            onClose: p[3] || (p[3] = (b) => (o.value = !1)),
                            onSave: c,
                          },
                          null,
                          8,
                          ["accommodation"],
                        ))
                      : K("", !0),
                  ]),
                  _: 1,
                },
              ),
            ],
            64,
          )
        )
      );
    },
  },
  bw = {
    key: 0,
    class:
      "fixed top-6 right-6 z-[100] flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg",
  },
  yw = {
    class: "flex items-center justify-between p-6 border-b border-gray-200",
  },
  xw = { class: "" },
  _w = { key: 0, class: "mt-4 space-y-3" },
  ww = ["onUpdate:modelValue"],
  kw = ["onClick"],
  Aw = { class: "w-full flex justify-center items-center" },
  Cw = {
    class: "flex items-center justify-end gap-3 pt-6 border-t border-gray-200",
  },
  $w = ["disabled"],
  Sw = { key: 0, class: "flex items-center gap-2" },
  Mw = { key: 1 },
  Rw = { key: 0, class: "text-red-500 text-sm mt-2 text-center" },
  Ew = {
    __name: "ModalCreateVehicle",
    emits: ["close", "save"],
    setup(e, { emit: t }) {
      const o = t,
        n = "https://fastcat-book.dev/api",
        l = $(""),
        r = $([]),
        a = $(!1),
        u = $("");
      Re(l, () => {
        r.value = [];
      });
      const i = () => {
          r.value.push("");
        },
        f = (d) => {
          r.value.splice(d, 1);
        },
        c = async () => {
          if (((u.value = ""), !l.value)) {
            u.value = "Vehicle Type is required.";
            return;
          }
          const d = r.value.filter((p) => p !== "");
          if (d.length === 0) {
            u.value = "At least one Vehicle Class is required.";
            return;
          }
          a.value = !0;
          try {
            const p = {
                vehicle_type: Number(l.value),
                vehicle_classes: d.map((x) => ({ vehicle_class: x })),
              },
              b = await fetch(`${n}/vehicles`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(p),
              });
            if (!b.ok) {
              const x = await b.json();
              throw new Error(x.message || "Failed to save vehicle");
            }
            (o("save"), o("close"));
          } catch (p) {
            (console.error(p),
              (u.value = p.message || "Something went wrong while saving."));
          } finally {
            a.value = !1;
          }
        };
      return (d, p) => (
        m(),
        g(
          "div",
          {
            class:
              "fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50",
            onClick: p[4] || (p[4] = (b) => d.$emit("close")),
          },
          [
            a.value
              ? (m(),
                g("div", bw, [
                  ...(p[5] ||
                    (p[5] = [
                      s(
                        "span",
                        {
                          class:
                            "inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                        },
                        null,
                        -1,
                      ),
                      s(
                        "span",
                        { class: "font-semibold text-blue-700 text-base" },
                        "Saving data...",
                        -1,
                      ),
                    ])),
                ]))
              : K("", !0),
            s(
              "div",
              {
                class:
                  "modal-card bg-white rounded-lg shadow-xl w-full max-w-md mx-4",
                onClick: p[3] || (p[3] = Se(() => {}, ["stop"])),
              },
              [
                s("div", yw, [
                  p[7] ||
                    (p[7] = s(
                      "div",
                      null,
                      [
                        s(
                          "h2",
                          { class: "text-lg font-semibold text-gray-900" },
                          "Create Vehicle",
                        ),
                      ],
                      -1,
                    )),
                  s(
                    "button",
                    {
                      onClick: p[0] || (p[0] = (b) => d.$emit("close")),
                      class:
                        "text-gray-400 hover:text-gray-600 transition-colors",
                    },
                    [
                      ...(p[6] ||
                        (p[6] = [
                          s(
                            "svg",
                            {
                              class: "w-6 h-6",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24",
                            },
                            [
                              s("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M6 18L18 6M6 6l12 12",
                              }),
                            ],
                            -1,
                          ),
                        ])),
                    ],
                  ),
                ]),
                s(
                  "form",
                  { onSubmit: Se(c, ["prevent"]), class: "p-6 space-y-6" },
                  [
                    s("div", xw, [
                      p[11] ||
                        (p[11] = s(
                          "label",
                          {
                            class:
                              "block text-sm font-medium text-gray-700 mb-2",
                          },
                          " Vehicle Type ",
                          -1,
                        )),
                      oe(
                        s(
                          "select",
                          {
                            "onUpdate:modelValue":
                              p[1] || (p[1] = (b) => (l.value = b)),
                            class:
                              "border border-gray-300 rounded-md px-3 py-2 w-full",
                          },
                          [
                            ...(p[8] ||
                              (p[8] = [
                                s(
                                  "option",
                                  { value: "", disabled: "" },
                                  "Select Vehicle Type",
                                  -1,
                                ),
                                s("option", { value: 1 }, "Type 1", -1),
                                s("option", { value: 2 }, "Type 2", -1),
                                s("option", { value: 3 }, "Type 3", -1),
                                s("option", { value: 4 }, "Type 4", -1),
                                s("option", { value: 5 }, "Type 5", -1),
                              ])),
                          ],
                          512,
                        ),
                        [[Qt, l.value]],
                      ),
                      l.value
                        ? (m(),
                          g("div", _w, [
                            p[10] ||
                              (p[10] = s(
                                "label",
                                {
                                  class:
                                    "block text-sm font-medium text-gray-700 mb-2",
                                },
                                " Vehicle Class ",
                                -1,
                              )),
                            (m(!0),
                            g(
                              q,
                              null,
                              le(
                                r.value,
                                (b, x) => (
                                  m(),
                                  g("div", { key: x, class: "flex gap-2" }, [
                                    oe(
                                      s(
                                        "input",
                                        {
                                          "onUpdate:modelValue": (A) =>
                                            (r.value[x] = A),
                                          type: "text",
                                          required: "",
                                          placeholder:
                                            "Enter vehicle class name",
                                          class:
                                            "border border-gray-300 rounded-md px-3 py-2 w-full",
                                        },
                                        null,
                                        8,
                                        ww,
                                      ),
                                      [[be, r.value[x]]],
                                    ),
                                    s(
                                      "button",
                                      {
                                        type: "button",
                                        onClick: (A) => f(x),
                                        class:
                                          "font-medium text-red-600 hover:text-red-900 flex items-center",
                                      },
                                      [Y(ie(la), { class: "w-4 h-4 mr-1" })],
                                      8,
                                      kw,
                                    ),
                                  ])
                                ),
                              ),
                              128,
                            )),
                            s("div", Aw, [
                              s(
                                "button",
                                {
                                  type: "button",
                                  onClick: i,
                                  class:
                                    "w-full py-2 text-sm flex justify-center items-center border-2 border-dashed border-blue-300 gap-3 font-medium text-blue-500 rounded-md hover:bg-blue-500 hover:text-white hover:border-blue-500 transition",
                                },
                                [
                                  Y(ie(Yt), { class: "w-4 h-4" }),
                                  p[9] ||
                                    (p[9] = ye(" Add Vehicle Class ", -1)),
                                ],
                              ),
                            ]),
                          ]))
                        : K("", !0),
                    ]),
                    s("div", Cw, [
                      s(
                        "button",
                        {
                          type: "button",
                          onClick: p[2] || (p[2] = (b) => d.$emit("close")),
                          class:
                            "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
                        },
                        " Cancel ",
                      ),
                      s(
                        "button",
                        {
                          type: "submit",
                          class:
                            "px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
                          disabled: a.value,
                        },
                        [
                          a.value
                            ? (m(),
                              g("span", Sw, [
                                ...(p[12] ||
                                  (p[12] = [
                                    s(
                                      "span",
                                      {
                                        class:
                                          "inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                                      },
                                      null,
                                      -1,
                                    ),
                                    ye(" Saving... ", -1),
                                  ])),
                              ]))
                            : (m(), g("span", Mw, " Save ")),
                        ],
                        8,
                        $w,
                      ),
                    ]),
                    u.value ? (m(), g("div", Rw, w(u.value), 1)) : K("", !0),
                  ],
                  32,
                ),
              ],
            ),
          ],
        )
      );
    },
  },
  Tw = {
    key: 0,
    class:
      "fixed top-6 right-6 z-[100] flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg",
  },
  Bw = {
    class: "flex items-center justify-between p-6 border-b border-gray-200",
  },
  Pw = { class: "text-lg font-semibold text-gray-900" },
  Iw = {
    class: "flex items-center justify-end gap-3 pt-6 border-t border-gray-200",
  },
  jw = ["disabled"],
  Lw = { key: 0, class: "flex items-center gap-2" },
  Ow = { key: 1 },
  Vw = { key: 0, class: "text-red-500 text-sm mt-2 text-center" },
  Nw = {
    __name: "ModalEditVehicle",
    props: { vehicle: { type: Object, default: () => ({}) } },
    emits: ["close", "save"],
    setup(e, { emit: t }) {
      const o = t,
        n = e,
        l = Kt({
          vehicleType: n.vehicle?.vehicleType || "",
          vehicleClass: n.vehicle?.vehicleClass || "",
        }),
        r = $(!1),
        a = $(""),
        u = async () => {
          if (!l.vehicleClass) {
            a.value = "Vehicle class is required";
            return;
          }
          ((r.value = !0), (a.value = ""));
          try {
            const i = {
              vehicle_type: l.vehicleType,
              vehicle_class: l.vehicleClass,
            };
            console.log("Payload to save:", i);
            const f = await fetch(
                `https://fastcat-book.dev/api/vehicles/${n.vehicle.vehicle_id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: JSON.stringify(i),
                },
              ),
              c = await f.json();
            if (!f.ok) throw new Error(c.message || "Failed to save");
            (o("save", i), o("close"));
          } catch (i) {
            (console.error("Error saving vehicle:", i),
              (a.value = i.message || "Something went wrong"));
          } finally {
            r.value = !1;
          }
        };
      return (i, f) => (
        m(),
        g(
          "div",
          {
            class:
              "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
            onClick: f[4] || (f[4] = (c) => i.$emit("close")),
          },
          [
            r.value
              ? (m(),
                g("div", Tw, [
                  ...(f[5] ||
                    (f[5] = [
                      s(
                        "span",
                        {
                          class:
                            "inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                        },
                        null,
                        -1,
                      ),
                      s(
                        "span",
                        { class: "font-semibold text-blue-700 text-base" },
                        "Saving data...",
                        -1,
                      ),
                    ])),
                ]))
              : K("", !0),
            s(
              "div",
              {
                class:
                  "modal-card bg-white rounded-lg shadow-xl w-full max-w-md mx-4",
                onClick: f[3] || (f[3] = Se(() => {}, ["stop"])),
              },
              [
                s("div", Bw, [
                  s("h2", Pw, " Edit Vehicle " + w(l.vehicleType), 1),
                  s(
                    "button",
                    {
                      onClick: f[0] || (f[0] = (c) => i.$emit("close")),
                      class: "text-gray-400 hover:text-gray-600",
                    },
                    [
                      ...(f[6] ||
                        (f[6] = [
                          s(
                            "svg",
                            {
                              class: "w-6 h-6",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24",
                            },
                            [
                              s("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M6 18L18 6M6 6l12 12",
                              }),
                            ],
                            -1,
                          ),
                        ])),
                    ],
                  ),
                ]),
                s(
                  "form",
                  { onSubmit: Se(u, ["prevent"]), class: "p-6 space-y-6" },
                  [
                    s("div", null, [
                      f[7] ||
                        (f[7] = s(
                          "label",
                          {
                            class:
                              "block text-sm font-medium text-gray-700 mb-2",
                          },
                          " Vehicle Class ",
                          -1,
                        )),
                      oe(
                        s(
                          "input",
                          {
                            type: "text",
                            "onUpdate:modelValue":
                              f[1] || (f[1] = (c) => (l.vehicleClass = c)),
                            class:
                              "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                          },
                          null,
                          512,
                        ),
                        [[be, l.vehicleClass]],
                      ),
                    ]),
                    s("div", Iw, [
                      s(
                        "button",
                        {
                          type: "button",
                          onClick: f[2] || (f[2] = (c) => i.$emit("close")),
                          class:
                            "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
                        },
                        " Cancel ",
                      ),
                      s(
                        "button",
                        {
                          type: "submit",
                          class:
                            "px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
                          disabled: r.value,
                        },
                        [
                          r.value
                            ? (m(),
                              g("span", Lw, [
                                ...(f[8] ||
                                  (f[8] = [
                                    s(
                                      "span",
                                      {
                                        class:
                                          "inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin",
                                      },
                                      null,
                                      -1,
                                    ),
                                    ye(" Saving... ", -1),
                                  ])),
                              ]))
                            : (m(), g("span", Ow, "Save")),
                        ],
                        8,
                        jw,
                      ),
                    ]),
                    a.value ? (m(), g("div", Vw, w(a.value), 1)) : K("", !0),
                  ],
                  32,
                ),
              ],
            ),
          ],
        )
      );
    },
  },
  Uw = { class: "min-h-full bg-gray-50 p-6" },
  Dw = { class: "mb-6" },
  Fw = { class: "flex justify-between items-center" },
  Hw = { class: "border border-gray-300 bg-white rounded-lg" },
  zw = {
    class:
      "px-4 py-3 border-b border-gray-200 flex justify-between items-center",
  },
  Qw = { class: "relative" },
  Kw = { class: "p-4" },
  Yw = { class: "flex gap-2 mb-4" },
  Jw = ["onClick"],
  qw = { class: "min-w-full table-fixed divide-y divide-gray-200" },
  Gw = { class: "bg-white divide-y divide-gray-200" },
  Zw = { key: 0 },
  Ww = { class: "px-6 py-4 text-sm" },
  Xw = { class: "px-6 py-4 text-sm" },
  e4 = { class: "px-6 py-4 text-sm" },
  t4 = { class: "px-6 py-4 text-sm flex items-start gap-1" },
  s4 = ["onClick"],
  o4 = { key: 2 },
  n4 = {
    __name: "VehiclesModule",
    setup(e) {
      const t = $(!1),
        o = $(!1),
        n = $(!1),
        l = $([]),
        r = $(""),
        a = $(1),
        u = $(null),
        i = "https://fastcat-book.dev/api",
        f = [1, 2, 3, 4, 5],
        c = () => {
          n.value = !0;
        },
        d = (_) => {
          ((u.value = _), (o.value = !0));
        },
        p = () => {
          o.value = !1;
        },
        b = () => {
          n.value = !1;
        },
        x = async () => {
          (b(), await v());
        },
        A = async () => {
          (p(), await v());
        },
        v = async () => {
          try {
            t.value = !0;
            const _ = await fetch(`${i}/vehicles`, {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            if (!_.ok) throw new Error("Failed to fetch vehicles");
            const C = await _.json();
            l.value = C.data.vehicles.map((k) => ({
              vehicle_id: k.vehicle_id,
              vehicleType: Number(k.vehicle_type),
              vehicleClass: k.vehicle_class,
              updatedAt: new Date(k.updated_at).toLocaleDateString(),
            }));
          } catch (_) {
            console.error("Fetch error:", _);
          } finally {
            t.value = !1;
          }
        },
        S = pe(() =>
          l.value
            .filter((_) => _.vehicleType === a.value)
            .filter((_) =>
              _.vehicleClass.toLowerCase().includes(r.value.toLowerCase()),
            ),
        );
      return (
        De(v),
        (_, C) => (
          m(),
          g(
            q,
            null,
            [
              s("div", Uw, [
                s("div", Dw, [
                  C[4] ||
                    (C[4] = s(
                      "nav",
                      { class: "text-sm text-gray-500 mb-2" },
                      [
                        s("span", null, "Dashboard"),
                        ye(),
                        s("span", { class: "mx-2" }, ">"),
                        s("span", { class: "text-gray-900" }, "Vehicles"),
                      ],
                      -1,
                    )),
                  s("div", Fw, [
                    C[3] ||
                      (C[3] = s(
                        "h1",
                        { class: "text-2xl font-semibold text-gray-900" },
                        " Vehicles Management ",
                        -1,
                      )),
                    s(
                      "button",
                      {
                        onClick: c,
                        type: "button",
                        class:
                          "bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2 cursor-pointer",
                      },
                      [
                        Y(ie(Yt), { class: "w-4 h-4" }),
                        C[2] || (C[2] = ye(" Create ", -1)),
                      ],
                    ),
                  ]),
                ]),
                s("div", Hw, [
                  s("div", zw, [
                    C[5] ||
                      (C[5] = s(
                        "h2",
                        { class: "text-lg font-medium text-gray-900" },
                        "List of Vehicles",
                        -1,
                      )),
                    s("div", Qw, [
                      Y(ie(Bt), {
                        class:
                          "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4",
                      }),
                      oe(
                        s(
                          "input",
                          {
                            "onUpdate:modelValue":
                              C[0] || (C[0] = (k) => (r.value = k)),
                            onInput:
                              C[1] || (C[1] = (k) => (_.currentPage = 1)),
                            type: "text",
                            placeholder: "Search",
                            class:
                              "pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                          },
                          null,
                          544,
                        ),
                        [[be, r.value]],
                      ),
                    ]),
                  ]),
                  s("div", Kw, [
                    s("div", Yw, [
                      (m(),
                      g(
                        q,
                        null,
                        le(f, (k) =>
                          s(
                            "button",
                            {
                              key: k,
                              onClick: (T) => (a.value = k),
                              class: Z([
                                "px-4 py-2 rounded-md text-sm font-medium transition",
                                a.value === k
                                  ? "bg-blue-600 text-white"
                                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100",
                              ]),
                            },
                            " Type " + w(k),
                            11,
                            Jw,
                          ),
                        ),
                        64,
                      )),
                    ]),
                    s("table", qw, [
                      C[9] ||
                        (C[9] = s(
                          "thead",
                          { class: "bg-gray-50" },
                          [
                            s("tr", null, [
                              s(
                                "th",
                                {
                                  class:
                                    "w-16 px-6 py-3 text-left text-xs text-gray-500",
                                },
                                "#",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "w-64 px-6 py-3 text-left text-xs text-gray-500",
                                },
                                " Vehicle Class ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "w-40 px-6 py-3 text-left text-xs text-gray-500",
                                },
                                " Updated ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "w-40 px-6 py-3 text-left text-xs text-gray-500",
                                },
                                " User ",
                              ),
                              s(
                                "th",
                                {
                                  class:
                                    "w-40 px-6 py-3 text-left text-xs text-gray-500",
                                },
                                " Action ",
                              ),
                            ]),
                          ],
                          -1,
                        )),
                      s("tbody", Gw, [
                        t.value
                          ? (m(),
                            g("tr", Zw, [
                              ...(C[6] ||
                                (C[6] = [
                                  s(
                                    "td",
                                    {
                                      colspan: "6",
                                      class: "text-center py-6 text-gray-500",
                                    },
                                    " Loading vehicles... ",
                                    -1,
                                  ),
                                ])),
                            ]))
                          : l.value.length > 0
                            ? (m(!0),
                              g(
                                q,
                                { key: 1 },
                                le(
                                  S.value,
                                  (k, T) => (
                                    m(),
                                    g(
                                      "tr",
                                      {
                                        key: k.vehicle_id,
                                        class: "hover:bg-gray-50",
                                      },
                                      [
                                        s("td", Ww, w(T + 1), 1),
                                        s("td", Xw, w(k.vehicleClass), 1),
                                        s("td", e4, w(k.updatedAt), 1),
                                        C[7] ||
                                          (C[7] = s(
                                            "td",
                                            { class: "px-6 py-4 text-sm" },
                                            "-",
                                            -1,
                                          )),
                                        s("td", t4, [
                                          s(
                                            "button",
                                            {
                                              onClick: (B) => d(k),
                                              class:
                                                "font-medium text-blue-600 hover:text-blue-900 flex items-center",
                                            },
                                            [
                                              Y(ie(ls), {
                                                class: "w-4 h-4 mr-1",
                                              }),
                                            ],
                                            8,
                                            s4,
                                          ),
                                        ]),
                                      ],
                                    )
                                  ),
                                ),
                                128,
                              ))
                            : (m(),
                              g("tr", o4, [
                                ...(C[8] ||
                                  (C[8] = [
                                    s(
                                      "td",
                                      {
                                        colspan: "6",
                                        class: "text-center py-6 text-gray-500",
                                      },
                                      " No vehicles found. ",
                                      -1,
                                    ),
                                  ])),
                              ])),
                      ]),
                    ]),
                  ]),
                ]),
              ]),
              Y(
                Ie,
                { name: "modal-fade" },
                {
                  default: $e(() => [
                    n.value
                      ? (m(), ke(Ew, { key: 0, onClose: b, onSave: x }))
                      : K("", !0),
                  ]),
                  _: 1,
                },
              ),
              Y(
                Ie,
                { name: "modal-fade" },
                {
                  default: $e(() => [
                    o.value
                      ? (m(),
                        ke(
                          Nw,
                          { key: 0, vehicle: u.value, onClose: p, onSave: A },
                          null,
                          8,
                          ["vehicle"],
                        ))
                      : K("", !0),
                  ]),
                  _: 1,
                },
              ),
            ],
            64,
          )
        )
      );
    },
  },
  l4 = [
    { path: "/", component: mf },
    { path: "/dashboard", component: Jc },
    { path: "/create-port", component: G0 },
    { path: "/teller-booking", component: yv },
    { path: "/schedule", component: _h },
    { path: "/routes", component: ub },
    { path: "/vessels", component: Vy },
    { path: "/rates-discounts", component: f_ },
    { path: "/passenger-monitoring", component: V_ },
    { path: "/passenger-accommodation", component: hw },
    { path: "/vehicles", component: n4 },
  ],
  ya = Cc({ history: ec("/fcbook-dev/"), routes: l4 });
function Dl(e) {
  if (!e) return !0;
  try {
    const t = e.startsWith("Bearer ") ? e.slice(7) : e;
    return JSON.parse(atob(t.split(".")[1])).exp * 1e3 < Date.now();
  } catch {
    return !0;
  }
}
ya.beforeEach((e, t, o) => {
  const l = !["/"].includes(e.path),
    r = localStorage.getItem("token");
  if (e.path === "/" && r && !Dl(r)) return o("/dashboard");
  if (l && (!r || Dl(r)))
    return (
      localStorage.removeItem("token"),
      localStorage.removeItem("user"),
      o("/")
    );
  o();
});
function r4(e, t) {
  return (
    m(),
    g(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
      },
      [
        s("path", {
          "fill-rule": "evenodd",
          d: "M15.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H7.5a.75.75 0 0 1 0-1.5h11.69l-3.22-3.22a.75.75 0 0 1 0-1.06Zm-7.94 9a.75.75 0 0 1 0 1.06l-3.22 3.22H16.5a.75.75 0 0 1 0 1.5H4.81l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0Z",
          "clip-rule": "evenodd",
        }),
      ],
    )
  );
}
function a4(e, t) {
  return (
    m(),
    g(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
      },
      [
        s("path", {
          d: "M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z",
        }),
        s("path", {
          "fill-rule": "evenodd",
          d: "M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z",
          "clip-rule": "evenodd",
        }),
      ],
    )
  );
}
function i4(e, t) {
  return (
    m(),
    g(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
      },
      [
        s("path", {
          "fill-rule": "evenodd",
          d: "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z",
          "clip-rule": "evenodd",
        }),
      ],
    )
  );
}
function d4(e, t) {
  return (
    m(),
    g(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
      },
      [
        s("path", {
          d: "M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z",
        }),
        s("path", {
          d: "m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z",
        }),
      ],
    )
  );
}
function u4(e, t) {
  return (
    m(),
    g(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
      },
      [
        s("path", {
          "fill-rule": "evenodd",
          d: "M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z",
          "clip-rule": "evenodd",
        }),
      ],
    )
  );
}
const xt = Fd(Nc);
xt.component("HomeIcon", d4);
xt.component("UserIcon", u4);
xt.component("CalendarDaysIcon", a4);
xt.component("ArrowsRightLeftIcon", r4);
xt.component("ClockIcon", i4);
xt.component("Eye", En);
xt.component("EyeOff", qd);
xt.component("AlertCircle", qs);
xt.use(ya);
xt.mount("#app");
