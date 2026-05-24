import React from 'react'
import HBBCard from '../components/HBBCard'

const DiscoveryPage = () => {
    const hbbs = [
        { id: 1, name: "Aunty Linda's Kueh", category: "Food", area: "Tampines", verified: true },
        { id: 2, name: "Mel's Cakes", category: "Food", area: "Bishan", verified: false },
        { id: 3, name: "Pastel Nails by Jo", category: "Beauty", area: "Jurong West", verified: true },
    ]

    return (
        <div className="min-h-screen bg-[#ede1d2] px-6 py-8">

      {/* Page title */}
        <h1 className="text-3xl font-bold text-[#184b44] mb-6"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        Discover Hidden Gems 💎
        </h1>

      {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hbbs.map((hbb) => (
            <HBBCard key={hbb.id} hbb={hbb} />
        ))}
        </div>

    </div>
    )
}

export default DiscoveryPage