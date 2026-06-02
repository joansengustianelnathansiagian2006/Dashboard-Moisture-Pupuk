/*
====================================
CANVAS
====================================
*/

const tempHumCanvas =
document.getElementById(
  "tempHumChart"
);

/*
====================================
LOAD STORAGE
====================================
*/

const tempLabels =
loadState(
  "tempHumLabels",
  []
);

const tempData =
loadState(
  "tempData",
  []
);

const humData =
loadState(
  "humData",
  []
);

/*
====================================
CHART
====================================
*/

const tempHumChart =
new Chart(tempHumCanvas,{

  type:"line",

  data:{

    labels:tempLabels,

    datasets:[

      /*
      ================================
      TEMPERATURE
      ================================
      */

      {

        label:"Temperature (°C)",

        data:tempData,

        borderColor:"#ff6600",

        backgroundColor:
        "rgba(255,102,0,0.2)",

        fill:true,

        tension:0.4,
        pointRadius:0,
        pointHoverRadius:0

      },

      /*
      ================================
      HUMIDITY
      ================================
      */

      {

        label:"Humidity (%)",

        data:humData,

        borderColor:"#00ccff",

        backgroundColor:
        "rgba(0,204,255,0.2)",

        fill:true,

        tension:0.4,
        pointRadius:0,
        pointHoverRadius:0

      }

    ]

  },

  options:{

    responsive:true,

    maintainAspectRatio:false,

    scales:{

      y:{

        min:0,

        max:100,

        ticks:{

          color:"white"

        },

        grid:{

          color:"#222"

        }

      },

      x:{

        ticks:{

          color:"white",

          autoSkip:true,

          maxTicksLimit:10

        },

        grid:{

          color:"#111"

        }

      }

    },

    plugins:{

      legend:{

        labels:{

          color:"white"

        }

      }

    }

  }

});

/*
====================================
REALTIME
====================================
*/

socket.on(

  "sensorData",

  (data)=>{

    /*
    ================================
    TIME
    ================================
    */

    const now =
    new Date();

    let timeLabel;

    if(tempLabels.length < 30){

      timeLabel =

      now.toLocaleTimeString();

    }

    else{

      timeLabel =

      now.toLocaleTimeString(
        [],
        {
          hour:"2-digit",
          minute:"2-digit"
        }
      );

    }

    /*
    ================================
    PUSH
    ================================
    */

    tempLabels.push(
      timeLabel
    );

    tempData.push(

      parseFloat(
        data.temperature
      )

    );

    humData.push(

      parseFloat(
        data.humidity
      )

    );

    /*
    ================================
    LIMIT
    ================================
    */

    if(tempLabels.length > 300){

      tempLabels.shift();

      tempData.shift();

      humData.shift();

    }

    /*
    ================================
    SAVE
    ================================
    */

    saveState(
      "tempHumLabels",
      tempLabels
    );

    saveState(
      "tempData",
      tempData
    );

    saveState(
      "humData",
      humData
    );

    /*
    ================================
    UPDATE
    ================================
    */

    tempHumChart.update();

  }

);