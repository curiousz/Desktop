console.log("Initialize");

const appId = getAppId(),
      focus = document.getElementById("focus"),
      greeting = document.getElementById("greeting"),
      name = document.getElementById("name"),
      showAmPm = true,
      time = document.getElementById("time"),
      theContainer = document.getElementById("theContainer"),
      weather = document.getElementById("weather"),
      zip = getZipCode();

console.log("Function Definitions");

// Show Time
function showTime() {
  let today = new Date(),
       hour = today.getHours(),
        min = today.getMinutes(),
        sec = today.getSeconds();
    
  var lastHour = getLastHour();
  //console.log("lastHour: " + lastHour);
  
  // Set AM or PM
  const amPm = hour >= 12 ? "PM" : "AM";
  
  //alert(hour + " | " + lastHour);
  
  if (((11 == lastHour) && (12 == hour)) || ((17 == lastHour) && (18 == hour)) || ((1 == lastHour) && (2 == hour))) {
    setBgGreet();
  }
  
  if ((lastHour != hour) || ((0 === min % 10) && (1 == sec))){
      getWeather(zip);
      //console.log("lastHour: " + lastHour + " | hour: " + hour );
  }

  setLastHour(hour);
  //console.log("hour: " + hour);
  
  // 12hr Format
  hour = hour % 12 || 12;

  // Output Time
  time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(
    sec
  )} ${showAmPm ? amPm : ""}`;

  setTimeout(showTime, 1000);
}

// Add Zeros
function addZero(n) {
  return (parseInt(n, 10) < 10 ? "0" : "") + n;
}

// Set Background and Greeting
function setBgGreet() {
  let today = new Date(),
    hour = today.getHours();

  if (hour < 12) {
    // Morning
    document.body.style.backgroundImage = "url('images/desktopmorning.jpg')";
    //document.body.style.backgroundPosition = "center";
    //document.body.style.backgroundRepeat = "no-repeat";
    greeting.textContent = "Good Morning, ";
  } else if (hour < 18) {
    // Afternoon
    document.body.style.backgroundImage = "url('images/desktopafternoon.jpg')";
    //document.body.style.backgroundPosition = "center";
    //document.body.style.backgroundRepeat = "no-repeat";
    greeting.textContent = "Good Afternoon, ";
  } else {
    // Evening
    document.body.style.backgroundImage = "url('images/desktopevening.jpg')";
    //document.body.style.backgroundPosition = "center";
    //document.body.style.backgroundRepeat = "no-repeat";
    greeting.textContent = "Good Evening, ";
    document.body.style.color = "white";
  }
}

// Get Name
function getName() {
  if (localStorage.getItem("name") === null) {
    name.textContent = "[Enter Name]";
  } else {
    name.textContent = localStorage.getItem("name");
  }
}

// Set Name
function setName(e) {
  if (e.type === "keypress") {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem("name", e.target.innerText);
      name.blur();
    }
  } else {
    localStorage.setItem("name", e.target.innerText);
  }
}

// Get Focus
function getFocus() {
  if (localStorage.getItem("focus") === null) {
    focus.textContent = "[Enter Focus]";
  } else {
    focus.textContent = localStorage.getItem("focus");
  }
}

// Set Focus
function setFocus(e) {
  if (e.type === "keypress") {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem("focus", e.target.innerText);
      focus.blur();
    }
  } else {
    localStorage.setItem("focus", e.target.innerText);
  }
}

// Get Last hour
function getLastHour() {
  if (localStorage.getItem("lastHour") === null) {
    return 0;
  } else {
    return localStorage.getItem("lastHour");
  }
}

// Get Last Weather
function getLastWeather() {
    
  console.log("Get Last Weather");
  if (localStorage.getItem("lastWeather") === null) {
    return "lastWeather";
  } else {
    return localStorage.getItem("lastWeather");
  }
}

// Set Last Weather
function setLastWeather(lw) {
    
    console.log("Set Last Weather");
    localStorage.setItem("lastWeather", lw);
}

// Get Zip Code
function getZipCode() {
  if (localStorage.getItem("zip") === null) {
    return "80403";
  } else {
    return localStorage.getItem("zip");
  }
}

// Get Zip Code
function getAppId() {
  if (localStorage.getItem("appId") === null) {
    return null;
  } else {
    return localStorage.getItem("appId");
  }
}

// Set Last Hour
function setLastHour(tempHour) {
    //alert(tempHour);
    localStorage.setItem("lastHour", tempHour);
}

function getWeather(theZip){

    console.log("Get Weather");
    
    var apiString = "https://api.openweathermap.org/data/2.5/weather?zip=" + theZip + ",us&units=imperial&appid=" + appId;
    
    //console.log(apiString);
    
    if (!!appId){
        $.getJSON(apiString, weatherCallback);
    }
}

function weatherCallback(weatherData) {
    var cityName = weatherData.name;
    var cityTemp = weatherData.main.temp.toString();
    var cityDescription = weatherData.weather[0].description;
    var start = 0;
    var end = cityTemp.indexOf(".");
    var timestamp = weatherData.dt;
    var dt = new Date(timestamp * 1000);
    
    weather.title = dt.getHours() + ":" + addZero(dt.getMinutes());
    weather.innerHTML = cityName + ": " + cityTemp.substring(start, end) + "&deg;/ " + cityDescription;
    
    if (cityTemp.substring(start, end) + "|" + cityDescription != getLastWeather()){
    
    console.log("Create Weather Block");
    
    var lastTemp = cityTemp.substring(start, end);
    if (getLastWeather().includes("|")) {
        lastTemp = getLastWeather().substr(0,getLastWeather().indexOf("|"));
    }
    
    var weatherCells = document.getElementsByClassName("weathercell");
    for(var i = 0; i < weatherCells.length; i++)
    {
        weatherCells.item(i).parentNode.removeChild(weatherCells.item(i));
    }
    
    //Function Call
    theContainer.innerHTML += AddWeatherCell(cityName, cityTemp.substring(start, end), cityDescription, dt, lastTemp);
    
    setLastWeather(cityTemp.substring(start, end) + "|" + cityDescription);
    
    }
}

function getSpaceX(){

    console.log("Get SpaceX Launch");
    
    $.getJSON("https://api.spacexdata.com/v3/launches/next", spaceXCallback);
}

function spaceXCallback(spaceXData) {
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri",
  "Sat"];

    var flightNumber = spaceXData.flight_number.toString();
    var missionName = spaceXData.mission_name;
    var d = new Date(spaceXData.launch_date_local);

    spacex.innerHTML = "SpaceX: #" + flightNumber + " - " + missionName + " [" + dayNames[d.getDay()] + " " + monthNames[d.getMonth()] + " " + d.getDate() + " " + d.getHours() + ":" + addZero(d.getMinutes()) + "]";
    
    // Function call
    console.log("Create SpaceX Block");
    theContainer.innerHTML += AddSpaceCell(flightNumber,missionName,dayNames[d.getDay()] + " " + monthNames[d.getMonth()] + " " + d.getDate() + " " + d.getHours() + ":" + addZero(d.getMinutes()));
}

   function AddSingleCell(title)
   {
      var cell = "<div class=\"item\">" + title + " (<a href=\"#\" style=\"text-decoration: none;\" onclick=\"this.parentElement.style.display = 'none';\">X</a>)</div>";
      return cell;
   }

   function AddWeatherCell(location, temp, description, datetime, lastTemp)
   {
       var color = "white";
       color = (lastTemp > temp) ? "deepskyblue" : (temp > lastTemp) ? "red" : "white";
      var cell = "<div class=\"item weathercell\" title=\"" + datetime.getHours() + ":" + addZero(datetime.getMinutes()) + "\">" + location + ": <span style=\"color:" + color + "\">" + temp + "</span>&deg;/ " + description + " (<a href=\"#\" style=\"text-decoration: none;\" onclick=\"this.parentElement.style.display = 'none';\">X</a>)</div>";
      return cell;
   }

   function AddSpaceCell(mission, title, date)
   {
      var cell = "<div class=\"item\">SpaceX: " + mission + " - " + title + " [" + date + "] (<a href=\"#\" style=\"text-decoration: none;\" onclick=\"this.parentElement.style.display = 'none';\">X</a>)</div>";
      return cell;
   }

name.addEventListener("keypress", setName);
name.addEventListener("blur", setName);
focus.addEventListener("keypress", setFocus);
focus.addEventListener("blur", setFocus);

console.log("Batch Load Functions");

// Run
showTime();
setBgGreet();
getName();
getFocus();
getWeather(zip);
getSpaceX();