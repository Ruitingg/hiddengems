import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export const usePortfolio = (hbbId) => {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchItems = async () => {
        if (!hbbId) return
        const { data } = await supabase
            .from('portfolio_items')
            .select('*')
            .eq('hbb_id', hbbId)
            .order('created_at', { ascending: false })
        setItems(data || [])
        setLoading(false)
    }

    useEffect(() => {
        fetchItems()
    }, [hbbId])

    const uploadPhoto = async (file, caption) => {
        if (!file || !hbbId) {
            return { error: 'Missing file or business.' }
        }

        const filePath = `${hbbId}/${Date.now()}_${file.name}`

        const { error: uploadError } = await supabase.storage
            .from('portfolio-photos')
            .upload(filePath, file)

        if (uploadError) {
            return { error: 'Could not upload photo. Please try again.' }
        }

        const { data: urlData } = supabase.storage
            .from('portfolio-photos')
            .getPublicUrl(filePath)

        const { error: insertError } = await supabase
            .from('portfolio_items')
            .insert({
                hbb_id: hbbId,
                photo_url: urlData.publicUrl,
                caption: caption || '',
            })

        if (insertError) {
            return { error: 'Photo uploaded but could not be saved. Please try again.' }
        }

        await fetchItems()
        return { success: true }
    }

    const deleteItem = async (itemId) => {
        await supabase
            .from('portfolio_items')
            .delete()
            .eq('id', itemId)
        await fetchItems()
    }

    return { items, loading, uploadPhoto, deleteItem }
}
