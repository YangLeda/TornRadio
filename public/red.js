const FETCH_MONITOR_INTERVAL = 10000;  // 10s
const API_REQUEST_DELAY = 1000;  // 1s

const GREEN = "#b2e672";
const RED = "#f96b85";
const YELLOW = "#fffd88";

const notificationsP = document.getElementById("notifications");
const eventsDiv = document.getElementById("events");
const eventsP = document.getElementById("events_p");
const errorsP = document.getElementById("errors");

let last_api_timestamp = -1;

/* Copy of server side code start */
let monitorEventsJson = {};
monitorEventsJson["server_error"] = "Initiating";
monitorEventsJson["last_api_timestamp"] = 0;
monitorEventsJson["notifications"] = {};
monitorEventsJson["events"] = [];
/* Copy of server side code end */

popup();

handleMonitorClient();
setInterval(async () => {
    handleMonitorClient();
}, FETCH_MONITOR_INTERVAL);

tick();
setInterval(async () => {
    tick();
}, 1000);

async function handleMonitorClient() {
    await handleMonitor();
    const json = monitorEventsJson;
    if (!json) {
        errorsP.innerText = "Check API key and network";
        errorsP.style.background = RED;
        last_api_timestamp = -1;
        return;
    }
    if (json["server_error"]) {
        errorsP.innerText = "Error message: " + json["server_error"];
        errorsP.style.background = RED;
        last_api_timestamp = -1;
        return;
    } else {
        last_api_timestamp = json["last_api_timestamp"];
        tick();
    }
    if (json["notifications"]["messages"] > 0 || json["notifications"]["events"] > 0) {
        notificationsP.innerText = json["notifications"]["messages"] > 0 ? "Mails: " + json["notifications"]["messages"] + " " : "" +
            json["notifications"]["events"] > 0 ? "Events: " + json["notifications"]["events"] : "";
        notificationsP.style.background = RED;
    } else {
        notificationsP.innerText = "";
        notificationsP.style.background = GREEN;
    }
    if (json["events"].length > 0) {
        let textStr = "";
        for (let event of json["events"]) {
            textStr += event + "\n";
        }
        eventsP.innerText = textStr;
        eventsDiv.style.background = RED;
    } else {
        eventsP.innerText = "";
        eventsDiv.style.background = GREEN;
    }
}

function unixToString(unix_timestamp) {
    let utcApiDate = new Date(unix_timestamp * 1000);
    let durationInSeconds = Math.floor(Date.now() / 1000) - unix_timestamp;
    let durationMinutes = Math.floor(durationInSeconds / 60);
    let durationSeconds = durationInSeconds % 60;
    return utcApiDate.toLocaleString() + " " + (durationMinutes > 0 ? durationMinutes + " minutes " : "") + durationSeconds + " seconds ago";
}

function tick() {
    if (last_api_timestamp <= 0) {
        return;
    }
    let localeString = new Date(last_api_timestamp * 1000).toLocaleString();
    let durationInSeconds = Math.floor(Date.now() / 1000) - last_api_timestamp;
    let durationMinutes = Math.floor(durationInSeconds / 60);
    let durationSeconds = durationInSeconds % 60;
    errorsP.innerText = localeString + " " + (durationMinutes > 0 ? durationMinutes + " minutes " : "") + durationSeconds + " seconds ago";
    if (durationMinutes < 1) {
        errorsP.style.background = GREEN;
    } else {
        errorsP.style.background = RED;
    }
}

function popup() {
    let key = localStorage.getItem("api_key");
    if (!key) {
        key = "";
    }
    key = prompt("API key:", key);
    if (!key) {
        key = "";
    }
    localStorage.setItem("api_key", key);
}

/* Copy of server side code start */
async function handleMonitor() {
    const json = await fetchMonitor();
    if (!json) {
        monitorEventsJson["server_error"] = "Check API key and network";
        return;
    }
    monitorRawJson = json;
    monitorEventsJson["server_error"] = "";
    monitorEventsJson["last_api_timestamp"] = json["timestamp"];
    monitorEventsJson["notifications"] = json["notifications"];
    monitorEventsJson["events"] = createEvents(json);
    console.log(monitorEventsJson)
}

async function fetchMonitor() {
    let retryCount = 0;
    while (retryCount < 3) {
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, API_REQUEST_DELAY));
        const selections = "basic,profile,bars,cooldowns,education,timestamp,notifications,icons";
        let res = await fetch(`https://api.torn.com/user/?selections=${selections}&key=${localStorage.getItem("api_key")}`);
        let json = await res.json();
        if (json["timestamp"]) {
            return json;
        }
    }
    return null;
}

function createEvents(json) {
    let resultEvents = [];
    checkCooldowns(json, resultEvents);
    checkBars(json, resultEvents);
    checkTravel(json, resultEvents);
    checkHospital(json, resultEvents);
    checkEducation(json, resultEvents);
    checkRacing(json, resultEvents);
    return resultEvents;
}

function checkCooldowns(json, resultEvents) {
    if (json["cooldowns"]["drug"] <= 10) {
        resultEvents.push("No drug cooldown");
    }
    // if (json["cooldowns"]["medical"] <= 600) {
    //     resultEvents.push("No medical cooldown");
    // }
    if (json["cooldowns"]["booster"] <= 1800) {
        resultEvents.push("No booster cooldown");
    }
}

function checkBars(json, resultEvents) {
    if (json["energy"]["fulltime"] <= 1800) {
        resultEvents.push("Full energy bar");
    }
    if (json["nerve"]["fulltime"] <= 1800) {
        resultEvents.push("Full nerve bar");
    }
}

function checkTravel(json, resultEvents) {
    if (json["status"]["state"] == "Abroad") {
        resultEvents.push("Landed abroad");
    }
}

function checkHospital(json, resultEvents) {
    if (json["states"]["hospital_timestamp"] - json["timestamp"] > 0 && json["states"]["hospital_timestamp"] - json["timestamp"] <= 300) {
        resultEvents.push("Out of hosipital in 5 min");
    }
}

function checkEducation(json, resultEvents) {
    if (json["education_timeleft"] <= 10) {
        resultEvents.push("Education done");
    }
}

function checkRacing(json, resultEvents) {
    // if (Object.keys(json["icons"]).includes("icon17")) {
    //     return;
    // }
    // if (json["status"]["state"] != "Okay") {
    //     return;
    // }
    // for (let log of Object.values(json["log"])) {
    //     if (Math.floor(Date.now() / 1000) - log["timestamp"] > 900) {
    //         resultEvents.push("Racing ready");
    //         return;
    //     }
    //     if (log["title"] == "Racing leave official race") {
    //         return;
    //     }
    // }
}
/* Copy of server side code end */
