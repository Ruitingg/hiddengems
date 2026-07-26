import { describe, it, expect } from 'vitest'
import { calculateGemRedemption } from './gemDiscount'

describe('calculateGemRedemption', () => {
    it('calculates a valid partial redemption', () => {
    const result = calculateGemRedemption({ gemBalance: 500, gemsPerUnit: 250, valuePerUnit: 2, rawAmount: 20 })
    expect(result.gemsToRedeem).toBe(500)
    expect(result.discount).toBe(4)
    })

    it('returns 0 when redemption is not set up', () => {
    const result = calculateGemRedemption({ gemBalance: 500, gemsPerUnit: 0, valuePerUnit: 0, rawAmount: 20 })
    expect(result.gemsToRedeem).toBe(0)
    expect(result.discount).toBe(0)
    })

    it('caps discount at the order amount', () => {
    const result = calculateGemRedemption({ gemBalance: 10000, gemsPerUnit: 100, valuePerUnit: 5, rawAmount: 10 })
    expect(result.discount).toBeLessThanOrEqual(10)
    })
})