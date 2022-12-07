import React, { useState, useEffect } from "react"
import Header from "./Header"
import Footer from "./Footer"
import estimate from "../Utils/BattleStatsEstimator"
import "./RWEnemyFactionTable.css"

function RWEnemyFactionTable() {
  const [data, setData] = useState(null)
  const [fetchError, setFetchError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("useEffect() start")
    fetchServerCache()

    const fetchFaction = async () => {
      console.log("fetchFaction() start")
      try {
        const response = await fetch(`/faction`) //todo
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          )
        }
        const actualData = await response.json()
        console.log(actualData)
        setData(actualData)
        setFetchError(null)
      } catch (err) {
        setFetchError(err.message)
      } finally {
        setIsLoading(false)
      }
      console.log("fetchFaction() end")
    }
    fetchFaction()
    console.log("useEffect() end")
  }, [])

  if (isLoading) {
    return (
      <div className="App">
        <Header title="Faction Member List" />
        <main>
          <p>Fetching data...</p>
        </main>
        <Footer />
      </div>
    )
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
    )
  }
  const serverCacheJSON = JSON.parse(localStorage.getItem("serverCache"));
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

        <table className="styled-table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Name[ID]</th>
              <th>Level</th>
              <th>Age</th>
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
              const personalDataJSON = serverCacheJSON[key];
              return (
                <tr key={key}>
                  <td>{i + 1}</td>
                  <td>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={"https://www.torn.com/profiles.php?XID=" + key}
                    >
                      {data.members[key]["name"]} [{key}]
                    </a>
                  </td>
                  <td>{data.members[key]["level"]}</td>
                  <td>{personalDataJSON ? personalDataJSON["age"] : "N/A"}</td>
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
                  <td>{estimate(personalDataJSON)}</td>
                  <td>{data.members[key]["status"]["color"]}</td>
                  <td>{data.members[key]["last_action"]["relative"]}</td>
                  <td>{data.members[key]["last_action"]["status"]}</td>
                  <td>{data.members[key]["status"]["description"]}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </main>
      <Footer />
    </div>
  )
}

async function fetchServerCache() {
  console.log("fetchServerCache() start")
  const response = await fetch(`/cache`) //todo
  const actualData = await response.json()
  console.log(actualData)
  localStorage.setItem("serverCache", JSON.stringify(actualData))
  console.log("fetchServerCache() end")
}

export default RWEnemyFactionTable
