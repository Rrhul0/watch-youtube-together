import { LegacyRef, useEffect, useRef, useState } from 'react'
import socket from '@/lib/socket'
import { useRouter } from 'next/router'
import ChatBox from '@/components/chatbox'
import YouTube, { YouTubePlayer } from 'react-youtube'

export default function MainPage() {
    const [url, setUrl] = useState<string>('')
    const [videoId, setVideoId] = useState<string>()
    const [player, setPlayer] = useState<YouTubePlayer>()
    const router = useRouter()
    const room = router.query.room as string

    function parseVideoId(url: string) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
        var match = url.match(regExp)
        return match && match[7].length == 11 ? match[7] : false
    }

    // const OnPlayerReady: YouTubeProps['onReady'] = e => {
    //     console.log(e.target.pl)
    // }

    function receiveId(id: string) {
        console.log('received id')
        setVideoId(id)
    }

    function sendId(id: string) {
        console.log('sending id')
        socket.emit('video-id', { id, room })
    }

    function startVideo() {
        console.log('starting video')
        player.playVideo()
    }

    function pauseVideo() {
        console.log('starting video')
        player.pauseVideo()
        console.log(player.playerInfo.currentTime)
    }

    function syncVideo(time: number) {
        console.log('sync forward', time)
        // player.pauseVideo()
        player.seekTo(time)
    }

    useEffect(() => {
        socket.on('video-id', receiveId)
        socket.on('start', startVideo)
        socket.on('pause', pauseVideo)
        socket.on('sync-forward', syncVideo)
        return () => {
            socket.off('video-id', receiveId)
            socket.off('start', startVideo)
            socket.off('pause', pauseVideo)
            socket.off('sync-forward', syncVideo)
        }
    })

    console.log(player)

    // function
    return (
        <div className='h-screen'>
            <ChatBox />
            <input
                placeholder='Youtube video URL'
                type='text'
                value={url}
                onChange={e => {
                    setUrl(e.target.value)
                }}
            />
            <button
                onClick={() => {
                    const id = parseVideoId(url)
                    if (!id) return
                    sendId(id)
                    setVideoId(id)
                }}
            >
                Load
            </button>
            {videoId ? (
                <YouTube
                    videoId={videoId}
                    onReady={e => {
                        console.log(e)
                        setPlayer(e.target)
                        console.log('send start video')
                        socket.emit('video-ready', room)
                    }}
                />
            ) : (
                <>please enter a youtube video url</>
            )}
            <div>
                <button
                    onClick={() => {
                        socket.emit('start', room)
                    }}
                >
                    Play
                </button>
                <button onClick={() => socket.emit('pause', room)}>Pause</button>
                <button
                    onClick={() => {
                        // player.pauseVideo()
                        console.log('sync', player.playerInfo.currentTime)
                        socket.emit('sync', { room, currentTime: player.playerInfo.currentTime })
                    }}
                >
                    Sync
                </button>
            </div>
        </div>
    )
}
