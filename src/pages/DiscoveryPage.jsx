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
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-[#184b44] text-lg font-semibold">Loading...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">

            {/* Hero banner */}
            <div className="bg-[#184b44] px-6 pt-8 pb-10">
                <p className="text-green-200 text-sm mb-1">Singapore</p>
                <h1 className="text-white text-2xl font-bold mb-1"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Discover Hidden Gems 💎
                </h1>
                <p className="text-green-200 text-sm mb-5">Support local home-based businesses</p>

                {/* Search bar inside hero */}
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Search businesses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#184b44] placeholder-gray-400"
                    />
                </div>
            </div>

            <div className="px-6 py-6">

                {/* Category filter buttons */}
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">Category</p>
                <div className="flex gap-2 mb-5 flex-wrap">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                activeCategory === cat
                                    ? 'bg-[#184b44] text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Area dropdown */}
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">Area</p>
                <div className="mb-6 relative inline-block">
                    <select
                        value={activeArea}
                        onChange={(e) => setActiveArea(e.target.value)}
                        className="appearance-none bg-gray-100 text-gray-700 rounded-full px-4 py-2 pr-8 text-sm font-medium focus:outline-none"
                    >
                        {areas.map((area) => (
                            <option key={area} value={area}>{area}</option>
                        ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">▼</span>
                </div>

                {/* Empty state */}
                {filteredHBBs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-16">
                        <p className="text-4xl mb-3">🔍</p>
                        <p className="text-gray-500 text-sm text-center">
                            No businesses found.<br/>Try a different filter or search.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredHBBs.map((hbb) => (
                            <HBBCard key={hbb.id} hbb={hbb} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default DiscoveryPage