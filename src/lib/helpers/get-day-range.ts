export function getDayRange(timestamp: number) {
    const dateStart = new Date(timestamp)
    dateStart.setHours(0,0,0,0)

    const dateEnd = new Date(dateStart)
    dateEnd.setHours(23,59,59, 999)

    return { dateStart, dateEnd }
}