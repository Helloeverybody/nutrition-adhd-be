import { Injectable } from '@nestjs/common';
import {meals, nutrientsPerDay} from "./mocks";

@Injectable()
export class CalendarService {
  MOCKgetNutrientsByDay(date: string): any {
    return {
      ...nutrientsPerDay[0],
      date
    };
  }

  MOCKgetMealsByDay(date: string): any {
    return {
      ...meals[0],
      date
    }
  }
}
