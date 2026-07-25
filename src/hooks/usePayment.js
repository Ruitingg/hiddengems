import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export const usePayment = (orderId) => {
    const [order, setOrder] = useState(null)
    const [gemBalance, setGemBalance] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!orderId) return

        const fetchOrder = async () => {
            const { data, error: fetchError } = await supabase
                .from('orders')
                .select('*, products(name, price), hbb_profiles(name, paynow_number, gem_redemption_gems, gem_redemption_value)')
                .eq('id', orderId)
                .single()

            if (fetchError || !data) {
                setError('Order not found.')
                setLoading(false)
                return
            }

            setOrder(data)

            const { data: pointsData } = await supabase
                .from('points')
                .select('balance')
                .eq('user_id', data.customer_id)
                .maybeSingle()

            setGemBalance(pointsData?.balance ?? 0)
            setLoading(false)
        }

        fetchOrder()
    }, [orderId])

    const simulatePayment = async (gemsRedeemed) => {
        const { error: payError } = await supabase
            .from('orders')
            .update({ status: 'paid', updated_at: new Date().toISOString() })
            .eq('id', orderId)

        if (payError) {
            return { error: 'Payment could not be processed. Please try again.' }
        }

        if (gemsRedeemed > 0) {
            const { error: pointsError } = await supabase
                .from('points')
                .update({ balance: gemBalance - gemsRedeemed })
                .eq('user_id', order.customer_id)

            if (pointsError) {
                return { error: 'Payment processed, but gem balance could not be updated.' }
            }

            setGemBalance(gemBalance - gemsRedeemed)
        }

        setOrder((prev) => ({ ...prev, status: 'paid' }))
        return { success: true }
    }

    return { order, gemBalance, loading, error, simulatePayment }
}