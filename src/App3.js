import React, { Component, useEffect } from 'react';
import SockJsClient from 'react-stomp';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import './css/MessageStyle.css';
import NameComponent from "./components/NameComponent";
import axios from "axios"

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';


const App = (props) => {
    var stompClient = null;

    function setConnected(connected) {
        document.getElementById('connect').disabled = connected;
        document.getElementById('disconnect').disabled = !connected;
        document.getElementById('conversationDiv').style.visibility
            = connected ? 'visible' : 'hidden';
        document.getElementById('response').innerHTML = '';
    }

    function connect() {
        var socket = new SockJS('http://localhost:8080/websocket-chat/');
        stompClient = Stomp.over(socket);
        console.log("stompClient:", stompClient)
        socket.onopen = function() {
            console.log('open!!!!!!!!!!!!!!!!!!!!!');
        }
        stompClient.connect({}, function (frame) {
            setConnected(true);
            console.log('Connected: ' + frame);
            console.log(socket._transport.url); 
            stompClient.subscribe('/topic/user', function (messageOutput) {
                console.log(messageOutput)
                showMessageOutput(JSON.parse(messageOutput.body));
            });
        });
    }

    function disconnect() {
        console.log("stompClient-------------------------------------------",stompClient)
        if (stompClient != null) {
            stompClient.disconnect();
        }
        setConnected(false);
        console.log("Disconnected");
    }

    function sendMessage() {
        var from = document.getElementById('from').value;
        var text = document.getElementById('text').value;
        stompClient.send("/app/user-all", {},
            JSON.stringify({ name: from, message: text }));
    }

    function showMessageOutput(messageOutput) {
        var response = document.getElementById('response');
        var p = document.createElement('p');
        p.style.wordWrap = 'break-word';
        p.appendChild(document.createTextNode(messageOutput.name + ": "
            + messageOutput.message + " (" + messageOutput.time + ")"));
        response.appendChild(p);
    }

    return (
        <body onLoad={disconnect}>
            <div>
                <div>
                    <input type="text" id="from" placeholder="Choose a nickname" />
                </div>
                <br />
                <div>
                    <button id="connect" onClick={connect}>Connect</button>
                    <button id="disconnect" disabled="disabled" onClick={disconnect}>
                        Disconnect
                </button>
                </div>
                <br />
                <div id="conversationDiv">
                    <input type="text" id="text" placeholder="Write a message..." />
                    <button id="sendMessage" onClick={sendMessage}>Send</button>
                    <p id="response"></p>
                </div>
            </div>

        </body>
    )

}

export default App;