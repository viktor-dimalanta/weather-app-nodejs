const request = require('request');
const GeocodeServiceInterface = require('./interface/geocodeServiceInterface');

class GeocodeService extends GeocodeServiceInterface {
  constructor(apiUrl, apiKey) {
    super(apiUrl, apiKey);
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  get apiUrl() {
    return this._apiUrl;
  }

  set apiUrl(newApiUrl) {
    this._apiUrl = newApiUrl;
  }

  get apiKey() {
    return this._apiKey;
  }

  set apiKey(newApiKey) {
    this._apiKey = newApiKey;
  }

  geocode(address, callback) {
    try {
      const url = `${this.apiUrl}${encodeURIComponent(address)}.json?access_token=${this.apiKey}`;

      request({ url, json: true }, (error, response) => {
        if (error) {
          callback('Unable to connect to geocode service !');
        } else if (!response || !response.body) {
          callback('Invalid response from the geocode service !');
        } else if (response.body.error) {
          callback('Unable to find location. Try another search !');
        } else {
          const data = response.body.features.map(feature => ({
            latitude: feature.center[1],
            longitude: feature.center[0],
            location: feature.place_name
          }));
          callback(undefined, { data });
        }
      });

    } catch (exception) {
      console.error('Exception while fetching weather data:', exception);
      callback('An unexpected error occurred while fetching weather data.');
    }
  }
}

module.exports = GeocodeService;