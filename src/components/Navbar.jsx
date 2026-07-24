import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import DiamondIcon from './DiamondIcon'
import { useNotifications } from '../hooks/useNotifications'

const Navbar = () => {
    const { session, role } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const { unreadCount } = useNotifications()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/auth')
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
                {session ? (
                    <>
                        <span className="text-gray-400 text-sm hidden sm:block">{session.user.email}</span>
                        {role === 'owner' && (
                            <Link to="/dashboard"
                                className="text-[#0e6b7a] text-sm font-medium hover:underline">
                                My Dashboard
                            </Link>
                        )}
                        {role === 'customer' && (
                            <Link to="/favourites"
                                className="text-[#0e6b7a] text-sm font-medium hover:underline">
                                Favourites
                            </Link>
                        )}
                        <Link to="/notifications" className="relative">
                            <span className="text-xl">🔔</span>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-[#FAFEFE] text-gray-600 border border-gray-200 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition">
                            Log Out
                        </button>
                    </>
                ) : location.pathname !== '/auth' ? (
                    <Link to="/auth"
                        className="bg-[#0e6b7a] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#0a5566] transition">
                        Log In
                    </Link>
                ) : null}
            </div>
        </nav>
    )
}

export default Navbar