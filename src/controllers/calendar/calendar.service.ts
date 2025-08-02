import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Between, Repository} from "typeorm";
import {DailyNutritionEntity} from "./entities/daily-nutrition.entity";
import {DailyMealResponseBody, DailyNutritionResponseBody} from "./interfaces/response-body";
import {MealEntity} from "./entities/meal.entity";
import {getDayRange} from "./helpers/get-day-range";

@Injectable()
export class CalendarService {
    constructor(
        @InjectRepository(DailyNutritionEntity)
        private dailyNutritionReposiory: Repository<DailyNutritionEntity>,
        @InjectRepository(MealEntity)
        private mealRepository: Repository<MealEntity>,
    ) {}

    async getNutrientsByDay(date: number): Promise<DailyNutritionResponseBody> {
        const day = await this.dailyNutritionReposiory.findOneBy({date: new Date(date)})

        return {
            carbs: day?.carbs || 0,
            fat: day?.fat || 0,
            protein: day?.protein || 0,
            calories: day?.calories || 0,
        };
    }

    async getMealsByDay(date: number): Promise<DailyMealResponseBody[]> {
        const {dateStart, dateEnd} = getDayRange(date)

        const dailyMeals = await this.mealRepository.findBy({time: Between(dateStart, dateEnd)})

        return dailyMeals
            .map((meal) => ({
                calories: meal.caloriesPerWeight,
                protein: meal.proteinPerWeight,
                fat: meal.fatPerWeight,
                carbs: meal.carbsPerWeight,
                time: meal.time.toISOString(),
                name: meal.name
            }))
    }
}
