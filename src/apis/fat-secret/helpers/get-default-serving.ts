import {IServing} from "../interfaces/response.interfaces";

export function getDefaultServing(servings: IServing[]) {
    return servings.find(serving => Boolean(Number(serving.is_default)))
}