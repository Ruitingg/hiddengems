import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export const useOrderForm = (hbbId) => {
    const [products, setProducts] = useState([])
    const [businessProfile, setBusinessProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!hbbId) return

        const fetchData = async () => {
            setLoading(true)

            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*')
                .eq('hbb_id', hbbId)

            const { data: profileData, error: profileError } = await supabase
                .from('hbb_profiles')
                .select('*')
                .eq('id', hbbId)
                .single()

            if (productsError || profileError) {
                setError('Could not load order details.')
            } else {
                setProducts(productsData || [])
                setBusinessProfile(profileData)
            }
            setLoading(false)
        }

        fetchData()
    }, [hbbId])

    const checkLeadTime = (slotDate, product) => {
        const leadTimeDays = product.lead_time_days ?? businessProfile?.lead_time_days ?? 0
        const today = new Date()
        const slot = new Date(slotDate)
        const daysUntilSlot = (slot - today) / (1000 * 60 * 60 * 24)
        return daysUntilSlot >= leadTimeDays
    }

    const createOrder = async ({ slotDate, slotTime, hbbId, productIds, pricingType, notes, customerId }) => {
        const { data: slot, error: slotError } = await supabase
            .from('availability')
            .select('id')
            .eq('hbb_id', hbbId)
            .eq('date', slotDate)
            .eq('start_time', slotTime)
            .eq('status', 'available')
            .maybeSingle()

        if (slotError || !slot) {
            return { error: 'This slot is no longer available.' }
        }

        const initialStatus = pricingType === 'fixed' ? 'awaiting_payment' : 'pending'

        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                customer_id: customerId,
                hbb_id: hbbId,
                slot_id: slot.id,
                product_id: productIds[0],
                pricing_type: pricingType,
                status: initialStatus,
                order_notes: notes,
            })
            .select()
            .single()

            if (orderError) {
            return { error: 'Could not place order. Please try again.' }
        }

        return { success: true, orderId: order.id }
    }

    return { products, businessProfile, loading, error, checkLeadTime, createOrder }
}