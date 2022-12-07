function compareColor(str1, str2) {
  let map = new Map();
  map.set("green", 0);
  map.set("blue", 1);
  map.set("red", 2);
  return map.get(str1) - map.get(str2);
}

function compareOnline(str1, str2) {
  let map = new Map();
  map.set("Online", 0);
  map.set("Idle", 1);
  map.set("Offline", 2);
  return map.get(str1) - map.get(str2);
}

export { compareColor, compareOnline };
