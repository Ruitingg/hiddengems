import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { usePayment } from '../hooks/usePayment'

const PaymentPage = () => {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const { order, loading, error, simulatePayment } = usePayment(orderId)
    const [paying, setPaying] = useState(false)
    const [payError, setPayError] = useState('')

    const handlePay = async () => {
        setPaying(true)
        setPayError('')
        const result = await simulatePayment()
        setPaying(false)

        if (result.error) {
            setPayError(result.error)
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

    if (error || !order) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-400 text-lg">Order not found.</p>
            </div>
        )
    }

    if (order.status !== 'awaiting_payment') {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-6">
                <div className="text-center">
                    <p className="text-gray-400 text-lg mb-2">This order isn't awaiting payment.</p>
                    <button
                        onClick={() => navigate(`/order-status/${orderId}`)}
                        className="text-[#0e6b7a] text-sm font-medium hover:underline"
                    >
                        View order status →
                    </button>
                </div>
            </div>
        )
    }

    const amount = order.final_price ?? 0
    const orderNumber = order.id.slice(0, 8)
    const paynowNumber = order.hbb_profiles?.paynow_number
    const qrValue = `PayNow to ${paynowNumber} for Order #${orderNumber}`

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
                    Payment
                </h1>
                <p className="text-gray-400 text-sm mt-1">{order.hbb_profiles?.name}</p>
            </div>

            <div className="px-6 py-8 max-w-md mx-auto">

                <div className="bg-[#FAFEFE] rounded-2xl p-5 mb-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">{order.products?.name || 'Item'}</span>
                        <span className="text-sm font-medium text-[#2d3748]">${amount}</span>
                    </div>
                    <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                        <span className="text-sm font-semibold text-[#2d3748]">Total</span>
                        <span className="text-lg font-bold text-[#0e6b7a]">${amount}</span>
                    </div>
                </div>

                {paynowNumber ? (
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 flex flex-col items-center">
                        <p className="text-sm font-semibold text-[#2d3748] mb-3">Scan to pay via PayNow</p>
                        <div className="p-3 bg-white border border-gray-100 rounded-xl">
                            <QRCodeSVG value={qrValue} size={180} />
                        </div>
                        <p className="text-xs text-gray-400 mt-3 text-center">
                            PayNow to {paynowNumber}<br/>Order #{orderNumber}
                        </p>
                    </div>
                ) : (
                    <div className="bg-amber-50 border border-amber-100 text-amber-700 text-sm px-4 py-3 rounded-xl mb-6 text-center">
                        This seller hasn't set up PayNow yet.
                    </div>
                )}

                <p className="text-xs text-gray-400 mb-4 text-center">
                    🔒 Simulated payment — confirm below once you've completed payment via PayNow.
                </p>

                {payError && (
                    <div className="mb-4 bg-red-50 border border-red-100 text-red-400 text-sm px-4 py-3 rounded-xl">
                        {payError}
                    </div>
                )}

                <button
                    onClick={handlePay}
                    disabled={paying}
                    className="w-full bg-[#0e6b7a] text-white py-4 rounded-2xl font-semibold hover:bg-[#0a5566] transition cursor-pointer text-base disabled:opacity-50"
                >
                    {paying ? 'Processing...' : `Pay $${amount}`}
                </button>

            </div>
        </div>
    )
}

export default PaymentPage