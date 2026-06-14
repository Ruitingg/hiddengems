import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

const categories = ['Food', 'Beauty', 'Crafts']
const areas = ['Tampines', 'Bishan', 'Jurong West', 'Ang Mo Kio', 'Clementi', 'Tiong Bahru']

const SetupPage = () => {
    const { session } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        name: '',
        category: '',
        area: '',
        description: '',
        cancellation_policy: '',
        lead_time_days: 0,
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!form.name || !form.category || !form.area || !form.description) {
            setError('Please fill in all required fields.')
            return
        }

        setLoading(true)

        const { data: hbb, error: hbbError } = await supabase
            .from('hbb_profiles')
            .insert({
                owner_id: session.user.id,
                name: form.name,
                category: form.category,
                area: form.area,
                description: form.description,
                cancellation_policy: form.cancellation_policy,
                lead_time_days: form.lead_time_days,
                verified: false,
            })
            .select()
            .single()

        if (hbbError) {
            setError('Something went wrong. Please try again.')
            setLoading(false)
            return
        }

        await supabase
            .from('verification_requests')
            .insert({
                hbb_id: hbb.id,
                status: 'pending',
            })

        setLoading(false)
        navigate('/dashboard')
    }

    return (
        <div className="min-h-screen bg-white px-6 py-10 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-[#2d3748] mb-1"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Set up your business
            </h1>
            <p className="text-sm text-gray-400 mb-8">Tell us about your home-based business.</p>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    name="name"
                    type="text"
                    placeholder="Business name *"
                    value={form.name}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a] focus:ring-1 focus:ring-[#0e6b7a] bg-white"
                />

                <div className="relative">
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="appearance-none w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a] bg-white"
                    >
                        <option value="">Select a category *</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
                </div>

                <div className="relative">
                    <select
                        name="area"
                        value={form.area}
                        onChange={handleChange}
                        className="appearance-none w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a] bg-white"
                    >
                        <option value="">Select an area *</option>
                        {areas.map(area => (
                            <option key={area} value={area}>{area}</option>
                        ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
                </div>

                <textarea
                    name="description"
                    placeholder="Describe your business *"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a] focus:ring-1 focus:ring-[#0e6b7a] bg-white resize-none"
                />

                <textarea
                    name="cancellation_policy"
                    placeholder="Cancellation policy (e.g. Cancellations must be made 48 hours in advance)"
                    value={form.cancellation_policy}
                    onChange={handleChange}
                    rows={2}
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a] focus:ring-1 focus:ring-[#0e6b7a] bg-white resize-none"
                />

                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Minimum lead time (days)</label>
                    <input
                        name="lead_time_days"
                        type="number"
                        min="0"
                        value={form.lead_time_days}
                        onChange={handleChange}
                        className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a] focus:ring-1 focus:ring-[#0e6b7a] bg-white w-full"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#0e6b7a] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#0a5566] transition cursor-pointer mt-2 disabled:opacity-50">
                    {loading ? 'Setting up...' : 'Submit for verification'}
                </button>
            </form>
        </div>
    )
}

export default SetupPage