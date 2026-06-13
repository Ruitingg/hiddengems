import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(undefined)
    const [role, setRole] = useState(null)

    useEffect(() => {
        const fetchRole = async (userId) => {
            const { data } = await supabase
                .from('users')
                .select('role')
                .eq('id', userId)
                .single()
            if (data) setRole(data.role)
        }

        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)
            if (session) fetchRole(session.user.id)
        }

        getSession()

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            if (session) {
                fetchRole(session.user.id)
            } else {
                setRole(null)
            }
        })

        return () => listener.subscription.unsubscribe()
    }, [])

    return (
        <AuthContext.Provider value={{ session, role, loading: session === undefined }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)