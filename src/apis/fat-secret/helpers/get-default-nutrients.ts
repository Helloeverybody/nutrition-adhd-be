import {IServing} from "../interfaces/response.interfaces";
import {getDefaultServing} from "./get-default-serving";
import {INutrition, ServingUnit} from "../interfaces/nutrition.interface";
import {ozToGram} from "./oz-to-gram";

export function getDefaultNutrients(servings: IServing[]): INutrition | null {
    const serving = getDefaultServing(servings)

    console.log(serving)

    if (!serving) {
        return null
    }

    const getPortion = (name: keyof IServing) => {
        const nutrientAmount = Number(serving[name]) / Number(serving.metric_serving_amount) * 100

        return serving.metric_serving_unit === ServingUnit.oz ? ozToGram(nutrientAmount) : nutrientAmount
    }

    return {
        calories: getPortion('calories'),
        fat: getPortion('fat'),
        protein: getPortion('protein'),
        carbs: getPortion('carbohydrate'),
    }
}