const service = require('../server/service.js');
const http = require('http');

const server = http.createServer(service);
server.listen(3010);

server.on('listening', () => {
	console.log(
		`SKYNET-TIME IS LISTENING ON ${server.address().port} in ${service.get(
			'env'
		)} mode.`
	);
});
