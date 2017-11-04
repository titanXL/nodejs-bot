const service = require('../server/service.js');
const http = require('http');
const slackClient = require('../server/slack_client.js');
const server = http.createServer(service);

const witToken = '';
const witClient = require('../server/witClient.js')(witToken);

const slackToken = '';
const slackLogLevel = 'verbose';

const rtm = slackClient.init(slackToken, slackLogLevel, witClient);

rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000));

server.on('listening', () => {
	console.log(
		`BOT IS LISTENING ON ${server.address().port} in ${service.get(
			'env'
		)} mode.`
	);
});
