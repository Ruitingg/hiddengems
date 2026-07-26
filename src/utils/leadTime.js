export function isWithinLeadTime(slotDate, leadTimeDays) {
    const today = new Date()
    const slot = new Date(slotDate)
    const daysUntilSlot = (slot - today) / (1000 * 60 * 60 * 24)
    return daysUntilSlot >= leadTimeDays
}