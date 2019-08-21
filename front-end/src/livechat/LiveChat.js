
import React, {Component} from 'react';
import LoadingIndicator from '../common/LoadingIndicator';
import './LiveChat.css';
import SockJS from 'sockjs-client'
import {Client,StompConfig} from '@stomp/stompjs'

var stompClient = null;
var username = null;

var colors = [
	'#2196F3', '#32c787', '#00BCD4', '#ff5652',
	'#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

const API_BASE_URL = 'http://localhost:8086'

class LiveChat extends React.Component{

    constructor(props){
        super(props);
        console.log(props);
        this.state = {
            loading: true,
            messages: [],
            connecting: 'Connecting...'
        };
        this.connect = this.connect.bind(this);
        this.onError = this.onError.bind(this);
        this.onMessageReceived = this.onMessageReceived.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.getAvatarColor = this.getAvatarColor.bind(this);
    }

    componentDidMount(){

    }


    getAvatarColor(messageSender) {
    	var hash = 0;
    	for (var i = 0; i < messageSender.length; i++) {
    		hash = 31 * hash + messageSender.charCodeAt(i);
    	}
    	var index = Math.abs(hash % colors.length);
    	return colors[index];
    }

    sendMessage(event) {
		console.log('attempt to send message')
    	var messageContent = event.target.message.value;
    	if(messageContent && stompClient) {
    		var chatMessage = {
    			sender: username,
    			content: messageContent,
    			type: 'CHAT'
    		};
			let message =  JSON.stringify(chatMessage)
    		stompClient.publish({
				destination: "/app/chat.sendMessage",
				headers: {},
				body: message});
    	}
    	event.preventDefault();
    }

    connect(event) {
        username = event.target.name.value;

    	if(username) {
    		var socket = new SockJS(API_BASE_URL+'/ws');

			const stompConfig = {
				brokerURL: "ws://localhost:8086/ws",
connectHeaders: {
login: "username",
passcode: "password"
},
debug: function(message) {
console.log(message);
},
onWebSocketClose: function(message) {
console.log("Reason: ", message.reason);
},
onWebSocketError: function() {
console.log("Web socket error");
},
onConnect: function(frame) {
	console.log(frame)
console.log("Client connected to", frame.headers.server);
// Subscribe to the Public Topic
stompClient.subscribe('/topic/public', this.onMessageReceived);

// Tell your username to the server
stompClient.publish("/app/chat.addUser",
	{},
	JSON.stringify({sender: username, type: 'JOIN'})
);
},
onDisconnect: function() {
console.log("Client disconnected");
},
onStompError: function(frame) {
console.log("Broker reported error: " + frame.headers["message"]);
console.log("Additional details: " + frame.body);
},
reconnectDelay: 5000,
heartbeatIncoming: 4000,
heartbeatOutgoing: 4000
};
    		stompClient = new Client(stompConfig);
    		stompClient.webSocketFactory = () => {
                return socket;
            };
			stompClient.activate();
            this.setState({
                loading: false
            });
    	}
    	event.preventDefault();
    }


    onError(error) {
        this.setState({
            connecting:  'Could not connect to WebSocket server. Please refresh this page to try again!'
        });
    }

    onMessageReceived(payload) {
    	var message = JSON.parse(payload.body);
console.log('message received');
console.log(message);
        let messages = this.state.messages;

    	if(message.type === 'JOIN') {
    		// messageElement.classNameList.add('event-message');
            // message.content = message.sender + ' joined!';
            messages.push(message.sender + ' joined!');
    	} else if (message.type === 'LEAVE') {
    		// messageElement.classNameList.add('event-message');
    		// message.content = message.sender + ' left!';
            messages.push(message.sender + ' left!');
    	} else {
    		// messageElement.classNameList.add('chat-message');
            messages.push(message.sender);
    		// var avatarElement = document.createElement('i');
    		// var avatarText = document.createTextNode(message.sender[0]);
    		// avatarElement.appendChild(avatarText);
    		// avatarElement.style['background-color'] = this.getAvatarColor(message.sender);
            //
    		// messageElement.appendChild(avatarElement);
            //
    		// var usernameElement = document.createElement('span');
    		// var usernameText = document.createTextNode(message.sender);
    		// usernameElement.appendChild(usernameText);
    		// messageElement.appendChild(usernameElement);
    	}
            messages.push(message.content);
    	// var textElement = document.createElement('p');
    	// var messageText = document.createTextNode(message.content);
    	// textElement.appendChild(messageText);
        //
    	// messageElement.appendChild(textElement);
        //
    	// messageArea.appendChild(messageElement);
    	// messageArea.scrollTop = messageArea.scrollHeight;
    }

    render(){
        if (this.state.loading) {
            return (
                <div id="username-page">
                    <div className={"username-page-container"}>
                        <h1 className={"title"}>Type your username</h1>
                        <form id="usernameForm" name="usernameForm" onSubmit={this.connect} >
                            <div className={"form-group"}>
                                <input type="text" id="name" placeholder="Username" autoComplete="off" className={"form-control"} />
                            </div>
                            <div className={"form-group"}>
                                <button type="submit" className={"accent username-submit"}>Start Chatting</button>
                            </div>
                        </form>
                    </div>
                </div>
            )
        }else{
			console.log('We are logged to chat.')
            return (
                <div id="chat-page">
                    <div className="chat-container">
                        <div className={"chat-header"}>
                            <h2>Spring WebSocket Chat Demo</h2>
                        </div>
                        <div className={"connecting"}>
                            {this.state.connecting}
                        </div>
						<ul id="messageArea">
                            {this.state.messages}
                        </ul>
                        <form id="messageForm" name={"messageForm"} onSubmit={this.sendMessage}>
                            <div className={"form-group"}>
                                <div className={"input-group clearfix"}>
                                    <input type="text" id="message" placeholder="Type a message..." autoComplete="off" className={"form-control"}/>
                                    <button type="submit" className={"primary"}>Send</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                )
        }
    }

}

export default LiveChat
