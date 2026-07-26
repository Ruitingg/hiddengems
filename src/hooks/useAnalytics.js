import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

export const useAnalytics = () => {
    const { session } = useAuth()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [revenueByDate, setRevenueByDate] = useState([])
    const [bestSellers, setBestSellers] = useState([])
    const [heatmapByMonth, setHeatmapByMonth] = useState([])
    const [orders, setOrders] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            if (!session) return
            setLoading(true)

            const { data: hbbProfile, error: hbbError } = await supabase
                .from('hbb_profiles')
                .select('id')
                .eq('owner_id', session.user.id)
                .single()

            if (hbbError || !hbbProfile) {
                setError('No business profile found for this account.')
                setLoading(false)
                return
            }

            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*, products(name)')
                .eq('hbb_id', hbbProfile.id)
                .eq('status', 'completed')
                .order('updated_at', { ascending: true })

            if (ordersError) {
                setError('Could not load analytics data.')
                setLoading(false)
                return
            }

            const completedOrders = ordersData || []
            setOrders(completedOrders)

            const revenueMap = {}
            completedOrders.forEach((order) => {
                const date = new Date(order.updated_at).toISOString().slice(0, 10)
                revenueMap[date] = (revenueMap[date] || 0) + (order.final_price || 0)
            })
            const revenueList = Object.entries(revenueMap)
                .map(([date, revenue]) => ({ date, revenue }))
                .sort((a, b) => a.date.localeCompare(b.date))
            setRevenueByDate(revenueList)

            const productMap = {}
            completedOrders.forEach((order) => {
                const name = order.products?.name || 'Unknown item'
                if (!productMap[name]) {
                    productMap[name] = { name, count: 0, revenue: 0 }
                }
                productMap[name].count += 1
                productMap[name].revenue += order.final_price || 0
            })
            const sellerList = Object.values(productMap).sort((a, b) => b.count - a.count)
            setBestSellers(sellerList)

            const monthMap = {}
            completedOrders.forEach((order) => {
                const month = new Date(order.updated_at).toLocaleDateString('en-SG', { year: 'numeric', month: 'short' })
                monthMap[month] = (monthMap[month] || 0) + 1
            })
            const heatmapList = Object.entries(monthMap).map(([month, count]) => ({ month, count }))
            setHeatmapByMonth(heatmapList)

            setLoading(false)
        }

        fetchData()
    }, [session])

    const exportCSV = () => {
        const headers = ['Order ID', 'Item', 'Amount', 'Date Completed']
        const rows = orders.map((o) => [
            o.id,
            o.products?.name || 'Unknown item',
            o.final_price || 0,
            new Date(o.updated_at).toLocaleDateString('en-SG'),
        ])

        const csvContent = [headers, ...rows]
            .map((row) => row.map((cell) => `"${cell}"`).join(','))
            .join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'order-summary.csv'
        link.click()
        URL.revokeObjectURL(url)
    }

    return { loading, error, revenueByDate, bestSellers, heatmapByMonth, exportCSV }
}