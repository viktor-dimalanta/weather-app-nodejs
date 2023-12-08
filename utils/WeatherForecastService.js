require('dotenv').config();
const request = require('request');

class WeatherForecastService {
  constructor(apiKey, apiUrl) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
  }

  getForecastData(data, callback) {
    const forecastDataList = [];
    let errorOccurred = false; // Flag to track whether an error has already occurred

    data.forEach((item, index) => {
        const url = `${this.apiUrl}?lat=${item.latitude}&lon=${item.longitude}&units=metric&appid=${this.apiKey}`;
        console.log(url)
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
  }
}

module.exports = WeatherForecastService;