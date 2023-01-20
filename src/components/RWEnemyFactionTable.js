import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./RWEnemyFactionTable.css";
import { estimate, compareEstimateBS } from "../Utils/BattleStatsEstimator";
import { Button, Table } from "antd";
import { ClockCircleFilled } from "@ant-design/icons";
import { compareOnline, compareStatus } from "../Utils/SorterComparer";

const API_URL = "http://www.tornradio.com:3001";
const columns = [
  {
    title: "Index",
    dataIndex: "index",
    key: "index",
    sorter: (a, b) => a.index - b.index,
  },
  {
    title: "Name[ID]",
    dataIndex: "nameId",
    key: "nameId",
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
    title: "Energy Drinks",
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
    title: "Online",
    dataIndex: "online",
    key: "online",
    sorter: (a, b) => compareOnline(a.online, b.online),
    render: (text) => {
      if (text.indexOf("Offline") === 0) {
        return <ClockCircleFilled style={{ color: "Gray" }} />;
      } else if (text.indexOf("Online") === 0) {
        return <ClockCircleFilled style={{ color: "forestgreen" }} />;
      } else if (text.indexOf("Idle") === 0) {
        return <ClockCircleFilled style={{ color: "goldenrod" }} />;
      }
    },
    filters: [
      {
        text: "Online",
        value: "Online",
      },
      {
        text: "Offline",
        value: "Offline",
      },
      {
        text: "Idle",
        value: "Idle",
      },
    ],
    onFilter: (value, record) => record.online.indexOf(value) === 0,
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
    console.log("useEffect() start");
    fetchFaction();
    console.log("useEffect() end");
  }, []);

  const fetchFaction = async () => {
    console.log("fetchFaction start");
    try {
      const response = await fetch(`${API_URL}/faction`);
      if (!response.ok) {
        throw new Error(`fetchFaction HTTP error: ${response.status}`);
      }
      const actualData = await response.json();
      console.log("fetchFaction done size = " + Object.keys(actualData).length);
      setFactionData(actualData);
      setfetchFactionError(null);
      let processedFactionData = processFactionData(actualData);
      let cacheData = await fetchCache();
      fillInCacheData(processedFactionData, cacheData);
      setDataSource(processedFactionData);
    } catch (err) {
      console.log("fetchFaction error " + err.message);
      setfetchFactionError(err.message);
    } finally {
      setIsFetchingFaction(false);
    }
  };

  const fetchCache = async () => {
    console.log("fetchCache start");
    try {
      const response = await fetch(`${API_URL}/cache`);
      if (!response.ok) {
        throw new Error(`fetchCache HTTP error: ${response.status}`);
      }
      const actualData = await response.json();
      console.log("fetchCache done size = " + Object.keys(actualData).length);
      return actualData;
    } catch (err) {
      console.log("fetchCache error" + err.message);
    }
  };

  const updateTable = async () => {
    console.log("updateTable start");
    setIsFetchingFaction(true);
    try {
      const response = await fetch(`${API_URL}/faction`);
      if (!response.ok) {
        throw new Error(`updateTable HTTP error: ${response.status}`);
      }
      const actualData = await response.json();
      console.log("updateTable done size = " + Object.keys(actualData).length);
      setfetchFactionError(null);
      let processedFactionData = processFactionData(actualData);
      let cacheData = await fetchCache();
      fillInCacheData(processedFactionData, cacheData);
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
      <Header title="Faction Member List" />
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
    console.log("processFactionData key = " + key);
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
  console.log("processFactionData done size = " + Object.keys(result).length);
  return result;
}

function fillInCacheData(origin, data) {
  origin.forEach((playerObj) => {
    console.log("fillInCacheData key = " + playerObj["key"]);
    playerObj["age"] = data[playerObj["key"]]["age"];
    if (data[playerObj["key"]]["personalstats"] == undefined) {
      return;
    }
    playerObj["xanax"] = data[playerObj["key"]]["personalstats"]["xantaken"];
    playerObj["refill"] = data[playerObj["key"]]["personalstats"]["refills"];
    playerObj["drink"] = data[playerObj["key"]]["personalstats"]["energydrinkused"];
    playerObj["estimateBS"] = estimate(data[playerObj["key"]]);
  });
  console.log("fillInCacheData done size = " + Object.keys(origin).length);
}

export default RWEnemyFactionTable;
