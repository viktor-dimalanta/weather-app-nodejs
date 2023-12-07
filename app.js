const express = require('express');
const request = require('request');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const port = 3000;

dotenv.config();

// Update the cors middleware based on your requirements
app.use(cors());

const mapboxApiKey = process.env.MAPBOX_API_KEY;
const openWeatherMapApiKey = process.env.OPENWEATHERMAP_API_KEY;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/weather', (req, res) => {
  const coordinates = req.query.coordinates.split(',').map(Number);
  const location = `(${coordinates.join(', ')})`;

  // Use the coordinates to get weather data from OpenWeatherMap
  const openWeatherMapUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates[1]}&lon=${coordinates[0]}&appid=${openWeatherMapApiKey}`;

  request({ url: openWeatherMapUrl, json: true }, (error, response, weatherData) => {
    if (error || response.statusCode !== 200) {
      return res.status(500).json({ error: 'Unable to fetch weather data' });
    }

    // Extract relevant weather information
    const temperature = weatherData.main.temp;
    const weatherDescription = weatherData.weather[0].description;

    res.render('weather', {
      location,
      coordinates,
      temperature,
      weatherDescription,
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
