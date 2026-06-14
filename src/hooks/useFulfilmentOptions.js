import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const FULFILMENT_OPTIONS = ['self_collection', 'delivery', 'mailing', 'meetup']

const useFulfilmentOptions = (hbbId) => {
    const [options, setOptions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchOptions = async () => {
            if (!hbbId) return
            const { data, error } = await supabase
                .from('business_order_options')
                .select('*')
                .eq('hbb_id', hbbId)

            if (error) {
                setError('Could not load fulfilment options.')
            } else {
                setOptions(data)
            }
            setLoading(false)
        }

        fetchOptions()
    }, [hbbId])

    const enableOption = async (optionValue, extraFee = 0) => {
        if (!FULFILMENT_OPTIONS.includes(optionValue)) {
            return { error: 'Invalid fulfilment option.' }
        }

        const already = options.find(o => o.option_value === optionValue)
        if (already) return { error: 'Option already enabled.' }

        const { data, error } = await supabase
            .from('business_order_options')
            .insert({
                hbb_id: hbbId,
                option_type: 'fulfilment_method',
                option_value: optionValue,
                extra_fee: extraFee,
            })
            .select()
            .single()

        if (error) return { error: 'Could not enable option.' }
        setOptions([...options, data])
        return { success: true }
    }

    const updateFee = async (optionId, extraFee) => {
        const { error } = await supabase
            .from('business_order_options')
            .update({ extra_fee: extraFee })
            .eq('id', optionId)

        if (error) return { error: 'Could not update fee.' }
        setOptions(options.map(o => o.id === optionId ? { ...o, extra_fee: extraFee } : o))
        return { success: true }
    }

    const disableOption = async (optionId) => {
        const { error } = await supabase
            .from('business_order_options')
            .delete()
            .eq('id', optionId)

        if (error) return { error: 'Could not disable option.' }
        setOptions(options.filter(o => o.id !== optionId))
        return { success: true }
    }

    return { options, loading, error, enableOption, updateFee, disableOption, FULFILMENT_OPTIONS }
}

export default useFulfilmentOptions