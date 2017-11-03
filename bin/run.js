const service = require('../server/service.js');
const http = require('http');
const slackClient = require('../server/slack_client.js');
const server = http.createServer(service);

const witToken = 'XPNMUVV25NCUXINRL3LIAAS5PGWTVAQG';
const witClient = require('../server/witClient.js')(witToken);

const slackToken = '123b-265771207568-IA6gqyk8kx2paQblEbC8XnOd';
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
