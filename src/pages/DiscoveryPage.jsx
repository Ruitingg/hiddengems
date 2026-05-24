import { useState, useEffect } from 'react'
import HBBCard from '../components/HBBCard'
import { supabase } from '../lib/supabaseClient'

const DiscoveryPage = () => {
    const [hbbs, setHbbs] = useState([])
    const [loading, setLoading] = useState(true)

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hbbs.map((hbb) => (
            <HBBCard key={hbb.id} hbb={hbb} />
        ))}
        </div>

    </div>
    )
}

export default DiscoveryPage