import { describe, it, expect } from 'vitest'
import { isWithinLeadTime } from './leadTime'

describe('isWithinLeadTime', () => {
    it('accepts a slot far enough in the future', () => {
    const future = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days out
    expect(isWithinLeadTime(future, 3)).toBe(true)
    })

    it('rejects a slot that is too soon', () => {
    const soon = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 day out
    expect(isWithinLeadTime(soon, 3)).toBe(false)
    })
})