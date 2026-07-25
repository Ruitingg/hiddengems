import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAnalytics } from '../hooks/useAnalytics'

const AnalyticsPage = () => {
    const navigate = useNavigate()
    const { loading, error, revenueByDate, bestSellers, heatmapByMonth, exportCSV } = useAnalytics()

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

    const hasData = revenueByDate.length > 0

    return (
        <div className="min-h-screen bg-white">

            <div className="bg-[#FAFEFE] px-6 pt-6 pb-6 border-b border-gray-100">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-1 text-gray-400 hover:text-[#0e6b7a] mb-4 text-sm transition"
                >
                    ← Back to Dashboard
                </button>
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-[#2d3748]"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        Analytics
                    </h1>
                    <button
                        onClick={exportCSV}
                        disabled={!hasData}
                        className="bg-[#0e6b7a] text-white px-4 py-2 rounded-full text-sm font-medium disabled:opacity-50"
                    >
                        Export CSV
                    </button>
                </div>
            </div>

            {!hasData ? (
                <p className="text-sm text-gray-400 text-center mt-16">No completed orders yet.</p>
            ) : (
                <div className="px-6 py-8 max-w-3xl mx-auto flex flex-col gap-8">

                    <div>
                        <h2 className="text-sm font-semibold text-[#2d3748] mb-3">Revenue Over Time</h2>
                        <div className="bg-[#FAFEFE] border border-gray-100 rounded-2xl p-4" style={{ height: 260 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueByDate}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="revenue" stroke="#0e6b7a" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-[#2d3748] mb-3">Best Sellers</h2>
                        <div className="bg-[#FAFEFE] border border-gray-100 rounded-2xl p-4" style={{ height: 260 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={bestSellers}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#0e6b7a" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-[#2d3748] mb-3">Orders by Month</h2>
                        <div className="bg-[#FAFEFE] border border-gray-100 rounded-2xl p-4" style={{ height: 260 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={heatmapByMonth}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#f97316" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}

export default AnalyticsPage