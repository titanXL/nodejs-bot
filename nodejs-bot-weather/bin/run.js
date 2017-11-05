const service = require('../server/service.js');
const http = require('http');
const request = require('superagent');

const server = http.createServer(service);
server.listen();

server.on('listening', () => {
	console.log(
		`SKYNET-WEATHER IS LISTENING ON ${server.address()
			.port} in ${service.get('env')} mode.`
	);

	const announce = () => {
		request.put(
			`http://127.0.0.1:3000/service/weather/${server.address().port}`,
			(err, response) => {
				if (err) {
					console.log(err);
					console.log('Error connecting to bot');
					return;
				}
				console.log(response.body);
			}
		);
	};
	announce();
	setInterval(announce, 15 * 1000);
});
