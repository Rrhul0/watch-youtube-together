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

    socket.on('chat', ({ chat, room }: { chat: string; room: string }) => {
        socket.to(room).emit('chat', chat)
    })

    socket.on('video-id', ({ id, room }: { id: string; room: string }) => {
        socket.to(room).emit('video-id', id)
    })

    socket.on('video-ready', (room: string) => {
        io.to(room).emit('all-video-ready')
    })

    socket.on('start', (room: string) => {
        io.to(room).emit('start')
    })

    socket.on('pause', (room: string) => {
        io.to(room).emit('pause')
    })

    socket.on('sync', ({ room, currentTime }: { room: string; currentTime: number }) => {
        socket.to(room).emit('sync-forward', currentTime)
    })
})
io.listen(3005)
