import React from 'react'
import { Link } from 'react-router-dom'

const HBBCard = ({ hbb }) => {
    return (
    <Link to={`/profile/${hbb.id}`} className="block">
        <div className="bg-[#ede1d2] rounded-2xl shadow-md p-4 hover:shadow-lg hover:bg-[#e3d1bd] hover:-translate-y-1 hover:border hover:border-[#184b44] transition-all duration-200 cursor-pointer">

        {/* Placeholder image */}
        <div className="w-full h-40 bg-[#e3d1bd] rounded-xl mb-3 flex items-center justify-center">
            <span className="text-[#184b44] text-sm">No photo yet</span>
        </div>

        {/* HBB Name + Verified badge on same line */}
        <div className="flex items-center gap-1 mb-1">
            <h3 className="font-bold text-[#184b44] text-lg"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {hbb.name}
            </h3>
            {hbb.verified && (
            <span className="text-xs text-white bg-[#284771] px-2 py-1 rounded-full">
                ✓ Verified
            </span>
)}
        </div>

        {/* Category and Area tags */}
        <div className="flex gap-2">
            <span className="bg-[#e3d1bd] text-[#184b44] text-xs px-3 py-1 rounded-full">
            {hbb.category}
            </span>
            <span className="bg-[#e3d1bd] text-[#184b44] text-xs px-3 py-1 rounded-full">
            {hbb.area}
            </span>
        </div>

        </div>
    </Link>
    )
}

export default HBBCard