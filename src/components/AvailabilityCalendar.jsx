import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const AvailabilityCalendar = ({ hbbId, onSelectSlot }) => {
    const [slots, setSlots] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState(null)

    useEffect(() => {
        const fetchSlots = async () => {
            const { data, error } = await supabase
                .from('availability')
                .select('*')
                .eq('hbb_id', hbbId)
                .in('status', ['available', 'booked', 'cancelled_reopened'])
                .order('date', { ascending: true })

            if (error) {
                console.log('Error fetching slots:', error)
            } else {
                setSlots(data)
            }
            setLoading(false)
        }

        if (hbbId) fetchSlots()
    }, [hbbId])

    if (loading) {
        return <p className="text-sm text-gray-300">Loading availability...</p>
    }

    if (slots.length === 0) {
        return <p className="text-sm text-gray-300">No availability posted yet.</p>
    }

    const dates = []
    slots.forEach((slot) => {
        if (!dates.includes(slot.date)) dates.push(slot.date)
    })

    const slotsForDate = slots.filter((slot) => slot.date === selectedDate)

    return (
        <div>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                {dates.map((date) => (
                    <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border ${
                            selectedDate === date
                                ? 'bg-[#0e6b7a] text-white border-[#0e6b7a]'
                                : 'bg-white text-[#374151] border-gray-200'
                        }`}
                    >
                        {new Date(date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}
                    </button>
                ))}
            </div>

            {selectedDate && (
                <div className="flex gap-2 flex-wrap">
                    {slotsForDate.map((slot) => {
                        let colour = 'bg-[#0e6b7a] text-white'
                        let label = 'Available'

                        if (slot.status === 'booked') {
                            colour = 'bg-gray-200 text-gray-400'
                            label = 'Booked'
                        } else if (slot.status === 'cancelled_reopened') {
                            colour = 'bg-orange-400 text-white'
                            label = 'Reopened'
                        }

                        return (
                            <button
                                key={slot.id}
                                disabled={slot.status === 'booked'}
                                onClick={() => onSelectSlot && onSelectSlot(slot)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium ${colour} ${
                                    slot.status === 'booked' ? 'cursor-not-allowed' : 'cursor-pointer'
                                }`}
                            >
                                {slot.start_time} · {label}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default AvailabilityCalendar