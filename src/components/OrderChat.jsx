import { useState, useRef, useEffect } from 'react'
import { useOrderChat } from '../hooks/useOrderChat'

const OrderChat = ({ orderId, currentUserId }) => {
    const { messages, sendMessage } = useOrderChat(orderId)
    const [messageInput, setMessageInput] = useState('')
    const [chatError, setChatError] = useState('')
    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        setChatError('')

        if (!messageInput.trim()) return

        if (!currentUserId) {
            setChatError('Still loading your session, please try again in a moment.')
            return
        }

        const result = await sendMessage(messageInput, currentUserId)
        if (result.error) {
            setChatError(result.error)
        } else {
            setMessageInput('')
        }
    }

    return (
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <div className="bg-[#FAFEFE] px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-[#2d3748]">Chat</p>
            </div>

            <div className="h-64 overflow-y-auto px-4 py-3 flex flex-col gap-2">
                {messages.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center mt-4">No messages yet.</p>
                ) : (
                    messages.map((msg) => {
                        const isMine = msg.sender_id === currentUserId
                        return (
                            <div
                                key={msg.id}
                                className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                                    isMine
                                        ? 'self-end bg-[#0e6b7a] text-white'
                                        : 'self-start bg-gray-100 text-[#2d3748]'
                                }`}
                            >
                                {msg.content}
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {chatError && (
                <p className="text-xs text-red-400 px-4 pb-2">{chatError}</p>
            )}

            <form onSubmit={handleSendMessage} className="flex gap-2 px-4 py-3 border-t border-gray-100">
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0e6b7a]"
                />
                <button
                    type="submit"
                    className="bg-[#0e6b7a] text-white px-4 py-2 rounded-xl text-sm font-medium"
                >
                    Send
                </button>
            </form>
        </div>
    )
}

export default OrderChat