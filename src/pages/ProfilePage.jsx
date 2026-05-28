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
            <div className="min-h-screen bg-[#ede1d2] flex items-center justify-center">
                <p className="text-[#184b44] text-lg font-semibold">Loading...</p>
            </div>
        )
    }

    if (!hbb) {
        return (
            <div className="min-h-screen bg-[#ede1d2] flex items-center justify-center">
                <p className="text-[#184b44] text-lg font-semibold">404 — Business not found.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#ede1d2] px-6 py-8 max-w-3xl mx-auto">

            {/* Back button */}
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1 text-[#184b44] hover:text-[#284771] mb-6 text-sm font-medium transition"
            >
                ← Back
            </button>

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h1 className="text-3xl font-bold text-[#184b44]"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        {hbb.name}
                    </h1>
                    {hbb.verified && (
                        <span className="text-xs text-white bg-[#284771] px-3 py-1 rounded-full">
                            ✓ Verified
                        </span>
                    )}
                </div>

                {/* Tags */}
                <div className="flex gap-2 mb-3">
                    <span className="bg-[#e3d1bd] text-[#184b44] text-xs px-3 py-1 rounded-full">
                        {hbb.category}
                    </span>
                    <span className="bg-[#e3d1bd] text-[#184b44] text-xs px-3 py-1 rounded-full">
                        {hbb.area}
                    </span>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">{hbb.description}</p>

                {/* Contact & Socials */}
                <div className="mt-4 p-4 bg-white rounded-xl shadow-sm">
                    <h3 className="font-semibold text-[#184b44] text-sm mb-2">Contact & Socials</h3>
                    <div className="flex flex-col gap-1 text-sm text-gray-600">
                        <span>📸 Instagram: @placeholder_instagram</span>
                        <span>🎵 TikTok: @placeholder_tiktok</span>
                        <span>💬 WhatsApp: +65 0000 0000</span>
                    </div>
                </div>
            </div>

            {/* Portfolio gallery */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-[#184b44] mb-3"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Portfolio
                </h2>
                {portfolio.length === 0 ? (
                    <div className="w-full h-32 bg-[#e3d1bd] rounded-xl flex items-center justify-center">
                        <p className="text-sm text-gray-500">No photos yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {portfolio.map((item) => (
                            <div key={item.id} className="rounded-xl overflow-visible">
                                <img src={item.photo_url} alt={item.caption}
                                    className="w-full h-40 object-cover rounded-xl" />
                                <p className="text-xs text-gray-500 mt-1 break-words">{item.caption}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Products */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-[#184b44] mb-3"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Menu / Products
                </h2>
                {products.length === 0 ? (
                    <p className="text-sm text-gray-500">No products listed yet.</p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {products.map((product) => (
                            <div key={product.id}
                                className="bg-white rounded-xl px-4 py-3 flex justify-between items-center shadow-sm">
                                <div>
                                    <p className="font-medium text-[#184b44] text-sm">{product.name}</p>
                                    <p className="text-xs text-gray-500">{product.description}</p>
                                </div>
                                <p className="text-[#284771] font-bold text-sm">${product.price}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Reviews placeholder */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-[#184b44] mb-3"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Reviews
                </h2>
                <p className="text-sm text-gray-500">
                    No reviews yet. Be the first to order!
                </p>
            </div>

            {/* Order button */}
            <button className="w-full bg-[#184b44] text-white py-3 rounded-full font-medium hover:bg-[#284771] transition cursor-pointer">
                Order Now
            </button>

        </div>
    )
}

export default ProfilePage