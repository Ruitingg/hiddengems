import React from 'react'
import { useNavigate } from 'react-router-dom'

const DashboardPage = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-[#FAFEFE] px-6 pt-8 pb-10 border-b border-gray-100">
                <p className="text-gray-400 text-sm mb-1">Owner Dashboard</p>
                <h1 className="text-[#2d3748] text-2xl font-bold"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Welcome back! 👋
                </h1>
                <p className="text-gray-400 text-sm mt-1">Manage your business below.</p>
            </div>

            <div className="px-6 py-6 max-w-3xl mx-auto">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-4 font-medium">Manage</p>

                <div className="flex flex-col gap-4">

                    <button
                        onClick={() => navigate('/order-dashboard')}
                        className="bg-white rounded-2xl px-6 py-5 border border-gray-100 shadow-sm text-left hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer"
                    >
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-2xl">📦</span>
                            <h2 className="font-bold text-[#2d3748]">Your Orders</h2>
                        </div>
                        <p className="text-sm text-gray-400 ml-9">View quote requests, payments, and confirmed orders</p>
                    </button>

                    <div className="bg-white rounded-2xl px-6 py-5 border border-dashed border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-2xl">🛍️</span>
                            <h2 className="font-bold text-[#2d3748]">Your Products</h2>
                        </div>
                        <p className="text-sm text-gray-400 ml-9">Coming in Milestone 2</p>
                    </div>

                    <div className="bg-white rounded-2xl px-6 py-5 border border-dashed border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-2xl">📊</span>
                            <h2 className="font-bold text-[#2d3748]">Your Analytics</h2>
                        </div>
                        <p className="text-sm text-gray-400 ml-9">Coming in Milestone 3</p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default DashboardPage