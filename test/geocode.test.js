const { expect } = require('chai');
const nock = require('nock');
const geocode = require('../utils/GeocodeService');
const geocodes = new geocode('sampe', process.env.OPENWEATHER_URL);

describe('geocode', () => {
    it('should return geocode data for a location', (done) => {
        const address = 'City1';

        const data = [
            { location: 'City1', latitude: 12.34, longitude: 56.78 }
          ];
      
          geocodes.geocode(address, (error, result) => {
            const geocodeData = data[0];
            expect(geocodeData).to.have.property('location', 'City1');
            expect(geocodeData).to.have.property('latitude', 12.34);
            expect(geocodeData).to.have.property('longitude', 56.78);      
            done();
          });
    });
});
