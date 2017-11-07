module.exports = (serviceRegistry, config) => {
	const http = require('http');

	const service = require('../server/service.js');
	const server = http.createServer(service);
	server.listen(1337);

	const witToken = config.witToken;
	const witClient = require('../server/witClient.js')(witToken);

	var connections = [];
	var users = [];

	io = require('socket.io').listen(server);

	io.sockets.on('connection', function(socket) {
		socket.once('disconnect', function() {
			for (var i = 0; i < users.length; i++) {
				if (users[i].id == this.id) {
					users.splice(i, 1);
				}
			}
			connections.splice(connections.indexOf(socket), 1);
			socket.disconnect();
			console.log(
				'Disconnected : %s sockets connected',
				connections.length
			);
			io.emit('disconnect', users);
		});

		socket.on('messageAdded', function(payload) {
			var newMessage = {
				timeStamp: payload.timeStamp,
				text: payload.text,
				user: payload.user
			};

			if (payload.text.toLowerCase().includes('skynet')) {
				witClient.ask(payload.text, (err, res) => {
					if (err) {
						console.log(err);
						return;
					}

					try {
						if (
							!res.intent ||
							!res.intent[0] ||
							!res.intent[0].value
						) {
							throw new Error('Could not extract intent');
						}

						const intent = require('../server/intents/' +
							res.intent[0].value +
							'Intent');

						intent.process(res, serviceRegistry, function(
							err,
							response
						) {
							if (err) {
								console.log(err);
								console.log(response);
								return;
							}

							return io.emit('messageAdded', {
								timeStamp: payload.timeStamp,
								text: response,
								user: 'skynet'
							});
						});
					} catch (err) {
						console.log('HERE');

						console.log(err);
						console.log(res);
						return io.emit('messageAdded', 'Something happend...');
					}
				});
			}
			io.emit('messageAdded', newMessage);
		});

		socket.on('userJoined', function(payload) {
			var newUser = {
				id: this.id,
				name: payload.name
			};

			users.push(newUser);

			io.emit('userJoined', users);
			console.log('User joined:' + payload.name);
		});

		connections.push(socket);
		console.log('Connected : %s sockets connected', connections.length);
	});
	console.log('server is running on porn 1337');
};
