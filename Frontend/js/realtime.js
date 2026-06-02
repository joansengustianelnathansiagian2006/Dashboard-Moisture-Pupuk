/*
====================================
CANVAS
====================================
*/

const realtimeCanvas =
document.getElementById(
  "realtimeChart"
);

/*
====================================
LOCAL STORAGE
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
LOAD OLD DATA
====================================
*/

const labels =
loadState(
  "chartLabels",
  []
);

const moistureData =
loadState(
  "chartMoisture",
  []
);

/*
====================================
ANTI DUPLICATE
====================================
*/

let lastTime =

labels.length > 0

? labels[
    labels.length - 1
  ]

: null;
/*
====================================
CHART
====================================
*/

if(window.realtimeChartInstance){

  window.realtimeChartInstance
  .destroy();

}

/*
====================================
CREATE CHART
====================================
*/

window.realtimeChartInstance =

new Chart(realtimeCanvas,{

  type:"line",

  data:{

    labels:labels,

    datasets:[{

      label:"Kadar Air (%)",

      data:moistureData,

      borderColor:"#00ff99",

      backgroundColor:
      "rgba(0,255,153,0.2)",

      fill:true,

      tension:0.7,

      pointRadius:0,

      pointHoverRadius:0

    }]
  },

  options:{

    responsive:true,

    animation:{

      duration:800,

      easing:"easeOutQuart"

    },

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

    /*
    ================================
    AUTO SKIP
    ================================
    */

          autoSkip:true,

    /*
    ================================
    MAX LABEL
    ================================
    */

          maxTicksLimit:10,

    /*
    ================================
    ROTATION
    ================================
    */

          maxRotation:0,

          minRotation:0

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
const realtimeChart =

window.realtimeChartInstance;

/*
====================================
SOCKET
====================================
*/

socket.on(

  "sensorData",

  (data)=>{

    /*
    ================================
    UPDATE TEXT
    ================================
    */

    document.getElementById(
      "tempText"
    ).innerHTML =

      data.temperature + "°C";

    document.getElementById(
      "humText"
    ).innerHTML =

      data.humidity + "%";

    document.getElementById(
      "waterText"
    ).innerHTML =

      data.moisture + "%";

    /*
    ================================
    STATUS
    ================================
    */

    const statusText =
    document.getElementById(
      "statusText"
    );

    if(data.status === "AMAN"){

      statusText.innerHTML =
      "AMAN";

      statusText.className =
      "aman";

    }

    else if(
      data.status === "WASPADA"
    ){

      statusText.innerHTML =
      "WASPADA";

      statusText.className =
      "waspada";

    }
    else{

      statusText.innerHTML =
      "BAHAYA";

      statusText.className =
      "bahaya";

    }

    /*
    ================================
    UPDATE CHART
    ================================
    */

    const now =
    new Date();

/*
====================================
AUTO FORMAT
====================================
*/

    let timeLabel;

/*
====================================
UNDER 1 MINUTE
====================================
*/

    if(labels.length < 30){

      timeLabel =

      now.toLocaleTimeString();

    }

/*
====================================
AFTER MANY DATA
====================================
*/

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

    if(lastTime !== timeLabel){

       labels.push(
        timeLabel
      );

  /*
  ================================
  SMOOTH DATA
  ================================
  */

      const currentMoisture =

      parseFloat(
        data.moisture
      );

  /*
  ================================
  PREVIOUS
  ================================
  */

      const previous =

      moistureData.length > 0

      ? moistureData[
          moistureData.length - 1
        ]

      : currentMoisture;

  /*
  ================================
  AVERAGE
  ================================
  */

      const smoothMoisture =

      (
        previous +
        currentMoisture
      ) / 2;

  /*
  ================================
  PUSH
  ================================
  */

      moistureData.push(
        smoothMoisture
      );

  /*
  ================================
  SAVE LAST
  ================================
  */

      lastTime =
      timeLabel;

    }

    /*
    ================================
    LIMIT
    ================================
    */

    if(labels.length > 300){

      labels.shift();

      moistureData.shift();

    }

    /*
    ================================
    SAVE STORAGE
    ================================
    */

    saveState(
      "chartLabels",
      labels
    );

    saveState(
      "chartMoisture",
      moistureData
    );

    /*
    ================================
    UPDATE CHART
    ================================
    */

    realtimeChart.update();

    /*
    ================================
    UPDATE GAUGE
    ================================
    */

    smoothGaugeUpdate(
      parseFloat(
        data.moisture
      )
    );

  }

);

/*
====================================
SMOOTH GAUGE
====================================
*/

function smoothGaugeUpdate(
  targetValue
){

  let currentValue =

  gaugeChart.data.datasets[0]
  .needleValue;

  const smoothMove =

  setInterval(()=>{

    currentValue +=

    (
      targetValue
      - currentValue
    )

    * 0.08;

    gaugeChart.data.datasets[0]
    .needleValue =

    currentValue.toFixed(1);

    gaugeChart.update();

    /*
    ================================
    STOP
    ================================
    */

    if(

      Math.abs(

        targetValue
        - currentValue

      ) < 0.5

    ){

      gaugeChart.data.datasets[0]
      .needleValue = targetValue;

      gaugeChart.update();

      clearInterval(
        smoothMove
      );

    }

  },20);

}