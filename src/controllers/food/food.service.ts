import { Injectable } from '@nestjs/common';
import {food, foodItems} from "./mocks";

@Injectable()
export class FoodService {
  MOCKgetAllFood(): any {
    return food;
  }

  MOCKgetFoodDetailsById(id: number): any {
    return foodItems.find((item) => item.id === id);
  }
}
