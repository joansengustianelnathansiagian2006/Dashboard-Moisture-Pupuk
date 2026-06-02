/*
====================================
LOAD LANGUAGE
====================================
*/

const currentLanguage =

localStorage.getItem(
  "language"
) || "id";

/*
====================================
TRANSLATION
====================================
*/

const translations = {

  /*
  ====================================
  INDONESIA
  ====================================
  */

  id:{

    dashboard:"Dashboard",

    monitoring:"Monitoring",

    history:"Riwayat Data",

    setting:"Pengaturan",

    systemActive:"Sistem Aktif",

    systemOff:"Sistem Off",

    realtimeChart:"Grafik Realtime",

    moisture:"Kadar Air",

    humidity:"Kelembapan",

    temperature:"Suhu",

    status:"Status"

  },

  /*
  ====================================
  ENGLISH
  ====================================
  */

  en:{

    dashboard:"Dashboard",

    monitoring:"Monitoring",

    history:"History Data",

    setting:"Setting",

    systemActive:"System Active",

    systemOff:"System Off",

    realtimeChart:"Realtime Chart",

    moisture:"Moisture",

    humidity:"Humidity",

    temperature:"Temperature",

    status:"Status"

  }

};

/*
====================================
APPLY LANGUAGE
====================================
*/

function applyGlobalLanguage(){

  /*
  ================================
  GET LANG
  ================================
  */

  const lang =
  translations[currentLanguage];

  /*
  ================================
  MENU
  ================================
  */

  setText(
    "menuDashboard",
    lang.dashboard
  );

  setText(
    "menuMonitoring",
    lang.monitoring
  );

  setText(
    "menuHistory",
    lang.history
  );

  setText(
    "menuSetting",
    lang.setting
  );

  /*
  ================================
  DASHBOARD
  ================================
  */

  setText(
    "titleRealtimeChart",
    lang.realtimeChart
  );

  setText(
    "titleMoisture",
    lang.moisture
  );

  setText(
    "titleHumidity",
    lang.humidity
  );

  setText(
    "titleTemperature",
    lang.temperature
  );

  setText(
    "titleStatus",
    lang.status
  );

}

/*
====================================
SET TEXT
====================================
*/

function setText(id,text){

  const element =
  document.getElementById(id);

  if(element){

    element.innerHTML = text;

  }

}

/*
====================================
RUN
====================================
*/

applyGlobalLanguage();