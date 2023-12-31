require('dotenv').config();
const request = require('request');
const WeatherForecastServiceInterface = require('./interface/weatherForecastServiceInterface');

class WeatherForecastService extends WeatherForecastServiceInterface {
  constructor(apiKey, apiUrl) {
    super(apiKey, apiUrl);
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
  }

  get apiKey() {
    return this._apiKey;
  }

  set apiKey(newApiKey) {
    this._apiKey = newApiKey;
  }

  get apiUrl() {
    return this._apiUrl;
  }

  set apiUrl(newApiUrl) {
    this._apiUrl = newApiUrl;
  }

  getForecastData(data, callback) {
    try {
      const forecastDataList = [];
      let errorOccurred = false; // Flag to track whether an error has already occurred

      data.forEach((item, index) => {
        const url = `${this.apiUrl}?lat=${item.latitude}&lon=${item.longitude}&units=metric&appid=${this.apiKey}`;
        request({ url, json: true }, (error, response) => {
          if (!errorOccurred) {
            if (error) {
              callback('Unable to connect to weather service!');
            } else if (response.body.cod && response.body.message) {
              callback(`Unable to find location. ${response.body.message}. Try another search!`);
            } else if (!response.body || !response.body.current) {
              console.error('Invalid response from weather service:', response.body);
              callback('Invalid response from weather service!');
            } else {
              const forecastData = {
                location: item.location,
                latitude: item.latitude,
                longitude: item.longitude,
                summary: response.body.current.weather[0].description,
                icon: response.body.current.weather[0].icon,
                temperature: response.body.current.temp,
                precipProbability: response.body.current.humidity,
              };

              forecastDataList.push(forecastData);

              // Check if this is the last iteration before calling the callback
              if (index === data.length - 1) {
                callback(undefined, forecastDataList);
              }
            }
          }
        });
      });
    } catch (exception) {
      console.error('Exception while fetching weather data:', exception);
      callback('An unexpected error occurred while fetching weather data.');
    }
  }
}

module.exports = WeatherForecastService;