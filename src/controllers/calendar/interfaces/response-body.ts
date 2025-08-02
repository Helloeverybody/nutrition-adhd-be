export interface DailyNutritionResponseBody {
    protein: number,
    fat: number,
    calories: number,
    carbs: number,
}

export interface DailyMealResponseBody {
    time: string,
    name: string,
    protein: number,
    fat: number,
    calories: number,
    carbs: number
}