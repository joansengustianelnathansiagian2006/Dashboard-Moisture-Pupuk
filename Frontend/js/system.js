const systemToggle =
document.getElementById(
  "systemToggle"
);

let active = true;

systemToggle.addEventListener(
  "click",

  ()=>{

    active = !active;

    socket.emit(
      "toggleSystem"
    );

    if(active){

      systemToggle.innerHTML =
      "Sistem Aktif";

      systemToggle.style.background =
      "#00ff99";

    }else{

      systemToggle.innerHTML =
      "Sistem Nonaktif";

      systemToggle.style.background =
      "red";

      systemToggle.style.color =
      "white";
    }

  }

);