document.addEventListener("DOMContentLoaded", () => {
    const apiKeyInput = document.getElementById("api-key");
    const saveApiKeyBtn = document.getElementById("save-api-key-btn");

    // Load API Key from local storage
    if (apiKeyInput.value.trim() === "") {
        apiKeyInput.value = localStorage.getItem("OpenWeatherApiKey") || "";
    }

    saveApiKeyBtn?.addEventListener("click", () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            localStorage.setItem("OpenWeatherApiKey", key);
            alert("API Key saved successfully!");
            bootstrap.Modal.getInstance(document.getElementById("apiKeyModal"))?.hide();
        } else {
            alert("Please enter an API key.");
        }
    });

    let API_KEY = apiKeyInput.value.trim() || "YOUR_API_KEY_HERE";

    apiKeyInput.addEventListener("input", () => {
        localStorage.setItem("OpenWeatherApiKey", apiKeyInput.value.trim());
        API_KEY = apiKeyInput.value.trim() || "YOUR_API_KEY_HERE";
    });

    function onfetchWeather() {
        const cityDef = document.getElementById("city").value;
        const weatherResultInner = document.getElementById("weatherResultInner");
        const weatherResultDiv = document.getElementById("weatherResult");

        if (!cityDef) {
            alert("Please enter a city name.");
            return;
        }

        if (weatherResultInner) weatherResultInner.innerHTML = '';
        if (weatherResultDiv) weatherResultDiv.innerHTML = '';

        fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityDef}&limit=1&appid=${API_KEY}`)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                if (!data.length) throw new Error("City not found.");

                const lat = data[0].lat;
                const lon = data[0].lon;
                return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
            })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                const currentCity = data.city.name;
                let html = `<h3 class="text-center mb-4">${currentCity}</h3><div class="row justify-content-center">`;

                data.list.slice(0, 6).forEach(item => {
                    html += `
                        <div class="col-md-4 mb-3">
                            <div class="p-3 border rounded text-center">
                                <h5>${new Date(item.dt * 1000).toLocaleString()}</h5>
                                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
                                <div>${item.weather[0].main}, ${item.weather[0].description}</div>
                                <div>Temp: ${item.main.temp}°C</div>
                                <div>Feels like: ${item.main.feels_like}°C</div>
                            </div>
                        </div>`;
                });

                html += "</div>";
                if (weatherResultDiv) weatherResultDiv.innerHTML = html;
            })
            .catch(error => {
                console.error("Error:", error);
                if (weatherResultDiv) weatherResultDiv.innerHTML = `<div class="text-danger text-center">${error.message || error}</div>`;
            });
    }

    document.getElementById("get-weather")?.addEventListener("click", onfetchWeather);
});
