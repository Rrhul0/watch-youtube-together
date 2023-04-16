import { useEffect, useState } from 'react'
import socket from '@/lib/socket'
import Link from 'next/link'

export default function JoinTheater() {
    const [roomName, setRoomName] = useState('')
    useEffect(() => {
        socket.on('hello', msg => console.log(msg))
    }, [])

    return (
        <div>
            <input name='room-name' type='text' value={roomName} onChange={e => setRoomName(e.target.value)} />
            <Link
                href={`/mainpage?room=${roomName}`}
                onClick={() => {
                    socket.emit('join-room', roomName)
                }}
            >
                Join
            </Link>
        </div>
    )
}
