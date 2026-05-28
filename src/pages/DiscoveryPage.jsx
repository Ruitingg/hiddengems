import { useState, useEffect } from 'react'
import HBBCard from '../components/HBBCard'
import { supabase } from '../lib/supabaseClient'

const categories = ['All', 'Food', 'Beauty', 'Crafts']
const areas = ['All Areas', 'Tampines', 'Bishan', 'Jurong West', 'Ang Mo Kio', 'Clementi', 'Tiong Bahru']

const DiscoveryPage = () => {
    const [hbbs, setHbbs] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState('All')
    const [activeArea, setActiveArea] = useState('All Areas')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const fetchHBBs = async () => {
            const { data, error } = await supabase
                .from('hbb_profiles')
                .select('*')

            if (error) {
                console.log('Error fetching HBBs:', error)
            } else {
                setHbbs(data)
            }
            setLoading(false)
        }

        fetchHBBs()
    }, [])

    const filteredHBBs = hbbs.filter((hbb) => {
        const categoryMatch = activeCategory === 'All' || hbb.category === activeCategory
        const areaMatch = activeArea === 'All Areas' || hbb.area === activeArea
        const searchMatch = hbb.name.toLowerCase().includes(searchQuery.toLowerCase())
        return categoryMatch && areaMatch && searchMatch
    })

    if (loading) {
        return (
            <div className="min-h-screen bg-[#ede1d2] flex items-center justify-center">
                <p className="text-[#184b44] text-lg font-semibold">Loading...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#ede1d2] px-6 py-8">

            <h1 className="text-3xl font-bold text-[#184b44] mb-6"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Discover Hidden Gems 💎
            </h1>

            {/* Search bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search businesses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-[#184b44] rounded-full text-sm text-[#184b44] bg-white focus:outline-none focus:ring-2 focus:ring-[#184b44] placeholder-gray-400"
                />
            </div>

            {/* Category filter buttons */}
            <div className="flex gap-2 mb-4 flex-wrap">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                            activeCategory === cat
                                ? 'bg-[#184b44] text-white'
                                : 'bg-white text-[#184b44] border border-[#184b44]'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Area dropdown */}
            <div className="mb-6 relative inline-block">
                <select
                    value={activeArea}
                    onChange={(e) => setActiveArea(e.target.value)}
                    className="appearance-none bg-white text-[#184b44] border border-[#184b44] rounded-full px-4 py-2 pr-8 text-sm font-medium"
                >
                    {areas.map((area) => (
                        <option key={area} value={area}>{area}</option>
                    ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#184b44] text-xs">▼</span>
            </div>

            {/* Empty state */}
            {filteredHBBs.length === 0 ? (
                <p className="text-[#184b44] text-center mt-10">
                    No HBBs found in this category and area. Try a different filter.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredHBBs.map((hbb) => (
                        <HBBCard key={hbb.id} hbb={hbb} />
                    ))}
                </div>
            )}

        </div>
    )
}

export default DiscoveryPage