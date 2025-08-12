import {BadRequestException, Body, Controller, Get, Post, Query} from '@nestjs/common';
import { MealService } from './meal.service';
import {IDailyMealResponseBody} from "./interfaces/response-body";
import {IAddMealRequestBody} from "./interfaces/request-body.interface";

@Controller('api/meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Get()
  async getMealsPerDay(@Query('date') date: string): Promise<IDailyMealResponseBody[]> {
    return this.mealService.getMealsByDay(+date);
  }

  @Post()
  async addMeal(@Body() body: IAddMealRequestBody): Promise<void> {
    if (!body.foodId || !body.weight || body.source === undefined || !body.time) {
      throw new BadRequestException('Incorrect body')
    }

    return this.mealService.addMeal(body)
  }
}
