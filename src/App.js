import React, { Component } from 'react';
import SockJsClient from 'react-stomp';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import './css/MessageStyle.css';
import NameComponent from "./components/NameComponent";
import axios from "axios"

const App = (props) => {
    const [messages, setMessages] = React.useState([]);
    const [typedMessage, setTypedMessage] = React.useState("");
    const [username, setName] = React.useState("");

    const clientRef = React.useRef(null);

    console.log("messages:", messages)

    const setNameHandler = (name) => {
        console.log("username", name)
        setName(name)
    }
    console.log("clientref", clientRef)

    const sendMessage = () => {
        console.log("send mesaj, clientRef", clientRef, clientRef.current.client)
        //clientRef.current.connect((e)=>{console.log("???:",e)})
        clientRef.current.sendMessage('/app/user-all', JSON.stringify({
            name: username,
            message: typedMessage
        }));
    };

    const sendName = () => {
        clientRef.current.sendMessage('/app/user-specific', JSON.stringify({
            name: username,
        }));
    }

    const handleOnMessage = (msg) => {
        console.log("onmessage", msg)
        var jobs = messages;
        jobs.push(msg);
        setMessages([...jobs]);
    }

    const handleDisconnect = () => {
        clientRef.current.disconnect()
    }

    const handleConnect = () => {
        clientRef.current.connect()
    }

    const displayMessages = () => {
        return (
            <div>
                {clientRef.current !== null && clientRef.current.props.subscribeHeaders !== '/user/queue/greetings'
                    ? messages.map(msg => {
                        return (
                            <div>
                                {username == msg.name ?
                                    <div>
                                        <p className="title1">{msg.name} : </p><br />
                                        <p>{msg.message}</p>
                                    </div> :
                                    <div>
                                        <p className="title2">{msg.name} : </p><br />
                                        <p>{msg.message}</p>
                                    </div>
                                }
                            </div>)
                    })
                    :
                    [clientRef.current !== null && clientRef.current.props.subscribeHeaders !== '/topic/user'
                        ? messages.map(msg => {
                            return (
                                <div>

                                    <div>
                                        <p className="title1">{msg} : </p><br />

                                    </div>

                                </div>)
                        })
                        : ""]
                }
            </div>
        );
    };

    const denemeClickHandler = () => {
        axios.get("http://localhost:8080/api/deneme/")
            .then(result => console.log(result))
    }

    return (
        <div>
            <NameComponent setName={setNameHandler} />
            <div className="align-center">
                <h1>Welcome to Web Sockets</h1>
                <br /><br />
                <Button onClick={denemeClickHandler}>deneme</Button>
            </div>
            <div className="align-center">
                User : <p className="title1"> {username}</p>
            </div>
            <div className="align-center">
                <br /><br />
                <table>
                    <tr>
                        <td>
                            <TextField id="outlined-basic" label="Enter Message to Send" variant="outlined"
                                onChange={(event) => {
                                    setTypedMessage(event.target.value);
                                }} />
                        </td>
                        <td>
                            <Button variant="contained" color="primary"
                                onClick={sendMessage}>Send</Button>
                        </td>
                        <td>
                            <Button variant="contained" color="primary"
                                onClick={sendName}>SendName</Button>
                        </td>
                    </tr>
                </table>
            </div>
            <br /><br />
            <div className="align-center">
                {displayMessages()}
            </div>
            <button onClick={handleConnect}>connect</button>
            <button onClick={handleDisconnect}>disconnect</button>
            <SockJsClient
                url='http://localhost:8080/websocket-chat/'
                topics={['/topic/all', '/user/queue/user']}
                onConnect={() => {
                    console.log("connected");
                }}
                onDisconnect={() => {
                    console.log("Disconnected");
                }}
                onMessage={handleOnMessage}
                ref={clientRef}
                autoReconnect={true}
             />
        </div>
    )

}

export default App;