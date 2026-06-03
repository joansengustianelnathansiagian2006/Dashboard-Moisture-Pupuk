const systemToggle =
document.getElementById(
  "systemToggle"
);


/*
====================================
SYSTEM BUTTON
====================================
*/

const systemButton =

document.getElementById(
  "systemToggle"
);

/*
====================================
SYSTEM STATUS
====================================
*/

socket.on(

  "systemStatus",

  (data)=>{

    /*
    ====================================
    SYSTEM ACTIVE
    ====================================
    */

    if(data.active){

      systemButton.innerHTML =

      "Sistem Aktif";

      systemButton.style.background =

      "#00ff99";

    }

    /*
    ====================================
    SYSTEM OFF
    ====================================
    */

    else{

      systemButton.innerHTML =

      "System Mati";

      systemButton.style.background =

      "red";

    }

  }

);

/*
====================================
TOGGLE BUTTON
====================================
*/

systemButton.addEventListener(

  "click",

  ()=>{

    socket.emit(
      "toggleSystem"
    );

  }

);