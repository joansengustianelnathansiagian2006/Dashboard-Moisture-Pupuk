const socket = io(
  "https://dashboard-moisture-pupuk-production.up.railway.app"
);

/*
================================
TABLE
================================
*/

const historyTable =
document.getElementById(
  "historyTable"
);

/*
================================
REALTIME HISTORY
================================
*/

socket.on(
  "historyData",

  (history)=>{

    console.log(history);

    historyTable.innerHTML = "";

    /*
    ================================
    LOOP
    ================================
    */

    history.forEach((data)=>{

      let statusColor =
      "#00ff99";

      if(data.status === "AMAN"){

        statusColor = "#00ff99";

      }
      else if(
        data.status === "WASPADA"
      ){

        statusColor = "yellow";

      }
      else{

        statusColor = "red";

      }


      const row = `

        <tr>

          <td>${data.time}</td>

          <td>
            ${data.temperature}°C
          </td>

          <td>
            ${data.humidity}%
          </td>

          <td>
            ${data.moisture}%
          </td>

          <td
            style="
              color:${statusColor};
              font-weight:bold;
            "
          >

            ${data.status}

          </td>

        </tr>

      `;

      historyTable.innerHTML += row;

    });

  }

);

/*
================================
RESET
================================
*/

document.getElementById(
  "resetButton"
).addEventListener(

  "click",

  ()=>{

    socket.emit(
      "resetHistory"
    );

  }

);