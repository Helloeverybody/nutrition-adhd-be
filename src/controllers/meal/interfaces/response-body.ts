export interface IDailyMealResponseBody {
    time: number,
    name: string,
    protein: number,
    fat: number,
    calories: number,
    carbs: number,
    id: number
}

export interface IDailyNutritionResponseBody {
    protein: number,
    fat: number,
    calories: number,
    carbs: number,
}