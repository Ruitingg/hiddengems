import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export const useOrderChat = (orderId) => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!orderId) return

        const fetchMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('order_id', orderId)
                .order('created_at', { ascending: true })

            setMessages(data || [])
            setLoading(false)
        }

        fetchMessages()

        const channel = supabase
            .channel(`order-chat-${orderId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `order_id=eq.${orderId}`
            }, (payload) => {
                setMessages((prev) => [...prev, payload.new])
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [orderId])

    const sendMessage = async (content, senderId) => {
        if (!content.trim()) return { error: 'Message cannot be empty.' }

        const { error } = await supabase
            .from('messages')
            .insert({ order_id: orderId, sender_id: senderId, content })

        if (error) {
            console.log('SEND MESSAGE ERROR:', error)
            return { error: 'Could not send message.' }
        }
        return { success: true }
    }

    return { messages, loading, sendMessage }
}