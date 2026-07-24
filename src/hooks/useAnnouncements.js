import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { notifyFollowers } from './useNotifications'

const useAnnouncements = (hbbId) => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchPosts = async () => {
            if (!hbbId) return
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('hbb_id', hbbId)
                .order('created_at', { ascending: false })

            if (error) {
                setError('Could not load posts.')
            } else {
                setPosts(data)
            }
            setLoading(false)
        }

        fetchPosts()
    }, [hbbId])

    const createAnnouncement = async (hbbId, content, category) => {
        const { data, error } = await supabase
            .from('posts')
            .insert({
                hbb_id: hbbId,
                type: 'announcement',
                content,
                category,
            })
            .select()
            .single()

        if (error) return { error: 'Could not create announcement.' }
        setPosts([data, ...posts])

        const { data: hbbData } = await supabase
            .from('hbb_profiles')
            .select('name')
            .eq('id', hbbId)
            .single()

        await notifyFollowers(
            hbbId,
            'announcement',
            `${hbbData?.name || 'A business you follow'} posted a new announcement: ${content.slice(0, 60)}${content.length > 60 ? '...' : ''}`
        )

        return { success: true }
    }

    const createStory = async (hbbId, caption, imageFile) => {
        const filePath = `${hbbId}/${Date.now()}_${imageFile.name}`

        const { error: uploadError } = await supabase.storage
            .from('business-posts')
            .upload(filePath, imageFile)

        if (uploadError) return { error: 'Could not upload image.' }

        const { data: { publicUrl } } = supabase.storage
            .from('business-posts')
            .getPublicUrl(filePath)

        const { data, error } = await supabase
            .from('posts')
            .insert({
                hbb_id: hbbId,
                type: 'story',
                content: caption,
                photo_url: publicUrl,
            })
            .select()
            .single()

        if (error) return { error: 'Could not create story.' }
        setPosts([data, ...posts])

        const { data: hbbData } = await supabase
            .from('hbb_profiles')
            .select('name')
            .eq('id', hbbId)
            .single()

        await notifyFollowers(
            hbbId,
            'story',
            `${hbbData?.name || 'A business you follow'} posted a new story.`
        )

        return { success: true }
    }

    const deletePost = async (postId) => {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId)

        if (error) return { error: 'Could not delete post.' }
        setPosts(posts.filter(p => p.id !== postId))
        return { success: true }
    }

    return { posts, loading, error, createAnnouncement, createStory, deletePost }
}

export default useAnnouncements