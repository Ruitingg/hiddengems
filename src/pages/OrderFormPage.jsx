import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useOrderForm } from '../hooks/useOrderForm'
import { supabase } from '../lib/supabaseClient'

const OrderFormPage = () => {
    const { hbbId } = useParams()
    const navigate = useNavigate()
    const { products, businessProfile, loading, error, checkLeadTime, createOrder } = useOrderForm(hbbId)

    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [selectedProductId, setSelectedProductId] = useState(null)
    const [notes, setNotes] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [leadTimeWarning, setLeadTimeWarning] = useState(false)

    const selectedProduct = products.find((p) => p.id === selectedProductId)

    const handleDateChange = (date) => {
        setSelectedDate(date)
        if (selectedProduct && date) {
            const ok = checkLeadTime(date, selectedProduct)
            setLeadTimeWarning(!ok)
        }
    }

    const handleProductSelect = (product) => {
        setSelectedProductId(product.id)
        if (selectedDate) {
            const ok = checkLeadTime(selectedDate, product)
            setLeadTimeWarning(!ok)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitError('')

        if (!selectedProductId) {
            setSubmitError('Please select an item to order.')
            return
        }
        if (!selectedDate || !selectedTime) {
            setSubmitError('Please select a date and time.')
            return
        }
        if (leadTimeWarning) {
            setSubmitError('This date does not meet the lead time required. Please pick a later date.')
            return
        }

        setSubmitting(true)

        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            setSubmitError('Please log in to place an order.')
            setSubmitting(false)
            return
        }

        const result = await createOrder({
            slotDate: selectedDate,
            slotTime: selectedTime,
            hbbId,
            productIds: [selectedProductId],
            pricingType: selectedProduct.pricing_type || 'fixed',
            notes,
            customerId: session.user.id,
        })

        setSubmitting(false)

        if (result.error) {
            setSubmitError(result.error)
        } else {
            navigate(`/order-status/${result.orderId}`)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-[#0e6b7a] text-lg font-semibold">Loading...</p>
            </div>
        )
    }

    if (error || !businessProfile) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-400 text-lg">Could not load this business.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">

            <div className="bg-[#FAFEFE] px-6 pt-6 pb-6 border-b border-gray-100">
                <button
                    onClick={() => navigate(`/profile/${hbbId}`)}
                    className="flex items-center gap-1 text-gray-400 hover:text-[#0e6b7a] mb-4 text-sm transition"
                >
                    ← Back
                </button>
                <h1 className="text-[#2d3748] text-xl font-bold"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Order from {businessProfile.name}
                </h1>
                <p className="text-gray-400 text-sm mt-1">{businessProfile.category} · {businessProfile.area}</p>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6 max-w-3xl mx-auto">

                <div className="mb-6">
                    <h2 className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3">Select Date & Time</h2>
                    <p className="text-xs text-gray-400 mb-3">
                        ⚠️ Temporary picker — will be replaced by the availability calendar.
                    </p>
                    <div className="flex gap-3">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a]"
                        />
                        <input
                            type="time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a]"
                        />
                    </div>

                    {leadTimeWarning && (
                        <div className="mt-3 bg-amber-50 border border-amber-100 text-amber-700 text-sm px-4 py-3 rounded-xl">
                            ⚠️ This date doesn't give the business enough notice. Please pick a later date.
                        </div>
                    )}
                    {!leadTimeWarning && selectedDate && selectedProductId && (
                        <div className="mt-3 bg-green-50 border border-green-100 text-green-700 text-sm px-4 py-3 rounded-xl">
                            ✓ This slot works — no rush!
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <h2 className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3">Select an Item</h2>
                    {products.length === 0 ? (
                        <p className="text-sm text-gray-400">This business hasn't listed any items yet.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {products.map((product) => (
                                <label
                                    key={product.id}
                                    className={`flex items-center justify-between border rounded-2xl px-4 py-3 cursor-pointer transition ${
                                        selectedProductId === product.id
                                            ? 'border-[#0e6b7a] bg-[#FAFEFE]'
                                            : 'border-gray-100 bg-white hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="product"
                                            checked={selectedProductId === product.id}
                                            onChange={() => handleProductSelect(product)}
                                            className="accent-[#0e6b7a]"
                                        />
                                        <div>
                                            <p className="font-medium text-[#2d3748] text-sm">{product.name}</p>
                                            <p className="text-xs text-gray-400">{product.description}</p>
                                        </div>
                                    </div>
                                    <p className="text-[#0e6b7a] font-bold text-sm">
                                        {product.pricing_type === 'quote' ? 'Quote on request' : `$${product.price}`}
                                    </p>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <h2 className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3">Notes for the Seller</h2>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Anything else the seller should know?"
                        rows={4}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a] resize-none"
                    />
                </div>

                {submitError && (
                    <div className="mb-4 bg-red-50 border border-red-100 text-red-400 text-sm px-4 py-3 rounded-xl">
                        {submitError}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#0e6b7a] text-white py-4 rounded-2xl font-semibold hover:bg-[#0a5566] transition cursor-pointer text-base disabled:opacity-50"
                >
                    {submitting ? 'Submitting...' : 'Submit Order'}
                </button>

            </form>
        </div>
    )
}

export default OrderFormPage