import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

const useOwnerProfile = () => {
    const { session } = useAuth()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from('hbb_profiles')
                .select('*')
                .eq('owner_id', session.user.id)
                .single()

            if (error) {
                setError('Could not load profile.')
            } else {
                setProfile(data)
            }
            setLoading(false)
        }

        if (session) fetchProfile()
    }, [session])

    const updateProfile = async (updates) => {
        const { error } = await supabase
            .from('hbb_profiles')
            .update(updates)
            .eq('owner_id', session.user.id)

        if (error) return { error: 'Could not update profile.' }
        setProfile({ ...profile, ...updates })
        return { success: true }
    }

    return { profile, loading, error, updateProfile }
}

export default useOwnerProfile