import { useParams, useNavigate } from 'react-router-dom'
import { useOrderStatus } from '../hooks/useOrderStatus'

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
                    </>
                )}

            </div>
        </div>
    )
}

export default OrderStatusPage