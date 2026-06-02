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