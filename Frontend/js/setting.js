const socket =
io("http://127.0.0.1:5000");

/*
================================
SYSTEM BUTTON
================================
*/

const toggleBtn =
document.getElementById(
  "toggleSystemBtn"
);

/*
================================
STATUS
================================
*/

let active = true;

/*
================================
LOAD STATUS
================================
*/

socket.on(

  "systemStatus",

  (data)=>{

    active = data.active;

    updateButton();

  }

);

/*
================================
UPDATE BUTTON
================================
*/

function updateButton(){

  if(active){

    toggleBtn.innerHTML =
    "SYSTEM ACTIVE";

    toggleBtn.style.background =
    "#00ff99";

    toggleBtn.style.color =
    "black";

  }else{

    toggleBtn.innerHTML =
    "SYSTEM OFF";

    toggleBtn.style.background =
    "red";

    toggleBtn.style.color =
    "white";

  }

}

/*
================================
TOGGLE
================================
*/

toggleBtn.addEventListener(

  "click",

  ()=>{

    socket.emit(
      "toggleSystem"
    );

  }

);

/*
================================
RESET HISTORY
================================
*/

document.getElementById(
  "resetHistoryBtn"
).addEventListener(

  "click",

  ()=>{

    socket.emit(
      "resetHistory"
    );
    /*
====================================
RESET TEMP HUM CHART
====================================
*/

    localStorage.removeItem(
      "tempHumLabels"
    );

    localStorage.removeItem(
      "tempData"
    );

    localStorage.removeItem(
      "humData"
    );

/*
====================================
RESET MOISTURE CHART
====================================
*/

    localStorage.removeItem(
      "chartLabels"
    );

    localStorage.removeItem(
      "chartMoisture"
    );

    alert(
      "History Reset Success"
    );

  }

);

/*
================================
LANGUAGE
================================
*/

const languageSelect =
document.getElementById(
  "languageSelect"
);

/*
================================
LOAD LANGUAGE
================================
*/

const savedLanguage =
localStorage.getItem(
  "language"
);

if(savedLanguage){

  languageSelect.value =
  savedLanguage;

  applyLanguage(
    savedLanguage
  );

}

/*
================================
CHANGE LANGUAGE
================================
*/

languageSelect.addEventListener(

  "change",

  ()=>{

    const lang =
    languageSelect.value;

    /*
    ================================
    SAVE
    ================================
    */

    localStorage.setItem(
      "language",
      lang
    );

    /*
    ================================
    RELOAD ALL PAGE
    ================================
    */

    socket.emit(
      "resetHistory"
    );

    localStorage.removeItem(
      "tempHumLabels"
    );

    localStorage.removeItem(
      "tempData"
    );

    localStorage.removeItem(
      "humData"
    );

    localStorage.removeItem(
      "chartLabels"
    );

    localStorage.removeItem(
  "chartMoisture"
    );

    alert(
      "History Reset Success"
    );

    location.reload();

  }

);

/*
================================
APPLY LANGUAGE
================================
*/

function applyLanguage(lang){

  /*
  ================================
  INDONESIA
  ================================
  */

  if(lang === "id"){

    document.getElementById(
      "languageTitle"
    ).innerHTML =
    "Pengaturan Bahasa";

    toggleBtn.innerHTML =
    active
    ? "SISTEM AKTIF"
    : "SISTEM OFF";

    document.getElementById(
      "resetHistoryBtn"
    ).innerHTML =
    "RESET RIWAYAT";

  }

  /*
  ================================
  ENGLISH
  ================================
  */

  else{

    document.getElementById(
      "languageTitle"
    ).innerHTML =
    "Language Setting";

    toggleBtn.innerHTML =
    active
    ? "SYSTEM ACTIVE"
    : "SYSTEM OFF";

    document.getElementById(
      "resetHistoryBtn"
    ).innerHTML =
    "RESET HISTORY";

  }

}

/*
================================
SOCKET STATUS
================================
*/

socket.on(

  "connect",

  ()=>{

    document.getElementById(
      "socketStatus"
    ).innerHTML =
    "CONNECTED";

  }

);

socket.on(

  "disconnect",

  ()=>{

    document.getElementById(
      "socketStatus"
    ).innerHTML =
    "DISCONNECTED";

  }

);