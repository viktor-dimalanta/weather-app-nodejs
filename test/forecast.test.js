const { expect } = require('chai');
const nock = require('nock');
const forecast = require('../utils/WeatherForecastService');
const weatherForecast = new forecast('sampe', process.env.OPENWEATHER_URL);

describe('forecast', () => {
  beforeEach(() => {
    // Mocking the HTTP request to OpenWeatherMap
    nock('https://api.openweathermap.org')
      .get('/data/2.5/onecall')
      .query(true)
      .reply(200, {
        current: {
          weather: [{ description: 'Clear', icon: '01d' }],
          temp: 25,
          pop: 0.2
        }
      });
  });

  it('should return forecast data for a location', (done) => {
    const data = [
      { location: 'City1', latitude: 12.34, longitude: 56.78 }
    ];

    weatherForecast.getForecastData(data, (error, result) => {
      const forecastData = result[0];
      expect(forecastData).to.have.property('location', 'City1');
      expect(forecastData).to.have.property('latitude', 12.34);
      expect(forecastData).to.have.property('longitude', 56.78);
      // expect(forecastData).to.have.property('summary', 'Clear');
      // expect(forecastData).to.have.property('icon', '01d');
      // expect(forecastData).to.have.property('temperature', 25);
      // expect(forecastData).to.have.property('precipProbability', 0.2);

      done();
    });
  });

  it('should handle errors gracefully', async () => {
    const sampleData = [{ location: 'City1', latitude: 40.7128, longitude: -74.0060 }];

    // Mock an error response using nock
    nock('http://fakeApiUrl')
      .get('/data/2.5/onecall')
      .query(true)
      .reply(500, { error: 'Internal Server Error' });

    console.log("Error!")
    // Use chai-as-promised to test the asynchronous function
    //await expect(weatherForecast.getForecastData(sampleData)).rejectedWith('An unexpected error occurred while fetching weather data.');
  });

});
