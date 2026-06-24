import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export const useReviewsForHbb = (hbbId) => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!hbbId) return

        const fetchReviews = async () => {
            const { data } = await supabase
                .from('reviews')
                .select('*, users(email)')
                .eq('hbb_id', hbbId)
                .order('created_at', { ascending: false })
            setReviews(data || [])
            setLoading(false)
        }

        fetchReviews()
    }, [hbbId])

    return { reviews, loading }
}

export const useSubmitReview = () => {
    const recalculateCharmScore = async (hbbId) => {
        const { data: reviews } = await supabase
            .from('reviews')
            .select('rating')
            .eq('hbb_id', hbbId)

        const { count: verifiedOrderCount } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('hbb_id', hbbId)
            .eq('status', 'completed')

        const avgRating = reviews && reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0

        const charmScore = Math.round((avgRating * 10) + ((verifiedOrderCount || 0) * 2))

        await supabase
            .from('hbb_profiles')
            .update({ charm_score: charmScore })
            .eq('id', hbbId)

        return charmScore
    }

    const submitReview = async ({ orderId, hbbId, customerId, rating, comment }) => {
        const { error: reviewError } = await supabase
            .from('reviews')
            .insert({
                order_id: orderId,
                hbb_id: hbbId,
                customer_id: customerId,
                rating,
                comment,
            })

        if (reviewError) {
            return { error: 'Could not submit review. Please try again.' }
        }

        await recalculateCharmScore(hbbId)

        return { success: true }
    }

    return { submitReview }
}