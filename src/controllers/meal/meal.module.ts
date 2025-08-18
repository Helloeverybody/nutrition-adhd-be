import {Module} from "@nestjs/common";
import {MealController} from "./meal.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MealService} from "./meal.service";
import {MealEntity} from "./entities/meal.entity";
import {FoodModule} from "../food/food-module";
import {DailyNutritionEntity} from "./entities/daily-nutrition.entity";

@Module({
    controllers: [MealController],
    providers: [MealService],
    imports: [
        TypeOrmModule.forFeature([
            MealEntity,
            DailyNutritionEntity
        ]),
        FoodModule
    ]
})
export class MealModule {

}