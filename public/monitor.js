const FETCH_MONITOR_INTERVAL = 10000;  // 10s
const API_REQUEST_DELAY = 2000;  // 2s

const BLACK = "#000000";
const RED = "#f96b85";
const YELLOW = "#fffd88";
const FONT_BLACK = "#000000";
const FONT_WHITE = "#F8F8FF";

const notificationsP = document.getElementById("notifications");
const eventsDiv = document.getElementById("events");
const errorsP = document.getElementById("errors");
const eventsP = document.getElementById("events_p");
const eventsPCenter = document.getElementById("events_p_center_container");
const eventsReminderP = document.getElementById("events_reminder_p");

notificationsP.style.background = BLACK;
eventsPCenter.style.background = BLACK;
eventsReminderP.style.background = BLACK;
errorsP.style.background = RED;

eventsDiv.onclick = function () {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
    }
};

let last_api_timestamp = -1;
let hasRedEvent = false;

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
        return;
    }
    if (json["server_error"]) {
        return;
    } else {
        last_api_timestamp = json["last_api_timestamp"];
        tick();
    }
    if (json["notifications"]["messages"] > 0 || json["notifications"]["events"] > 0) {
        notificationsP.innerText = json["notifications"]["messages"] > 0 ? "Mails: " + json["notifications"]["messages"] + " " : "" +
            json["notifications"]["events"] > 0 ? "Events: " + json["notifications"]["events"] : "";
        notificationsP.style.background = YELLOW;
    } else {
        notificationsP.innerText = "";
        notificationsP.style.background = BLACK;
    }
    if (json["events"].length > 0) {
        let textStr = "";
        for (let event of json["events"]) {
            textStr += event + "\n";
        }
        if (!hasRedEvent) {
            playSound();
        }
        hasRedEvent = true;
        eventsP.innerText = textStr;
        eventsPCenter.style.background = RED;

    } else {
        hasRedEvent = false;
        eventsP.innerText = "";
        eventsPCenter.style.background = BLACK;
    }
    if (json["reminder_events"].length > 0) {
        let textStr = "";
        for (let event of json["reminder_events"]) {
            textStr += event + "\n";
        }
        eventsReminderP.innerText = textStr;
        eventsReminderP.style.background = YELLOW;
    } else {
        eventsReminderP.innerText = "";
        eventsReminderP.style.background = BLACK;
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
        errorsP.innerText = "Init";
        errorsP.style.background = RED;
        errorsP.style.color = FONT_BLACK;
        return;
    }
    let localeString = new Date(last_api_timestamp * 1000).toLocaleString();
    let durationInSeconds = Math.floor(Date.now() / 1000) - last_api_timestamp;
    let durationMinutes = Math.floor(durationInSeconds / 60);
    let durationSeconds = durationInSeconds % 60;
    errorsP.innerText = localeString + " " + (durationMinutes > 0 ? durationMinutes + " minutes " : "") + durationSeconds + " seconds ago";
    if (durationMinutes < 2) {
        errorsP.style.background = BLACK;
        errorsP.style.color = FONT_WHITE;
    } else {
        errorsP.style.background = RED;
        errorsP.style.color = FONT_BLACK;
    }
}

function playSound() {
    let sound = new Audio("notification-sound.mp3");
    sound.play();
}
