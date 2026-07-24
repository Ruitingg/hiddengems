import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useOrderStatus } from '../hooks/useOrderStatus'
import useSlotCancellation from '../hooks/useSlotCancellation'

const STEPS = ['pending', 'awaiting_payment', 'paid', 'confirmed', 'completed']

const STEP_LABELS = {
    pending: 'Pending',
    awaiting_payment: 'Awaiting Payment',
    paid: 'Confirmed Payment',
    confirmed: 'Confirmed',
    completed: 'Completed',
}

const OrderStatusPage = () => {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const { order, loading } = useOrderStatus(orderId)
    const { cancelSlot, loading: cancelling } = useSlotCancellation()
    const [showCancelForm, setShowCancelForm] = useState(false)
    const [cancelReason, setCancelReason] = useState('')
    const [cancelError, setCancelError] = useState('')

    const handleCancelOrder = async () => {
        setCancelError('')

        if (!cancelReason.trim()) {
            setCancelError('Please provide a reason for cancellation.')
            return
        }

        const result = await cancelSlot(order.slot_id, cancelReason)
        if (result.error) {
            setCancelError(result.error)
            return
        }

        setShowCancelForm(false)
        setCancelReason('')
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

    const isCancelled = order.status === 'cancelled'
    const isCompleted = order.status === 'completed'
    const currentStepIndex = STEPS.indexOf(order.status)

    return (
        <div className="min-h-screen bg-white">

            <div className="bg-[#FAFEFE] px-6 pt-6 pb-6 border-b border-gray-100">
                <button
                    onClick={() => navigate('/discover')}
                    className="flex items-center gap-1 text-gray-400 hover:text-[#0e6b7a] mb-4 text-sm transition"
                >
                    ← Back
                </button>
                <h1 className="text-[#2d3748] text-xl font-bold"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Order Status
                </h1>
                <p className="text-gray-400 text-sm mt-1">Order #{order.id.slice(0, 8)}</p>
            </div>

            <div className="px-6 py-8 max-w-md mx-auto">

                {isCancelled ? (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
                        <p className="text-red-500 font-bold text-lg mb-2">❌ Order Cancelled</p>
                        {order.cancellation_reason && (
                            <p className="text-red-400 text-sm">{order.cancellation_reason}</p>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-0 mb-6">
                            {STEPS.map((step, index) => {
                                const isComplete = index < currentStepIndex
                                const isCurrent = index === currentStepIndex

                                return (
                                    <div key={step} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                isComplete || isCurrent
                                                    ? 'bg-[#0e6b7a] text-white'
                                                    : 'bg-gray-100 text-gray-400'
                                            }`}>
                                                {isComplete ? '✓' : index + 1}
                                            </div>
                                            {index < STEPS.length - 1 && (
                                                <div className={`w-0.5 flex-1 my-1 ${
                                                    isComplete ? 'bg-[#0e6b7a]' : 'bg-gray-100'
                                                }`} style={{ minHeight: '32px' }} />
                                            )}
                                        </div>

                                        <div className="pb-8">
                                            <p className={`font-semibold text-sm ${
                                                isCurrent ? 'text-[#0e6b7a]' : isComplete ? 'text-[#2d3748]' : 'text-gray-400'
                                            }`}>
                                                {STEP_LABELS[step]}
                                            </p>
                                            {isCurrent && (
                                                <p className="text-xs text-gray-400 mt-1">In progress</p>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {order.status === 'awaiting_payment' && (
                            <button
                                onClick={() => navigate(`/payment/${orderId}`)}
                                className="w-full bg-[#0e6b7a] text-white py-4 rounded-2xl font-semibold hover:bg-[#0a5566] transition cursor-pointer text-base"
                            >
                                Pay ${order.final_price ?? 0}
                            </button>
                        )}

                        {order.status === 'completed' && (
                            <button
                                onClick={() => navigate(`/review/${orderId}`)}
                                className="w-full bg-[#0e6b7a] text-white py-4 rounded-2xl font-semibold hover:bg-[#0a5566] transition cursor-pointer text-base"
                            >
                                ⭐ Leave a Review
                            </button>
                        )}

                        {!isCompleted && (
                            <button
                                onClick={() => setShowCancelForm(true)}
                                className="w-full mt-3 text-red-500 text-sm font-medium underline"
                            >
                                Cancel Order
                            </button>
                        )}
                    </>
                )}

            </div>

            {showCancelForm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-6 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
                        <h2 className="font-bold text-[#2d3748] mb-2">Cancel this order?</h2>
                        <p className="text-sm text-gray-400 mb-4">This cannot be undone.</p>

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
                                    setShowCancelForm(false)
                                    setCancelReason('')
                                    setCancelError('')
                                }}
                                className="flex-1 bg-[#FAFEFE] border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                disabled={cancelling}
                                className="flex-1 bg-red-500 text-white py-3 rounded-xl text-sm font-medium disabled:opacity-50"
                            >
                                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default OrderStatusPage