function compareStatus(a, b) {
  let map = new Map();
  map.set("green", 0); // Okay
  map.set("red", 1); // In hospital
  map.set("blue", 2); // Traveling
  if (a.status.startsWith("In federal")) {
    return 1;
  }
  if (b.status.startsWith("In federal")) {
    return -1;
  }
  if (map.get(a.color) - map.get(b.color) !== 0) {
    // if is different status
    return map.get(a.color) - map.get(b.color);
  }
  if (map.get(a.color) !== 1) {
    // if is not in hospital
    return a.status.localeCompare(b.status);
  }
  if (a.status.startsWith("In a")) {
    return 1;
  }
  if (b.status.startsWith("In a")) {
    return -1;
  }
  return getTimeInSecs(a.status) - getTimeInSecs(b.status); // Compare in hospital seconds
}

function getTimeInSecs(str) {
  let splited = str.split(" ");
  if (str.indexOf("secs") >= 0 && str.indexOf("hrs") < 0 && str.indexOf("mins") < 0) {  // "In hospital for 2 secs"
    return parseInt(splited[3]);
  }
  if (str.indexOf("hrs") >= 0 && str.indexOf("mins") >= 0 && str.indexOf("secs") < 0) {  // "In hospital for 2 hrs 46 mins"
    return parseInt(splited[3]) * 60 * 60 + parseInt(splited[5]) * 60;
  }
  if (str.indexOf("hrs") >= 0 && str.indexOf("mins") < 0 && str.indexOf("secs") < 0) {  // "In hospital for 2 hrs"
    return parseInt(splited[3]) * 60 * 60;
  }
  if (str.indexOf("hrs") < 0 && str.indexOf("mins") >= 0 && str.indexOf("secs") < 0) {  // "In hospital for 2 mins"
    return parseInt(splited[3]) * 60;
  }
  if (str.indexOf("hrs") < 0 && str.indexOf("mins") >= 0 && str.indexOf("secs") >= 0) {  // "In hospital for 2 mins 30 secs"
    return parseInt(splited[3]) * 60 + parseInt(splited[5]);
  }
  return 
}

function compareOnline(str1, str2) {
  let map = new Map();
  map.set("Online", 0);
  map.set("Idle", 1);
  map.set("Offline", 2);
  return map.get(str1) - map.get(str2);
}

export { compareStatus, compareOnline };
