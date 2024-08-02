document.addEventListener('DOMContentLoaded', () => {
    const cityDropdown = document.getElementById('city-dropdown');
    const getForecastButton = document.getElementById('get-forecast');
    const weatherContainer = document.getElementById('weather-container');

    const cities = [
        {coords: "52.367,4.904", name: "Amsterdam, Netherlands"},
        {coords: "39.933,32.859", name: "Ankara, Turkey"},
        {coords: "56.134,12.945", name: "Åstorp, Sweden"},
        {coords: "37.983,23.727", name: "Athens, Greece"},
        {coords: "54.597,-5.930", name: "Belfast, Northern Ireland"},
        {coords: "41.387,2.168", name: "Barcelona, Spain"},
        {coords: "52.520,13.405", name: "Berlin, Germany"},
        {coords: "46.948,7.447", name: "Bern, Switzerland"},
        {coords: "43.263,-2.935", name: "Bilbao, Spain"},
        {coords: "50.847,4.357", name: "Brussels, Belgium"},
        {coords: "47.497,19.040", name: "Bucharest, Romania"},
        {coords: "59.329,18.068", name: "Budapest, Hungary"},
        {coords: "51.483,-3.168", name: "Cardiff, Wales"},
        {coords: "50.937,6.96", name: "Cologne, Germany"},
        {coords: "55.676,12.568", name: "Copenhagen, Denmark"},
        {coords: "51.898,-8.475", name: "Cork, Ireland"},
        {coords: "53.349,-6.260", name: "Dublin, Ireland"},
        {coords: "55.953,-3.188", name: "Edinburgh, Scotland"},
        {coords: "43.7696,11.255", name: "Florence, Italy"},
        {coords: "50.110,8.682", name: "Frankfurt, Germany"},
        {coords: "43.254,6.637", name: "French Riviera, France"},
        {coords: "32.650,-16.908", name: "Funchal, Portugal"},
        {coords: "36.140,-5.353", name: "Gibraltar"},
        {coords: "57.708,11.974", name: "Gothenburg, Sweden"},
        {coords: "53.548,9.987", name: "Hamburg, Germany"},
        {coords: "60.169,24.938", name: "Helsinki, Finland"},
        {coords: "39.020,1.482", name: "Ibiza, Spain"},
        {coords: "50.450,30.523", name: "Kyiv, Ukraine"},
        {coords: "53.1000,-2.0000", name: "Leek, Staffordshire, UK"},
        {coords: "61.115,10.466", name: "Lillehammer, Norway"},
        {coords: "38.722,-9.139", name: "Lisbon, Portugal"},
        {coords: "51.507,-0.127", name: "London, England"},
        {coords: "40.416,-3.703", name: "Madrid, Spain"},
        {coords: "39.695,3.017", name: "Mallorca, Spain"},
        {coords: "53.480,-2.242", name: "Manchester, England"},
        {coords: "43.296,5.369", name: "Marseille, France"},
        {coords: "27.760,-15.586", name: "Maspalomas, Spain"},
        {coords: "45.464,9.190", name: "Milan, Italy"},
        {coords: "48.135,11.582", name: "Munich, Germany"},
        {coords: "40.851,14.268", name: "Naples, Italy"},
        {coords: "43.034,-2.417", name: "Oñati, Spain"},
        {coords: "59.913,10.752", name: "Oslo, Norway"},
        {coords: "48.856,2.352", name: "Paris, France"},
        {coords: "50.075,14.437", name: "Prague, Czech Republic"},
        {coords: "64.146,-21.942", name: "Reykjavík, Iceland"},
        {coords: "56.879,24.603", name: "Riga, Latvia"},
        {coords: "41.902,12.496", name: "Rome, Italy"},
        {coords: "39.453,-31.127", name: "Santa Cruz das Flores, Portugal"},
        {coords: "28.463,-16.251", name: "Santa Cruz de Tenerife, Spain"},
        {coords: "57.273,-6.215", name: "Skye, Scotland"},
        {coords: "42.697,23.321", name: "Sofia, Bulgaria"},
        {coords: "59.329,18.068", name: "Stockholm, Sweden"},
        {coords: "59.437,24.753", name: "Tallinn, Estonia"},
        {coords: "18.208,16.373", name: "Vienna, Austria"},
        {coords: "52.229,21.012", name: "Warsaw, Poland"},
        {coords: "53.961,-1.07", name: "York, England"},
        {coords: "47.376,8.541", name: "Zurich, Switzerland"}
       
    ];

    // Populate the dropdown
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.coords;
        option.textContent = city.name;
        cityDropdown.appendChild(option);
    });

    getForecastButton.addEventListener('click', () => {
        const selectedCoordinates = cityDropdown.value;
        if (selectedCoordinates) {
            const [lat, lon] = selectedCoordinates.split(',');
            fetchWeatherForecast(lat, lon);
        } else {
            alert('Please select a city');
        }
    });

    async function fetchWeatherForecast(lat, lon) {
        const apiUrl = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civillight&output=json`;
        
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            displayWeatherForecast(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            alert('Failed to fetch weather data. Please try again later.');
        }
    }

    function displayWeatherForecast(data) {
        weatherContainer.innerHTML = '';
        
        data.dataseries.slice(0, 7).forEach(day => {
            const dateStr = day.date.toString();
            const year = dateStr.slice(0, 4);
            const month = dateStr.slice(4, 6) - 1; // Month is zero-indexed
            const dayNum = dateStr.slice(6, 8);
            const date = new Date(year, month, dayNum);
            const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

            const weatherIconClass = getWeatherIcon(day.weather);
            
            const weatherCard = document.createElement('div');
            weatherCard.className = 'weather-card';
            weatherCard.innerHTML = `
                <h3>${formattedDate}</h3>
                <i class="${weatherIconClass}"></i>
                <p>Max: ${day.temp2m.max}°C</p>
                <p>Min: ${day.temp2m.min}°C</p>
            `;
            
            weatherContainer.appendChild(weatherCard);
        });
    }

    function getWeatherIcon(weather) {
        const weatherIcons = {
            'clear': 'wi wi-day-sunny',
            'pcloudy': 'wi wi-day-cloudy',
            'mcloudy': 'wi wi-cloudy',
            'cloudy': 'wi wi-cloudy',
            'humid': 'wi wi-humidity',
            'lightrain': 'wi wi-showers',
            'oshower': 'wi wi-showers',
            'ishower': 'wi wi-showers',
            'lightsnow': 'wi wi-snow',
            'ra': 'wi wi-rain',
            'snow': 'wi wi-snow',
            'rainsnow': 'wi wi-rain-mix',
            'ts': 'wi wi-thunderstorm',
            'tsrain': 'wi wi-thunderstorm'
        };
        return weatherIcons[weather] || 'wi wi-na'; // Default icon for unknown weather
    }
});