export function getDayRange(timestamp: number) {
    const dateStart = new Date(timestamp)

    const intermediateDate = new Date(dateStart)
    intermediateDate.setDate(intermediateDate.getDate() + 1)
    const dateEnd = new Date(intermediateDate.getTime() - 1)

    return { dateStart, dateEnd }
}