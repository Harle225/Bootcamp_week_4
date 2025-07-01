// WEATHER APP - BOOTCAMP WK5 GROUP PROJECT
// VERSION 0.0 
/* Notes:
- I will contain the javascript files
*/
function onfetchWeather(){
    const API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1";
    // get the name of the city from the form on the main page
    var cityDef = document.getElementById("city").value;
    // First, get the latitude and longitude for the city
    var geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityDef}&limit=1&appid=${API_KEY}`;

    fetch(geoUrl)
    .then((response) => response.json())
    .then((data) => {
        // Set the Latitude info
        const lat = data[0].lat;
        // Set the Longitude info
        const lon = data[0].lon;
        // Call getWeather API when the button is clicked
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

        fetch(weatherUrl)
        .then((response) => response.json())
        .then((data) => {
            const cityName = data.name;
            const cityCountry = data.sys.country;
            const cityClouds = data.clouds.all;
            const citySunrise = data.sys.sunrise;
            const citySunset = data.sys.sunset;
            const cityWeather = data.weather.main;
            const cityWeatherDesc = data.weather.description;
            const cityWindDeg = data.wind.deg;
            const cityWindSpeed = data.wind.speed;
            // DEBUG
            console.log("data: ", data)
            //console.log("name: ", cityName);
            //console.log("county: ", cityCountry);
        })
        .catch((error) => console.error("Fetch error:", error));
    })
    .catch((error) => console.error("Fetch error:", error));
}

document.getElementById("getWeather").addEventListener("click", onfetchWeather);

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
