import {isDefined} from "./is-defined";

export function isNotDefined<T>(value: T | null | undefined) {
    return !isDefined(value)
}