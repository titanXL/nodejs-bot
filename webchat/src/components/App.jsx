import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import MessageList from './Messages/MessageList.jsx';
import MessageForm from './Messages/MessageForm.jsx';
import UserList from './Users/UserList.jsx';
import UserForm from './Users/UserForm.jsx';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: 'disconnected',
			messages: [

			],
			welcomeMessages: [
				{
					timeStamp: Date.now(),
					text: 'Welcome to SocketIO chat, feel free to ask skynet about the weather or the time in a city'
				},
				{
					timeStamp: Date.now(),
					text: 'Example: What is the time in London, skynet?'
				},
				{
					timeStamp: Date.now(),
					text: 'Do not forget to include skynet in the message!'
				}
			],
			users: [],
			user: ''
		};
	}

	componentWillMount() {
		this.socket = io('http://localhost:1337');
		this.socket.on('connect', this.connect.bind(this));
		this.socket.on('messageAdded', this.onMessageAdded.bind(this));
		this.socket.on('userJoined', this.onUserJoined.bind(this));
		this.socket.on('disconnect', this.disconnect.bind(this));
	}

	connect() {
		this.setState({
			status: 'connected'
		});
		console.log('connected:' + this.socket.id);
	}

	disconnect(users) {
		this.setState({ users: users });
		this.setState({ status: 'disconnect' });
	}

	onMessageAdded(message) {
		console.log('Message', message);
		this.setState({ messages: this.state.messages.concat(message) });
	}

	onUserJoined(users) {
		this.setState({ users: users });
	}

	emit(eventName, payload) {
		this.socket.emit(eventName, payload);
	}

	setUser(user) {
		this.setState({ user: user });
	}

	render() {
		if (this.state.user == '') {
			return (
				<UserForm
					emit={this.emit.bind(this)}
					setUser={this.setUser.bind(this)}
				/>
			);
		} else {
			return (
				<div>
					<div className="row">
						<div className="col-md-4">
							<UserList {...this.state} />
						</div>
						<div className="col-md-8">
							<div className='well'>
								<MessageList messages={this.state.welcomeMessages} text={'Welcome'} />
							</div>
							<MessageForm
								{...this.state}
								emit={this.emit.bind(this)}
							/>
							<MessageList {...this.state} text={'Messages'} scrollable='true' />
						</div>
					</div>
				</div>
			);
		}
	}
}
export default App;
