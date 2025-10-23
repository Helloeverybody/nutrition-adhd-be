import {BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Query} from '@nestjs/common';
import { FoodService } from './food.service';
import {IAddFoodRequestBody} from "./interfaces/request-body.interface";
import {IFoodDetailsResponseBody, IFoodListResponseBody} from "./interfaces/response-body.interface";

@Controller('/api/food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  async getFood(@Query('search') searchString?: string): Promise<IFoodListResponseBody[]> {
    return this.foodService.searchFood(searchString);
  }

  @Get('/:id')
  async getFoodDetails(@Param('id') id: string, @Query('source') source: string): Promise<IFoodDetailsResponseBody> {
    const foodDetails = await this.foodService.getFoodDetails(Number(id), Number(source));

    if (!foodDetails) {
      throw new NotFoundException('Food not found')
    }

    return foodDetails;
  }

  @Post()
  async addFood(@Body() body: IAddFoodRequestBody) {
    if (!body || !body.name || !body.calories || !body.carbs || !body.protein || !body.fat) {
      throw new BadRequestException('Incorrect body')
    }

    return await this.foodService.addFood(body)
  }
}
