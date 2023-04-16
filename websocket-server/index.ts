import { Server } from 'socket.io'
import dotenv from 'dotenv'

dotenv.config()

const corsOrigins = ['http://localhost:3000', process.env.ORIGIN1 || '', process.env.ORIGIN2 || '']

const io = new Server({ cors: { origin: corsOrigins } })

const rooms: string[] = []

io.on('connection', function (socket) {
    console.log('connect: ', socket.id)
    socket.on('hello!', function () {
        console.log('hello from '.concat(socket.id))
    })
    socket.on('disconnect', function () {
        console.log('disconnect: '.concat(socket.id))
    })
    socket.on('create-room', (room: string) => {
        console.log(`room ${room} is being created`)
        if (!rooms.includes(room)) {
            socket.join(room)
            rooms.push(room)
            io.to(room).emit('chat', `You just created this room "${room}"`)
        } else {
            console.log(room, ' is already exists')
            return
        }
    })
    socket.on('join-room', (room: string) => {
        console.log(`joining room ${room}`)
        if (rooms.includes(room)) {
            socket.join(room)
            io.to(room).emit('chat', `You just joined this room "${room}"`)
        } else {
            console.log(room, ' not exists exists')
            return
        }
    })
    socket.on('chat', (msg: { chat: string; room: string }) => {
        const chat = msg.chat
        const room = msg.room
        socket.to(room).emit('chat', chat)
    })
})
io.listen(3005)
