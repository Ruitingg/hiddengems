import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('customer')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
        setError('Please fill in all fields.')
        return
    }

    if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
        setError('Incorrect email or password. Please try again.')
        return
        }
        const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single()

        if (userData?.role === 'owner') {
        navigate('/dashboard')
        } else {
        navigate('/')
        }

    } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) {
        setError(error.message)
        return
        }
        await supabase.from('users').insert({
        id: data.user.id,
        email,
        role
        })
        if (role === 'owner') {
        navigate('/dashboard')
        } else {
        navigate('/')
        }
    }
    }

    return (
    <div className="min-h-screen bg-[#ede1d2] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">

        {/* Toggle */}
        <div className="flex mb-6 border border-[#184b44] rounded-full overflow-hidden">
            <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm font-medium transition cursor-pointer ${
                isLogin ? 'bg-[#184b44] text-white' : 'text-[#184b44]'
            }`}>
            Log In
            </button>
            <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm font-medium transition cursor-pointer ${
                !isLogin ? 'bg-[#184b44] text-white' : 'text-[#184b44]'
            }`}>
            Create Account
            </button>
        </div>

        <h2 className="text-2xl font-bold text-[#184b44] mb-1"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {isLogin ? 'Welcome back' : 'Create account'}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
            {isLogin ? 'Please enter your details to sign in.' : 'Fill in your details to get started.'}
        </p>

        {/* Error message */}
        {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#184b44]"
            />
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#184b44]"
            />

            {!isLogin && (
            <div className="relative">
                <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="appearance-none w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#184b44]"
                >
                <option value="customer">I am a Customer</option>
                <option value="owner">I am an Owner</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">▼</span>
            </div>
            )}

            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" className="accent-[#184b44]" />
            Stay signed in
            </label>

            <button
            type="submit"
            className="bg-[#184b44] text-white py-3 rounded-full text-sm font-medium hover:bg-[#284771] transition cursor-pointer">
            {isLogin ? 'Log In' : 'Create Account'}
            </button>
        </form>

        </div>
    </div>
    )
}

export default AuthPage