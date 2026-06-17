import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const useSlotCancellation = () => {
    const [loading, setLoading] = useState(false)

    const cancelSlot = async (slotId, reason) => {
        setLoading(true)

        const { error } = await supabase.rpc('cancel_slot_and_order', {
            p_slot_id: slotId,
            p_reason: reason,
        })

        setLoading(false)

        if (error) {
            return { error: 'Could not cancel this slot. ' + error.message }
        }

        return { success: true }
    }

    return { cancelSlot, loading }
}

export default useSlotCancellation