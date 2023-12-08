const WeatherForecastService = require('./WeatherForecastService');
const weatherForecast = new WeatherForecastService(process.env.OPENWEATHERMAP_API_KEY, process.env.OPENWEATHER_URL);

const sampleData = [];

weatherForecast.getForecastData(sampleData, (error, result) => {
  if (error) {
    console.error(error);
  } else {
    console.log(result);
  }
});