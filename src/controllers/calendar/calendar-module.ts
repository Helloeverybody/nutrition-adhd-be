import {Module} from "@nestjs/common";
import {CalendarController} from "./calendar.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CalendarService} from "./calendar.service";
import {MealEntity} from "./entities/meal.entity";
import {DailyNutritionEntity} from "./entities/daily-nutrition.entity";

@Module({
    controllers: [CalendarController],
    providers: [CalendarService],
    imports: [
        TypeOrmModule.forFeature([
            MealEntity,
            DailyNutritionEntity
        ])
    ]
})
export class CalendarModule {

}