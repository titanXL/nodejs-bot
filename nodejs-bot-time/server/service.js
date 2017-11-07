const express = require('express');
const service = express();
const request = require('superagent');
const moment = require('moment');

const config = require('../config');
// geo: AIzaSyBWshmtCC3RlQpPFiN0ydOd3RwW9Z-O3yM
// https://maps.googleapis.com/maps/api/geocode/json?address=sofia&key=AIzaSyBWshmtCC3RlQpPFiN0ydOd3RwW9Z-O3yM
// timezone: AIzaSyCxlNMt28e37BpecnaoIAQDF-mei_karGM
// https://maps.googleapis.com/maps/api/timezone/json?location=38.908133,-77.047119&timestamp=1458000000&key=YAIzaSyBTVLqIIu_T8HXHDZivjsnUHHY1j2HMXJc

service.get('/service/:location', (req, res, next) => {
	request.get(
		'https://maps.googleapis.com/maps/api/geocode/json?address=' +
			req.params.location +
			'&key=' + config.googleGeoApiKey,
		(err, response) => {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			}

			const location = response.body.results[0].geometry.location;
			const timestamp = +moment().format('X');
			request.get(
				'https://maps.googleapis.com/maps/api/timezone/json?location=' +
					location.lat +
					',' +
					location.lng +
					'&timestamp=' +
					timestamp +
					'&key=' + config.googleTimeApiKey,
				(err, response) => {
					if (err) {
						console.log(err);
						return res.sendStatus(500);
					}

					const result = response.body;
					console.log(result);
					const timeString = moment
						.unix(timestamp + result.dstOffset + result.rawOffset)
						.utc()
						.format('dddd, MMMM Do YYYY, h:mm:ss, a');
					res.json({ result: timeString });
				}
			);
		}
	);
});

module.exports = service;
