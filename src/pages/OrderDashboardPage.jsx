import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrderDashboard } from '../hooks/useOrderDashboard'
import { supabase } from '../lib/supabaseClient'
import useSlotCancellation from '../hooks/useSlotCancellation'

const TABS = [
    { key: 'quotes', label: 'Quote Requests' },
    { key: 'awaiting', label: 'Awaiting Payment' },
    { key: 'confirmed', label: 'Confirmed' },
]

const OrderDashboardPage = () => {
    const navigate = useNavigate()
    const { loading, error, quoteRequests, awaitingPayment, confirmedOrCompleted, sendQuote, refreshOrders } = useOrderDashboard()
    const { cancelSlot, loading: cancelling } = useSlotCancellation()
    const [activeTab, setActiveTab] = useState('quotes')
    const [quoteInputs, setQuoteInputs] = useState({})
    const [sendingId, setSendingId] = useState(null)
    const [completingId, setCompletingId] = useState(null)
    const [cancellingOrder, setCancellingOrder] = useState(null)
    const [cancelReason, setCancelReason] = useState('')
    const [cancelError, setCancelError] = useState('')

    const handleQuoteChange = (orderId, value) => {
        setQuoteInputs((prev) => ({ ...prev, [orderId]: value }))
    }

    const handleSendQuote = async (orderId) => {
        const price = parseFloat(quoteInputs[orderId])
        if (!price || price <= 0) return

        setSendingId(orderId)
        await sendQuote(orderId, price)
        setSendingId(null)
    }

    const handleMarkCompleted = async (order) => {
        setCompletingId(order.id)

        await supabase
            .from('orders')
            .update({ status: 'completed' })
            .eq('id', order.id)

        const amountSpent = order.final_price ?? order.products?.price ?? 0
        const pointsToAward = Math.round(amountSpent)

        const { data: existingPoints } = await supabase
            .from('points')
            .select('*')
            .eq('user_id', order.customer_id)
            .single()

        if (existingPoints) {
            await supabase
                .from('points')
                .update({ balance: existingPoints.balance + pointsToAward })
                .eq('user_id', order.customer_id)
        } else {
            await supabase
                .from('points')
                .insert({ user_id: order.customer_id, balance: pointsToAward })
        }

        setCompletingId(null)
        if (refreshOrders) refreshOrders()
        window.location.reload()
    }

    const handleCancelOrder = async () => {
        setCancelError('')

        if (!cancelReason.trim()) {
            setCancelError('Please provide a reason for cancellation.')
            return
        }

        const result = await cancelSlot(cancellingOrder.slot_id, cancelReason)
        if (result.error) {
            setCancelError(result.error)
            return
        }

        setCancellingOrder(null)
        setCancelReason('')
        if (refreshOrders) refreshOrders()
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-[#0e6b7a] text-lg font-semibold">Loading...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-400 text-lg">{error}</p>
            </div>
        )
    }

    const listForTab = {
        quotes: quoteRequests,
        awaiting: awaitingPayment,
        confirmed: confirmedOrCompleted,
    }[activeTab]

    return (
        <div className="min-h-screen bg-white">

            <div className="bg-[#FAFEFE] px-6 pt-6 pb-6 border-b border-gray-100">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-1 text-gray-400 hover:text-[#0e6b7a] mb-4 text-sm transition"
                >
                    ← Back to Dashboard
                </button>
                <h1 className="text-[#2d3748] text-xl font-bold"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Orders
                </h1>
            </div>

            <div className="px-6 pt-4">
                <div className="flex gap-2 mb-6 flex-wrap">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                activeTab === tab.key
                                    ? 'bg-[#0e6b7a] text-white'
                                    : 'bg-[#FAFEFE] text-[#374151] border border-gray-100'
                            }`}
                        >
                            {tab.label} ({
                                tab.key === 'quotes' ? quoteRequests.length :
                                tab.key === 'awaiting' ? awaitingPayment.length :
                                confirmedOrCompleted.length
                            })
                        </button>
                    ))}
                </div>

                {listForTab.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center mt-10">No orders in this category yet.</p>
                ) : (
                    <div className="flex flex-col gap-3 pb-10">
                        {listForTab.map((order) => (
                            <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-semibold text-[#2d3748] text-sm">
                                            {order.products?.name || 'Item'}
                                        </p>
                                        <p className="text-xs text-gray-400">Order #{order.id.slice(0, 8)}</p>
                                    </div>
                                    <p className="text-xs text-gray-400">#{order.id.slice(0, 8)}</p>
                                </div>

                                {order.order_notes && (
                                    <p className="text-xs text-gray-500 mb-2">📝 {order.order_notes}</p>
                                )}

                                {activeTab === 'quotes' && (
                                    <div className="flex gap-2 mt-3">
                                        <input
                                            type="number"
                                            placeholder="Quote price ($)"
                                            value={quoteInputs[order.id] || ''}
                                            onChange={(e) => handleQuoteChange(order.id, e.target.value)}
                                            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0e6b7a]"
                                        />
                                        <button
                                            onClick={() => handleSendQuote(order.id)}
                                            disabled={sendingId === order.id}
                                            className="bg-[#0e6b7a] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#0a5566] transition disabled:opacity-50"
                                        >
                                            {sendingId === order.id ? 'Sending...' : 'Send Quote'}
                                        </button>
                                    </div>
                                )}

                                {activeTab === 'awaiting' && (
                                    <div className="bg-[#FAFEFE] rounded-xl px-3 py-2 mt-2">
                                        <p className="text-sm font-semibold text-[#0e6b7a]">
                                            Quoted: ${order.final_price}
                                        </p>
                                        <p className="text-xs text-gray-400">Waiting for customer payment</p>
                                    </div>
                                )}

                                {activeTab === 'confirmed' && (
                                    <div className="mt-2">
                                        <div className="bg-green-50 rounded-xl px-3 py-2 mb-2">
                                            <p className="text-sm font-semibold text-green-600 capitalize">
                                                {order.status}
                                            </p>
                                        </div>
                                        {order.status === 'paid' && (
                                            <button
                                                onClick={() => handleMarkCompleted(order)}
                                                disabled={completingId === order.id}
                                                className="w-full bg-[#0e6b7a] text-white py-2 rounded-xl text-sm font-medium hover:bg-[#0a5566] transition disabled:opacity-50"
                                            >
                                                {completingId === order.id ? 'Completing...' : 'Mark as Completed'}
                                            </button>
                                        )}
                                    </div>
                                )}

                                {order.status !== 'completed' && order.status !== 'cancelled' && (
                                    <button
                                        onClick={() => setCancellingOrder(order)}
                                        className="w-full mt-3 text-red-500 text-xs font-medium underline"
                                    >
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {cancellingOrder && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-6 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
                        <h2 className="font-bold text-[#2d3748] mb-2">Cancel this order?</h2>
                        <p className="text-sm text-gray-400 mb-4">
                            Order #{cancellingOrder.id.slice(0, 8)}
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
                                    setCancellingOrder(null)
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

export default OrderDashboardPage