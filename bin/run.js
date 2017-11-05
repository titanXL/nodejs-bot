const service = require('../server/service.js');
const http = require('http');
const slackClient = require('../server/slack_client.js');
const server = http.createServer(service);

const witToken = 'XPNMUVV25NCUXINRL3LIAAS5PGWTVAQG';
const witClient = require('../server/witClient.js')(witToken);

const slackToken = 'xoxb-266171662098-0DjX7etnTVp4bESlaX32AvS6';
const slackLogLevel = 'verbose';

const serviceRegistry = service.get('serviceRegistry');

const rtm = slackClient.init(
	slackToken,
	slackLogLevel,
	witClient,
	serviceRegistry
);

rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000));

server.on('listening', () => {
	console.log(
		`SKYNET IS LISTENING ON ${server.address().port} in ${service.get(
			'env'
		)} mode.`
	);
});
