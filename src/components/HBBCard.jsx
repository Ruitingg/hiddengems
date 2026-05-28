import React from 'react'
import { Link } from 'react-router-dom'

const HBBCard = ({ hbb }) => {
    return (
        <Link to={`/profile/${hbb.id}`} className="block">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden">

                {/* Image area */}
                <div className="w-full h-44 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No photo yet</span>
                </div>

                {/* Card content */}
                <div className="p-4">

                    {/* Name + verified */}
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-base"
                            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            {hbb.name}
                        </h3>
                        {hbb.verified && (
                            <span className="text-xs text-white bg-[#184b44] px-2 py-0.5 rounded-full">
                                ✓
                            </span>
                        )}
                    </div>

                    {/* Category + Area tags */}
                    <div className="flex gap-2 mb-3">
                        <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                            {hbb.category}
                        </span>
                        <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                            {hbb.area}
                        </span>
                    </div>

                    {/* Charm score */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#184b44]">
                            💎 {hbb.charm_score > 0 ? hbb.charm_score : 'New'}
                        </span>
                        <span className="text-xs text-[#184b44] font-medium">View →</span>
                    </div>

                </div>
            </div>
        </Link>
    )
}

export default HBBCard