export function calculateGemRedemption({ gemBalance, gemsPerUnit, valuePerUnit, rawAmount }) {
    if (!gemsPerUnit || !valuePerUnit) {
        return { gemsToRedeem: 0, discount: 0 }
    }
    const affordableUnits = Math.floor(gemBalance / gemsPerUnit)
    const maxDiscount = affordableUnits * valuePerUnit
    const cappedDiscount = Math.min(maxDiscount, rawAmount)
    const cappedUnits = Math.floor(cappedDiscount / valuePerUnit)
    const gemsToRedeem = cappedUnits * gemsPerUnit
    return { gemsToRedeem, discount: cappedDiscount }
}