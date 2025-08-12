export interface IAddFoodRequestBody {
    name: string,
    brand?: string,
    carbs: number,
    protein: number,
    fat: number,
    calories: number
}