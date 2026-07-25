import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HBBCard from '../components/HBBCard'
import { supabase } from '../lib/supabaseClient'
import { useFavourites } from '../hooks/useRelations'

const FavouritesPage = () => {
    const navigate = useNavigate()
    const { favouriteIds, loading: favouritesLoading, toggleFavourite } = useFavourites()
    const [hbbs, setHbbs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFavourites = async () => {
            if (favouritesLoading) return

            if (favouriteIds.length === 0) {
                setHbbs([])
                setLoading(false)
                return
            }

            const { data } = await supabase
                .from('hbb_profiles')
                .select('*')
                .in('id', favouriteIds)

            setHbbs(data || [])
            setLoading(false)
        }
        fetchFavourites()
    }, [favouriteIds, favouritesLoading])

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-[#0e6b7a] text-lg font-semibold">Loading...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-[#FAFEFE] px-6 pt-6 pb-6 border-b border-gray-100">
                <button
                    onClick={() => navigate('/discover')}
                    className="flex items-center gap-1 text-gray-400 hover:text-[#0e6b7a] mb-4 text-sm transition"
                >
                    ← Back
                </button>
                <h1 className="text-2xl font-bold text-[#2d3748]"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    My Favourites
                </h1>
            </div>

            <div className="px-6 py-6">
                {hbbs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-16">
                        <p className="text-3xl mb-3">🤍</p>
                        <p className="text-gray-400 text-sm text-center">
                            No favourites yet.<br/>Tap the heart on a business to save it here.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {hbbs.map((hbb) => (
                            <HBBCard
                                key={hbb.id}
                                hbb={hbb}
                                isFavourite={favouriteIds.includes(hbb.id)}
                                onToggleFavourite={toggleFavourite}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default FavouritesPage