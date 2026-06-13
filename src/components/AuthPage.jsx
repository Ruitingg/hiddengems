import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import DiamondIcon from '../components/DiamondIcon'
import { useAuth } from '../lib/AuthContext'

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('customer')
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { session, loading } = useAuth()

    if (!loading && session) {
        return <Navigate to="/" />
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!email || !password || (!isLogin && !username)) {
            setError('Please fill in all fields.')
            return
        }

        if (isLogin) {
            let loginEmail = email

        if (!email.includes('@')) {
            const { data: lookupEmail } = await supabase.rpc('get_email_by_username', { input_username: email })

        if (!lookupEmail) {
            setError('Incorrect email/username or password. Please try again.')
            return
        }
loginEmail = lookupEmail

        const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password })
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
            await supabase.from('users').insert({ id: data.user.id, email, role, username })
            if (role === 'owner') {
                navigate('/dashboard')
            } else {
                navigate('/')
            }
        }
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <div className="flex justify-center mb-3">
                        <DiamondIcon size={50} color="#0e6b7a" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#2d3748]"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        HiddenGems
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Support local home-based businesses</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                    <div className="flex mb-6 bg-[#FAFEFE] rounded-full p-1 border border-gray-100">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 text-sm font-medium rounded-full transition cursor-pointer ${
                                isLogin ? 'bg-[#0e6b7a] text-white shadow-sm' : 'text-gray-500'
                            }`}>
                            Log In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 text-sm font-medium rounded-full transition cursor-pointer ${
                                !isLogin ? 'bg-[#0e6b7a] text-white shadow-sm' : 'text-gray-500'
                            }`}>
                            Create Account
                        </button>
                    </div>

                    <h2 className="text-xl font-bold text-[#2d3748] mb-1"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        {isLogin ? 'Welcome back' : 'Get started'}
                    </h2>
                    <p className="text-sm text-gray-400 mb-6">
                        {isLogin ? 'Sign in to your account.' : 'Create your free account.'}
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder={isLogin ? "Email or username" : "Email address"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a] focus:ring-1 focus:ring-[#0e6b7a] bg-white"
                        />

                        {!isLogin && (
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a] focus:ring-1 focus:ring-[#0e6b7a] bg-white"
                            />
                        )}

                        <input 
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a] focus:ring-1 focus:ring-[#0e6b7a] bg-white"
                        />

                        {!isLogin && (
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a] focus:ring-1 focus:ring-[#0e6b7a] bg-white"
                        />
                        )}  

                        {!isLogin && (
                            <div className="relative">
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="appearance-none w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d3748] outline-none focus:border-[#0e6b7a] bg-white"
                                >
                                    <option value="customer">I am a Customer</option>
                                    <option value="owner">I am an Owner</option>
                                </select>
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
                            </div>
                        )}

                        <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                            <input type="checkbox" className="accent-[#0e6b7a]" />
                            Stay signed in
                        </label>

                        <button
                            type="submit"
                            className="bg-[#0e6b7a] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#0a5566] transition cursor-pointer mt-1">
                            {isLogin ? 'Log In' : 'Create Account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AuthPage