import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import useOwnerProfile from '../hooks/useOwnerProfile'
import useMenu from '../hooks/useMenu'
import useFulfilmentOptions from '../hooks/useFulfilmentOptions'
import { usePortfolio } from '../hooks/usePortfolio'

const TABS = ['Profile', 'Menu', 'Fulfilment', 'Portfolio']

const FULFILMENT_LABELS = {
    self_collection: 'Self Collection',
    delivery: 'Delivery',
    mailing: 'Mailing',
    meetup: 'Meetup',
}

const ManageBusinessPage = () => {
    const navigate = useNavigate()
    const { profile, loading: profileLoading, updateProfile } = useOwnerProfile()
    const { items, addItem, deleteItem } = useMenu(profile?.id)
    const { options, enableOption, updateFee, disableOption, FULFILMENT_OPTIONS } = useFulfilmentOptions(profile?.id)
    const { items: portfolioItems, uploadPhoto, deleteItem: deletePortfolioItem } = usePortfolio(profile?.id)

    const [activeTab, setActiveTab] = useState('Profile')

    const [profileForm, setProfileForm] = useState(null)
    const [profileSaving, setProfileSaving] = useState(false)
    const [profileMsg, setProfileMsg] = useState('')

    const [showAddItem, setShowAddItem] = useState(false)
    const [newItem, setNewItem] = useState({ name: '', description: '', pricing_type: 'fixed', price: '', lead_time_days: '' })
    const [itemError, setItemError] = useState('')

    const [feeInputs, setFeeInputs] = useState({})
    const [feeSaving, setFeeSaving] = useState(null)

    const [portfolioFile, setPortfolioFile] = useState(null)
    const [portfolioCaption, setPortfolioCaption] = useState('')
    const [portfolioUploading, setPortfolioUploading] = useState(false)
    const [portfolioError, setPortfolioError] = useState('')

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

    const currentForm = profileForm !== null ? profileForm : profile

    const handleProfileChange = (e) => {
        setProfileForm({ ...(profileForm !== null ? profileForm : profile), [e.target.name]: e.target.value })
    }

    const handleProfileSave = async (e) => {
        e.preventDefault()
        if (!profileForm) return
        setProfileSaving(true)
        setProfileMsg('')
        const result = await updateProfile(profileForm)
        setProfileSaving(false)
        setProfileMsg(result.error ? result.error : 'Saved!')
    }

    const handleAddItem = async (e) => {
        e.preventDefault()
        setItemError('')
        const result = await addItem({
            ...newItem,
            price: newItem.price ? parseFloat(newItem.price) : null,
            lead_time_days: newItem.lead_time_days ? parseInt(newItem.lead_time_days) : null,
        })
        if (result.error) {
            setItemError(result.error)
            return
        }
        setNewItem({ name: '', description: '', pricing_type: 'fixed', price: '', lead_time_days: '' })
        setShowAddItem(false)
    }

    const handleToggleFulfilment = async (optionValue) => {
        const existing = options.find(o => o.option_value === optionValue)
        if (existing) {
            await disableOption(existing.id)
        } else {
            await enableOption(optionValue, 0)
        }
    }

    const handleFeeUpdate = async (optionId) => {
        setFeeSaving(optionId)
        const fee = feeInputs[optionId]
        if (fee !== undefined) {
            await updateFee(optionId, parseFloat(fee) || 0)
        }
        setFeeSaving(null)
    }

    const handlePortfolioUpload = async (e) => {
        e.preventDefault()
        setPortfolioError('')

        if (!portfolioFile) {
            setPortfolioError('Please choose a photo first.')
            return
        }

        setPortfolioUploading(true)
        const result = await uploadPhoto(portfolioFile, portfolioCaption)
        setPortfolioUploading(false)

        if (result.error) {
            setPortfolioError(result.error)
            return
        }

        setPortfolioFile(null)
        setPortfolioCaption('')
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
                    Manage Business
                </h1>
            </div>

            <div className="px-6 pt-4">
                <div className="flex gap-2 mb-6">
                    {TABS.map((tab) => (
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

                {activeTab === 'Profile' && (
                    <form onSubmit={handleProfileSave} className="flex flex-col gap-4 max-w-lg pb-10">
                        <input
                            name="name"
                            type="text"
                            placeholder="Business name"
                            value={currentForm.name || ''}
                            onChange={handleProfileChange}
                            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a] bg-white"
                        />
                        <input
                            name="category"
                            type="text"
                            placeholder="Category"
                            value={currentForm.category || ''}
                            onChange={handleProfileChange}
                            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a] bg-white"
                        />
                        <input
                            name="area"
                            type="text"
                            placeholder="Area"
                            value={currentForm.area || ''}
                            onChange={handleProfileChange}
                            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a] bg-white"
                        />
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={currentForm.description || ''}
                            onChange={handleProfileChange}
                            rows={3}
                            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a] bg-white resize-none"
                        />
                        <textarea
                            name="cancellation_policy"
                            placeholder="Cancellation policy"
                            value={currentForm.cancellation_policy || ''}
                            onChange={handleProfileChange}
                            rows={2}
                            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a] bg-white resize-none"
                        />
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Default lead time (days)</label>
                            <input
                                name="lead_time_days"
                                type="number"
                                min="0"
                                value={currentForm.lead_time_days || 0}
                                onChange={handleProfileChange}
                                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a] bg-white w-full"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">PayNow number</label>
                            <input
                                name="paynow_number"
                                type="text"
                                placeholder="e.g. 91234567"
                                value={currentForm.paynow_number || ''}
                                onChange={handleProfileChange}
                                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a] bg-white w-full"
                            />
                        </div>
                        
                        {profileMsg && (
                            <p className={`text-sm ${profileMsg === 'Saved!' ? 'text-green-500' : 'text-red-400'}`}>
                                {profileMsg}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={profileSaving}
                            className="bg-[#0e6b7a] text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
                        >
                            {profileSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                )}

                {activeTab === 'Menu' && (
                    <div className="max-w-lg pb-10">
                        <div className="flex flex-col gap-3 mb-4">
                            {items.length === 0 ? (
                                <p className="text-sm text-gray-400">No menu items yet.</p>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-[#2d3748] text-sm">{item.name}</p>
                                                <p className="text-xs text-gray-400">{item.description}</p>
                                            </div>
                                            <p className="text-[#0e6b7a] font-bold text-sm">
                                                {item.pricing_type === 'quote' ? 'Quote' : `$${item.price}`}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => deleteItem(item.id)}
                                            className="text-xs text-red-400 mt-2 underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {showAddItem ? (
                            <form onSubmit={handleAddItem} className="bg-[#FAFEFE] border border-gray-100 rounded-2xl p-4 flex flex-col gap-3">
                                {itemError && (
                                    <p className="text-red-400 text-sm">{itemError}</p>
                                )}
                                <input
                                    type="text"
                                    placeholder="Item name *"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={newItem.description}
                                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setNewItem({ ...newItem, pricing_type: 'fixed' })}
                                        className={`flex-1 py-2 rounded-xl text-sm font-medium border ${
                                            newItem.pricing_type === 'fixed'
                                                ? 'bg-[#0e6b7a] text-white border-[#0e6b7a]'
                                                : 'bg-white text-gray-500 border-gray-200'
                                        }`}
                                    >
                                        Fixed Price
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewItem({ ...newItem, pricing_type: 'quote', price: '' })}
                                        className={`flex-1 py-2 rounded-xl text-sm font-medium border ${
                                            newItem.pricing_type === 'quote'
                                                ? 'bg-[#0e6b7a] text-white border-[#0e6b7a]'
                                                : 'bg-white text-gray-500 border-gray-200'
                                        }`}
                                    >
                                        Quote Required
                                    </button>
                                </div>
                                {newItem.pricing_type === 'fixed' && (
                                    <input
                                        type="number"
                                        placeholder="Price ($)"
                                        value={newItem.price}
                                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                        className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
                                    />
                                )}
                                <input
                                    type="number"
                                    placeholder="Lead time override (days, optional)"
                                    value={newItem.lead_time_days}
                                    onChange={(e) => setNewItem({ ...newItem, lead_time_days: e.target.value })}
                                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddItem(false)}
                                        className="flex-1 bg-white border border-gray-200 text-gray-500 py-2 rounded-xl text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-[#0e6b7a] text-white py-2 rounded-xl text-sm font-medium"
                                    >
                                        Add Item
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <button
                                onClick={() => setShowAddItem(true)}
                                className="w-full border border-dashed border-gray-200 rounded-2xl py-3 text-sm text-[#0e6b7a] font-medium"
                            >
                                + Add Item
                            </button>
                        )}
                    </div>
                )}

                {activeTab === 'Fulfilment' && (
                    <div className="max-w-lg pb-10 flex flex-col gap-3">
                        {FULFILMENT_OPTIONS.map((optionValue) => {
                            const enabled = options.find(o => o.option_value === optionValue)

                            return (
                                <div key={optionValue} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-[#2d3748]">{FULFILMENT_LABELS[optionValue]}</p>
                                        <button
                                            onClick={() => handleToggleFulfilment(optionValue)}
                                            className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                                                enabled
                                                    ? 'bg-[#0e6b7a] text-white'
                                                    : 'bg-gray-100 text-gray-500'
                                            }`}
                                        >
                                            {enabled ? 'Enabled' : 'Disabled'}
                                        </button>
                                    </div>
                                    {enabled && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <label className="text-xs text-gray-400">Extra fee ($)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                defaultValue={enabled.extra_fee || 0}
                                                onChange={(e) => setFeeInputs({ ...feeInputs, [enabled.id]: e.target.value })}
                                                className="border border-gray-200 rounded-xl px-3 py-1 text-sm w-24 outline-none focus:border-[#0e6b7a]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleFeeUpdate(enabled.id)}
                                                disabled={feeSaving === enabled.id}
                                                className="text-xs text-[#0e6b7a] font-medium underline disabled:opacity-50"
                                            >
                                                {feeSaving === enabled.id ? 'Saving...' : 'Save'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}

                {activeTab === 'Portfolio' && (
                    <div className="max-w-lg pb-10">
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {portfolioItems.length === 0 ? (
                                <p className="text-sm text-gray-400 col-span-2">No photos yet.</p>
                            ) : (
                                portfolioItems.map((item) => (
                                    <div key={item.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                        <img
                                            src={item.photo_url}
                                            alt={item.caption}
                                            className="w-full h-32 object-cover"
                                        />
                                        <div className="p-2">
                                            <p className="text-xs text-gray-400 truncate">{item.caption}</p>
                                            <button
                                                onClick={() => deletePortfolioItem(item.id)}
                                                className="text-xs text-red-400 mt-1 underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <form onSubmit={handlePortfolioUpload} className="bg-[#FAFEFE] border border-gray-100 rounded-2xl p-4 flex flex-col gap-3">
                            {portfolioError && (
                                <p className="text-red-400 text-sm">{portfolioError}</p>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setPortfolioFile(e.target.files[0])}
                                className="text-sm text-[#2d3748]"
                            />
                            <input
                                type="text"
                                placeholder="Caption (optional)"
                                value={portfolioCaption}
                                onChange={(e) => setPortfolioCaption(e.target.value)}
                                className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
                            />
                            <button
                                type="submit"
                                disabled={portfolioUploading}
                                className="bg-[#0e6b7a] text-white py-2 rounded-xl text-sm font-medium disabled:opacity-50"
                            >
                                {portfolioUploading ? 'Uploading...' : 'Upload Photo'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManageBusinessPage