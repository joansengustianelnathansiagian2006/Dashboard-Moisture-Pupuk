const gaugeCanvas =
document.getElementById("gaugeChart");

/*
====================================
PLUGIN JARUM
====================================
*/

const needleGauge = {

  id: "needleGauge",

  afterDatasetDraw(chart, args, options){

    const {

      ctx,

      config,

      data,

      chartArea: {
        top,
        bottom,
        left,
        right,
        width,
        height
      }

    } = chart;

    ctx.save();

    const needleValue =
    data.datasets[0].needleValue;

    const dataTotal =
    data.datasets[0].data.reduce(
      (a,b)=>a+b,
      0
    );

    const angle =
    Math.PI +
    (1 / dataTotal * needleValue * Math.PI);

    const cx =
    width / 2;

    const cy =
    chart._metasets[0].data[0].y;

    /*
    ================================
    JARUM
    ================================
    */

    ctx.translate(cx, cy);

    ctx.rotate(angle);

    ctx.beginPath();

    ctx.moveTo(0, -5);

    ctx.lineTo(height - 180, 0);

    ctx.lineTo(0, 5);

    ctx.fillStyle = "white";

    ctx.fill();

    ctx.restore();

    /*
    ================================
    TITIK TENGAH
    ================================
    */

    ctx.beginPath();

    ctx.arc(cx, cy, 10, 0, 10);

    ctx.fillStyle = "white";

    ctx.fill();

    ctx.restore();

    /*
    ================================
    TEXT NILAI
    ================================
    */

    ctx.font = "bold 35px Arial";

    ctx.fillStyle = "white";

    ctx.textAlign = "center";

    ctx.fillText(

      needleValue + "%",

      cx,

      cy + 60

    );

  }

};

/*
====================================
CHART GAUGE
====================================
*/

const gaugeChart =
new Chart(gaugeCanvas, {

  type: "doughnut",

  data: {

    labels: [

      "Sangat Baik",
      "Baik",
      "Waspada",
      "Bahaya",
      "Sangat Bahaya"

    ],

    datasets: [{

      label: "Gauge",

      data: [20,20,20,20,20],

      needleValue: 50,

      backgroundColor: [

        "#00cc44",
        "#99ff00",
        "#ffcc00",
        "#ff6600",
        "#ff0000",

      ],

      borderWidth: 0,

      circumference: 180,

      rotation: 270,

      cutout: "70%"

    }]

  },

  options: {

    responsive: true,

    plugins: {

      legend: {

        labels: {

          color: "white"

        }

      }

    }

  },

  plugins: [needleGauge]

});