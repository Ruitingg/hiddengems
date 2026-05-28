import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

const ProfilePage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [hbb, setHbb] = useState(null)
    const [products, setProducts] = useState([])
    const [portfolio, setPortfolio] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const { data: hbbData } = await supabase
                .from('hbb_profiles')
                .select('*')
                .eq('id', id)
                .single()

            const { data: productsData } = await supabase
                .from('products')
                .select('*')
                .eq('hbb_id', id)

            const { data: portfolioData } = await supabase
                .from('portfolio_items')
                .select('*')
                .eq('hbb_id', id)

            setHbb(hbbData)
            setProducts(productsData || [])
            setPortfolio(portfolioData || [])
            setLoading(false)
        }
        fetchData()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-[#184b44] text-lg font-semibold">Loading...</p>
            </div>
        )
    }

    if (!hbb) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-500 text-lg">404 — Business not found.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">

            {/* Green header banner */}
            <div className="bg-[#184b44] px-6 pt-6 pb-8">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-1 text-green-200 hover:text-white mb-4 text-sm transition"
                >
                    ← Back
                </button>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-white text-2xl font-bold mb-2"
                            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            {hbb.name}
                        </h1>
                        <div className="flex gap-2 flex-wrap">
                            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                                {hbb.category}
                            </span>
                            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                                {hbb.area}
                            </span>
                            {hbb.verified && (
                                <span className="bg-white text-[#184b44] text-xs px-3 py-1 rounded-full font-medium">
                                    ✓ Verified
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-green-200 text-xs mb-1">Charm Score</p>
                        <p className="text-white font-bold text-lg">
                            💎 {hbb.charm_score > 0 ? hbb.charm_score : 'New'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-6 py-6 max-w-3xl mx-auto">

                {/* Description */}
                <div className="mb-6">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">About</h2>
                    <p className="text-gray-700 text-sm leading-relaxed">{hbb.description}</p>
                </div>

                {/* Contact & Socials */}
                <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Contact & Socials</h2>
                    <div className="flex flex-col gap-2 text-sm text-gray-700">
                        <span>📸 Instagram: @placeholder_instagram</span>
                        <span>🎵 TikTok: @placeholder_tiktok</span>
                        <span>💬 WhatsApp: +65 0000 0000</span>
                    </div>
                </div>

                {/* Portfolio */}
                <div className="mb-6">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Portfolio</h2>
                    {portfolio.length === 0 ? (
                        <div className="w-full h-32 bg-gray-100 rounded-2xl flex items-center justify-center">
                            <p className="text-sm text-gray-400">No photos yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {portfolio.map((item) => (
                                <div key={item.id}>
                                    <img src={item.photo_url} alt={item.caption}
                                        className="w-full h-40 object-cover rounded-2xl" />
                                    <p className="text-xs text-gray-400 mt-1">{item.caption}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Products */}
                <div className="mb-6">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Menu / Products</h2>
                    {products.length === 0 ? (
                        <p className="text-sm text-gray-400">No products listed yet.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {products.map((product) => (
                                <div key={product.id}
                                    className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex justify-between items-center shadow-sm">
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                                        <p className="text-xs text-gray-400">{product.description}</p>
                                    </div>
                                    <p className="text-[#184b44] font-bold text-sm">${product.price}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reviews */}
                <div className="mb-8">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Reviews</h2>
                    <p className="text-sm text-gray-400">No reviews yet. Be the first to order!</p>
                </div>

                {/* Order button */}
                <button className="w-full bg-[#184b44] text-white py-4 rounded-2xl font-semibold hover:bg-[#0f3330] transition cursor-pointer text-base">
                    Order Now
                </button>

            </div>
        </div>
    )
}

export default ProfilePage