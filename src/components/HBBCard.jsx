import React from 'react'

const HBBCard = ({ hbb }) => {
    return (
        <div className="bg-[#ede1d2] rounded-2xl shadow-md p-4 hover:shadow-lg transition cursor-pointer">
    
        {/* Placeholder image */}
        <div className="w-full h-40 bg-[#e3d1bd] rounded-xl mb-3 flex items-center justify-center">
        <span className="text-[#184b44] text-sm">No photo yet</span>
        </div>

        {/* HBB Name */}
        <h3 className="font-bold text-[#184b44] text-lg mb-1" 
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {hbb.name}
        </h3>

        {/* Category and Area tags */}
        <div className="flex gap-2 mb-2">
        <span className="bg-[#e3d1bd] text-[#184b44] text-xs px-3 py-1 rounded-full">
            {hbb.category}
        </span>
        <span className="bg-[#e3d1bd] text-[#184b44] text-xs px-3 py-1 rounded-full">
            {hbb.area}
        </span>
        </div>

      {/* Verified badge */}
        {hbb.verified && (
        <span className="text-xs text-white bg-[#284771] px-2 py-1 rounded-full">
            ✓ Verified
        </span>
        )}

    </div>
    )
}

export default HBBCard