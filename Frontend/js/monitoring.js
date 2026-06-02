const socket = io(
  "https://dashboard-moisture-pupuk-production.up.railway.app"
);

/*
====================================
ELEMENT
====================================
*/

const eventLog =
document.getElementById(
  "eventLog"
);

const avgMoisture =
document.getElementById(
  "avgMoisture"
);

const warningCount =
document.getElementById(
  "warningCount"
);

const dangerCount =
document.getElementById(
  "dangerCount"
);

const packetText =
document.getElementById(
  "packetText"
);

const delayText =
document.getElementById(
  "delayText"
);

const recommendationBox =
document.getElementById(
  "recommendationBox"
);

const uptimeText =
document.getElementById(
  "uptimeText"
);

const sensorStatus =
document.getElementById(
  "sensorStatus"
);

const backendStatus =
document.getElementById(
  "backendStatus"
);

/*
====================================
GLOBAL STATE
====================================
*/

function saveState(key,value){

  localStorage.setItem(

    key,

    JSON.stringify(value)

  );

}

function loadState(key,defaultValue){

  const data =
  localStorage.getItem(key);

  return data

    ? JSON.parse(data)

    : defaultValue;

}

/*
====================================
LOAD DATA
====================================
*/

let packet =
loadState("packet",0);

let warning =
loadState("warning",0);

let danger =
loadState("danger",0);

let logs =
loadState("logs",[]);

let seconds =
loadState("uptime",0);

let moistureArray =
loadState(
  "moistureArray",
  []
);

/*
====================================
INITIAL VALUE
====================================
*/

packetText.innerHTML =
packet;

warningCount.innerHTML =
warning;

dangerCount.innerHTML =
danger;

/*
====================================
LOAD OLD LOG
====================================
*/

/*
====================================
LOAD OLD LOG
====================================
*/

function renderLogs(){

  eventLog.innerHTML = "";

  logs.forEach((text)=>{

    const log =
    document.createElement("p");

    log.innerHTML = text;

    /*
    ================================
    COLOR
    ================================
    */

    if(text.includes("DANGER")){

      log.style.color = "red";

    }

    else if(
      text.includes("WARNING")
    ){

      log.style.color =
      "yellow";

    }

    else{

      log.style.color =
      "#00ff99";

    }

    eventLog.appendChild(log);

  });

}

renderLogs();

/*
====================================
SOCKET CONNECT
====================================
*/

socket.on(

  "connect",

  ()=>{

    backendStatus.innerHTML =
    "CONNECTED";

    backendStatus.style.color =
    "#00ff99";

    addLog(
      "🟢 Backend Connected"
    );

  }

);

/*
====================================
SOCKET DISCONNECT
====================================
*/

socket.on(

  "disconnect",

  ()=>{

    backendStatus.innerHTML =
    "DISCONNECTED";

    backendStatus.style.color =
    "red";

    addLog(
      "🔴 Backend Disconnected"
    );

  }

);

/*
====================================
SYSTEM STATUS
====================================
*/

socket.on(

  "systemStatus",

  (data)=>{

    if(data.active){

      sensorStatus.innerHTML =
      "ONLINE";

      sensorStatus.style.color =
      "#00ff99";

      addLog(
        "🟢 Monitoring Active"
      );

    }

    else{

      sensorStatus.innerHTML =
      "OFFLINE";

      sensorStatus.style.color =
      "red";

      addLog(
        "🔴 Monitoring Stopped"
      );

    }

  }

);

/*
====================================
UPTIME
====================================
*/

setInterval(()=>{

  seconds++;

  saveState(
    "uptime",
    seconds
  );

  let hrs =
  Math.floor(seconds / 3600);

  let mins =
  Math.floor(
    (seconds % 3600) / 60
  );

  let secs =
  seconds % 60;

  uptimeText.innerHTML =

    `${hrs}`
    .padStart(2,"0")

    + ":"

    +

    `${mins}`
    .padStart(2,"0")

    + ":"

    +

    `${secs}`
    .padStart(2,"0");

},1000);

/*
====================================
REALTIME SENSOR
====================================
*/

socket.on(

  "sensorData",

  (data)=>{

    /*
    ================================
    PACKET
    ================================
    */

    packet++;

    packetText.innerHTML =
    packet;

    saveState(
      "packet",
      packet
    );

    /*
    ================================
    LATENCY
    ================================
    */

    const delay =

      Math.floor(
        Math.random() * 30
      ) + 5;

    delayText.innerHTML =
    delay + " ms";

    /*
    ================================
    AVG MOISTURE
    ================================
    */

    moistureArray.push(

      parseFloat(
        data.moisture
      )

    );

    /*
    ================================
    LIMIT ARRAY
    ================================
    */

    if(moistureArray.length > 30){

      moistureArray.shift();

    }

    saveState(
      "moistureArray",
      moistureArray
    );

    /*
    ================================
    CALCULATE AVG
    ================================
    */

    const avg =

      moistureArray.reduce(

        (a,b)=>a+b,

        0

      )

      /

      moistureArray.length;

    avgMoisture.innerHTML =

      avg.toFixed(1)

      + "%";

    /*
    ================================
    DANGER
    ================================
    */

    if(data.moisture >= 70){

      danger++;

      dangerCount.innerHTML =
      danger;

      saveState(
        "danger",
        danger
      );

      addLog(
        "🚨 DANGER - Moisture Critical"
      );

      recommendationBox.innerHTML =

      `
      Reduce moisture immediately
      to avoid fertilizer damage.
      `;

      recommendationBox.style.borderLeft =
      "5px solid red";

      recommendationBox.style.color =
      "red";

    }

    /*
    ================================
    WARNING
    ================================
    */

    else if(
      data.status === "WASPADA"
    ){

      warning++;

      warningCount.innerHTML =
      warning;

      saveState(
        "warning",
        warning
      );

      addLog(
        "⚠ WARNING - Moisture Increasing"
      );

      recommendationBox.innerHTML =

      `
      Moisture increasing.
      Monitor condition carefully.
      `;

      recommendationBox.style.borderLeft =
      "5px solid yellow";

      recommendationBox.style.color =
      "yellow";

    }

    /*
    ================================
    NORMAL
    ================================
    */

    else{

      addLog(
        "✅ NORMAL - System Stable"
      );

      recommendationBox.innerHTML =

      `
      System Stable.
      No action required.
      `;

      recommendationBox.style.borderLeft =
      "5px solid #00ff99";

      recommendationBox.style.color =
      "#00ff99";

    }

  }

);

/*
====================================
ADD LOG
====================================
*/

function addLog(message){

  /*
  ================================
  CEK ELEMENT
  ================================
  */

  if(!eventLog) return;

  const time =

  new Date()
  .toLocaleTimeString();

  const text =

  `[${time}] ${message}`;

  /*
  ================================
  SAVE LOG
  ================================
  */

  logs.unshift(text);

  /*
  ================================
  LIMIT STORAGE
  ================================
  */

  if(logs.length > 50){

    logs.pop();

  }

  saveState(
    "logs",
    logs
  );

  /*
  ================================
  CREATE LOG
  ================================
  */

  const log =
  document.createElement("p");

  log.innerHTML = text;

  /*
  ================================
  COLOR
  ================================
  */

  if(message.includes("DANGER")){

    log.style.color = "red";

  }

  else if(
    message.includes("WARNING")
  ){

    log.style.color =
    "yellow";

  }

  else{

    log.style.color =
    "#00ff99";

  }

  /*
  ================================
  INSERT
  ================================
  */

  eventLog.prepend(log);

  /*
  ================================
  LIMIT VIEW
  ================================
  */

  if(eventLog.children.length > 30){

    eventLog.removeChild(
      eventLog.lastChild
    );

  }

}