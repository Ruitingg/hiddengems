import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

export const useOrderDashboard = () => {
    const { session } = useAuth()
    const [hbbId, setHbbId] = useState(null)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!session) return

        const fetchData = async () => {
            setLoading(true)

            const { data: hbbProfile, error: hbbError } = await supabase
                .from('hbb_profiles')
                .select('id')
                .eq('owner_id', session.user.id)
                .single()

            if (hbbError || !hbbProfile) {
                setError('No business profile found for this account.')
                setLoading(false)
                return
            }

            setHbbId(hbbProfile.id)

            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*, products(name, description, price), users(email)')
                .eq('hbb_id', hbbProfile.id)