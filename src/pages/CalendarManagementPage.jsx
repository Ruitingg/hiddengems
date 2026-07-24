import { useState } from 'react'
import useCalendar from '../hooks/useCalendar'
import useOwnerProfile from '../hooks/useOwnerProfile'
import { Navigate, useNavigate } from 'react-router-dom'
import useSlotCancellation from '../hooks/useSlotCancellation'

const colourOptions = ['#0e6b7a', '#f97316', '#a855f7', '#22c55e', '#ef4444']

const CalendarManagementPage = () => {
    const navigate = useNavigate()
    const { profile, loading: profileLoading } = useOwnerProfile()
    const { slots, loading, error, createBatch, toggleSlotStatus } = useCalendar(profile?.id)
    const { cancelSlot, loading: cancellationLoading } = useSlotCancellation()
    const [cancellingSlot, setCancellingSlot] = useState(null)
    const [cancelReason, setCancelReason] = useState('')
    const [cancelError, setCancelError] = useState('')

    const [showForm, setShowForm] = useState(false)
    const [dateTimes, setDateTimes] = useState([{ date: '', time: '' }])
    const [releaseTime, setReleaseTime] = useState('')
    const [colourTag, setColourTag] = useState(colourOptions[0])
    const [notes, setNotes] = useState('')
    const [formError, setFormError] = useState('')

    const addDateTimeRow = () => {
        setDateTimes([...dateTimes, { date: '', time: '' }])
    }

    const updateDateTimeRow = (index, field, value) => {
        const updated = [...dateTimes]
        updated[index][field] = value
        setDateTimes(updated)
    }

    const handleCreateBatch = async (e) => {
        e.preventDefault()
        setFormError('')

        const validDateTimes = dateTimes.filter((dt) => dt.date && dt.time)
        if (validDateTimes.length === 0) {
            setFormError('Please add at least one valid date and time.')
            return
    }

    if (!releaseTime) {
        setFormError('Please set a release time.')
        return
    }

    const releaseTimeUTC = new Date(releaseTime).toISOString()

    const result = await createBatch(validDateTimes, releaseTimeUTC, colourTag, notes)
    if (result.error) {
        setFormError(result.error)
        return
    }

    setShowForm(false)
    setDateTimes([{ date: '', time: '' }])
    setReleaseTime('')
    setNotes('')
}

    const handleCancelSlot = async () => {
        setCancelError('')

        if (!cancelReason.trim()) {
            setCancelError('Please provide a reason for cancellation.')
            return
        }

        const result = await cancelSlot(cancellingSlot.id, cancelReason)
        if (result.error) {
            setCancelError(result.error)
            return
        }

        setCancellingSlot(null)
        setCancelReason('')
        window.location.reload()
    }

    if (profileLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-[#0e6b7a] text-lg font-semibold">Loading...</p>
            </div>
        )
    }

    if (!profile) {
        return <Navigate to="/setup" />
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-[#0e6b7a] text-lg font-semibold">Loading...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white px-6 py-8 max-w-2xl mx-auto">
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1 text-gray-400 hover:text-[#0e6b7a] mb-4 text-sm transition"
            >
                ← Back to Dashboard
            </button>

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-[#2d3748]"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Manage Availability
                </h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-[#0e6b7a] text-white px-4 py-2 rounded-full text-sm font-medium"
                >
                    + Create Batch
                </button>
            </div>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            {showForm && (
                <form onSubmit={handleCreateBatch} className="bg-[#FAFEFE] border border-gray-100 rounded-2xl p-5 mb-6 flex flex-col gap-4">
                    {formError && (
                        <div className="bg-red-50 border border-red-100 text-red-400 text-sm px-4 py-3 rounded-xl">
                            {formError}
                        </div>
                    )}

                    <div>
                        <label className="text-xs text-gray-400 mb-2 block">Dates and times</label>
                        {dateTimes.map((dt, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="date"
                                    value={dt.date}
                                    onChange={(e) => updateDateTimeRow(index, 'date', e.target.value)}
                                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm flex-1"
                                />
                                <input
                                    type="time"
                                    value={dt.time}
                                    onChange={(e) => updateDateTimeRow(index, 'time', e.target.value)}
                                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm flex-1"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addDateTimeRow}
                            className="text-[#0e6b7a] text-sm font-medium mt-1"
                        >
                            + Add another time slot
                        </button>
                    </div>

                    <div>
                        <label className="text-xs text-gray-400 mb-2 block">Release slots at</label>
                        <input
                            type="datetime-local"
                            value={releaseTime}
                            onChange={(e) => setReleaseTime(e.target.value)}
                            className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-full"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-gray-400 mb-2 block">Colour tag</label>
                        <div className="flex gap-2">
                            {colourOptions.map((colour) => (
                                <button
                                    key={colour}
                                    type="button"
                                    onClick={() => setColourTag(colour)}
                                    className="w-8 h-8 rounded-full border-2"
                                    style={{
                                        backgroundColor: colour,
                                        borderColor: colourTag === colour ? '#2d3748' : 'transparent',
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <textarea
                        placeholder="Notes (optional, e.g. Holiday Special)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        className="border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none"
                    />

                    <button
                        type="submit"
                        className="bg-[#0e6b7a] text-white py-3 rounded-xl text-sm font-semibold"
                    >
                        Create Batch
                    </button>
                </form>
            )}

            <div className="flex flex-col gap-2">
                {slots.map((slot) => {
                    let colour = 'bg-[#0e6b7a] text-white'
                    let label = 'Available'

                    if (slot.status === 'pending_release') {
                        colour = 'bg-gray-100 text-gray-400'
                        label = 'Pending release'
                    } else if (slot.status === 'booked') {
                        colour = 'bg-gray-200 text-gray-600'
                        label = 'Booked'
                    } else if (slot.status === 'cancelled_reopened') {
                        colour = 'bg-orange-400 text-white'
                        label = 'Reopened'
                    }

                    return (
                        <div key={slot.id} className={`px-4 py-3 rounded-xl flex items-center justify-between ${colour}`}>
                            <span className="text-sm font-medium">
                                {slot.date} · {slot.start_time} · {label}
                            </span>
                            {slot.status !== 'pending_release' && slot.status !== 'cancelled_reopened' && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => toggleSlotStatus(slot.id, slot.status === 'available' ? 'booked' : 'available')}
                                        className="text-xs underline"
                                    >
                                        Mark as {slot.status === 'available' ? 'Booked' : 'Available'}
                                    </button>
                                    {slot.status === 'booked' && (
                                        <button
                                            onClick={() => setCancellingSlot(slot)}
                                            className="text-xs underline text-red-500"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {cancellingSlot && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-6 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
                        <h2 className="font-bold text-[#2d3748] mb-2">Cancel this slot?</h2>
                        <p className="text-sm text-gray-400 mb-4">
                            {cancellingSlot.date} · {cancellingSlot.start_time}
                        </p>

                        {cancelError && (
                            <div className="bg-red-50 border border-red-100 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
                                {cancelError}
                            </div>
                        )}

                        <textarea
                            placeholder="Reason for cancellation"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            rows={3}
                            className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-full mb-4 resize-none"
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setCancellingSlot(null)
                                    setCancelReason('')
                                    setCancelError('')
                                }}
                                className="flex-1 bg-[#FAFEFE] border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={handleCancelSlot}
                                disabled={cancellationLoading}
                                className="flex-1 bg-red-500 text-white py-3 rounded-xl text-sm font-medium disabled:opacity-50"
                            >
                                {cancellationLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CalendarManagementPage