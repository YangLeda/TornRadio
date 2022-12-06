import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import estimate from "../Utils/BattleStatsEstimator";
import { readLocalStorage, writeLocalStorage } from "../Utils/PreLoadCache";

function RWEnemyFactionTable() {
  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    //readLocalStorage();
    writeLocalStorage();
    console.log("useEffect() start");
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.torn.com/faction/37595?selections=&key=${process.env.REACT_APP_TORN_API_KEY}`
        );
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        const actualData = await response.json();
        console.log(actualData);
        setData(actualData);
        setFetchError(null);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="App">
        <Header title="Faction Member List" />
        <main>
          <p>Loading List...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="App">
        <Header title="Faction Member List" />
        <main>
          <p style={{ color: "red" }}>{`Error: ${fetchError}`}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="App">
      <Header title="Faction Member List" />
      <main>
        <p>
          <b>Faction: </b>
          {data.name}[{data.ID}]
        </p>
        <p>
          <b>Leaders: </b>[{data.leader}][{data["co-leader"]}]
        </p>

        <table>
          <thead>
            <tr>
              <th>Index</th>
              <th>Name[ID]</th>
              <th>Level</th>
              <th>Xanax</th>
              <th>Rehab</th>
              <th>AttWon</th>
              <th>AttLost</th>
              <th>DefWon</th>
              <th>DefLost</th>
              <th>Est Battle Stats</th>
              <th>Color</th>
              <th>Action</th>
              <th>Online</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data.members).map((key, i) => {
              const personalData = localStorage.getItem(key);
              const personalDataJSON = personalData
                ? JSON.parse(personalData)
                : null;
              return (
                <tr key={key}>
                  <td>{i + 1}</td>
                  <td>
                    {data.members[key]["name"]} [{key}]
                  </td>
                  <td>{data.members[key]["level"]}</td>
                  <td>
                    {personalDataJSON
                      ? personalDataJSON["personalstats"]["xantaken"]
                      : "N/A"}
                  </td>
                  <td>
                    {personalDataJSON
                      ? personalDataJSON["personalstats"]["rehabs"]
                      : "N/A"}
                  </td>
                  <td>
                    {personalDataJSON
                      ? personalDataJSON["personalstats"]["attackswon"]
                      : "N/A"}
                  </td>
                  <td>
                    {personalDataJSON
                      ? personalDataJSON["personalstats"]["attackslost"]
                      : "N/A"}
                  </td>
                  <td>
                    {personalDataJSON
                      ? personalDataJSON["personalstats"]["defendswon"]
                      : "N/A"}
                  </td>
                  <td>
                    {personalDataJSON
                      ? personalDataJSON["personalstats"]["defendslost"]
                      : "N/A"}
                  </td>
                  <td>{estimate(data.members[key])}</td>
                  <td>{data.members[key]["status"]["color"]}</td>
                  <td>{data.members[key]["last_action"]["relative"]}</td>
                  <td>{data.members[key]["last_action"]["status"]}</td>
                  <td>{data.members[key]["status"]["description"]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button
          disabled={!true}
          onClick={() => fetchAllPersonalStats(Object.keys(data.members))}
        >
          Update All Personal Stats(Under construction)
        </button>
      </main>
      <Footer />
    </div>
  );
}

function fetchAllPersonalStats(memberIds) {
  //
  return;
  console.log("fetchAllPersonalStats() start");
  console.log(memberIds);
  const MAX_REQUEST_NUM = 100;
  const REQUEST_DELAY = 1000;
  let requestCount = 0;
  const timerId = setInterval(() => {
    console.log(`fetch ${memberIds[requestCount]}`);
    fetch(
      `https://api.torn.com/user/${memberIds[requestCount]}?selections=basic,personalstats,crimes&key=${process.env.REACT_APP_TORN_API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => saveToLocalStorage(data["player_id"], data));
    requestCount++;
    if (requestCount > MAX_REQUEST_NUM || requestCount > memberIds.length - 1) {
      console.log("fetch stopped because MAX_REQUEST_NUM reached.");
      clearInterval(timerId);
    }
    if (requestCount > memberIds.length - 1) {
      console.log("fetch finished.");
      clearInterval(timerId);
    }
  }, REQUEST_DELAY);
}

function saveToLocalStorage(memberId, data) {
  console.log(`saveToLocalStorage [${memberId}]`);
  if (memberId && JSON.stringify(data)) {
    localStorage.setItem(memberId, JSON.stringify(data));
  } else {
    console.log(
      `saveToLocalStorage [${memberId}] Failed because of invalid value`
    );
  }
}

export default RWEnemyFactionTable;
