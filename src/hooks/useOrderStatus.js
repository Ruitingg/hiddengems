import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export const useOrderStatus = (orderId) => {
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!orderId) return

        const fetchOrder = async () => {
            const { data } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single()
            setOrder(data)
            setLoading(false)
        }

        fetchOrder()

        const channel = supabase
            .channel(`order-${orderId}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'orders',
                filter: `id=eq.${orderId}`
            }, (payload) => {
                setOrder(payload.new)
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [orderId])

    return { order, loading }
}