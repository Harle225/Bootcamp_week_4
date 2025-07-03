// WEATHER APP - BOOTCAMP WK5 GROUP PROJECT
// VERSION 0.3
/* Notes:
- I will contain the JavaScript files
*/
document.addEventListener("DOMContentLoaded", () => {
    const apiKeyInput = document.getElementById("api-key");
    // Fetch API Key from local storage if empty
    if (apiKeyInput.value.trim() === "") {
        apiKeyInput.value = localStorage.getItem("OpenWeatherApiKey") || "";
    }
    const saveApiKeyBtn = document.getElementById('save-api-key-btn');

    // Function to load API key from local storage
    function loadApiKey() {
        const storedApiKey = localStorage.getItem('openWeatherApiKey');
        if (storedApiKey) {
            apiKeyInput.value = storedApiKey; // Also populate the modal input
        }
    }

    // Function to save API key to local storage
    function saveApiKey() {
        const apiKey = apiKeyInput.value.trim(); // Get from the modal input
        if (apiKey) {
            localStorage.setItem('OpenWeatherApiKey', apiKey);
            alert('API Key saved successfully!');
            const apiKeyModal = bootstrap.Modal.getInstance(document.getElementById('apiKeyModal'));
            if (apiKeyModal) {
                apiKeyModal.hide(); // Close the modal
            }
        } else {
            alert('Please enter an API key.');
        }
    }

    // Event listener for the "Save Key" button in the modal
    if (saveApiKeyBtn) {
        saveApiKeyBtn.addEventListener('click', saveApiKey);
    }

    // Load API key when the page loads
    loadApiKey();

    let API_KEY = apiKeyInput.value.trim() || "YOUR_API_KEY_HERE";

    apiKeyInput.addEventListener("input", () => {
        localStorage.setItem("OpenWeatherApiKey", apiKeyInput.value.trim());
        API_KEY = apiKeyInput.value.trim() || "YOUR_API_KEY_HERE";
    });

    function onfetchWeather() {
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
                        for (var i = 0; i < dateData.length; i++) {
                            let currentRecord = dateData[i];

                            let currentDate = currentRecord.dt;
                            let date = new Date(currentDate * 1000);
                            let yy = String(date.getFullYear()).padStart(2, '0');
                            let mm = String(date.getMonth() + 1).padStart(2, '0');
                            let dd = String(date.getDate()).padStart(2, '0');
                            let hh = String(date.getHours()).padStart(2, '0');
                            let min = String(date.getMinutes()).padStart(2, '0');
                            let dateFormatted = `${yy}/${mm}/${dd}`;
                            let timeFormatted = `${hh}:${min}`;


                            let currentWeather = currentRecord.weather[0].main;
                            let currentWeatherDesc = currentRecord.weather[0].description;
                            let currentTemp = currentRecord.main.temp;
                            let currentFeel = currentRecord.main.feels_like;
                            var currentWindDeg = currentRecord.wind.deg;
                            var currentWindSpeed = currentRecord.wind.speed;

                            let weatherInfo = {
                                time: timeFormatted,
                                weather: currentWeather,
                                description: currentWeatherDesc,
                                temp: currentTemp,
                                feels: currentFeel,
                                wind: currentWindDeg,
                                windSp: currentWindSpeed
                            }

                            if (!weatherArray[dateFormatted]) {
                                weatherArray[dateFormatted] = []
                            }
                            weatherArray[dateFormatted][timeFormatted] = weatherInfo;
                        }

                        let count = 1; // Set a count so that we know which one is the first element

                        for (let date in weatherArray) { // Cycle through the weather array

                            // This will create a carousel item for each day

                            // Create the element
                            let newEl = document.createElement("div");

                            if (count == 1) { // if this is the first carousel item then make sure it is active
                                newEl.className = "carousel-item active";
                            } else { // otherwise just set the standard carousel item
                                newEl.className = "carousel-item";
                            }

                            // create the inner HTML for the carousel, this puts the location at the top of each carousel items
                            let innerHTML = `
                                <div class="weatherCity text-center"><h1>${currentCity}</h1></div>
                                <div id="${currentCity}-${count}" class="d-flex no-wrap">
                                </div>
                            `;

                            //assign an individual ID for the element - we will be using this to populate each carousel item
                            //newEl.setAttribute("id", `${currentCity}-${count}` );

                            // Assign innerHTML to the new element
                            newEl.innerHTML = innerHTML;

                            // Select the weatherResultInner Div and append the carousel div to the box
                            var weatherResultInner = document.getElementById("weatherResultInner");
                            weatherResultInner.appendChild(newEl);

                            // Set a new variable for the time data array which contains each of the hourly data reports
                            let timesObj = weatherArray[date];

                            for (let time in timesObj) {
                                // Each of the time stamps

                                let weatherData = timesObj[time];

                                // Create a new internal element
                                let newEl = document.createElement("div");
                                // make the hours a flex box
                                newEl.className = "m-2";

                                // create the inner HTML for the carousel, this puts the location at the top of each carousel items
                                let innerHTML = `
                                    <div id="time" class="text-center"><h3>${weatherData.time}</h3></div>
                                    <div id="weather">Weather: ${weatherData.weather}<br />${weatherData.description}</div>
                                    <div id="weatherTemp">Temperature: ${weatherData.temp}</div>
                                    <div id="weatherFeels">Feels Like: ${weatherData.feels}</div>
                                    <div id="weatherWindDeg">Direction: ${weatherData.wind}</div>
                                    <div id="weatherWindSpeed">Speed: ${weatherData.windsp}</div>
                                `;

                                // Assign innerHTML to the new element
                                newEl.innerHTML = innerHTML;

                                // Select the weatherResultInner Div and append the carousel div to the box
                                var weatherResultInner = document.getElementById(`${currentCity}-${count}`);
                                weatherResultInner.appendChild(newEl);
                            }
                            count++;
                        }

                        for (var i = 0; i < weatherArray.length; i++) {
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

    document.getElementById("get-weather").addEventListener("click", onfetchWeather);
});
