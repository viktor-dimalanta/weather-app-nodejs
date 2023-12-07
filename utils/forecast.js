require('dotenv').config();
const request = require('request');

const forecast = (data, callback) => {
    const forecastDataList = [];

    data.forEach(function (item) {
        const apiKey = process.env.OPENWEATHERMAP_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${item.latitude}&lon=${item.longitude}&units=metric&appid=${apiKey}`;

        request({ url, json: true }, (error, { body }) => {
            if (error) {
                callback('Unable to connect to weather service!');
            } else if (body.cod && body.message) {
                callback(`Unable to find location. ${body.message}. Try another search!`);
            } else {
                const forecastData = {
                    location: item.location,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    summary: body.current.weather[0].description,
                    icon: body.current.weather[0].icon,
                    temperature: body.current.temp,
                    precipProbability: body.current.humidity,
                };

                forecastDataList.push(forecastData);
            }
        });
    });

    // Adjust the timeout as needed
    setTimeout(function () {
        callback(undefined, forecastDataList);
    }, 1500);
};

module.exports = forecast;
