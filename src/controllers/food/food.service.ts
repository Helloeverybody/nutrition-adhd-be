import {Injectable} from '@nestjs/common';
import {IAddFoodRequestBody} from "./interfaces/request-body.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {FoodEntity} from "./entities/food.entity";
import {Like, Repository} from "typeorm";
import {IFoodListResponseBody} from "./interfaces/response-body.interface";
import {FatSecretApiService} from "../../apis/fat-secret/fat-secret-api.service";
import {lastValueFrom, map} from "rxjs";
import {IFoodItem, IServing} from "../../apis/fat-secret/interfaces/response.interfaces";

@Injectable()
export class FoodService {
    constructor(
        @InjectRepository(FoodEntity)
        private foodRepository: Repository<FoodEntity>,
        private fatSecretApi: FatSecretApiService
    ) {}

    async searchFood(searchString?: string): Promise<IFoodListResponseBody[]> {
        const getDefaultServingCal = (servings: IServing[]) => {
            const defaultServing = servings.find(serving => Boolean(Number(serving.is_default)))

            if (!defaultServing) {
                return 0
            }

            return Number(defaultServing.calories) / Number(defaultServing.metric_serving_amount) * 100
        }

        const transformFoodSearchData = (data?: IFoodItem[]) =>
            data?.map(
                food => ({
                    id: food.food_id,
                    calories: getDefaultServingCal(food.servings.serving),
                    name: food.food_name,
                    brand: food.food_type === 'Brand' ? food?.brand_name : undefined
                })
            )

        const apiFoodRequest$ = this.fatSecretApi.getFoodList(searchString, 1, 10)
            .pipe(
                map(data => transformFoodSearchData(data?.foods_search?.results?.food) ?? [])
            )

        const ownFoodDbRequest = this.foodRepository.find({
            take: 10,
            select: ['calories', 'name', 'id'],
            where: { name: searchString ? Like(`%${searchString}%`) : undefined }
        }) as Promise<IFoodListResponseBody[]>

        const [ownFood, apiFood] = await Promise.all([
            ownFoodDbRequest,
            lastValueFrom(apiFoodRequest$)
        ])

        return ownFood.concat(apiFood)
    }

    async addFood(data: IAddFoodRequestBody) {
        const food = this.foodRepository.create(data)
        await this.foodRepository.save(food)
    }
}
