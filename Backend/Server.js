const express = require("express");

const http = require("http");

const cors = require("cors");

const { Server } = require("socket.io");

const generateSensor =
require("./sensorSimulator");

/*
====================================
APP
====================================
*/

const app = express();

app.use(cors());

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
STATUS SISTEM
====================================
*/

let systemActive = true;

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

app.get("/",(req,res)=>{

  res.send(
    "Backend Monitoring Running"
  );

});

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