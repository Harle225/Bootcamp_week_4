// WEATHER APP - BOOTCAMP WK5 GROUP PROJECT
// VERSION 0.1
/* Notes:
- I will contain the javascript files
*/
document.addEventListener("DOMContentLoaded", () => {
  const apiKeyInput = document.getElementById("api-key");
  // Fetch API Key from local storage if empty
  if (apiKeyInput.value.trim() === "") {
    apiKeyInput.value = localStorage.getItem("OpenWeatherApiKey") || "";
  }

  let API_KEY = apiKeyInput.value.trim() || "YOUR_API_KEY_HERE";

  apiKeyInput.addEventListener("input", () => {
    localStorage.setItem("OpenWeatherApiKey", apiKeyInput.value.trim());
    API_KEY = apiKeyInput.value.trim() || "YOUR_API_KEY_HERE";
  });

  function onfetchWeather(){
      // get the name of the city from the form on the main page
      var cityDef = document.getElementById("city").value;
      // First, get the latitude and longitude for the city
      var geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityDef}&limit=1&appid=${API_KEY}`;

      fetch(geoUrl)
      .then((response) => response.json())
      .then((data) => {

          var weatherArray = [];

          // Set the Latitude info
          var lat = data[0].lat;
          // Set the Longitude info
          var lon = data[0].lon;
          // Call getWeather API when the button is clicked
          var weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

          fetch(weatherUrl)
          .then((response) => response.json())
          .then((data) => {

            let dateData = data.list;
            const currentCity = data.city.name;
            for (var i = 0; i < dateData.length; i++){

              let currentRecord = dateData[i];
              let currentWeather = currentRecord.weather[0].main;
              let currentWeatherDesc = currentRecord.weather[0].description;
              let currentTemp = currentRecord.main.temp;
              let currentFeel = currentRecord.main.feels_like;
              var currentWindDeg = currentRecord.wind.deg;
              var currentWindSpeed = currentRecord.wind.speed;

              let weatherInfo = {
                weather : currentWeather,
                description : currentWeatherDesc,
                temp : currentTemp,
                feels : currentFeel,
                wind : currentWindDeg,
                windSp : currentWindSpeed
              }

              let currentDate = currentRecord.dt;
              let date = new Date(currentDate * 1000);
              let yy = String(date.getFullYear()).padStart(2, '0');
              let mm = String(date.getMonth() +1).padStart(2, '0');
              let dd = String(date.getDate()).padStart(2, '0');
              let hh = String(date.getHours()).padStart(2, '0');
              let min = String(date.getMinutes()).padStart(2, '0');
              let dateFormatted = `${yy}/${mm}/${dd}`;
              let timeFormatted = `${hh}:${min}`;


              if (!weatherArray[dateFormatted]){
                weatherArray[dateFormatted] = []
              }
              weatherArray[dateFormatted][timeFormatted] = weatherInfo;
            }
            
            let count = 1;
            for (let date in weatherArray) {
              let innerHTML = `
                <div class="weatherCity">${currentCity}</div>
              `;
              // Create the element
              let newEl = document.createElement("div");
              if(count == 1){ 
                newEl.className = "carousel-item active";
              }else{
                newEl.className = "carousel-item";
              }
              
              // Assign innerHTML correctly
              newEl.innerHTML = innerHTML;
              // Append to your container
              var weatherResultInner = document.getElementById("weatherResultInner");
              weatherResultInner.appendChild(newEl);

              let timesObj = weatherArray[date];

              for (let time in timesObj) {
                  // Each of the time stamps
                
                let weatherData = timesObj[time];

                  let innerHTML = `
                    <div class="d-flex">
                    
                      <div id="time">${weatherData}</div>
                      <div id="weatherDesc"></div>
                      <div id="weatherTemp"></div>
                      <div id="weatherFeels"></div>
                      <div id="weatherWindDeg"></div>
                      <div id="weatherWindSpeed"></div>
                      <div id="weatherClouds"></div>
                      <div id="weatherSunrise"></div>
                      <div id="weatherSunset"></div>
                    
                    </div>
                  `;
               
              }
              count++;
            }

            for (var i = 0; i < weatherArray.length; i++){
              // Ensure innerHTML is declared
              let innerHTML = `
                  <div class="weatherCity">${weatherArray.city}</div>
              `;
              
              // Create the element
              let newEl = document.createElement("div");
              newEl.className = "carousel-item";

              // Assign innerHTML correctly
              newEl.innerHTML = innerHTML;

              // Append to your container
              var weatherResultInner = document.getElementById("weatherResultInner");
              weatherResultInner.appendChild(newEl);
            }
              // DEBUG
              console.log("array: ", weatherArray)
              console.log("data: ", data)
              //console.log("name: ", cityName);
              //console.log("county: ", cityCountry);
          })
          .catch((error) => console.error("Fetch error:", error));
      })
      .catch((error) => console.error("Fetch error:", error));
  }

  document.getElementById("getWeather").addEventListener("click", onfetchWeather());

});