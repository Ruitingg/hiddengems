import React from 'react'

const DashboardPage = () => {
    return (
    <div className="min-h-screen bg-[#ede1d2] px-6 py-8 max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold text-[#184b44] mb-2"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        Owner Dashboard
        </h1>
        <p className="text-gray-500 text-sm mb-8">
        Welcome back! Your full dashboard is coming in Milestone 2.
        </p>

        <div className="grid grid-cols-1 gap-4">

        <div className="bg-white rounded-xl px-6 py-5 shadow-sm border border-dashed border-[#e3d1bd]">
            <h2 className="font-bold text-[#184b44] mb-1">📦 Your Orders</h2>
            <p className="text-sm text-gray-400">Coming in Milestone 2</p>
        </div>

        <div className="bg-white rounded-xl px-6 py-5 shadow-sm border border-dashed border-[#e3d1bd]">
            <h2 className="font-bold text-[#184b44] mb-1">🛍️ Your Products</h2>
            <p className="text-sm text-gray-400">Coming in Milestone 2</p>
        </div>

        <div className="bg-white rounded-xl px-6 py-5 shadow-sm border border-dashed border-[#e3d1bd]">
            <h2 className="font-bold text-[#184b44] mb-1">📊 Your Analytics</h2>
            <p className="text-sm text-gray-400">Coming in Milestone 3</p>
        </div>

        </div>
    </div>
    )
}

export default DashboardPage