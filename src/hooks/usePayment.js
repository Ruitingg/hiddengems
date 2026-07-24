import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export const usePayment = (orderId) => {
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!orderId) return

        const fetchOrder = async () => {
            const { data, error: fetchError } = await supabase
                .from('orders')
                .select('*, products(name, price), hbb_profiles(name)')
                .eq('id', orderId)
                .single()

            if (fetchError || !data) {
                setError('Order not found.')
            } else {
                setOrder(data)
            }
            setLoading(false)
        }

        fetchOrder()
    }, [orderId])

    const simulatePayment = async () => {
        const { error: payError } = await supabase
            .from('orders')
            .update({ status: 'paid', updated_at: new Date().toISOString() })
            .eq('id', orderId)

        if (payError) {
            return { error: 'Payment could not be processed. Please try again.' }
        }

        setOrder((prev) => ({ ...prev, status: 'paid' }))
        return { success: true }
    }

    return { order, loading, error, simulatePayment }
}