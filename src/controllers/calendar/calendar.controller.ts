import {Controller, Get, NotFoundException, Query} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import {DailyMealResponseBody, DailyNutritionResponseBody} from "./interfaces/response-body";
import {checkDateIsValid} from "./validators/check-date-is-valid";

@Controller('api/daily')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('/nutrients')
  async getNutrientsPerDay(@Query('date') date: string): Promise<DailyNutritionResponseBody> {
    return this.calendarService.getNutrientsByDay(+date);
  }

  @Get('/meals')
  async getMealsPerDay(@Query('date') date: string): Promise<DailyMealResponseBody[]> {
    return this.calendarService.getMealsByDay(+date);
  }
}
