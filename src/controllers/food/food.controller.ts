import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import { FoodService } from './food.service';

@Controller('/api/food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  getFood(): string {
    return this.foodService.MOCKgetAllFood();
  }

  @Get('/details/:id')
  getMealsPerDay(@Param('id') id: string): string {
    return this.foodService.MOCKgetFoodDetailsById(+id);
  }

  @Post('/meal')
  addMeal(@Body() body: string): any {
    return { success: true }
  }
}
