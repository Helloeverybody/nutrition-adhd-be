import {Module} from '@nestjs/common';
import {CalendarController} from './controllers/calendar/calendar.controller';
import {CalendarService} from './controllers/calendar/calendar.service';
import {FoodController} from "./controllers/food/food.controller";
import {FoodService} from "./controllers/food/food.service";

@Module({
    imports: [],
    controllers: [
        CalendarController,
        FoodController
    ],
    providers: [
        CalendarService,
        FoodService
    ],
})
export class AppModule {
}
