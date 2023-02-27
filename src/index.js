import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import RWEnemyFactionTable from "./components/RWEnemyFactionTable";
import Chart from "chart.js/auto"

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<RWEnemyFactionTable />);

const API_URL = "http://www.tornradio.com:3001";
let data;

function decodeHtml(html) {
  let txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function containsHighlight(string) {
  if (string.includes("Monarch") ||
    string.includes("Bloodbath and Beyond") ||
    string.includes("Free Xanax") ||
    string.includes("Legitimate Business") ||
    string.includes("Little Stompers") ||
    string.includes("Swiss Army of Light") ||
    string.includes("The Black Hand") ||
    string.includes("The Iron") ||
    string.includes("The Next Level") ||
    string.includes("The Wolverines") ||
    string.includes("Vulpes Vulpes") ||
    string.includes("Wargasm") ||
    string.includes("Wolf Pack")) {
    return 1;
  } else if (string.includes("Natural Selection") ||
    string.includes("NS Bomb Shelter") ||
    string.includes("Buttgrass") ||
    string.includes("Carbon") ||
    string.includes("Destructive Anomaly") ||
    string.includes("Dead or Alive") ||
    string.includes("DP Warriors") ||
    string.includes("Dystopia") ||
    string.includes("WarBirds") ||
    string.includes("The Nest")) {
    return 2;
  }
  return 0;
}

const fetchMap = async () => {
  console.log("fetchMap start");
  try {
    const response = await fetch(`${API_URL}/map`);
    if (!response.ok) {
      throw new Error(`fetchMap HTTP error: ${response.status}`);
    }
    const actualData = await response.json();
    console.log("fetchMap done");
    console.log(actualData);
    let result = {};
    result.notInWar = new Array();
    result.inWar = new Array();
    for (const key of Object.keys(actualData["territory"])) {
      let obj = {};
      obj.key = key;  // territory name
      obj.x = parseFloat(actualData["territory"][key]["coordinate_x"]);
      obj.y = parseFloat(actualData["territory"][key]["coordinate_y"]) * -1;
      obj.factionId = actualData["territory"][key]["faction"];
      obj.factionName = actualData["territory"][key]["name"];
      obj.factionTag = actualData["territory"][key]["tag"];
      if (actualData["territory"][key]["assaulting_faction"]) {
        obj.isInWar = true;
        obj.assaultingFactionId = actualData["territory"][key]["assaulting_faction"];
        obj.defendingFactionId = actualData["territory"][key]["defending_faction"];
        obj.assaultingFactionName = decodeHtml(actualData["territory"][key]["assaulting_faction_name"]);
        obj.defendingFactionName = decodeHtml(actualData["territory"][key]["defending_faction_name"]);
        obj.assaultingFactionTag = actualData["territory"][key]["assaulting_faction_tag"];
        obj.defendingFactionTag = actualData["territory"][key]["defending_faction_tag"];
        obj.r = 10;
        result.inWar.push(obj);
      } else {
        obj.isInWar = false;
        obj.r = 2;
        result.notInWar.push(obj);
      }
    }
    if (actualData["msg"]) {
      result.msg = actualData["msg"];
    } else {
      result.msg = "";
    }
    console.log(result);
    return result;
  } catch (err) {
    console.log("fetchMap error" + err.message);
  }
};

(async function () {
  data = await fetchMap();

  let defendingMap = new Map();
  for (const obj of data.inWar) {
    if (defendingMap.has(obj.defendingFactionId)) {
      let fac = defendingMap.get(obj.defendingFactionId);
      if (!fac.assaultingFaction.has(obj.assaultingFactionId)) {
        fac.assaultingFaction.set(obj.assaultingFactionId, { "assaultingFactionName": obj.assaultingFactionName, "assaultingFactionTag": obj.assaultingFactionTag });
      }
      fac.defendingCount += 1;
    } else {
      let fac = {};
      fac.id = obj.factionId;
      fac.assaultingFaction = new Map().set(obj.assaultingFactionId, { "assaultingFactionName": obj.assaultingFactionName, "assaultingFactionTag": obj.assaultingFactionTag });
      fac.defendingFactionId = obj.defendingFactionId;
      fac.defendingFactionName = obj.defendingFactionName;
      fac.defendingFactionTag = obj.defendingFactionTag;
      fac.defendingCount = 1;
      defendingMap.set(obj.defendingFactionId, fac);
    }
  }
  const sortedDefendingMap = new Map([...defendingMap.entries()].sort((a, b) => b[1].defendingCount - a[1].defendingCount));
  console.log(sortedDefendingMap);
  const div = document.getElementById("map_text");
  for (const obj of sortedDefendingMap.entries()) {
    const li = document.createElement("li");
    const img = document.createElement("img");
    if (obj[1].defendingFactionTag.includes("-0.png")) {
      img.src = "https://factiontags.torn.com/" + "0-0.png";
    } else {
      img.src = "https://factiontags.torn.com/" + obj[1].defendingFactionTag;
    }
    li.appendChild(img);
    let a = document.createElement("a");
    a.appendChild(document.createTextNode(obj[1].defendingFactionName));
    a.title = obj[1].defendingFactionName;
    a.href = "https://www.torn.com/factions.php?step=profile&ID=" + obj[1].defendingFactionId;
    a.classList.add("highlight_" + containsHighlight(obj[1].defendingFactionName));
    li.appendChild(a);
    let textnode = document.createTextNode(" is defending " + obj[1].defendingCount + " territory from");
    li.appendChild(textnode);
    for (const o of obj[1].assaultingFaction.entries()) {
      textnode = document.createTextNode(" ");
      li.appendChild(textnode);
      const img = document.createElement("img");
      if (o[1]["assaultingFactionTag"].includes("-0.png")) {
        img.src = "https://factiontags.torn.com/" + "0-0.png";
      } else {
        img.src = "https://factiontags.torn.com/" + o[1]["assaultingFactionTag"];
      }
      li.appendChild(img);
      a = document.createElement("a");
      a.appendChild(document.createTextNode(o[1]["assaultingFactionName"]));
      a.title = o[1]["assaultingFactionName"];
      a.href = "https://www.torn.com/factions.php?step=profile&ID=" + o[0];
      a.classList.add("highlight_" + containsHighlight(o[1]["assaultingFactionName"]));
      li.appendChild(a);
    }
    div.appendChild(li);
  }

  const div2 = document.getElementById("map_text_2");
  let textnode2 = document.createTextNode(data.msg);
  div2.appendChild(textnode2);

  const onClickHandler = (evt, arr, chart) => {
    const points = chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
    if (points.length) {
      const firstPoint = points[0];
      const value = chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
      const factionId = value.factionId;
      if (parseInt(factionId) > 0) {
        const url = "https://www.torn.com/factions.php?step=profile&ID=" + factionId;
        window.open(url, "_blank");
      }
    }
  };

  new Chart(document.getElementById("map"),
    {
      type: "bubble",
      data: {
        datasets: [{ label: ["Territory"], data: data.notInWar, backgroundColor: "rgb(135,206,250)", borderWidth: 0, hoverBorderWidth: 0, order: 100 },
        { label: ["Warring Territory"], data: data.inWar, borderColor: "rgb(218, 18, 18)", backgroundColor: "rgb(218, 18, 18)", borderWidth: 0, hoverBorderWidth: 0, order: 1 }],
      },
      plugins: [{
        beforeDraw: function (chart) {
          // chart.getDatasetMeta(1).data.forEach(async (d, i) => {
          //   console.log(d);
          //   const image = new Image(37.5, 28.5);  // 25 x 19
          //   if (data.inWar[i].factionTag.includes("-0.png")) {
          //     image = "https://factiontags.torn.com/" + "0-0.png";
          //   } else {
          //     image = "https://factiontags.torn.com/" + data.inWar[i].factionTag;
          //   }
          //   d.options.pointStyle = image;
          // });
        }
      }],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: onClickHandler,
        animation: false,
        scales: {
          x: {
            type: "linear",
            min: 0,
            max: 6240,
            grid: {
              display: false
            },
            ticks: {
              display: false
            },
            border: {
              width: 0
            }
          },
          y: {
            type: "linear",
            min: -3624,
            max: 0,
            grid: {
              display: false
            },
            ticks: {
              display: false
            },
            border: {
              width: 0
            }
          }
        },
        plugins: {
          title: {
            display: false,
          },
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let text = "";
                if (context.raw.isInWar) {
                  text = context.raw.key + ": " + context.raw.defendingFactionName + " < " + context.raw.assaultingFactionName;
                } else {
                  if (context.raw.factionId == 0) {
                    text = context.raw.key + ": " + "Unclaimed Territory";
                  } else {
                    text = context.raw.key + ": " + context.raw.factionName;
                  }
                }
                return text;
              }
            }
          }
        }
      }
    }
  );
})();
