import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

const useMenu = (hbbId) => {
    const { session } = useAuth()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchItems = async () => {
            if (!hbbId) return
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('hbb_id', hbbId)
                .order('created_at', { ascending: true })

            if (error) {
                setError('Could not load menu items.')
            } else {
                setItems(data)
            }
            setLoading(false)
        }

        fetchItems()
    }, [hbbId])

    const addItem = async (item) => {
        if (!item.name || !item.pricing_type) {
            return { error: 'Name and pricing type are required.' }
        }
        if (item.pricing_type === 'fixed' && !item.price) {
            return { error: 'Price is required for fixed price items.' }
        }

        const { data, error } = await supabase
            .from('products')
            .insert({
                hbb_id: hbbId,
                name: item.name,
                description: item.description || '',
                pricing_type: item.pricing_type,
                price: item.pricing_type === 'fixed' ? item.price : null,
                lead_time_days: item.lead_time_days || null,
            })
            .select()
            .single()

        if (error) return { error: 'Could not add item.' }
        setItems([...items, data])
        return { success: true }
    }

    const updateItem = async (itemId, updates) => {
        if (updates.pricing_type === 'fixed' && !updates.price) {
            return { error: 'Price is required for fixed price items.' }
        }
        if (updates.pricing_type === 'quote') {
            updates.price = null
        }

        const { error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', itemId)

        if (error) return { error: 'Could not update item.' }
        setItems(items.map(i => i.id === itemId ? { ...i, ...updates } : i))
        return { success: true }
    }

    const deleteItem = async (itemId) => {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', itemId)

        if (error) return { error: 'Could not delete item.' }
        setItems(items.filter(i => i.id !== itemId))
        return { success: true }
    }

    return { items, loading, error, addItem, updateItem, deleteItem }
}

export default useMenu