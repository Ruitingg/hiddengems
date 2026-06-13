import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import DiscoveryPage from '../pages/DiscoveryPage'
import DashboardPage from '../pages/DashboardPage'

const RootRedirect = () => {
    const { session, role, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-[#0e6b7a] text-lg font-semibold">Loading...</p>
            </div>
        )
    }

    if (!session) {
        return <Navigate to="/auth" />
    }

    if (role === 'owner') {
        return <DashboardPage />
    }

    return <DiscoveryPage />
}

export default RootRedirect