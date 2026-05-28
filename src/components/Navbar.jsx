import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

const Navbar = () => {
    const [user, setUser] = useState(null)
    const [role, setRole] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                setUser(session.user)
                fetchRole(session.user.id)
            }
        }

        getSession()

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUser(session.user)
                fetchRole(session.user.id)
            } else {
                setUser(null)
                setRole(null)
            }
        })

        return () => listener.subscription.unsubscribe()
    }, [])

    const fetchRole = async (userId) => {
        const { data } = await supabase
            .from('users')
            .select('role')
            .eq('id', userId)
            .single()
        if (data) setRole(data.role)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    return (
        <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
                <span className="text-2xl">💎</span>
                <span className="text-[#184b44] font-bold text-xl"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    HiddenGems
                </span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-3">
                {!user ? (
                    <Link to="/auth"
                        className="bg-[#184b44] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#0f3330] transition">
                        Log In
                    </Link>
                ) : (
                    <>
                        <span className="text-gray-500 text-sm hidden sm:block">{user.email}</span>
                        {role === 'owner' && (
                            <Link to="/dashboard"
                                className="text-[#184b44] text-sm font-medium hover:underline">
                                My Dashboard
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition">
                            Log Out
                        </button>
                    </>
                )}
            </div>

        </nav>
    )
}

export default Navbar