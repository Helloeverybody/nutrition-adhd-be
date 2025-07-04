import { Controller, Get, Query } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Controller('/api/daily')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('/nutrients')
  getNutrientsPerDay(@Query('date') date: string): string {
    return this.calendarService.MOCKgetNutrientsByDay(date);
  }

  @Get('/meals')
  getMealsPerDay(@Query('date') date: string): string {
    return this.calendarService.MOCKgetMealsByDay(date);
  }
}
