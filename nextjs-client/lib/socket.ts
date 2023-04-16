import { io } from 'socket.io-client'

const socket = io(process.env.SOCKET_URL || 'localhost:3005')

export default socket
