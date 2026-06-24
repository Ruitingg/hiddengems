import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import DiamondIcon from '../components/DiamondIcon'

const ProfilePage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [hbb, setHbb] = useState(null)
    const [products, setProducts] = useState([])
    const [portfolio, setPortfolio] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const { data: hbbData } = await supabase
                .from('hbb_profiles')
                .select('*')
                .eq('id', id)
                .single()

            const { data: productsData } = await supabase
                .from('products')
                .select('*')
                .eq('hbb_id', id)

            const { data: portfolioData } = await supabase
                .from('portfolio_items')
                .select('*')
                .eq('hbb_id', id)

            setHbb(hbbData)
            setProducts(productsData || [])
            setPortfolio(portfolioData || [])
            setLoading(false)
        }
        fetchData()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-[#0e6b7a] text-lg font-semibold">Loading...</p>
            </div>
        )
    }

    if (!hbb) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-400 text-lg">404 — Business not found.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white"></div>