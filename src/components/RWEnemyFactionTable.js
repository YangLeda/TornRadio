import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

function RWEnemyFactionTable() {
  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect start");
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
          <p>Loading Items...</p>
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
              <th>Last Action</th>
              <th>Online Status</th>
              <th>Status</th>
              <th>Color</th>

            </tr>
          </thead>
          <tbody>
            {Object.keys(data.members).map((key, i) => {
              return (
                <tr key={key}>
                  <td>{i + 1}</td>
                  <td>
                    {data.members[key]["name"]} [{key}]
                  </td>
                  <td>{data.members[key]["level"]}</td>
                  <td>{data.members[key]["last_action"]["relative"]}</td>
                  <td>{data.members[key]["last_action"]["status"]}</td>
                  <td>{data.members[key]["status"]["description"]}</td>
                  <td>{data.members[key]["status"]["color"]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
      <Footer />
    </div>
  );
}

export default RWEnemyFactionTable;
