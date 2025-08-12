import {Controller, Get, Query} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import {IDailyNutritionResponseBody} from "./interfaces/response-body";

@Controller('api/daily')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('/nutrients')
  async getNutrientsPerDay(@Query('date') date: string): Promise<IDailyNutritionResponseBody> {
    return this.calendarService.getNutrientsByDay(+date);
  }
}
