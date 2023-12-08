const GeocodeService = require('./GeocodeService');
const geocodeService = new GeocodeService(process.env.MAPBOX_API_URL, process.env.MAPBOX_API_KEY);

geocodeService.geocode('address', (error, result) => {
  if (error) {
    console.error(error);
  } else {
    console.log(result.data);
  }
});