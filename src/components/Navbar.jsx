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
    <nav className="bg-[#184b44] px-6 py-4 flex items-center justify-between">
        
      {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl">💎</span>
        <span className="text-white font-bold text-xl"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            HiddenGems SG
        </span>
        </Link>

      {/* Right side */}
        <div className="flex items-center gap-4">
        {!user ? (
            <Link to="/auth"
            className="bg-white text-[#184b44] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#ede1d2] transition">
            Log In
            </Link>
        ) : (
            <>
            <span className="text-white text-sm">{user.email}</span>
            {role === 'owner' && (
                <Link to="/dashboard"
                className="text-white text-sm underline">
                My Dashboard
                </Link>
            )}
            <button
                onClick={handleLogout}
                className="bg-white text-[#184b44] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#ede1d2] transition">
                Log Out
            </button>
            </>
        )}
        </div>

    </nav>
    )
}

export default Navbar