import { useEffect, useState } from 'react'
import socket from '@/lib/socket'
import { useRouter } from 'next/router'

export default function MainPage() {
    const [chat, setChat] = useState('')
    const [chats, setChats] = useState<{ msg: string; received: boolean }[]>([])
    const router = useRouter()
    const room = router.query.room

    function receiveMsg(msg: string) {
        console.log('got msg')
        const chatMsg = { msg, received: true }
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

    console.log(chats)
    return (
        <div className='h-screen'>
            <ul className='flex flex-col border border-red-300 w-1/2 h-1/2 rounded-lg gap-4 p-4'>
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
                        value={chat}
                        onChange={e => {
                            setChat(e.target.value)
                        }}
                    />
                    <button
                        onClick={() => {
                            socket.emit('chat', { chat: chat, room: room })
                            const chatMsg = { msg: chat, received: false }
                            setChats(otherChats => {
                                return [chatMsg, ...otherChats]
                            })
                        }}
                    >
                        Send
                    </button>
                </div>
            </ul>
        </div>
    )
}
