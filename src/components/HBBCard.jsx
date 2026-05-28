import React from 'react'
import { Link } from 'react-router-dom'
import DiamondIcon from './DiamondIcon'

const HBBCard = ({ hbb }) => {
    return (
        <Link to={`/profile/${hbb.id}`} className="block">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden">

                <div className="w-full h-44 bg-[#FAFEFE] flex items-center justify-center">
                    <span className="text-gray-300 text-sm">No photo yet</span>
                </div>

                <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-[#2d3748] text-base"
                            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            {hbb.name}
                        </h3>
                        {hbb.verified && (
                            <span className="text-xs text-white bg-[#0e6b7a] px-2 py-0.5 rounded-full">
                                ✓
                            </span>
                        )}
                    </div>

                    <div className="flex gap-2 mb-3">
                        <span className="bg-[#FAFEFE] text-[#374151] text-xs px-3 py-1 rounded-full border border-gray-100">
                            {hbb.category}
                        </span>
                        <span className="bg-[#FAFEFE] text-[#374151] text-xs px-3 py-1 rounded-full border border-gray-100">
                            {hbb.area}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm font-medium text-[#0e6b7a]">
                            <DiamondIcon size={13} color="#0e6b7a" />
                            {hbb.charm_score > 0 ? hbb.charm_score : 'New'}
                        </span>
                        <span className="text-xs text-gray-300 font-medium">View →</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default HBBCard