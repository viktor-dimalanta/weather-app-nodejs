const { expect } = require('chai');
const nock = require('nock');
const geocode = require('../utils/geocode');

describe('geocode', () => {
    it('should return geocode data for a location', (done) => {
        const address = 'City1';

        geocode(address, (error, result) => {

            const geocodeData = result.data[0];
            expect(geocodeData).to.have.property('latitude', 49.248545);
            expect(geocodeData).to.have.property('longitude', -123.12556);
            expect(geocodeData).to.have.property('location', 'City1Cafe, 954 West King Edward Ave., Vancouver, British Columbia V5Z 2E2, Canada');

            done();
        });
    });
});
