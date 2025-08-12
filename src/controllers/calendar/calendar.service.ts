import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {DailyNutritionEntity} from "./entities/daily-nutrition.entity";
import {IDailyNutritionResponseBody} from "./interfaces/response-body";

@Injectable()
export class CalendarService {
    constructor(
        @InjectRepository(DailyNutritionEntity)
        private dailyNutritionReposiory: Repository<DailyNutritionEntity>,
    ) {}

    async getNutrientsByDay(date: number): Promise<IDailyNutritionResponseBody> {
        const day = await this.dailyNutritionReposiory.findOneBy({date: new Date(date)})

        return {
            carbs: day?.carbs || 0,
            fat: day?.fat || 0,
            protein: day?.protein || 0,
            calories: day?.calories || 0,
        };
    }
}
