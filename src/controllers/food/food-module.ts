import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {FoodController} from "./food.controller";
import {FoodService} from "./food.service";
import {FoodEntity} from "./entities/food.entity";

@Module({
    imports: [TypeOrmModule.forFeature([
        FoodEntity
    ])],
    controllers: [FoodController],
    providers: [FoodService]
})
export class FoodModule {

}