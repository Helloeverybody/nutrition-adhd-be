export interface IAuthKeyResponse {
    access_token: string,
    token_type: string,
    expires_in: number
}

export interface IFoodsResponse {
    foods_search: {
        max_results: number,
        total_results: number,
        page_number: number,
        results: {
            food: IFoodItem[]
        }
    }
}

export interface IServing {
    metric_serving_amount: number,
    metric_serving_unit: string,
    calories: number,
    is_default: '1' | '0'
}

interface ICommonFoodItem {
    food_type: 'Generic' | 'Brand',
    food_id: number,
    food_name: string,
    food_url: string,
    servings: {
        serving: IServing[]
    }
}

interface IGenericFoodItem extends ICommonFoodItem {
    food_type: 'Generic',
}

interface IBrandFoodItem extends ICommonFoodItem {
    food_type: 'Brand'
    brand_name: string,
}

export type IFoodItem = IBrandFoodItem | IGenericFoodItem