export interface IFoodListResponseBody {
    id: number,
    calories: number,
    name: string,
    brand?: string
    source: FoodSource
}

export interface IFoodDetailsResponseBody {
    id: number,
    name: string,
    brand?: string
    calories: number,
    fat: number,
    protein: number,
    carbs: number,
    source: FoodSource
}

export enum FoodSource {
    database,
    fatSecretApi
}