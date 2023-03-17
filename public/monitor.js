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

handleMonitor();
setInterval(async () => {
    handleMonitor();
}, FETCH_MONITOR_INTERVAL);

tick();
setInterval(async () => {
    tick();
}, 1000);

async function handleMonitor() {
    const json = await fetchMonitor();
    if (!json) {
        errorsP.innerText = "Failed to fetch from tornradio server";
        errorsP.style.background = YELLOW;
        last_api_timestamp = -1;
        return;
    }
    if (json["server_error"]) {
        errorsP.innerText = "Error message from tornradio server: " + json["server_error"];
        errorsP.style.background = YELLOW;
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

async function fetchMonitor() {
    try {
        let retryCount = 0;
        while (retryCount < 3) {
            retryCount++;
            let res = await fetch(`http://www.tornradio.com:3001/monitor`);
            let json = await res.json();
            if (json["server_error"] != undefined && json["last_api_timestamp"] && json["notifications"] && json["events"]) {
                return json;
            } else {
                await new Promise(resolve => setTimeout(resolve, API_REQUEST_DELAY));
            }
        }
        return null;
    } catch (error) {
        return null;
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
        errorsP.style.background = YELLOW;
    }
}
