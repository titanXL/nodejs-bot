const service = require('../server/service.js');
const http = require('http');
const server = http.createServer(service);

const serviceRegistry = service.get('serviceRegistry');

server.listen(3000);
server.on('listening', () => {
	console.log(
		`SKYNET IS LISTENING ON ${server.address().port} in ${service.get(
			'env'
		)} mode.`
	);
});

const webChat = require('../webchat/server.js')(serviceRegistry);
