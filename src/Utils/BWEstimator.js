/* eslint-disable no-unused-expressions */

//  冰蛙 estimating algorithm is from SMTH 冰蛙宝鉴 bingri[1523812] kaeru[1769499] htys[1545351] mirrorhye[2564936] tobytorn[1617955] Microdust[2587304].

function bw_estimate(personalDataJSON) {
  return { "bw_true_estimate": 0, "bw_display_estimate": 0 };
}

function bw_compareEstimateBS(a, b) {
  return a.bw_true_estimate - b.bw_true_estimate;
}

function Qt(t) {
  return t < 0 ? "-" + Qt(-t) : 0 == t ? "0" : t <= 1 ? (100 * t).toFixed(2) + "%" : t < 1e3 ? "" + parseInt(t) : 1e3 <= t && t < 1e6 ? (t / 1e3).toFixed(2) + "k" : 1e6 <= t && t < 1e9 ? (t / 1e6).toFixed(2) + "m" : 1e9 <= t && t < 1e12 ? (t / 1e9).toFixed(2) + "b" : 1e12 <= t && t < 1e15 ? (t / 1e12).toFixed(2) + "t" : 1e15 <= t ? "MAX" : void 0
}

export { bw_estimate, bw_compareEstimateBS };
