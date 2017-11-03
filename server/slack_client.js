const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
let rmt = null;
let nlp = null;

function handleOnAuthenticated(rtmStartData) {
    console.log(
        `Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team
            .name}, but not yet connected to a channel`
    );
}

function handleOnMessage(message) {

    if (message.text.toLowerCase().includes('bot')) {
        nlp.ask(message.text, (err, res) => {
            if (err) {
                console.log(err);
                return;
            }

            try {
                if (!res.intent || !res.intent[0] || !res.intent[0].value) {
                    throw new Error('Could not extract intent')
                }

                const intent = require('./intents/' + res.intent[0].value + 'Intent');
                intent.process(res, function (err, response) {
                    if (err) {
                        console.log(err.message)
                        return
                    }
                    return rtm.sendMessage(response, message.channel)
                })
            } catch (err) {
                console.log(err)
                console.log(res)
                 rtm.sendMessage('Sorry, I dont know what are you talking about', message.channel)
            }
            if (!res.intent) {
                return rtm.sendMessage(
                    'Sorry, I dont know what u r talking about',
                    message.channel
                );
            } else if (res.intent[0].value === 'time' && res.location) {
                return rtm.sendMessage(
                    `I dont yet know the time in ${res.location[0].value}`,
                    message.channel
                );
            } else {
                console.log(res);
                return rtm.sendMessage(
                    'Sorry, I dont know what u r talking about',
                    message.channel
                );
            }

            rtm.sendMessage('test', message.channel, function messageSent() {
            });
        });
    }
}

function addAuthenticatedHandler(rtm, handler) {
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
}

module.exports.init = (token, logLevel, nlpClient) => {
    rtm = new RtmClient(token, {logLevel});
    nlp = nlpClient;
    addAuthenticatedHandler(rtm, handleOnAuthenticated);
    rtm.on(RTM_EVENTS.MESSAGE, handleOnMessage);
    return rtm;
};

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;