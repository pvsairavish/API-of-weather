function getWeatherImage(description) {
    description = description.toLowerCase();
    if (description.includes("clear")) {
        return "https://cdn-icons-png.flaticon.com/512/869/869869.png"; 
    } else if (description.includes("cloud")) {
        return "https://cdn-icons-png.flaticon.com/512/414/414825.png"; 
    } else if (description.includes("rain")) {
        return "https://cdn-icons-png.flaticon.com/512/1146/1146858.png"; 
    } else if (description.includes("snow")) {
        return "https://cdn-icons-png.flaticon.com/512/642/642102.png"; 
    } else if (description.includes("thunderstorm")) {
        return "https://cdn-icons-png.flaticon.com/512/1146/1146869.png"; 
    } else {
        return "https://cdn-icons-png.flaticon.com/512/414/414825.png";
    }
}

function checkWeather() {
    const city = document.getElementById('city').value;
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=68a12eada30541bea93152217242909&q=${encodeURIComponent(city)}&aqi=no`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            let currentTemperature = data.current.temp_c;
            let currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            let weatherDescription = data.current.condition.text;
            let iconUrl = getWeatherImage(weatherDescription);

            let currentHTML = `
                <div class="current-weather-box">
                    <h2>Current Temperature in ${city} (${currentDay})</h2>
                    <p>Temp: ${currentTemperature}°C</p>
                    <p>Description: ${weatherDescription}</p>
                    <img src="${iconUrl}" alt="Weather Icon">
                </div>
            `;
            document.getElementById('currentWeather').innerHTML = currentHTML;
            document.getElementById('nextFiveDaysButtonContainer').style.display = 'block';
        })
        .catch(error => {
            document.getElementById('weatherResult').innerHTML = `<p>${error.message}</p>`;
        });
}

function checkWeatherForNextFiveDays() {
    const city = document.getElementById('city').value;
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=68a12eada30541bea93152217242909&q=${encodeURIComponent(city)}&days=5&aqi=no&alerts=no`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            let resultHTML = '';
            let forecastDays = data.forecast.forecastday;

            forecastDays.forEach(day => {
                let avgTemp = day.day.avgtemp_c;
                let weatherDescription = day.day.condition.text;
                let avgHumidity = day.day.avghumidity;
                let avgWindSpeed = day.day.maxwind_kph;
                let iconUrl = getWeatherImage(weatherDescription);
                let dateForecast = new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' });

                resultHTML += `
                    <div class="weather-box">
                        <h2>${dateForecast}</h2>
                        <img src="${iconUrl}" alt="Weather Icon">
                        <p>Avg Temp: ${avgTemp.toFixed(1)}°C</p>
                        <p>Avg Humidity: ${avgHumidity.toFixed(1)}%</p>
                        <p>Avg Wind Speed: ${(avgWindSpeed / 3.6).toFixed(1)} m/s</p>
                    </div>
                `;
            });

            document.getElementById('nextFiveDaysWeatherResult').innerHTML = resultHTML;
        })
        .catch(error => {
            document.getElementById('nextFiveDaysWeatherResult').innerHTML = `<p>${error.message}</p>`;
        });
}
