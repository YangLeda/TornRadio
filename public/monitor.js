
const FETCH_MONITOR_INTERVAL = 30000;  // 30s
const API_REQUEST_DELAY = 5000;  // 5s

const notificationsP = document.getElementById("notifications");
const eventsP = document.getElementById("events");
const errorsP = document.getElementById("errors");

handleMonitor();
setInterval(async () => {
    handleMonitor();
}, FETCH_MONITOR_INTERVAL);

async function handleMonitor() {
    const json = await fetchMonitor();
    if (!json) {
        errorsP.innerText = "Failed to fetch from tornradio server";
        errorsP.style.background = "red";
        return;
    }
    if (json["server_error"]) {
        errorsP.innerText = "Error message from tornradio server: " + json["server_error"];
        errorsP.style.background = "red";
        return;
    } else {
        const timeStr = moment.unix(json["last_api_timestamp"]).tz("Asia/Shanghai").format("DD/MM/YYYY HH:mm:ss");
        const durationStr = moment.unix(moment().unix() - json["last_api_timestamp"]).format("HH:mm:ss") + " ago";
        errorsP.innerText = timeStr + " " + durationStr;
        errorsP.style.background = "green";
    }
    if (json["notifications"]["messages"] > 0 || json["notifications"]["events"] > 0) {
        notificationsP.innerText = json["notifications"]["messages"] > 0 ? "Mails: " + json["notifications"]["messages"] + " " : "" +
            json["notifications"]["events"] > 0 ? "Events: " + json["notifications"]["events"] : "";
        notificationsP.style.background = "red";
    } else {
        notificationsP.innerText = "";
        notificationsP.style.background = "green";
    }
    if (json["events"].length > 0) {
        let textStr = "";
        for (let event in json["events"]) {
            textStr += event + "\n";
        }
        eventsP.innerText = textStr;
        eventsP.style.background = "red";
    } else {
        eventsP.innerText = "";
        eventsP.style.background = "green";
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
