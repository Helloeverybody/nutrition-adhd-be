import {Module} from "@nestjs/common";
import {MealController} from "./meal.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MealService} from "./meal.service";
import {MealEntity} from "./entities/meal.entity";
import {FoodModule} from "../food/food-module";

@Module({
    controllers: [MealController],
    providers: [MealService],
    imports: [
        TypeOrmModule.forFeature([
            MealEntity,
        ]),
        FoodModule
    ]
})
export class MealModule {

}