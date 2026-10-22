const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const weatherResult = document.getElementById("weatherResult");

searchButton.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city === "") {
        showMessage("Please enter a city.");
        cityInput.focus();
        return;
    }

    getWeather(city);
});

cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchButton.click();
    }
});

async function getWeather(city) {
    searchButton.disabled = true;
    searchButton.textContent = "Searching...";
    weatherResult.innerHTML = `
        <div class="message-card">
            <div class="empty-icon" aria-hidden="true">⏳</div>
            <h2>Loading weather...</h2>
            <p>Getting the latest available weather for ${escapeHTML(city)}.</p>
        </div>`;

    try {
        // Request 1: Convert the city name into latitude and longitude.
        const geoUrl =
            "https://geocoding-api.open-meteo.com/v1/search?name=" +
            encodeURIComponent(city) + "&count=1&language=en&format=json";

        const geoResponse = await fetch(geoUrl);
        if (!geoResponse.ok) {
            throw new Error("Geocoding request failed");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            showMessage("City not found. Please check the spelling and try again.");
            return;
        }

        const location = geoData.results[0];

        // Request 2: Use the coordinates to get the current weather.
        const weatherUrl =
            "https://api.open-meteo.com/v1/forecast" +
            "?latitude=" + location.latitude +
            "&longitude=" + location.longitude +
            "&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m" +
            "&timezone=auto";

        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
            throw new Error("Weather request failed");
        }

        const weatherData = await weatherResponse.json();

        if (!weatherData.current) {
            throw new Error("Current weather data is unavailable");
        }

        displayWeather(location, weatherData.current);
    } catch (error) {
        console.error("Weather App error:", error);
        showMessage("Unable to fetch weather data. Check your internet connection and try again.");
    } finally {
        searchButton.disabled = false;
        searchButton.textContent = "Search";
    }
}

function displayWeather(location, current) {
    const condition = getWeatherCondition(current.weather_code);
    const placeParts = [location.admin1, location.country].filter(Boolean);
    const placeDetails = placeParts.join(", ");
    const updatedAt = current.time
        ? "Local time: " + current.time.replace("T", " ")
        : "Current conditions";

    weatherResult.innerHTML = `
        <article class="weather-card">
            <div class="weather-top">
                <div>
                    <p class="location-label">Current weather</p>
                    <h2>${escapeHTML(location.name)}</h2>
                    <p class="conditions">${escapeHTML(placeDetails)}</p>
                    <p class="conditions">${condition.description}</p>
                </div>
                <div class="weather-symbol" aria-hidden="true">${condition.icon}</div>
            </div>
            <div class="temperature-row">
                <div class="temperature">${current.temperature_2m}°C</div>
                <div class="feels-like">
                    <strong>Feels like ${current.apparent_temperature}°C</strong><br>
                    Temperature at the location
                </div>
            </div>
            <div class="metrics">
                <div class="metric">
                    <div class="metric-icon" aria-hidden="true">💧</div>
                    <p class="metric-label">Humidity</p>
                    <p class="metric-value">${current.relative_humidity_2m}%</p>
                </div>
                <div class="metric">
                    <div class="metric-icon" aria-hidden="true">💨</div>
                    <p class="metric-label">Wind speed</p>
                    <p class="metric-value">${current.wind_speed_10m} km/h</p>
                </div>
                <div class="metric">
                    <div class="metric-icon" aria-hidden="true">🌡️</div>
                    <p class="metric-label">Weather code</p>
                    <p class="metric-value">${current.weather_code}</p>
                </div>
            </div>
            <p class="updated-time">${escapeHTML(updatedAt)} · Data by Open-Meteo</p>
        </article>`;
}

function getWeatherCondition(code) {
    if (code === 0) return { description: "Clear sky", icon: "☀️" };
    if ([1, 2].includes(code)) return { description: "Mainly clear / partly cloudy", icon: "🌤️" };
    if (code === 3) return { description: "Overcast", icon: "☁️" };
    if ([45, 48].includes(code)) return { description: "Foggy", icon: "🌫️" };
    if ([51, 53, 55, 56, 57].includes(code)) return { description: "Drizzle", icon: "🌦️" };
    if ([61, 63, 65, 66, 67].includes(code)) return { description: "Rain", icon: "🌧️" };
    if ([71, 73, 75, 77].includes(code)) return { description: "Snow", icon: "❄️" };
    if ([80, 81, 82].includes(code)) return { description: "Rain showers", icon: "🌧️" };
    if ([85, 86].includes(code)) return { description: "Snow showers", icon: "🌨️" };
    if ([95, 96, 99].includes(code)) return { description: "Thunderstorm", icon: "⛈️" };
    return { description: "Current conditions", icon: "🌡️" };
}

function showMessage(message) {
    weatherResult.innerHTML = `
        <div class="message-card error-card">
            <h2>Weather update</h2>
            <p>${escapeHTML(message)}</p>
        </div>`;
}

// Keep user-entered text safe when it is displayed in the page.
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[character]));
}
