const fs = require("fs");

const express = require("express");

const http = require("http");

const cors = require("cors");

const { Server } = require("socket.io");

const path = require("path");

/*
====================================
HISTORY FILE PATH
====================================
*/

const historyFile =

path.join(
  __dirname,
  "history.json"
);

/*
====================================
CREATE FILE
====================================
*/

if(!fs.existsSync(historyFile)){

  fs.writeFileSync(
    historyFile,
    "[]"
  );

}

/*
====================================
APP
====================================
*/

const app = express();

/*
====================================
FRONTEND STATIC
====================================
*/

app.use(

  express.static(

    path.join(
      __dirname,
      "Frontend"
    )

  )

);

app.use(cors());

/*
====================================
HTTP SERVER
====================================
*/

const server =
http.createServer(app);

/*
====================================
SOCKET IO
====================================
*/

const io = new Server(server, {

  cors: {
    origin: "*"
  }

});

/*
====================================
DATA HISTORY
====================================
*/

let historyData = [];

/*
====================================
LOAD HISTORY FILE
====================================
*/

try{

  const savedData =

  fs.readFileSync(
    historyFile
  );

  historyData =

  JSON.parse(savedData);

}
catch(error){

  console.log(
    "History file empty"
  );

  historyData = [];

}

/*
====================================
STATUS SISTEM
====================================
*/

let systemActive = true;
function generateSensor(){

  const temperature =
  (25 + Math.random()*10)
  .toFixed(1);

  const humidity =
  (40 + Math.random()*30)
  .toFixed(1);

  const moisture =
  (10 + Math.random()*80)
  .toFixed(1);

  let status = "AMAN";

  if(moisture >= 70){

    status = "BAHAYA";

  }
  else if(moisture >= 40){

    status = "WASPADA";

  }

  return {

    temperature,
    humidity,
    moisture,
    status,

    time:
    new Date()
    .toLocaleTimeString(),

  /*
  ====================================
  TIMESTAMP
  ====================================
  */

    timestamp:
    Date.now()

  };

}
/*
====================================
SOCKET CONNECTION
====================================
*/

io.on("connection",(socket)=>{

  console.log("Client Connected");

  /*
  ====================================
  KIRIM HISTORY SAAT CONNECT
  ====================================
  */

  socket.emit(
    "historyData",
    historyData
  );

  /*
  ====================================
  KIRIM STATUS SISTEM
  ====================================
  */

  socket.emit(
    "systemStatus",
    {
      active: systemActive
    }
  );

   /*
    ====================================
    DISCONNECT
    ====================================
    */

    socket.on(

      "disconnect",

      ()=>{

        console.log(
          "Client Disconnected"
        );

      }

    );

  /*
  ====================================
  TOGGLE SISTEM
  ====================================
  */

  socket.on(
    "toggleSystem",

    ()=>{

      systemActive = !systemActive;

      console.log(
        "System Active:",
        systemActive
      );

      io.emit(
        "systemStatus",
        {
          active: systemActive
        }
      );

    }

  );

  /*
  ====================================
  RESET HISTORY
  ====================================
  */

  socket.on(
    "resetHistory",

    ()=>{

      historyData = [];

      console.log(
        "History Reset"
      );

      io.emit(
        "historyData",
        historyData
      );

    }

  );

  /*
  ====================================
  DISCONNECT
  ====================================
  */

  socket.on(
    "disconnect",

    ()=>{

      console.log(
        "Client Disconnected"
      );

    }

  );
  /*
====================================
REQUEST HISTORY
====================================
*/

  socket.on(

    "requestHistory",

    ()=>{

      socket.emit(
        "historyData",
        historyData
      );

    }

  );
});

/*
====================================
KIRIM DATA REALTIME
====================================
*/

setInterval(()=>{

  /*
  ====================================
  JIKA SISTEM AKTIF
  ====================================
  */

  if(systemActive){

    /*
    ====================================
    GENERATE SENSOR
    ====================================
    */

    const data =
    generateSensor();
    console.log(data);

    /*
    ====================================
    SIMPAN HISTORY
    ====================================
    */

    historyData.push(data);

    /*
====================================
SAVE HISTORY FILE
====================================
*/

    fs.writeFileSync(

      historyFile,

      JSON.stringify(

        historyData,

        null,

        2

      )

    );

    /*
    ====================================
    BATASI HISTORY
    ====================================
    */

    if(historyData.length > 100){

      historyData.shift();

    }

    /*
    ====================================
    KIRIM DATA SENSOR
    ====================================
    */

    io.emit(
      "sensorData",
      data
    );

    /*
    ====================================
    UPDATE HISTORY REALTIME
    ====================================
    */

    io.emit(
      "historyData",
      historyData
    );

  }

},5000);

/*
====================================
TEST API
====================================
*/


/*
====================================
RUN SERVER
====================================
*/

server.listen(5000,()=>{

  console.log(
    "Server running on port 5000"
  );

});
