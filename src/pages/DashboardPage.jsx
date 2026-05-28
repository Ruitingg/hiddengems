import React from 'react'

const DashboardPage = () => {
    return (
        <div className="min-h-screen bg-white">

            {/* Green header */}
            <div className="bg-[#184b44] px-6 pt-8 pb-10">
                <p className="text-green-200 text-sm mb-1">Owner Dashboard</p>
                <h1 className="text-white text-2xl font-bold"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Welcome back! 👋
                </h1>
                <p className="text-green-200 text-sm mt-1">
                    Your full dashboard is coming in Milestone 2.
                </p>
            </div>

            <div className="px-6 py-6 max-w-3xl mx-auto">

                <p className="text-xs text-gray-400 uppercase tracking-wider mb-4 font-medium">Coming Soon</p>

                <div className="flex flex-col gap-4">

                    <div className="bg-white rounded-2xl px-6 py-5 border border-gray-100 shadow-sm border-dashed">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-2xl">📦</span>
                            <h2 className="font-bold text-gray-900">Your Orders</h2>
                        </div>
                        <p className="text-sm text-gray-400 ml-9">Coming in Milestone 2</p>
                    </div>

                    <div className="bg-white rounded-2xl px-6 py-5 border border-gray-100 shadow-sm border-dashed">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-2xl">🛍️</span>
                            <h2 className="font-bold text-gray-900">Your Products</h2>
                        </div>
                        <p className="text-sm text-gray-400 ml-9">Coming in Milestone 2</p>
                    </div>

                    <div className="bg-white rounded-2xl px-6 py-5 border border-gray-100 shadow-sm border-dashed">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-2xl">📊</span>
                            <h2 className="font-bold text-gray-900">Your Analytics</h2>
                        </div>
                        <p className="text-sm text-gray-400 ml-9">Coming in Milestone 3</p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default DashboardPage