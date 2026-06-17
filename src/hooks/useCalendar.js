import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const useCalendar = (hbbId) => {
    const [slots, setSlots] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchSlots = async () => {
            const { data, error } = await supabase
                .from('availability')
                .select('*')
                .eq('hbb_id', hbbId)
                .order('date', { ascending: true })

            if (error) {
                setError('Could not load slots.')
            } else {
                setSlots(data)
            }
            setLoading(false)
        }

        if (hbbId) fetchSlots()
    }, [hbbId])

    const createBatch = async (dateTimes, releaseTime, colourTag, notes) => {
        if (dateTimes.length === 0) {
            return { error: 'Add at least one date and time.' }
        }

        const { data: batch, error: batchError } = await supabase
            .from('slot_batches')
            .insert({
                hbb_id: hbbId,
                release_time: releaseTime,
                status: 'scheduled',
                colour_tag: colourTag,
                notes: notes,
            })
            .select()
            .single()

        if (batchError) {
            return { error: 'Could not create batch.' }
        }

        const newSlots = dateTimes.map((dt) => ({
            hbb_id: hbbId,
            batch_id: batch.id,
            date: dt.date,
            start_time: dt.time,
            status: 'pending_release',
        }))

        const { data: insertedSlots, error: slotsError } = await supabase
            .from('availability')
            .insert(newSlots)
            .select()

        if (slotsError) {
            return { error: 'Batch created but slots could not be added.' }
        }

        setSlots([...slots, ...insertedSlots])
        return { success: true }
    }

    const toggleSlotStatus = async (slotId, newStatus) => {
        const { error } = await supabase
            .from('availability')
            .update({ status: newStatus })
            .eq('id', slotId)

        if (error) {
            return { error: 'Could not update slot.' }
        }

        setSlots(slots.map((s) => (s.id === slotId ? { ...s, status: newStatus } : s)))
        return { success: true }
    }

    return { slots, loading, error, createBatch, toggleSlotStatus }
}

export default useCalendar