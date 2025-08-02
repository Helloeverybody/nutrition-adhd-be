import {Injectable} from '@nestjs/common';
import {foodList, foodItems} from "./mocks";
import {IAddFoodRequestBody} from "./interfaces/request-body.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {FoodEntity} from "./entities/food.entity";
import {Repository} from "typeorm";

@Injectable()
export class FoodService {
    constructor(
        @InjectRepository(FoodEntity)
        private foodRepository: Repository<FoodEntity>
    ) {
    }

    MOCKgetAllFood(searchString?: string): any {
        if (searchString) {
            return foodList.filter(food => food.name.toLowerCase().startsWith(searchString.toLowerCase()));
        } else {
            return foodList
        }
    }

    MOCKgetFoodDetailsById(id: number): any {
        return foodItems.find((item) => item.id === id);
    }

    addFood(data: IAddFoodRequestBody) {
        this.foodRepository.create(data)
    }
}
