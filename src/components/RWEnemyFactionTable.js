import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./RWEnemyFactionTable.css";
import { estimate, compareEstimateBS } from "../Utils/BattleStatsEstimator";
import { bw_estimate, bw_compareEstimateBS } from "../Utils/BWEstimator";
import { Button, Table } from "antd";
import { ClockCircleFilled } from "@ant-design/icons";
import { compareOnline, compareStatus } from "../Utils/SorterComparer";

const API_URL = "http://www.tornradio.com:3001";
const columns = [
  {
    title: "Index",
    dataIndex: "index",
    key: "index",
  },
  {
    title: "Name[ID]",
    dataIndex: "nameId",
    key: "nameId",
    sorter: (a, b) => a.nameId.localeCompare(b.nameId),
    render: (text, record) => (
      <a href={"https://www.torn.com/profiles.php?XID=" + record.id} target="_blank" rel="noreferrer">
        {text}
      </a>
    ),
  },
  {
    title: "Level",
    dataIndex: "level",
    key: "level",
    sorter: (a, b) => a.level - b.level,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Xanax",
    dataIndex: "xanax",
    key: "xanax",
    sorter: (a, b) => a.xanax - b.xanax,
  },
  {
    title: "Refills",
    dataIndex: "refill",
    key: "refill",
    sorter: (a, b) => a.refill - b.refill,
  },
  {
    title: "Cans",
    dataIndex: "drink",
    key: "drink",
    sorter: (a, b) => a.drink - b.drink,
  },
  {
    title: "Est. Stats",
    dataIndex: "estimateBS",
    key: "estimateBS",
    sorter: (a, b) => compareEstimateBS(a.estimateBS, b.estimateBS),
    filters: [
      {
        text: "under 2k",
        value: "under 2k",
      },
      {
        text: "2k - 25k",
        value: "2k - 25k",
      },
      {
        text: "20k - 250k",
        value: "20k - 250k",
      },
      {
        text: "200k - 2.5m",
        value: "200k - 2.5m",
      },
      {
        text: "2m - 25m",
        value: "2m - 25m",
      },
      {
        text: "20m - 250m",
        value: "20m - 250m",
      },
      {
        text: "over 200m",
        value: "over 200m",
      },
    ],
    onFilter: (value, record) => record.estimateBS.indexOf(value) === 0,
  },
  {
    title: "冰蛙",
    dataIndex: "BWestimateBS",
    key: "BWestimateBS",
    sorter: (a, b) => bw_compareEstimateBS(a, b),
  },
  {
    title: "Strength",
    dataIndex: "str",
    key: "str",
    render: (text, record) => {
      return {
        props: {
          style: {
            background: (text == undefined || text == "0") ? "#FBFBFB" : "",
            textAlign: "right"
          }
        },
        children: <div>{(text == undefined || text == "0") ? "" : text.toLocaleString()}</div>
      };
    },
  },
  {
    title: "Speed",
    dataIndex: "spd",
    key: "spd",
    render: (text, record) => {
      return {
        props: {
          style: {
            background: (text == undefined || text == "0") ? "#FBFBFB" : "",
            textAlign: "right"
          }
        },
        children: <div>{(text == undefined || text == "0") ? "" : text.toLocaleString()}</div>
      };
    },
  },
  {
    title: "Dexterity",
    dataIndex: "dex",
    key: "dex",
    render: (text, record) => {
      return {
        props: {
          style: {
            background: (text == undefined || text == "0") ? "#FBFBFB" : "",
            textAlign: "right"
          }
        },
        children: <div>{(text == undefined || text == "0") ? "" : text.toLocaleString()}</div>
      };
    },
  },
  {
    title: "Defense",
    dataIndex: "def",
    key: "def",
    render: (text, record) => {
      return {
        props: {
          style: {
            background: (text == undefined || text == "0") ? "#FBFBFB" : "",
            textAlign: "right"
          }
        },
        children: <div>{(text == undefined || text == "0") ? "" : text.toLocaleString()}</div>
      };
    },
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    sorter: (a, b) => a.total - b.total,
    render: (text, record) => {
      return {
        props: {
          style: {
            background: (text == undefined || text == "0") ? "#FBFBFB" : "",
            textAlign: "right"
          }
        },
        children: <div>{(text == undefined || text == "0") ? "" : text.toLocaleString()}</div>
      };
    },
  },
  {
    title: "Online",
    dataIndex: "online",
    key: "online",
    render: (text) => {
      if (text.indexOf("Offline") === 0) {
        return <ClockCircleFilled style={{ color: "Gray" }} />;
      } else if (text.indexOf("Online") === 0) {
        return <ClockCircleFilled style={{ color: "forestgreen" }} />;
      } else if (text.indexOf("Idle") === 0) {
        return <ClockCircleFilled style={{ color: "goldenrod" }} />;
      }
    },
    sorter: (a, b) => compareOnline(a.online, b.online),
  },
  {
    title: "Last Action",
    dataIndex: "action",
    key: "action",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    sorter: (a, b) => compareStatus(a, b),
    render: (text, record) => <span style={{ color: record.color }}>{text} </span>,
  },
];

function RWEnemyFactionTable() {
  const [isFetchingFaction, setIsFetchingFaction] = useState(true);
  const [fetchFactionError, setfetchFactionError] = useState(null);

  const [factionData, setFactionData] = useState(null);
  const [dataSource, setDataSource] = useState(null);

  useEffect(() => {
    fetchFaction();
  }, []);

  const fetchFaction = async () => {
    try {
      const response = await fetch(`${API_URL}/faction`);
      if (!response.ok) {
        throw new Error(`fetchFaction HTTP error: ${response.status}`);
      }
      const actualData = await response.json();
      console.log(actualData);
      setFactionData(actualData);
      setfetchFactionError(null);
      let processedFactionData = processFactionData(actualData);
      let cacheData = await fetchCache();
      fillInCacheData(processedFactionData, cacheData);
      let spyData = await fetchSpy();
      fillInSpyData(processedFactionData, spyData);
      setDataSource(processedFactionData);
    } catch (err) {
      console.log("fetchFaction error " + err.message);
      setfetchFactionError(err.message);
    } finally {
      setIsFetchingFaction(false);
    }
  };

  const fetchCache = async () => {
    try {
      const response = await fetch(`${API_URL}/cache`);
      if (!response.ok) {
        throw new Error(`fetchCache HTTP error: ${response.status}`);
      }
      const actualData = await response.json();
      console.log(actualData);
      return actualData;
    } catch (err) {
      console.log("fetchCache error" + err.message);
    }
  };

  const fetchSpy = async () => {
    try {
      const response = await fetch(`${API_URL}/spy`);
      if (!response.ok) {
        throw new Error(`fetchCache HTTP error: ${response.status}`);
      }
      const actualData = await response.json();
      console.log(actualData);
      return actualData;
    } catch (err) {
      console.log("fetchSpy error" + err.message);
    }
  };

  const updateTable = async () => {
    setIsFetchingFaction(true);
    try {
      const response = await fetch(`${API_URL}/faction`);
      if (!response.ok) {
        throw new Error(`updateTable HTTP error: ${response.status}`);
      }
      const actualData = await response.json();
      setfetchFactionError(null);
      let processedFactionData = processFactionData(actualData);
      let cacheData = await fetchCache();
      fillInCacheData(processedFactionData, cacheData);
      let spyData = await fetchSpy();
      fillInSpyData(processedFactionData, spyData);
      setDataSource(processedFactionData);
    } catch (err) {
      console.log("updateTable error" + err.message);
      setfetchFactionError(err.message);
    } finally {
      setIsFetchingFaction(false);
    }
  };

  // show Error
  if (fetchFactionError) {
    return (
      <div className="App">
        <Header title="Faction Member List" />
        <main>
          <p style={{ color: "red" }}>{`Error: ${fetchFactionError}`}</p>
        </main>
        <Footer />
      </div>
    );
  }

  // show Data
  return (
    <div className="App">
      <Header title="Ranked War Enemy Faction Member List" />
      <main id="main">
        <p>
          <b>Faction: </b>
          {factionData ? factionData.name + "[" + factionData.ID + "]" : "Loading"}
          <b>&nbsp;&nbsp;&nbsp;&nbsp;Leaders: </b>
          {factionData ? "[" + factionData.leader + "] [" + factionData["co-leader"] + "]" : "Loading"}
        </p>
        <Button id="update-table-btn" type="primary" loading={isFetchingFaction} onClick={updateTable}>
          Update Members Status
        </Button>
        <Table id="member-table" dataSource={dataSource} columns={columns} bordered={true} loading={isFetchingFaction} pagination={false} size="small" tableLayout="auto" />
      </main>
      <Footer />
    </div>
  );
}

function processFactionData(data) {
  let result = [];
  Object.keys(data.members).map((key, i) => {
    let playerObj = {};
    playerObj["key"] = `${key}`; // key in table
    playerObj["id"] = `${key}`; // not used in table display
    playerObj["index"] = i + 1;
    playerObj["nameId"] = `${data.members[key]["name"]}[${key}]`;
    playerObj["level"] = `${data.members[key]["level"]}`;
    playerObj["color"] = `${data.members[key]["status"]["color"]}`;
    playerObj["action"] = `${data.members[key]["last_action"]["relative"]}`;
    playerObj["online"] = `${data.members[key]["last_action"]["status"]}`;
    playerObj["status"] = `${data.members[key]["status"]["description"]}`;
    result.push(playerObj);
    return true;
  });
  return result;
}

function fillInCacheData(origin, data) {
  origin.forEach((playerObj) => {
    if (data[playerObj["key"]] == undefined) {
      return;
    }
    playerObj["age"] = data[playerObj["key"]]["age"];
    if (data[playerObj["key"]]["personalstats"] == undefined) {
      return;
    }
    playerObj["xanax"] = data[playerObj["key"]]["personalstats"]["xantaken"];
    playerObj["refill"] = data[playerObj["key"]]["personalstats"]["refills"];
    playerObj["drink"] = data[playerObj["key"]]["personalstats"]["energydrinkused"];
    playerObj["estimateBS"] = estimate(data[playerObj["key"]]);
    let bw = bw_estimate(data[playerObj["key"]]);
    playerObj["BWestimateBS"] = bw.bw_display_estimate;
    playerObj["bw_true_estimate"] = bw.bw_true_estimate;
  });
}

function fillInSpyData(origin, data) {
  origin.forEach((playerObj) => {
    if (data[playerObj["key"]] == undefined) {
      playerObj["str"] = 0;
      playerObj["def"] = 0;
      playerObj["spd"] = 0;
      playerObj["dex"] = 0;
      playerObj["total"] = 0;
      return;
    }
    playerObj["str"] = data[playerObj["key"]]["str"];
    playerObj["def"] = data[playerObj["key"]]["def"];
    playerObj["spd"] = data[playerObj["key"]]["spd"];
    playerObj["dex"] = data[playerObj["key"]]["dex"];
    playerObj["total"] = data[playerObj["key"]]["total"];
  });
}

export default RWEnemyFactionTable;
