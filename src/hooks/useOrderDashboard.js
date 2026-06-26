import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

export const useOrderDashboard = () => {
    const { session } = useAuth()
    const [hbbId, setHbbId] = useState(null)
    const [quoteRequests, setQuoteRequests] = useState([])
    const [awaitingPayment, setAwaitingPayment] = useState([])
    const [confirmedOrCompleted, setConfirmedOrCompleted] = useState([])    
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchData = async () => {
            if (!session) return
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
        .order('created_at', { ascending: false })

    if (ordersError) {
        setError('Could not load orders.')
        setLoading(false)
        return
    }

    const orders = ordersData || []
    setQuoteRequests(orders.filter(o => o.pricing_type === 'quote' && o.status === 'pending'))
    setAwaitingPayment(orders.filter(o => o.status === 'awaiting_payment'))
    setConfirmedOrCompleted(orders.filter(o => o.status === 'paid' || o.status === 'confirmed' || o.status === 'completed'))
    setLoading(false)
}

    useEffect(() => {
        fetchData()
    }, [session])

    const sendQuote = async (orderId, finalPrice) => {
        const { error } = await supabase
            .from('orders')
            .update({ final_price: finalPrice, status: 'awaiting_payment' })
            .eq('id', orderId)

        if (error) return { error: 'Could not send quote.' }
        await fetchData()
        return { success: true }
    }

    const refreshOrders = () => fetchData()

    return { hbbId, quoteRequests, awaitingPayment, confirmedOrCompleted, loading, error, sendQuote, refreshOrders }
}