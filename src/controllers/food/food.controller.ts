import {BadRequestException, Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import { FoodService } from './food.service';
import {IAddFoodRequestBody} from "./interfaces/request-body.interface";
import {IFoodListResponseBody} from "./interfaces/response-body.interface";

@Controller('/api/food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  async getFood(@Query('search') searchString?: string): Promise<IFoodListResponseBody[]> {
    return this.foodService.searchFood(searchString);
  }

  @Post()
  async addFood(@Body() body: IAddFoodRequestBody) {
    if (!body || !body.name || !body.calories || !body.carbs || !body.protein || !body.fat) {
      throw new BadRequestException('Incorrect body')
    }

    await this.foodService.addFood(body)
  }

  //TODO MealController
  @Post('/meal')
  addMeal(@Body() body: string): any {
    return { success: true }
  }
}
