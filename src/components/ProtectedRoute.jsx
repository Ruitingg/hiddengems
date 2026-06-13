import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

const ProtectedRoute = ({ children }) => {
    const { session, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen bg-[#ede1d2] flex items-center justify-center">
                <p className="text-[#184b44]">Loading...</p>
            </div>
        )
    }

    if (!session) {
        return <Navigate to="/auth" />
    }

    return children
}

export default ProtectedRoute