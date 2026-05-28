import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import DiamondIcon from './DiamondIcon'

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
            <Link to="/" className="flex items-center gap-2">
                <DiamondIcon size={26} color="#0e6b7a" />
                <span className="text-[#0e6b7a] font-bold text-xl"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    HiddenGems
                </span>
            </Link>

            <div className="flex items-center gap-3">
                {!user ? (
                    <Link to="/auth"
                        className="bg-[#0e6b7a] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#0a5566] transition">
                        Log In
                    </Link>
                ) : (
                    <>
                        <span className="text-gray-400 text-sm hidden sm:block">{user.email}</span>
                        {role === 'owner' && (
                            <Link to="/dashboard"
                                className="text-[#0e6b7a] text-sm font-medium hover:underline">
                                My Dashboard
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="bg-[#FAFEFE] text-gray-600 border border-gray-200 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition">
                            Log Out
                        </button>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar