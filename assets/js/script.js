// WEATHER APP - BOOTCAMP WK5 GROUP PROJECT
// VERSION 0.4 - Improved weather display
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
        const storedApiKey = localStorage.getItem('OpenWeatherApiKey');
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
        const weatherResultInner = document.getElementById("weatherResultInner");

        // Clear previous weather results
        weatherResultInner.innerHTML = '';

        // First, get the latitude and longitude for the city
        var geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityDef}&limit=1&appid=${API_KEY}`;

        fetch(geoUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (!data || data.length === 0) {
                    alert("City not found. Please try again.");
                    return;
                }

                var weatherByDate = {}; // Renamed for clarity, it holds daily weather arrays

                // Set the Latitude info
                var lat = data[0].lat;
                // Set the Longitude info
                var lon = data[0].lon;
                // Call getWeather API when the button is clicked
                var weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

                fetch(weatherUrl)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((data) => {
                        let dateData = data.list;
                        const currentCity = data.city.name;

                        // Populate weatherByDate object
                        for (var i = 0; i < dateData.length; i++) {
                            let currentRecord = dateData[i];

                            let date = new Date(currentRecord.dt * 1000);
                            let yy = String(date.getFullYear());
                            let mm = String(date.getMonth() + 1).padStart(2, '0');
                            let dd = String(date.getDate()).padStart(2, '0');
                            let hh = String(date.getHours()).padStart(2, '0');
                            let min = String(date.getMinutes()).padStart(2, '0');
                            let dateFormatted = `${yy}/${mm}/${dd}`;
                            let timeFormatted = `${hh}:${min}`;

                            let weatherInfo = {
                                time: timeFormatted,
                                weather: currentRecord.weather[0].main,
                                description: currentRecord.weather[0].description,
                                icon: currentRecord.weather[0].icon, // Add weather icon
                                temp: currentRecord.main.temp,
                                feels: currentRecord.main.feels_like,
                                windDeg: currentRecord.wind.deg,
                                windSpeed: currentRecord.wind.speed
                            };

                            if (!weatherByDate[dateFormatted]) {
                                weatherByDate[dateFormatted] = [];
                            }
                            weatherByDate[dateFormatted].push(weatherInfo); // Push into an array for each date
                        }

                        let carouselItemCount = 0;

                        for (let date in weatherByDate) {
                            // Create a new carousel item for each day
                            let carouselItemDiv = document.createElement("div");
                            carouselItemDiv.classList.add("carousel-item");
                            if (carouselItemCount === 0) {
                                carouselItemDiv.classList.add("active");
                            }

                            let innerHTML = `
                                <div class="weatherCity text-center">
                                    <h1>${currentCity}</h1>
                                    <h2 class="date-header">${date}</h2>
                                </div>
                                <div class="d-flex flex-wrap justify-content-center weather-hourly-container" id="hourly-forecast-${carouselItemCount}">
                                </div>
                            `;
                            carouselItemDiv.innerHTML = innerHTML;
                            weatherResultInner.appendChild(carouselItemDiv);

                            const hourlyContainer = document.getElementById(`hourly-forecast-${carouselItemCount}`);

                            // Sort the hourly data by time
                            weatherByDate[date].sort((a, b) => {
                                const [aHour, aMinute] = a.time.split(':').map(Number);
                                const [bHour, bMinute] = b.time.split(':').map(Number);
                                if (aHour !== bHour) return aHour - bHour;
                                return aMinute - bMinute;
                            });

                            weatherByDate[date].forEach(weatherData => {
                                // Each of the time stamps
                                let hourDiv = document.createElement("div");
                                hourDiv.classList.add("weather-hour-card", "m-2", "p-3", "border", "rounded", "shadow-sm");

                                let iconUrl = `https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`;

                                let hourInnerHTML = `
                                    <div class="text-center"><h3>${weatherData.time}</h3></div>
                                    <div class="text-center"><img src="${iconUrl}" alt="${weatherData.description}" class="weather-icon"></div>
                                    <div>Weather: ${weatherData.weather}<br />${weatherData.description}</div>
                                    <div>Temperature: ${weatherData.temp}°C</div>
                                    <div>Feels Like: ${weatherData.feels}°C</div>
                                    <div>Wind Direction: ${weatherData.windDeg}°</div>
                                    <div>Wind Speed: ${weatherData.windSpeed} m/s</div>
                                `;

                                hourDiv.innerHTML = hourInnerHTML;
                                hourlyContainer.appendChild(hourDiv);
                            });
                            carouselItemCount++;
                        }

                        // Initialize the carousel (assuming you have Bootstrap's JS loaded)
                        const weatherCarousel = new bootstrap.Carousel(document.getElementById('weatherResult'), {
                            interval: false,
                            wrap: true
                        });

                        // DEBUG
                        console.log("weatherByDate: ", weatherByDate);
                        console.log("data: ", data);
                    })
                    .catch((error) => {
                        console.error("Weather data fetch error:", error);
                        alert("Could not retrieve weather data for the specified city. Please check your API key or city name.");
                    });
            })
            .catch((error) => {
                console.error("Geolocation fetch error:", error);
                alert("Could not find the city. Please ensure the city name is correct.");
            });
    }

    document.getElementById("get-weather").addEventListener("click", onfetchWeather);
});
