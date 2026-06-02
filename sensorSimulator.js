let counter = 0;

function generateSensor(){

  counter++;

  let humidity;
  let temperature;
  let moisture;

  /*
  ==================================
  KONDISI BAHAYA
  ==================================
  */

  if(counter % 5 === 0){

    humidity =
    75 + Math.random() * 15;

    moisture =
    70 + Math.random() * 20;

  }else{

    humidity =
    35 + Math.random() * 40;

    moisture =
    30 + Math.random() * 50;

  }

  temperature =
  24 + Math.random() * 8;

  /*
  ==================================
  STATUS
  ==================================
  */

  let status = "AMAN";

  if(moisture < 50){

    status = "AMAN";

  }
  else if(

    moisture >= 50 &&
    moisture < 70

  ){

    status = "WASPADA";

  }
  else{

    status = "BAHAYA";

  }


  return {

    humidity:
    humidity.toFixed(1),

    temperature:
    temperature.toFixed(1),

    moisture:
    moisture.toFixed(1),

    status: status,

    time:
    new Date().toLocaleTimeString()

  };

}

module.exports =
generateSensor;