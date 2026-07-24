import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [muted, setMuted] = useState(false)

    const fetchNotifications = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            setLoading(false)
            return
        }

        const { data: notifData } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })

        const { data: userData } = await supabase
            .from('users')
            .select('notifications_muted')
            .eq('id', session.user.id)
            .single()

        setNotifications(notifData || [])
        setMuted(userData?.notifications_muted || false)
        setLoading(false)
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    const markAsRead = async (notificationId) => {
        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notificationId)
        await fetchNotifications()
    }

    const markAllAsRead = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return
        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', session.user.id)
            .eq('read', false)
        await fetchNotifications()
    }

    const toggleMute = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return
        await supabase
            .from('users')
            .update({ notifications_muted: !muted })
            .eq('id', session.user.id)
        setMuted(!muted)
    }

    const unreadCount = notifications.filter((n) => !n.read).length

    return { notifications, loading, muted, unreadCount, markAsRead, markAllAsRead, toggleMute }
}

// Helper to create a notification for a single user — used by other features
// (announcements, stories, order status changes, etc.) to trigger a notification.
export const createNotification = async (userId, category, message) => {
    const { data: userData } = await supabase
        .from('users')
        .select('notifications_muted')
        .eq('id', userId)
        .single()

    if (userData?.notifications_muted) {
        return { skipped: true }
    }

    const { error } = await supabase
        .from('notifications')
        .insert({
            user_id: userId,
            category,
            message,
            read: false,
        })

    if (error) return { error: 'Could not create notification.' }
    return { success: true }
}

// Helper to notify every follower of a business — used when an owner posts
// an announcement or story.
export const notifyFollowers = async (hbbId, category, message) => {
    const { data: followers } = await supabase
        .from('user_business_relations')
        .select('user_id')
        .eq('hbb_id', hbbId)
        .eq('is_following', true)

    if (!followers || followers.length === 0) return { success: true }

    await Promise.all(
        followers.map((f) => createNotification(f.user_id, category, message))
    )

    return { success: true }
} 