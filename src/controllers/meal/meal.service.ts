import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Between, DeepPartial, Repository} from "typeorm";
import {MealEntity} from "./entities/meal.entity";
import {getDayRange} from "../../lib/helpers/get-day-range";
import {IDailyMealResponseBody, IDailyNutritionResponseBody} from "./interfaces/response-body";
import {IAddMealRequestBody} from "./interfaces/request-body.interface";
import {FoodService} from "../food/food.service";
import {toFixedNumber} from "../../lib/helpers/to-fixed-number";
import {nutrientPerWeight} from "../../lib/helpers/nutrient-per-weight";
import {DailyNutritionEntity} from "./entities/daily-nutrition.entity";
import {INutrition} from "../../apis/fat-secret/interfaces/nutrition.interface";

@Injectable()
export class MealService {
    constructor(
        @InjectRepository(MealEntity)
        private mealRepository: Repository<MealEntity>,
        @InjectRepository(DailyNutritionEntity)
        private dailyNutritionRepository: Repository<DailyNutritionEntity>,
        private foodService: FoodService
    ) {}

    async getMealsByDay(date: number): Promise<IDailyMealResponseBody[]> {
        const {dateStart, dateEnd} = getDayRange(date)

        const dailyMeals = await this.mealRepository.findBy({time: Between(dateStart, dateEnd)})

        return dailyMeals
            .map((meal) => ({
                id: meal.id,
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

        await this.updateDailyNutrition(mealData.time, {
            calories: meal.caloriesPerWeight!,
            protein: meal.proteinPerWeight!,
            fat: meal.fatPerWeight!,
            carbs: meal.carbsPerWeight!,
        })

        await this.mealRepository.save(mealEntity)
    }

    async updateDailyNutrition(dateTimestamp: number, nutrition: INutrition){
        const { dateStart, dateEnd } = getDayRange(dateTimestamp)

        const day = await this.dailyNutritionRepository.findOneBy({date: Between(dateStart, dateEnd)})

        console.log(day)
        console.log(nutrition)

        await this.dailyNutritionRepository.save({
            id: day?.id,
            date: day?.date ?? dateStart,
            calories: (day?.calories ?? 0) + nutrition.calories,
            protein: (day?.protein ?? 0) + nutrition.protein,
            fat: (day?.fat ?? 0) + nutrition.fat,
            carbs: (day?.carbs ?? 0) + nutrition.carbs,
        })
    }

    async getNutrientsByDay(date: number): Promise<IDailyNutritionResponseBody> {
        const day = await this.dailyNutritionRepository.findOneBy({date: new Date(date)})

        return {
            carbs: day?.carbs || 0,
            fat: day?.fat || 0,
            protein: day?.protein || 0,
            calories: day?.calories || 0,
        };
    }
}
