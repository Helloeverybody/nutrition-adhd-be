import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {FoodController} from "./food.controller";
import {FoodService} from "./food.service";
import {FoodEntity} from "./entities/food.entity";
import {FatSecretApiService} from "../../apis/fat-secret/fat-secret-api.service";
import {FatSecretApiModule} from "../../apis/fat-secret/fat-secret-api.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            FoodEntity
        ]),
        FatSecretApiModule
    ],
    controllers: [FoodController],
    providers: [
        FoodService
    ]
})
export class FoodModule {

}