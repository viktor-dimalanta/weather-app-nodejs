class WeatherApp {
    constructor() {
        this.weatherForm = document.querySelector('form');
        this.searchInput = document.getElementById('search-input');
        this.forecastData = document.getElementById('forecast-data');
        this.loader = document.getElementById('loader');
        this.error = document.getElementById('error');

        this.weatherForm.addEventListener('submit', this.handleFormSubmit.bind(this));
    }

    handleFormSubmit(event) {
        event.preventDefault();

        const location = this.searchInput.value;
        this.loader.textContent = 'Loading ...';
        this.error.textContent = '';
        this.forecastData.innerHTML = '';

        this.fetchWeatherData(location);
    }

    fetchWeatherData(location) {
        fetch('/weather?address=' + location)
            .then(response => response.json())
            .then(data => this.handleWeatherResponse(data))
            .catch(error => this.handleFetchError(error));
    }

    handleWeatherResponse(response) {
        if (response.error) {
            this.loader.textContent = '';
            this.error.innerHTML = `<div id="error" class="alert alert-danger" role="alert">` + response.error + `</div>`;
            this.forecastData.textContent = '';
        } else {
            this.loader.textContent = '';
            this.error.textContent = '';

            if (response.data.length !== 0) {
                this.forecastData.innerHTML = this.renderForeCastHTML(response.data);
            } else {
                this.forecastData.innerHTML = `<div class='empty-data'>No Data Found</div>`;
            }
        }
    }

    handleFetchError(error) {
        console.error('Fetch error:', error);
        this.loader.textContent = '';
        this.error.innerHTML = `<div id="error" class="alert alert-danger" role="alert">An error occurred while fetching data.</div>`;
        this.forecastData.textContent = '';
    }

    renderForeCastHTML(locations) {
        let innerHTML = '';
        locations.forEach(location => {
            innerHTML += this.generateLocationHTML(location);
        });
        return innerHTML;
    }

    generateLocationHTML(location) {
        return `<div class="list-group">
            <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1 location-name">` + location.location + ' <i class="summary">' + location.summary + `</i></h5>
                    <small><img class="weather-icon" src='` + this.getSrcImg(location) + `'></img></small>
                </div>
                <p class="mb-1">
                    It is currently <span class="badge badge-pill badge-dark">` + location.temperature + `°С</span> out.
                    There is ` + location.precipProbability + `% chance of rain
                </p>
                <small>Geo coords <span class="geo-coords">[` + location.latitude + ',' + location.longitude + `]</span></small>
            </a>
        </div>`;
    }

    getSrcImg(location) {
        const iconMappings = {
            '01d': './assets/images/clear-day.png',
            '01n': './assets/images/clear-night.png',
            '03d': './assets/images/partly-cloudy-day.png',
            '04d': './assets/images/partly-cloudy-night.png',
            '09d': './assets/images/cloudy.png',
            '10d': './assets/images/rain.png',
            '11d': './assets/images/sleet.png',
            '13n': './assets/images/snow.png',
            '50d': './assets/images/wind.png',
            '50n': './assets/images/fog.png',
        };

        return iconMappings[location.icon] || './assets/images/clear-day.png';
    }
}

// Instantiate the WeatherApp class
const weatherApp = new WeatherApp();