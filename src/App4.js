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
    const [socket, setSocket] = React.useState(new SockJS('http://localhost:8080/websocket-chat/'));
    const [stompClient, setStompClient] = React.useState(Stomp.over(socket));
    const [connected, setConnected] = React.useState(false);
    const [messages, setMessages] = React.useState([])
    const [input, setInput] = React.useState({name: "default", message: "default"})

    console.log("stompClient:", stompClient)
    console.log("messages",messages)
    console.log("input ", input)


    React.useEffect(() => {
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
    },[connected])

    function sendMessage() {
        stompClient.send("/app/user-all", {},
            JSON.stringify({ name: input.name, message: input.message }));
    }

    function showMessageOutput(messageOutput) {
        console.log("messageOutput",messageOutput, messages)
        const newMessages = messages
        newMessages.push(messageOutput)
        setMessages([...newMessages])
    }

    const handleMessageChange = (event, param) => {
        console.log(event.target.value)
        const ms = {name: "", message:""}
        if( param === "name" ){
            setInput({...input, name: event.target.value})
            ms.name = event.target.value
        }
        else{
            setInput({...input, message: event.target.value})
        }
        
    }

    return (
        <body onLoad={console.log("onlooooooad")}>
            <div>
                <div>
                    <input type="text" id="from" placeholder="Choose a nickname" onChange={(e) => handleMessageChange(e, "name")}/>
                </div>
               
               {/*  <div>
                    <button id="connect" onClick={"connect"}>Connect</button>
                    <button id="disconnect" disabled="disabled" onClick={"disconnect"}>
                        Disconnect
                </button>
                </div> */}
                
                <div id="conversationDiv">
                    <input type="text" id="text" placeholder="Write a message..." onChange={(e) => handleMessageChange(e, "message")}/>
                    <button id="sendMessage" onClick={sendMessage}>Send</button>
                 </div>
            </div>
            <div>
                {messages.map(i =>(
                    <h1>{i.name + " " + i.message}</h1>
                ))}
            </div>
        </body>
    )

}

export default App;