import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useOrderStatus } from '../hooks/useOrderStatus'
import { useSubmitReview } from '../hooks/useReviews'
import { supabase } from '../lib/supabaseClient'

const ReviewPage = () => {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const { order, loading } = useOrderStatus(orderId)
    const { submitReview } = useSubmitReview()

    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (rating === 0) {
            setError('Please select a star rating.')
            return
        }

        setSubmitting(true)

        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            setError('Please log in to leave a review.')
            setSubmitting(false)
            return
        }

        const result = await submitReview({
            orderId,
            hbbId: order.hbb_id,
            customerId: session.user.id,
            rating,
            comment,
        })

        setSubmitting(false)

        if (result.error) {
            setError(result.error)
        } else {
            navigate(`/order-status/${orderId}`)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-[#0e6b7a] text-lg font-semibold">Loading...</p>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-400 text-lg">Order not found.</p>
            </div>
        )
    }

    if (order.status !== 'completed') {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-6">
                <p className="text-gray-400 text-lg text-center">
                    You can leave a review once this order is marked as completed.
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">

            <div className="bg-[#FAFEFE] px-6 pt-6 pb-6 border-b border-gray-100">
                <button
                    onClick={() => navigate(`/order-status/${orderId}`)}
                    className="flex items-center gap-1 text-gray-400 hover:text-[#0e6b7a] mb-4 text-sm transition"
                >
                    ← Back
                </button>
                <h1 className="text-[#2d3748] text-xl font-bold"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Leave a Review
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-8 max-w-md mx-auto">

                <div className="mb-6 text-center">
                    <p className="text-sm text-gray-400 mb-3">How was your experience?</p>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="text-3xl transition"
                            >
                                {star <= rating ? '⭐' : '☆'}
                            </button>
                        ))}
                    </div>
                </div>

                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell others about your experience (optional)"
                    rows={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a] resize-none mb-4"
                />

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-100 text-red-400 text-sm px-4 py-3 rounded-xl">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#0e6b7a] text-white py-4 rounded-2xl font-semibold hover:bg-[#0a5566] transition cursor-pointer text-base disabled:opacity-50"
                >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    )
}

export default ReviewPage