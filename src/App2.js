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
    //use your link here
    const [sock, setSock] = React.useState(new SockJS('http://localhost:8080/websocket-chat/'));
    const [stompClient, setStompClient] = React.useState(Stomp.over(sock));
    
    React.useEffect(()=>{
        sock.onopen = function () {
            console.log('open');
        }
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/user', function (greeting) {
                console.log("stompClient.subscribe", greeting);
                //you can execute any function here
            });
        });

    },[sock, stompClient])
    

    const clickk = () => {
        stompClient.send("fdfdsfds")
    }

    return(
        <button onClick={clickk}>bas</button>
    )

}

export default App;