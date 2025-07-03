// WEATHER APP - BOOTCAMP WK5 GROUP PROJECT
// VERSION 0.2
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
    const getWeatherBtn = document.getElementById('get-weather');

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
                // Set the Latitude info
                var lat = data[0].lat;
                // Set the Longitude info
                var lon = data[0].lon;
                // Call getWeather API when the button is clicked
                var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

                fetch(weatherUrl)
                    .then((response) => response.json())
                    .then((data) => {
                        // Create variables from API response
                        var cityName = data.name;
                        var cityCountry = data.sys.country;
                        var cityClouds = data.clouds.all;
                        var cityTemp = data.main.temp;
                        var cityTempFeel = data.main.feels_like;
                        var citySunrise = data.sys.sunrise;
                        var citySunset = data.sys.sunset;
                        var cityWeather = data.weather[0].main;
                        var cityWeatherDesc = data.weather[0].description;
                        var cityWindDeg = data.wind.deg;
                        var cityWindSpeed = data.wind.speed;

                        // Change the divs on the front page
                        document.getElementById("weatherCity").innerHTML = `${cityName}, ${cityCountry}`;
                        document.getElementById("weatherName").innerHTML = cityWeather;
                        document.getElementById("weatherDesc").innerHTML = cityWeatherDesc;
                        document.getElementById("weatherTemp").innerHTML = cityTemp;
                        document.getElementById("weatherFeels").innerHTML = cityTempFeel;
                        document.getElementById("weatherWindDeg").innerHTML = cityWindDeg;
                        document.getElementById("weatherWindSpeed").innerHTML = cityWindSpeed;
                        document.getElementById("weatherClouds").innerHTML = cityClouds;
                        document.getElementById("weatherSunrise").innerHTML = citySunrise;
                        document.getElementById("weatherSunset").innerHTML = citySunset;
                        /*
                        RESPONSE STRUCTURE:
                        <div id="weatherCity"></div>
                        <div id="weatherName"></div>
                        <div id="weatherDesc"></div>
                        <div id="weatherTemp"></div>
                        <div id="weatherFeels"></div>
                        <div id="weatherWindDeg"></div>
                        <div id="weatherWindSpeed"></div>
                        <div id="weatherClouds"></div>
                        <div id="weatherSunrise"></div>
                        <div id="weatherSunset"></div>
                        */
                        // DEBUG
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

/* This is reference code

function sendFetchRequest() {
  fetch("https://jsonplaceholder.typicode.com/posts/1")
    .then((response) => response.json())
    .then((data) => console.log("Fetch API:", data))
    .catch((error) => console.error("Fetch error:", error));
}

function sendAxiosRequest() {
  axios
    .get("https://jsonplaceholder.typicode.com/posts/1")
    .then((response) => console.log("Axios:", response.data))
    .catch((error) => console.error("Axios error:", error));
}

function sendAjaXRequest() {
  $.ajax({
    url: "https://jsonplaceholder.typicode.com/posts/1",
    method: "GET",
    success: function (data) {
      console.log("jQuery.ajax:", data);
    },
    error: function (error) {
      console.error("jQuery error:", error);
    },
  });
}

function sendXHRRequest() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "https://jsonplaceholder.typicode.com/posts/1", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("XHR:", xhr.responseText);
    } else {
      console.error("XHR error:", xhr.status);
    }
  };
  xhr.send();
}

document.getElementById("fetch").addEventListener("click", sendFetchRequest);
document.getElementById("axios").addEventListener("click", sendAxiosRequest);
document.getElementById("ajax").addEventListener("click", sendAjaXRequest);
document.getElementById("xhr").addEventListener("click", sendXHRRequest);


document.getElementById("fetchRepos").addEventListener("click", onfetchRepos);

function onfetchRepos() {
  const username = document.getElementById("username").value;

  if (username) {
    // GitHub API endpoint for fetching user repositories
    const url = `https://api.github.com/users/${username}/repos`;

    // Make a GET request to the GitHub API
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("GitHub user not found");
        }
        return response.json();
      })
      .then((data) => {
        renderRepos(data);
        renderRepos2(data);
        renderRepos3(data);
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  } else {
    console.log("Please enter a GitHub username.");
  }
}

const renderRepos = (repos) => {
  const reposListEl = document.getElementById("repos");
  let html = "";

  //TODO what does this line do?
  repos.forEach((repo) => {
    const repoFullName = repo.full_name;

    html += `<li>${repoFullName}</li>`;
  });

  reposListEl.innerHTML = html;
};

const renderRepos2 = (repos) => {
  const reposListEl = document.getElementById("repos2");

  //TODO what does this line do?
  for (let i = 0; i < repos.length; i++) {
    const repoFullName = repos[i].full_name;

    const repoEl = document.createElement("li");
    repoEl.textContent = repoFullName;
    reposListEl.appendChild(repoEl);
  }
};

const renderRepos3 = (repos) => {
  const reposListEl = document.getElementById("repos3");

  // TODO: what does this line do?
  repos.map((repo) => (reposListEl.innerHTML += `<li>${repo.full_name}</li>`));
};

*/
