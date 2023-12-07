const { expect } = require('chai');
const nock = require('nock');
const forecast = require('../utils/forecast');

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

    forecast(data, (error, result) => {
      const forecastData = result[0];
      expect(forecastData).to.have.property('location', 'City1');
      expect(forecastData).to.have.property('latitude', 12.34);
      expect(forecastData).to.have.property('longitude', 56.78);
      expect(forecastData).to.have.property('summary', 'Clear');
      expect(forecastData).to.have.property('icon', '01d');
      expect(forecastData).to.have.property('temperature', 25);
      expect(forecastData).to.have.property('precipProbability', 0.2);

      done();
    });
  });

  it('should handle errors gracefully', (done) => {
    const data = [
      // Test data with invalid coordinates or other scenarios that trigger errors
    ];

    // Mocking an HTTP request that returns an error
    nock('https://api.openweathermap.org')
      .get('/data/2.5/onecall')
      .query(true)
      .replyWithError('Internal Server Error');

    forecast(data, (error, result) => {

      done();
    });
  });
});
