import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Between, DeepPartial, Repository} from "typeorm";
import {MealEntity} from "./entities/meal.entity";
import {getDayRange} from "./helpers/get-day-range";
import {IDailyMealResponseBody} from "./interfaces/response-body";
import {IAddMealRequestBody} from "./interfaces/request-body.interface";
import {FoodService} from "../food/food.service";
import {toFixedNumber} from "../../lib/helpers/to-fixed-number";
import {nutrientPerWeight} from "../../lib/helpers/nutrient-per-weight";

@Injectable()
export class MealService {
    constructor(
        @InjectRepository(MealEntity)
        private mealRepository: Repository<MealEntity>,
        private foodService: FoodService
    ) {}

    async getMealsByDay(date: number): Promise<IDailyMealResponseBody[]> {
        const {dateStart, dateEnd} = getDayRange(date)

        const dailyMeals = await this.mealRepository.findBy({time: Between(dateStart, dateEnd)})

        return dailyMeals
            .map((meal) => ({
                calories: meal.caloriesPerWeight,
                protein: meal.proteinPerWeight,
                fat: meal.fatPerWeight,
                carbs: meal.carbsPerWeight,
                time: meal.time.getTime(),
                name: meal.name
            }))
    }

    async addMeal(mealData: IAddMealRequestBody) {
        let meal: DeepPartial<MealEntity>;
        const food = await this.foodService.getFoodDetails(mealData.foodId, mealData.source)

        if (!food) {
            throw new NotFoundException('Food not found')
        }

        meal = {
            name: food.name,
            brand: food.brand,
            time: new Date(mealData.time),
            carbs: food.carbs,
            protein: food.protein,
            fat: food.fat,
            calories: food.calories,
            weight: mealData.weight,
            carbsPerWeight: toFixedNumber(nutrientPerWeight(food.carbs, mealData.weight), 2),
            proteinPerWeight: toFixedNumber(nutrientPerWeight(food.protein, mealData.weight), 2),
            fatPerWeight: toFixedNumber(nutrientPerWeight(food.fat, mealData.weight), 2),
            caloriesPerWeight: toFixedNumber(nutrientPerWeight(food.calories, mealData.weight), 2),
        }

        const mealEntity = this.mealRepository.create(meal)
        await this.mealRepository.save(mealEntity)
    }
}
