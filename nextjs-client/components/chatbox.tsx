import socket from '@/lib/socket'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function ChatBox() {
    const [wroteMsg, setWroteMsg] = useState('')
    const [chats, setChats] = useState<{ msg: string; received: boolean }[]>([])
    const router = useRouter()

    const room = router.query.room

    function receiveMsg(msg: string) {
        console.log('receiving msg')
        //add it to chats
        const chatMsg = { msg, received: true }
        setChats(otherChats => {
            return [chatMsg, ...otherChats]
        })
    }

    function sendMsg(msg: string) {
        console.log('sending msg')
        socket.emit('chat', { chat: msg, room: room })
        //add it to chats
        const chatMsg = { msg, received: false }
        setChats(otherChats => {
            return [chatMsg, ...otherChats]
        })
    }

    useEffect(() => {
        socket.on('chat', receiveMsg)
        return () => {
            socket.off('chat', receiveMsg)
        }
    }, [])
    return (
        <ul className='flex flex-col border border-red-300 w-1/2 h-1/2 rounded-lg gap-4 p-4 overflow-scroll'>
            {chats.map((chatMsg, index) => {
                return (
                    <li
                        key={index}
                        className={(chatMsg.received ? `text-left ` : 'text-right ') + ' rounded bg-yellow-200'}
                    >
                        {chatMsg.msg}
                    </li>
                )
            })}
            <div className='justify-self-end self-end'>
                <input
                    type='text'
                    value={wroteMsg}
                    onChange={e => {
                        setWroteMsg(e.target.value)
                    }}
                />
                <button onClick={() => sendMsg(wroteMsg)}>Send</button>
            </div>
        </ul>
    )
}
