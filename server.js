require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const GeocodeService = require('./utils/GeocodeService');
const WeatherForecastService = require('./utils/WeatherForecastService');
const config = require('./config/config');

class WeatherApp {
    constructor() {
        this.app = express();
        this.geocodeService = new GeocodeService(process.env.MAPBOX_API_URL, process.env.MAPBOX_API_KEY);
        this.weatherForecast = new WeatherForecastService(
            process.env.OPENWEATHERMAP_API_KEY,
            process.env.OPENWEATHER_URL
        );

        this.setupExpress();
        this.startServer();
    }

    setupExpress() {
        const publicDirPath = path.join(__dirname, 'public');
        const viewsPath = path.join(__dirname, 'templates/views');
        const partialsPath = path.join(__dirname, 'templates/partials');

        this.app.set('view engine', 'hbs');
        this.app.set('views', viewsPath);
        hbs.registerPartials(partialsPath);

        this.app.use(express.static(publicDirPath));

        this.app.get('', (req, res) => {
            res.render('index', {
                title: 'Weather App by Viktor',
            });
        });

        this.app.get('/weather', this.handleWeatherRequest.bind(this));
    }

    handleWeatherRequest(req, res) {
        if (!req.query.address) {
            return res.send({
                error: 'You must provide an address',
            });
        }

        this.geocodeService.geocode(req.query.address, (error, { data }) => {
            if (error) {
                return res.send({ error });
            }

            this.weatherForecast.getForecastData(data, (error, forecastData) => {
                if (error) {
                    return res.send({ error });
                }

                res.send({
                    title: 'Weather App by Viktor',
                    data: forecastData,
                });
            });
        });
    }

    startServer() {
        const port = process.env.PORT || config.server.port;
        this.app.listen(port, () => {
            console.log('Server running at port.. ' + port + ' : http://localhost:' + port);
        });
    }
}

// Instantiate the WeatherApp class
const weatherApp = new WeatherApp();