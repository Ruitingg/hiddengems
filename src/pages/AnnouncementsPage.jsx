import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import useOwnerProfile from '../hooks/useOwnerProfile'
import useAnnouncements from '../hooks/useAnnouncements'

const CATEGORIES = ['Promo', 'Slot Release', 'Important']

const AnnouncementsPage = () => {
    const navigate = useNavigate()
    const { profile, loading: profileLoading } = useOwnerProfile()
    const { posts, loading, error, createAnnouncement, createStory, deletePost } = useAnnouncements(profile?.id)

    const [activeTab, setActiveTab] = useState('Announcement')
    const [content, setContent] = useState('')
    const [category, setCategory] = useState('Promo')
    const [imageFile, setImageFile] = useState(null)
    const [caption, setCaption] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState('')

    if (profileLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-[#0e6b7a] text-lg font-semibold">Loading...</p>
            </div>
        )
    }

    if (!profile) {
        return <Navigate to="/setup" />
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')
        setSubmitting(true)

        let result

        if (activeTab === 'Announcement') {
            if (!content.trim()) {
                setFormError('Please write something to post.')
                setSubmitting(false)
                return
            }
            result = await createAnnouncement(profile.id, content, category)
        } else {
            if (!imageFile) {
                setFormError('Please select an image.')
                setSubmitting(false)
                return
            }
            result = await createStory(profile.id, caption, imageFile)
        }

        setSubmitting(false)

        if (result.error) {
            setFormError(result.error)
            return
        }

        setContent('')
        setCaption('')
        setImageFile(null)
    }

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
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-1 text-gray-400 hover:text-[#0e6b7a] mb-4 text-sm transition"
                >
                    ← Back to Dashboard
                </button>
                <h1 className="text-2xl font-bold text-[#2d3748]"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Announcements & Stories
                </h1>
            </div>

            <div className="px-6 pt-4 max-w-lg mx-auto">
                <div className="flex gap-2 mb-6">
                    {['Announcement', 'Story'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                activeTab === tab
                                    ? 'bg-[#0e6b7a] text-white'
                                    : 'bg-[#FAFEFE] text-[#374151] border border-gray-100'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
                    {activeTab === 'Announcement' && (
                        <>
                            <div className="flex gap-2 flex-wrap">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setCategory(cat)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium border ${
                                            category === cat
                                                ? 'bg-[#0e6b7a] text-white border-[#0e6b7a]'
                                                : 'bg-white text-gray-500 border-gray-200'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            <textarea
                                placeholder="What's the update?"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={4}
                                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a] bg-white resize-none"
                            />
                        </>
                    )}

                    {activeTab === 'Story' && (
                        <>
                            <div
                                className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer"
                                onClick={() => document.getElementById('story-upload').click()}
                            >
                                {imageFile ? (
                                    <img
                                        src={URL.createObjectURL(imageFile)}
                                        alt="preview"
                                        className="w-full h-48 object-cover rounded-xl"
                                    />
                                ) : (
                                    <>
                                        <p className="text-2xl mb-2">📷</p>
                                        <p className="text-sm text-gray-400">Tap to add a photo</p>
                                    </>
                                )}
                                <input
                                    id="story-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                />
                            </div>
                            <textarea
                                placeholder="Caption (optional)"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                rows={2}
                                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a] bg-white resize-none"
                            />
                        </>
                    )}

                    {formError && (
                        <div className="bg-red-50 border border-red-100 text-red-400 text-sm px-4 py-3 rounded-xl">
                            {formError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-[#0e6b7a] text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
                    >
                        {submitting ? 'Posting...' : 'Post'}
                    </button>
                </form>

                <h2 className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3">Previous Posts</h2>

                {posts.length === 0 ? (
                    <p className="text-sm text-gray-300">No posts yet.</p>
                ) : (
                    <div className="flex flex-col gap-3 pb-10">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                        post.type === 'story'
                                            ? 'bg-purple-100 text-purple-600'
                                            : 'bg-[#FAFEFE] text-[#374151] border border-gray-100'
                                    }`}>
                                        {post.type === 'story' ? 'Story' : post.category || 'Announcement'}
                                    </span>
                                    <button
                                        onClick={() => deletePost(post.id)}
                                        className="text-xs text-red-400 underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                                {post.photo_url && (
                                    <img
                                        src={post.photo_url}
                                        alt="story"
                                        className="w-full h-40 object-cover rounded-xl mb-2"
                                    />
                                )}
                                {post.content && (
                                    <p className="text-sm text-[#4b5563]">{post.content}</p>
                                )}
                                <p className="text-xs text-gray-300 mt-2">
                                    {new Date(post.created_at).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AnnouncementsPage