import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export const useFavourites = () => {
    const [favouriteIds, setFavouriteIds] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchFavourites = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            setLoading(false)
            return
        }
        const { data } = await supabase
            .from('user_business_relations')
            .select('hbb_id')
            .eq('user_id', session.user.id)
            .eq('is_favourite', true)
        setFavouriteIds((data || []).map((row) => row.hbb_id))
        setLoading(false)
    }

    useEffect(() => {
        fetchFavourites()
    }, [])

    const toggleFavourite = async (hbbId) => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            return { error: 'Please log in to save favourites.' }
        }

        const { data: existing } = await supabase
            .from('user_business_relations')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('hbb_id', hbbId)
            .maybeSingle()

        if (existing) {
            await supabase
                .from('user_business_relations')
                .update({ is_favourite: !existing.is_favourite })
                .eq('id', existing.id)
        } else {
            await supabase
                .from('user_business_relations')
                .insert({ user_id: session.user.id, hbb_id: hbbId, is_favourite: true })
        }

        await fetchFavourites()
        return { success: true }
    }

    return { favouriteIds, loading, toggleFavourite }
}

export const useFollow = (hbbId) => {
    const [isFollowing, setIsFollowing] = useState(false)
    const [loading, setLoading] = useState(true)

    const fetchFollowStatus = async () => {
        if (!hbbId) return
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            setLoading(false)
            return
        }
        const { data } = await supabase
            .from('user_business_relations')
            .select('is_following')
            .eq('user_id', session.user.id)
            .eq('hbb_id', hbbId)
            .maybeSingle()
        setIsFollowing(data?.is_following || false)
        setLoading(false)
    }

    useEffect(() => {
        fetchFollowStatus()
    }, [hbbId])

    const toggleFollow = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            return { error: 'Please log in to follow businesses.' }
        }

        const { data: existing } = await supabase
            .from('user_business_relations')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('hbb_id', hbbId)
            .maybeSingle()

        if (existing) {
            await supabase
                .from('user_business_relations')
                .update({ is_following: !existing.is_following })
                .eq('id', existing.id)
        } else {
            await supabase
                .from('user_business_relations')
                .insert({ user_id: session.user.id, hbb_id: hbbId, is_following: true })
        }

        await fetchFollowStatus()
        return { success: true }
    }

    return { isFollowing, loading, toggleFollow }
} 