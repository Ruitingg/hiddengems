import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import DiamondIcon from '../components/DiamondIcon'
import { useReviewsForHbb } from '../hooks/useReviews'
import { useFollow } from '../hooks/useRelations'

const ProfilePage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [hbb, setHbb] = useState(null)
    const [products, setProducts] = useState([])
    const [portfolio, setPortfolio] = useState([])
    const [stories, setStories] = useState([])
    const [activeStory, setActiveStory] = useState(null)
    const [isOwner, setIsOwner] = useState(false)
    const [loading, setLoading] = useState(true)
    const { reviews, loading: reviewsLoading } = useReviewsForHbb(id)
    const { isFollowing, toggleFollow } = useFollow(id)
    const [followMsg, setFollowMsg] = useState('')

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

            const { data: storiesData } = await supabase
                .from('posts')
                .select('*')
                .eq('hbb_id', id)
                .eq('type', 'story')
                .order('created_at', { ascending: false })

            const { data: { session } } = await supabase.auth.getSession()
            if (session && hbbData && session.user.id === hbbData.owner_id) {
                setIsOwner(true)
            }

            setHbb(hbbData)
            setProducts(productsData || [])
            setPortfolio(portfolioData || [])
            setStories(storiesData || [])
            setLoading(false)
        }
        fetchData()
    }, [id])

    const handleBack = () => {
        navigate(isOwner ? '/dashboard' : '/discover')
    }

    const handleFollowClick = async () => {
        const result = await toggleFollow()
        if (result.error) {
            setFollowMsg(result.error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-[#0e6b7a] text-lg font-semibold">Loading...</p>
            </div>
        )
    }

    if (!hbb) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-400 text-lg">404 — Business not found.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">

            <div className="bg-[#FAFEFE] px-6 pt-6 pb-8 border-b border-gray-100">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-1 text-gray-400 hover:text-[#0e6b7a] mb-4 text-sm transition"
                >
                    ← Back
                </button>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-[#2d3748] text-2xl font-bold mb-2"
                            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            {hbb.name}
                        </h1>
                        <div className="flex gap-2 flex-wrap">
                            <span className="bg-white text-[#374151] text-xs px-3 py-1 rounded-full border border-gray-200">
                                {hbb.category}
                            </span>
                            <span className="bg-white text-[#374151] text-xs px-3 py-1 rounded-full border border-gray-200">
                                {hbb.area}
                            </span>
                            {hbb.verified && (
                                <span className="bg-[#0e6b7a] text-white text-xs px-3 py-1 rounded-full font-medium">
                                    ✓ Verified
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-400 text-xs mb-1">Charm Score</p>
                        <div className="flex items-center justify-end gap-1 text-[#0e6b7a] font-bold text-lg mb-3">
                            <DiamondIcon size={16} color="#0e6b7a" />
                            {hbb.charm_score > 0 ? hbb.charm_score : 'New'}
                        </div>
                        {!isOwner && (
                            <button
                                onClick={handleFollowClick}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                                    isFollowing
                                        ? 'bg-[#0e6b7a] text-white'
                                        : 'bg-white text-[#0e6b7a] border border-[#0e6b7a]'
                                }`}
                            >
                                {isFollowing ? 'Following' : '+ Follow'}
                            </button>
                        )}
                    </div>
                </div>
                {followMsg && (
                    <p className="text-xs text-red-400 mt-2 text-right">{followMsg}</p>
                )}
            </div>

            {stories.length > 0 && (
                <div className="px-6 pt-5 pb-2 border-b border-gray-100">
                    <h2 className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3">Stories</h2>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {stories.map((story) => (
                            <button
                                key={story.id}
                                onClick={() => setActiveStory(story)}
                                className="flex-shrink-0 w-20"
                            >
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#0e6b7a] p-0.5">
                                    <img
                                        src={story.photo_url}
                                        alt={story.content || 'Story'}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>
                                {story.content && (
                                    <p className="text-xs text-gray-400 mt-1 truncate">{story.content}</p>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="px-6 py-6 max-w-3xl mx-auto">

                <div className="mb-6">
                    <h2 className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">About</h2>
                    <p className="text-[#4b5563] text-sm leading-relaxed">{hbb.description}</p>
                </div>

                <div className="mb-6 p-4 bg-[#FAFEFE] rounded-2xl border border-gray-100">
                    <h2 className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3">Contact & Socials</h2>
                    <div className="flex flex-col gap-2 text-sm text-[#374151]">
                        <span>📸 Instagram: @placeholder_instagram</span>
                        <span>🎵 TikTok: @placeholder_tiktok</span>
                        <span>💬 WhatsApp: +65 0000 0000</span>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3">Portfolio</h2>
                    {portfolio.length === 0 ? (
                        <div className="w-full h-32 bg-[#FAFEFE] rounded-2xl flex items-center justify-center border border-gray-100">
                            <p className="text-sm text-gray-300">No photos yet</p>
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

                <div className="mb-6">
                    <h2 className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3">Menu / Products</h2>
                    {products.length === 0 ? (
                        <p className="text-sm text-gray-300">No products listed yet.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {products.map((product) => (
                                <div key={product.id}
                                    className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex justify-between items-center shadow-sm">
                                    <div>
                                        <p className="font-medium text-[#2d3748] text-sm">{product.name}</p>
                                        <p className="text-xs text-gray-400">{product.description}</p>
                                    </div>
                                    <p className="text-[#0e6b7a] font-bold text-sm">${product.price}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mb-8">
                    <h2 className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3">Reviews</h2>
                    {reviewsLoading ? (
                        <p className="text-sm text-gray-300">Loading reviews...</p>
                    ) : reviews.length === 0 ? (
                        <p className="text-sm text-gray-300">No reviews yet. Be the first to order!</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-white rounded-2xl border border-gray-100 px-4 py-3 shadow-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm">
                                            {'⭐'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                        </span>
                                        <span className="text-xs text-gray-400">{review.public_profiles?.username || 'Anonymous'}</span>
                                        
                                    </div>
                                    {review.comment && (
                                        <p className="text-sm text-[#4b5563] mt-1">{review.comment}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={() => navigate(`/order/${id}`)}
                    className="w-full bg-[#0e6b7a] text-white py-4 rounded-2xl font-semibold hover:bg-[#0a5566] transition cursor-pointer text-base"
                >
                    Order Now
                </button>

            </div>

            {activeStory && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center px-6 z-50"
                    onClick={() => setActiveStory(null)}
                >
                    <div className="max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={activeStory.photo_url}
                            alt={activeStory.content || 'Story'}
                            className="w-full rounded-2xl mb-3"
                        />
                        {activeStory.content && (
                            <p className="text-white text-sm text-center">{activeStory.content}</p>
                        )}
                        <button
                            onClick={() => setActiveStory(null)}
                            className="mt-4 mx-auto block text-white/70 text-sm underline"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfilePage