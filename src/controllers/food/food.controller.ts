import {BadRequestException, Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import { FoodService } from './food.service';
import {IAddFoodRequestBody} from "./interfaces/request-body.interface";

@Controller('/api/food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  getFood(@Query('search') searchString?: string): string {
    return this.foodService.MOCKgetAllFood(searchString);
  }

  @Get('/details/:id')
  getMealsPerDay(@Param('id') id: string): string {
    return this.foodService.MOCKgetFoodDetailsById(+id);
  }

  @Post()
  addFood(@Body() body: IAddFoodRequestBody) {
    if (!body || !body.name || !body.calories || !body.carbs || !body.protein || !body.fat) {
      throw new BadRequestException('Incorrect body')
    }

    this.foodService.addFood(body)
  }

  //TODO MealController
  @Post('/meal')
  addMeal(@Body() body: string): any {
    return { success: true }
  }
}
