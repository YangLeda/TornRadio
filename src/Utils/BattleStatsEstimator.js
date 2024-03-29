const estimatedStatsStr = ["under 2k", "2k - 25k", "20k - 250k", "200k - 2.5m", "2m - 25m", "20m - 250m", "over 200m"];

function estimate(personalDataJSON) {
  const ranks = {
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
    Idolized: 21,
    Champion: 22,
    Heroic: 23,
    Legendary: 24,
    Elite: 25,
    Invincible: 26,
  };

  const triggerLevel = [2, 6, 11, 26, 31, 50, 71, 100];
  const triggerCrime = [100, 5000, 10000, 20000, 30000, 50000];
  const triggerNetworth = [5000000, 50000000, 500000000, 5000000000, 50000000000];

  if (!personalDataJSON) {
    console.log("estimate failed because of no data");
    return "N/A";
  }

  // algorithm by Josephine [1923258]
  var rankSpl = personalDataJSON.rank.split(" ");
  var rankStr = rankSpl[0];
  if (rankSpl[1][0] === rankSpl[1][0].toLowerCase()) rankStr += " " + rankSpl[1];

  var level = personalDataJSON.level;
  var rank = ranks[rankStr];
  var crimes = personalDataJSON.criminalrecord ? personalDataJSON.criminalrecord.total : 0;
  var networth = personalDataJSON.personalstats ? personalDataJSON.personalstats.networth : 0;

  var trLevel = 0,
    trCrime = 0,
    trNetworth = 0;
  for (let l in triggerLevel) {
    if (triggerLevel[l] <= level) trLevel++;
  }
  for (let c in triggerCrime) {
    if (triggerCrime[c] <= crimes) trCrime++;
  }
  for (let nw in triggerNetworth) {
    if (triggerNetworth[nw] <= networth) trNetworth++;
  }

  var statLevel = rank - trLevel - trCrime - trNetworth - 1;

  let estimatedStats = estimatedStatsStr[statLevel];
  if (!estimatedStats) estimatedStats = "N/A";

  return estimatedStats;
}

function compareEstimateBS(str1, str2) {
  if (str1 == "N/A" || str1 == "" || str1 == null) {
    return 1;
  }
  if (str2 == "N/A" || str2 == "" || str2 == null) {
    return -1;
  }
  let map = new Map();
  let index = 0;
  estimatedStatsStr.forEach((str) => {
    map.set(str, index);
    index++;
  });
  return map.get(str1) - map.get(str2);
}

export { estimate, compareEstimateBS };
