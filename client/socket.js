import {io} from "socket.io-client"

const socket = io(process.env.apiUrl, { autoConnect: true})

export default socket