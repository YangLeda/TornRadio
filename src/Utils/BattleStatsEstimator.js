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
  Idolised: 21,
  Champion: 22,
  Heroic: 23,
  Legendary: 24,
  Elite: 25,
  Invincible: 26,
};

const estimatedStats = [
  "under 2k",
  "2k - 25k",
  "20k - 250k",
  "200k - 2.5m",
  "2m - 25m",
  "20m - 250m",
  "over 200m",
];

function estimate(data) {
  // var rankSpl = oData.rank.split(" ");
  // var rankStr = rankSpl[0];
  // if (rankSpl[1][0] === rankSpl[1][0].toLowerCase()) rankStr += " " + rankSpl[1];

  // var level = oData.level;
  // var rank = ranks[rankStr];
  // var crimes = oData.criminalrecord ? oData.criminalrecord.total : 0;
  // var networth = oData.personalstats ? oData.personalstats.networth : 0;

  // var trLevel = 0, trCrime = 0, trNetworth = 0;
  // for (let l in triggerLevel) {
  //     if (triggerLevel[l] <= level) trLevel++;
  // }
  // for (let c in triggerCrime) {
  //     if (triggerCrime[c] <= crimes) trCrime++;
  // }
  // for (let nw in triggerNetworth) {
  //     if (triggerNetworth[nw] <= networth) trNetworth++;
  // }

  // var statLevel = rank - trLevel - trCrime - trNetworth - 1;

  // let estimatedStats = estimatedStats[statLevel];
  // if (!estimatedStats) estimatedStats = "N/A";

  // return estimatedStats;

  return "N/A";
}

export default estimate;
