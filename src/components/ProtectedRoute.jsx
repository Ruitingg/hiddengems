import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

const ProtectedRoute = ({ children }) => {
    const [session, setSession] = useState(undefined)

    useEffect(() => {
    const getSession = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
    }
    getSession()
    }, [])

    if (session === undefined) {
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