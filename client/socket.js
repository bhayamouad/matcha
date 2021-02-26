import {io} from "socket.io-client"

const socket = io(process.env.apiUrl, { autoConnect: true})
socket.onAny((event, ...args) => {
    console.log(event, args);
  });

export default socket