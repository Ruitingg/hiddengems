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
        const