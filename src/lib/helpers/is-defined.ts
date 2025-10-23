export function isDefined<T>(value: T | null | undefined) {
    return value !== null && value !== undefined
}