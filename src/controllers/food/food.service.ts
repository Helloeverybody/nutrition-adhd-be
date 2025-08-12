import {Injectable} from '@nestjs/common';
import {IAddFoodRequestBody} from "./interfaces/request-body.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {FoodEntity} from "./entities/food.entity";
import {Like, Repository} from "typeorm";
import {FoodSource, IFoodDetailsResponseBody, IFoodListResponseBody} from "./interfaces/response-body.interface";
import {FatSecretApiService} from "../../apis/fat-secret/fat-secret-api.service";
import {lastValueFrom, map} from "rxjs";
import {IFoodItem} from "../../apis/fat-secret/interfaces/response.interfaces";
import {getDefaultNutrients} from "../../apis/fat-secret/helpers/get-default-nutrients";

@Injectable()
export class FoodService {
    constructor(
        @InjectRepository(FoodEntity)
        private foodRepository: Repository<FoodEntity>,
        private fatSecretApi: FatSecretApiService
    ) {}

    async searchFood(searchString?: string): Promise<IFoodListResponseBody[]> {
        const apiRequest = this.getFoodListFromApi(searchString)
        const dbRequest = this.getFoodListFromDB(searchString)

        const [ownFood, apiFood] = await Promise.all([
            dbRequest,
            apiRequest
        ])

        return ownFood.concat(apiFood)
    }

    async addFood(data: IAddFoodRequestBody) {
        const food = this.foodRepository.create(data)
        await this.foodRepository.save(food)
    }

    async getFoodDetails(id: number, source: FoodSource): Promise<IFoodDetailsResponseBody | null> {
        switch (source) {
            case FoodSource.fatSecretApi:
                return this.getFoodDetailsFromApi(id)
            case FoodSource.database:
            default:
                return this.getFoodDetailsFromDB(id)
        }
    }

    private async getFoodListFromApi(searchString?: string): Promise<IFoodListResponseBody[]> {
        const transformFoodSearchData = (data?: IFoodItem[]) =>
            data?.map(
                food => ({
                    id: food.food_id,
                    calories: getDefaultNutrients(food.servings.serving)?.calories || 0,
                    name: food.food_name,
                    brand: food.food_type === 'Brand' ? food?.brand_name : undefined,
                    source: FoodSource.fatSecretApi
                })
            )

        const request$ = this.fatSecretApi.getFoodList(searchString, 1, 10)
            .pipe(
                map(data => transformFoodSearchData(data?.foods_search?.results?.food) ?? [])
            )

        return lastValueFrom(request$)
    }

    private async getFoodListFromDB(searchString?: string): Promise<IFoodListResponseBody[]> {
        const dbFoodRequest = this.foodRepository.find({
            take: 10,
            select: ['calories', 'name', 'id', 'brand'],
            where: [
                { name: searchString ? Like(`%${searchString}%`) : undefined },
                { brand: searchString ? Like(`%${searchString}%`) : undefined }
            ],
        })

        return dbFoodRequest
            .then((foodList) =>
                foodList.map(food => (
                    {
                        ...food,
                        source: FoodSource.database
                    }
                ))
            ) as Promise<IFoodListResponseBody[]>
    }

    private getFoodDetailsFromApi(id: number): Promise<IFoodDetailsResponseBody> {
        return lastValueFrom(this.fatSecretApi.getFoodDetails(id))
            .then((data) => {
                return {
                    id: data.food_id,
                    name: data.food_name,
                    brand: data.food_type === 'Brand' ? data.brand_name : undefined,
                    source: FoodSource.fatSecretApi,
                    ...getDefaultNutrients(data.servings.serving),
                } as IFoodDetailsResponseBody
            })
    }

    private getFoodDetailsFromDB(id: number): Promise<IFoodDetailsResponseBody | null> {
        return this.foodRepository.findOneBy({ id })
            .then(data => (
                data
                    ? {
                        source: FoodSource.database,
                        ...data
                    }
                    : null
            ))

    }
}
