/* eslint-disable no-unused-expressions */

//  冰蛙 estimating algorithm is from SMTH 冰蛙宝鉴 bingri[1523812] kaeru[1769499] htys[1545351] mirrorhye[2564936] tobytorn[1617955] Microdust[2587304].

function bw_estimate(personalDataJSON) {
  var g = personalDataJSON.personalstats,
    f = g.defendslost || 0,
    u = g.defendsstalemated || 0,
    b = g.defendswon || 0,
    m = g.attackswon || 0,
    x = g.attacksdraw || 0,
    y = g.attackslost || 0,
    v = g.cantaken || 0,
    w = g.exttaken || 0,
    _ = g.kettaken || 0,
    k = g.lsdtaken || 0,
    $ = g.opitaken || 0,
    I = g.pcptaken || 0,
    S = g.shrtaken || 0,
    D = g.spetaken || 0,
    A = g.victaken || 0,
    F = g.xantaken || 0,
    O = personalDataJSON.age || 1,
    C = g.trainsreceived || 0,
    M = w + k + F,
    T = ((personalDataJSON.xan_lsd_ecs = M) / O).toFixed(2);
  personalDataJSON.average_drugs = T;
  var P = g.refills || 0,
    E = g.statenhancersused || 0,
    N = g.useractivity || 0,
    z = g.traveltime || 0,
    R = (g.logins, g.dumpsearches || 0),
    j = g.energydrinkused || 0,
    B = g.boostersused || 0,
    M = g.revives || 0,
    T = m + x + y,
    x = g.daysbeendonator || 0,
    y = Math.min(O, parseInt((new Date - new Date("2011/11/22")) / 864e5));
  const tt = Math.min(x / y, 1);
  personalDataJSON.donator_percent = tt.toFixed(2);
  const et = 480 + 240 * tt;
  const at = 611255 / et;
  y = personalDataJSON.last_action.timestamp || 0;
  let t = parseInt((new Date).getTime() / 1e3) - y,
    e = "";
  86400 < t && (e += parseInt(t / 86400) + "天", t %= 86400), 3600 < t && (e += parseInt(t / 3600) + "时", t %= 3600), 60 < t && (e += parseInt(t / 60) + "分", t %= 60), e += t + "秒", personalDataJSON.last_action_details = e;
  const nt = personalDataJSON.last_action.relative;
  personalDataJSON.last_action_brief = nt.replace(" minute ago", "m").replace(" minutes ago", "m").replace(" hours ago", "h").replace(" hour ago", "h").replace(" days ago", "d").replace(" day ago", "d");
  let a = 0;
  nt.includes("d") && (a = parseInt(nt.replace(/[^0-9|-]/gi, "")));
  const it = Math.max(1, 21 * (O - a) / 24);
  const ot = N / 86400,
    rt = z / 86400,
    st = 3 * ot + rt;
  const lt = (75 * v + 210 * w + 52.5 * _ + 425 * k + 215 * $ + 430 * I + 209.5 * S + 301 * D + 300 * A + 420 * F) / 1440;
  v = personalDataJSON.criminalrecord.other || 0, w = personalDataJSON.criminalrecord.selling_illegal_products || 0, _ = personalDataJSON.criminalrecord.theft || 0, $ = personalDataJSON.criminalrecord.drug_deals || 0, I = personalDataJSON.criminalrecord.computer_crimes || 0, S = personalDataJSON.criminalrecord.murder || 0, D = personalDataJSON.criminalrecord.fraud_crimes || 0, A = personalDataJSON.criminalrecord.auto_theft || 0;
  let n = .11 * _ + .5 * I + .66 * S + D + .66 * A + .05 * $;
  n < 0 && (n = 0), personalDataJSON.estimate_ace = parseInt(n), 12862 < n ? personalDataJSON.estimate_nnb = 60 : 9171 < n ? personalDataJSON.estimate_nnb = 55 : 5950 < n ? personalDataJSON.estimate_nnb = 50 : 4324 < n ? personalDataJSON.estimate_nnb = 45 : 2750 < n ? personalDataJSON.estimate_nnb = 40 : 1198 < n ? personalDataJSON.estimate_nnb = 35 : 450 < n ? personalDataJSON.estimate_nnb = 30 : 250 < n ? personalDataJSON.estimate_nnb = 25 : 100 < n ? personalDataJSON.estimate_nnb = 20 : 50 < n ? personalDataJSON.estimate_nnb = 15 : personalDataJSON.estimate_nnb = 10;
  let i = 5 * (2 * v + 3 * w + 5 * _ + 8 * $ / .8 + 9 * I / .75 + 10 * S / .75 + 11 * D / .95 + 12 * A / .7) / 1440;
  i < at && (W = Math.min(at / i, 3), i *= W);
  var W = Math.min(it, Math.max(st, lt, i)).toFixed(2);
  personalDataJSON.estimate_active_days = W;
  O = parseInt(75 * C + 30 * W + 70 * O);
  personalDataJSON.estimate_ws = O;
  const dt = parseInt(et * W);
  W = parseInt(150 * P), P = 250 * F + 50 * k, j = 20 * j, B = 150 * B;
  const ct = W + P + j + B;
  B = 25 * T, M = 25 * M, R = 5 * R;
  const pt = B + M + R;
  let o = dt + ct - pt;
  o < 0 && (o = 0), personalDataJSON.total_energy = o.toFixed(0), personalDataJSON.nature_energy = dt.toFixed(0), personalDataJSON.item_energy = ct.toFixed(0), personalDataJSON.expend_energy = pt.toFixed(0);
  let r = 40;
  var L = [2, 2.8, 3.2, 3.2, 3.6, 3.8, 3.7, 4, 4.8, 4.8, 5.2, 5.2, 5.4, 5.8, 5.8, 6, 6.4, 6.6, 6.8, 7, 7, 7, 7, 7.3],
    G = [200, 500, 1e3, 2e3, 2750, 3e3, 3500, 4e3, 6e3, 7e3, 8e3, 11e3, 12420, 18e3, 18100, 24140, 31260, 36610, 46640, 56520, 67775, 84535, 106305, Number.MAX_SAFE_INTEGER];
  let s = 0,
    l = o,
    d = G[0];
  for (; 0 < l && r < 2e8;) {
    var q = Math.min(G[s], l, d, 1e3),
      H = L[s];
    const ht = 1.122 * 1.02 * H * q * ((348e-9 * Math.log(4750) + 31e-7) * r / 4 + .32433 - .0301431777);
    r += ht, l -= q, d -= q, l <= 0 ? true : 2e8 <= r ? true : s < L.length - 1 && d <= 0 && (++s, d = G[s])
  }
  if (0 < l)
    if (F < k && F <= 100) {
      const gt = 3240 * l;
      r += gt
    } else {
      const ft = 2510 * l;
      r += ft
    }
  0 < E && (r = .5 * r + .5 * r * (1 + .9 * (Math.pow(1.01, .5 * E) - 1))), r = parseInt(r);
  let c = Qt(r);
  var X, J = [2, 6, 11, 26, 31, 50, 71, 100],
    U = [100, 5e3, 1e4, 2e4, 3e4, 5e4],
    K = [5e6, 5e7, 5e8, 5e9, 5e10],
    k = [2e3, 2e4, 2e5, 2e6, 2e7, 2e8],
    F = [2500, 25e3, 25e4, 25e5, 35e6, 25e7],
    V = {
      "Absolute beginner": 1,
      Beginner: 2,
      Inexperienced: 3,
      Rookie: 4,
      Novice: 5,
      "Below average": 6,
      Average: 7,
      Reasonable: 8,
      "Above average": 9,
      Competent: 10,
      "Highly competent": 11,
      Veteran: 12,
      Distinguished: 13,
      "Highly distinguished": 14,
      Professional: 15,
      Star: 16,
      Master: 17,
      Outstanding: 18,
      Celebrity: 19,
      Supreme: 20,
      Idolised: 21,
      Champion: 22,
      Heroic: 23,
      Legendary: 24,
      Elite: 25,
      Invincible: 26
    };
  let p = 0;
  for (X in V)
    if (0 == personalDataJSON.rank.indexOf(X)) {
      p = V[X], personalDataJSON.rank_value = p, personalDataJSON.rank_name = X;
      break
    } E = personalDataJSON.rank.split(" ");
  if (personalDataJSON.rank_title = E[E.length - 1], 0 < p && r < Number.MAX_SAFE_INTEGER) {
    --p;
    var Y = personalDataJSON.level || 0;
    for (let t = 0; t < J.length; ++t) Y >= J[t] && --p;
    var Q = personalDataJSON.criminalrecord.total || 0;
    for (let t = 0; t < U.length; ++t) Q >= U[t] && --p;
    var Z = g.networth || 0;
    for (let t = 0; t < K.length; ++t) Z >= K[t] && --p;
    let t = 0,
      e = Number.MAX_SAFE_INTEGER;
    p <= 0 ? e = F[0] : p >= k.length ? t = k[k.length - 1] : (t = k[p - 1], e = F[p]), r < t ? (c = `${c}+`) : r > e ? (c = `${c}-`) : true
    personalDataJSON.bw_true_estimate = r
  }
  return { "bw_true_estimate": r, "bw_display_estimate": c };
}

function bw_compareEstimateBS(a, b) {
  return a.bw_true_estimate - b.bw_true_estimate;
}

function Qt(t) {
  return t < 0 ? "-" + Qt(-t) : 0 == t ? "0" : t <= 1 ? (100 * t).toFixed(2) + "%" : t < 1e3 ? "" + parseInt(t) : 1e3 <= t && t < 1e6 ? (t / 1e3).toFixed(2) + "k" : 1e6 <= t && t < 1e9 ? (t / 1e6).toFixed(2) + "m" : 1e9 <= t && t < 1e12 ? (t / 1e9).toFixed(2) + "b" : 1e12 <= t && t < 1e15 ? (t / 1e12).toFixed(2) + "t" : 1e15 <= t ? "MAX" : void 0
}

export { bw_estimate, bw_compareEstimateBS };
