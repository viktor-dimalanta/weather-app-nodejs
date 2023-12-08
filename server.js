const path = require('path')
const express = require('express')
const hbs = require('hbs')
var config = require('./config/config')

const GeocodeService = require('./utils/GeocodeService');
const geocodeService = new GeocodeService(process.env.MAPBOX_API_URL, process.env.MAPBOX_API_KEY);

const WeatherForecastService = require('./utils/WeatherForecastService');
const weatherForecast = new WeatherForecastService(process.env.OPENWEATHERMAP_API_KEY, process.env.OPENWEATHER_URL);

const app = express()

/*** Define paths for Express config ***/
const publicDirPath = path.join(__dirname, 'public')
const viewsPath = path.join(__dirname, 'templates/views')
const partialsPath = path.join(__dirname, 'templates/partials')

/*** Setup handlebars engine ***/
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

/*** Setup static directory to serve ***/
app.use(express.static(publicDirPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "You must provide an address"
        })
    }
    geocodeService.geocode(req.query.address, (error, { data }) => {
        if (error) {
            return res.send({ error })
        }
        weatherForecast.getForecastData(data, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                title: 'Weather App',
                data: forecastData
            })
        })
    })
})

const port = process.env.PORT || config.server.port;
app.listen(port, () => {
    console.log('Server running at port ' + port + ' : http://localhost:' + port)
})