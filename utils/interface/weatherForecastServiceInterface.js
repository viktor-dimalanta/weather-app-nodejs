// weatherForecastServiceInterface.js
class WeatherForecastServiceInterface {
    constructor(apiKey, apiUrl) {}
  
    get apiKey() {}
  
    set apiKey(newApiKey) {}
  
    get apiUrl() {}
  
    set apiUrl(newApiUrl) {}
  
    getForecastData(data, callback) {}
  }
  
  module.exports = WeatherForecastServiceInterface;  